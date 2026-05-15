import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { AppShell } from '@/components/app-shell/app-shell';
import { TenantProvider } from '@/components/providers/tenant-provider';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // In dev mode without Supabase configured, allow access with a mock session
  // so the UI can be explored. Production redirects unauthenticated users.
  const mockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!session && !mockMode) {
    redirect('/login');
  }

  const initial = session
    ? {
        tenant: session.tenant,
        user: session.user,
        membership: session.membership,
        tenants: session.tenants,
        isLoading: false,
        isSuperAdmin: session.isSuperAdmin,
      }
    : {
        tenant: {
          id: 'demo',
          slug: 'demo',
          name: 'Demo Workspace',
          legal_name: null,
          status: 'trial' as const,
          plan_id: null,
          parent_reseller_id: null,
          industry: 'Software',
          country_code: 'US',
          default_currency: 'USD',
          default_locale: 'en',
          default_timezone: 'UTC',
          fiscal_year_start_month: 1,
          logo_url: null,
          favicon_url: null,
          brand_color: null,
          theme_preset_id: 'stripe-clean',
          icon_family_id: 'lucide',
          sidebar_layout: 'left-fixed',
          density: 'standard' as const,
          font_sans: 'Inter',
          font_serif: 'Lora',
          font_mono: 'JetBrains Mono',
          font_display: 'Inter',
          custom_tokens: {},
          feature_flags: {},
          enabled_modules: [
            'dashboard', 'inbox', 'calendar', 'sales', 'sales.customers', 'sales.quotations',
            'sales.orders', 'sales.invoices', 'sales.credit_notes', 'sales.pos',
            'crm', 'crm.leads', 'crm.opportunities', 'crm.accounts', 'crm.contacts', 'crm.activities',
            'marketing', 'marketing.campaigns', 'marketing.loyalty',
            'hrms', 'hrms.employees', 'hrms.attendance', 'hrms.leave', 'hrms.payroll', 'hrms.expenses',
            'hrms.recruitment', 'hrms.performance', 'hrms.learning',
            'inventory', 'inventory.items', 'inventory.warehouses', 'inventory.stock', 'inventory.movements',
            'procurement', 'procurement.vendors', 'procurement.orders', 'procurement.bills',
            'manufacturing', 'manufacturing.bom', 'manufacturing.work_orders', 'manufacturing.shopfloor',
            'accounting', 'accounting.coa', 'accounting.journal', 'accounting.ar', 'accounting.ap',
            'accounting.bank', 'accounting.reports',
            'projects', 'projects.tasks', 'projects.time',
            'quality', 'quality.inspections', 'quality.ncr', 'quality.capa',
            'assets', 'assets.maintenance',
            'service', 'service.tickets', 'service.kb',
            'chat', 'chat.announcements', 'chat.calls',
            'reports', 'reports.dashboards', 'reports.builder',
            'documents', 'workflow', 'ai', 'integrations', 'audit_log',
            'settings', 'settings.users', 'settings.appearance',
          ],
          ai_provider: 'openrouter',
          ai_default_model: 'anthropic/claude-haiku-4-5',
          ai_monthly_budget_cents: 10000,
          data_residency: 'us',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any,
        user: {
          id: 'demo-user',
          email: 'demo@universalerp.app',
          full_name: 'Demo User',
          first_name: 'Demo',
          last_name: 'User',
          display_name: 'Demo',
          avatar_url: null,
          phone: null,
          locale: 'en',
          timezone: 'UTC',
          date_format: 'YYYY-MM-DD',
          time_format: '24h',
          status: 'active' as const,
          is_super_admin: false,
          last_login_at: null,
          last_seen_at: null,
          mfa_enabled: false,
          notification_prefs: {},
          theme_override: null,
          density_override: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any,
        membership: {
          id: 'demo-membership',
          tenant_id: 'demo',
          user_id: 'demo-user',
          role: 'tenant_admin' as const,
          title: 'Founder',
          department_id: null,
          branch_id: null,
          manager_user_id: null,
          status: 'active' as const,
          module_access: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any,
        tenants: [] as any,
        isLoading: false,
        isSuperAdmin: false,
      };

  return (
    <TenantProvider initial={initial}>
      <AppShell>{children}</AppShell>
    </TenantProvider>
  );
}
