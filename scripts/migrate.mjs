#!/usr/bin/env node
/**
 * Migration runner for Universal ERP.
 *
 * Applies SQL files in /supabase/migrations/ in lexicographic order.
 * Tracks applied migrations in `_migrations` table.
 *
 * Connects via DATABASE_URL (self-hosted) or uses Supabase service role
 * via NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, '..', 'supabase', 'migrations');

async function loadEnv() {
  try {
    const envFile = await readFile(join(__dirname, '..', '.env'), 'utf-8');
    for (const line of envFile.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...values] = trimmed.split('=');
      const value = values.join('=').replace(/^['"]|['"]$/g, '');
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env is optional
  }
}

async function getConnection() {
  await loadEnv();

  if (process.env.DATABASE_URL) {
    const pg = await import('pg').catch(() => null);
    if (!pg) {
      console.error('pg module not installed. Run: pnpm add pg @types/pg');
      process.exit(1);
    }
    const client = new pg.default.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    return {
      type: 'pg',
      query: (sql) => client.query(sql),
      end: () => client.end(),
    };
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    return {
      type: 'supabase',
      async query(sql) {
        const response = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sql }),
        });
        if (!response.ok) {
          throw new Error(`Supabase SQL failed: ${response.status} ${await response.text()}`);
        }
        return { rows: await response.json() };
      },
      end: async () => undefined,
    };
  }

  console.error('No database connection configured. Set DATABASE_URL or Supabase env vars.');
  process.exit(1);
}

async function ensureMigrationsTable(conn) {
  await conn.query(`
    create table if not exists public._migrations (
      id serial primary key,
      filename text not null unique,
      hash text not null,
      applied_at timestamptz not null default now()
    );
  `).catch(() => {
    // Table might already exist
  });
}

async function getAppliedMigrations(conn) {
  try {
    const { rows } = await conn.query('select filename, hash from public._migrations order by filename');
    return new Map(rows.map((r) => [r.filename, r.hash]));
  } catch {
    return new Map();
  }
}

async function applyMigration(conn, filename, sql) {
  const hash = createHash('sha256').update(sql).digest('hex');
  console.log(`  Applying ${filename}…`);
  const started = Date.now();
  await conn.query(sql);
  await conn.query(`insert into public._migrations (filename, hash) values ('${filename}', '${hash}')`);
  console.log(`  ✓ Applied in ${Date.now() - started}ms`);
}

async function main() {
  console.log('Universal ERP migration runner');
  console.log('==============================');
  const conn = await getConnection();
  console.log(`Connected via ${conn.type}`);

  try {
    await ensureMigrationsTable(conn);
    const applied = await getAppliedMigrations(conn);

    const files = (await readdir(MIGRATIONS_DIR))
      .filter((f) => f.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} migrations, ${applied.size} already applied.`);

    let count = 0;
    for (const file of files) {
      if (applied.has(file)) {
        console.log(`  ⏭  ${file} (already applied)`);
        continue;
      }
      const sql = await readFile(join(MIGRATIONS_DIR, file), 'utf-8');
      await applyMigration(conn, file, sql);
      count++;
    }

    console.log('==============================');
    console.log(`Done. Applied ${count} new migration${count === 1 ? '' : 's'}.`);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

main();
