'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { nextDocumentNumber } from './numbering';

export interface JournalLineInput {
  account_id: string;
  debit_cents: number;
  credit_cents: number;
  description?: string;
  dimension1?: any;
  dimension2?: any;
  dimension3?: any;
}

export interface CreateJournalEntryInput {
  posting_date: string;
  reference?: string;
  source_type?: string;
  source_id?: string;
  period_id?: string;
  currency?: string;
  exchange_rate?: number;
  notes?: string;
  lines: JournalLineInput[];
  status?: 'draft' | 'posted';
}

export async function createJournalEntry(input: CreateJournalEntryInput) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const totalDebit = input.lines.reduce((s, l) => s + l.debit_cents, 0);
  const totalCredit = input.lines.reduce((s, l) => s + l.credit_cents, 0);

  if (totalDebit !== totalCredit) {
    throw new Error(`Journal entry not balanced. Debit: ${totalDebit}, Credit: ${totalCredit}`);
  }

  if (input.lines.length < 2) {
    throw new Error('Journal entry must have at least 2 lines');
  }

  const number = await nextDocumentNumber(session.tenant.id, 'journal_entry');

  const { data: entry, error } = await supabase
    .from('journal_entries')
    .insert({
      tenant_id: session.tenant.id,
      number,
      posting_date: input.posting_date,
      reference: input.reference,
      source_type: input.source_type,
      source_id: input.source_id,
      period_id: input.period_id,
      currency: input.currency ?? session.tenant.default_currency,
      exchange_rate: input.exchange_rate ?? 1,
      total_debit_cents: totalDebit,
      total_credit_cents: totalCredit,
      notes: input.notes,
      status: input.status ?? 'draft',
      posted_by: input.status === 'posted' ? session.user.id : null,
      posted_at: input.status === 'posted' ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.from('journal_entry_lines').insert(
    input.lines.map((l) => ({
      ...l,
      tenant_id: session.tenant.id,
      entry_id: entry.id,
      currency: input.currency ?? session.tenant.default_currency,
      exchange_rate: input.exchange_rate ?? 1,
    })),
  );

  revalidatePath('/app/accounting/journal');
  return entry;
}

export async function postJournalEntry(entryId: string) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase
    .from('journal_entries')
    .update({
      status: 'posted',
      posted_by: session.user.id,
      posted_at: new Date().toISOString(),
    })
    .eq('id', entryId)
    .eq('tenant_id', session.tenant.id)
    .eq('status', 'draft');

  if (error) throw new Error(error.message);

  revalidatePath('/app/accounting/journal');
}

export async function reverseJournalEntry(entryId: string, reason: string) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const { data: original } = await supabase
    .from('journal_entries')
    .select('*, lines:journal_entry_lines(*)')
    .eq('id', entryId)
    .eq('tenant_id', session.tenant.id)
    .single();

  if (!original) throw new Error('Original entry not found');
  if (original.status !== 'posted') throw new Error('Can only reverse posted entries');

  const reverseNumber = await nextDocumentNumber(session.tenant.id, 'journal_entry');

  const { data: reverse } = await supabase
    .from('journal_entries')
    .insert({
      tenant_id: session.tenant.id,
      number: reverseNumber,
      posting_date: new Date().toISOString().split('T')[0],
      reference: `Reversal of ${original.number}: ${reason}`,
      source_type: 'reversal',
      source_id: original.id,
      currency: original.currency,
      exchange_rate: original.exchange_rate,
      total_debit_cents: original.total_credit_cents,
      total_credit_cents: original.total_debit_cents,
      status: 'posted',
      posted_by: session.user.id,
      posted_at: new Date().toISOString(),
      notes: `Reverses journal entry ${original.number}`,
    })
    .select()
    .single();

  if (reverse) {
    await supabase.from('journal_entry_lines').insert(
      (original.lines as any[]).map((l: any) => ({
        tenant_id: session.tenant.id,
        entry_id: reverse.id,
        account_id: l.account_id,
        debit_cents: l.credit_cents,
        credit_cents: l.debit_cents,
        description: `Reversal: ${l.description ?? ''}`,
        currency: l.currency,
        exchange_rate: l.exchange_rate,
      })),
    );

    await supabase
      .from('journal_entries')
      .update({
        status: 'reversed',
        reversed_entry_id: reverse.id,
      })
      .eq('id', entryId);
  }

  revalidatePath('/app/accounting/journal');
}
