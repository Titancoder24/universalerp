'use client';

import * as React from 'react';
import { Activity, Download, Gauge, TrendingDown, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatPercent } from '@/lib/utils';

const machines = [
  { id: 'CNC-04', name: 'DMG Mori NLX', avail: 0.94, perf: 0.96, qual: 0.99, oee: 0.94 * 0.96 * 0.99 },
  { id: 'CNC-01', name: 'Mazak VTC-300', avail: 0.92, perf: 0.94, qual: 0.98, oee: 0.92 * 0.94 * 0.98 },
  { id: 'PRESS-01', name: 'Schuler 250T', avail: 0.90, perf: 0.93, qual: 0.99, oee: 0.90 * 0.93 * 0.99 },
  { id: 'ASSY-02', name: 'Robotic Arm K2', avail: 0.88, perf: 0.91, qual: 0.97, oee: 0.88 * 0.91 * 0.97 },
  { id: 'CNC-02', name: 'Haas VF-2SS', avail: 0.87, perf: 0.92, qual: 0.96, oee: 0.87 * 0.92 * 0.96 },
  { id: 'CNC-06', name: 'Doosan Puma', avail: 0.85, perf: 0.88, qual: 0.97, oee: 0.85 * 0.88 * 0.97 },
  { id: 'ASSY-01', name: 'Conveyor Cell A1', avail: 0.82, perf: 0.86, qual: 0.95, oee: 0.82 * 0.86 * 0.95 },
  { id: 'CNC-05', name: 'Okuma LB3000', avail: 0.80, perf: 0.84, qual: 0.96, oee: 0.80 * 0.84 * 0.96 },
  { id: 'ASSY-03', name: 'Manual Cell C3', avail: 0.78, perf: 0.81, qual: 0.94, oee: 0.78 * 0.81 * 0.94 },
  { id: 'CNC-03', name: 'Mazak QT-200', avail: 0.72, perf: 0.78, qual: 0.93, oee: 0.72 * 0.78 * 0.93 },
  { id: 'LATHE-01', name: 'Mori Seiki NL', avail: 0.65, perf: 0.74, qual: 0.92, oee: 0.65 * 0.74 * 0.92 },
  { id: 'CNC-07', name: 'Hardinge BPT', avail: 0.42, perf: 0.68, qual: 0.91, oee: 0.42 * 0.68 * 0.91 },
];

const losses = [
  { reason: 'Setup & changeover', minutes: 248, cumulative: 32, category: 'Availability' },
  { reason: 'Material wait', minutes: 192, cumulative: 56, category: 'Availability' },
  { reason: 'Reduced speed', minutes: 164, cumulative: 77, category: 'Performance' },
  { reason: 'Minor stops', minutes: 98, cumulative: 90, category: 'Performance' },
  { reason: 'Defects / rework', minutes: 56, cumulative: 97, category: 'Quality' },
  { reason: 'Startup losses', minutes: 24, cumulative: 100, category: 'Quality' },
];

const trend = [
  { day: 'Mon', oee: 0.74 },
  { day: 'Tue', oee: 0.76 },
  { day: 'Wed', oee: 0.78 },
  { day: 'Thu', oee: 0.77 },
  { day: 'Fri', oee: 0.79 },
  { day: 'Sat', oee: 0.81 },
  { day: 'Sun', oee: 0.78 },
];

function oeeColor(v: number): string {
  if (v >= 0.85) return 'hsl(var(--chart-2))';
  if (v >= 0.70) return 'hsl(var(--chart-1))';
  if (v >= 0.50) return 'hsl(var(--warning))';
  return 'hsl(var(--destructive))';
}

const lossColor = ['hsl(var(--chart-1))','hsl(var(--chart-2))','hsl(var(--chart-3))','hsl(var(--chart-4))','hsl(var(--chart-5))','hsl(var(--chart-6))'];

