'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { nextDocumentNumber } from './numbering';

export interface CreateMOInput {
  item_id: string;
  bom_id?: string;
  routing_id?: string;
  quantity_ordered: number;
  planned_start: string;
  planned_end: string;
  warehouse_id?: string;
  priority?: number;
  sales_order_id?: string | null;
  notes?: string;
}

export async function createManufacturingOrder(input: CreateMOInput) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const number = await nextDocumentNumber(session.tenant.id, 'manufacturing_order');

  // Get BOM components
  let components: any[] = [];
  if (input.bom_id) {
    const { data: bomLines } = await supabase
      .from('bom_lines')
      .select('*')
      .eq('bom_id', input.bom_id);
    components = (bomLines ?? []).map((l) => ({
      item_id: l.component_item_id,
      required_qty: l.quantity * input.quantity_ordered * (1 + (l.scrap_pct ?? 0) / 100),
      consumed_qty: 0,
      warehouse_id: input.warehouse_id,
    }));
  }

  const { data: mo, error } = await supabase
    .from('manufacturing_orders')
    .insert({
      tenant_id: session.tenant.id,
      number,
      item_id: input.item_id,
      bom_id: input.bom_id,
      routing_id: input.routing_id,
      quantity_ordered: input.quantity_ordered,
      quantity_produced: 0,
      quantity_scrapped: 0,
      planned_start: input.planned_start,
      planned_end: input.planned_end,
      status: 'planned',
      priority: input.priority ?? 5,
      warehouse_id: input.warehouse_id,
      sales_order_id: input.sales_order_id,
      owner_id: session.user.id,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  if (components.length > 0) {
    await supabase.from('mo_components').insert(
      components.map((c) => ({ ...c, tenant_id: session.tenant.id, mo_id: mo.id })),
    );
  }

  revalidatePath('/app/manufacturing/work-orders');
  return mo;
}

export async function releaseManufacturingOrder(moId: string) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const { data: components } = await supabase
    .from('mo_components')
    .select('*')
    .eq('mo_id', moId);

  // Reserve component stock
  for (const c of components ?? []) {
    await supabase.rpc('reserve_stock', {
      p_item_id: c.item_id,
      p_warehouse_id: c.warehouse_id,
      p_qty: c.required_qty,
    });
  }

  await supabase
    .from('manufacturing_orders')
    .update({ status: 'released', actual_start: new Date().toISOString() })
    .eq('id', moId)
    .eq('tenant_id', session.tenant.id);

  revalidatePath('/app/manufacturing/work-orders');
}

export async function reportProduction(input: {
  mo_id: string;
  operation_id?: string;
  operator_id: string;
  quantity_good: number;
  quantity_scrap: number;
  duration_minutes?: number;
  notes?: string;
}) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  await supabase.from('production_logs').insert({
    tenant_id: session.tenant.id,
    mo_id: input.mo_id,
    operation_id: input.operation_id,
    operator_id: input.operator_id,
    quantity_good: input.quantity_good,
    quantity_scrap: input.quantity_scrap,
    started_at: new Date(Date.now() - (input.duration_minutes ?? 0) * 60000).toISOString(),
    ended_at: new Date().toISOString(),
    notes: input.notes,
  });

  // Update MO totals
  const { data: mo } = await supabase
    .from('manufacturing_orders')
    .select('quantity_produced, quantity_scrapped, quantity_ordered')
    .eq('id', input.mo_id)
    .single();

  if (mo) {
    const newProduced = (mo.quantity_produced ?? 0) + input.quantity_good;
    const newScrapped = (mo.quantity_scrapped ?? 0) + input.quantity_scrap;
    const isComplete = newProduced >= mo.quantity_ordered;

    await supabase
      .from('manufacturing_orders')
      .update({
        quantity_produced: newProduced,
        quantity_scrapped: newScrapped,
        status: isComplete ? 'completed' : 'in_progress',
        actual_end: isComplete ? new Date().toISOString() : null,
      })
      .eq('id', input.mo_id);
  }

  revalidatePath('/app/manufacturing/work-orders');
  revalidatePath('/app/manufacturing/shopfloor');
}

export async function reportDowntime(input: {
  work_center_id: string;
  started_at: string;
  ended_at: string;
  reason_code: string;
  category: string;
  notes?: string;
}) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const duration = Math.floor((new Date(input.ended_at).getTime() - new Date(input.started_at).getTime()) / 60000);

  const { data, error } = await supabase
    .from('downtime_records')
    .insert({
      tenant_id: session.tenant.id,
      ...input,
      duration_minutes: duration,
      recorded_by: session.user.id,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  revalidatePath('/app/manufacturing/downtime');
  return data;
}
