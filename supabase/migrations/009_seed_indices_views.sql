-- =============================================================================
-- Universal ERP - Performance Indices and Views (Migration 009)
-- =============================================================================
-- Additional indices for common query patterns, plus materialized views for
-- dashboards.

-- =============================================================================
-- Sales performance indices
-- =============================================================================
create index if not exists invoices_outstanding_idx on public.invoices (tenant_id, status, due_date)
  where status in ('sent', 'viewed', 'partial', 'overdue');

create index if not exists invoices_paid_idx on public.invoices (tenant_id, paid_at)
  where status = 'paid';

create index if not exists quotations_expiring_idx on public.quotations (tenant_id, valid_until)
  where status in ('sent', 'viewed');

create index if not exists sales_orders_in_flight_idx on public.sales_orders (tenant_id, status, order_date)
  where status not in ('cancelled', 'invoiced');

-- =============================================================================
-- CRM indices
-- =============================================================================
create index if not exists opportunities_open_idx on public.opportunities (tenant_id, status, expected_close_date)
  where status = 'open';

create index if not exists leads_active_idx on public.leads (tenant_id, owner_id, score desc)
  where status in ('new', 'contacted', 'qualified');

create index if not exists activities_upcoming_idx on public.activities (tenant_id, owner_id, start_at)
  where status = 'pending' and start_at >= now();

-- =============================================================================
-- HR indices
-- =============================================================================
create index if not exists employees_active_idx on public.employees (tenant_id, status, department_id)
  where status = 'active';

create index if not exists attendance_today_idx on public.attendance_records (tenant_id, date desc, employee_id);

create index if not exists leave_pending_idx on public.leave_requests (tenant_id, approver_id, applied_at desc)
  where status = 'pending';

-- =============================================================================
-- Inventory indices
-- =============================================================================
create index if not exists stock_low_idx on public.stock_levels (tenant_id, item_id, quantity);

create index if not exists items_active_idx on public.items (tenant_id, active, category_id)
  where active = true;

-- =============================================================================
-- Dashboard views
-- =============================================================================

-- Total revenue by month per tenant
create or replace view public.v_revenue_by_month as
select
  tenant_id,
  date_trunc('month', issue_date) as month,
  currency,
  sum(total_cents) as revenue_cents,
  count(*) as invoice_count
from public.invoices
where status in ('paid', 'partial', 'sent', 'viewed', 'overdue')
group by tenant_id, date_trunc('month', issue_date), currency;

-- Open pipeline by stage
create or replace view public.v_pipeline_by_stage as
select
  o.tenant_id,
  s.pipeline_id,
  s.id as stage_id,
  s.name as stage_name,
  s.sort_order,
  count(*) as opportunity_count,
  sum(o.value_cents) as total_value_cents,
  sum(o.value_cents * (o.probability::numeric / 100)) as weighted_value_cents
from public.opportunities o
join public.pipeline_stages s on s.id = o.stage_id
where o.status = 'open'
group by o.tenant_id, s.pipeline_id, s.id, s.name, s.sort_order;

-- AR aging buckets
create or replace view public.v_ar_aging as
select
  tenant_id,
  customer_id,
  count(*) as invoice_count,
  sum(case when due_date >= current_date or due_date is null then balance_cents else 0 end) as current_cents,
  sum(case when due_date < current_date and due_date >= current_date - 30 then balance_cents else 0 end) as overdue_1_30_cents,
  sum(case when due_date < current_date - 30 and due_date >= current_date - 60 then balance_cents else 0 end) as overdue_31_60_cents,
  sum(case when due_date < current_date - 60 and due_date >= current_date - 90 then balance_cents else 0 end) as overdue_61_90_cents,
  sum(case when due_date < current_date - 90 then balance_cents else 0 end) as overdue_91_plus_cents,
  sum(balance_cents) as total_outstanding_cents
from public.invoices
where status in ('sent', 'viewed', 'partial', 'overdue') and balance_cents > 0
group by tenant_id, customer_id;

-- Top customers by revenue (last 12 months)
create or replace view public.v_top_customers as
select
  i.tenant_id,
  i.customer_id,
  c.display_name,
  count(*) as order_count,
  sum(i.total_cents) as revenue_cents,
  max(i.issue_date) as last_order_date
from public.invoices i
join public.customers c on c.id = i.customer_id
where i.issue_date >= current_date - interval '12 months'
  and i.status in ('paid', 'partial', 'sent', 'viewed')
group by i.tenant_id, i.customer_id, c.display_name;

-- Stock status alerts
create or replace view public.v_stock_alerts as
select
  s.tenant_id,
  s.item_id,
  i.code,
  i.name,
  s.warehouse_id,
  w.name as warehouse_name,
  sum(s.available_qty) as available_qty,
  i.reorder_point,
  i.reorder_qty,
  case
    when sum(s.available_qty) <= 0 then 'out_of_stock'
    when sum(s.available_qty) < i.reorder_point then 'low_stock'
    when sum(s.available_qty) > i.reorder_point * 3 then 'overstock'
    else 'normal'
  end as stock_status
from public.stock_levels s
join public.items i on i.id = s.item_id
join public.warehouses w on w.id = s.warehouse_id
group by s.tenant_id, s.item_id, i.code, i.name, s.warehouse_id, w.name, i.reorder_point, i.reorder_qty;

-- Attendance summary today
create or replace view public.v_attendance_today as
select
  e.tenant_id,
  e.department_id,
  count(distinct e.id) as total_employees,
  count(distinct ar.id) filter (where ar.status = 'present') as present_count,
  count(distinct ar.id) filter (where ar.status = 'absent') as absent_count,
  count(distinct ar.id) filter (where ar.status = 'late') as late_count,
  count(distinct ar.id) filter (where ar.status = 'leave') as on_leave_count,
  count(distinct ar.id) filter (where ar.status = 'wfh') as wfh_count
from public.employees e
left join public.attendance_records ar on ar.employee_id = e.id and ar.date = current_date
where e.status = 'active'
group by e.tenant_id, e.department_id;

-- Chat: unread counts per user per channel
create or replace view public.v_chat_unread_counts as
select
  cm.tenant_id,
  cm.channel_id,
  ccm.user_id,
  count(*) filter (where m.created_at > ccm.last_read_at) as unread_count,
  bool_or(m.mentions ? ccm.user_id::text) filter (where m.created_at > ccm.last_read_at) as has_mention
from public.chat_messages m
join public.chat_channels cm on cm.id = m.channel_id
join public.chat_channel_members ccm on ccm.channel_id = m.channel_id
where m.user_id != ccm.user_id  -- Don't count own messages
group by cm.tenant_id, cm.channel_id, ccm.user_id, ccm.last_read_at;
