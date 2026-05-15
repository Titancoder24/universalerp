'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { nextDocumentNumber } from './numbering';

export interface POLineInput {
  item_id?: string | null;
  item_code?: string;
  description: string;
  quantity: number;
  unit?: string;
  unit_price_cents: number;
  tax_code_id?: string | null;
  tax_rate_pct?: number;
  warehouse_id?: string;
  delivery_date?: string;
}

export interface CreatePOInput {
  vendor_id: string;
  rfq_id?: string;
  requisition_id?: string;
  order_date?: string;
  delivery_date?: string;
  ship_to_address?: any;
  currency?: string;
  payment_terms?: string;
  notes?: string;
  lines: POLineInput[];
}

function computeLineTotals(line: POLineInput) {
  const subtotal = Math.round(line.quantity * line.unit_price_cents);
  const tax = Math.round((subtotal * (line.tax_rate_pct ?? 0)) / 100);
  return { subtotal, tax, total: subtotal + tax };
}

export async function createPurchaseOrder(input: CreatePOInput) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const number = await nextDocumentNumber(session.tenant.id, 'purchase_order');

  let subtotal = 0;
  let tax = 0;
  let total = 0;

  const lines = input.lines.map((l, i) => {
    const t = computeLineTotals(l);
    subtotal += t.subtotal;
    tax += t.tax;
    total += t.total;
    return { ...l, sort_order: i, tax_cents: t.tax, total_cents: t.total };
  });

  const { data: po, error } = await supabase
    .from('purchase_orders')
    .insert({
      tenant_id: session.tenant.id,
      number,
      vendor_id: input.vendor_id,
      rfq_id: input.rfq_id,
      requisition_id: input.requisition_id,
      order_date: input.order_date ?? new Date().toISOString().split('T')[0],
      delivery_date: input.delivery_date,
      ship_to_address: input.ship_to_address,
      currency: input.currency ?? session.tenant.default_currency,
      subtotal_cents: subtotal,
      tax_cents: tax,
      total_cents: total,
      status: 'draft',
      payment_terms: input.payment_terms,
      notes: input.notes,
      buyer_id: session.user.id,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  await supabase.from('purchase_order_lines').insert(
    lines.map((l) => ({ ...l, tenant_id: session.tenant.id, po_id: po.id })),
  );

  revalidatePath('/app/procurement/orders');
  return po;
}

export async function sendPurchaseOrder(poId: string) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from('purchase_orders')
    .update({ status: 'sent' })
    .eq('id', poId)
    .eq('tenant_id', session.tenant.id)
    .eq('status', 'draft');
  if (error) throw new Error(error.message);
  revalidatePath('/app/procurement/orders');
}

export async function receivePurchaseOrder(input: {
  po_id: string;
  warehouse_id: string;
  lines: Array<{
    po_line_id: string;
    quantity_received: number;
    bin_id?: string;
    batch_number?: string;
    serial_numbers?: string[];
    expiry_date?: string;
  }>;
  carrier?: string;
  tracking_number?: string;
  notes?: string;
}) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const number = await nextDocumentNumber(session.tenant.id, 'goods_receipt');

  const { data: po } = await supabase
    .from('purchase_orders')
    .select('vendor_id')
    .eq('id', input.po_id)
    .single();

  const { data: receipt, error } = await supabase
    .from('goods_receipts')
    .insert({
      tenant_id: session.tenant.id,
      number,
      po_id: input.po_id,
      vendor_id: po?.vendor_id,
      warehouse_id: input.warehouse_id,
      status: 'received',
      carrier: input.carrier,
      tracking_number: input.tracking_number,
      notes: input.notes,
      received_by: session.user.id,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  for (const line of input.lines) {
    const { data: poLine } = await supabase
      .from('purchase_order_lines')
      .select('item_id, description, received_qty, quantity')
      .eq('id', line.po_line_id)
      .single();

    await supabase.from('goods_receipt_lines').insert({
      tenant_id: session.tenant.id,
      receipt_id: receipt.id,
      po_line_id: line.po_line_id,
      item_id: poLine?.item_id,
      description: poLine?.description,
      quantity_received: line.quantity_received,
      quantity_accepted: line.quantity_received,
      bin_id: line.bin_id,
      batch_number: line.batch_number,
      serial_numbers: line.serial_numbers,
      expiry_date: line.expiry_date,
    });

    if (poLine?.item_id) {
      await supabase.from('stock_movements').insert({
        tenant_id: session.tenant.id,
        movement_type: 'receipt',
        item_id: poLine.item_id,
        warehouse_id: input.warehouse_id,
        bin_id: line.bin_id,
        quantity: line.quantity_received,
        batch_number: line.batch_number,
        expiry_date: line.expiry_date,
        reference_type: 'goods_receipt',
        reference_id: receipt.id,
        reference_number: number,
        performed_by: session.user.id,
      });

      const newReceivedQty = (poLine.received_qty ?? 0) + line.quantity_received;
      await supabase
        .from('purchase_order_lines')
        .update({ received_qty: newReceivedQty })
        .eq('id', line.po_line_id);
    }
  }

  // Update PO status based on receipt totals
  const { data: poLines } = await supabase
    .from('purchase_order_lines')
    .select('quantity, received_qty')
    .eq('po_id', input.po_id);

  const allReceived = (poLines ?? []).every((l) => (l.received_qty ?? 0) >= l.quantity);
  const someReceived = (poLines ?? []).some((l) => (l.received_qty ?? 0) > 0);

  await supabase
    .from('purchase_orders')
    .update({
      status: allReceived ? 'received' : 'partial',
      receive_status: allReceived ? 'complete' : 'partial',
    })
    .eq('id', input.po_id);

  revalidatePath('/app/procurement/orders');
  revalidatePath('/app/procurement/receipts');
  revalidatePath('/app/inventory/stock');
  return receipt;
}
