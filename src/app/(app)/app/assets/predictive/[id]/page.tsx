'use client';

import Link from 'next/link';
import { Activity, AlertTriangle, ArrowLeft, Brain, Calendar, Clock, Gauge, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatDate } from '@/lib/utils';

const vibrationData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  vibration: 2.3 + (i / 30) * 1.2 + Math.random() * 0.4,
  threshold: 3.5,
  predicted_failure: i < 23 ? null : 3.6 + (i - 23) * 0.15,
}));

const predictions = [
  { metric: 'Bearing wear', confidence: 87, eta: '14 days', severity: 'high', recommendation: 'Replace front bearing assembly' },
  { metric: 'Belt tension', confidence: 64, eta: '45 days', severity: 'medium', recommendation: 'Adjust belt tension at next PM' },
  { metric: 'Coolant flow', confidence: 42, eta: '60+ days', severity: 'low', recommendation: 'Monitor; clean filter at PM' },
];

const severityColors: Record<string, string> = {
  high: 'bg-destructive/10 text-destructive border-destructive/30',
  medium: 'bg-warning/10 text-warning border-warning/30',
  low: 'bg-info/10 text-info border-info/30',
};

export default function PredictiveDetailPage() {
  return (
    <div className="space-y-6 p-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/app/assets/predictive"><ArrowLeft className="size-4" /> Back to predictions</Link>
      </Button>

      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <span>CNC Line 1 (Mazak VTC-300)</span>
            <Badge className="bg-destructive/10 text-destructive border-destructive/30">High failure risk</Badge>
          </div>
        }
        description="AST-MFG-101 · Plant A · AI predicted failure in 14 days based on vibration trend"
        actions={
          <>
            <Button variant="outline">Dismiss prediction</Button>
            <Button><Wrench className="size-4" /> Schedule maintenance</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Failure probability (14d)" value={87} format="percent" trend="up" />
        <StatCard label="Estimated downtime cost" value={45000} format="currency" />
        <StatCard label="PM avoided cost" value={3200} format="currency" />
        <StatCard label="ROI of intervention" value="14x" format="number" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Brain className="size-5 text-primary" /> AI Predictions</CardTitle>
              <CardDescription>Detected anomalies and forecast failure modes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {predictions.map((p) => (
            <div key={p.metric} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`grid h-10 w-10 place-items-center rounded-lg ${severityColors[p.severity]}`}>
                    <AlertTriangle className="size-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{p.metric}</div>
                    <div className="text-sm text-muted-foreground">{p.recommendation}</div>
                    <div className="mt-1 flex items-center gap-3 text-xs">
                      <span className="text-muted-foreground">ETA: <span className="font-medium text-foreground">{p.eta}</span></span>
                      <span className="text-muted-foreground">Confidence: <span className="font-medium text-foreground">{p.confidence}%</span></span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline"><Wrench className="size-3.5" /> Create WO</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vibration trend (30 days)</CardTitle>
          <CardDescription>RMS vibration mm/s · Failure threshold at 3.5 mm/s</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={vibrationData} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="vibrationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <ReferenceLine y={3.5} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: 'Threshold', fill: 'hsl(var(--destructive))', fontSize: 10 }} />
              <Area type="monotone" dataKey="vibration" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#vibrationGradient)" />
              <Area type="monotone" dataKey="predicted_failure" stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="5 5" fill="url(#predictionGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
