/**
 * AI prompt templates.
 *
 * Each ERP-specific AI feature uses a curated system prompt and prompt format.
 * Templates are versioned so we can iterate without breaking existing tenants.
 */

export type PromptId =
  | 'summarize_record'
  | 'draft_reply'
  | 'translate'
  | 'explain_record'
  | 'next_action'
  | 'find_similar'
  | 'score_lead'
  | 'extract_receipt'
  | 'extract_invoice'
  | 'extract_resume'
  | 'forecast_demand'
  | 'detect_anomaly'
  | 'classify_ticket'
  | 'draft_quote_lines'
  | 'reply_to_review'
  | 'sentiment_analysis'
  | 'natural_language_query'
  | 'summarize_meeting'
  | 'transcribe_voice'
  | 'compose_announcement';

export interface PromptTemplate {
  id: PromptId;
  version: number;
  systemPrompt: string;
  userPromptTemplate: string;
  preferredModel?: string;
  temperature?: number;
  maxTokens?: number;
  outputFormat?: 'text' | 'json' | 'markdown';
  jsonSchema?: any;
}

const SUMMARIZE_RECORD: PromptTemplate = {
  id: 'summarize_record',
  version: 1,
  systemPrompt: `You're an ERP assistant. Summarize the given record concisely.
Focus on: status, key amounts, recent activity, anything that needs attention.
Use 3-5 bullets max. Be specific. Mention dates and amounts.`,
  userPromptTemplate: `Summarize this {{record_type}} for a busy executive.

Record data:
{{record_data}}

Recent activity:
{{recent_activity}}`,
  temperature: 0.3,
  maxTokens: 500,
  outputFormat: 'markdown',
};

const DRAFT_REPLY: PromptTemplate = {
  id: 'draft_reply',
  version: 1,
  systemPrompt: `You're a professional business communication assistant.
Draft polite, clear replies that match the original message's tone.
Be concise. Use the user's voice based on their previous messages.
End with a clear next step or call to action.`,
  userPromptTemplate: `Draft a reply to this {{channel}} message:

From: {{sender}}
Message: {{message}}

Context:
- I'm {{user_name}}, {{user_role}}
- We're discussing {{topic_context}}
- The customer/contact is {{contact_info}}

Tone: {{tone}}`,
  temperature: 0.5,
  maxTokens: 600,
  outputFormat: 'text',
};

const SCORE_LEAD: PromptTemplate = {
  id: 'score_lead',
  version: 2,
  systemPrompt: `You're a sales analyst. Score leads from 0-100 based on:
- Profile fit (company size, industry, job title relative to ICP)
- Engagement (recent activity, form submissions, content views)
- Intent signals (asking about pricing, scheduling demos)
- Budget indicators

Return ONLY valid JSON with this shape:
{
  "score": <0-100>,
  "tier": "hot" | "warm" | "cool" | "cold",
  "reasoning": "<one-sentence why>",
  "next_action": "<recommended action>"
}`,
  userPromptTemplate: `Score this lead:

Profile:
{{profile_data}}

Engagement history:
{{engagement_data}}

Our ideal customer profile:
{{icp_definition}}`,
  temperature: 0.2,
  maxTokens: 300,
  outputFormat: 'json',
};

const EXTRACT_RECEIPT: PromptTemplate = {
  id: 'extract_receipt',
  version: 1,
  systemPrompt: `You extract structured data from receipt images. Return ONLY valid JSON.
If a field is unclear, use null. Dates in YYYY-MM-DD format. Amounts as numbers in cents.`,
  userPromptTemplate: `Extract receipt data:

{
  "vendor_name": "<merchant name>",
  "vendor_address": "<address or null>",
  "vendor_tax_id": "<tax ID or null>",
  "date": "<YYYY-MM-DD>",
  "currency": "<3-letter code>",
  "items": [
    {"description": "<item>", "quantity": <number>, "unit_price_cents": <int>, "total_cents": <int>}
  ],
  "subtotal_cents": <int>,
  "tax_cents": <int>,
  "tip_cents": <int>,
  "total_cents": <int>,
  "payment_method": "<cash|card|other or null>",
  "category_suggestion": "<expense category>"
}`,
  preferredModel: 'anthropic/claude-haiku-4-5',
  temperature: 0.1,
  maxTokens: 1000,
  outputFormat: 'json',
};

const EXTRACT_INVOICE: PromptTemplate = {
  id: 'extract_invoice',
  version: 1,
  systemPrompt: `Extract structured invoice data from the document. Return ONLY valid JSON.
Dates as YYYY-MM-DD. Amounts as integer cents. Tax rates as percentages.`,
  userPromptTemplate: `Extract this invoice:

{
  "invoice_number": "<string>",
  "vendor_name": "<string>",
  "vendor_tax_id": "<string or null>",
  "vendor_address": "<string or null>",
  "buyer_name": "<string>",
  "buyer_address": "<string or null>",
  "issue_date": "<YYYY-MM-DD>",
  "due_date": "<YYYY-MM-DD or null>",
  "currency": "<3-letter code>",
  "line_items": [
    {"description": "<string>", "quantity": <number>, "unit_price_cents": <int>, "tax_rate_pct": <number>, "total_cents": <int>}
  ],
  "subtotal_cents": <int>,
  "tax_cents": <int>,
  "discount_cents": <int>,
  "shipping_cents": <int>,
  "total_cents": <int>,
  "payment_terms": "<string or null>",
  "po_reference": "<string or null>"
}`,
  preferredModel: 'anthropic/claude-haiku-4-5',
  temperature: 0.1,
  maxTokens: 2000,
  outputFormat: 'json',
};

