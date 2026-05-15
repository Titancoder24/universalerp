export type CustomerStatus = 'active' | 'inactive' | 'on_hold' | 'pending';

export interface Customer {
  id: string;
  code: string;
  name: string;
  industry: string;
  country: string;
  countryCode: string;
  revenue: number;
  outstanding: number;
  lastOrder: string;
  salesRep: string;
  status: CustomerStatus;
  email: string;
  phone: string;
  website: string;
  taxId: string;
  paymentTerms: string;
  creditLimit: number;
  joinedAt: string;
}

export const customers: Customer[] = [
  {
    id: 'acme-industries',
    code: 'CUST-0001',
    name: 'Acme Industries',
    industry: 'Manufacturing',
    country: 'United States',
    countryCode: 'US',
    revenue: 312420,
    outstanding: 28450,
    lastOrder: '2026-05-12',
    salesRep: 'Sarah Chen',
    status: 'active',
    email: 'billing@acmeindustries.com',
    phone: '+1 (415) 555-0142',
    website: 'acmeindustries.com',
    taxId: 'US-94-1234567',
    paymentTerms: 'Net 30',
    creditLimit: 250000,
    joinedAt: '2021-03-14',
  },
  {
    id: 'global-manufacturing',
    code: 'CUST-0002',
    name: 'Global Manufacturing Co',
    industry: 'Manufacturing',
    country: 'Germany',
    countryCode: 'DE',
    revenue: 248950,
    outstanding: 0,
    lastOrder: '2026-05-08',
    salesRep: 'Marcus Reid',
    status: 'active',
    email: 'ap@global-mfg.de',
    phone: '+49 30 555 0188',
    website: 'global-mfg.de',
    taxId: 'DE123456789',
    paymentTerms: 'Net 60',
    creditLimit: 500000,
    joinedAt: '2019-11-02',
  },
  {
    id: 'techcorp-solutions',
    code: 'CUST-0003',
    name: 'TechCorp Solutions',
    industry: 'Technology',
    country: 'United States',
    countryCode: 'US',
    revenue: 198200,
    outstanding: 14200,
    lastOrder: '2026-05-10',
    salesRep: 'Sarah Chen',
    status: 'active',
    email: 'accounting@techcorp.io',
    phone: '+1 (212) 555-0177',
    website: 'techcorp.io',
    taxId: 'US-13-9876543',
    paymentTerms: 'Net 15',
    creditLimit: 150000,
    joinedAt: '2022-06-18',
  },
  {
    id: 'hospital-network',
    code: 'CUST-0004',
    name: 'Hospital Network LLC',
    industry: 'Healthcare',
    country: 'United States',
    countryCode: 'US',
    revenue: 162800,
    outstanding: 42900,
    lastOrder: '2026-05-01',
    salesRep: 'Marcus Reid',
    status: 'active',
    email: 'procurement@hospitalnetwork.org',
    phone: '+1 (617) 555-0193',
    website: 'hospitalnetwork.org',
    taxId: 'US-04-5432109',
    paymentTerms: 'Net 45',
    creditLimit: 300000,
    joinedAt: '2020-08-22',
  },
  {
    id: 'northwest-logistics',
    code: 'CUST-0005',
    name: 'Northwest Logistics',
    industry: 'Transportation',
    country: 'Canada',
    countryCode: 'CA',
    revenue: 142400,
    outstanding: 8920,
    lastOrder: '2026-05-13',
    salesRep: 'Jenna Park',
    status: 'active',
    email: 'finance@nwlogistics.ca',
    phone: '+1 (604) 555-0156',
    website: 'nwlogistics.ca',
    taxId: 'CA-123456789-RT0001',
    paymentTerms: 'Net 30',
    creditLimit: 175000,
    joinedAt: '2021-09-30',
  },
  {
    id: 'apex-retail',
    code: 'CUST-0006',
    name: 'Apex Retail Group',
    industry: 'Retail',
    country: 'United Kingdom',
    countryCode: 'GB',
    revenue: 124300,
    outstanding: 0,
    lastOrder: '2026-04-28',
    salesRep: 'David Kumar',
    status: 'active',
    email: 'ar@apexretail.co.uk',
    phone: '+44 20 7555 0142',
    website: 'apexretail.co.uk',
    taxId: 'GB123456789',
    paymentTerms: 'Net 30',
    creditLimit: 200000,
    joinedAt: '2022-01-15',
  },
  {
    id: 'enterprise-ltd',
    code: 'CUST-0007',
    name: 'Enterprise Ltd',
    industry: 'Financial Services',
    country: 'United States',
    countryCode: 'US',
    revenue: 118600,
    outstanding: 22400,
    lastOrder: '2026-05-09',
    salesRep: 'Emily Rodriguez',
    status: 'active',
    email: 'invoices@enterpriseltd.com',
    phone: '+1 (312) 555-0188',
    website: 'enterpriseltd.com',
    taxId: 'US-36-1122334',
    paymentTerms: 'Net 30',
    creditLimit: 250000,
    joinedAt: '2020-04-08',
  },
  {
    id: 'startup-co',
    code: 'CUST-0008',
    name: 'StartupCo',
    industry: 'Technology',
    country: 'United States',
    countryCode: 'US',
    revenue: 89400,
    outstanding: 3200,
    lastOrder: '2026-05-11',
    salesRep: 'Sarah Chen',
    status: 'active',
    email: 'finance@startupco.io',
    phone: '+1 (415) 555-0123',
    website: 'startupco.io',
    taxId: 'US-45-1234567',
    paymentTerms: 'Net 15',
    creditLimit: 50000,
    joinedAt: '2023-02-14',
  },
  {
    id: 'regional-bank',
    code: 'CUST-0009',
    name: 'Regional Bank Corp',
    industry: 'Financial Services',
    country: 'United States',
    countryCode: 'US',
    revenue: 76800,
    outstanding: 0,
    lastOrder: '2026-04-22',
    salesRep: 'Jenna Park',
    status: 'on_hold',
    email: 'vendors@regionalbank.com',
    phone: '+1 (704) 555-0167',
    website: 'regionalbank.com',
    taxId: 'US-58-9988776',
    paymentTerms: 'Net 60',
    creditLimit: 100000,
    joinedAt: '2019-07-11',
  },
  {
    id: 'green-energy',
    code: 'CUST-0010',
    name: 'Green Energy Partners',
    industry: 'Energy',
    country: 'Spain',
    countryCode: 'ES',
    revenue: 68200,
    outstanding: 5400,
    lastOrder: '2026-05-05',
    salesRep: 'Marcus Reid',
    status: 'active',
    email: 'cuentas@greenenergy.es',
    phone: '+34 91 555 0142',
    website: 'greenenergy.es',
    taxId: 'ES-B12345678',
    paymentTerms: 'Net 30',
    creditLimit: 120000,
    joinedAt: '2022-10-04',
  },
  {
    id: 'bluewave-marine',
    code: 'CUST-0011',
    name: 'Bluewave Marine',
    industry: 'Transportation',
    country: 'Australia',
    countryCode: 'AU',
    revenue: 64500,
    outstanding: 12800,
    lastOrder: '2026-04-30',
    salesRep: 'David Kumar',
    status: 'active',
    email: 'admin@bluewave.com.au',
    phone: '+61 2 5550 0177',
    website: 'bluewave.com.au',
    taxId: 'AU-12345678901',
    paymentTerms: 'Net 30',
    creditLimit: 100000,
    joinedAt: '2021-11-28',
  },
  {
    id: 'pinnacle-construction',
    code: 'CUST-0012',
    name: 'Pinnacle Construction',
    industry: 'Construction',
    country: 'United States',
    countryCode: 'US',
    revenue: 58900,
    outstanding: 18200,
    lastOrder: '2026-04-25',
    salesRep: 'Sarah Chen',
    status: 'active',
    email: 'ap@pinnacleconstruct.com',
    phone: '+1 (713) 555-0199',
    website: 'pinnacleconstruct.com',
    taxId: 'US-74-2345678',
    paymentTerms: 'Net 45',
    creditLimit: 175000,
    joinedAt: '2020-12-07',
  },
  {
    id: 'sunny-foods',
    code: 'CUST-0013',
    name: 'Sunny Foods Inc',
    industry: 'Food & Beverage',
    country: 'United States',
    countryCode: 'US',
    revenue: 52400,
    outstanding: 0,
    lastOrder: '2026-05-04',
    salesRep: 'Emily Rodriguez',
    status: 'active',
    email: 'finance@sunnyfoods.com',
    phone: '+1 (619) 555-0188',
    website: 'sunnyfoods.com',
    taxId: 'US-95-1234567',
    paymentTerms: 'Net 15',
    creditLimit: 75000,
    joinedAt: '2022-03-22',
  },
  {
    id: 'horizon-pharma',
    code: 'CUST-0014',
    name: 'Horizon Pharmaceuticals',
    industry: 'Healthcare',
    country: 'France',
    countryCode: 'FR',
    revenue: 48200,
    outstanding: 7800,
    lastOrder: '2026-05-02',
    salesRep: 'Marcus Reid',
    status: 'active',
    email: 'comptes@horizonpharma.fr',
    phone: '+33 1 5555 0142',
    website: 'horizonpharma.fr',
    taxId: 'FR-12345678901',
    paymentTerms: 'Net 60',
    creditLimit: 150000,
    joinedAt: '2021-05-19',
  },
  {
    id: 'metro-electric',
    code: 'CUST-0015',
    name: 'Metro Electric',
    industry: 'Utilities',
    country: 'United States',
    countryCode: 'US',
    revenue: 42100,
    outstanding: 9200,
    lastOrder: '2026-04-18',
    salesRep: 'James Liu',
    status: 'inactive',
    email: 'ap@metroelectric.com',
    phone: '+1 (404) 555-0177',
    website: 'metroelectric.com',
    taxId: 'US-58-3456789',
    paymentTerms: 'Net 30',
    creditLimit: 100000,
    joinedAt: '2018-08-14',
  },
  {
    id: 'oceanside-resorts',
    code: 'CUST-0016',
    name: 'Oceanside Resorts',
    industry: 'Hospitality',
    country: 'Mexico',
    countryCode: 'MX',
    revenue: 38400,
    outstanding: 4200,
    lastOrder: '2026-04-29',
    salesRep: 'Jenna Park',
    status: 'active',
    email: 'cuentas@oceansideresorts.mx',
    phone: '+52 33 5555 0142',
    website: 'oceansideresorts.mx',
    taxId: 'MX-OCR091203ABC',
    paymentTerms: 'Net 30',
    creditLimit: 75000,
    joinedAt: '2022-09-08',
  },
  {
    id: 'titan-aerospace',
    code: 'CUST-0017',
    name: 'Titan Aerospace',
    industry: 'Aerospace',
    country: 'United States',
    countryCode: 'US',
    revenue: 34800,
    outstanding: 0,
    lastOrder: '2026-04-22',
    salesRep: 'David Kumar',
    status: 'active',
    email: 'invoices@titanaerospace.com',
    phone: '+1 (321) 555-0188',
    website: 'titanaerospace.com',
    taxId: 'US-65-1234567',
    paymentTerms: 'Net 90',
    creditLimit: 500000,
    joinedAt: '2019-02-26',
  },
  {
    id: 'velocity-sports',
    code: 'CUST-0018',
    name: 'Velocity Sports',
    industry: 'Retail',
    country: 'Italy',
    countryCode: 'IT',
    revenue: 28200,
    outstanding: 6800,
    lastOrder: '2026-04-15',
    salesRep: 'Emily Rodriguez',
    status: 'pending',
    email: 'contabilita@velocitysports.it',
    phone: '+39 02 5555 0142',
    website: 'velocitysports.it',
    taxId: 'IT-12345678901',
    paymentTerms: 'Net 30',
    creditLimit: 50000,
    joinedAt: '2023-08-11',
  },
];

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';

