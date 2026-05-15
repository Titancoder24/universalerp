export interface Customer {
  id: string;
  code: string;
  name: string;
  legalName?: string;
  type: 'company' | 'individual' | 'government' | 'nonprofit';
  industry: string;
  country: string;
  email: string;
  phone: string;
  website?: string;
  totalRevenue: number;
  outstanding: number;
  lastOrderDate: string;
  salesRep: string;
  status: 'active' | 'inactive' | 'lead';
  paymentTerms: number;
  creditLimit: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export const customersData: Customer[] = [
  { id: '1', code: 'CUST-001', name: 'Acme Industries Inc.', legalName: 'Acme Industries Incorporated', type: 'company', industry: 'Manufacturing', country: 'US', email: 'orders@acme.com', phone: '+1-415-555-0142', website: 'acme.com', totalRevenue: 1240000, outstanding: 24500, lastOrderDate: '2026-05-12', salesRep: 'Sarah Chen', status: 'active', paymentTerms: 30, creditLimit: 500000, loyaltyTier: 'platinum' },
  { id: '2', code: 'CUST-002', name: 'TechCorp Solutions', type: 'company', industry: 'Software', country: 'US', email: 'billing@techcorp.io', phone: '+1-650-555-0234', totalRevenue: 890000, outstanding: 12000, lastOrderDate: '2026-05-10', salesRep: 'Tom Becker', status: 'active', paymentTerms: 45, creditLimit: 250000, loyaltyTier: 'gold' },
  { id: '3', code: 'CUST-003', name: 'Global Manufacturing Co.', type: 'company', industry: 'Manufacturing', country: 'DE', email: 'finance@global-mfg.de', phone: '+49-30-555-1234', totalRevenue: 2400000, outstanding: 67200, lastOrderDate: '2026-05-08', salesRep: 'Sarah Chen', status: 'active', paymentTerms: 60, creditLimit: 1000000, loyaltyTier: 'platinum' },
  { id: '4', code: 'CUST-004', name: 'StartupCo', type: 'company', industry: 'Software', country: 'US', email: 'admin@startup.co', phone: '+1-512-555-0456', totalRevenue: 24000, outstanding: 8200, lastOrderDate: '2026-05-05', salesRep: 'Tom Becker', status: 'active', paymentTerms: 15, creditLimit: 25000, loyaltyTier: 'bronze' },
  { id: '5', code: 'CUST-005', name: 'Pacific Retail Group', type: 'company', industry: 'Retail', country: 'AU', email: 'orders@pacific-retail.com.au', phone: '+61-2-9123-4567', totalRevenue: 458000, outstanding: 18900, lastOrderDate: '2026-05-03', salesRep: 'Tom Becker', status: 'active', paymentTerms: 30, creditLimit: 150000, loyaltyTier: 'gold' },
  { id: '6', code: 'CUST-006', name: 'Innovate Labs Ltd', type: 'company', industry: 'R&D', country: 'UK', email: 'procurement@innovatelabs.uk', phone: '+44-20-7555-0011', totalRevenue: 312000, outstanding: 0, lastOrderDate: '2026-04-28', salesRep: 'Sarah Chen', status: 'active', paymentTerms: 30, creditLimit: 100000, loyaltyTier: 'silver' },
  { id: '7', code: 'CUST-007', name: 'NorthStar Construction', type: 'company', industry: 'Construction', country: 'NO', email: 'orders@northstar.no', phone: '+47-22-555-3000', totalRevenue: 178000, outstanding: 12400, lastOrderDate: '2026-04-25', salesRep: 'Tom Becker', status: 'active', paymentTerms: 30, creditLimit: 75000, loyaltyTier: 'silver' },
  { id: '8', code: 'CUST-008', name: 'Beacon Health Systems', type: 'company', industry: 'Healthcare', country: 'CA', email: 'finance@beacon-health.ca', phone: '+1-416-555-0789', totalRevenue: 845000, outstanding: 24500, lastOrderDate: '2026-04-22', salesRep: 'Sarah Chen', status: 'active', paymentTerms: 60, creditLimit: 300000, loyaltyTier: 'gold' },
  { id: '9', code: 'CUST-009', name: 'Sigma Logistics Pvt Ltd', type: 'company', industry: 'Logistics', country: 'IN', email: 'ap@sigmalogistics.in', phone: '+91-22-5555-0123', totalRevenue: 234000, outstanding: 18200, lastOrderDate: '2026-04-20', salesRep: 'Tom Becker', status: 'active', paymentTerms: 45, creditLimit: 80000, loyaltyTier: 'silver' },
  { id: '10', code: 'CUST-010', name: 'Sunset Hospitality Group', type: 'company', industry: 'Hospitality', country: 'ES', email: 'orders@sunset-hospitality.es', phone: '+34-91-555-7777', totalRevenue: 124000, outstanding: 4200, lastOrderDate: '2026-04-18', salesRep: 'Tom Becker', status: 'active', paymentTerms: 30, creditLimit: 50000, loyaltyTier: 'bronze' },
  { id: '11', code: 'CUST-011', name: 'Apex Engineering', type: 'company', industry: 'Engineering', country: 'JP', email: 'sales@apex-engineering.jp', phone: '+81-3-5555-4321', totalRevenue: 567000, outstanding: 32400, lastOrderDate: '2026-04-15', salesRep: 'Sarah Chen', status: 'active', paymentTerms: 60, creditLimit: 200000, loyaltyTier: 'gold' },
  { id: '12', code: 'CUST-012', name: 'GreenLeaf Cooperative', type: 'nonprofit', industry: 'Non-profit', country: 'BR', email: 'admin@greenleaf.org.br', phone: '+55-11-555-1111', totalRevenue: 45000, outstanding: 0, lastOrderDate: '2026-04-12', salesRep: 'Tom Becker', status: 'active', paymentTerms: 15, creditLimit: 20000, loyaltyTier: 'bronze' },
  { id: '13', code: 'CUST-013', name: 'Quantum Dynamics Corp', type: 'company', industry: 'Aerospace', country: 'US', email: 'orders@quantum-dynamics.com', phone: '+1-310-555-2468', totalRevenue: 1840000, outstanding: 89400, lastOrderDate: '2026-04-10', salesRep: 'Sarah Chen', status: 'active', paymentTerms: 90, creditLimit: 750000, loyaltyTier: 'platinum' },
  { id: '14', code: 'CUST-014', name: 'Stellar Tech Co', type: 'company', industry: 'Technology', country: 'SG', email: 'ap@stellartech.sg', phone: '+65-6555-3333', totalRevenue: 312000, outstanding: 12000, lastOrderDate: '2026-04-08', salesRep: 'Tom Becker', status: 'active', paymentTerms: 30, creditLimit: 100000, loyaltyTier: 'silver' },
  { id: '15', code: 'CUST-015', name: 'Urban Foods Distribution', type: 'company', industry: 'Food & Beverage', country: 'MX', email: 'pedidos@urbanfoods.mx', phone: '+52-55-5555-9999', totalRevenue: 198000, outstanding: 8400, lastOrderDate: '2026-04-05', salesRep: 'Tom Becker', status: 'active', paymentTerms: 30, creditLimit: 75000, loyaltyTier: 'silver' },
  { id: '16', code: 'CUST-016', name: 'Mountain View Realty', type: 'company', industry: 'Real Estate', country: 'US', email: 'billing@mountainview.com', phone: '+1-650-555-7654', totalRevenue: 89000, outstanding: 0, lastOrderDate: '2026-04-02', salesRep: 'Sarah Chen', status: 'active', paymentTerms: 30, creditLimit: 50000, loyaltyTier: 'bronze' },
  { id: '17', code: 'CUST-017', name: 'Dr. Emily Watson', type: 'individual', industry: 'Medical', country: 'US', email: 'emily@drwatson.com', phone: '+1-415-555-0001', totalRevenue: 8400, outstanding: 0, lastOrderDate: '2026-03-30', salesRep: 'Tom Becker', status: 'active', paymentTerms: 15, creditLimit: 10000, loyaltyTier: 'bronze' },
  { id: '18', code: 'CUST-018', name: 'Department of Energy', type: 'government', industry: 'Government', country: 'US', email: 'procurement@doe.gov', phone: '+1-202-555-0042', totalRevenue: 567000, outstanding: 124000, lastOrderDate: '2026-03-28', salesRep: 'Sarah Chen', status: 'active', paymentTerms: 90, creditLimit: 250000, loyaltyTier: 'gold' },
];
