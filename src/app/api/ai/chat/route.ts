import { NextResponse } from 'next/server';
import { getOpenRouterClient, resolveAIKey } from '@/lib/ai/openrouter';
import { getSession } from '@/lib/auth/session';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface ChatRequestBody {
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json()) as ChatRequestBody;

  const apiKey = await resolveAIKey(session.tenant.id);
  if (!apiKey) {
    return NextResponse.json(
      {
        error: 'AI not configured',
        hint: 'Set OPENROUTER_API_KEY env var, or add a tenant-level key in Settings → AI.',
      },
      { status: 503 },
    );
  }

  const client = getOpenRouterClient({ apiKey });
  if (!client) return NextResponse.json({ error: 'AI client unavailable' }, { status: 503 });

  if (body.stream) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of client.stream({
            model: body.model,
            messages: body.messages,
            temperature: body.temperature,
            max_tokens: body.max_tokens,
          })) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: chunk })}\n\n`));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (err: any) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`),
          );
        } finally {
          controller.close();
        }
      },
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }

  try {
    const response = await client.chat({
      model: body.model,
      messages: body.messages,
      temperature: body.temperature,
      max_tokens: body.max_tokens,
    });
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
