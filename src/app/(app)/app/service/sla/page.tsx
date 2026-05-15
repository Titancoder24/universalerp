'use client';

import * as React from 'react';
import { Clock, Download, Edit, Plus, ShieldCheck, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatPercent } from '@/lib/utils';

const policies = [
  {
    id: 'SLA-PREMIUM',
    name: 'Premium Support',
    tier: 'Premium',
    description: 'For Enterprise customers · 24x7 coverage with rapid response',
    customers: 24,
    activeTickets: 18,
    color: 'hsl(var(--chart-1))',
    rules: [
      { priority: 'Urgent', firstResponse: 15, resolution: 240, businessHours: false },
      { priority: 'High', firstResponse: 30, resolution: 480, businessHours: false },
      { priority: 'Medium', firstResponse: 60, resolution: 1440, businessHours: true },
      { priority: 'Low', firstResponse: 240, resolution: 2880, businessHours: true },
    ],
    metrics: { met: 23, total: 24, target: 99 },
  },
  {
    id: 'SLA-STANDARD',
    name: 'Standard Support',
    tier: 'Standard',
    description: 'For Business customers · M-F 8am-6pm coverage',
    customers: 142,
    activeTickets: 88,
    color: 'hsl(var(--chart-2))',
    rules: [
      { priority: 'Urgent', firstResponse: 60, resolution: 480, businessHours: true },
      { priority: 'High', firstResponse: 120, resolution: 1440, businessHours: true },
      { priority: 'Medium', firstResponse: 240, resolution: 2880, businessHours: true },
      { priority: 'Low', firstResponse: 480, resolution: 4320, businessHours: true },
    ],
    metrics: { met: 84, total: 88, target: 95 },
  },
  {
    id: 'SLA-BASIC',
    name: 'Basic Support',
    tier: 'Basic',
    description: 'Default plan · M-F 9am-5pm best-effort response',
    customers: 348,
    activeTickets: 56,
    color: 'hsl(var(--chart-3))',
    rules: [
      { priority: 'Urgent', firstResponse: 120, resolution: 1440, businessHours: true },
      { priority: 'High', firstResponse: 240, resolution: 2880, businessHours: true },
      { priority: 'Medium', firstResponse: 480, resolution: 4320, businessHours: true },
      { priority: 'Low', firstResponse: 1440, resolution: 7200, businessHours: true },
    ],
    metrics: { met: 52, total: 56, target: 90 },
  },
  {
    id: 'SLA-INTERNAL',
    name: 'Internal Tickets',
    tier: 'Internal',
    description: 'Internal employee support tickets',
    customers: 1, // company
    activeTickets: 12,
    color: 'hsl(var(--chart-4))',
    rules: [
      { priority: 'Urgent', firstResponse: 30, resolution: 240, businessHours: true },
      { priority: 'High', firstResponse: 60, resolution: 480, businessHours: true },
      { priority: 'Medium', firstResponse: 240, resolution: 1440, businessHours: true },
      { priority: 'Low', firstResponse: 480, resolution: 2880, businessHours: true },
    ],
    metrics: { met: 12, total: 12, target: 100 },
  },
];

function formatMin(min: number): string {
  if (min < 60) return `${min}m`;
  if (min < 1440) return `${Math.floor(min / 60)}h`;
  return `${Math.floor(min / 1440)}d`;
}

const prioColors: Record<string, string> = {
  Urgent: 'bg-destructive/10 text-destructive border-destructive/30',
  High: 'bg-warning/10 text-warning border-warning/30',
  Medium: 'bg-primary/10 text-primary border-primary/30',
  Low: 'bg-muted text-muted-foreground border-border',
};

export default function SlaPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="SLA Policies"
        description="Service Level Agreements with first-response and resolution targets per tier."
        breadcrumbs={[
          { label: 'Service', href: '/app/service' },
          { label: 'SLA' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New SLA policy</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {policies.map((p) => {
          const compliance = (p.metrics.met / p.metrics.total) * 100;
          const compliant = compliance >= p.metrics.target;
          return (
            <Card key={p.id}>
              <CardHeader className="border-b border-border">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-full" style={{ background: p.color }} />
                      <CardTitle className="text-lg">{p.name}</CardTitle>
                      <Badge variant="outline" size="sm">{p.tier}</Badge>
                    </div>
                    <CardDescription className="mt-1">{p.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon-sm"><Edit className="size-4" /></Button>
                </div>
                <div className="mt-3 flex flex-wrap gap-6 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Customers</div>
                    <div className="font-mono font-semibold">{p.customers}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Active tickets</div>
                    <div className="font-mono font-semibold">{p.activeTickets}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Compliance · target {p.metrics.target}%</span>
                      <span className={`font-mono font-semibold tabular-nums ${compliant ? 'text-success' : 'text-destructive'}`}>
                        {formatPercent(compliance / 100)}
                      </span>
                    </div>
                    <Progress
                      value={compliance}
                      className="mt-1 h-1.5"
                      indicatorClassName={compliant ? 'bg-success' : 'bg-destructive'}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <table className="erp-table">
                  <thead>
                    <tr>
                      <th>Priority</th>
                      <th className="text-right">First response</th>
                      <th className="text-right">Resolution</th>
                      <th>Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.rules.map((r) => (
                      <tr key={r.priority}>
                        <td>
                          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${prioColors[r.priority]}`}>
                            {r.priority}
                          </span>
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1.5 font-mono">
                            <Timer className="size-3 text-muted-foreground" />
                            <span>{formatMin(r.firstResponse)}</span>
                          </div>
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1.5 font-mono">
                            <Clock className="size-3 text-muted-foreground" />
                            <span>{formatMin(r.resolution)}</span>
                          </div>
                        </td>
                        <td className="text-xs text-muted-foreground">{r.businessHours ? 'Business hrs' : '24x7'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
          <CardDescription>Default business hours used for SLA calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {[
              { day: 'Mon', open: '08:00', close: '18:00' },
              { day: 'Tue', open: '08:00', close: '18:00' },
              { day: 'Wed', open: '08:00', close: '18:00' },
              { day: 'Thu', open: '08:00', close: '18:00' },
              { day: 'Fri', open: '08:00', close: '18:00' },
              { day: 'Sat', open: 'Closed', close: '' },
              { day: 'Sun', open: 'Closed', close: '' },
            ].map((d) => (
              <div key={d.day} className="rounded-lg border border-border p-3">
                <div className="text-xs text-muted-foreground">{d.day}</div>
                <div className={`mt-1 font-mono ${d.open === 'Closed' ? 'text-muted-foreground' : 'font-semibold'}`}>
                  {d.open}{d.close && ` - ${d.close}`}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5" />
            Timezone: America/Chicago · 8 public holidays defined for 2026
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
