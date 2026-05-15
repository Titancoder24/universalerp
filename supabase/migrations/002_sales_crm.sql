-- =============================================================================
-- Universal ERP - Sales / CRM Schema (Migration 002)
-- =============================================================================

-- ============================================================ CUSTOMERS
create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  display_name text not null,
  legal_name text,
  category text default 'standard',
  type text default 'company' check (type in ('company','individual','government','nonprofit')),
  tax_id text,
  vat_number text,
  industry text,
  website text,
  email text,
  phone text,
  primary_address jsonb,
  billing_address jsonb,
  shipping_address jsonb,
  currency text default 'USD',
  payment_terms_days int default 30,
  credit_limit_cents bigint default 0,
  tax_exempt boolean default false,
  tax_code text,
  sales_rep_id uuid references public.user_profiles(id) on delete set null,
  account_owner_id uuid references public.user_profiles(id) on delete set null,
  portal_enabled boolean default false,
  loyalty_tier text default 'bronze',
  loyalty_points int default 0,
  total_revenue_cents bigint default 0,
  notes text,
  tags text[] default array[]::text[],
  custom_fields jsonb default '{}'::jsonb,
  active boolean default true,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create index customers_tenant_idx on public.customers (tenant_id);
create index customers_name_trgm on public.customers using gin (display_name gin_trgm_ops);
create index customers_email_idx on public.customers (lower(email)) where email is not null;
create trigger trg_customers_updated_at before update on public.customers
  for each row execute function public.tg_set_updated_at();

-- ============================================================ CONTACTS
create table public.contacts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete cascade,
  vendor_id uuid,
  first_name text,
  last_name text,
  full_name text generated always as (trim(coalesce(first_name,'') || ' ' || coalesce(last_name,''))) stored,
  title text,
  department text,
  email text,
  phone text,
  mobile text,
  is_primary boolean default false,
  decision_role text check (decision_role in ('champion','decision_maker','influencer','blocker','user') or decision_role is null),
  linkedin_url text,
  notes text,
  custom_fields jsonb default '{}'::jsonb,
  user_id uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index contacts_tenant_idx on public.contacts (tenant_id);
create index contacts_customer_idx on public.contacts (customer_id);
create index contacts_email_idx on public.contacts (lower(email)) where email is not null;
create trigger trg_contacts_updated_at before update on public.contacts
  for each row execute function public.tg_set_updated_at();

-- ============================================================ LEADS
create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  first_name text,
  last_name text,
  company_name text,
  title text,
  email text,
  phone text,
  source text default 'manual',
  status text default 'new' check (status in ('new','contacted','qualified','unqualified','converted','lost')),
  score int default 0,
  estimated_value_cents bigint default 0,
  owner_id uuid references public.user_profiles(id) on delete set null,
  converted_customer_id uuid references public.customers(id) on delete set null,
  converted_opportunity_id uuid,
  notes text,
  tags text[] default array[]::text[],
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index leads_tenant_idx on public.leads (tenant_id);
create index leads_status_idx on public.leads (tenant_id, status);
create index leads_owner_idx on public.leads (owner_id);
create trigger trg_leads_updated_at before update on public.leads
  for each row execute function public.tg_set_updated_at();

