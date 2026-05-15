'use client';

import * as React from 'react';
import { AlertTriangle, Clock, Download, Plus } from 'lucide-react';
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
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatNumber, initials } from '@/lib/utils';

const events = [
  { id: 'DT-3421', machine: 'CNC-07', reason: 'Spindle overheat', category: 'Breakdown', start: '14:08', duration: 24, status: 'open' as const, reporter: 'C. Mendez', impact: 480 },
  { id: 'DT-3420', machine: 'LATHE-01', reason: 'Material wait - shaft stock', category: 'Material', start: '13:22', duration: 38, status: 'closed' as const, reporter: 'L. Rodriguez', impact: 760 },
  { id: 'DT-3419', machine: 'CNC-03', reason: 'Setup changeover Op-30 → Op-50', category: 'Setup', start: '11:45', duration: 42, status: 'closed' as const, reporter: 'A. Nasser', impact: 0 },
  { id: 'DT-3418', machine: 'CNC-05', reason: 'Tooling change - end mill', category: 'Setup', start: '10:18', duration: 12, status: 'closed' as const, reporter: 'D. Thompson', impact: 0 },
  { id: 'DT-3417', machine: 'CNC-02', reason: 'Coolant top-up', category: 'Maintenance', start: '09:52', duration: 8, status: 'closed' as const, reporter: 'C. Mendez', impact: 80 },
  { id: 'DT-3416', machine: 'PRESS-01', reason: 'Quality hold - dimensional', category: 'Quality', start: '09:14', duration: 18, status: 'closed' as const, reporter: 'P. Krishnan', impact: 220 },
  { id: 'DT-3415', machine: 'ASSY-01', reason: 'Component shortage - bearings', category: 'Material', start: '08:38', duration: 32, status: 'closed' as const, reporter: 'S. Davies', impact: 380 },
  { id: 'DT-3414', machine: 'CNC-04', reason: 'Programmer assistance', category: 'Operator', start: '07:55', duration: 14, status: 'closed' as const, reporter: 'C. Mendez', impact: 140 },
  { id: 'DT-3413', machine: 'CNC-01', reason: 'Shift handover', category: 'Operator', start: '06:00', duration: 16, status: 'closed' as const, reporter: 'M. Jensen', impact: 0 },
  { id: 'DT-3412', machine: 'CNC-06', reason: 'Air pressure low', category: 'Breakdown', start: '06:14', duration: 22, status: 'closed' as const, reporter: 'A. Nasser', impact: 240 },
];

const paretoData = [
  { reason: 'Setup / changeover', minutes: 248, cumulative: 27.6, color: 'hsl(var(--chart-1))' },
  { reason: 'Material shortage', minutes: 192, cumulative: 49.0, color: 'hsl(var(--chart-2))' },
  { reason: 'Unplanned breakdown', minutes: 148, cumulative: 65.5, color: 'hsl(var(--chart-3))' },
  { reason: 'Quality hold', minutes: 96, cumulative: 76.2, color: 'hsl(var(--chart-4))' },
  { reason: 'Operator break', minutes: 78, cumulative: 84.9, color: 'hsl(var(--chart-5))' },
  { reason: 'Tool change', minutes: 62, cumulative: 91.8, color: 'hsl(var(--chart-6))' },
  { reason: 'Maintenance', minutes: 48, cumulative: 97.1, color: 'hsl(var(--chart-7))' },
  { reason: 'Other', minutes: 26, cumulative: 100, color: 'hsl(var(--chart-8))' },
];

const trendData = [
  { day: '05/09', total: 384 },
  { day: '05/10', total: 422 },
  { day: '05/11', total: 296 },
  { day: '05/12', total: 348 },
  { day: '05/13', total: 412 },
  { day: '05/14', total: 168 },
  { day: '05/15', total: 226 },
];

