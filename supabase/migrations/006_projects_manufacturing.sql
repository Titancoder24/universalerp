-- =============================================================================
-- Universal ERP - Projects / Manufacturing Schema (Migration 006)
-- =============================================================================
-- Projects, milestones, tasks, time tracking, plus full manufacturing stack:
-- BOMs, routings, work centers, manufacturing orders, operations, downtime.

-- ============================================================ PROJECTS
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  description text,
  customer_id uuid references public.customers(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  project_manager_id uuid references public.user_profiles(id) on delete set null,
  sponsor_id uuid references public.user_profiles(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  start_date date,
  end_date date,
  planned_end_date date,
  status text not null default 'planning' check (status in ('planning','active','on_hold','completed','cancelled','archived')),
  health text default 'green' check (health in ('green','yellow','red','unknown')),
  budget_cents bigint default 0,
  actual_cost_cents bigint default 0,
  variance_cents bigint generated always as (budget_cents - actual_cost_cents) stored,
  billing_type text default 'fixed_price' check (billing_type in ('fixed_price','time_materials','milestone','retainer','non_billable')),
  currency text default 'USD',
  is_billable boolean default true,
  completion_pct numeric(5,2) default 0 check (completion_pct between 0 and 100),
  priority text default 'medium' check (priority in ('low','medium','high','critical')),
  tags text[] default array[]::text[],
  custom_fields jsonb default '{}'::jsonb,
  owner_id uuid references public.user_profiles(id) on delete set null,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create index projects_tenant_idx on public.projects (tenant_id);
create index projects_customer_idx on public.projects (customer_id) where customer_id is not null;
create index projects_status_idx on public.projects (tenant_id, status);
create index projects_pm_idx on public.projects (project_manager_id) where project_manager_id is not null;
create index projects_dates_idx on public.projects (tenant_id, start_date, end_date);
create trigger trg_projects_updated_at before update on public.projects
  for each row execute function public.tg_set_updated_at();

-- Now hook invoices.project_id and journal_entry_lines.project_id to projects.
alter table public.invoices
  add constraint invoices_project_fk foreign key (project_id) references public.projects(id) on delete set null;
alter table public.journal_entry_lines
  add constraint journal_entry_lines_project_fk foreign key (project_id) references public.projects(id) on delete set null;
alter table public.budgets
  add constraint budgets_project_fk foreign key (project_id) references public.projects(id) on delete set null;
alter table public.budget_lines
  add constraint budget_lines_project_fk foreign key (project_id) references public.projects(id) on delete set null;

-- ============================================================ PROJECT MILESTONES
create table public.project_milestones (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  description text,
  due_date date,
  completion_date date,
  status text not null default 'pending' check (status in ('pending','in_progress','completed','overdue','cancelled')),
  billing_amount_cents bigint default 0,
  is_billed boolean default false,
  billed_invoice_id uuid references public.invoices(id) on delete set null,
  billed_at timestamptz,
  deliverables jsonb default '[]'::jsonb,
  sort_order int not null default 0,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index project_milestones_tenant_idx on public.project_milestones (tenant_id);
create index project_milestones_project_idx on public.project_milestones (project_id, sort_order);
create index project_milestones_status_idx on public.project_milestones (project_id, status);
create trigger trg_project_milestones_updated_at before update on public.project_milestones
  for each row execute function public.tg_set_updated_at();

-- ============================================================ PROJECT TASKS
create table public.project_tasks (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  parent_task_id uuid references public.project_tasks(id) on delete cascade,
  milestone_id uuid references public.project_milestones(id) on delete set null,
  code text,
  name text not null,
  description text,
  assignee_id uuid references public.user_profiles(id) on delete set null,
  reporter_id uuid references public.user_profiles(id) on delete set null,
  start_date date,
  due_date date,
  completed_date date,
  estimated_hours numeric(10,2) default 0,
  actual_hours numeric(10,2) default 0,
  status text not null default 'todo' check (status in ('todo','in_progress','blocked','review','completed','cancelled')),
  priority text default 'medium' check (priority in ('low','medium','high','urgent','critical')),
  progress_pct numeric(5,2) default 0 check (progress_pct between 0 and 100),
  sort_order int not null default 0,
  dependencies uuid[] default array[]::uuid[],
  tags text[] default array[]::text[],
  custom_fields jsonb default '{}'::jsonb,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index project_tasks_tenant_idx on public.project_tasks (tenant_id);
create index project_tasks_project_idx on public.project_tasks (project_id);
create index project_tasks_parent_idx on public.project_tasks (parent_task_id) where parent_task_id is not null;
create index project_tasks_assignee_idx on public.project_tasks (assignee_id) where assignee_id is not null;
create index project_tasks_status_idx on public.project_tasks (project_id, status);
create index project_tasks_due_idx on public.project_tasks (tenant_id, due_date) where status not in ('completed','cancelled');
create trigger trg_project_tasks_updated_at before update on public.project_tasks
  for each row execute function public.tg_set_updated_at();

-- ============================================================ TASK COMMENTS
create table public.task_comments (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  task_id uuid not null references public.project_tasks(id) on delete cascade,
  user_id uuid references public.user_profiles(id) on delete set null,
  parent_comment_id uuid references public.task_comments(id) on delete cascade,
  body text not null,
  attachments jsonb default '[]'::jsonb,
  mentions uuid[] default array[]::uuid[],
  edited_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index task_comments_tenant_idx on public.task_comments (tenant_id);
create index task_comments_task_idx on public.task_comments (task_id, created_at);
create index task_comments_user_idx on public.task_comments (user_id) where user_id is not null;
create trigger trg_task_comments_updated_at before update on public.task_comments
  for each row execute function public.tg_set_updated_at();

-- ============================================================ TIME ENTRIES
create table public.time_entries (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid references public.user_profiles(id) on delete set null,
  employee_id uuid,
  project_id uuid references public.projects(id) on delete set null,
  task_id uuid references public.project_tasks(id) on delete set null,
  entry_date date not null default current_date,
  start_time timestamptz,
  end_time timestamptz,
  hours numeric(8,2) not null default 0,
  billable boolean default true,
  billed boolean default false,
  billing_rate_cents bigint default 0,
  cost_rate_cents bigint default 0,
  amount_cents bigint generated always as ((hours * billing_rate_cents)::bigint) stored,
  description text,
  status text not null default 'draft' check (status in ('draft','submitted','approved','invoiced','rejected')),
  approved_by uuid references public.user_profiles(id) on delete set null,
  approved_at timestamptz,
  rejected_reason text,
  invoice_id uuid references public.invoices(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index time_entries_tenant_idx on public.time_entries (tenant_id);
create index time_entries_user_date_idx on public.time_entries (user_id, entry_date);
create index time_entries_project_idx on public.time_entries (project_id) where project_id is not null;
create index time_entries_task_idx on public.time_entries (task_id) where task_id is not null;
create index time_entries_status_idx on public.time_entries (tenant_id, status);
create index time_entries_billable_idx on public.time_entries (tenant_id, billable, billed) where billable = true;
create trigger trg_time_entries_updated_at before update on public.time_entries
  for each row execute function public.tg_set_updated_at();

-- ============================================================ PROJECT TEAM
create table public.project_team (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text default 'member',
  billing_rate_cents bigint default 0,
  cost_rate_cents bigint default 0,
  allocated_pct numeric(5,2) default 100 check (allocated_pct between 0 and 100),
  start_date date,
  end_date date,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, project_id, user_id)
);
create index project_team_project_idx on public.project_team (project_id);
create index project_team_user_idx on public.project_team (user_id);
create trigger trg_project_team_updated_at before update on public.project_team
  for each row execute function public.tg_set_updated_at();

-- ============================================================ WORK CENTERS
create table public.work_centers (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  description text,
  capacity_hours_per_day numeric(8,2) default 8,
  efficiency_pct numeric(5,2) default 100,
  hourly_cost_cents bigint default 0,
  setup_cost_cents bigint default 0,
  overhead_cost_cents bigint default 0,
  location text,
  branch_id uuid references public.branches(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  is_active boolean default true,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create index work_centers_tenant_idx on public.work_centers (tenant_id);
create index work_centers_branch_idx on public.work_centers (branch_id) where branch_id is not null;
create index work_centers_active_idx on public.work_centers (tenant_id, is_active) where is_active = true;
create trigger trg_work_centers_updated_at before update on public.work_centers
  for each row execute function public.tg_set_updated_at();

-- ============================================================ ROUTINGS
create table public.routings (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  item_id uuid,
  code text,
  name text not null,
  description text,
  version int not null default 1,
  is_default boolean default false,
  total_setup_minutes numeric(10,2) default 0,
  total_run_minutes numeric(10,2) default 0,
  total_minutes numeric(10,2) generated always as (coalesce(total_setup_minutes,0) + coalesce(total_run_minutes,0)) stored,
  status text not null default 'draft' check (status in ('draft','active','obsolete','archived')),
  effective_from date,
  effective_to date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index routings_tenant_idx on public.routings (tenant_id);
create index routings_item_idx on public.routings (item_id) where item_id is not null;
create index routings_status_idx on public.routings (tenant_id, status);
create trigger trg_routings_updated_at before update on public.routings
  for each row execute function public.tg_set_updated_at();

-- ============================================================ ROUTING OPERATIONS
create table public.routing_operations (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  routing_id uuid not null references public.routings(id) on delete cascade,
  sequence int not null default 10,
  work_center_id uuid references public.work_centers(id) on delete set null,
  name text not null,
  description text,
  setup_minutes numeric(10,2) default 0,
  run_minutes_per_unit numeric(10,4) default 0,
  cost_per_hour_cents bigint default 0,
  is_optional boolean default false,
  is_outsourced boolean default false,
  vendor_id uuid,
  instructions text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index routing_operations_routing_idx on public.routing_operations (routing_id, sequence);
create index routing_operations_tenant_idx on public.routing_operations (tenant_id);
create index routing_operations_wc_idx on public.routing_operations (work_center_id) where work_center_id is not null;
create trigger trg_routing_operations_updated_at before update on public.routing_operations
  for each row execute function public.tg_set_updated_at();

-- ============================================================ BOMS
create table public.boms (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  item_id uuid,
  code text,
  name text,
  version int not null default 1,
  status text not null default 'draft' check (status in ('draft','active','obsolete','archived')),
  effective_from date,
  effective_to date,
  total_cost_cents bigint default 0,
  is_default boolean default false,
  routing_id uuid references public.routings(id) on delete set null,
  quantity numeric(18,4) default 1,
  unit text default 'each',
  notes text,
  custom_fields jsonb default '{}'::jsonb,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index boms_tenant_idx on public.boms (tenant_id);
create index boms_item_idx on public.boms (item_id) where item_id is not null;
create index boms_status_idx on public.boms (tenant_id, status);
create index boms_default_idx on public.boms (item_id, is_default) where is_default = true;
create trigger trg_boms_updated_at before update on public.boms
  for each row execute function public.tg_set_updated_at();

-- ============================================================ BOM LINES
create table public.bom_lines (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  bom_id uuid not null references public.boms(id) on delete cascade,
  component_item_id uuid not null,
  quantity numeric(18,6) not null default 1,
  unit text default 'each',
  scrap_pct numeric(6,3) default 0,
  effective_quantity numeric(18,6) generated always as (quantity * (1 + coalesce(scrap_pct,0)/100.0)) stored,
  cost_cents bigint default 0,
  total_cost_cents bigint generated always as ((quantity * (1 + coalesce(scrap_pct,0)/100.0) * cost_cents)::bigint) stored,
  operation_sequence int,
  sort_order int not null default 0,
  is_optional boolean default false,
  is_phantom boolean default false,
  warehouse_id uuid,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index bom_lines_bom_idx on public.bom_lines (bom_id, sort_order);
create index bom_lines_tenant_idx on public.bom_lines (tenant_id);
create index bom_lines_component_idx on public.bom_lines (component_item_id);
create trigger trg_bom_lines_updated_at before update on public.bom_lines
  for each row execute function public.tg_set_updated_at();

-- ============================================================ MANUFACTURING ORDERS
create table public.manufacturing_orders (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  item_id uuid not null,
  bom_id uuid references public.boms(id) on delete set null,
  routing_id uuid references public.routings(id) on delete set null,
  quantity_ordered numeric(18,4) not null default 0,
  quantity_produced numeric(18,4) not null default 0,
  quantity_scrapped numeric(18,4) not null default 0,
  quantity_remaining numeric(18,4) generated always as (quantity_ordered - quantity_produced - quantity_scrapped) stored,
  unit text default 'each',
  planned_start timestamptz,
  planned_end timestamptz,
  actual_start timestamptz,
  actual_end timestamptz,
  status text not null default 'draft' check (status in ('draft','planned','released','in_progress','completed','cancelled','on_hold')),
  sales_order_id uuid references public.sales_orders(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  priority text default 'medium' check (priority in ('low','medium','high','urgent','critical')),
  warehouse_id uuid,
  source_warehouse_id uuid,
  owner_id uuid references public.user_profiles(id) on delete set null,
  supervisor_id uuid references public.user_profiles(id) on delete set null,
  total_material_cost_cents bigint default 0,
  total_labor_cost_cents bigint default 0,
  total_overhead_cost_cents bigint default 0,
  total_cost_cents bigint default 0,
  notes text,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create index manufacturing_orders_tenant_idx on public.manufacturing_orders (tenant_id);
create index manufacturing_orders_status_idx on public.manufacturing_orders (tenant_id, status);
create index manufacturing_orders_item_idx on public.manufacturing_orders (item_id);
create index manufacturing_orders_so_idx on public.manufacturing_orders (sales_order_id) where sales_order_id is not null;
create index manufacturing_orders_planned_idx on public.manufacturing_orders (tenant_id, planned_start);
create trigger trg_manufacturing_orders_updated_at before update on public.manufacturing_orders
  for each row execute function public.tg_set_updated_at();

-- ============================================================ MO COMPONENTS
create table public.mo_components (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  mo_id uuid not null references public.manufacturing_orders(id) on delete cascade,
  bom_line_id uuid references public.bom_lines(id) on delete set null,
  item_id uuid not null,
  required_qty numeric(18,6) not null default 0,
  consumed_qty numeric(18,6) not null default 0,
  scrap_qty numeric(18,6) not null default 0,
  remaining_qty numeric(18,6) generated always as (required_qty - consumed_qty - scrap_qty) stored,
  unit text default 'each',
  cost_cents bigint default 0,
  warehouse_id uuid,
  bin_id uuid,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index mo_components_mo_idx on public.mo_components (mo_id);
create index mo_components_tenant_idx on public.mo_components (tenant_id);
create index mo_components_item_idx on public.mo_components (item_id);
create trigger trg_mo_components_updated_at before update on public.mo_components
  for each row execute function public.tg_set_updated_at();

-- ============================================================ MO OPERATIONS
create table public.mo_operations (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  mo_id uuid not null references public.manufacturing_orders(id) on delete cascade,
  routing_operation_id uuid references public.routing_operations(id) on delete set null,
  work_center_id uuid references public.work_centers(id) on delete set null,
  sequence int not null default 10,
  name text,
  planned_minutes numeric(10,2) default 0,
  actual_minutes numeric(10,2) default 0,
  status text not null default 'pending' check (status in ('pending','ready','in_progress','paused','completed','skipped','cancelled')),
  operator_id uuid references public.user_profiles(id) on delete set null,
  started_at timestamptz,
  completed_at timestamptz,
  quantity_good numeric(18,4) default 0,
  quantity_scrap numeric(18,4) default 0,
  cost_cents bigint default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index mo_operations_mo_idx on public.mo_operations (mo_id, sequence);
create index mo_operations_tenant_idx on public.mo_operations (tenant_id);
create index mo_operations_wc_idx on public.mo_operations (work_center_id) where work_center_id is not null;
create index mo_operations_status_idx on public.mo_operations (tenant_id, status);
create trigger trg_mo_operations_updated_at before update on public.mo_operations
  for each row execute function public.tg_set_updated_at();

-- ============================================================ PRODUCTION LOGS
create table public.production_logs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  mo_id uuid references public.manufacturing_orders(id) on delete cascade,
  operation_id uuid references public.mo_operations(id) on delete cascade,
  operator_id uuid references public.user_profiles(id) on delete set null,
  work_center_id uuid references public.work_centers(id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_minutes numeric(10,2) generated always as (
    case when ended_at is null then null
    else extract(epoch from (ended_at - started_at)) / 60.0 end
  ) stored,
  quantity_good numeric(18,4) default 0,
  quantity_scrap numeric(18,4) default 0,
  downtime_minutes numeric(10,2) default 0,
  downtime_reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index production_logs_mo_idx on public.production_logs (mo_id) where mo_id is not null;
create index production_logs_operation_idx on public.production_logs (operation_id) where operation_id is not null;
create index production_logs_tenant_idx on public.production_logs (tenant_id);
create index production_logs_started_idx on public.production_logs (tenant_id, started_at);
create index production_logs_operator_idx on public.production_logs (operator_id) where operator_id is not null;
create trigger trg_production_logs_updated_at before update on public.production_logs
  for each row execute function public.tg_set_updated_at();

-- ============================================================ DOWNTIME RECORDS
create table public.downtime_records (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  work_center_id uuid not null references public.work_centers(id) on delete cascade,
  mo_id uuid references public.manufacturing_orders(id) on delete set null,
  operation_id uuid references public.mo_operations(id) on delete set null,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_minutes numeric(10,2) generated always as (
    case when ended_at is null then null
    else extract(epoch from (ended_at - started_at)) / 60.0 end
  ) stored,
  reason_code text,
  category text check (category in ('planned','unplanned','breakdown','setup','material','quality','operator','other') or category is null),
  description text,
  notes text,
  cost_impact_cents bigint default 0,
  recorded_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index downtime_records_tenant_idx on public.downtime_records (tenant_id);
create index downtime_records_wc_idx on public.downtime_records (work_center_id, started_at);
create index downtime_records_mo_idx on public.downtime_records (mo_id) where mo_id is not null;
create index downtime_records_category_idx on public.downtime_records (tenant_id, category);
create trigger trg_downtime_records_updated_at before update on public.downtime_records
  for each row execute function public.tg_set_updated_at();

-- ============================================================ RLS
alter table public.projects enable row level security;
alter table public.project_milestones enable row level security;
alter table public.project_tasks enable row level security;
alter table public.task_comments enable row level security;
alter table public.time_entries enable row level security;
alter table public.project_team enable row level security;
alter table public.work_centers enable row level security;
alter table public.routings enable row level security;
alter table public.routing_operations enable row level security;
alter table public.boms enable row level security;
alter table public.bom_lines enable row level security;
alter table public.manufacturing_orders enable row level security;
alter table public.mo_components enable row level security;
alter table public.mo_operations enable row level security;
alter table public.production_logs enable row level security;
alter table public.downtime_records enable row level security;

create policy projects_rw on public.projects for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy project_milestones_rw on public.project_milestones for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy project_tasks_rw on public.project_tasks for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy task_comments_rw on public.task_comments for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy time_entries_rw on public.time_entries for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy project_team_rw on public.project_team for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy work_centers_rw on public.work_centers for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy routings_rw on public.routings for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy routing_operations_rw on public.routing_operations for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy boms_rw on public.boms for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy bom_lines_rw on public.bom_lines for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy manufacturing_orders_rw on public.manufacturing_orders for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy mo_components_rw on public.mo_components for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy mo_operations_rw on public.mo_operations for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy production_logs_rw on public.production_logs for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy downtime_records_rw on public.downtime_records for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