-- ============================================================ PIPELINES & STAGES
create table public.pipelines (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  code text not null,
  description text,
  is_default boolean default false,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create trigger trg_pipelines_updated_at before update on public.pipelines
  for each row execute function public.tg_set_updated_at();

create table public.pipeline_stages (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  pipeline_id uuid not null references public.pipelines(id) on delete cascade,
  code text not null,
  name text not null,
  probability int default 50 check (probability between 0 and 100),
  color text default '#6366f1',
  is_won boolean default false,
  is_lost boolean default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index pipeline_stages_pipeline_idx on public.pipeline_stages (pipeline_id, sort_order);

-- ============================================================ OPPORTUNITIES
create table public.opportunities (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text,
  name text not null,
  customer_id uuid references public.customers(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  pipeline_id uuid references public.pipelines(id) on delete set null,
  stage_id uuid references public.pipeline_stages(id) on delete set null,
  value_cents bigint default 0,
  currency text default 'USD',
  probability int default 50,
  expected_close_date date,
  actual_close_date date,
  source text,
  status text default 'open' check (status in ('open','won','lost')),
  owner_id uuid references public.user_profiles(id) on delete set null,
  description text,
  loss_reason text,
  competitors text[],
  tags text[] default array[]::text[],
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index opportunities_tenant_idx on public.opportunities (tenant_id);
create index opportunities_customer_idx on public.opportunities (customer_id);
create index opportunities_pipeline_idx on public.opportunities (pipeline_id, stage_id);
create index opportunities_owner_idx on public.opportunities (owner_id);
create trigger trg_opportunities_updated_at before update on public.opportunities
  for each row execute function public.tg_set_updated_at();

alter table public.leads
  add constraint leads_opportunity_fk foreign key (converted_opportunity_id) references public.opportunities(id) on delete set null;

-- ============================================================ ACTIVITIES
create table public.activities (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  type text not null check (type in ('call','meeting','email','task','note','sms','demo')),
  subject text not null,
  description text,
  start_at timestamptz,
  end_at timestamptz,
  duration_minutes int,
  outcome text,
  owner_id uuid references public.user_profiles(id) on delete set null,
  related_type text,
  related_id uuid,
  customer_id uuid references public.customers(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  status text default 'pending' check (status in ('pending','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index activities_tenant_idx on public.activities (tenant_id);
create index activities_owner_idx on public.activities (owner_id, start_at);
create index activities_related_idx on public.activities (related_type, related_id);
create trigger trg_activities_updated_at before update on public.activities
  for each row execute function public.tg_set_updated_at();

-- ============================================================ TAX CODES
create table public.tax_codes (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  rate_pct numeric(6,3) not null default 0,
  compound boolean default false,
  is_inclusive boolean default false,
  jurisdiction text,
  account_id uuid,
  active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create trigger trg_tax_codes_updated_at before update on public.tax_codes
  for each row execute function public.tg_set_updated_at();

-- ============================================================ QUOTATIONS
create table public.quotations (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  version int default 1,
  parent_quotation_id uuid references public.quotations(id) on delete set null,
  customer_id uuid not null references public.customers(id) on delete restrict,
  contact_id uuid references public.contacts(id) on delete set null,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  issue_date date not null default current_date,
  valid_until date,
  currency text default 'USD',
  exchange_rate numeric(18,8) default 1,
  subtotal_cents bigint default 0,
  discount_cents bigint default 0,
  tax_cents bigint default 0,
  shipping_cents bigint default 0,
  total_cents bigint default 0,
  status text default 'draft' check (status in ('draft','sent','viewed','accepted','rejected','expired','revised')),
  notes text,
  terms text,
  payment_terms text,
  delivery_terms text,
  owner_id uuid references public.user_profiles(id) on delete set null,
  signed_at timestamptz,
  signed_by_name text,
  signature_data jsonb,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create index quotations_tenant_idx on public.quotations (tenant_id);
create index quotations_customer_idx on public.quotations (customer_id);
create index quotations_status_idx on public.quotations (tenant_id, status);
create trigger trg_quotations_updated_at before update on public.quotations
  for each row execute function public.tg_set_updated_at();

create table public.quotation_lines (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  quotation_id uuid not null references public.quotations(id) on delete cascade,
  sort_order int not null default 0,
  item_id uuid,
  item_code text,
  description text not null,
  quantity numeric(18,4) not null default 1,
  unit text default 'each',
  unit_price_cents bigint not null default 0,
  discount_pct numeric(6,3) default 0,
  discount_cents bigint default 0,
  tax_code_id uuid references public.tax_codes(id) on delete set null,
  tax_rate_pct numeric(6,3) default 0,
  tax_cents bigint default 0,
  total_cents bigint default 0,
  created_at timestamptz not null default now()
);
create index quotation_lines_quotation_idx on public.quotation_lines (quotation_id);

-- ============================================================ SALES ORDERS
create table public.sales_orders (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  customer_id uuid not null references public.customers(id) on delete restrict,
  contact_id uuid references public.contacts(id) on delete set null,
  quotation_id uuid references public.quotations(id) on delete set null,
  order_date date not null default current_date,
  delivery_date date,
  currency text default 'USD',
  subtotal_cents bigint default 0,
  discount_cents bigint default 0,
  tax_cents bigint default 0,
  shipping_cents bigint default 0,
  total_cents bigint default 0,
  status text default 'confirmed' check (status in ('draft','confirmed','in_production','partial','shipped','delivered','invoiced','cancelled')),
  delivery_status text default 'pending' check (delivery_status in ('pending','partial','complete','cancelled')),
  invoice_status text default 'pending' check (invoice_status in ('pending','partial','complete')),
  shipping_address jsonb,
  billing_address jsonb,
  payment_terms text,
  delivery_terms text,
  notes text,
  owner_id uuid references public.user_profiles(id) on delete set null,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create index sales_orders_tenant_idx on public.sales_orders (tenant_id);
create index sales_orders_customer_idx on public.sales_orders (customer_id);
create index sales_orders_status_idx on public.sales_orders (tenant_id, status);
create trigger trg_sales_orders_updated_at before update on public.sales_orders
  for each row execute function public.tg_set_updated_at();

create table public.sales_order_lines (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  order_id uuid not null references public.sales_orders(id) on delete cascade,
  sort_order int not null default 0,
  item_id uuid,
  item_code text,
  description text not null,
  quantity numeric(18,4) not null default 1,
  unit text default 'each',
  delivered_qty numeric(18,4) default 0,
  invoiced_qty numeric(18,4) default 0,
  unit_price_cents bigint not null default 0,
  discount_pct numeric(6,3) default 0,
  discount_cents bigint default 0,
  tax_code_id uuid references public.tax_codes(id) on delete set null,
  tax_rate_pct numeric(6,3) default 0,
  tax_cents bigint default 0,
  total_cents bigint default 0,
  warehouse_id uuid,
  created_at timestamptz not null default now()
);
create index sales_order_lines_order_idx on public.sales_order_lines (order_id);

-- ============================================================ INVOICES
create table public.invoices (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  customer_id uuid not null references public.customers(id) on delete restrict,
  contact_id uuid references public.contacts(id) on delete set null,
  sales_order_id uuid references public.sales_orders(id) on delete set null,
  project_id uuid,
  issue_date date not null default current_date,
  due_date date,
  service_period_start date,
  service_period_end date,
  currency text default 'USD',
  exchange_rate numeric(18,8) default 1,
  subtotal_cents bigint default 0,
  discount_cents bigint default 0,
  tax_cents bigint default 0,
  shipping_cents bigint default 0,
  total_cents bigint default 0,
  paid_cents bigint default 0,
  balance_cents bigint default 0,
  status text default 'draft' check (status in ('draft','sent','viewed','partial','paid','overdue','cancelled','refunded')),
  recurring_schedule_id uuid,
  is_recurring boolean default false,
  payment_terms text,
  notes text,
  internal_notes text,
  bank_details text,
  pdf_url text,
  owner_id uuid references public.user_profiles(id) on delete set null,
  sent_at timestamptz,
  viewed_at timestamptz,
  paid_at timestamptz,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create index invoices_tenant_idx on public.invoices (tenant_id);
create index invoices_customer_idx on public.invoices (customer_id);
create index invoices_status_idx on public.invoices (tenant_id, status);
create index invoices_due_idx on public.invoices (tenant_id, due_date) where status in ('sent','viewed','partial','overdue');
create trigger trg_invoices_updated_at before update on public.invoices
  for each row execute function public.tg_set_updated_at();

create table public.invoice_lines (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  sort_order int not null default 0,
  item_id uuid,
  item_code text,
  description text not null,
  quantity numeric(18,4) not null default 1,
  unit text default 'each',
  unit_price_cents bigint not null default 0,
  discount_pct numeric(6,3) default 0,
  discount_cents bigint default 0,
  tax_code_id uuid references public.tax_codes(id) on delete set null,
  tax_rate_pct numeric(6,3) default 0,
  tax_cents bigint default 0,
  total_cents bigint default 0,
  account_id uuid,
  created_at timestamptz not null default now()
);
create index invoice_lines_invoice_idx on public.invoice_lines (invoice_id);

-- ============================================================ PAYMENTS
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text,
  direction text not null check (direction in ('inbound','outbound')),
  payment_date date not null default current_date,
  customer_id uuid references public.customers(id) on delete set null,
  vendor_id uuid,
  amount_cents bigint not null,
  currency text default 'USD',
  exchange_rate numeric(18,8) default 1,
  method text default 'bank_transfer' check (method in ('cash','check','bank_transfer','card','wire','wallet','other')),
  reference text,
  bank_account_id uuid,
  notes text,
  status text default 'completed' check (status in ('pending','completed','failed','refunded')),
  recorded_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index payments_tenant_idx on public.payments (tenant_id);
create trigger trg_payments_updated_at before update on public.payments
  for each row execute function public.tg_set_updated_at();

create table public.payment_applications (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  payment_id uuid not null references public.payments(id) on delete cascade,
  invoice_id uuid references public.invoices(id) on delete set null,
  bill_id uuid,
  amount_cents bigint not null,
  created_at timestamptz not null default now()
);
create index payment_apps_payment_idx on public.payment_applications (payment_id);

-- ============================================================ CREDIT NOTES
create table public.credit_notes (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  customer_id uuid not null references public.customers(id) on delete restrict,
  invoice_id uuid references public.invoices(id) on delete set null,
  issue_date date not null default current_date,
  amount_cents bigint not null,
  remaining_cents bigint not null,
  reason text,
  status text default 'open' check (status in ('open','applied','cancelled')),
  currency text default 'USD',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create trigger trg_credit_notes_updated_at before update on public.credit_notes
  for each row execute function public.tg_set_updated_at();

-- ============================================================ RLS
alter table public.customers enable row level security;
alter table public.contacts enable row level security;
alter table public.leads enable row level security;
alter table public.pipelines enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.opportunities enable row level security;
alter table public.activities enable row level security;
alter table public.tax_codes enable row level security;
alter table public.quotations enable row level security;
alter table public.quotation_lines enable row level security;
alter table public.sales_orders enable row level security;
alter table public.sales_order_lines enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_lines enable row level security;
alter table public.payments enable row level security;
alter table public.payment_applications enable row level security;
alter table public.credit_notes enable row level security;

create policy customers_rw on public.customers for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy contacts_rw on public.contacts for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy leads_rw on public.leads for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy pipelines_rw on public.pipelines for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy pipeline_stages_rw on public.pipeline_stages for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy opportunities_rw on public.opportunities for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy activities_rw on public.activities for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy tax_codes_rw on public.tax_codes for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy quotations_rw on public.quotations for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy quotation_lines_rw on public.quotation_lines for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy sales_orders_rw on public.sales_orders for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy sales_order_lines_rw on public.sales_order_lines for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy invoices_rw on public.invoices for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy invoice_lines_rw on public.invoice_lines for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy payments_rw on public.payments for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy payment_applications_rw on public.payment_applications for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy credit_notes_rw on public.credit_notes for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