export interface Quotation {
  id: string;
  number: string;
  customer: string;
  customerId: string;
  amount: number;
  status: QuoteStatus;
  validUntil: string;
  issuedAt: string;
  owner: string;
  version: number;
  items: number;
}

export const quotations: Quotation[] = [
  { id: 'Q-1098', number: 'Q-1098', customer: 'Acme Industries', customerId: 'acme-industries', amount: 84200, status: 'sent', validUntil: '2026-06-15', issuedAt: '2026-05-14', owner: 'Sarah Chen', version: 1, items: 8 },
  { id: 'Q-1097', number: 'Q-1097', customer: 'Hospital Network LLC', customerId: 'hospital-network', amount: 56800, status: 'viewed', validUntil: '2026-06-10', issuedAt: '2026-05-13', owner: 'Marcus Reid', version: 2, items: 12 },
  { id: 'Q-1096', number: 'Q-1096', customer: 'TechCorp Solutions', customerId: 'techcorp-solutions', amount: 34500, status: 'accepted', validUntil: '2026-05-30', issuedAt: '2026-05-12', owner: 'Sarah Chen', version: 1, items: 5 },
  { id: 'Q-1095', number: 'Q-1095', customer: 'Northwest Logistics', customerId: 'northwest-logistics', amount: 22800, status: 'draft', validUntil: '2026-06-12', issuedAt: '2026-05-11', owner: 'Jenna Park', version: 1, items: 6 },
  { id: 'Q-1094', number: 'Q-1094', customer: 'Global Manufacturing Co', customerId: 'global-manufacturing', amount: 128400, status: 'sent', validUntil: '2026-06-08', issuedAt: '2026-05-10', owner: 'Marcus Reid', version: 1, items: 14 },
  { id: 'Q-1093', number: 'Q-1093', customer: 'Apex Retail Group', customerId: 'apex-retail', amount: 18200, status: 'accepted', validUntil: '2026-05-25', issuedAt: '2026-05-09', owner: 'David Kumar', version: 3, items: 4 },
  { id: 'Q-1092', number: 'Q-1092', customer: 'Enterprise Ltd', customerId: 'enterprise-ltd', amount: 42100, status: 'rejected', validUntil: '2026-05-22', issuedAt: '2026-05-08', owner: 'Emily Rodriguez', version: 2, items: 9 },
  { id: 'Q-1091', number: 'Q-1091', customer: 'Green Energy Partners', customerId: 'green-energy', amount: 28400, status: 'viewed', validUntil: '2026-05-30', issuedAt: '2026-05-07', owner: 'Marcus Reid', version: 1, items: 7 },
  { id: 'Q-1090', number: 'Q-1090', customer: 'StartupCo', customerId: 'startup-co', amount: 14800, status: 'expired', validUntil: '2026-05-15', issuedAt: '2026-04-30', owner: 'Sarah Chen', version: 1, items: 3 },
  { id: 'Q-1089', number: 'Q-1089', customer: 'Bluewave Marine', customerId: 'bluewave-marine', amount: 38600, status: 'sent', validUntil: '2026-06-05', issuedAt: '2026-05-06', owner: 'David Kumar', version: 1, items: 8 },
  { id: 'Q-1088', number: 'Q-1088', customer: 'Pinnacle Construction', customerId: 'pinnacle-construction', amount: 96200, status: 'viewed', validUntil: '2026-06-04', issuedAt: '2026-05-05', owner: 'Sarah Chen', version: 2, items: 11 },
  { id: 'Q-1087', number: 'Q-1087', customer: 'Sunny Foods Inc', customerId: 'sunny-foods', amount: 12400, status: 'accepted', validUntil: '2026-05-28', issuedAt: '2026-05-04', owner: 'Emily Rodriguez', version: 1, items: 4 },
  { id: 'Q-1086', number: 'Q-1086', customer: 'Horizon Pharmaceuticals', customerId: 'horizon-pharma', amount: 48200, status: 'sent', validUntil: '2026-06-02', issuedAt: '2026-05-03', owner: 'Marcus Reid', version: 1, items: 9 },
  { id: 'Q-1085', number: 'Q-1085', customer: 'Oceanside Resorts', customerId: 'oceanside-resorts', amount: 26800, status: 'draft', validUntil: '2026-06-01', issuedAt: '2026-05-02', owner: 'Jenna Park', version: 1, items: 6 },
  { id: 'Q-1084', number: 'Q-1084', customer: 'Titan Aerospace', customerId: 'titan-aerospace', amount: 184600, status: 'viewed', validUntil: '2026-05-29', issuedAt: '2026-04-29', owner: 'David Kumar', version: 4, items: 22 },
];

