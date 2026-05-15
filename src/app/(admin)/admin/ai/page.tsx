'use client';

import * as React from 'react';
import { Sparkles, Key, AlertTriangle, Check, RefreshCw, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const models = [
  { id: 'anthropic/claude-opus-4-7', name: 'Claude Opus 4.7', cost: '$15/M', context: '200K', good: ['Complex reasoning', 'Long context', 'Code'] },
  { id: 'anthropic/claude-sonnet-4-6', name: 'Claude Sonnet 4.6', cost: '$3/M', context: '200K', good: ['Best balance', 'Production workloads'] },
  { id: 'anthropic/claude-haiku-4-5', name: 'Claude Haiku 4.5', cost: '$0.80/M', context: '200K', good: ['Fast, cheap', 'Drafts', 'Classification'] },
  { id: 'openai/gpt-4o', name: 'GPT-4o', cost: '$5/M', context: '128K', good: ['Multimodal', 'Tool use'] },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', cost: '$0.15/M', context: '128K', good: ['Cheap default'] },
  { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', cost: '$3.5/M', context: '2M', good: ['Massive context'] },
  { id: 'meta/llama-3.1-405b', name: 'Llama 3.1 405B', cost: '$3/M', context: '128K', good: ['Open weights'] },
];

const usage = [
  { feature: 'Resume screening', requests: 2840, tokens: 1240000, cost: 24.5 },
  { feature: 'Invoice OCR', requests: 1842, tokens: 980000, cost: 18.2 },
  { feature: 'Lead scoring', requests: 5620, tokens: 320000, cost: 6.5 },
  { feature: 'Smart drafts', requests: 1245, tokens: 1820000, cost: 32.1 },
  { feature: 'AI Assistant chat', requests: 892, tokens: 2840000, cost: 48.2 },
  { feature: 'Anomaly detection', requests: 342, tokens: 580000, cost: 11.4 },
];

export default function AIConfigurationPage() {
  const totalCost = usage.reduce((sum, u) => sum + u.cost, 0);
  const totalRequests = usage.reduce((sum, u) => sum + u.requests, 0);
  const budgetLimit = 500;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="AI Configuration"
        description="Configure OpenRouter, model defaults, PII redaction, and budget controls platform-wide."
      />

      {/* Budget overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>This month's usage</CardTitle>
              <CardDescription>Across all tenants on the platform</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold">${totalCost.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">of ${budgetLimit} budget</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={(totalCost / budgetLimit) * 100} />
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xl font-semibold">{totalRequests.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Requests</div>
            </div>
            <div>
              <div className="text-xl font-semibold">7.7M</div>
              <div className="text-xs text-muted-foreground">Tokens</div>
            </div>
            <div>
              <div className="text-xl font-semibold">98.2%</div>
              <div className="text-xs text-muted-foreground">Success rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OpenRouter API Key */}
      <Card>
        <CardHeader>
          <CardTitle>OpenRouter API Key</CardTitle>
          <CardDescription>
            One API key gives access to 300+ models from 60+ providers.
            <a href="https://openrouter.ai" target="_blank" rel="noopener" className="ml-1 text-primary hover:underline inline-flex items-center gap-0.5">
              Get a key <ExternalLink className="size-3" />
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Platform API key (fallback for all tenants)</Label>
            <div className="flex gap-2">
              <Input type="password" defaultValue="sk-or-v1-••••••••••••••••••••••••••••••••" className="flex-1 font-mono" />
              <Button variant="outline">Rotate</Button>
              <Button>Save</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Tenants can override with their own key to bypass platform markup.
            </p>
          </div>

          <Alert variant="info">
            <AlertDescription>
              <strong>Three-tier resolver:</strong> tenant key → reseller key → platform key.
              At request time, we walk the chain and use the first configured key.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Model selection */}
      <Card>
        <CardHeader>
          <CardTitle>Default models</CardTitle>
          <CardDescription>The fallback used when tenants haven't picked their own.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Default model</Label>
              <Select defaultValue="anthropic/claude-haiku-4-5">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} · {m.cost}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Fallback model</Label>
              <Select defaultValue="openai/gpt-4o-mini">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} · {m.cost}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <h4 className="text-sm font-medium mb-2">Available models from OpenRouter ({models.length} curated)</h4>
            <div className="space-y-1.5">
              {models.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{m.name}</span>
                    <Badge variant="outline" className="text-2xs">{m.context}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Good for: {m.good.slice(0, 2).join(', ')}</span>
                    <span className="font-mono text-primary">{m.cost}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="mt-2 w-full"><RefreshCw className="size-3" /> Refresh from OpenRouter</Button>
          </div>
        </CardContent>
      </Card>

      {/* PII Redaction */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Compliance</CardTitle>
          <CardDescription>How sensitive data is handled before going to AI providers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'PII redaction', description: 'Strip emails, phones, SSN, credit cards before sending', enabled: true },
            { label: 'IBAN/Bank account redaction', description: 'Mask financial account numbers', enabled: true },
            { label: 'Data residency enforcement', description: 'Route requests through region-appropriate proxies', enabled: true },
            { label: 'No-train header', description: 'Tell providers not to train on responses', enabled: true },
            { label: 'Audit AI requests', description: 'Log every AI call to the audit log', enabled: true },
          ].map((opt) => (
            <div key={opt.label} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
              <div>
                <div className="font-medium text-sm">{opt.label}</div>
                <div className="text-xs text-muted-foreground">{opt.description}</div>
              </div>
              <Switch defaultChecked={opt.enabled} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Usage by feature */}
      <Card>
        <CardHeader>
          <CardTitle>Usage breakdown</CardTitle>
          <CardDescription>By feature, this month</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th className="text-right">Requests</th>
                <th className="text-right">Tokens</th>
                <th className="text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {usage.map((u) => (
                <tr key={u.feature}>
                  <td className="font-medium">{u.feature}</td>
                  <td className="text-right font-mono">{u.requests.toLocaleString()}</td>
                  <td className="text-right font-mono text-muted-foreground">{(u.tokens / 1000).toFixed(0)}K</td>
                  <td className="text-right font-mono font-semibold">${u.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
