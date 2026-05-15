-- =============================================================================
-- Universal ERP - HR & Payroll (Migration 004)
-- =============================================================================

-- ============================================================ EMPLOYEES
create table public.employees (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_code text not null,
  user_id uuid references public.user_profiles(id) on delete set null,
  first_name text not null,
  middle_name text,
  last_name text not null,
  full_name text generated always as (trim(coalesce(first_name,'') || ' ' || coalesce(middle_name,'') || ' ' || coalesce(last_name,''))) stored,
  email text,
  personal_email text,
  phone text,
  mobile text,
  emergency_contact jsonb,
  date_of_birth date,
  gender text check (gender in ('male','female','non_binary','prefer_not_to_say') or gender is null),
  nationality text,
  marital_status text,
  national_id text,
  passport_number text,
  social_security_number text,
  tax_id text,
  blood_group text,
  address jsonb,
  photo_url text,
  department_id uuid references public.departments(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  designation text,
  job_title text,
  job_level text,
  manager_employee_id uuid references public.employees(id) on delete set null,
  employment_type text check (employment_type in ('full_time','part_time','contract','intern','consultant','temporary')),
  work_arrangement text default 'onsite' check (work_arrangement in ('onsite','remote','hybrid')),
  hire_date date,
  probation_end_date date,
  confirmation_date date,
  termination_date date,
  termination_reason text,
  rehire_eligible boolean default true,
  base_salary_cents bigint default 0,
  base_salary_currency text default 'USD',
  pay_frequency text default 'monthly' check (pay_frequency in ('weekly','biweekly','monthly','semimonthly','quarterly','annually')),
  hourly_rate_cents bigint default 0,
  bank_details jsonb,
  cost_center text,
  status text default 'active' check (status in ('active','on_leave','terminated','suspended','retired')),
  documents jsonb default '[]'::jsonb,
  skills text[] default array[]::text[],
  certifications jsonb default '[]'::jsonb,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, employee_code)
);
create index employees_tenant_idx on public.employees (tenant_id);
create index employees_dept_idx on public.employees (department_id);
create index employees_branch_idx on public.employees (branch_id);
create index employees_manager_idx on public.employees (manager_employee_id);
create index employees_user_idx on public.employees (user_id);
create index employees_name_trgm on public.employees using gin (full_name gin_trgm_ops);
create trigger trg_employees_updated_at before update on public.employees
  for each row execute function public.tg_set_updated_at();

-- ============================================================ SHIFTS
create table public.shifts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  start_time time not null,
  end_time time not null,
  break_minutes int default 60,
  working_days int[] default array[1,2,3,4,5],
  is_overnight boolean default false,
  grace_minutes int default 0,
  half_day_threshold_minutes int default 240,
  active boolean default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, code)
);

create table public.employee_shifts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  shift_id uuid not null references public.shifts(id) on delete cascade,
  effective_from date not null,
  effective_to date,
  created_at timestamptz not null default now()
);

-- ============================================================ ATTENDANCE
create table public.attendance_records (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  date date not null,
  check_in_at timestamptz,
  check_out_at timestamptz,
  check_in_lat numeric(10,7),
  check_in_lng numeric(10,7),
  check_out_lat numeric(10,7),
  check_out_lng numeric(10,7),
  check_in_photo_url text,
  check_out_photo_url text,
  total_minutes int,
  overtime_minutes int default 0,
  break_minutes int default 0,
  status text default 'present' check (status in ('present','absent','half_day','late','early_departure','wfh','leave','holiday','weekend')),
  source text default 'manual' check (source in ('manual','pwa','biometric','rfid','geofence','sso')),
  notes text,
  approved_by uuid references public.user_profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, employee_id, date)
);
create index attendance_tenant_idx on public.attendance_records (tenant_id);
create index attendance_employee_date_idx on public.attendance_records (employee_id, date desc);
create trigger trg_attendance_updated_at before update on public.attendance_records
  for each row execute function public.tg_set_updated_at();

