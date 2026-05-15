'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient, getSupabaseAdminClient } from '@/lib/supabase/server';
import { requireSession, requireSuperAdmin } from '@/lib/auth/session';
import { defaultEnabledModules } from '@/lib/modules/registry';
import { slug } from '@/lib/utils';

export interface CreateTenantInput {
  name: string;
  adminEmail: string;
  planCode?: string;
  industry?: string;
  countryCode?: string;
  dataResidency?: string;
}

/**
 * Super Admin: Create a new tenant. Creates the tenant record, seeds default
 * modules, and creates the admin membership.
 */
export async function createTenant(input: CreateTenantInput) {
  await requireSuperAdmin();
  const admin = getSupabaseAdminClient();

  const { data: plan } = await admin
    .from('plans')
    .select('id')
    .eq('code', input.planCode ?? 'starter')
    .single();

  const tenantSlug = slug(input.name);

  const { data: tenant, error: tenantError } = await admin
    .from('tenants')
    .insert({
      slug: tenantSlug,
      name: input.name,
      plan_id: plan?.id,
      industry: input.industry,
      country_code: input.countryCode ?? 'US',
      data_residency: input.dataResidency ?? 'us',
      enabled_modules: defaultEnabledModules(),
      status: 'trial',
    })
    .select()
    .single();
  if (tenantError) throw new Error(tenantError.message);

  // Invite admin user via magic link
  const { data: invite } = await admin.auth.admin.inviteUserByEmail(input.adminEmail, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/welcome`,
    data: {
      tenant_id: tenant.id,
      role: 'tenant_admin',
      full_name: input.adminEmail.split('@')[0],
    },
  });

  if (invite?.user) {
    await admin.from('user_profiles').upsert({
      id: invite.user.id,
      email: input.adminEmail,
    });
    await admin.from('memberships').insert({
      tenant_id: tenant.id,
      user_id: invite.user.id,
      role: 'tenant_admin',
      status: 'pending',
      invited_at: new Date().toISOString(),
    });
  }

  revalidatePath('/admin/tenants');
  return tenant;
}

/**
 * Update a tenant. Tenant admins can update their own tenant; super admins
 * can update any.
 */
export async function updateTenant(tenantId: string, updates: Partial<{
  name: string;
  industry: string;
  default_currency: string;
  default_timezone: string;
  theme_preset_id: string;
  icon_family_id: string;
  density: 'compact' | 'standard' | 'cozy';
  enabled_modules: string[];
}>) {
  await requireSession();
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from('tenants').update(updates).eq('id', tenantId);
  if (error) throw new Error(error.message);
  revalidatePath('/app/settings');
  revalidatePath('/app');
}

/**
 * Invite a user to the current tenant.
 */
export async function inviteUser(input: {
  email: string;
  fullName?: string;
  role?: 'tenant_admin' | 'employee';
  moduleAccess?: Record<string, 'none' | 'read' | 'write' | 'approve' | 'admin'>;
  department?: string;
}): Promise<{ magicLink: string }> {
  const session = await requireSession();
  const admin = getSupabaseAdminClient();

  const { data: invite, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: input.email,
    options: {
      data: {
        full_name: input.fullName,
        tenant_id: session.tenant.id,
        invited_by: session.user.id,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/welcome`,
    },
  });
  if (error) throw new Error(error.message);

  if (invite.user) {
    await admin.from('user_profiles').upsert({
      id: invite.user.id,
      email: input.email,
      full_name: input.fullName ?? null,
    });
    await admin.from('memberships').insert({
      tenant_id: session.tenant.id,
      user_id: invite.user.id,
      role: input.role ?? 'employee',
      status: 'pending',
      invited_at: new Date().toISOString(),
      module_access: input.moduleAccess ?? {},
    });
  }

  return { magicLink: invite.properties?.action_link ?? '' };
}
