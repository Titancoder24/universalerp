-- =============================================================================
-- Universal ERP - Default seed data (Migration 010)
-- =============================================================================
-- System-level defaults: plans, role templates, country chart of accounts
-- templates. Tenant data is seeded by the JS seeder script.

-- =============================================================================
-- Default plans
-- =============================================================================
insert into public.plans (code, name, description, monthly_price_cents, annual_price_cents, max_users, max_storage_gb, enabled_modules, features)
values
  ('starter', 'Starter', 'For small teams getting started', 9900, 99000, 10, 10,
    array['dashboard', 'inbox', 'calendar', 'sales', 'sales.customers', 'sales.invoices', 'sales.quotations',
          'crm', 'crm.leads', 'crm.opportunities', 'inventory', 'inventory.items',
          'accounting', 'accounting.coa', 'accounting.ar', 'accounting.ap',
          'documents', 'settings', 'settings.users', 'settings.appearance', 'chat'],
    '{"customer_portal": true, "vendor_portal": false, "ai": false, "white_label": false}'::jsonb),
  ('pro', 'Pro', 'For growing businesses', 39900, 399000, 50, 100,
    array['*'],
    '{"customer_portal": true, "vendor_portal": true, "ai": true, "white_label": false}'::jsonb),
  ('enterprise', 'Enterprise', 'For large organizations', 199900, 1999000, null, null,
    array['*'],
    '{"customer_portal": true, "vendor_portal": true, "ai": true, "white_label": true, "sso": true, "dedicated_support": true}'::jsonb)
on conflict (code) do nothing;

-- =============================================================================
-- System role templates
-- =============================================================================
insert into public.roles (tenant_id, code, name, description, is_system, module_access) values
  (null, 'tenant_admin', 'Tenant Admin', 'Full access to all modules in the tenant', true,
    '{"*": "admin"}'::jsonb),
  (null, 'salesperson', 'Salesperson', 'Sales, CRM, basic finance read access', true,
    '{"sales": "write", "crm": "write", "sales.customers": "write", "sales.quotations": "write",
      "sales.orders": "write", "sales.invoices": "read", "crm.leads": "write", "crm.opportunities": "write",
      "crm.contacts": "write", "crm.accounts": "write", "crm.activities": "write",
      "inventory.items": "read", "documents": "read", "chat": "read"}'::jsonb),
  (null, 'sales_manager', 'Sales Manager', 'Sales team management with approval rights', true,
    '{"sales": "approve", "crm": "approve", "marketing": "read", "reports": "read", "documents": "write", "chat": "read"}'::jsonb),
  (null, 'accountant', 'Accountant', 'Full accounting, read-only sales/procurement', true,
    '{"accounting": "admin", "sales.invoices": "write", "sales.customers": "read",
      "procurement.bills": "write", "procurement.vendors": "read", "reports": "read", "chat": "read"}'::jsonb),
  (null, 'finance_manager', 'Finance Manager', 'Full finance with approval', true,
    '{"accounting": "admin", "sales": "approve", "procurement": "approve", "hrms.payroll": "approve",
      "reports": "admin", "documents": "write", "chat": "read"}'::jsonb),
  (null, 'hr_admin', 'HR Admin', 'Full HR management', true,
    '{"hrms": "admin", "hrms.payroll": "approve", "documents": "write", "chat": "read"}'::jsonb),
  (null, 'recruiter', 'Recruiter', 'Recruitment focused', true,
    '{"hrms.recruitment": "admin", "hrms.candidates": "admin", "hrms.employees": "write",
      "hrms.onboarding": "write", "documents": "write", "chat": "read"}'::jsonb),
  (null, 'warehouse_supervisor', 'Warehouse Supervisor', 'Warehouse operations', true,
    '{"inventory": "approve", "procurement.receipts": "write", "inventory.counts": "write",
      "inventory.wms": "admin", "chat": "read"}'::jsonb),
  (null, 'warehouse_worker', 'Warehouse Worker', 'Basic warehouse access', true,
    '{"inventory.stock": "read", "inventory.movements": "write", "inventory.wms": "write",
      "procurement.receipts": "write", "chat": "read"}'::jsonb),
  (null, 'production_manager', 'Production Manager', 'Plant operations', true,
    '{"manufacturing": "admin", "inventory": "approve", "quality": "approve", "assets": "approve",
      "reports": "read", "chat": "read"}'::jsonb),
  (null, 'shop_operator', 'Shop Floor Operator', 'Operator terminal access', true,
    '{"manufacturing.shopfloor": "write", "manufacturing.work_orders": "read",
      "quality.inspections": "write", "chat": "read"}'::jsonb),
  (null, 'quality_inspector', 'Quality Inspector', 'Inspections and NCRs', true,
    '{"quality.inspections": "write", "quality.ncr": "write", "quality.capa": "read",
      "documents": "read", "chat": "read"}'::jsonb),
  (null, 'maintenance_tech', 'Maintenance Technician', 'Asset maintenance', true,
    '{"assets": "write", "assets.maintenance": "write", "documents": "read", "chat": "read"}'::jsonb),
  (null, 'procurement_officer', 'Procurement Officer', 'Vendor & PO management', true,
    '{"procurement": "write", "procurement.vendors": "write", "procurement.orders": "write",
      "procurement.rfq": "write", "procurement.requisitions": "write", "chat": "read"}'::jsonb),
  (null, 'project_manager', 'Project Manager', 'Project lifecycle', true,
    '{"projects": "admin", "crm.activities": "write", "documents": "write", "chat": "read"}'::jsonb),
  (null, 'customer_service_agent', 'Customer Service Agent', 'Support tickets', true,
    '{"service": "write", "service.tickets": "write", "service.kb": "read",
      "sales.customers": "read", "sales.invoices": "read", "chat": "read"}'::jsonb),
  (null, 'cashier', 'Cashier', 'POS terminal', true,
    '{"sales.pos": "write", "sales.customers": "read", "inventory.items": "read", "chat": "read"}'::jsonb),
  (null, 'driver', 'Driver', 'Delivery routes', true,
    '{"operations.routes": "read", "operations.fleet": "read", "documents": "read"}'::jsonb)
on conflict (tenant_id, code) do nothing;

-- =============================================================================
-- Exchange rates (will be auto-updated by daily ECB import)
-- =============================================================================
insert into public.exchange_rates (base_currency, quote_currency, rate, effective_date, source)
values
  ('USD', 'EUR', 0.92, current_date, 'manual_seed'),
  ('USD', 'GBP', 0.79, current_date, 'manual_seed'),
  ('USD', 'JPY', 149.23, current_date, 'manual_seed'),
  ('USD', 'INR', 83.12, current_date, 'manual_seed'),
  ('USD', 'CAD', 1.36, current_date, 'manual_seed'),
  ('USD', 'AUD', 1.52, current_date, 'manual_seed'),
  ('USD', 'CNY', 7.24, current_date, 'manual_seed'),
  ('USD', 'AED', 3.67, current_date, 'manual_seed'),
  ('EUR', 'USD', 1.09, current_date, 'manual_seed'),
  ('EUR', 'GBP', 0.86, current_date, 'manual_seed'),
  ('GBP', 'USD', 1.27, current_date, 'manual_seed')
on conflict do nothing;
