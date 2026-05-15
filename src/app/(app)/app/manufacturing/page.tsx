'use client';

import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  Factory,
  Gauge,
  Hammer,
  Layers,
  Plus,
  TrendingDown,
  TrendingUp,
  Wrench,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { initials, formatNumber, formatPercent } from '@/lib/utils';

const stats = [
  { label: 'Active work orders', value: 28, delta: 6.4, format: 'number' as const, icon: Hammer, sparkline: [22, 24, 23, 26, 25, 27, 28, 28] },
  { label: 'Plant OEE', value: 0.783, delta: 2.1, format: 'percent' as const, icon: Gauge, sparkline: [0.74, 0.75, 0.76, 0.77, 0.76, 0.78, 0.78, 0.78] },
  { label: 'Downtime today', value: 142, delta: -18.3, format: 'number' as const, icon: AlertTriangle, invertTrend: true, sparkline: [180, 175, 170, 160, 155, 150, 145, 142] },
  { label: 'Scrap rate', value: 0.024, delta: -8.5, format: 'percent' as const, icon: TrendingDown, invertTrend: true, sparkline: [0.030, 0.029, 0.028, 0.027, 0.026, 0.025, 0.024, 0.024] },
];

const outputData = [
  { hour: '06:00', plan: 120, actual: 118 },
  { hour: '07:00', plan: 240, actual: 232 },
  { hour: '08:00', plan: 360, actual: 348 },
  { hour: '09:00', plan: 480, actual: 472 },
  { hour: '10:00', plan: 600, actual: 588 },
  { hour: '11:00', plan: 720, actual: 706 },
  { hour: '12:00', plan: 840, actual: 822 },
  { hour: '13:00', plan: 960, actual: 940 },
  { hour: '14:00', plan: 1080, actual: 1062 },
  { hour: '15:00', plan: 1200, actual: 1178 },
];

const liveWorkOrders = [
  { wo: 'WO-24891', part: 'GBX-450-A', desc: 'Gearbox housing, alloy', qty: 240, done: 156, owner: 'Carlos M.', machine: 'CNC-04', status: 'in_progress' as const, eta: '4:20 PM' },
  { wo: 'WO-24890', part: 'BRK-220-S', desc: 'Brake caliper, steel', qty: 480, done: 412, owner: 'Aisha N.', machine: 'CNC-02', status: 'in_progress' as const, eta: '2:45 PM' },
  { wo: 'WO-24889', part: 'VLV-104-B', desc: 'Hydraulic valve', qty: 120, done: 120, owner: 'Devon T.', machine: 'CNC-07', status: 'completed' as const, eta: 'Done' },
  { wo: 'WO-24888', part: 'PMP-310-X', desc: 'Centrifugal pump assy', qty: 60, done: 22, owner: 'Priya K.', machine: 'ASSY-03', status: 'in_progress' as const, eta: 'Tomorrow' },
  { wo: 'WO-24887', part: 'SHF-660-C', desc: 'Drive shaft, machined', qty: 800, done: 0, owner: 'Liam R.', machine: 'LATHE-01', status: 'pending' as const, eta: '5:00 PM' },
  { wo: 'WO-24886', part: 'MTR-2.2KW', desc: '2.2kW induction motor', qty: 24, done: 18, owner: 'Sofia D.', machine: 'ASSY-01', status: 'on_hold' as const, eta: '6:15 PM' },
];

const downtimeReasons = [
  { reason: 'Setup / changeover', minutes: 48, color: 'hsl(var(--chart-1))' },
  { reason: 'Material shortage', minutes: 32, color: 'hsl(var(--chart-2))' },
  { reason: 'Unplanned breakdown', minutes: 28, color: 'hsl(var(--chart-3))' },
  { reason: 'Quality hold', minutes: 18, color: 'hsl(var(--chart-4))' },
  { reason: 'Operator break', minutes: 16, color: 'hsl(var(--chart-5))' },
];

const machineStatus = [
  { id: 'CNC-01', state: 'running', util: 92, lastSig: '2s' },
  { id: 'CNC-02', state: 'running', util: 87, lastSig: '4s' },
  { id: 'CNC-03', state: 'idle', util: 0, lastSig: '12m' },
  { id: 'CNC-04', state: 'running', util: 94, lastSig: '1s' },
  { id: 'CNC-05', state: 'setup', util: 0, lastSig: '8s' },
  { id: 'CNC-06', state: 'running', util: 78, lastSig: '3s' },
  { id: 'CNC-07', state: 'fault', util: 0, lastSig: '4m' },
  { id: 'ASSY-01', state: 'running', util: 82, lastSig: '5s' },
  { id: 'ASSY-02', state: 'running', util: 88, lastSig: '2s' },
  { id: 'ASSY-03', state: 'running', util: 71, lastSig: '6s' },
  { id: 'LATHE-01', state: 'idle', util: 0, lastSig: '22m' },
  { id: 'PRESS-01', state: 'running', util: 90, lastSig: '1s' },
];

