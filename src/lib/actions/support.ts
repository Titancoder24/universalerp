'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { nextDocumentNumber } from './numbering';

export interface CreateTicketInput {
  customer_id?: string;
  contact_id?: string;
  subject: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  channel?: 'email' | 'portal' | 'phone' | 'chat' | 'in_app';
  related_invoice_id?: string;
  related_order_id?: string;
}

export async function createTicket(input: CreateTicketInput) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const number = await nextDocumentNumber(session.tenant.id, 'support_ticket');

  // SLA calculation based on priority
  const slaHours = {
    urgent: { first_response: 1, resolution: 4 },
    high: { first_response: 4, resolution: 24 },
    medium: { first_response: 8, resolution: 72 },
    low: { first_response: 24, resolution: 168 },
  };
  const sla = slaHours[input.priority ?? 'medium'];

  const { data: ticket, error } = await supabase
    .from('support_tickets')
    .insert({
      tenant_id: session.tenant.id,
      number,
      subject: input.subject,
      description: input.description,
      customer_id: input.customer_id,
      contact_id: input.contact_id,
      category: input.category,
      priority: input.priority ?? 'medium',
      status: 'open',
      channel: input.channel ?? 'in_app',
      sla_target_first_response_at: new Date(Date.now() + sla.first_response * 3600 * 1000).toISOString(),
      sla_target_resolve_at: new Date(Date.now() + sla.resolution * 3600 * 1000).toISOString(),
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  revalidatePath('/app/service/tickets');
  return ticket;
}

export async function replyToTicket(input: {
  ticket_id: string;
  body: string;
  is_internal?: boolean;
  attachments?: any[];
}) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from('ticket_messages').insert({
    tenant_id: session.tenant.id,
    ticket_id: input.ticket_id,
    user_id: session.user.id,
    body: input.body,
    is_internal: input.is_internal ?? false,
    attachments: input.attachments ?? [],
  });
  if (error) throw new Error(error.message);

  // Mark first response if this is the first non-internal reply
  if (!input.is_internal) {
    const { data: ticket } = await supabase
      .from('support_tickets')
      .select('first_response_at')
      .eq('id', input.ticket_id)
      .single();

    if (ticket && !ticket.first_response_at) {
      await supabase
        .from('support_tickets')
        .update({
          first_response_at: new Date().toISOString(),
          status: 'in_progress',
        })
        .eq('id', input.ticket_id);
    }
  }

  revalidatePath(`/app/service/tickets/${input.ticket_id}`);
}

export async function changeTicketStatus(
  ticketId: string,
  status: 'open' | 'in_progress' | 'on_hold' | 'waiting_customer' | 'resolved' | 'closed',
) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const updates: any = { status };
  if (status === 'resolved') {
    updates.resolved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('support_tickets')
    .update(updates)
    .eq('id', ticketId)
    .eq('tenant_id', session.tenant.id);
  if (error) throw new Error(error.message);

  revalidatePath('/app/service/tickets');
  revalidatePath(`/app/service/tickets/${ticketId}`);
}

export async function assignTicket(ticketId: string, userId: string) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase
    .from('support_tickets')
    .update({ assigned_to: userId })
    .eq('id', ticketId)
    .eq('tenant_id', session.tenant.id);
  if (error) throw new Error(error.message);

  revalidatePath(`/app/service/tickets/${ticketId}`);
}

export async function submitCSAT(ticketId: string, rating: number) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from('support_tickets')
    .update({ satisfaction_rating: rating })
    .eq('id', ticketId);
  if (error) throw new Error(error.message);
  return { success: true };
}
