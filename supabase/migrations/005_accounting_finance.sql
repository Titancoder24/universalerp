-- =============================================================================
-- Universal ERP - Accounting / Finance Schema (Migration 005)
-- =============================================================================
-- Full double-entry accounting: COA, journal entries, periods, bank accounts,
-- bank transactions, fixed assets, depreciation, budgets, exchange rates.

-- ============================================================ CHART OF ACCOUNTS
create table public.chart_of_accounts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  type text not null check (type in ('asset','liability','equity','revenue','expense','cogs')),
  parent_id uuid references public.chart_of_accounts(id) on delete set null,
  normal_balance text not null default 'debit' check (normal_balance in ('debit','credit')),
  level int not null default 1,
  account_class text,
  is_active boolean default true,
  is_group boolean default false,
  currency text default 'USD',
  country_code text,
  system_account_type text,
  description text,
  custom_fields jsonb default '{}'::jsonb,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create index chart_of_accounts_tenant_idx on public.chart_of_accounts (tenant_id);
create index chart_of_accounts_parent_idx on public.chart_of_accounts (parent_id);
create index chart_of_accounts_type_idx on public.chart_of_accounts (tenant_id, type);
create index chart_of_accounts_system_idx on public.chart_of_accounts (tenant_id, system_account_type) where system_account_type is not null;
create trigger trg_chart_of_accounts_updated_at before update on public.chart_of_accounts
  for each row execute function public.tg_set_updated_at();

-- Now that COA exists, hook tax_codes.account_id and invoice_lines.account_id to it.
alter table public.tax_codes
  add constraint tax_codes_account_fk foreign key (account_id) references public.chart_of_accounts(id) on delete set null;
alter table public.invoice_lines
  add constraint invoice_lines_account_fk foreign key (account_id) references public.chart_of_accounts(id) on delete set null;

-- ============================================================ ACCOUNTING PERIODS
create table public.accounting_periods (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  year int not null,
  period_number int not null check (period_number between 1 and 13),
  name text,
  start_date date not null,
  end_date date not null,
  status text not null default 'open' check (status in ('open','closed','locked')),
  closed_by uuid references public.user_profiles(id) on delete set null,
  closed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, year, period_number),
  check (end_date >= start_date)
);
create index accounting_periods_tenant_idx on public.accounting_periods (tenant_id);
create index accounting_periods_range_idx on public.accounting_periods (tenant_id, start_date, end_date);
create index accounting_periods_status_idx on public.accounting_periods (tenant_id, status);
create trigger trg_accounting_periods_updated_at before update on public.accounting_periods
  for each row execute function public.tg_set_updated_at();