const stateColor: Record<string, string> = {
  running: 'bg-success/15 border-success/40 text-success',
  idle: 'bg-muted border-border text-muted-foreground',
  setup: 'bg-warning/15 border-warning/40 text-warning',
  fault: 'bg-destructive/15 border-destructive/40 text-destructive',
};

const oeeBreakdown = [
  { name: 'Availability', value: 0.886, target: 0.90 },
  { name: 'Performance', value: 0.921, target: 0.95 },
  { name: 'Quality', value: 0.958, target: 0.98 },
];

export default function ManufacturingDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Manufacturing"
        description="Live shop floor visibility. Work orders, OEE, downtime and output vs plan."
        breadcrumbs={[{ label: 'Operations', href: '/app' }, { label: 'Manufacturing' }]}
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" /> Export
            </Button>
            <Button asChild>
              <Link href="/app/manufacturing/work-orders">
                <Plus className="size-4" /> New work order
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Output vs Plan</CardTitle>
              <CardDescription>Cumulative units today · 06:00 - 18:00</CardDescription>
            </div>
            <Badge variant="soft"><TrendingUp className="size-3" /> 98.2% attainment</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={outputData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="planG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="actG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="plan" stroke="hsl(var(--chart-2))" strokeDasharray="5 5" fill="url(#planG)" name="Plan" />
                  <Area type="monotone" dataKey="actual" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#actG)" name="Actual" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>OEE Breakdown</CardTitle>
            <CardDescription>A × P × Q = 78.3%</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {oeeBreakdown.map((b) => (
              <div key={b.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{b.name}</span>
                  <div className="flex items-baseline gap-2 tabular-nums">
                    <span className="text-lg font-semibold">{formatPercent(b.value)}</span>
                    <span className="text-xs text-muted-foreground">/ {formatPercent(b.target)}</span>
                  </div>
                </div>
                <Progress
                  value={b.value * 100}
                  indicatorClassName={b.value >= b.target ? 'bg-success' : b.value >= b.target * 0.92 ? 'bg-warning' : 'bg-destructive'}
                />
              </div>
            ))}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall OEE</span>
                <span className="text-2xl font-bold tabular-nums">{formatPercent(0.886 * 0.921 * 0.958)}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">World class: ≥ 85%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Live Work Orders</CardTitle>
              <CardDescription>Currently in execution on the shop floor</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/manufacturing/work-orders">
                All orders <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>WO / Part</th>
                  <th>Owner</th>
                  <th>Machine</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th className="text-right">ETA</th>
                </tr>
              </thead>
              <tbody>
                {liveWorkOrders.map((w) => {
                  const pct = Math.round((w.done / w.qty) * 100);
                  return (
                    <tr key={w.wo}>
                      <td>
                        <Link href={`/app/manufacturing/work-orders/${w.wo}`} className="font-mono text-xs text-primary hover:underline">
                          {w.wo}
                        </Link>
                        <div className="text-xs text-muted-foreground">{w.part} · {w.desc}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar size="xs"><AvatarFallback>{initials(w.owner)}</AvatarFallback></Avatar>
                          <span className="text-xs">{w.owner}</span>
                        </div>
                      </td>
                      <td className="font-mono text-xs">{w.machine}</td>
                      <td className="w-40">
                        <div className="flex items-center gap-2">
                          <Progress value={pct} className="h-1.5 w-24" />
                          <span className="text-xs tabular-nums text-muted-foreground">{w.done}/{w.qty}</span>
                        </div>
                      </td>
                      <td><StatusBadge status={w.status} /></td>
                      <td className="text-right text-xs text-muted-foreground">{w.eta}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Downtime Pareto</CardTitle>
            <CardDescription>Top 5 reasons · today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={downtimeReasons} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis type="category" dataKey="reason" stroke="hsl(var(--muted-foreground))" fontSize={10} width={120} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="minutes" radius={[0, 4, 4, 0]}>
                    {downtimeReasons.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Machine Status Grid</CardTitle>
            <CardDescription>Real-time shop floor snapshot · refreshed every 2s</CardDescription>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-success" /> Running</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-warning" /> Setup</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-muted-foreground" /> Idle</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-destructive" /> Fault</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {machineStatus.map((m) => (
              <div
                key={m.id}
                className={`rounded-lg border p-3 transition-colors ${stateColor[m.state]}`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs font-medium">{m.id}</div>
                  <Factory className="size-3.5 opacity-60" />
                </div>
                <div className="mt-2 text-2xl font-bold tabular-nums">{m.util}%</div>
                <div className="mt-1 text-2xs uppercase tracking-wide opacity-70">{m.state} · {m.lastSig}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
