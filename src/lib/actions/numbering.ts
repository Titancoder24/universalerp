'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';

/**
 * Generate the next document number for a given tenant + doctype.
 *
 * Calls the Postgres `next_document_number()` function which is transactional
 * and handles padding, prefix, and reset cadence per the configured sequence.
 */
export async function nextDocumentNumber(tenantId: string, doctype: string): Promise<string> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.rpc('next_document_number', {
    p_tenant_id: tenantId,
    p_doctype: doctype,
  });
  if (error) throw new Error(`Failed to generate number: ${error.message}`);
  return data as string;
}
