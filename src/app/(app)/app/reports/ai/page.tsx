'use client';

import { useState } from 'react';
import {
  ArrowUp,
  Bookmark,
  Bot,
  Brain,
  Copy,
  Download,
  History,
  Lightbulb,
  Loader2,
  Send,
  Share2,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency, cn } from '@/lib/utils';

const suggestions = [
  'What was our gross margin trend over the last 6 months?',
  'Show me top 10 customers by revenue growth',
  'Which products have negative margins?',
  'Compare Q1 to Q2 revenue by region',
  'Forecast cash position for the next 13 weeks',
  'Identify slow-moving inventory worth more than $10K',
  'Top vendors by spend in the last quarter',
  'Which sales reps are below quota?',
];

const conversation = [
  {
    role: 'user' as const,
    content: 'What was our gross margin trend over the last 6 months?',
    time: '10:42 AM',
  },
  {
    role: 'assistant' as const,
    content: 'Your gross margin improved from 39.6% in November to 42.8% in May — a 320 bps expansion driven primarily by reduced raw material costs (down 4.2%) and improved manufacturing efficiency.',
    chart: 'line' as const,
    time: '10:42 AM',
    sources: ['P&L Statement', 'COGS Breakdown'],
  },
  {
    role: 'user' as const,
    content: 'Drill into the top 5 customers contributing to that growth',
    time: '10:45 AM',
  },
  {
    role: 'assistant' as const,
    content: 'The top 5 customers contributed 68% of the gross margin improvement. Acme Industries led with +18 bps contribution, followed by Global Manufacturing (+14 bps) and Hospital Network (+12 bps).',
    chart: 'bar' as const,
    time: '10:45 AM',
    sources: ['Customer Profitability', 'Sales Detail'],
  },
];

const recentQueries = [
  { query: 'Top 10 customers by revenue growth', user: 'Sarah Chen', time: '2 hours ago', saved: true },
  { query: 'AR aging by sales rep', user: 'Marcus Reid', time: '4 hours ago', saved: false },
  { query: 'Inventory turnover Q1 vs Q2', user: 'David Kumar', time: '6 hours ago', saved: false },
  { query: 'Operating margin by department', user: 'Sarah Chen', time: 'Yesterday', saved: true },
  { query: 'Vendor concentration risk analysis', user: 'James Liu', time: '2 days ago', saved: false },
];

const marginData = [
  { month: 'Nov', margin: 39.6 },
  { month: 'Dec', margin: 40.2 },
  { month: 'Jan', margin: 40.8 },
  { month: 'Feb', margin: 41.4 },
  { month: 'Mar', margin: 41.9 },
  { month: 'Apr', margin: 42.3 },
  { month: 'May', margin: 42.8 },
];

const contribData = [
  { customer: 'Acme', contribution: 18 },
  { customer: 'Global Mfg', contribution: 14 },
  { customer: 'Hospital Net', contribution: 12 },
  { customer: 'TechCorp', contribution: 8 },
  { customer: 'Apex Retail', contribution: 6 },
];

export default function AIInsightsPage() {
  const [query, setQuery] = useState('');

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="AI Insights"
        description="Ask natural-language questions about your data and get instant answers with charts."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Reports', href: '/app/reports' },
          { label: 'AI Insights' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <History className="size-4" /> History
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="size-4" /> Saved
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Queries this month</p>
              <p className="text-xl font-semibold">142</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/15 text-chart-2">
              <Zap className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Avg response time</p>
              <p className="text-xl font-semibold">3.2s</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/15 text-chart-3">
              <Brain className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Accuracy rating</p>
              <p className="text-xl font-semibold">96%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15 text-success">
              <Bookmark className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Saved insights</p>
              <p className="text-xl font-semibold">28</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardContent className="p-6 space-y-6">
              {conversation.map((msg, i) => (
                <div key={i} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                  {msg.role === 'user' ? (
                    <Avatar size="md">
                      <AvatarFallback name="Sarah Chen">SC</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Sparkles className="size-4" />
                    </div>
                  )}
                  <div className={cn('flex-1 max-w-3xl', msg.role === 'user' && 'text-right')}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium">{msg.role === 'user' ? 'You' : 'ERP AI'}</span>
                      <span className="text-2xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <div className={cn(
                      'inline-block rounded-lg p-3 text-sm',
                      msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted',
                    )}>
                      {msg.content}
                    </div>
                    {msg.role === 'assistant' && msg.chart && (
                      <div className="mt-3 rounded-lg border border-border p-4">
                        <ResponsiveContainer width="100%" height={200}>
                          {msg.chart === 'line' ? (
                            <LineChart data={marginData} margin={{ top: 6, right: 12, bottom: 0, left: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[38, 44]} />
                              <Tooltip
                                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                                formatter={(v: number) => [`${v}%`, 'Margin']}
                              />
                              <Line type="monotone" dataKey="margin" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={{ r: 3 }} />
                            </LineChart>
                          ) : (
                            <BarChart data={contribData} margin={{ top: 6, right: 12, bottom: 0, left: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                              <XAxis dataKey="customer" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}bps`} />
                              <Tooltip
                                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                                formatter={(v: number) => [`${v} bps`, 'Contribution']}
                              />
                              <Bar dataKey="contribution" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    )}
                    {msg.role === 'assistant' && (
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xs text-muted-foreground">Sources:</span>
                          {msg.sources?.map((s) => (
                            <Badge key={s} variant="outline" size="sm">{s}</Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon-xs"><ThumbsUp className="size-3" /></Button>
                          <Button variant="ghost" size="icon-xs"><ThumbsDown className="size-3" /></Button>
                          <Button variant="ghost" size="icon-xs"><Copy className="size-3" /></Button>
                          <Button variant="ghost" size="icon-xs"><Share2 className="size-3" /></Button>
                          <Button variant="ghost" size="icon-xs"><Bookmark className="size-3" /></Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
            <div className="border-t border-border p-4">
              <div className="relative">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything about your data… 'What's our cash runway?'"
                  className="h-11 pr-12"
                />
                <Button size="icon-sm" className="absolute right-1.5 top-1/2 -translate-y-1/2 size-8">
                  <ArrowUp className="size-4" />
                </Button>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>ERP AI · Trained on your data · Updated 12 min ago</span>
                <div className="flex items-center gap-3">
                  <span>Press <kbd className="rounded border border-border bg-muted px-1 py-0.5">Enter</kbd> to send</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="size-4 text-warning" />
                Try one of these
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="flex items-center gap-2 rounded-md border border-border p-3 text-left text-sm transition-colors hover:bg-muted/40"
                >
                  <Sparkles className="size-3.5 shrink-0 text-primary" />
                  <span className="text-sm">{s}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Queries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentQueries.map((q, i) => (
                <button
                  key={i}
                  className="w-full text-left rounded-md p-2 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium line-clamp-2">{q.query}</p>
                    {q.saved && <Bookmark className="size-3 shrink-0 fill-warning text-warning" />}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{q.user}</span>
                    <span>{q.time}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                Trending Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border border-border p-3">
                <p className="text-xs font-semibold uppercase text-primary">This week</p>
                <p className="mt-1 text-sm">Customer LTV by acquisition channel</p>
                <p className="mt-1 text-xs text-muted-foreground">38 colleagues asked</p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-xs font-semibold uppercase text-primary">Hot topic</p>
                <p className="mt-1 text-sm">DSO improvement strategies</p>
                <p className="mt-1 text-xs text-muted-foreground">24 colleagues asked</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
