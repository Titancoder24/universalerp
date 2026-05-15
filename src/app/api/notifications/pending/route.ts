import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ notifications: [] });

  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', session.user.id)
    .is('read_at', null)
    .order('created_at', { ascending: false })
    .limit(10);

  return NextResponse.json({ notifications: data ?? [] });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const supabase = await getSupabaseServerClient();

  await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', session.user.id)
    .in('id', body.ids ?? []);

  return NextResponse.json({ success: true });
}