-- ============================================================ JOURNAL ENTRIES
create table public.journal_entries (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  posting_date date not null default current_date,
  reference text,
  source_type text,
  source_id uuid,
  period_id uuid references public.accounting_periods(id) on delete set null,
  currency text default 'USD',
  exchange_rate numeric(18,8) default 1,
  total_debit_cents bigint not null default 0,
  total_credit_cents bigint not null default 0,
  status text not null default 'draft' check (status in ('draft','posted','reversed')),
  posted_by uuid references public.user_profiles(id) on delete set null,
  posted_at timestamptz,
  reversed_entry_id uuid references public.journal_entries(id) on delete set null,
  reversal_of_id uuid references public.journal_entries(id) on delete set null,
  notes text,
  attachments jsonb default '[]'::jsonb,
  custom_fields jsonb default '{}'::jsonb,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create index journal_entries_tenant_idx on public.journal_entries (tenant_id);
create index journal_entries_posting_idx on public.journal_entries (tenant_id, posting_date);
create index journal_entries_status_idx on public.journal_entries (tenant_id, status);
create index journal_entries_source_idx on public.journal_entries (source_type, source_id);
create index journal_entries_period_idx on public.journal_entries (period_id);
create trigger trg_journal_entries_updated_at before update on public.journal_entries
  for each row execute function public.tg_set_updated_at();

-- ============================================================ JOURNAL ENTRY LINES
create table public.journal_entry_lines (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  entry_id uuid not null references public.journal_entries(id) on delete cascade,
  sort_order int not null default 0,
  account_id uuid not null references public.chart_of_accounts(id) on delete restrict,
  debit_cents bigint not null default 0,
  credit_cents bigint not null default 0,
  net_cents bigint generated always as (debit_cents - credit_cents) stored,
  currency text default 'USD',
  exchange_rate numeric(18,8) default 1,
  description text,
  reference text,
  dimension1 jsonb,
  dimension2 jsonb,
  dimension3 jsonb,
  customer_id uuid references public.customers(id) on delete set null,
  vendor_id uuid,
  employee_id uuid,
  project_id uuid,
  department_id uuid references public.departments(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  created_at timestamptz not null default now(),
  check (debit_cents >= 0 and credit_cents >= 0),
  check (debit_cents = 0 or credit_cents = 0)
);
create index journal_entry_lines_entry_idx on public.journal_entry_lines (entry_id);
create index journal_entry_lines_account_idx on public.journal_entry_lines (account_id);
create index journal_entry_lines_tenant_idx on public.journal_entry_lines (tenant_id);
create index journal_entry_lines_customer_idx on public.journal_entry_lines (customer_id) where customer_id is not null;
create index journal_entry_lines_project_idx on public.journal_entry_lines (project_id) where project_id is not null;

-- ============================================================ BANK ACCOUNTS
create table public.bank_accounts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  account_name text not null,
  account_number_encrypted text,
  account_number_last4 text,
  iban_encrypted text,
  swift_bic text,
  routing_number text,
  bank_name text,
  branch_name text,
  branch_address jsonb,
  currency text default 'USD',
  gl_account_id uuid references public.chart_of_accounts(id) on delete set null,
  opening_balance_cents bigint not null default 0,
  current_balance_cents bigint not null default 0,
  reconciled_balance_cents bigint not null default 0,
  last_reconciled_at timestamptz,
  is_active boolean default true,
  is_default boolean default false,
  notes text,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index bank_accounts_tenant_idx on public.bank_accounts (tenant_id);
create index bank_accounts_gl_idx on public.bank_accounts (gl_account_id);
create index bank_accounts_active_idx on public.bank_accounts (tenant_id, is_active) where is_active = true;
create trigger trg_bank_accounts_updated_at before update on public.bank_accounts
  for each row execute function public.tg_set_updated_at();

-- Now hook payments.bank_account_id to bank_accounts.
alter table public.payments
  add constraint payments_bank_account_fk foreign key (bank_account_id) references public.bank_accounts(id) on delete set null;

-- ============================================================ BANK TRANSACTIONS
create table public.bank_transactions (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  bank_account_id uuid not null references public.bank_accounts(id) on delete cascade,
  statement_date date,
  transaction_date date not null,
  description text,
  reference text,
  counterparty text,
  amount_cents bigint not null,
  balance_after_cents bigint,
  type text not null check (type in ('credit','debit')),
  category text,
  reconciled_journal_entry_id uuid references public.journal_entries(id) on delete set null,
  matched_payment_id uuid references public.payments(id) on delete set null,
  status text not null default 'unreconciled' check (status in ('unreconciled','matched','manual','ignored')),
  reconciled_at timestamptz,
  reconciled_by uuid references public.user_profiles(id) on delete set null,
  import_batch_id uuid,
  raw_payload jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index bank_transactions_tenant_idx on public.bank_transactions (tenant_id);
create index bank_transactions_account_idx on public.bank_transactions (bank_account_id, transaction_date);
create index bank_transactions_status_idx on public.bank_transactions (tenant_id, status);
create index bank_transactions_je_idx on public.bank_transactions (reconciled_journal_entry_id) where reconciled_journal_entry_id is not null;
create trigger trg_bank_transactions_updated_at before update on public.bank_transactions
  for each row execute function public.tg_set_updated_at();

-- ============================================================ FIXED ASSETS
create table public.fixed_assets (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  asset_code text not null,
  name text not null,
  category text,
  description text,
  purchase_date date not null,
  in_service_date date,
  purchase_cost_cents bigint not null default 0,
  salvage_value_cents bigint not null default 0,
  useful_life_years numeric(8,2) not null default 0,
  depreciation_method text not null default 'straight_line' check (depreciation_method in ('straight_line','double_declining','units_production','sum_of_years','none')),
  accumulated_depreciation_cents bigint not null default 0,
  book_value_cents bigint generated always as (purchase_cost_cents - accumulated_depreciation_cents) stored,
  depreciable_base_cents bigint generated always as (purchase_cost_cents - salvage_value_cents) stored,
  location text,
  branch_id uuid references public.branches(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  custodian_id uuid references public.user_profiles(id) on delete set null,
  manufacturer text,
  model text,
  serial_number text,
  vendor_id uuid,
  warranty_end_date date,
  asset_account_id uuid references public.chart_of_accounts(id) on delete set null,
  depreciation_account_id uuid references public.chart_of_accounts(id) on delete set null,
  accumulated_depr_account_id uuid references public.chart_of_accounts(id) on delete set null,
  status text not null default 'in_use' check (status in ('in_use','disposed','under_maintenance','written_off','retired')),
  disposal_date date,
  disposal_proceeds_cents bigint,
  image_url text,
  attachments jsonb default '[]'::jsonb,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, asset_code)
);
create index fixed_assets_tenant_idx on public.fixed_assets (tenant_id);
create index fixed_assets_status_idx on public.fixed_assets (tenant_id, status);
create index fixed_assets_custodian_idx on public.fixed_assets (custodian_id) where custodian_id is not null;
create index fixed_assets_branch_idx on public.fixed_assets (branch_id) where branch_id is not null;
create trigger trg_fixed_assets_updated_at before update on public.fixed_assets
  for each row execute function public.tg_set_updated_at();

-- ============================================================ DEPRECIATION ENTRIES
create table public.depreciation_entries (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  asset_id uuid not null references public.fixed_assets(id) on delete cascade,
  period_id uuid references public.accounting_periods(id) on delete set null,
  posting_date date not null default current_date,
  amount_cents bigint not null default 0,
  accumulated_after_cents bigint,
  book_value_after_cents bigint,
  method text,
  journal_entry_id uuid references public.journal_entries(id) on delete set null,
  status text not null default 'posted' check (status in ('draft','posted','reversed')),
  notes text,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index depreciation_entries_tenant_idx on public.depreciation_entries (tenant_id);
create index depreciation_entries_asset_idx on public.depreciation_entries (asset_id, posting_date);
create index depreciation_entries_period_idx on public.depreciation_entries (period_id);
create trigger trg_depreciation_entries_updated_at before update on public.depreciation_entries
  for each row execute function public.tg_set_updated_at();

-- ============================================================ BUDGETS
create table public.budgets (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  year int not null,
  name text not null,
  description text,
  status text not null default 'draft' check (status in ('draft','approved','active','closed','archived')),
  department_id uuid references public.departments(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  project_id uuid,
  currency text default 'USD',
  total_budget_cents bigint not null default 0,
  total_actuals_cents bigint not null default 0,
  variance_cents bigint generated always as (total_budget_cents - total_actuals_cents) stored,
  start_date date,
  end_date date,
  approved_by uuid references public.user_profiles(id) on delete set null,
  approved_at timestamptz,
  notes text,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index budgets_tenant_idx on public.budgets (tenant_id);
create index budgets_year_idx on public.budgets (tenant_id, year);
create index budgets_status_idx on public.budgets (tenant_id, status);
create index budgets_department_idx on public.budgets (department_id) where department_id is not null;
create trigger trg_budgets_updated_at before update on public.budgets
  for each row execute function public.tg_set_updated_at();

-- ============================================================ BUDGET LINES
create table public.budget_lines (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  budget_id uuid not null references public.budgets(id) on delete cascade,
  account_id uuid not null references public.chart_of_accounts(id) on delete restrict,
  department_id uuid references public.departments(id) on delete set null,
  project_id uuid,
  period_number int check (period_number between 1 and 13),
  budgeted_cents bigint not null default 0,
  actuals_cents bigint not null default 0,
  variance_cents bigint generated always as (budgeted_cents - actuals_cents) stored,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index budget_lines_budget_idx on public.budget_lines (budget_id);
create index budget_lines_account_idx on public.budget_lines (account_id);
create index budget_lines_period_idx on public.budget_lines (budget_id, period_number);
create trigger trg_budget_lines_updated_at before update on public.budget_lines
  for each row execute function public.tg_set_updated_at();

-- ============================================================ EXCHANGE RATES
create table public.exchange_rates (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  base_currency text not null,
  quote_currency text not null,
  rate numeric(20,10) not null,
  inverse_rate numeric(20,10) generated always as (case when rate = 0 then null else 1.0 / rate end) stored,
  effective_date date not null default current_date,
  source text default 'manual',
  notes text,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, base_currency, quote_currency, effective_date)
);
create index exchange_rates_tenant_idx on public.exchange_rates (tenant_id);
create index exchange_rates_pair_idx on public.exchange_rates (tenant_id, base_currency, quote_currency, effective_date desc);
create trigger trg_exchange_rates_updated_at before update on public.exchange_rates
  for each row execute function public.tg_set_updated_at();

-- ============================================================ RLS
alter table public.chart_of_accounts enable row level security;
alter table public.accounting_periods enable row level security;
alter table public.journal_entries enable row level security;
alter table public.journal_entry_lines enable row level security;
alter table public.bank_accounts enable row level security;
alter table public.bank_transactions enable row level security;
alter table public.fixed_assets enable row level security;
alter table public.depreciation_entries enable row level security;
alter table public.budgets enable row level security;
alter table public.budget_lines enable row level security;
alter table public.exchange_rates enable row level security;

create policy chart_of_accounts_rw on public.chart_of_accounts for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy accounting_periods_rw on public.accounting_periods for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy journal_entries_rw on public.journal_entries for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy journal_entry_lines_rw on public.journal_entry_lines for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy bank_accounts_rw on public.bank_accounts for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy bank_transactions_rw on public.bank_transactions for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy fixed_assets_rw on public.fixed_assets for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy depreciation_entries_rw on public.depreciation_entries for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy budgets_rw on public.budgets for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy budget_lines_rw on public.budget_lines for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy exchange_rates_rw on public.exchange_rates for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