export default function OeePage() {
  const [period, setPeriod] = React.useState('today');
  const plantOEE = machines.reduce((s, m) => s + m.oee, 0) / machines.length;
  const plantAvail = machines.reduce((s, m) => s + m.avail, 0) / machines.length;
  const plantPerf = machines.reduce((s, m) => s + m.perf, 0) / machines.length;
  const plantQual = machines.reduce((s, m) => s + m.qual, 0) / machines.length;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="OEE Dashboard"
        description="Overall Equipment Effectiveness · Availability × Performance × Quality"
        breadcrumbs={[
          { label: 'Manufacturing', href: '/app/manufacturing' },
          { label: 'OEE' },
        ]}
        actions={
          <>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
                <SelectItem value="quarter">This quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="size-4" /> Export
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Plant OEE</CardTitle>
            <CardDescription>Aggregated across all work centers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div>
                <div className="text-6xl font-bold tabular-nums" style={{ color: oeeColor(plantOEE) }}>
                  {formatPercent(plantOEE)}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-success">
                  <TrendingUp className="size-4" /> +2.1% vs last week
                </div>
              </div>
              <div className="ml-auto grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-semibold tabular-nums">{formatPercent(plantAvail)}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">Availability</div>
                </div>
                <div className="border-x border-border px-6">
                  <div className="text-3xl font-semibold tabular-nums">{formatPercent(plantPerf)}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">Performance</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold tabular-nums">{formatPercent(plantQual)}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">Quality</div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-muted">
              <div className="bg-destructive" style={{ width: `${50}%` }} title="< 50%" />
              <div className="bg-warning" style={{ width: '20%' }} title="50-70%" />
              <div className="bg-chart-1" style={{ width: '15%' }} title="70-85%" />
              <div className="bg-success" style={{ width: '15%' }} title="≥ 85% World Class" />
            </div>
            <div className="mt-1 flex justify-between text-2xs text-muted-foreground">
              <span>Poor</span>
              <span>Avg</span>
              <span>Good</span>
              <span>World Class</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>OEE Trend - Last 7 Days</CardTitle>
            <CardDescription>Plant-wide rolling OEE</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trend} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => formatPercent(v)} domain={[0.5, 1]} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number) => formatPercent(v)}
                  />
                  <Bar dataKey="oee" radius={[6, 6, 0, 0]}>
                    {trend.map((d, i) => (
                      <Cell key={i} fill={oeeColor(d.oee)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Losses Pareto</CardTitle>
          <CardDescription>Six big losses · ranked by lost minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={losses} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="reason" stroke="hsl(var(--muted-foreground))" fontSize={11} angle={-15} textAnchor="end" height={70} />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar yAxisId="left" dataKey="minutes" radius={[6, 6, 0, 0]} name="Lost minutes">
                  {losses.map((l, i) => (
                    <Cell key={i} fill={lossColor[i]} />
                  ))}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--destructive))' }} name="Cumulative %" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Per-Machine OEE</CardTitle>
          <CardDescription>Drill-down by work center · click to view machine details</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Machine</th>
                <th>Name</th>
                <th className="text-right">Availability</th>
                <th className="text-right">Performance</th>
                <th className="text-right">Quality</th>
                <th className="text-right">OEE</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((m) => {
                const rating = m.oee >= 0.85 ? 'World class' : m.oee >= 0.70 ? 'Good' : m.oee >= 0.50 ? 'Average' : 'Poor';
                const variant = m.oee >= 0.85 ? 'success' : m.oee >= 0.70 ? 'info' : m.oee >= 0.50 ? 'warning' : 'destructive';
                return (
                  <tr key={m.id} className="cursor-pointer hover:bg-muted/40">
                    <td className="font-mono text-xs font-medium text-primary">{m.id}</td>
                    <td className="text-xs">{m.name}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Progress value={m.avail * 100} className="h-1 w-16" />
                        <span className="font-mono tabular-nums">{formatPercent(m.avail)}</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Progress value={m.perf * 100} className="h-1 w-16" />
                        <span className="font-mono tabular-nums">{formatPercent(m.perf)}</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Progress value={m.qual * 100} className="h-1 w-16" />
                        <span className="font-mono tabular-nums">{formatPercent(m.qual)}</span>
                      </div>
                    </td>
                    <td className="text-right font-mono font-bold tabular-nums" style={{ color: oeeColor(m.oee) }}>
                      {formatPercent(m.oee)}
                    </td>
                    <td><Badge variant={variant as 'success' | 'info' | 'warning' | 'destructive'} size="sm">{rating}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