export type OrderStatus = 'pending' | 'in_production' | 'shipped' | 'delivered' | 'invoiced' | 'cancelled';

export interface SalesOrder {
  id: string;
  number: string;
  customer: string;
  customerId: string;
  amount: number;
  status: OrderStatus;
  orderedAt: string;
  shipBy: string;
  owner: string;
  items: number;
  shipmentProgress: number;
}

export const orders: SalesOrder[] = [
  { id: 'SO-3401', number: 'SO-3401', customer: 'Acme Industries', customerId: 'acme-industries', amount: 84200, status: 'in_production', orderedAt: '2026-05-12', shipBy: '2026-05-22', owner: 'Sarah Chen', items: 8, shipmentProgress: 45 },
  { id: 'SO-3400', number: 'SO-3400', customer: 'TechCorp Solutions', customerId: 'techcorp-solutions', amount: 34500, status: 'shipped', orderedAt: '2026-05-11', shipBy: '2026-05-18', owner: 'Sarah Chen', items: 5, shipmentProgress: 80 },
  { id: 'SO-3399', number: 'SO-3399', customer: 'Apex Retail Group', customerId: 'apex-retail', amount: 18200, status: 'delivered', orderedAt: '2026-05-09', shipBy: '2026-05-16', owner: 'David Kumar', items: 4, shipmentProgress: 100 },
  { id: 'SO-3398', number: 'SO-3398', customer: 'Hospital Network LLC', customerId: 'hospital-network', amount: 42900, status: 'invoiced', orderedAt: '2026-05-08', shipBy: '2026-05-15', owner: 'Marcus Reid', items: 7, shipmentProgress: 100 },
  { id: 'SO-3397', number: 'SO-3397', customer: 'Global Manufacturing Co', customerId: 'global-manufacturing', amount: 128400, status: 'in_production', orderedAt: '2026-05-07', shipBy: '2026-05-25', owner: 'Marcus Reid', items: 14, shipmentProgress: 30 },
  { id: 'SO-3396', number: 'SO-3396', customer: 'Sunny Foods Inc', customerId: 'sunny-foods', amount: 12400, status: 'delivered', orderedAt: '2026-05-06', shipBy: '2026-05-12', owner: 'Emily Rodriguez', items: 4, shipmentProgress: 100 },
  { id: 'SO-3395', number: 'SO-3395', customer: 'Northwest Logistics', customerId: 'northwest-logistics', amount: 22800, status: 'pending', orderedAt: '2026-05-05', shipBy: '2026-05-20', owner: 'Jenna Park', items: 6, shipmentProgress: 10 },
  { id: 'SO-3394', number: 'SO-3394', customer: 'Bluewave Marine', customerId: 'bluewave-marine', amount: 38600, status: 'shipped', orderedAt: '2026-05-04', shipBy: '2026-05-14', owner: 'David Kumar', items: 8, shipmentProgress: 70 },
  { id: 'SO-3393', number: 'SO-3393', customer: 'Pinnacle Construction', customerId: 'pinnacle-construction', amount: 96200, status: 'in_production', orderedAt: '2026-05-03', shipBy: '2026-05-28', owner: 'Sarah Chen', items: 11, shipmentProgress: 55 },
  { id: 'SO-3392', number: 'SO-3392', customer: 'Horizon Pharmaceuticals', customerId: 'horizon-pharma', amount: 48200, status: 'shipped', orderedAt: '2026-05-02', shipBy: '2026-05-17', owner: 'Marcus Reid', items: 9, shipmentProgress: 85 },
  { id: 'SO-3391', number: 'SO-3391', customer: 'Green Energy Partners', customerId: 'green-energy', amount: 28400, status: 'pending', orderedAt: '2026-05-01', shipBy: '2026-05-21', owner: 'Marcus Reid', items: 7, shipmentProgress: 0 },
  { id: 'SO-3390', number: 'SO-3390', customer: 'Titan Aerospace', customerId: 'titan-aerospace', amount: 184600, status: 'in_production', orderedAt: '2026-04-29', shipBy: '2026-06-15', owner: 'David Kumar', items: 22, shipmentProgress: 25 },
  { id: 'SO-3389', number: 'SO-3389', customer: 'Enterprise Ltd', customerId: 'enterprise-ltd', amount: 42100, status: 'cancelled', orderedAt: '2026-04-28', shipBy: '2026-05-10', owner: 'Emily Rodriguez', items: 9, shipmentProgress: 0 },
  { id: 'SO-3388', number: 'SO-3388', customer: 'Oceanside Resorts', customerId: 'oceanside-resorts', amount: 26800, status: 'delivered', orderedAt: '2026-04-27', shipBy: '2026-05-08', owner: 'Jenna Park', items: 6, shipmentProgress: 100 },
];

