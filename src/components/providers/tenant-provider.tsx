'use client';

import * as React from 'react';
import type { Tenant, UserProfile, Membership } from '@/lib/database/types';

export interface TenantSession {
  tenant: Tenant | null;
  user: UserProfile | null;
  membership: Membership | null;
  tenants: Tenant[]; // For users with multiple tenants
  isLoading: boolean;
  isSuperAdmin: boolean;
}

const TenantContext = React.createContext<TenantSession | null>(null);

export function TenantProvider({
  initial,
  children,
}: {
  initial: TenantSession;
  children: React.ReactNode;
}) {
  const [session] = React.useState<TenantSession>(initial);
  return <TenantContext.Provider value={session}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const ctx = React.useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
}

export function useCurrentTenant(): Tenant {
  const { tenant } = useTenant();
  if (!tenant) throw new Error('No active tenant. Are you in app routes?');
  return tenant;
}
