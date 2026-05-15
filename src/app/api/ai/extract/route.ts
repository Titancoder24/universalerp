import { NextResponse } from 'next/server';
import { getOpenRouterClient, resolveAIKey } from '@/lib/ai/openrouter';
import { getPrompt, interpolatePrompt } from '@/lib/ai/prompts';
import { getSession } from '@/lib/auth/session';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface ExtractRequestBody {
  type: 'receipt' | 'invoice' | 'resume';
  /**
   * Either base64-encoded image data or extracted text from OCR pre-step.
   */
  content: string;
  contentType?: 'text' | 'image';
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json()) as ExtractRequestBody;

  const apiKey = await resolveAIKey(session.tenant.id);
  if (!apiKey) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
  }

  const client = getOpenRouterClient({ apiKey });
  if (!client) return NextResponse.json({ error: 'AI client unavailable' }, { status: 503 });

  const promptId =
    body.type === 'receipt' ? 'extract_receipt' :
    body.type === 'invoice' ? 'extract_invoice' :
    'extract_resume';

  const prompt = getPrompt(promptId);

  try {
    const response = await client.chat({
      model: prompt.preferredModel,
      messages: [
        { role: 'system', content: prompt.systemPrompt },
        {
          role: 'user',
          content: interpolatePrompt(prompt.userPromptTemplate, {
            receipt_text: body.content,
            invoice_text: body.content,
            resume_text: body.content,
          }),
        },
      ],
      temperature: prompt.temperature,
      max_tokens: prompt.maxTokens,
      response_format: { type: 'json_object' },
    });

    const text = response.choices[0]?.message.content ?? '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Sometimes models wrap with markdown code fences
      const cleaned = text.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    return NextResponse.json({ data: parsed, usage: response.usage });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