export type InvoiceStatus = 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  number: string;
  customer: string;
  customerId: string;
  amount: number;
  paid: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
  daysOverdue?: number;
  reference?: string;
}

export const invoices: Invoice[] = [
  { id: 'INV-2189', number: 'INV-2189', customer: 'Acme Industries', customerId: 'acme-industries', amount: 28450, paid: 0, status: 'sent', issuedAt: '2026-05-12', dueAt: '2026-06-11', reference: 'SO-3401' },
  { id: 'INV-2188', number: 'INV-2188', customer: 'TechCorp Solutions', customerId: 'techcorp-solutions', amount: 14200, paid: 0, status: 'sent', issuedAt: '2026-05-11', dueAt: '2026-05-26', reference: 'SO-3400' },
  { id: 'INV-2187', number: 'INV-2187', customer: 'Hospital Network LLC', customerId: 'hospital-network', amount: 42900, paid: 0, status: 'overdue', issuedAt: '2026-04-08', dueAt: '2026-05-08', daysOverdue: 7, reference: 'SO-3398' },
  { id: 'INV-2186', number: 'INV-2186', customer: 'Global Manufacturing Co', customerId: 'global-manufacturing', amount: 64200, paid: 32100, status: 'partial', issuedAt: '2026-04-22', dueAt: '2026-06-21', reference: 'SO-3380' },
  { id: 'INV-2185', number: 'INV-2185', customer: 'Apex Retail Group', customerId: 'apex-retail', amount: 18200, paid: 18200, status: 'paid', issuedAt: '2026-04-30', dueAt: '2026-05-30', reference: 'SO-3399' },
  { id: 'INV-2184', number: 'INV-2184', customer: 'Northwest Logistics', customerId: 'northwest-logistics', amount: 8920, paid: 0, status: 'sent', issuedAt: '2026-05-08', dueAt: '2026-06-07', reference: 'SO-3392' },
  { id: 'INV-2183', number: 'INV-2183', customer: 'StartupCo', customerId: 'startup-co', amount: 3200, paid: 0, status: 'overdue', issuedAt: '2026-04-15', dueAt: '2026-04-30', daysOverdue: 15, reference: 'SO-3370' },
  { id: 'INV-2182', number: 'INV-2182', customer: 'Enterprise Ltd', customerId: 'enterprise-ltd', amount: 22400, paid: 0, status: 'sent', issuedAt: '2026-05-04', dueAt: '2026-06-03', reference: 'SO-3386' },
  { id: 'INV-2181', number: 'INV-2181', customer: 'Pinnacle Construction', customerId: 'pinnacle-construction', amount: 18200, paid: 0, status: 'overdue', issuedAt: '2026-03-25', dueAt: '2026-05-09', daysOverdue: 6, reference: 'SO-3360' },
  { id: 'INV-2180', number: 'INV-2180', customer: 'Sunny Foods Inc', customerId: 'sunny-foods', amount: 12400, paid: 12400, status: 'paid', issuedAt: '2026-05-04', dueAt: '2026-05-19', reference: 'SO-3396' },
  { id: 'INV-2179', number: 'INV-2179', customer: 'Horizon Pharmaceuticals', customerId: 'horizon-pharma', amount: 7800, paid: 0, status: 'sent', issuedAt: '2026-05-02', dueAt: '2026-07-01', reference: 'SO-3384' },
  { id: 'INV-2178', number: 'INV-2178', customer: 'Bluewave Marine', customerId: 'bluewave-marine', amount: 12800, paid: 0, status: 'sent', issuedAt: '2026-04-29', dueAt: '2026-05-29', reference: 'SO-3394' },
  { id: 'INV-2177', number: 'INV-2177', customer: 'Green Energy Partners', customerId: 'green-energy', amount: 5400, paid: 0, status: 'sent', issuedAt: '2026-05-05', dueAt: '2026-06-04', reference: 'SO-3387' },
  { id: 'INV-2176', number: 'INV-2176', customer: 'Oceanside Resorts', customerId: 'oceanside-resorts', amount: 4200, paid: 4200, status: 'paid', issuedAt: '2026-04-27', dueAt: '2026-05-27', reference: 'SO-3388' },
];