const NATURAL_LANGUAGE_QUERY: PromptTemplate = {
  id: 'natural_language_query',
  version: 2,
  systemPrompt: `You're a business intelligence analyst with access to the user's ERP data.
Given a natural language question, produce:
1. A SQL query against the available views/tables
2. An interpretation of what the query computes
3. Suggested visualization (table, bar, line, pie, etc.)

The user is scoped to tenant_id and their permissions. Always include tenant_id filtering.
Available schemas: public (business data), v_* views for dashboards.

Return ONLY valid JSON.`,
  userPromptTemplate: `User question: {{question}}

User permissions: {{permissions}}
Tenant ID: {{tenant_id}}
Available tables: {{tables_list}}

Return:
{
  "sql": "<SELECT statement>",
  "interpretation": "<one sentence>",
  "viz_type": "table|bar|line|pie|area|number",
  "viz_config": { /* axis labels, etc. */ }
}`,
  preferredModel: 'anthropic/claude-sonnet-4-6',
  temperature: 0.2,
  maxTokens: 1500,
  outputFormat: 'json',
};

const DETECT_ANOMALY: PromptTemplate = {
  id: 'detect_anomaly',
  version: 1,
  systemPrompt: `You're a financial anomaly detector. Compare the given transaction
against historical patterns. Flag anything unusual: amount outliers, unusual vendors,
duplicate-looking entries, suspicious timing, unexpected categories.

Return JSON only:
{
  "is_anomaly": <boolean>,
  "confidence": <0-1>,
  "reasons": ["<reason 1>", "<reason 2>"],
  "severity": "low|medium|high",
  "recommended_action": "<string>"
}`,
  userPromptTemplate: `Transaction:
{{transaction}}

Historical context (last 90 days):
{{historical_data}}`,
  temperature: 0.2,
  maxTokens: 500,
  outputFormat: 'json',
};

const FORECAST_DEMAND: PromptTemplate = {
  id: 'forecast_demand',
  version: 1,
  systemPrompt: `You're a demand planning analyst. Given historical demand data,
produce a forecast for the requested periods. Account for seasonality, trend,
and any noted events.

Return JSON only:
{
  "forecast": [{"period": "<YYYY-MM>", "value": <int>, "lower_bound": <int>, "upper_bound": <int>}],
  "method": "<string describing approach>",
  "confidence": "<low|medium|high>",
  "notes": ["<observation 1>", "<observation 2>"]
}`,
  userPromptTemplate: `Forecast {{periods}} periods of demand for: {{item_name}}

Historical data:
{{history}}

Known events:
{{events}}`,
  temperature: 0.3,
  maxTokens: 1500,
  outputFormat: 'json',
};

const CLASSIFY_TICKET: PromptTemplate = {
  id: 'classify_ticket',
  version: 1,
  systemPrompt: `Classify support tickets. Return JSON only:
{
  "category": "<billing|technical|sales|complaint|feature_request|other>",
  "priority": "<low|medium|high|urgent>",
  "sentiment": "<positive|neutral|negative|angry>",
  "summary": "<one-sentence summary>",
  "suggested_kb_article_ids": ["<id1>"],
  "suggested_canned_response_id": "<id or null>",
  "estimated_resolution_complexity": "<simple|moderate|complex>"
}`,
  userPromptTemplate: `Classify this ticket:

Subject: {{subject}}
Body: {{body}}
Customer: {{customer_info}}

Available KB articles: {{kb_articles}}
Available canned responses: {{canned_responses}}`,
  temperature: 0.2,
  maxTokens: 500,
  outputFormat: 'json',
};

const NEXT_ACTION: PromptTemplate = {
  id: 'next_action',
  version: 1,
  systemPrompt: `You're a sales coach. Given the current state of an opportunity,
recommend the single most important next action and why.

Be specific and actionable. Reference the opportunity stage, last activity,
time since last touch, deal value, and any signals from notes/communications.`,
  userPromptTemplate: `Opportunity: {{opp_name}}
Customer: {{customer_name}}
Value: {{value}}
Stage: {{stage}}
Days in stage: {{days_in_stage}}
Last activity: {{last_activity}}
Owner: {{owner_name}}

Recent notes:
{{notes}}

What's the next action?`,
  temperature: 0.4,
  maxTokens: 400,
  outputFormat: 'text',
};

