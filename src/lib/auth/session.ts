import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { Tenant, UserProfile, Membership } from '@/lib/database/types';

export interface AuthenticatedSession {
  user: UserProfile;
  tenant: Tenant;
  membership: Membership;
  tenants: Tenant[];
  isSuperAdmin: boolean;
}

export const getSession = cache(async (): Promise<AuthenticatedSession | null> => {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (!profile) return null;

  const { data: memberships } = await supabase
    .from('memberships')
    .select('*, tenant:tenants(*)')
    .eq('user_id', authUser.id)
    .eq('status', 'active');

  const tenants: Tenant[] = (memberships ?? []).map((m: any) => m.tenant).filter(Boolean);
  const primary = tenants[0];
  const primaryMembership: Membership = (memberships ?? [])[0] as any;

  if (!primary) {
    // User is authenticated but has no memberships. Send to onboarding.
    return null;
  }

  return {
    user: profile as UserProfile,
    tenant: primary,
    membership: primaryMembership,
    tenants,
    isSuperAdmin: profile.is_super_admin,
  };
});

export async function requireSession(): Promise<AuthenticatedSession> {
  const session = await getSession();
  if (!session) redirect('/login');
  return session;
}

export async function requireSuperAdmin(): Promise<AuthenticatedSession> {
  const session = await requireSession();
  if (!session.isSuperAdmin) redirect('/app');
  return session;
}
