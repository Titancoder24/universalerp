import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/database/types';

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    // Stub in dev so the app boots without env vars; queries will fail until configured.
    console.warn('Supabase env vars missing. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  browserClient = createBrowserClient<Database>(
    url ?? 'http://localhost:54321',
    key ?? 'public-anon-key',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      db: { schema: 'public' },
      realtime: { params: { eventsPerSecond: 10 } },
    },
  );
  return browserClient;
}