-- ============================================================ LEAVE
create table public.leave_types (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  default_entitlement_days numeric(5,2) default 0,
  is_paid boolean default true,
  requires_approval boolean default true,
  carryover_max_days numeric(5,2) default 0,
  encashable boolean default false,
  applies_to_gender text,
  min_service_days int default 0,
  color text default '#6366f1',
  active boolean default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, code)
);

create table public.leave_balances (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  leave_type_id uuid not null references public.leave_types(id) on delete cascade,
  fiscal_year int not null,
  entitled numeric(7,2) default 0,
  carried_forward numeric(7,2) default 0,
  used numeric(7,2) default 0,
  pending numeric(7,2) default 0,
  remaining numeric(7,2) generated always as (entitled + carried_forward - used - pending) stored,
  updated_at timestamptz not null default now(),
  unique (employee_id, leave_type_id, fiscal_year)
);

create table public.leave_requests (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text,
  employee_id uuid not null references public.employees(id) on delete cascade,
  leave_type_id uuid not null references public.leave_types(id) on delete cascade,
  from_date date not null,
  to_date date not null,
  days numeric(5,2) not null,
  reason text,
  status text default 'pending' check (status in ('pending','approved','rejected','cancelled','withdrawn')),
  approver_id uuid references public.user_profiles(id) on delete set null,
  approved_at timestamptz,
  rejection_reason text,
  applied_at timestamptz default now(),
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index leave_requests_employee_idx on public.leave_requests (employee_id, applied_at desc);
create trigger trg_leave_requests_updated_at before update on public.leave_requests
  for each row execute function public.tg_set_updated_at();

create table public.holidays (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  date date not null,
  name text not null,
  type text default 'public' check (type in ('public','restricted','optional','company')),
  branch_ids uuid[] default array[]::uuid[],
  description text,
  created_at timestamptz not null default now(),
  unique (tenant_id, date, name)
);

-- ============================================================ PAYROLL
create table public.salary_components (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  type text not null check (type in ('earning','deduction','statutory','employer_contribution','reimbursement')),
  calculation_type text default 'fixed' check (calculation_type in ('fixed','percentage','formula')),
  default_amount_cents bigint default 0,
  percentage numeric(6,3),
  formula text,
  taxable boolean default true,
  appears_on_payslip boolean default true,
  is_statutory boolean default false,
  country_code text,
  sort_order int default 100,
  active boolean default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, code)
);

create table public.salary_structures (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_id uuid references public.employees(id) on delete cascade,
  template_id uuid,
  effective_from date not null,
  effective_to date,
  base_salary_cents bigint not null,
  currency text default 'USD',
  pay_frequency text default 'monthly',
  components jsonb default '[]'::jsonb,
  active boolean default true,
  created_at timestamptz not null default now()
);

