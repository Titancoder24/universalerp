import { NextResponse } from 'next/server';
import { getOpenRouterClient, resolveAIKey } from '@/lib/ai/openrouter';
import { getPrompt, interpolatePrompt } from '@/lib/ai/prompts';
import { getSession } from '@/lib/auth/session';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

interface ScoreLeadRequestBody {
  lead_id: string;
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json()) as ScoreLeadRequestBody;

  const supabase = await getSupabaseServerClient();
  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', body.lead_id)
    .eq('tenant_id', session.tenant.id)
    .single();

  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  const { data: activities } = await supabase
    .from('activities')
    .select('*')
    .eq('lead_id', body.lead_id)
    .order('start_at', { ascending: false })
    .limit(10);

  const apiKey = await resolveAIKey(session.tenant.id);
  if (!apiKey) return NextResponse.json({ error: 'AI not configured' }, { status: 503 });

  const client = getOpenRouterClient({ apiKey });
  if (!client) return NextResponse.json({ error: 'AI unavailable' }, { status: 503 });

  const prompt = getPrompt('score_lead');

  const response = await client.chat({
    model: prompt.preferredModel,
    messages: [
      { role: 'system', content: prompt.systemPrompt },
      {
        role: 'user',
        content: interpolatePrompt(prompt.userPromptTemplate, {
          profile_data: {
            first_name: lead.first_name,
            last_name: lead.last_name,
            company_name: lead.company_name,
            title: lead.title,
            source: lead.source,
          },
          engagement_data: {
            activities_count: activities?.length ?? 0,
            recent_activities: (activities ?? []).slice(0, 5).map((a) => ({
              type: a.type,
              subject: a.subject,
              date: a.start_at,
            })),
          },
          icp_definition: {
            industries: ['Manufacturing', 'Distribution', 'Retail'],
            company_size: '50-1000 employees',
            target_titles: ['CEO', 'CFO', 'COO', 'Operations Director', 'Finance Director'],
          },
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
    parsed = { score: 50, tier: 'warm', reasoning: 'Could not parse AI response' };
  }

  // Update lead score in DB
  await supabase
    .from('leads')
    .update({ score: parsed.score })
    .eq('id', body.lead_id);

  return NextResponse.json(parsed);
}
