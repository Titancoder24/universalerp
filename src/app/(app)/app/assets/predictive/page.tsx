'use client';

import * as React from 'react';
import { Activity, AlertTriangle, BrainCircuit, Download, Sparkles, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn, formatPercent } from '@/lib/utils';

const predictions = [
  {
    asset: 'PRESS-01', name: 'Schuler 250T Press', metric: 'Hydraulic pump bearing', signature: 'Vibration RMS rising 18% over 14 days',
    confidence: 0.92, daysUntil: 12, severity: 'high' as const, recommendation: 'Schedule bearing inspection in 5-7 days. Estimated MTTR 4h. Avoid weekend rebuilds.',
    historic: [
      { day: 'D-30', value: 2.1 }, { day: 'D-25', value: 2.2 }, { day: 'D-20', value: 2.3 }, { day: 'D-15', value: 2.6 },
      { day: 'D-10', value: 3.1 }, { day: 'D-5', value: 3.4 }, { day: 'Today', value: 3.8 }, { day: 'D+5', value: 4.3 },
      { day: 'D+10', value: 4.9 }, { day: 'D+15', value: 5.8 },
    ],
  },
  {
    asset: 'CNC-04', name: 'DMG Mori NLX', metric: 'Spindle thermal drift', signature: 'Thermal drift exceeded baseline by 22% on warm-up cycles',
    confidence: 0.84, daysUntil: 22, severity: 'med' as const, recommendation: 'Plan spindle re-conditioning at next scheduled maintenance. Consider chiller coil cleaning.',
    historic: [
      { day: 'D-30', value: 0.018 }, { day: 'D-25', value: 0.020 }, { day: 'D-20', value: 0.021 }, { day: 'D-15', value: 0.022 },
      { day: 'D-10', value: 0.024 }, { day: 'D-5', value: 0.025 }, { day: 'Today', value: 0.027 }, { day: 'D+5', value: 0.029 },
      { day: 'D+10', value: 0.031 }, { day: 'D+15', value: 0.034 },
    ],
  },
  {
    asset: 'ASSY-02', name: 'KUKA Robotic Arm K2', metric: 'Joint 3 backlash', signature: 'Repeatability variance 31% above baseline',
    confidence: 0.88, daysUntil: 18, severity: 'med' as const, recommendation: 'Re-tension Joint 3 cycloidal reducer. Allocate 2.5h next 3rd shift.',
    historic: [
      { day: 'D-30', value: 0.020 }, { day: 'D-25', value: 0.022 }, { day: 'D-20', value: 0.024 }, { day: 'D-15', value: 0.028 },
      { day: 'D-10', value: 0.032 }, { day: 'D-5', value: 0.035 }, { day: 'Today', value: 0.038 }, { day: 'D+5', value: 0.042 },
      { day: 'D+10', value: 0.047 }, { day: 'D+15', value: 0.053 },
    ],
  },
  {
    asset: 'HVAC-A1', name: 'Bay A AHU', metric: 'Belt tension degradation', signature: 'Current draw +14%, belt slip detected',
    confidence: 0.78, daysUntil: 28, severity: 'low' as const, recommendation: 'Tension belt or replace at next monthly PM.',
    historic: [
      { day: 'D-30', value: 12.4 }, { day: 'D-25', value: 12.5 }, { day: 'D-20', value: 12.6 }, { day: 'D-15', value: 13.0 },
      { day: 'D-10', value: 13.4 }, { day: 'D-5', value: 13.8 }, { day: 'Today', value: 14.1 }, { day: 'D+5', value: 14.5 },
      { day: 'D+10', value: 15.0 }, { day: 'D+15', value: 15.7 },
    ],
  },
  {
    asset: 'CMM-001', name: 'Zeiss Contura', metric: 'Probe wear', signature: 'Probe deflection variance 0.4µm above tolerance band',
    confidence: 0.71, daysUntil: 35, severity: 'low' as const, recommendation: 'Schedule probe stylus replacement and re-qualification.',
    historic: [
      { day: 'D-30', value: 0.10 }, { day: 'D-25', value: 0.11 }, { day: 'D-20', value: 0.12 }, { day: 'D-15', value: 0.14 },
      { day: 'D-10', value: 0.15 }, { day: 'D-5', value: 0.17 }, { day: 'Today', value: 0.19 }, { day: 'D+5', value: 0.21 },
      { day: 'D+10', value: 0.23 }, { day: 'D+15', value: 0.25 },
    ],
  },
];

const sevMeta: Record<string, { tone: string; label: string }> = {
  high: { tone: 'border-destructive/40 bg-destructive/5', label: 'Critical' },
  med: { tone: 'border-warning/40 bg-warning/5', label: 'Warning' },
  low: { tone: 'border-info/40 bg-info/5', label: 'Watch' },
};

const sevBadge: Record<string, 'destructive' | 'warning' | 'info'> = {
  high: 'destructive', med: 'warning', low: 'info',
};

export default function PredictivePage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Predictive Maintenance"
        description="AI-driven failure predictions based on sensor signatures, vibration, thermal and current trends."
        breadcrumbs={[
          { label: 'Assets', href: '/app/assets' },
          { label: 'Predictive' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button variant="soft"><BrainCircuit className="size-4" /> Retrain models</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Active predictions</div>
              <div className="text-xl font-semibold tabular-nums">{predictions.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">High severity</div>
              <div className="text-xl font-semibold tabular-nums text-destructive">{predictions.filter((p) => p.severity === 'high').length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Avg confidence</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{formatPercent(predictions.reduce((s, p) => s + p.confidence, 0) / predictions.length)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Hours saved (YTD)</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">284</div>
            <div className="mt-1 text-xs text-success">via PdM avoidance</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {predictions.map((p) => (
          <Card key={p.asset} className={cn('border-2', sevMeta[p.severity].tone)}>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={sevBadge[p.severity]}>{sevMeta[p.severity].label}</Badge>
                    <span className="font-mono text-sm font-semibold">{p.asset}</span>
                  </div>
                  <div>
                    <div className="text-base font-semibold">{p.name}</div>
                    <div className="mt-0.5 text-sm text-muted-foreground">Anomaly: <span className="font-medium text-foreground">{p.metric}</span></div>
                    <div className="mt-1 text-xs text-muted-foreground">{p.signature}</div>
                  </div>

                  <div className="space-y-2 rounded-lg border border-border bg-background/50 p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-mono font-semibold tabular-nums">{formatPercent(p.confidence)}</span>
                    </div>
                    <Progress value={p.confidence * 100} className="h-1.5" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Predicted failure window</span>
                      <span className="font-semibold tabular-nums">~{p.daysUntil} days</span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/40 p-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <Sparkles className="size-3 text-primary" />
                      Recommended action
                    </div>
                    <div className="mt-1 text-sm">{p.recommendation}</div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm font-medium">Signal forecast - {p.metric}</div>
                    <Badge variant="outline" size="sm" className="gap-1">
                      <TrendingUp className="size-3" /> Predicted continuation
                    </Badge>
                  </div>
                  <div className="h-44 rounded-lg border border-border bg-background/40">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={p.historic} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`grad-${p.asset}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={`hsl(var(--${p.severity === 'high' ? 'destructive' : p.severity === 'med' ? 'warning' : 'info'}))`} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={`hsl(var(--${p.severity === 'high' ? 'destructive' : p.severity === 'med' ? 'warning' : 'info'}))`} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                        <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={`hsl(var(--${p.severity === 'high' ? 'destructive' : p.severity === 'med' ? 'warning' : 'info'}))`}
                          strokeWidth={2}
                          fill={`url(#grad-${p.asset})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