create table public.payroll_runs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  period_start date not null,
  period_end date not null,
  pay_date date,
  branch_id uuid references public.branches(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  total_employees int default 0,
  total_gross_cents bigint default 0,
  total_deductions_cents bigint default 0,
  total_net_cents bigint default 0,
  currency text default 'USD',
  status text default 'draft' check (status in ('draft','calculated','approved','paid','cancelled')),
  approved_by uuid references public.user_profiles(id) on delete set null,
  approved_at timestamptz,
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create trigger trg_payroll_runs_updated_at before update on public.payroll_runs
  for each row execute function public.tg_set_updated_at();

create table public.payslips (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  run_id uuid not null references public.payroll_runs(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  number text,
  gross_cents bigint default 0,
  earnings_cents bigint default 0,
  deductions_cents bigint default 0,
  statutory_cents bigint default 0,
  reimbursements_cents bigint default 0,
  net_cents bigint default 0,
  ytd_gross_cents bigint default 0,
  ytd_net_cents bigint default 0,
  ytd_tax_cents bigint default 0,
  components jsonb default '[]'::jsonb,
  worked_days numeric(5,2),
  loss_of_pay_days numeric(5,2),
  pdf_url text,
  status text default 'draft' check (status in ('draft','approved','paid')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create index payslips_run_idx on public.payslips (run_id);
create index payslips_employee_idx on public.payslips (employee_id);

-- ============================================================ EXPENSES
create table public.expense_categories (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  account_id uuid,
  per_diem_limit_cents bigint,
  requires_receipt boolean default true,
  active boolean default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, code)
);

create table public.expense_reports (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  employee_id uuid not null references public.employees(id) on delete cascade,
  title text,
  period_start date,
  period_end date,
  total_cents bigint default 0,
  approved_cents bigint default 0,
  reimbursed_cents bigint default 0,
  currency text default 'USD',
  status text default 'draft' check (status in ('draft','submitted','approved','rejected','reimbursed','cancelled')),
  approver_id uuid references public.user_profiles(id) on delete set null,
  approved_at timestamptz,
  rejection_reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create trigger trg_expense_reports_updated_at before update on public.expense_reports
  for each row execute function public.tg_set_updated_at();

create table public.expense_items (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  report_id uuid not null references public.expense_reports(id) on delete cascade,
  category_id uuid references public.expense_categories(id) on delete set null,
  expense_date date,
  vendor_name text,
  description text,
  amount_cents bigint not null,
  currency text default 'USD',
  receipt_url text,
  ocr_data jsonb,
  duplicate_of_id uuid,
  policy_flags jsonb default '[]'::jsonb,
  approved boolean default false,
  notes text,
  created_at timestamptz not null default now()
);

-- ============================================================ JOBS & RECRUITMENT
create table public.job_postings (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  title text not null,
  department_id uuid references public.departments(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  location text,
  employment_type text,
  description text,
  responsibilities text,
  requirements text,
  benefits text,
  salary_min_cents bigint,
  salary_max_cents bigint,
  currency text default 'USD',
  status text default 'draft' check (status in ('draft','published','paused','closed','filled')),
  positions_open int default 1,
  positions_filled int default 0,
  hiring_manager_id uuid references public.user_profiles(id) on delete set null,
  recruiter_id uuid references public.user_profiles(id) on delete set null,
  published_at timestamptz,
  closes_at timestamptz,
  public_url_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create trigger trg_job_postings_updated_at before update on public.job_postings
  for each row execute function public.tg_set_updated_at();

create table public.candidates (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  first_name text not null,
  last_name text,
  email text,
  phone text,
  current_company text,
  current_title text,
  resume_url text,
  cover_letter text,
  ai_score int,
  ai_summary text,
  skills text[] default array[]::text[],
  experience_years numeric(4,1),
  status text default 'new' check (status in ('new','screening','phone_screen','onsite','assessment','offer','hired','rejected','withdrawn')),
  source text,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index candidates_tenant_idx on public.candidates (tenant_id);
create trigger trg_candidates_updated_at before update on public.candidates
  for each row execute function public.tg_set_updated_at();

create table public.applications (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  job_id uuid not null references public.job_postings(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  status text default 'applied' check (status in ('applied','screened','phone_screen','onsite','reference_check','offer','hired','rejected','withdrawn')),
  source text,
  applied_at timestamptz default now(),
  notes text,
  ai_match_score int,
  created_at timestamptz not null default now(),
  unique (job_id, candidate_id)
);

create table public.interviews (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  application_id uuid not null references public.applications(id) on delete cascade,
  round_name text,
  scheduled_at timestamptz,
  duration_minutes int default 60,
  format text default 'video' check (format in ('phone','video','in_person','assessment')),
  interviewer_ids uuid[] default array[]::uuid[],
  location text,
  meeting_url text,
  status text default 'scheduled' check (status in ('scheduled','completed','cancelled','no_show')),
  feedback jsonb default '[]'::jsonb,
  overall_rating int check (overall_rating between 1 and 5 or overall_rating is null),
  recommendation text check (recommendation in ('strong_yes','yes','maybe','no','strong_no') or recommendation is null),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================ PERFORMANCE
create table public.performance_reviews (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  reviewer_id uuid references public.user_profiles(id) on delete set null,
  cycle_name text,
  period_start date,
  period_end date,
  overall_rating numeric(3,2),
  self_assessment jsonb,
  manager_assessment jsonb,
  peer_feedback jsonb default '[]'::jsonb,
  goals jsonb default '[]'::jsonb,
  development_plan jsonb,
  promotion_recommended boolean default false,
  raise_pct numeric(5,2),
  bonus_cents bigint,
  status text default 'draft' check (status in ('draft','self_assessment','peer_review','manager_review','calibration','complete','acknowledged')),
  completed_at timestamptz,
  acknowledged_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.goals (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  parent_goal_id uuid references public.goals(id) on delete set null,
  level text not null check (level in ('company','department','team','individual')),
  owner_employee_id uuid references public.employees(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  title text not null,
  description text,
  metric_type text default 'numeric' check (metric_type in ('numeric','percentage','boolean','milestone','currency')),
  target_value numeric(15,2),
  current_value numeric(15,2),
  unit text,
  weight numeric(5,2),
  period text default 'quarterly',
  start_date date,
  end_date date,
  status text default 'on_track' check (status in ('not_started','on_track','at_risk','off_track','complete','cancelled')),
  progress_pct numeric(5,2) default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_goals_updated_at before update on public.goals
  for each row execute function public.tg_set_updated_at();

-- ============================================================ LEARNING
create table public.courses (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  title text not null,
  description text,
  category text,
  duration_minutes int,
  pass_score int default 70,
  is_mandatory boolean default false,
  validity_months int,
  content_url text,
  thumbnail_url text,
  author_id uuid references public.user_profiles(id) on delete set null,
  status text default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create trigger trg_courses_updated_at before update on public.courses
  for each row execute function public.tg_set_updated_at();

create table public.course_enrollments (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  enrolled_at timestamptz default now(),
  due_date date,
  started_at timestamptz,
  completed_at timestamptz,
  score int,
  status text default 'enrolled' check (status in ('enrolled','in_progress','completed','failed','expired')),
  certificate_url text,
  unique (course_id, employee_id)
);

-- ============================================================ RLS
alter table public.employees enable row level security;
alter table public.shifts enable row level security;
alter table public.employee_shifts enable row level security;
alter table public.attendance_records enable row level security;
alter table public.leave_types enable row level security;
alter table public.leave_balances enable row level security;
alter table public.leave_requests enable row level security;
alter table public.holidays enable row level security;
alter table public.salary_components enable row level security;
alter table public.salary_structures enable row level security;
alter table public.payroll_runs enable row level security;
alter table public.payslips enable row level security;
alter table public.expense_categories enable row level security;
alter table public.expense_reports enable row level security;
alter table public.expense_items enable row level security;
alter table public.job_postings enable row level security;
alter table public.candidates enable row level security;
alter table public.applications enable row level security;
alter table public.interviews enable row level security;
alter table public.performance_reviews enable row level security;
alter table public.goals enable row level security;
alter table public.courses enable row level security;
alter table public.course_enrollments enable row level security;

create policy employees_rw on public.employees for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy shifts_rw on public.shifts for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy employee_shifts_rw on public.employee_shifts for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy attendance_records_rw on public.attendance_records for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy leave_types_rw on public.leave_types for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy leave_balances_rw on public.leave_balances for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy leave_requests_rw on public.leave_requests for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy holidays_rw on public.holidays for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy salary_components_rw on public.salary_components for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy salary_structures_rw on public.salary_structures for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy payroll_runs_rw on public.payroll_runs for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy payslips_rw on public.payslips for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy expense_categories_rw on public.expense_categories for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy expense_reports_rw on public.expense_reports for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy expense_items_rw on public.expense_items for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy job_postings_rw on public.job_postings for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy candidates_rw on public.candidates for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy applications_rw on public.applications for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy interviews_rw on public.interviews for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy performance_reviews_rw on public.performance_reviews for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy goals_rw on public.goals for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy courses_rw on public.courses for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy course_enrollments_rw on public.course_enrollments for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
