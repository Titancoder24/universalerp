import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database/types';

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'public-anon-key';
  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as CookieOptions);
          });
        } catch {
          // Server Component contexts cannot set cookies; ignore.
        }
      },
    },
  });
}

export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY missing. Server-side admin operations require it.');
  }
  return createServerClient<Database>(url, serviceKey, {
    cookies: { getAll: () => [], setAll: () => undefined },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
