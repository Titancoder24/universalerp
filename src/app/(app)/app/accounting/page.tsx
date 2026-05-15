'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ArrowDown,
  Banknote,
  BookOpen,
  Building2,
  Calculator,
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  CreditCard,
  Download,
  FileBarChart,
  FileText,
  Landmark,
  Plus,
  Receipt,
  RefreshCw,
  Scale,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';

const stats = [
  {
    label: 'Cash position',
    value: 2840320,
    delta: 4.2,
    format: 'currency' as const,
    icon: Wallet,
    sparkline: [2.4, 2.5, 2.45, 2.6, 2.7, 2.75, 2.84],
  },
  {
    label: 'Net income (MTD)',
    value: 412580,
    delta: 18.6,
    format: 'currency' as const,
    icon: TrendingUp,
    sparkline: [220, 248, 268, 290, 348, 388, 412],
  },
  {
    label: 'Accounts receivable',
    value: 487320,
    delta: -2.4,
    format: 'currency' as const,
    icon: Receipt,
    sparkline: [520, 510, 498, 502, 495, 490, 487],
    invertTrend: true,
  },
  {
    label: 'Accounts payable',
    value: 318450,
    delta: 6.8,
    format: 'currency' as const,
    icon: CreditCard,
    sparkline: [298, 305, 310, 312, 316, 318, 318],
  },
];

const revenueVsExpense = [
  { month: 'Nov', revenue: 248000, expense: 168000 },
  { month: 'Dec', revenue: 268000, expense: 178000 },
  { month: 'Jan', revenue: 245000, expense: 172000 },
  { month: 'Feb', revenue: 271000, expense: 185000 },
  { month: 'Mar', revenue: 294000, expense: 198000 },
  { month: 'Apr', revenue: 312000, expense: 204000 },
  { month: 'May', revenue: 384320, expense: 218000 },
];

const cashTrend = [
  { day: 'M', cash: 2.42 },
  { day: 'T', cash: 2.48 },
  { day: 'W', cash: 2.55 },
  { day: 'T', cash: 2.62 },
  { day: 'F', cash: 2.71 },
  { day: 'S', cash: 2.78 },
  { day: 'S', cash: 2.84 },
];

const closeStatus = [
  { period: 'May 2026', status: 'in_progress' as const, progress: 68, owner: 'Sarah Chen', dueDate: 'May 31' },
  { period: 'April 2026', status: 'completed' as const, progress: 100, owner: 'Sarah Chen', dueDate: 'Apr 30' },
  { period: 'March 2026', status: 'completed' as const, progress: 100, owner: 'Marcus Reid', dueDate: 'Mar 31' },
  { period: 'February 2026', status: 'completed' as const, progress: 100, owner: 'Marcus Reid', dueDate: 'Feb 28' },
];

const taxFilings = [
  { type: 'Sales Tax', jurisdiction: 'California', dueDate: 'May 31, 2026', amount: 18420, status: 'pending' as const },
  { type: 'Sales Tax', jurisdiction: 'New York', dueDate: 'Jun 15, 2026', amount: 12180, status: 'draft' as const },
  { type: 'Payroll Tax', jurisdiction: 'Federal', dueDate: 'Jun 30, 2026', amount: 84320, status: 'draft' as const },
  { type: 'Income Tax', jurisdiction: 'Federal Q2', dueDate: 'Jul 15, 2026', amount: 128500, status: 'draft' as const },
];

const quickLinks = [
  { label: 'Chart of Accounts', icon: BookOpen, href: '/app/accounting/coa' },
  { label: 'Journal Entries', icon: FileText, href: '/app/accounting/journal' },
  { label: 'Bank Reconciliation', icon: Landmark, href: '/app/accounting/bank' },
  { label: 'Fixed Assets', icon: Building2, href: '/app/accounting/fixed-assets' },
  { label: 'Budgets', icon: Calculator, href: '/app/accounting/budgets' },
  { label: 'Cash Flow', icon: TrendingUp, href: '/app/accounting/cashflow' },
  { label: 'Tax Center', icon: Scale, href: '/app/accounting/tax' },
  { label: 'Reports', icon: FileBarChart, href: '/app/accounting/reports' },
];

