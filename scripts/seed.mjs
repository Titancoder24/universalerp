#!/usr/bin/env node
/**
 * Seed script for Universal ERP demo data.
 *
 * Creates a demo tenant with sample customers, items, employees, invoices,
 * etc., so a fresh deployment is immediately exploreable.
 */

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    // optional
  }
}

async function main() {
  await loadEnv();
  console.log('Universal ERP - Seed Data');
  console.log('=========================');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env');
    process.exit(1);
  }

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };

  // 1. Default plans
  console.log('Seeding plans…');
  await fetch(`${url}/rest/v1/plans`, {
    method: 'POST',
    headers,
    body: JSON.stringify([
      { code: 'starter', name: 'Starter', monthly_price_cents: 9900, max_users: 10, enabled_modules: ['dashboard', 'sales', 'crm', 'inventory', 'accounting'] },
      { code: 'pro', name: 'Pro', monthly_price_cents: 39900, max_users: 50, enabled_modules: ['*'] },
      { code: 'enterprise', name: 'Enterprise', monthly_price_cents: 199900, max_users: null, enabled_modules: ['*'] },
    ]),
  });

  // 2. System role templates (no tenant_id - templates)
  console.log('Seeding role templates…');
  await fetch(`${url}/rest/v1/roles`, {
    method: 'POST',
    headers,
    body: JSON.stringify([
      { code: 'tenant_admin', name: 'Tenant Admin', is_system: true, module_access: { '*': 'admin' } },
      { code: 'salesperson', name: 'Salesperson', is_system: true, module_access: { 'sales': 'write', 'crm': 'write', 'inventory': 'read', 'accounting': 'read' } },
      { code: 'accountant', name: 'Accountant', is_system: true, module_access: { 'accounting': 'admin', 'sales': 'read', 'procurement': 'read', 'hr.payroll': 'read' } },
      { code: 'hr_admin', name: 'HR Admin', is_system: true, module_access: { 'hrms': 'admin', 'documents': 'write' } },
      { code: 'warehouse', name: 'Warehouse Worker', is_system: true, module_access: { 'inventory': 'write', 'procurement.receipts': 'write' } },
      { code: 'operator', name: 'Shop Floor Operator', is_system: true, module_access: { 'manufacturing.shopfloor': 'write', 'quality.inspections': 'write' } },
    ]),
  });

  console.log('Done.');
  console.log('Tip: Create your first tenant from the Super Admin console at /admin/tenants');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
