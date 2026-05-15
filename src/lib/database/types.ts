/**
 * Database types - hand-curated.
 *
 * In a typical Supabase project, you'd generate these via `supabase gen types
 * typescript --project-id ... > types.ts`. For maintainability we hand-curate
 * the shapes we use, and the queries cast through these types.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type DocStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'rejected'
  | 'paid'
  | 'partial'
  | 'overdue'
  | 'cancelled'
  | 'expired'
  | 'confirmed'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'invoiced'
  | 'received'
  | 'closed'
  | 'refunded'
  | 'open'
  | 'won'
  | 'lost';

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  legal_name: string | null;
  status: 'active' | 'suspended' | 'trial' | 'archived';
  plan_id: string | null;
  parent_reseller_id: string | null;
  industry: string | null;
  country_code: string;
  default_currency: string;
  default_locale: string;
  default_timezone: string;
  fiscal_year_start_month: number;
  logo_url: string | null;
  favicon_url: string | null;
  brand_color: string | null;
  theme_preset_id: string;
  icon_family_id: string;
  sidebar_layout: string;
  density: 'compact' | 'standard' | 'cozy';
  font_sans: string;
  font_serif: string;
  font_mono: string;
  font_display: string;
  custom_tokens: Json;
  feature_flags: Json;
  enabled_modules: string[];
  ai_provider: string;
  ai_default_model: string;
  ai_monthly_budget_cents: number;
  data_residency: string;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  code: string;
  name: string;
  description: string | null;
  monthly_price_cents: number;
  annual_price_cents: number;
  one_time_price_cents: number;
  max_users: number | null;
  max_storage_gb: number | null;
  max_records: number | null;
  ai_budget_cents: number;
  enabled_modules: string[];
  features: Json;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  locale: string;
  timezone: string;
  date_format: string;
  time_format: string;
  status: 'active' | 'disabled' | 'pending' | 'archived';
  is_super_admin: boolean;
  last_login_at: string | null;
  last_seen_at: string | null;
  mfa_enabled: boolean;
  notification_prefs: Json;
  theme_override: string | null;
  density_override: string | null;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  tenant_id: string;
  user_id: string;
  role: 'super_admin' | 'tenant_admin' | 'employee' | 'customer' | 'vendor' | 'reseller_admin';
  title: string | null;
  department_id: string | null;
  branch_id: string | null;
  manager_user_id: string | null;
  status: 'active' | 'disabled' | 'pending';
  module_access: Record<string, 'none' | 'read' | 'write' | 'approve' | 'admin'>;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  tenant_id: string;
  code: string;
  display_name: string;
  legal_name: string | null;
  category: string | null;
  type: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  primary_address: Json;
  billing_address: Json;
  shipping_address: Json;
  currency: string;
  payment_terms_days: number;
  credit_limit_cents: number;
  sales_rep_id: string | null;
  loyalty_tier: string;
  loyalty_points: number;
  total_revenue_cents: number;
  portal_enabled: boolean;
  notes: string | null;
  tags: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  tenant_id: string;
  number: string;
  customer_id: string;
  contact_id: string | null;
  sales_order_id: string | null;
  project_id: string | null;
  issue_date: string;
  due_date: string | null;
  currency: string;
  subtotal_cents: number;
  discount_cents: number;
  tax_cents: number;
  shipping_cents: number;
  total_cents: number;
  paid_cents: number;
  balance_cents: number;
  status: DocStatus;
  notes: string | null;
  internal_notes: string | null;
  pdf_url: string | null;
  owner_id: string | null;
  sent_at: string | null;
  viewed_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      tenants: { Row: Tenant; Insert: Partial<Tenant>; Update: Partial<Tenant> };
      plans: { Row: Plan; Insert: Partial<Plan>; Update: Partial<Plan> };
      user_profiles: { Row: UserProfile; Insert: Partial<UserProfile>; Update: Partial<UserProfile> };
      memberships: { Row: Membership; Insert: Partial<Membership>; Update: Partial<Membership> };
      customers: { Row: Customer; Insert: Partial<Customer>; Update: Partial<Customer> };
      invoices: { Row: Invoice; Insert: Partial<Invoice>; Update: Partial<Invoice> };
      // Rest of tables are loose-typed via `any` for flexibility - we add
      // strict types as modules are built out.
      [key: string]: { Row: any; Insert: any; Update: any };
    };
    Views: { [key: string]: { Row: any } };
    Functions: { [key: string]: any };
    Enums: { [key: string]: string };
  };
}