export default function AccountingDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Accounting"
        description="Real-time financial position, period close progress, and compliance signals across every entity."
        breadcrumbs={[{ label: 'Home', href: '/app' }, { label: 'Accounting' }]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Calendar className="size-4" /> May 2026
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm" asChild>
              <Link href="/app/accounting/journal/new">
                <Plus className="size-4" /> New entry
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            delta={s.delta}
            format={s.format}
            icon={s.icon}
            sparkline={s.sparkline}
            invertTrend={s.invertTrend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Trailing 7 months · consolidated</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/accounting/reports/pnl">
                Open P&amp;L <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueVsExpense} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
                <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expenses" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Position</CardTitle>
            <CardDescription>Last 7 days · all accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-3xl font-semibold tabular-nums">{formatCurrency(2840320)}</span>
              <span className="text-xs text-success font-medium">+ $420K WoW</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={cashTrend} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis hide domain={['dataMin - 0.1', 'dataMax + 0.05']} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v: number) => [`$${v.toFixed(2)}M`, 'Cash']}
                />
                <Area type="monotone" dataKey="cash" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="url(#cashGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Period Close Status</CardTitle>
              <CardDescription>Multi-entity monthly close tracking</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="size-4" /> Refresh
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {closeStatus.map((c) => (
              <div key={c.period} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-md ${c.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                      {c.status === 'completed' ? <CheckCircle2 className="size-4" /> : <Clock className="size-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{c.period}</p>
                      <p className="text-xs text-muted-foreground">Owner: {c.owner} · Due {c.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm tabular-nums">{c.progress}%</span>
                    <StatusBadge status={c.status} />
                  </div>
                </div>
                <Progress value={c.progress} indicatorClassName={c.status === 'completed' ? 'bg-success' : 'bg-warning'} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Tax Filings</CardTitle>
              <CardDescription>Due in the next 60 days</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/accounting/tax">
                All <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {taxFilings.map((t) => (
              <div key={`${t.type}-${t.jurisdiction}`} className="flex items-start justify-between gap-3 rounded-md border border-border p-3 hover:bg-muted/40 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{t.type}</p>
                  <p className="text-xs text-muted-foreground">{t.jurisdiction}</p>
                  <p className="mt-1 text-xs font-medium text-warning">Due {t.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm tabular-nums">{formatCurrency(t.amount)}</p>
                  <div className="mt-1 flex justify-end">
                    <StatusBadge status={t.status} size="sm" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Jump to the most-used accounting tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {quickLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center hover:bg-muted/50 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <l.icon className="size-5" />
                </div>
                <span className="text-xs font-medium">{l.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              AI Financial Insights
            </CardTitle>
            <CardDescription>Generated 6 minutes ago · refreshed hourly</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-success/30 bg-success/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="size-4 text-success" />
              <span className="text-xs font-semibold uppercase tracking-wide text-success">Strong margin</span>
            </div>
            <p className="text-sm">
              Gross margin improved to <span className="font-medium">42.8%</span> — up 380 bps QoQ driven by reduced COGS.
            </p>
          </div>
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingDown className="size-4 text-warning" />
              <span className="text-xs font-semibold uppercase tracking-wide text-warning">Watch list</span>
            </div>
            <p className="text-sm">
              DSO crept up to <span className="font-medium">52 days</span>. 3 invoices over $50K are aging beyond 60 days.
            </p>
          </div>
          <div className="rounded-lg border border-info/30 bg-info/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Banknote className="size-4 text-info" />
              <span className="text-xs font-semibold uppercase tracking-wide text-info">Cash forecast</span>
            </div>
            <p className="text-sm">
              13-week forecast shows positive cash through Q3 with peak need of <span className="font-medium">{formatCurrency(312000)}</span>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
