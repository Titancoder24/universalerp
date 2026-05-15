-- =============================================================================
-- Universal ERP - Quality / Assets / EHS Schema (Migration 007)
-- =============================================================================
-- Quality plans, inspections, NCR/CAPA, SPC, audits, calibrations,
-- customer complaints, RMA, fixed assets (operational), maintenance,
-- work orders, EHS incidents.

-- ============================================================ QUALITY PLANS
create table public.quality_plans (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  item_id uuid,
  operation text,
  code text,
  name text not null,
  description text,
  characteristics jsonb default '[]'::jsonb,
  sampling_plan text,
  frequency text,
  control_limits jsonb default '{}'::jsonb,
  status text not null default 'active' check (status in ('draft','active','obsolete','archived')),
  effective_from date,
  effective_to date,
  owner_id uuid references public.user_profiles(id) on delete set null,
  notes text,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index quality_plans_tenant_idx on public.quality_plans (tenant_id);
create index quality_plans_item_idx on public.quality_plans (item_id) where item_id is not null;
create index quality_plans_status_idx on public.quality_plans (tenant_id, status);
create trigger trg_quality_plans_updated_at before update on public.quality_plans
  for each row execute function public.tg_set_updated_at();

-- ============================================================ QUALITY INSPECTIONS
create table public.quality_inspections (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  plan_id uuid references public.quality_plans(id) on delete set null,
  item_id uuid,
  mo_id uuid references public.manufacturing_orders(id) on delete set null,
  po_receipt_id uuid,
  sales_order_id uuid references public.sales_orders(id) on delete set null,
  inspection_type text not null default 'in_process' check (inspection_type in ('incoming','in_process','final','periodic','first_article','dock')),
  sample_size int default 1,
  status text not null default 'pending' check (status in ('pending','in_progress','passed','failed','conditional','cancelled')),
  inspector_id uuid references public.user_profiles(id) on delete set null,
  inspected_at timestamptz,
  scheduled_at timestamptz,
  measurements jsonb default '[]'::jsonb,
  pass_count int default 0,
  fail_count int default 0,
  defect_codes text[] default array[]::text[],
  notes text,
  attachments jsonb default '[]'::jsonb,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create index quality_inspections_tenant_idx on public.quality_inspections (tenant_id);
create index quality_inspections_status_idx on public.quality_inspections (tenant_id, status);
create index quality_inspections_mo_idx on public.quality_inspections (mo_id) where mo_id is not null;
create index quality_inspections_item_idx on public.quality_inspections (item_id) where item_id is not null;
create index quality_inspections_inspector_idx on public.quality_inspections (inspector_id) where inspector_id is not null;
create trigger trg_quality_inspections_updated_at before update on public.quality_inspections
  for each row execute function public.tg_set_updated_at();

-- ============================================================ INSPECTION MEASUREMENTS
create table public.inspection_measurements (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  inspection_id uuid not null references public.quality_inspections(id) on delete cascade,
  sort_order int not null default 0,
  characteristic text not null,
  value numeric(20,6),
  text_value text,
  unit text,
  lower_limit numeric(20,6),
  upper_limit numeric(20,6),
  target numeric(20,6),
  is_within_limits boolean,
  defect_code text,
  notes text,
  measured_at timestamptz default now(),
  measured_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index inspection_measurements_inspection_idx on public.inspection_measurements (inspection_id);
create index inspection_measurements_tenant_idx on public.inspection_measurements (tenant_id);

-- ============================================================ NON-CONFORMANCE REPORTS
create table public.non_conformance_reports (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  source_type text,
  source_id uuid,
  item_id uuid,
  batch_number text,
  serial_number text,
  quantity_affected numeric(18,4) default 0,
  unit text default 'each',
  severity text not null default 'minor' check (severity in ('minor','major','critical')),
  description text not null,
  root_cause text,
  disposition text check (disposition in ('use_as_is','rework','scrap','return_to_supplier','quarantine','sort','repair') or disposition is null),
  cost_impact_cents bigint default 0,
  status text not null default 'open' check (status in ('open','investigating','disposition_pending','closed','cancelled')),
  raised_by uuid references public.user_profiles(id) on delete set null,
  assigned_to uuid references public.user_profiles(id) on delete set null,
  due_date date,
  closed_at timestamptz,
  closed_by uuid references public.user_profiles(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  vendor_id uuid,
  notes text,
  attachments jsonb default '[]'::jsonb,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create index ncr_tenant_idx on public.non_conformance_reports (tenant_id);
create index ncr_status_idx on public.non_conformance_reports (tenant_id, status);
create index ncr_severity_idx on public.non_conformance_reports (tenant_id, severity);
create index ncr_assigned_idx on public.non_conformance_reports (assigned_to) where assigned_to is not null;
create index ncr_source_idx on public.non_conformance_reports (source_type, source_id);
create trigger trg_ncr_updated_at before update on public.non_conformance_reports
  for each row execute function public.tg_set_updated_at();

-- ============================================================ CAPA RECORDS
create table public.capa_records (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text,
  ncr_id uuid references public.non_conformance_reports(id) on delete set null,
  complaint_id uuid,
  audit_finding_id uuid,
  type text not null default 'corrective' check (type in ('corrective','preventive','both')),
  title text,
  description text not null,
  root_cause_analysis jsonb default '{}'::jsonb,
  action_plan jsonb default '[]'::jsonb,
  owner_id uuid references public.user_profiles(id) on delete set null,
  target_date date,
  completed_date date,
  verification_date date,
  verified_by uuid references public.user_profiles(id) on delete set null,
  effectiveness text check (effectiveness in ('effective','partially_effective','ineffective','pending') or effectiveness is null),
  status text not null default 'open' check (status in ('open','in_progress','pending_verification','verified','closed','rejected')),
  cost_cents bigint default 0,
  notes text,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index capa_tenant_idx on public.capa_records (tenant_id);
create index capa_status_idx on public.capa_records (tenant_id, status);
create index capa_owner_idx on public.capa_records (owner_id) where owner_id is not null;
create index capa_ncr_idx on public.capa_records (ncr_id) where ncr_id is not null;
create trigger trg_capa_updated_at before update on public.capa_records
  for each row execute function public.tg_set_updated_at();

-- ============================================================ SPC CHARTS
create table public.spc_charts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  item_id uuid,
  characteristic text not null,
  name text,
  chart_type text not null default 'x_bar_r' check (chart_type in ('x_bar_r','x_bar_s','p','np','c','u','individuals','moving_range','ewma','cusum')),
  ucl numeric(20,6),
  lcl numeric(20,6),
  mean numeric(20,6),
  sample_size int default 1,
  frequency text,
  last_violation_at timestamptz,
  status text default 'active' check (status in ('active','inactive','archived')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index spc_charts_tenant_idx on public.spc_charts (tenant_id);
create index spc_charts_item_idx on public.spc_charts (item_id) where item_id is not null;
create trigger trg_spc_charts_updated_at before update on public.spc_charts
  for each row execute function public.tg_set_updated_at();

-- ============================================================ SPC MEASUREMENTS
create table public.spc_measurements (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  chart_id uuid not null references public.spc_charts(id) on delete cascade,
  sample_number int not null,
  value numeric(20,6) not null,
  ucl numeric(20,6),
  lcl numeric(20,6),
  mean numeric(20,6),
  in_control boolean,
  taken_at timestamptz not null default now(),
  taken_by uuid references public.user_profiles(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);
create index spc_measurements_chart_idx on public.spc_measurements (chart_id, taken_at);
create index spc_measurements_tenant_idx on public.spc_measurements (tenant_id);
create index spc_measurements_violations_idx on public.spc_measurements (chart_id) where in_control = false;

-- ============================================================ AUDIT PROGRAMS
create table public.audit_programs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  year int not null,
  name text not null,
  type text not null default 'internal' check (type in ('internal','external','supplier','regulatory','certification')),
  scope text,
  frequency text,
  owner_id uuid references public.user_profiles(id) on delete set null,
  status text default 'active' check (status in ('draft','active','completed','archived')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index audit_programs_tenant_idx on public.audit_programs (tenant_id);
create index audit_programs_year_idx on public.audit_programs (tenant_id, year);
create trigger trg_audit_programs_updated_at before update on public.audit_programs
  for each row execute function public.tg_set_updated_at();

-- ============================================================ AUDITS
create table public.audits (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  program_id uuid references public.audit_programs(id) on delete set null,
  type text not null default 'internal' check (type in ('internal','external','supplier','regulatory','certification')),
  scope text,
  title text,
  auditor_ids uuid[] default array[]::uuid[],
  lead_auditor_id uuid references public.user_profiles(id) on delete set null,
  auditee text,
  auditee_user_id uuid references public.user_profiles(id) on delete set null,
  vendor_id uuid,
  scheduled_date date,
  completed_date date,
  status text not null default 'planned' check (status in ('planned','in_progress','completed','cancelled','report_pending')),
  findings jsonb default '[]'::jsonb,
  summary text,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create index audits_tenant_idx on public.audits (tenant_id);
create index audits_program_idx on public.audits (program_id) where program_id is not null;
create index audits_status_idx on public.audits (tenant_id, status);
create index audits_scheduled_idx on public.audits (tenant_id, scheduled_date);
create trigger trg_audits_updated_at before update on public.audits
  for each row execute function public.tg_set_updated_at();

-- ============================================================ AUDIT FINDINGS
create table public.audit_findings (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  audit_id uuid not null references public.audits(id) on delete cascade,
  number text,
  severity text not null default 'minor' check (severity in ('observation','minor','major','critical')),
  category text,
  description text not null,
  recommendation text,
  evidence text,
  owner_id uuid references public.user_profiles(id) on delete set null,
  target_date date,
  closed_date date,
  status text not null default 'open' check (status in ('open','in_progress','awaiting_verification','closed','rejected')),
  capa_id uuid references public.capa_records(id) on delete set null,
  notes text,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index audit_findings_audit_idx on public.audit_findings (audit_id);
create index audit_findings_tenant_idx on public.audit_findings (tenant_id);
create index audit_findings_status_idx on public.audit_findings (tenant_id, status);
create index audit_findings_owner_idx on public.audit_findings (owner_id) where owner_id is not null;
create trigger trg_audit_findings_updated_at before update on public.audit_findings
  for each row execute function public.tg_set_updated_at();

-- Now hook capa_records.audit_finding_id back to audit_findings.
alter table public.capa_records
  add constraint capa_audit_finding_fk foreign key (audit_finding_id) references public.audit_findings(id) on delete set null;

-- ============================================================ ASSETS (operational, distinct from fixed_assets)
create table public.assets (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  category text,
  description text,
  location text,
  branch_id uuid references public.branches(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  custodian_id uuid references public.user_profiles(id) on delete set null,
  manufacturer text,
  model text,
  serial_number text,
  purchase_date date,
  purchase_cost_cents bigint default 0,
  warranty_end_date date,
  status text not null default 'active' check (status in ('active','inactive','under_maintenance','retired','disposed','lost')),
  criticality text default 'medium' check (criticality in ('low','medium','high','critical')),
  parent_asset_id uuid references public.assets(id) on delete set null,
  fixed_asset_id uuid references public.fixed_assets(id) on delete set null,
  image_url text,
  qr_code text,
  attachments jsonb default '[]'::jsonb,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create index assets_tenant_idx on public.assets (tenant_id);
create index assets_status_idx on public.assets (tenant_id, status);
create index assets_custodian_idx on public.assets (custodian_id) where custodian_id is not null;
create index assets_parent_idx on public.assets (parent_asset_id) where parent_asset_id is not null;
create index assets_branch_idx on public.assets (branch_id) where branch_id is not null;
create trigger trg_assets_updated_at before update on public.assets
  for each row execute function public.tg_set_updated_at();

-- ============================================================ ASSET METERS
create table public.asset_meters (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  meter_type text not null check (meter_type in ('hours','miles','kilometers','cycles','units','custom')),
  name text,
  current_reading numeric(20,4) default 0,
  last_reading_date date,
  previous_reading numeric(20,4) default 0,
  unit text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index asset_meters_asset_idx on public.asset_meters (asset_id);
create index asset_meters_tenant_idx on public.asset_meters (tenant_id);
create trigger trg_asset_meters_updated_at before update on public.asset_meters
  for each row execute function public.tg_set_updated_at();

-- ============================================================ MAINTENANCE SCHEDULES
create table public.maintenance_schedules (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  name text,
  type text not null default 'time_based' check (type in ('time_based','meter_based','condition_based','run_to_failure')),
  frequency_value numeric(10,2),
  frequency_unit text,
  last_done_date date,
  next_due_date date,
  task_template_id uuid,
  assigned_to uuid references public.user_profiles(id) on delete set null,
  description text,
  estimated_hours numeric(8,2),
  is_active boolean default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index maintenance_schedules_asset_idx on public.maintenance_schedules (asset_id);
create index maintenance_schedules_tenant_idx on public.maintenance_schedules (tenant_id);
create index maintenance_schedules_due_idx on public.maintenance_schedules (tenant_id, next_due_date) where is_active = true;
create trigger trg_maintenance_schedules_updated_at before update on public.maintenance_schedules
  for each row execute function public.tg_set_updated_at();

-- ============================================================ WORK ORDERS
create table public.work_orders (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  asset_id uuid references public.assets(id) on delete set null,
  schedule_id uuid references public.maintenance_schedules(id) on delete set null,
  type text not null default 'corrective' check (type in ('preventive','corrective','predictive','inspection','calibration','installation','project')),
  priority text default 'medium' check (priority in ('low','medium','high','urgent','emergency')),
  status text not null default 'open' check (status in ('open','assigned','in_progress','on_hold','completed','cancelled','closed')),
  scheduled_date date,
  due_date date,
  started_at timestamptz,
  completed_date date,
  completed_at timestamptz,
  technician_id uuid references public.user_profiles(id) on delete set null,
  team_ids uuid[] default array[]::uuid[],
  description text,
  estimated_hours numeric(8,2),
  actual_hours numeric(8,2),
  parts_used jsonb default '[]'::jsonb,
  labor_cost_cents bigint default 0,
  parts_cost_cents bigint default 0,
  total_cost_cents bigint default 0,
  resolution text,
  notes text,
  attachments jsonb default '[]'::jsonb,
  custom_fields jsonb default '{}'::jsonb,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create index work_orders_tenant_idx on public.work_orders (tenant_id);
create index work_orders_asset_idx on public.work_orders (asset_id) where asset_id is not null;
create index work_orders_status_idx on public.work_orders (tenant_id, status);
create index work_orders_tech_idx on public.work_orders (technician_id) where technician_id is not null;
create index work_orders_due_idx on public.work_orders (tenant_id, due_date) where status not in ('completed','cancelled','closed');
create trigger trg_work_orders_updated_at before update on public.work_orders
  for each row execute function public.tg_set_updated_at();

-- ============================================================ CALIBRATION RECORDS
create table public.calibration_records (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  calibration_date date not null default current_date,
  next_due_date date,
  calibrated_by uuid references public.user_profiles(id) on delete set null,
  external_provider text,
  certificate_url text,
  certificate_number text,
  result text not null default 'passed' check (result in ('passed','failed','adjusted','out_of_tolerance')),
  measurements jsonb default '[]'::jsonb,
  cost_cents bigint default 0,
  notes text,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index calibration_records_tenant_idx on public.calibration_records (tenant_id);
create index calibration_records_asset_idx on public.calibration_records (asset_id, calibration_date desc);
create index calibration_records_due_idx on public.calibration_records (tenant_id, next_due_date) where next_due_date is not null;
create trigger trg_calibration_records_updated_at before update on public.calibration_records
  for each row execute function public.tg_set_updated_at();

-- ============================================================ CUSTOMER COMPLAINTS
create table public.customer_complaints (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  customer_id uuid references public.customers(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  subject text not null,
  description text,
  severity text default 'medium' check (severity in ('low','medium','high','critical')),
  category text,
  status text not null default 'open' check (status in ('open','investigating','resolved','closed','escalated')),
  related_invoice_id uuid references public.invoices(id) on delete set null,
  related_order_id uuid references public.sales_orders(id) on delete set null,
  related_item_id uuid,
  assigned_to uuid references public.user_profiles(id) on delete set null,
  root_cause text,
  resolution text,
  capa_id uuid references public.capa_records(id) on delete set null,
  ncr_id uuid references public.non_conformance_reports(id) on delete set null,
  resolved_at timestamptz,
  resolved_by uuid references public.user_profiles(id) on delete set null,
  customer_satisfaction_rating int check (customer_satisfaction_rating between 1 and 5),
  notes text,
  attachments jsonb default '[]'::jsonb,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create index customer_complaints_tenant_idx on public.customer_complaints (tenant_id);
create index customer_complaints_customer_idx on public.customer_complaints (customer_id) where customer_id is not null;
create index customer_complaints_status_idx on public.customer_complaints (tenant_id, status);
create index customer_complaints_assigned_idx on public.customer_complaints (assigned_to) where assigned_to is not null;
create trigger trg_customer_complaints_updated_at before update on public.customer_complaints
  for each row execute function public.tg_set_updated_at();

-- Now hook capa_records.complaint_id back to customer_complaints.
alter table public.capa_records
  add constraint capa_complaint_fk foreign key (complaint_id) references public.customer_complaints(id) on delete set null;

-- ============================================================ RMA RECORDS
create table public.rma_records (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  customer_id uuid not null references public.customers(id) on delete restrict,
  invoice_id uuid references public.invoices(id) on delete set null,
  sales_order_id uuid references public.sales_orders(id) on delete set null,
  complaint_id uuid references public.customer_complaints(id) on delete set null,
  reason text,
  description text,
  status text not null default 'requested' check (status in ('requested','approved','rejected','received','inspected','refunded','closed','cancelled')),
  items jsonb default '[]'::jsonb,
  total_credit_cents bigint default 0,
  credit_note_id uuid references public.credit_notes(id) on delete set null,
  warehouse_id uuid,
  requested_at timestamptz default now(),
  approved_at timestamptz,
  approved_by uuid references public.user_profiles(id) on delete set null,
  received_at timestamptz,
  closed_at timestamptz,
  notes text,
  attachments jsonb default '[]'::jsonb,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create index rma_records_tenant_idx on public.rma_records (tenant_id);
create index rma_records_customer_idx on public.rma_records (customer_id);
create index rma_records_status_idx on public.rma_records (tenant_id, status);
create index rma_records_invoice_idx on public.rma_records (invoice_id) where invoice_id is not null;
create trigger trg_rma_records_updated_at before update on public.rma_records
  for each row execute function public.tg_set_updated_at();

-- ============================================================ EHS INCIDENTS
create table public.ehs_incidents (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  type text not null default 'injury' check (type in ('injury','near_miss','property_damage','environmental','illness','fatality','first_aid')),
  severity text not null default 'low' check (severity in ('low','medium','high','critical','catastrophic')),
  occurred_at timestamptz not null,
  reported_at timestamptz default now(),
  location text,
  branch_id uuid references public.branches(id) on delete set null,
  asset_id uuid references public.assets(id) on delete set null,
  description text not null,
  persons_involved jsonb default '[]'::jsonb,
  injured_employee_ids uuid[] default array[]::uuid[],
  immediate_action text,
  root_cause text,
  capa_id uuid references public.capa_records(id) on delete set null,
  status text not null default 'open' check (status in ('open','investigating','corrective_action','closed','reopened')),
  reported_by uuid references public.user_profiles(id) on delete set null,
  investigated_by uuid references public.user_profiles(id) on delete set null,
  closed_at timestamptz,
  cost_impact_cents bigint default 0,
  lost_time_hours numeric(8,2),
  regulatory_reportable boolean default false,
  reported_to_regulator boolean default false,
  attachments jsonb default '[]'::jsonb,
  notes text,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create index ehs_incidents_tenant_idx on public.ehs_incidents (tenant_id);
create index ehs_incidents_status_idx on public.ehs_incidents (tenant_id, status);
create index ehs_incidents_type_idx on public.ehs_incidents (tenant_id, type);
create index ehs_incidents_severity_idx on public.ehs_incidents (tenant_id, severity);
create index ehs_incidents_occurred_idx on public.ehs_incidents (tenant_id, occurred_at desc);
create trigger trg_ehs_incidents_updated_at before update on public.ehs_incidents
  for each row execute function public.tg_set_updated_at();

-- ============================================================ RLS
alter table public.quality_plans enable row level security;
alter table public.quality_inspections enable row level security;
alter table public.inspection_measurements enable row level security;
alter table public.non_conformance_reports enable row level security;
alter table public.capa_records enable row level security;
alter table public.spc_charts enable row level security;
alter table public.spc_measurements enable row level security;
alter table public.audit_programs enable row level security;
alter table public.audits enable row level security;
alter table public.audit_findings enable row level security;
alter table public.calibration_records enable row level security;
alter table public.customer_complaints enable row level security;
alter table public.rma_records enable row level security;
alter table public.assets enable row level security;
alter table public.asset_meters enable row level security;
alter table public.maintenance_schedules enable row level security;
alter table public.work_orders enable row level security;
alter table public.ehs_incidents enable row level security;

create policy quality_plans_rw on public.quality_plans for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy quality_inspections_rw on public.quality_inspections for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy inspection_measurements_rw on public.inspection_measurements for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy ncr_rw on public.non_conformance_reports for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy capa_records_rw on public.capa_records for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy spc_charts_rw on public.spc_charts for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy spc_measurements_rw on public.spc_measurements for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy audit_programs_rw on public.audit_programs for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy audits_rw on public.audits for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy audit_findings_rw on public.audit_findings for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy calibration_records_rw on public.calibration_records for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy customer_complaints_rw on public.customer_complaints for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy rma_records_rw on public.rma_records for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy assets_rw on public.assets for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy asset_meters_rw on public.asset_meters for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy maintenance_schedules_rw on public.maintenance_schedules for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy work_orders_rw on public.work_orders for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy ehs_incidents_rw on public.ehs_incidents for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
