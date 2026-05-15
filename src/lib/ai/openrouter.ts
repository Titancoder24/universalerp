/**
 * OpenRouter client - the only external API the platform optionally depends on.
 *
 * OpenRouter is OpenAI-API-compatible and provides access to 300+ models
 * from 60+ providers. The platform routes AI requests through this single
 * client with a 3-tier API key resolver (tenant → reseller → platform).
 */

import { redactPII } from './redact-pii';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_call_id?: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  tools?: any[];
  tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
  response_format?: { type: 'text' | 'json_object' };
}

export interface OpenRouterResponse {
  id: string;
  model: string;
  created: number;
  choices: Array<{
    index: number;
    message: OpenRouterMessage;
    finish_reason: string | null;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIClientOptions {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
  fallbackModel?: string;
  redactPII?: boolean;
  appName?: string;
  appUrl?: string;
}

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;
  private fallbackModel: string;
  private shouldRedact: boolean;
  private appName: string;
  private appUrl: string;

  constructor(opts: AIClientOptions) {
    this.apiKey = opts.apiKey;
    this.baseUrl = opts.baseUrl ?? 'https://openrouter.ai/api/v1';
    this.defaultModel = opts.defaultModel ?? 'anthropic/claude-haiku-4-5';
    this.fallbackModel = opts.fallbackModel ?? 'openai/gpt-4o-mini';
    this.shouldRedact = opts.redactPII ?? true;
    this.appName = opts.appName ?? 'Universal ERP';
    this.appUrl = opts.appUrl ?? 'https://universalerp.app';
  }

  async chat(request: Omit<OpenRouterRequest, 'model'> & { model?: string }): Promise<OpenRouterResponse> {
    const model = request.model ?? this.defaultModel;
    const messages = this.shouldRedact ? this.redactMessages(request.messages) : request.messages;
    const payload: OpenRouterRequest = { ...request, model, messages };

    try {
      return await this.send(payload);
    } catch (err) {
      // Retry with fallback model on failure
      if (model !== this.fallbackModel) {
        try {
          return await this.send({ ...payload, model: this.fallbackModel });
        } catch {
          throw err;
        }
      }
      throw err;
    }
  }

  async *stream(request: Omit<OpenRouterRequest, 'model'> & { model?: string }): AsyncIterable<string> {
    const model = request.model ?? this.defaultModel;
    const messages = this.shouldRedact ? this.redactMessages(request.messages) : request.messages;
    const payload: OpenRouterRequest = { ...request, model, messages, stream: true };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(payload),
    });
    if (!response.ok || !response.body) {
      throw new Error(`OpenRouter error: ${response.status} ${await response.text()}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {
          // Skip malformed chunks
        }
      }
    }
  }

  async listModels(): Promise<Array<{ id: string; name: string; context_length: number; pricing: any }>> {
    const response = await fetch(`${this.baseUrl}/models`, {
      headers: this.headers(),
    });
    const json = await response.json();
    return json.data ?? [];
  }

  private async send(payload: OpenRouterRequest): Promise<OpenRouterResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status} ${await response.text()}`);
    }
    return response.json();
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': this.appUrl,
      'X-Title': this.appName,
    };
  }

  private redactMessages(messages: OpenRouterMessage[]): OpenRouterMessage[] {
    return messages.map((m) => ({ ...m, content: redactPII(m.content) }));
  }
}

/**
 * Resolves the appropriate API key by walking tenant → reseller → platform.
 */
export async function resolveAIKey(tenantId: string | null): Promise<string | null> {
  // In production this would query the database for the cascade.
  // For now, fall back directly to env var.
  return process.env.OPENROUTER_API_KEY ?? null;
}

export function getOpenRouterClient(opts?: Partial<AIClientOptions>): OpenRouterClient | null {
  const apiKey = opts?.apiKey ?? process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;
  return new OpenRouterClient({
    apiKey,
    defaultModel: opts?.defaultModel ?? process.env.OPENROUTER_DEFAULT_MODEL,
    fallbackModel: opts?.fallbackModel ?? process.env.OPENROUTER_FALLBACK_MODEL,
    ...opts,
  });
}