const TEMPLATES: Record<PromptId, PromptTemplate> = {
  summarize_record: SUMMARIZE_RECORD,
  draft_reply: DRAFT_REPLY,
  translate: {
    id: 'translate',
    version: 1,
    systemPrompt: 'Translate the given text to the target language. Preserve formatting, names, and product references. Return ONLY the translated text.',
    userPromptTemplate: 'Translate to {{target_language}}:\n\n{{text}}',
    temperature: 0.2,
    maxTokens: 2000,
    outputFormat: 'text',
  },
  explain_record: {
    id: 'explain_record',
    version: 1,
    systemPrompt: 'Explain the given ERP record in plain language someone unfamiliar with ERPs could understand.',
    userPromptTemplate: 'Explain this {{record_type}}:\n\n{{record_data}}',
    temperature: 0.3,
    maxTokens: 500,
    outputFormat: 'text',
  },
  next_action: NEXT_ACTION,
  find_similar: {
    id: 'find_similar',
    version: 1,
    systemPrompt: 'Find similar records given the current record. Return JSON: { "matches": [{"id": "<id>", "reason": "<why similar>", "confidence": <0-1>}] }',
    userPromptTemplate: 'Find similar to:\n{{record}}\n\nCandidates:\n{{candidates}}',
    temperature: 0.2,
    maxTokens: 800,
    outputFormat: 'json',
  },
  score_lead: SCORE_LEAD,
  extract_receipt: EXTRACT_RECEIPT,
  extract_invoice: EXTRACT_INVOICE,
  extract_resume: {
    id: 'extract_resume',
    version: 1,
    systemPrompt: 'Extract structured data from a resume. Return JSON only.',
    userPromptTemplate: 'Extract:\n{\n  "candidate_name": "<>", "email": "<>", "phone": "<>", "current_company": "<>", "current_title": "<>", "years_experience": <num>, "education": [{"school": "<>", "degree": "<>", "graduation_year": <num>}], "skills": ["<>"], "summary": "<2 sentences>"\n}\n\nResume:\n{{resume_text}}',
    temperature: 0.1,
    maxTokens: 1500,
    outputFormat: 'json',
  },
  forecast_demand: FORECAST_DEMAND,
  detect_anomaly: DETECT_ANOMALY,
  classify_ticket: CLASSIFY_TICKET,
  draft_quote_lines: {
    id: 'draft_quote_lines',
    version: 1,
    systemPrompt: 'Draft quote line items based on a brief. Use the catalog to find matching items.',
    userPromptTemplate: 'Brief: {{brief}}\n\nCustomer: {{customer}}\n\nCatalog: {{catalog}}\n\nReturn JSON: { "lines": [{"item_code": "<>", "description": "<>", "quantity": <num>, "unit_price_cents": <int>}] }',
    temperature: 0.3,
    maxTokens: 1500,
    outputFormat: 'json',
  },
  reply_to_review: {
    id: 'reply_to_review',
    version: 1,
    systemPrompt: 'Draft a professional reply to a customer review. Acknowledge concerns, take ownership if negative, thank if positive. 2-3 sentences max.',
    userPromptTemplate: 'Review (rating {{rating}}/5):\n{{review}}\n\nOur brand voice: {{brand_voice}}',
    temperature: 0.4,
    maxTokens: 400,
    outputFormat: 'text',
  },
  sentiment_analysis: {
    id: 'sentiment_analysis',
    version: 1,
    systemPrompt: 'Analyze sentiment. Return JSON: { "sentiment": "<very_negative|negative|neutral|positive|very_positive>", "score": <-1 to 1>, "key_phrases": ["<>"], "emotions": ["<>"] }',
    userPromptTemplate: 'Analyze:\n\n{{text}}',
    temperature: 0.1,
    maxTokens: 300,
    outputFormat: 'json',
  },
  natural_language_query: NATURAL_LANGUAGE_QUERY,
  summarize_meeting: {
    id: 'summarize_meeting',
    version: 1,
    systemPrompt: 'Summarize a meeting transcript. Sections: Attendees, Key Decisions, Action Items (with owner+due date), Follow-ups.',
    userPromptTemplate: 'Transcript:\n{{transcript}}',
    temperature: 0.3,
    maxTokens: 1500,
    outputFormat: 'markdown',
  },
  transcribe_voice: {
    id: 'transcribe_voice',
    version: 1,
    systemPrompt: 'Clean up a voice transcription. Remove filler words, fix punctuation. Preserve meaning.',
    userPromptTemplate: 'Clean this transcript:\n{{transcript}}',
    temperature: 0.2,
    maxTokens: 2000,
    outputFormat: 'text',
  },
  compose_announcement: {
    id: 'compose_announcement',
    version: 1,
    systemPrompt: 'Draft a clear, friendly company announcement based on the brief. 2-3 paragraphs. Include a clear call to action.',
    userPromptTemplate: 'Brief:\n{{brief}}\n\nAudience: {{audience}}\nTone: {{tone}}',
    temperature: 0.5,
    maxTokens: 800,
    outputFormat: 'markdown',
  },
};

export function getPrompt(id: PromptId): PromptTemplate {
  return TEMPLATES[id];
}

export function interpolatePrompt(template: string, vars: Record<string, any>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    const value = vars[key];
    if (value === undefined || value === null) return '';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  });
}
