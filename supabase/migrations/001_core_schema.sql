-- =============================================================================
-- Universal ERP - Core Schema (Migration 001)
-- =============================================================================
-- Multi-tenant foundation:
--   tenants, users, memberships, roles, permissions, audit log, audit fields.
-- Every business table that follows in subsequent migrations carries tenant_id
-- and enforces tenant isolation through Row Level Security.

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "citext";
create extension if not exists "pg_trgm";

-- =============================================================================
-- Helper functions
-- =============================================================================
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.gen_short_id(prefix text, len int default 10)
returns text
language plpgsql
as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  output text := '';
  i int;
  pos int;
begin
  for i in 1..len loop
    pos := 1 + floor(random() * length(alphabet));
    output := output || substring(alphabet from pos for 1);
  end loop;
  return prefix || '_' || output;
end;
$$;

-- =============================================================================
-- TENANTS
-- =============================================================================
create table public.tenants (
  id uuid primary key default uuid_generate_v4(),
  slug citext not null unique,
  name text not null,
  legal_name text,
  status text not null default 'active' check (status in ('active','suspended','trial','archived')),
  plan_id uuid,
  parent_reseller_id uuid,
  industry text,
  country_code text default 'US',
  default_currency text default 'USD',
  default_locale text default 'en',
  default_timezone text default 'UTC',
  fiscal_year_start_month int default 1 check (fiscal_year_start_month between 1 and 12),
  logo_url text,
  favicon_url text,
  brand_color text,
  theme_preset_id text default 'stripe-clean',
  icon_family_id text default 'lucide',
  sidebar_layout text default 'left-fixed',
  density text default 'standard' check (density in ('compact','standard','cozy')),
  font_sans text default 'Inter',
  font_serif text default 'Lora',
  font_mono text default 'JetBrains Mono',
  font_display text default 'Inter',
  custom_tokens jsonb default '{}'::jsonb,
  feature_flags jsonb default '{}'::jsonb,
  enabled_modules text[] default array[]::text[],
  ai_provider text default 'openrouter',
  ai_key_encrypted text,
  ai_default_model text default 'anthropic/claude-haiku-4-5',
  ai_monthly_budget_cents int default 10000,
  data_residency text default 'us',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tenants_status_idx on public.tenants (status);
create index tenants_parent_idx on public.tenants (parent_reseller_id) where parent_reseller_id is not null;
create trigger trg_tenants_updated_at before update on public.tenants
  for each row execute function public.tg_set_updated_at();

-- =============================================================================
-- PLANS
-- =============================================================================
create table public.plans (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  name text not null,
  description text,
  monthly_price_cents int not null default 0,
  annual_price_cents int not null default 0,
  one_time_price_cents int not null default 0,
  max_users int,
  max_storage_gb int,
  max_records int,
  ai_budget_cents int default 0,
  enabled_modules text[] default array[]::text[],
  features jsonb default '{}'::jsonb,
  active boolean default true,
  sort_order int default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_plans_updated_at before update on public.plans
  for each row execute function public.tg_set_updated_at();

alter table public.tenants
  add constraint tenants_plan_fk foreign key (plan_id) references public.plans(id) on delete set null,
  add constraint tenants_reseller_fk foreign key (parent_reseller_id) references public.tenants(id) on delete set null;

-- =============================================================================
-- USERS - extends auth.users
-- =============================================================================
-- We mirror auth.users into a profile-like row that ERP code joins against.
-- The auth.users record holds password / OTP / SSO state; user_profiles holds
-- the ERP-domain attributes.

create table public.user_profiles (
  id uuid primary key, -- == auth.users.id
  email citext not null unique,
  full_name text,
  first_name text,
  last_name text,
  display_name text,
  avatar_url text,
  phone text,
  locale text default 'en',
  timezone text default 'UTC',
  date_format text default 'YYYY-MM-DD',
  time_format text default '24h',
  notification_prefs jsonb default '{}'::jsonb,
  theme_override text,
  density_override text,
  density_modes text[] default array[]::text[],
  pinned_modules text[] default array[]::text[],
  status text not null default 'active' check (status in ('active','disabled','pending','archived')),
  is_super_admin boolean default false,
  last_login_at timestamptz,
  last_seen_at timestamptz,
  password_changed_at timestamptz,
  mfa_enabled boolean default false,
  webauthn_credentials jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_user_profiles_updated_at before update on public.user_profiles
  for each row execute function public.tg_set_updated_at();
create index user_profiles_status_idx on public.user_profiles (status);
create index user_profiles_super_admin_idx on public.user_profiles (is_super_admin) where is_super_admin = true;

-- =============================================================================
-- MEMBERSHIPS (user <-> tenant link)
-- =============================================================================
create table public.memberships (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text not null default 'employee' check (role in
    ('super_admin','tenant_admin','employee','customer','vendor','reseller_admin')),
  title text,
  department_id uuid,
  branch_id uuid,
  manager_user_id uuid references public.user_profiles(id) on delete set null,
  status text not null default 'active' check (status in ('active','disabled','pending')),
  invited_at timestamptz,
  joined_at timestamptz,
  module_access jsonb default '{}'::jsonb,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);
create index memberships_tenant_idx on public.memberships (tenant_id);
create index memberships_user_idx on public.memberships (user_id);
create index memberships_role_idx on public.memberships (tenant_id, role);
create trigger trg_memberships_updated_at before update on public.memberships
  for each row execute function public.tg_set_updated_at();

-- =============================================================================
-- ROLES & PERMISSIONS
-- =============================================================================
create table public.roles (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.tenants(id) on delete cascade, -- null = system role template
  code text not null,
  name text not null,
  description text,
  module_access jsonb not null default '{}'::jsonb,
  is_system boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create trigger trg_roles_updated_at before update on public.roles
  for each row execute function public.tg_set_updated_at();
create index roles_tenant_idx on public.roles (tenant_id);

-- =============================================================================
-- DEPARTMENTS & BRANCHES (referenced widely)
-- =============================================================================
create table public.branches (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  address jsonb,
  phone text,
  email text,
  manager_user_id uuid references public.user_profiles(id) on delete set null,
  active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create trigger trg_branches_updated_at before update on public.branches
  for each row execute function public.tg_set_updated_at();

create table public.departments (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  parent_id uuid references public.departments(id) on delete set null,
  manager_user_id uuid references public.user_profiles(id) on delete set null,
  cost_center text,
  active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create trigger trg_departments_updated_at before update on public.departments
  for each row execute function public.tg_set_updated_at();

alter table public.memberships
  add constraint memberships_dept_fk foreign key (department_id) references public.departments(id) on delete set null,
  add constraint memberships_branch_fk foreign key (branch_id) references public.branches(id) on delete set null;

-- =============================================================================
-- AUDIT LOG (append-only)
-- =============================================================================
create table public.audit_log (
  id bigserial primary key,
  tenant_id uuid references public.tenants(id) on delete cascade,
  user_id uuid references public.user_profiles(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id text,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);
create index audit_log_tenant_idx on public.audit_log (tenant_id, created_at desc);
create index audit_log_resource_idx on public.audit_log (resource_type, resource_id);
create index audit_log_user_idx on public.audit_log (user_id, created_at desc);

-- =============================================================================
-- NUMBER SEQUENCES (per tenant, per doctype)
-- =============================================================================
create table public.number_sequences (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  doctype text not null,
  prefix text default '',
  padding int default 5,
  current_value bigint default 0,
  reset_cadence text default 'never' check (reset_cadence in ('never','yearly','monthly','daily')),
  last_reset_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, doctype)
);
create trigger trg_sequences_updated_at before update on public.number_sequences
  for each row execute function public.tg_set_updated_at();

create or replace function public.next_document_number(p_tenant_id uuid, p_doctype text)
returns text
language plpgsql
as $$
declare
  seq record;
  next_val bigint;
begin
  select * into seq from public.number_sequences
  where tenant_id = p_tenant_id and doctype = p_doctype
  for update;

  if not found then
    insert into public.number_sequences (tenant_id, doctype, prefix)
    values (p_tenant_id, p_doctype, upper(left(p_doctype, 3)))
    returning * into seq;
  end if;

  next_val := seq.current_value + 1;
  update public.number_sequences
  set current_value = next_val, updated_at = now()
  where id = seq.id;

  return coalesce(seq.prefix, '') || '-' || lpad(next_val::text, seq.padding, '0');
end;
$$;

-- =============================================================================
-- RLS Helpers
-- =============================================================================
create or replace function public.current_user_id()
returns uuid
language sql
stable
as $$
  select auth.uid()
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (select is_super_admin from public.user_profiles where id = auth.uid()),
    false
  )
$$;

create or replace function public.user_tenant_ids()
returns setof uuid
language sql
stable
as $$
  select tenant_id from public.memberships
  where user_id = auth.uid() and status = 'active'
$$;

create or replace function public.has_tenant_access(p_tenant_id uuid)
returns boolean
language sql
stable
as $$
  select public.is_super_admin()
      or exists(
        select 1 from public.memberships
        where user_id = auth.uid()
          and tenant_id = p_tenant_id
          and status = 'active'
      );
$$;

create or replace function public.has_module_access(p_tenant_id uuid, p_module text, p_level text default 'read')
returns boolean
language plpgsql
stable
as $$
declare
  member record;
  level_value int;
  required_value int;
  module_level text;
begin
  if public.is_super_admin() then
    return true;
  end if;

  select * into member from public.memberships
  where user_id = auth.uid() and tenant_id = p_tenant_id and status = 'active';
  if not found then
    return false;
  end if;
  -- Tenant admins always have full access
  if member.role = 'tenant_admin' then
    return true;
  end if;

  module_level := coalesce(member.module_access ->> p_module, 'none');

  level_value := case module_level
    when 'admin' then 4
    when 'approve' then 3
    when 'write' then 2
    when 'read' then 1
    else 0
  end;
  required_value := case p_level
    when 'admin' then 4
    when 'approve' then 3
    when 'write' then 2
    when 'read' then 1
    else 0
  end;
  return level_value >= required_value;
end;
$$;

-- =============================================================================
-- RLS on core tables
-- =============================================================================
alter table public.tenants enable row level security;
alter table public.user_profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.roles enable row level security;
alter table public.departments enable row level security;
alter table public.branches enable row level security;
alter table public.audit_log enable row level security;
alter table public.number_sequences enable row level security;
alter table public.plans enable row level security;

-- Tenants: super admin sees all, members see their tenants, resellers see children
create policy tenants_select on public.tenants for select using (
  public.is_super_admin()
  or id in (select public.user_tenant_ids())
  or parent_reseller_id in (select public.user_tenant_ids())
);
create policy tenants_insert on public.tenants for insert with check (public.is_super_admin());
create policy tenants_update on public.tenants for update using (
  public.is_super_admin() or exists(
    select 1 from public.memberships m
    where m.tenant_id = id and m.user_id = auth.uid() and m.role = 'tenant_admin' and m.status = 'active'
  )
);

-- User profiles: users see themselves; tenant admins see members of their tenants
create policy user_profiles_self on public.user_profiles for select using (
  id = auth.uid()
  or public.is_super_admin()
  or exists(
    select 1 from public.memberships m
    where m.user_id = public.user_profiles.id
      and m.tenant_id in (select public.user_tenant_ids())
  )
);
create policy user_profiles_update_self on public.user_profiles for update using (id = auth.uid() or public.is_super_admin());

-- Memberships
create policy memberships_select on public.memberships for select using (
  public.is_super_admin()
  or user_id = auth.uid()
  or tenant_id in (select public.user_tenant_ids())
);
create policy memberships_admin on public.memberships for all using (
  public.is_super_admin() or exists(
    select 1 from public.memberships m
    where m.tenant_id = memberships.tenant_id
      and m.user_id = auth.uid()
      and m.role in ('tenant_admin')
      and m.status = 'active'
  )
) with check (
  public.is_super_admin() or exists(
    select 1 from public.memberships m
    where m.tenant_id = memberships.tenant_id
      and m.user_id = auth.uid()
      and m.role in ('tenant_admin')
      and m.status = 'active'
  )
);

-- Plans (read by all members; write by super admin)
create policy plans_read on public.plans for select using (true);
create policy plans_write on public.plans for all using (public.is_super_admin()) with check (public.is_super_admin());

-- Departments/Branches
create policy departments_rw on public.departments for all
  using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy branches_rw on public.branches for all
  using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));

-- Roles (tenant-scoped or system templates)
create policy roles_read on public.roles for select using (
  tenant_id is null or public.has_tenant_access(tenant_id)
);
create policy roles_write on public.roles for all using (
  tenant_id is not null and public.has_tenant_access(tenant_id)
) with check (
  tenant_id is not null and public.has_tenant_access(tenant_id)
);

-- Audit log: members of the tenant can read, no one writes directly (server writes via service key)
create policy audit_log_read on public.audit_log for select using (
  public.is_super_admin() or (tenant_id is not null and public.has_tenant_access(tenant_id))
);

-- Number sequences
create policy number_sequences_rw on public.number_sequences for all
  using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
