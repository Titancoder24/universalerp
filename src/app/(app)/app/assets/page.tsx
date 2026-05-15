'use client';

import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Boxes,
  CalendarClock,
  Cog,
  DollarSign,
  Download,
  Factory,
  Plus,
  Wrench,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Progress } from '@/components/ui/progress';
import { formatCompactNumber, formatCurrency, formatPercent } from '@/lib/utils';

const stats = [
  { label: 'Total asset value', value: 18420590, delta: 3.2, format: 'currency' as const, icon: DollarSign, sparkline: [180, 182, 181, 183, 184, 184, 184, 184] },
  { label: 'Registered assets', value: 1842, delta: 1.8, format: 'number' as const, icon: Boxes, sparkline: [1810, 1820, 1825, 1830, 1835, 1840, 1842, 1842] },
  { label: 'Open work orders', value: 38, delta: -12, format: 'number' as const, icon: Wrench, invertTrend: true, sparkline: [48, 46, 44, 42, 40, 39, 38, 38] },
  { label: 'Overdue PMs', value: 6, delta: 28, format: 'number' as const, icon: AlertTriangle, invertTrend: true, sparkline: [3, 3, 4, 5, 5, 6, 6, 6] },
];

const byCategory = [
  { name: 'CNC Machines', value: 7240000, count: 24, fill: 'hsl(var(--chart-1))' },
  { name: 'Assembly Equipment', value: 4180000, count: 38, fill: 'hsl(var(--chart-2))' },
  { name: 'Material Handling', value: 2840000, count: 86, fill: 'hsl(var(--chart-3))' },
  { name: 'Test & Lab', value: 1980000, count: 142, fill: 'hsl(var(--chart-4))' },
  { name: 'HVAC & Utility', value: 1240000, count: 28, fill: 'hsl(var(--chart-5))' },
  { name: 'Vehicles', value: 540000, count: 18, fill: 'hsl(var(--chart-6))' },
  { name: 'IT & Office', value: 400590, count: 1506, fill: 'hsl(var(--chart-7))' },
];

const criticality = [
  { level: 'A - Critical', count: 124, color: 'hsl(var(--destructive))', pct: 6.7 },
  { level: 'B - High', count: 328, color: 'hsl(var(--warning))', pct: 17.8 },
  { level: 'C - Medium', count: 612, color: 'hsl(var(--chart-1))', pct: 33.2 },
  { level: 'D - Low', count: 778, color: 'hsl(var(--muted-foreground))', pct: 42.3 },
];

const upcomingPMs = [
  { code: 'CNC-04', name: 'DMG Mori NLX', due: 'Today', task: '500hr lubrication', criticality: 'A', overdue: false },
  { code: 'PRESS-01', name: 'Schuler 250T', due: 'Tomorrow', task: 'Hydraulic filter change', criticality: 'A', overdue: false },
  { code: 'CNC-07', name: 'Hardinge Bridgeport', due: '2 days', task: 'Spindle inspection', criticality: 'B', overdue: false },
  { code: 'HVAC-A1', name: 'Bay A AHU', due: 'Overdue 3d', task: 'Filter replacement', criticality: 'B', overdue: true },
  { code: 'CMM-001', name: 'Zeiss Contura', due: '4 days', task: 'Calibration check', criticality: 'A', overdue: false },
  { code: 'FORK-08', name: 'Toyota 8FBC25', due: '5 days', task: '250hr service', criticality: 'C', overdue: false },
];

const recentWO = [
  { id: 'MWO-2891', asset: 'CNC-07', type: 'Corrective', desc: 'Spindle overheat investigation', priority: 'urgent', status: 'open' as const },
  { id: 'MWO-2890', asset: 'CNC-04', type: 'Preventive', desc: '500hr lubrication service', priority: 'med', status: 'in_progress' as const },
  { id: 'MWO-2889', asset: 'HVAC-A1', type: 'Preventive', desc: 'Filter replacement', priority: 'low', status: 'open' as const },
  { id: 'MWO-2888', asset: 'PRESS-01', type: 'Predictive', desc: 'Hydraulic pump bearing trend', priority: 'med', status: 'in_progress' as const },
  { id: 'MWO-2887', asset: 'FORK-03', type: 'Corrective', desc: 'Lift cylinder leak repair', priority: 'high', status: 'completed' as const },
];

export default function AssetsDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Assets"
        description="Equipment, machines, vehicles and infrastructure registry with maintenance & criticality."
        breadcrumbs={[{ label: 'Operations', href: '/app' }, { label: 'Assets' }]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button asChild>
              <Link href="/app/assets/list"><Plus className="size-4" /> New asset</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (<StatCard key={s.label} {...s} />))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Asset Value by Category</CardTitle>
            <CardDescription>Replacement value distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCategory} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => formatCompactNumber(v)} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={120} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => formatCurrency(v)} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {byCategory.map((c, i) => (<Cell key={i} fill={c.fill} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Criticality Distribution</CardTitle>
            <CardDescription>ABC classification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={criticality} dataKey="count" nameKey="level" cx="50%" cy="50%" innerRadius={36} outerRadius={64} paddingAngle={2}>
                    {criticality.map((c, i) => (<Cell key={i} fill={c.color} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {criticality.map((c) => (
              <div key={c.level} className="flex items-center gap-2 text-sm">
                <span className="size-2.5 rounded-sm" style={{ background: c.color }} />
                <span className="flex-1 text-xs">{c.level}</span>
                <span className="font-mono tabular-nums">{c.count}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{c.pct}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Preventive Maintenance</CardTitle>
              <CardDescription>Next 7 days</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/assets/maintenance">All PMs <ArrowRight className="size-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Task</th>
                  <th>Due</th>
                  <th>Criticality</th>
                </tr>
              </thead>
              <tbody>
                {upcomingPMs.map((p) => (
                  <tr key={p.code}>
                    <td>
                      <div className="font-mono text-xs text-primary">{p.code}</div>
                      <div className="text-xs text-muted-foreground">{p.name}</div>
                    </td>
                    <td className="text-sm">{p.task}</td>
                    <td className={`text-xs ${p.overdue ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>{p.due}</td>
                    <td>
                      <Badge variant={p.criticality === 'A' ? 'destructive' : p.criticality === 'B' ? 'warning' : 'secondary'} size="sm">
                        {p.criticality}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Maintenance Orders</CardTitle>
              <CardDescription>Latest activity</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/assets/maintenance">All work orders <ArrowRight className="size-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>WO</th>
                  <th>Asset</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentWO.map((w) => (
                  <tr key={w.id}>
                    <td className="font-mono text-xs text-primary">{w.id}</td>
                    <td className="font-mono text-xs">{w.asset}</td>
                    <td className="text-sm">{w.desc}</td>
                    <td><Badge variant="outline" size="sm">{w.type}</Badge></td>
                    <td><StatusBadge status={w.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
