'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { nextDocumentNumber } from './numbering';

export interface POSCartItem {
  item_id: string;
  description: string;
  quantity: number;
  unit_price_cents: number;
  discount_pct?: number;
  tax_code_id?: string | null;
  tax_rate_pct?: number;
}

export interface POSTransactionInput {
  customer_id?: string | null;
  register_id?: string;
  cashier_id: string;
  items: POSCartItem[];
  payments: Array<{
    method: 'cash' | 'card' | 'check' | 'gift_card' | 'loyalty' | 'store_credit';
    amount_cents: number;
    reference?: string;
  }>;
  loyalty_redeemed_points?: number;
  notes?: string;
}

export async function createPOSTransaction(input: POSTransactionInput) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  let subtotal = 0;
  let discount = 0;
  let tax = 0;
  let total = 0;

  const lines = input.items.map((it, i) => {
    const lineSubtotal = Math.round(it.quantity * it.unit_price_cents);
    const lineDiscount = Math.round((lineSubtotal * (it.discount_pct ?? 0)) / 100);
    const taxable = lineSubtotal - lineDiscount;
    const lineTax = Math.round((taxable * (it.tax_rate_pct ?? 0)) / 100);
    const lineTotal = taxable + lineTax;

    subtotal += lineSubtotal;
    discount += lineDiscount;
    tax += lineTax;
    total += lineTotal;

    return {
      ...it,
      sort_order: i,
      discount_cents: lineDiscount,
      tax_cents: lineTax,
      total_cents: lineTotal,
    };
  });

  const totalPaid = input.payments.reduce((s, p) => s + p.amount_cents, 0);

  const orderNumber = await nextDocumentNumber(session.tenant.id, 'pos_order');

  const { data: order, error } = await supabase
    .from('sales_orders')
    .insert({
      tenant_id: session.tenant.id,
      number: orderNumber,
      customer_id: input.customer_id,
      subtotal_cents: subtotal,
      discount_cents: discount,
      tax_cents: tax,
      total_cents: total,
      status: 'invoiced',
      delivery_status: 'complete',
      invoice_status: 'complete',
      currency: session.tenant.default_currency,
      owner_id: session.user.id,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  await supabase.from('sales_order_lines').insert(
    lines.map((l) => ({
      tenant_id: session.tenant.id,
      order_id: order.id,
      ...l,
    })),
  );

  for (const payment of input.payments) {
    const { data: pay } = await supabase
      .from('payments')
      .insert({
        tenant_id: session.tenant.id,
        direction: 'inbound',
        customer_id: input.customer_id,
        amount_cents: payment.amount_cents,
        method: payment.method === 'card' || payment.method === 'cash' ? payment.method : 'other',
        reference: payment.reference,
        status: 'completed',
        recorded_by: session.user.id,
      })
      .select()
      .single();
    if (pay) {
      await supabase.from('payment_applications').insert({
        tenant_id: session.tenant.id,
        payment_id: pay.id,
        invoice_id: null,
        amount_cents: payment.amount_cents,
      });
    }
  }

  // Update inventory: deduct stock
  for (const it of input.items) {
    await supabase.rpc('decrement_stock', { p_item_id: it.item_id, p_qty: it.quantity });
  }

  // Loyalty points: 1 point per dollar
  if (input.customer_id) {
    const pointsEarned = Math.floor(total / 100);
    if (pointsEarned > 0 || input.loyalty_redeemed_points) {
      const { data: customer } = await supabase
        .from('customers')
        .select('loyalty_points')
        .eq('id', input.customer_id)
        .single();
      if (customer) {
        const newPoints = (customer.loyalty_points ?? 0) + pointsEarned - (input.loyalty_redeemed_points ?? 0);
        await supabase
          .from('customers')
          .update({ loyalty_points: newPoints })
          .eq('id', input.customer_id);
      }
    }
  }

  revalidatePath('/app/pos');
  return order;
}

export async function openPOSShift(input: { register_id: string; opening_cash_cents: number }) {
  const session = await requireSession();
  // Implementation would store an open shift record
  return { shift_id: 'shift-' + Date.now(), opened_at: new Date().toISOString() };
}

export async function closePOSShift(input: { shift_id: string; counted_cash_cents: number; notes?: string }) {
  const session = await requireSession();
  // Implementation would close shift and reconcile
  return { closed: true, variance_cents: 0 };
}
