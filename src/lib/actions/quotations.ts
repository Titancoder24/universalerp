'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { nextDocumentNumber } from './numbering';

export interface QuotationLineInput {
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

export interface CreateQuotationInput {
  customer_id: string;
  contact_id?: string | null;
  opportunity_id?: string | null;
  issue_date?: string;
  valid_until?: string;
  currency?: string;
  lines: QuotationLineInput[];
  notes?: string;
  terms?: string;
  payment_terms?: string;
  delivery_terms?: string;
}

function computeLineTotals(line: QuotationLineInput) {
  const subtotal = Math.round(line.quantity * line.unit_price_cents);
  const discount = Math.round((subtotal * (line.discount_pct ?? 0)) / 100);
  const taxable = subtotal - discount;
  const tax = Math.round((taxable * (line.tax_rate_pct ?? 0)) / 100);
  const total = taxable + tax;
  return { subtotal, discount, tax, total };
}

export async function createQuotation(input: CreateQuotationInput) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const number = await nextDocumentNumber(session.tenant.id, 'quotation');

  let subtotal = 0;
  let discount = 0;
  let tax = 0;
  let total = 0;
  const lines = input.lines.map((line, i) => {
    const t = computeLineTotals(line);
    subtotal += t.subtotal;
    discount += t.discount;
    tax += t.tax;
    total += t.total;
    return {
      ...line,
      sort_order: i,
      tax_cents: t.tax,
      discount_cents: t.discount,
      total_cents: t.total,
    };
  });

  const { data: quote, error } = await supabase
    .from('quotations')
    .insert({
      tenant_id: session.tenant.id,
      number,
      customer_id: input.customer_id,
      contact_id: input.contact_id,
      opportunity_id: input.opportunity_id,
      issue_date: input.issue_date ?? new Date().toISOString().split('T')[0],
      valid_until: input.valid_until,
      currency: input.currency ?? session.tenant.default_currency,
      subtotal_cents: subtotal,
      discount_cents: discount,
      tax_cents: tax,
      total_cents: total,
      notes: input.notes,
      terms: input.terms,
      payment_terms: input.payment_terms,
      delivery_terms: input.delivery_terms,
      status: 'draft',
      owner_id: session.user.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.from('quotation_lines').insert(
    lines.map((l) => ({ ...l, tenant_id: session.tenant.id, quotation_id: quote.id })),
  );

  revalidatePath('/app/sales/quotations');
  return quote;
}

export async function acceptQuotation(quoteId: string, signature: {
  signedByName: string;
  signatureData: string;
}) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase
    .from('quotations')
    .update({
      status: 'accepted',
      signed_at: new Date().toISOString(),
      signed_by_name: signature.signedByName,
      signature_data: {
        type: 'canvas',
        data_url: signature.signatureData,
        ip: null, // server picks up
        user_agent: null,
      },
    })
    .eq('id', quoteId)
    .eq('tenant_id', session.tenant.id);
  if (error) throw new Error(error.message);

  revalidatePath('/app/sales/quotations');
}

export async function convertQuotationToOrder(quoteId: string) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const { data: quote } = await supabase
    .from('quotations')
    .select('*, lines:quotation_lines(*)')
    .eq('id', quoteId)
    .eq('tenant_id', session.tenant.id)
    .single();
  if (!quote) throw new Error('Quotation not found');

  const orderNumber = await nextDocumentNumber(session.tenant.id, 'sales_order');

  const { data: order, error } = await supabase
    .from('sales_orders')
    .insert({
      tenant_id: session.tenant.id,
      number: orderNumber,
      customer_id: quote.customer_id,
      contact_id: quote.contact_id,
      quotation_id: quote.id,
      currency: quote.currency,
      subtotal_cents: quote.subtotal_cents,
      discount_cents: quote.discount_cents,
      tax_cents: quote.tax_cents,
      shipping_cents: quote.shipping_cents,
      total_cents: quote.total_cents,
      status: 'confirmed',
      owner_id: session.user.id,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  await supabase.from('sales_order_lines').insert(
    (quote.lines ?? []).map((l: any) => ({
      tenant_id: session.tenant.id,
      order_id: order.id,
      item_id: l.item_id,
      item_code: l.item_code,
      description: l.description,
      quantity: l.quantity,
      unit: l.unit,
      unit_price_cents: l.unit_price_cents,
      discount_pct: l.discount_pct,
      discount_cents: l.discount_cents,
      tax_code_id: l.tax_code_id,
      tax_rate_pct: l.tax_rate_pct,
      tax_cents: l.tax_cents,
      total_cents: l.total_cents,
      sort_order: l.sort_order,
    })),
  );

  revalidatePath('/app/sales/quotations');
  revalidatePath('/app/sales/orders');
  return order;
}
