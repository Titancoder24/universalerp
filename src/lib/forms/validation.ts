/**
 * Form validation utilities using Zod schemas.
 */

import { z } from 'zod';

// Common validators
export const requiredString = z.string().min(1, 'Required');
export const optionalString = z.string().optional().or(z.literal(''));
export const email = z.string().email('Invalid email');
export const phoneNumber = z.string().regex(/^\+?[\d\s\-().]{7,}$/, 'Invalid phone number');
export const currency = z.number().nonnegative('Must be positive');
export const percent = z.number().min(0).max(100);
export const futureDate = z.string().refine((d) => new Date(d) >= new Date(), 'Date must be in the future');
export const pastDate = z.string().refine((d) => new Date(d) <= new Date(), 'Date must be in the past');

// Address schema
export const addressSchema = z.object({
  line1: z.string().min(1, 'Street required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City required'),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().length(2, 'Use 2-letter country code'),
});

// Customer schema
export const customerSchema = z.object({
  display_name: z.string().min(1, 'Name required').max(100),
  legal_name: z.string().optional(),
  code: z.string().regex(/^[A-Z0-9-]+$/i, 'Letters, numbers, and hyphens only').max(20),
  type: z.enum(['company', 'individual', 'government', 'nonprofit']).default('company'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  currency: z.string().length(3),
  payment_terms_days: z.number().int().min(0).max(365).default(30),
  credit_limit_cents: z.number().int().min(0).default(0),
  primary_address: addressSchema.optional(),
  billing_address: addressSchema.optional(),
  shipping_address: addressSchema.optional(),
  tax_id: z.string().optional(),
  vat_number: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

// Invoice line schema
export const invoiceLineSchema = z.object({
  description: z.string().min(1, 'Description required'),
  quantity: z.number().positive('Must be positive'),
  unit_price_cents: z.number().int().min(0),
  discount_pct: z.number().min(0).max(100).optional().default(0),
  tax_rate_pct: z.number().min(0).max(100).optional().default(0),
});

// Invoice schema
export const invoiceSchema = z.object({
  customer_id: z.string().uuid('Select a customer'),
  issue_date: z.string(),
  due_date: z.string(),
  currency: z.string().length(3),
  lines: z.array(invoiceLineSchema).min(1, 'At least one line item required'),
  notes: z.string().optional(),
  payment_terms: z.string().optional(),
});

// Employee schema
export const employeeSchema = z.object({
  first_name: z.string().min(1, 'First name required'),
  last_name: z.string().min(1, 'Last name required'),
  email: email,
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  department_id: z.string().uuid().optional(),
  designation: z.string().min(1, 'Designation required'),
  employment_type: z.enum(['full_time', 'part_time', 'contract', 'intern', 'consultant', 'temporary']),
  hire_date: z.string(),
  base_salary_cents: z.number().int().min(0),
});

// Item schema
export const itemSchema = z.object({
  code: z.string().min(1, 'Code required').max(50),
  name: z.string().min(1, 'Name required').max(255),
  type: z.enum(['goods', 'service', 'digital', 'bundle', 'combo']).default('goods'),
  unit_of_measure: z.string().default('each'),
  is_stockable: z.boolean().default(true),
  is_sellable: z.boolean().default(true),
  is_purchasable: z.boolean().default(true),
  standard_cost_cents: z.number().int().min(0).default(0),
  list_price_cents: z.number().int().min(0).default(0),
  reorder_qty: z.number().min(0).default(0),
  reorder_point: z.number().min(0).default(0),
  description: z.string().optional(),
});

// Leave request schema
export const leaveRequestSchema = z.object({
  leave_type_id: z.string().uuid(),
  from_date: z.string(),
  to_date: z.string(),
  reason: z.string().min(1, 'Reason required'),
});

// Expense schema
export const expenseItemSchema = z.object({
  category_id: z.string().uuid().optional(),
  expense_date: z.string(),
  vendor_name: z.string().optional(),
  description: z.string(),
  amount_cents: z.number().int().min(1),
  currency: z.string().length(3).default('USD'),
});

// Quote schema
export const quotationSchema = z.object({
  customer_id: z.string().uuid('Select a customer'),
  issue_date: z.string(),
  valid_until: z.string(),
  currency: z.string().length(3),
  lines: z.array(invoiceLineSchema).min(1, 'At least one line item required'),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

// Tenant schema
export const tenantSchema = z.object({
  name: z.string().min(1, 'Company name required').max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Lowercase, numbers, hyphens only'),
  country_code: z.string().length(2),
  default_currency: z.string().length(3),
  default_timezone: z.string(),
  industry: z.string().optional(),
});

// User invite schema
export const userInviteSchema = z.object({
  email: email,
  full_name: z.string().min(1, 'Name required'),
  role: z.enum(['tenant_admin', 'employee']),
  department_id: z.string().uuid().optional(),
  module_access: z.record(z.enum(['none', 'read', 'write', 'approve', 'admin'])).optional(),
});

// PO schema
export const purchaseOrderSchema = z.object({
  vendor_id: z.string().uuid('Select a vendor'),
  order_date: z.string(),
  delivery_date: z.string().optional(),
  currency: z.string().length(3),
  lines: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().positive(),
    unit_price_cents: z.number().int().min(0),
    item_id: z.string().uuid().optional(),
  })).min(1),
});

// Journal entry schema
export const journalEntrySchema = z.object({
  posting_date: z.string(),
  reference: z.string().optional(),
  notes: z.string().optional(),
  lines: z.array(z.object({
    account_id: z.string().uuid(),
    debit_cents: z.number().int().min(0),
    credit_cents: z.number().int().min(0),
    description: z.string().optional(),
  })).min(2, 'At least 2 lines required'),
}).refine(
  (data) => {
    const totalDebit = data.lines.reduce((s, l) => s + l.debit_cents, 0);
    const totalCredit = data.lines.reduce((s, l) => s + l.credit_cents, 0);
    return totalDebit === totalCredit && totalDebit > 0;
  },
  { message: 'Debits must equal credits and be greater than zero' },
);

export type CustomerInput = z.infer<typeof customerSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type EmployeeInput = z.infer<typeof employeeSchema>;
export type ItemInput = z.infer<typeof itemSchema>;
export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;
export type ExpenseItemInput = z.infer<typeof expenseItemSchema>;
export type QuotationInput = z.infer<typeof quotationSchema>;
export type TenantInput = z.infer<typeof tenantSchema>;
export type UserInviteInput = z.infer<typeof userInviteSchema>;
export type PurchaseOrderInput = z.infer<typeof purchaseOrderSchema>;
export type JournalEntryInput = z.infer<typeof journalEntrySchema>;
