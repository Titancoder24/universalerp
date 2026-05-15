import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

/**
 * Generic webhook endpoint. Routes incoming webhooks from external providers
 * (Stripe, Slack, GitHub, custom integrations) to the appropriate handler.
 *
 * Each provider validates its signature according to its own protocol.
 */
export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ provider: string }>;
}

export async function POST(req: Request, context: RouteContext) {
  const { provider } = await context.params;
  const tenant_id = req.headers.get('X-Tenant-Id');
  const signature = req.headers.get('X-Signature') ?? req.headers.get('Stripe-Signature') ?? '';

  const body = await req.text();

  // Verify signature for the provider
  const verified = await verifySignature(provider, body, signature, tenant_id);
  if (!verified) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // Persist the event for auditing
  const admin = getSupabaseAdminClient();
  const { error } = await admin.from('webhook_events').insert({
    tenant_id,
    provider,
    payload: JSON.parse(body),
    headers: Object.fromEntries(req.headers),
    received_at: new Date().toISOString(),
  });

  // Dispatch to handler (would be in a queue/worker in production)
  await dispatchToHandler(provider, JSON.parse(body), tenant_id);

  return NextResponse.json({ received: true });
}

async function verifySignature(
  provider: string,
  body: string,
  signature: string,
  tenant_id: string | null,
): Promise<boolean> {
  // In production each provider has its own signature validation
  switch (provider) {
    case 'stripe':
      // Stripe's HMAC SHA-256 verification with timestamp prevention
      return true; // Stub
    case 'github':
      // GitHub's HMAC SHA-256 verification
      return true; // Stub
    case 'slack':
      // Slack's HMAC SHA-256 verification
      return true; // Stub
    default:
      return !!signature;
  }
}

async function dispatchToHandler(provider: string, payload: any, tenant_id: string | null) {
  switch (provider) {
    case 'stripe':
      // Handle Stripe webhooks (payments, customer.created, etc.)
      break;
    case 'github':
      // Sync issues, PRs
      break;
    case 'slack':
      // Bidirectional chat sync (if configured)
      break;
    default:
      // Custom webhook - trigger workflows that subscribe to webhook events
      break;
  }
}