export type CreditNoteStatus = 'draft' | 'issued' | 'applied' | 'refunded' | 'cancelled';

export interface CreditNote {
  id: string;
  number: string;
  customer: string;
  customerId: string;
  amount: number;
  status: CreditNoteStatus;
  reason: string;
  issuedAt: string;
  invoiceRef?: string;
  appliedTo?: string;
}

export const creditNotes: CreditNote[] = [
  { id: 'CN-0142', number: 'CN-0142', customer: 'Acme Industries', customerId: 'acme-industries', amount: 2400, status: 'applied', reason: 'Damaged goods return', issuedAt: '2026-05-10', invoiceRef: 'INV-2150', appliedTo: 'INV-2189' },
  { id: 'CN-0141', number: 'CN-0141', customer: 'TechCorp Solutions', customerId: 'techcorp-solutions', amount: 1800, status: 'issued', reason: 'Pricing adjustment', issuedAt: '2026-05-08', invoiceRef: 'INV-2145' },
  { id: 'CN-0140', number: 'CN-0140', customer: 'Hospital Network LLC', customerId: 'hospital-network', amount: 4200, status: 'refunded', reason: 'Order cancellation', issuedAt: '2026-05-05', invoiceRef: 'INV-2138' },
  { id: 'CN-0139', number: 'CN-0139', customer: 'Apex Retail Group', customerId: 'apex-retail', amount: 950, status: 'draft', reason: 'Volume discount adjustment', issuedAt: '2026-05-04' },
  { id: 'CN-0138', number: 'CN-0138', customer: 'Global Manufacturing Co', customerId: 'global-manufacturing', amount: 6800, status: 'applied', reason: 'Defective shipment', issuedAt: '2026-04-28', invoiceRef: 'INV-2129', appliedTo: 'INV-2186' },
  { id: 'CN-0137', number: 'CN-0137', customer: 'StartupCo', customerId: 'startup-co', amount: 320, status: 'issued', reason: 'Early payment discount', issuedAt: '2026-04-25', invoiceRef: 'INV-2118' },
  { id: 'CN-0136', number: 'CN-0136', customer: 'Pinnacle Construction', customerId: 'pinnacle-construction', amount: 1240, status: 'applied', reason: 'Returned items', issuedAt: '2026-04-22', invoiceRef: 'INV-2112', appliedTo: 'INV-2181' },
  { id: 'CN-0135', number: 'CN-0135', customer: 'Northwest Logistics', customerId: 'northwest-logistics', amount: 580, status: 'cancelled', reason: 'Issued in error', issuedAt: '2026-04-20' },
  { id: 'CN-0134', number: 'CN-0134', customer: 'Sunny Foods Inc', customerId: 'sunny-foods', amount: 280, status: 'applied', reason: 'Pricing error correction', issuedAt: '2026-04-18', invoiceRef: 'INV-2098', appliedTo: 'INV-2180' },
  { id: 'CN-0133', number: 'CN-0133', customer: 'Enterprise Ltd', customerId: 'enterprise-ltd', amount: 3400, status: 'refunded', reason: 'Contract amendment', issuedAt: '2026-04-15', invoiceRef: 'INV-2092' },
];