const machinesTrend = [
  { id: 'CNC-04', total: 14 },
  { id: 'CNC-01', total: 22 },
  { id: 'PRESS-01', total: 28 },
  { id: 'ASSY-02', total: 38 },
  { id: 'CNC-02', total: 46 },
  { id: 'CNC-06', total: 58 },
  { id: 'ASSY-01', total: 74 },
  { id: 'CNC-05', total: 88 },
  { id: 'ASSY-03', total: 102 },
  { id: 'CNC-03', total: 128 },
  { id: 'LATHE-01', total: 184 },
  { id: 'CNC-07', total: 224 },
];

const categoryVariant: Record<string, 'destructive' | 'warning' | 'info' | 'soft' | 'secondary' | 'default'> = {
  Breakdown: 'destructive', Setup: 'warning', Material: 'info', Quality: 'soft', Maintenance: 'secondary', Operator: 'default',
};

export default function DowntimePage() {
  const [machineFilter, setMachineFilter] = React.useState('all');
  const totalToday = events.reduce((s, e) => s + e.duration, 0);
  const totalImpact = events.reduce((s, e) => s + e.impact, 0);
  const filtered = events.filter((e) => machineFilter === 'all' || e.machine === machineFilter);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Downtime Log"
        description="All planned and unplanned stoppages tracked across the shop floor."
        breadcrumbs={[
          { label: 'Manufacturing', href: '/app/manufacturing' },
          { label: 'Downtime' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> Record downtime</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Total today</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{Math.floor(totalToday / 60)}h {totalToday % 60}m</div>
            <div className="mt-1 text-xs text-success">-18% vs avg</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Events</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{events.length}</div>
            <div className="mt-1 text-xs text-muted-foreground">{events.filter((e) => e.status === 'open').length} open</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Lost output</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{formatNumber(totalImpact)}</div>
            <div className="mt-1 text-xs text-muted-foreground">units missed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Most affected</div>
            <div className="mt-1 text-xl font-bold">CNC-07</div>
            <div className="mt-1 text-xs text-destructive">3 events · 84m</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pareto of Reasons</CardTitle>
            <CardDescription>Top 80% of downtime stems from setup + material + breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={paretoData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="reason" stroke="hsl(var(--muted-foreground))" fontSize={10} angle={-25} textAnchor="end" height={70} />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar yAxisId="left" dataKey="minutes" radius={[6, 6, 0, 0]}>
                    {paretoData.map((p, i) => (<Cell key={i} fill={p.color} />))}
                  </Bar>
                  <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trend - last 7 days</CardTitle>
            <CardDescription>Daily total downtime in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Per-Machine Downtime</CardTitle>
          <CardDescription>Total minutes this week · color-coded by severity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={machinesTrend} layout="vertical" margin={{ top: 5, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} horizontal={false} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis type="category" dataKey="id" stroke="hsl(var(--muted-foreground))" fontSize={11} width={80} />
                <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                  {machinesTrend.map((m, i) => (
                    <Cell key={i} fill={m.total > 150 ? 'hsl(var(--destructive))' : m.total > 80 ? 'hsl(var(--warning))' : 'hsl(var(--chart-1))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Live downtime ledger</CardDescription>
          </div>
          <Select value={machineFilter} onValueChange={setMachineFilter}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Filter machine" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All machines</SelectItem>
              {machinesTrend.map((m) => (<SelectItem key={m.id} value={m.id}>{m.id}</SelectItem>))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Machine</th>
                <th>Reason</th>
                <th>Category</th>
                <th>Start</th>
                <th className="text-right">Duration</th>
                <th className="text-right">Lost units</th>
                <th>Reporter</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td className="font-mono text-xs text-primary">{e.id}</td>
                  <td className="font-mono text-xs">{e.machine}</td>
                  <td className="text-sm">{e.reason}</td>
                  <td><Badge variant={categoryVariant[e.category] || 'default'} size="sm">{e.category}</Badge></td>
                  <td className="font-mono text-xs">{e.start}</td>
                  <td className="text-right font-mono">{e.duration}m</td>
                  <td className="text-right font-mono text-muted-foreground">{e.impact ? formatNumber(e.impact) : '—'}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Avatar size="xs"><AvatarFallback>{initials(e.reporter)}</AvatarFallback></Avatar>
                      <span className="text-xs">{e.reporter}</span>
                    </div>
                  </td>
                  <td><StatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
