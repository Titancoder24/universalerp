'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { nextDocumentNumber } from './numbering';

export interface InvoiceLineInput {
  item_id?: string | null;
  item_code?: string;
  description: string;
  quantity: number;
  unit?: string;
  unit_price_cents: number;
  discount_pct?: number;
  tax_code_id?: string | null;
  tax_rate_pct?: number;
}

export interface CreateInvoiceInput {
  customer_id: string;
  contact_id?: string | null;
  sales_order_id?: string | null;
  project_id?: string | null;
  issue_date?: string;
  due_date?: string;
  currency?: string;
  lines: InvoiceLineInput[];
  notes?: string;
  payment_terms?: string;
}

function computeLineTotals(line: InvoiceLineInput) {
  const subtotal = Math.round(line.quantity * line.unit_price_cents);
  const discount = Math.round((subtotal * (line.discount_pct ?? 0)) / 100);
  const taxable = subtotal - discount;
  const tax = Math.round((taxable * (line.tax_rate_pct ?? 0)) / 100);
  const total = taxable + tax;
  return { subtotal, discount, tax, total };
}

export async function createInvoice(input: CreateInvoiceInput) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const number = await nextDocumentNumber(session.tenant.id, 'invoice');

  let subtotal = 0;
  let discount = 0;
  let tax = 0;
  let total = 0;

  const lines = input.lines.map((line, i) => {
    const totals = computeLineTotals(line);
    subtotal += totals.subtotal;
    discount += totals.discount;
    tax += totals.tax;
    total += totals.total;
    return {
      ...line,
      sort_order: i,
      tax_cents: totals.tax,
      discount_cents: totals.discount,
      total_cents: totals.total,
    };
  });

  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      tenant_id: session.tenant.id,
      number,
      customer_id: input.customer_id,
      contact_id: input.contact_id,
      sales_order_id: input.sales_order_id,
      project_id: input.project_id,
      issue_date: input.issue_date ?? new Date().toISOString().split('T')[0],
      due_date: input.due_date,
      currency: input.currency ?? session.tenant.default_currency,
      subtotal_cents: subtotal,
      discount_cents: discount,
      tax_cents: tax,
      total_cents: total,
      balance_cents: total,
      paid_cents: 0,
      status: 'draft',
      notes: input.notes,
      payment_terms: input.payment_terms,
      owner_id: session.user.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  const linesToInsert = lines.map((line) => ({
    ...line,
    tenant_id: session.tenant.id,
    invoice_id: invoice.id,
  }));
  await supabase.from('invoice_lines').insert(linesToInsert);

  revalidatePath('/app/sales/invoices');
  return invoice;
}

export async function markInvoiceSent(invoiceId: string) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from('invoices')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', invoiceId)
    .eq('tenant_id', session.tenant.id);
  if (error) throw new Error(error.message);
  revalidatePath('/app/sales/invoices');
}

export async function recordPayment(input: {
  invoice_id: string;
  amount_cents: number;
  payment_date?: string;
  method?: 'cash' | 'check' | 'bank_transfer' | 'card' | 'wire';
  reference?: string;
  notes?: string;
}) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const { data: invoice } = await supabase
    .from('invoices')
    .select('customer_id, total_cents, paid_cents')
    .eq('id', input.invoice_id)
    .eq('tenant_id', session.tenant.id)
    .single();
  if (!invoice) throw new Error('Invoice not found');

  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert({
      tenant_id: session.tenant.id,
      direction: 'inbound',
      customer_id: invoice.customer_id,
      amount_cents: input.amount_cents,
      payment_date: input.payment_date ?? new Date().toISOString().split('T')[0],
      method: input.method ?? 'bank_transfer',
      reference: input.reference,
      notes: input.notes,
      status: 'completed',
      recorded_by: session.user.id,
    })
    .select()
    .single();
  if (paymentError) throw new Error(paymentError.message);

  await supabase.from('payment_applications').insert({
    tenant_id: session.tenant.id,
    payment_id: payment.id,
    invoice_id: input.invoice_id,
    amount_cents: input.amount_cents,
  });

  const newPaid = (invoice.paid_cents ?? 0) + input.amount_cents;
  const newBalance = invoice.total_cents - newPaid;
  const newStatus = newBalance <= 0 ? 'paid' : 'partial';

  await supabase
    .from('invoices')
    .update({
      paid_cents: newPaid,
      balance_cents: newBalance,
      status: newStatus,
      paid_at: newStatus === 'paid' ? new Date().toISOString() : null,
    })
    .eq('id', input.invoice_id);

  revalidatePath('/app/sales/invoices');
  revalidatePath(`/app/sales/invoices/${input.invoice_id}`);
  return payment;
}
