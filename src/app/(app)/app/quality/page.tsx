'use client';

import Link from 'next/link';
import {
  AlertCircle,
  AlertOctagon,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Download,
  FileWarning,
  Plus,
  ShieldCheck,
  Star,
  TrendingDown,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
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
import { initials, formatCurrency, formatPercent } from '@/lib/utils';

const stats = [
  { label: 'Open NCRs', value: 14, delta: -22, format: 'number' as const, icon: FileWarning, invertTrend: true, sparkline: [22, 20, 19, 17, 16, 15, 14, 14] },
  { label: 'Overdue CAPAs', value: 6, delta: 14, format: 'number' as const, icon: AlertOctagon, invertTrend: true, sparkline: [4, 4, 5, 5, 6, 6, 6, 6] },
  { label: 'Inspections today', value: 47, delta: 8.4, format: 'number' as const, icon: ClipboardList, sparkline: [38, 40, 42, 44, 46, 47, 47, 47] },
  { label: 'First pass yield', value: 0.961, delta: 1.2, format: 'percent' as const, icon: CheckCircle2, sparkline: [0.952, 0.954, 0.957, 0.960, 0.961, 0.961, 0.961, 0.961] },
];

const ncrTrend = [
  { week: 'Wk 14', opened: 12, closed: 8 },
  { week: 'Wk 15', opened: 9, closed: 11 },
  { week: 'Wk 16', opened: 14, closed: 10 },
  { week: 'Wk 17', opened: 8, closed: 12 },
  { week: 'Wk 18', opened: 11, closed: 13 },
  { week: 'Wk 19', opened: 7, closed: 9 },
  { week: 'Wk 20', opened: 6, closed: 8 },
];

const defectCategories = [
  { name: 'Dimensional', value: 38, fill: 'hsl(var(--chart-1))' },
  { name: 'Surface', value: 24, fill: 'hsl(var(--chart-2))' },
  { name: 'Assembly', value: 18, fill: 'hsl(var(--chart-3))' },
  { name: 'Material', value: 12, fill: 'hsl(var(--chart-4))' },
  { name: 'Functional', value: 8, fill: 'hsl(var(--chart-5))' },
];

const supplierScores = [
  { name: 'Acme Castings Co.', score: 96, deliveries: 142, defectsPpm: 380 },
  { name: 'SKF Distributors', score: 99, deliveries: 88, defectsPpm: 92 },
  { name: 'Parker Seals Inc.', score: 94, deliveries: 64, defectsPpm: 720 },
  { name: 'MetalCorp USA', score: 91, deliveries: 38, defectsPpm: 1240 },
  { name: 'Sherwin-Williams', score: 88, deliveries: 22, defectsPpm: 1850 },
  { name: 'Gasket Solutions', score: 85, deliveries: 28, defectsPpm: 2240 },
];

const openNcrs = [
  { id: 'NCR-1142', part: 'GBX-450-A', issue: 'Bore Φ22 oversized', severity: 'major', date: '2026-05-14', owner: 'P. Krishnan' },
  { id: 'NCR-1141', part: 'BRK-220-S', issue: 'Surface scratches', severity: 'minor', date: '2026-05-14', owner: 'A. Nasser' },
  { id: 'NCR-1140', part: 'CTL-PCBA-200', issue: 'Cold solder joint', severity: 'critical', date: '2026-05-13', owner: 'M. Jensen' },
  { id: 'NCR-1139', part: 'VLV-104-B', issue: 'Hydro test leak', severity: 'major', date: '2026-05-13', owner: 'D. Thompson' },
  { id: 'NCR-1138', part: 'MTR-2.2KW', issue: 'Insulation resistance low', severity: 'major', date: '2026-05-12', owner: 'S. Davies' },
];

const sevVariant = { critical: 'destructive' as const, major: 'warning' as const, minor: 'secondary' as const };

export default function QualityDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Quality"
        description="NCRs, CAPAs, inspections, audits and supplier quality at a glance."
        breadcrumbs={[{ label: 'Operations', href: '/app' }, { label: 'Quality' }]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New NCR</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (<StatCard key={s.label} {...s} />))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>NCR Activity</CardTitle>
            <CardDescription>Opened vs closed, last 7 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ncrTrend} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="opened" fill="hsl(var(--chart-1))" name="Opened" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="closed" fill="hsl(var(--chart-2))" name="Closed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Defect Categories</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={defectCategories} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={70} paddingAngle={2}>
                    {defectCategories.map((d, i) => (<Cell key={i} fill={d.fill} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {defectCategories.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="size-2 rounded-sm" style={{ background: d.fill }} />
                  <span className="flex-1">{d.name}</span>
                  <span className="font-mono tabular-nums">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent NCRs</CardTitle>
              <CardDescription>Open non-conformance reports</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/quality/ncr">All NCRs <ArrowRight className="size-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>NCR</th>
                  <th>Part</th>
                  <th>Issue</th>
                  <th>Severity</th>
                  <th>Owner</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {openNcrs.map((n) => (
                  <tr key={n.id}>
                    <td className="font-mono text-xs text-primary">{n.id}</td>
                    <td className="font-mono text-xs">{n.part}</td>
                    <td className="text-sm">{n.issue}</td>
                    <td><Badge variant={sevVariant[n.severity as keyof typeof sevVariant]} size="sm" className="capitalize">{n.severity}</Badge></td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Avatar size="xs"><AvatarFallback>{initials(n.owner)}</AvatarFallback></Avatar>
                        <span className="text-xs">{n.owner}</span>
                      </div>
                    </td>
                    <td className="text-xs text-muted-foreground">{n.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Supplier Quality Scores</CardTitle>
              <CardDescription>Acceptance rate, last 30 days</CardDescription>
            </div>
            <Badge variant="soft"><ShieldCheck className="size-3" /> Avg 92%</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {supplierScores.map((s) => (
              <div key={s.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.name}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{s.deliveries} dlvy</span>
                    <span>{s.defectsPpm} ppm</span>
                    <span className="font-mono font-semibold text-foreground tabular-nums">{s.score}%</span>
                  </div>
                </div>
                <Progress value={s.score} className="h-1.5" indicatorClassName={s.score >= 95 ? 'bg-success' : s.score >= 90 ? 'bg-chart-1' : 'bg-warning'} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
