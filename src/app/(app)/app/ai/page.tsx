'use client';

import * as React from 'react';
import {
  Bot,
  CircleDollarSign,
  FileText,
  Lightbulb,
  Mail,
  Mic,
  Paperclip,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  Wand2,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const suggestions = [
  { icon: TrendingUp, text: 'What was our revenue by region last quarter?', category: 'Reports' },
  { icon: Users, text: 'Which customers haven\'t ordered in 90 days?', category: 'CRM' },
  { icon: CircleDollarSign, text: 'Forecast cash position for the next 13 weeks', category: 'Finance' },
  { icon: FileText, text: 'Draft a quote for Acme based on their last order', category: 'Sales' },
  { icon: Mail, text: 'Summarize unread messages in #sales', category: 'Chat' },
  { icon: Lightbulb, text: 'What anomalies should I investigate this week?', category: 'Insights' },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  insights?: { label: string; value: string; trend?: 'up' | 'down' }[];
}

export default function AIAssistantPage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [thinking, setThinking] = React.useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const newMsg = { role: 'user' as const, content: input };
    setMessages((m) => [...m, newMsg]);
    setInput('');
    setThinking(true);

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            'Based on the data in your workspace, here\'s what I found:\n\nQ1 revenue was $1.24M, up 14.2% year-over-year. North America contributed 62% ($768K), EMEA 24% ($297K), and APAC 14% ($172K).\n\nThree customers drove most of the growth: Acme Industries (+38%), Global Manufacturing (+22%), and TechCorp Solutions (+18%). I recommend prioritizing renewal conversations with the top 5 since they account for 73% of revenue.',
          insights: [
            { label: 'Q1 Revenue', value: '$1.24M', trend: 'up' },
            { label: 'YoY Growth', value: '+14.2%', trend: 'up' },
            { label: 'Top customer', value: 'Acme Industries' },
          ],
        },
      ]);
      setThinking(false);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <PageHeader
        title="AI Assistant"
        description="Ask anything about your business — reports, drafts, summaries, forecasts. Powered by OpenRouter."
        actions={
          <Badge variant="soft">
            <Sparkles className="size-3" />
            Claude Haiku 4.5
          </Badge>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Conversation */}
        <div className="flex flex-1 flex-col">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-info text-primary-foreground mb-4 shadow-lg">
                <Sparkles className="size-8" />
              </div>
              <h2 className="font-display text-2xl font-semibold">How can I help today?</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Ask anything. I have access to your sales, finance, HR, inventory, and operations data —
                all scoped to your permissions.
              </p>

              <div className="mt-8 grid w-full max-w-3xl gap-2 sm:grid-cols-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setInput(s.text)}
                    className="group flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-left transition-all hover:shadow-md hover:border-primary/30"
                  >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <s.icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{s.text}</div>
                      <div className="text-2xs text-muted-foreground mt-0.5">{s.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mx-auto max-w-3xl space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
                    <Avatar size="sm">
                      <AvatarFallback className={msg.role === 'assistant' ? 'bg-primary text-primary-foreground' : ''}>
                        {msg.role === 'assistant' ? <Bot className="size-4" /> : 'JD'}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn('max-w-[80%] rounded-2xl px-4 py-3', msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border')}>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                      {msg.insights && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {msg.insights.map((insight, j) => (
                            <div key={j} className="rounded-lg border border-border bg-background p-2.5">
                              <div className="text-2xs text-muted-foreground">{insight.label}</div>
                              <div className={cn(
                                'mt-0.5 font-mono text-sm font-semibold',
                                insight.trend === 'up' && 'text-success',
                                insight.trend === 'down' && 'text-destructive',
                              )}>{insight.value}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex gap-3">
                    <Avatar size="sm">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-2xl bg-card border border-border px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="h-2 w-2 rounded-full bg-primary animate-pulse"
                            style={{ animationDelay: `${i * 150}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Composer */}
          <div className="border-t border-border bg-background p-4">
            <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
              <div className="relative rounded-xl border border-input bg-card shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Ask anything about your business…"
                  rows={2}
                  className="min-h-[60px] resize-none border-0 pr-32 shadow-none focus-visible:ring-0"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon-sm">
                    <Paperclip className="size-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-sm">
                    <Mic className="size-3.5" />
                  </Button>
                  <Button type="submit" size="sm" disabled={!input.trim()}>
                    <Send className="size-3.5" />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-center text-2xs text-muted-foreground">
                AI may produce inaccurate information. Always verify before acting on advice.
              </p>
            </form>
          </div>
        </div>

        {/* Side panel */}
        <aside className="hidden w-72 border-l border-border bg-card xl:block">
          <div className="p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Available actions
            </h3>
          </div>
          <div className="space-y-1 px-2">
            {[
              { icon: Wand2, label: 'Draft email reply' },
              { icon: FileText, label: 'Summarize document' },
              { icon: TrendingUp, label: 'Generate forecast' },
              { icon: Users, label: 'Score leads' },
              { icon: CircleDollarSign, label: 'Detect anomalies' },
              { icon: Sparkles, label: 'Translate text' },
            ].map((a) => (
              <button
                key={a.label}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
              >
                <a.icon className="size-4 text-primary" />
                {a.label}
              </button>
            ))}
          </div>

          <div className="border-t border-border p-4 mt-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Usage this month
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Budget</span>
                <span className="font-mono">$24.50 / $100</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: '24.5%' }} />
              </div>
              <div className="text-2xs text-muted-foreground">42 conversations, 580K tokens</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
