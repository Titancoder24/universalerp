-- =============================================================================
-- Universal ERP - Inventory & Procurement (Migration 003)
-- =============================================================================

-- ============================================================ ITEM MASTER
create table public.item_categories (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  parent_id uuid references public.item_categories(id) on delete set null,
  code text not null,
  name text not null,
  description text,
  account_revenue_id uuid,
  account_cogs_id uuid,
  account_asset_id uuid,
  active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create trigger trg_item_categories_updated_at before update on public.item_categories
  for each row execute function public.tg_set_updated_at();

create table public.items (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  sku text,
  barcode text,
  name text not null,
  description text,
  category_id uuid references public.item_categories(id) on delete set null,
  unit_of_measure text default 'each',
  type text default 'goods' check (type in ('goods','service','digital','bundle','combo')),
  is_stockable boolean default true,
  is_sellable boolean default true,
  is_purchasable boolean default true,
  is_manufactured boolean default false,
  is_subcontracted boolean default false,
  has_variants boolean default false,
  has_batch_tracking boolean default false,
  has_serial_tracking boolean default false,
  has_expiry boolean default false,
  shelf_life_days int,
  costing_method text default 'fifo' check (costing_method in ('fifo','lifo','weighted_average','standard')),
  standard_cost_cents bigint default 0,
  list_price_cents bigint default 0,
  weight_kg numeric(10,3),
  volume_m3 numeric(10,4),
  dimensions_cm jsonb,
  hsn_code text,
  tax_code_id uuid references public.tax_codes(id) on delete set null,
  reorder_qty numeric(18,4) default 0,
  reorder_point numeric(18,4) default 0,
  safety_stock numeric(18,4) default 0,
  lead_time_days int default 0,
  preferred_vendor_id uuid,
  image_url text,
  thumbnail_url text,
  custom_fields jsonb default '{}'::jsonb,
  tags text[] default array[]::text[],
  active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create index items_tenant_idx on public.items (tenant_id);
create index items_category_idx on public.items (category_id);
create index items_name_trgm on public.items using gin (name gin_trgm_ops);
create index items_sku_idx on public.items (lower(sku)) where sku is not null;
create index items_barcode_idx on public.items (barcode) where barcode is not null;
create trigger trg_items_updated_at before update on public.items
  for each row execute function public.tg_set_updated_at();

create table public.item_variants (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  parent_item_id uuid not null references public.items(id) on delete cascade,
  code text not null,
  sku text,
  barcode text,
  attributes jsonb not null default '{}'::jsonb,
  unit_price_cents bigint,
  standard_cost_cents bigint,
  image_url text,
  active boolean default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create index item_variants_parent_idx on public.item_variants (parent_item_id);

create table public.item_prices (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  price_list_id uuid,
  customer_id uuid references public.customers(id) on delete set null,
  min_quantity numeric(18,4) default 1,
  unit_price_cents bigint not null,
  currency text default 'USD',
  valid_from date,
  valid_until date,
  created_at timestamptz not null default now()
);
create index item_prices_item_idx on public.item_prices (item_id);

create table public.price_lists (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  currency text default 'USD',
  customer_category text,
  is_default boolean default false,
  active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);

-- ============================================================ WAREHOUSES & BINS
create table public.warehouses (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  type text default 'physical' check (type in ('physical','virtual','consignment','quarantine','in_transit')),
  address jsonb,
  branch_id uuid references public.branches(id) on delete set null,
  manager_user_id uuid references public.user_profiles(id) on delete set null,
  active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create trigger trg_warehouses_updated_at before update on public.warehouses
  for each row execute function public.tg_set_updated_at();

create table public.bin_locations (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  warehouse_id uuid not null references public.warehouses(id) on delete cascade,
  code text not null,
  aisle text,
  rack text,
  shelf text,
  bin text,
  is_pickable boolean default true,
  capacity numeric(18,4),
  active boolean default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, warehouse_id, code)
);
create index bin_locations_warehouse_idx on public.bin_locations (warehouse_id);

-- ============================================================ INVENTORY STOCK
create table public.stock_levels (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  variant_id uuid references public.item_variants(id) on delete cascade,
  warehouse_id uuid not null references public.warehouses(id) on delete cascade,
  bin_id uuid references public.bin_locations(id) on delete set null,
  batch_number text,
  serial_number text,
  expiry_date date,
  quantity numeric(18,4) not null default 0,
  reserved_qty numeric(18,4) default 0,
  available_qty numeric(18,4) generated always as (quantity - reserved_qty) stored,
  unit_cost_cents bigint default 0,
  last_movement_at timestamptz,
  updated_at timestamptz not null default now()
);
create unique index stock_levels_unique_idx on public.stock_levels (
  tenant_id, item_id, coalesce(variant_id::text,''), warehouse_id, coalesce(bin_id::text,''), coalesce(batch_number,''), coalesce(serial_number,'')
);
create index stock_levels_item_idx on public.stock_levels (item_id);
create index stock_levels_warehouse_idx on public.stock_levels (warehouse_id);
create index stock_levels_expiry_idx on public.stock_levels (expiry_date) where expiry_date is not null;

create table public.stock_movements (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  movement_type text not null check (movement_type in (
    'receipt','issue','transfer','adjustment','return','manufacture_consume',
    'manufacture_produce','sale','purchase','count_adjust','scrap','reservation'
  )),
  item_id uuid not null references public.items(id) on delete restrict,
  variant_id uuid references public.item_variants(id) on delete set null,
  warehouse_id uuid not null references public.warehouses(id) on delete restrict,
  destination_warehouse_id uuid references public.warehouses(id) on delete set null,
  bin_id uuid references public.bin_locations(id) on delete set null,
  destination_bin_id uuid references public.bin_locations(id) on delete set null,
  quantity numeric(18,4) not null,
  unit_cost_cents bigint default 0,
  total_cost_cents bigint default 0,
  batch_number text,
  serial_number text,
  expiry_date date,
  reference_type text,
  reference_id uuid,
  reference_number text,
  notes text,
  performed_by uuid references public.user_profiles(id) on delete set null,
  movement_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index stock_movements_item_idx on public.stock_movements (item_id, movement_date desc);
create index stock_movements_warehouse_idx on public.stock_movements (warehouse_id, movement_date desc);
create index stock_movements_ref_idx on public.stock_movements (reference_type, reference_id);

-- ============================================================ VENDORS
create table public.vendors (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  display_name text not null,
  legal_name text,
  category text,
  tax_id text,
  vat_number text,
  email text,
  phone text,
  website text,
  primary_address jsonb,
  remit_to_address jsonb,
  currency text default 'USD',
  payment_terms_days int default 30,
  default_account_id uuid,
  bank_details jsonb,
  performance_score numeric(4,2),
  on_time_rate numeric(5,2),
  quality_rate numeric(5,2),
  portal_enabled boolean default false,
  kyc_status text default 'pending' check (kyc_status in ('pending','approved','rejected','expired')),
  kyc_documents jsonb default '[]'::jsonb,
  certifications jsonb default '[]'::jsonb,
  notes text,
  tags text[] default array[]::text[],
  custom_fields jsonb default '{}'::jsonb,
  active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create index vendors_tenant_idx on public.vendors (tenant_id);
create index vendors_name_trgm on public.vendors using gin (display_name gin_trgm_ops);
create trigger trg_vendors_updated_at before update on public.vendors
  for each row execute function public.tg_set_updated_at();

alter table public.contacts
  add constraint contacts_vendor_fk foreign key (vendor_id) references public.vendors(id) on delete cascade;

alter table public.items
  add constraint items_vendor_fk foreign key (preferred_vendor_id) references public.vendors(id) on delete set null;

alter table public.payments
  add constraint payments_vendor_fk foreign key (vendor_id) references public.vendors(id) on delete set null;

-- ============================================================ PURCHASE REQUISITIONS
create table public.purchase_requisitions (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  request_date date default current_date,
  required_by_date date,
  requester_id uuid references public.user_profiles(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  status text default 'draft' check (status in ('draft','submitted','approved','rejected','converted','cancelled')),
  approval_chain jsonb default '[]'::jsonb,
  total_cents bigint default 0,
  currency text default 'USD',
  justification text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create trigger trg_purchase_requisitions_updated_at before update on public.purchase_requisitions
  for each row execute function public.tg_set_updated_at();

create table public.purchase_requisition_lines (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  requisition_id uuid not null references public.purchase_requisitions(id) on delete cascade,
  sort_order int default 0,
  item_id uuid references public.items(id) on delete set null,
  description text not null,
  quantity numeric(18,4) not null default 1,
  unit text default 'each',
  estimated_price_cents bigint default 0,
  preferred_vendor_id uuid references public.vendors(id) on delete set null,
  required_by_date date,
  created_at timestamptz not null default now()
);

-- ============================================================ RFQs / RFPs
create table public.rfqs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  title text not null,
  type text default 'rfq' check (type in ('rfq','rfp')),
  description text,
  issue_date date default current_date,
  bid_deadline timestamptz,
  status text default 'draft' check (status in ('draft','published','closed','awarded','cancelled')),
  buyer_id uuid references public.user_profiles(id) on delete set null,
  currency text default 'USD',
  evaluation_criteria jsonb default '[]'::jsonb,
  awarded_vendor_id uuid references public.vendors(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create trigger trg_rfqs_updated_at before update on public.rfqs
  for each row execute function public.tg_set_updated_at();

create table public.rfq_lines (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  sort_order int default 0,
  item_id uuid references public.items(id) on delete set null,
  description text,
  quantity numeric(18,4) default 1,
  unit text default 'each',
  specifications text,
  created_at timestamptz not null default now()
);

create table public.rfq_vendors (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  status text default 'invited' check (status in ('invited','responded','declined','awarded')),
  invited_at timestamptz default now(),
  responded_at timestamptz,
  ai_score numeric(5,2),
  total_quote_cents bigint,
  proposed_lead_time_days int,
  notes text,
  unique (rfq_id, vendor_id)
);

create table public.rfq_responses (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  rfq_line_id uuid references public.rfq_lines(id) on delete cascade,
  unit_price_cents bigint,
  lead_time_days int,
  notes text,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================ PURCHASE ORDERS
create table public.purchase_orders (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  vendor_id uuid not null references public.vendors(id) on delete restrict,
  rfq_id uuid references public.rfqs(id) on delete set null,
  requisition_id uuid references public.purchase_requisitions(id) on delete set null,
  order_date date default current_date,
  delivery_date date,
  ship_to_address jsonb,
  bill_to_address jsonb,
  currency text default 'USD',
  exchange_rate numeric(18,8) default 1,
  subtotal_cents bigint default 0,
  discount_cents bigint default 0,
  tax_cents bigint default 0,
  shipping_cents bigint default 0,
  total_cents bigint default 0,
  status text default 'draft' check (status in ('draft','sent','acknowledged','partial','received','closed','cancelled')),
  receive_status text default 'pending' check (receive_status in ('pending','partial','complete')),
  bill_status text default 'pending' check (bill_status in ('pending','partial','complete')),
  payment_terms text,
  notes text,
  buyer_id uuid references public.user_profiles(id) on delete set null,
  acknowledged_at timestamptz,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create index purchase_orders_tenant_idx on public.purchase_orders (tenant_id);
create index purchase_orders_vendor_idx on public.purchase_orders (vendor_id);
create trigger trg_purchase_orders_updated_at before update on public.purchase_orders
  for each row execute function public.tg_set_updated_at();

create table public.purchase_order_lines (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  po_id uuid not null references public.purchase_orders(id) on delete cascade,
  sort_order int default 0,
  item_id uuid references public.items(id) on delete set null,
  item_code text,
  description text not null,
  quantity numeric(18,4) not null default 1,
  unit text default 'each',
  received_qty numeric(18,4) default 0,
  billed_qty numeric(18,4) default 0,
  unit_price_cents bigint not null default 0,
  discount_pct numeric(6,3) default 0,
  tax_code_id uuid references public.tax_codes(id) on delete set null,
  tax_rate_pct numeric(6,3) default 0,
  tax_cents bigint default 0,
  total_cents bigint default 0,
  warehouse_id uuid references public.warehouses(id) on delete set null,
  delivery_date date,
  created_at timestamptz not null default now()
);
create index po_lines_po_idx on public.purchase_order_lines (po_id);

-- ============================================================ GOODS RECEIPTS
create table public.goods_receipts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  po_id uuid references public.purchase_orders(id) on delete set null,
  vendor_id uuid references public.vendors(id) on delete set null,
  warehouse_id uuid not null references public.warehouses(id) on delete restrict,
  receipt_date date default current_date,
  status text default 'draft' check (status in ('draft','received','inspected','rejected','closed')),
  carrier text,
  tracking_number text,
  received_by uuid references public.user_profiles(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create trigger trg_goods_receipts_updated_at before update on public.goods_receipts
  for each row execute function public.tg_set_updated_at();

create table public.goods_receipt_lines (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  receipt_id uuid not null references public.goods_receipts(id) on delete cascade,
  po_line_id uuid references public.purchase_order_lines(id) on delete set null,
  item_id uuid references public.items(id) on delete set null,
  description text,
  quantity_received numeric(18,4) not null,
  quantity_accepted numeric(18,4),
  quantity_rejected numeric(18,4) default 0,
  bin_id uuid references public.bin_locations(id) on delete set null,
  batch_number text,
  serial_numbers text[],
  expiry_date date,
  condition_notes text,
  created_at timestamptz not null default now()
);

-- ============================================================ VENDOR BILLS
create table public.vendor_bills (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  vendor_ref text,
  vendor_id uuid not null references public.vendors(id) on delete restrict,
  po_id uuid references public.purchase_orders(id) on delete set null,
  receipt_id uuid references public.goods_receipts(id) on delete set null,
  bill_date date default current_date,
  due_date date,
  currency text default 'USD',
  exchange_rate numeric(18,8) default 1,
  subtotal_cents bigint default 0,
  tax_cents bigint default 0,
  shipping_cents bigint default 0,
  total_cents bigint default 0,
  paid_cents bigint default 0,
  balance_cents bigint default 0,
  status text default 'draft' check (status in ('draft','pending_approval','approved','rejected','paid','partial','overdue','cancelled')),
  three_way_match text default 'pending' check (three_way_match in ('pending','matched','mismatch','approved_with_variance')),
  notes text,
  pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, vendor_id, number)
);
create trigger trg_vendor_bills_updated_at before update on public.vendor_bills
  for each row execute function public.tg_set_updated_at();

create table public.vendor_bill_lines (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  bill_id uuid not null references public.vendor_bills(id) on delete cascade,
  po_line_id uuid references public.purchase_order_lines(id) on delete set null,
  item_id uuid references public.items(id) on delete set null,
  description text,
  quantity numeric(18,4) default 1,
  unit_price_cents bigint not null default 0,
  tax_code_id uuid references public.tax_codes(id) on delete set null,
  tax_rate_pct numeric(6,3) default 0,
  tax_cents bigint default 0,
  total_cents bigint default 0,
  account_id uuid,
  created_at timestamptz not null default now()
);

alter table public.payment_applications
  add constraint payment_apps_bill_fk foreign key (bill_id) references public.vendor_bills(id) on delete set null;

-- ============================================================ STOCK COUNTS
create table public.stock_counts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  warehouse_id uuid not null references public.warehouses(id) on delete restrict,
  count_type text default 'cycle' check (count_type in ('cycle','annual','spot','ad_hoc')),
  status text default 'planned' check (status in ('planned','in_progress','review','approved','posted','cancelled')),
  scheduled_for date,
  completed_at timestamptz,
  approved_by uuid references public.user_profiles(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create trigger trg_stock_counts_updated_at before update on public.stock_counts
  for each row execute function public.tg_set_updated_at();

create table public.stock_count_lines (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  count_id uuid not null references public.stock_counts(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete restrict,
  bin_id uuid references public.bin_locations(id) on delete set null,
  expected_qty numeric(18,4) default 0,
  counted_qty numeric(18,4),
  variance_qty numeric(18,4) generated always as (coalesce(counted_qty,0) - expected_qty) stored,
  variance_value_cents bigint,
  notes text,
  counted_by uuid references public.user_profiles(id) on delete set null,
  counted_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================ RLS
alter table public.item_categories enable row level security;
alter table public.items enable row level security;
alter table public.item_variants enable row level security;
alter table public.item_prices enable row level security;
alter table public.price_lists enable row level security;
alter table public.warehouses enable row level security;
alter table public.bin_locations enable row level security;
alter table public.stock_levels enable row level security;
alter table public.stock_movements enable row level security;
alter table public.vendors enable row level security;
alter table public.purchase_requisitions enable row level security;
alter table public.purchase_requisition_lines enable row level security;
alter table public.rfqs enable row level security;
alter table public.rfq_lines enable row level security;
alter table public.rfq_vendors enable row level security;
alter table public.rfq_responses enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.purchase_order_lines enable row level security;
alter table public.goods_receipts enable row level security;
alter table public.goods_receipt_lines enable row level security;
alter table public.vendor_bills enable row level security;
alter table public.vendor_bill_lines enable row level security;
alter table public.stock_counts enable row level security;
alter table public.stock_count_lines enable row level security;

create policy item_categories_rw on public.item_categories for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy items_rw on public.items for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy item_variants_rw on public.item_variants for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy item_prices_rw on public.item_prices for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy price_lists_rw on public.price_lists for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy warehouses_rw on public.warehouses for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy bin_locations_rw on public.bin_locations for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy stock_levels_rw on public.stock_levels for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy stock_movements_rw on public.stock_movements for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy vendors_rw on public.vendors for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy purchase_requisitions_rw on public.purchase_requisitions for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy purchase_requisition_lines_rw on public.purchase_requisition_lines for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy rfqs_rw on public.rfqs for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy rfq_lines_rw on public.rfq_lines for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy rfq_vendors_rw on public.rfq_vendors for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy rfq_responses_rw on public.rfq_responses for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy purchase_orders_rw on public.purchase_orders for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy purchase_order_lines_rw on public.purchase_order_lines for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy goods_receipts_rw on public.goods_receipts for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy goods_receipt_lines_rw on public.goods_receipt_lines for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy vendor_bills_rw on public.vendor_bills for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy vendor_bill_lines_rw on public.vendor_bill_lines for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy stock_counts_rw on public.stock_counts for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy stock_count_lines_rw on public.stock_count_lines for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
