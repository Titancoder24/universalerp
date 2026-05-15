import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Download,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  ShoppingCart,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCurrency, initials } from '@/lib/utils';
import { SalesTrend } from './_components/sales-trend';
import { SalesFunnel } from './_components/sales-funnel';
import { ArAging } from './_components/ar-aging';

const stats = [
  {
    label: 'Revenue MTD',
    value: 438210,
    delta: 14.2,
    format: 'currency' as const,
    icon: CircleDollarSign,
    sparkline: [220, 245, 268, 290, 312, 348, 388, 412, 438],
  },
  {
    label: 'Revenue QTD',
    value: 1148320,
    delta: 8.6,
    format: 'currency' as const,
    icon: ShoppingCart,
    sparkline: [380, 412, 438, 480, 524, 568, 612, 689, 1148],
  },
  {
    label: 'Revenue YTD',
    value: 4286410,
    delta: 22.4,
    format: 'currency' as const,
    icon: Trophy,
    sparkline: [180, 220, 280, 360, 480, 612, 780, 980, 1200],
  },
  {
    label: 'New Customers',
    value: 47,
    delta: 18.5,
    format: 'number' as const,
    icon: Users,
    sparkline: [12, 18, 22, 28, 32, 38, 42, 45, 47],
  },
];

const topCustomers = [
  { name: 'Acme Industries', revenue: 312420, orders: 23, change: 12, status: 'active' },
  { name: 'Global Manufacturing', revenue: 248950, orders: 18, change: 8, status: 'active' },
  { name: 'TechCorp Solutions', revenue: 198200, orders: 21, change: -3, status: 'active' },
  { name: 'Hospital Network LLC', revenue: 162800, orders: 14, change: 22, status: 'active' },
  { name: 'Northwest Logistics', revenue: 142400, orders: 11, change: 5, status: 'active' },
  { name: 'Apex Retail Group', revenue: 124300, orders: 19, change: -8, status: 'active' },
];

const activities = [
  {
    type: 'invoice',
    icon: FileText,
    user: 'Sarah Chen',
    action: 'sent invoice INV-2189 to',
    target: 'Acme Industries',
    amount: 12450,
    time: '12 min ago',
    tone: 'text-info',
  },
  {
    type: 'payment',
    icon: CircleDollarSign,
    user: 'System',
    action: 'received payment from',
    target: 'TechCorp Solutions',
    amount: 8900,
    time: '38 min ago',
    tone: 'text-success',
  },
  {
    type: 'quote',
    icon: FileText,
    user: 'Marcus Reid',
    action: 'created quote Q-1089 for',
    target: 'Hospital Network',
    amount: 56800,
    time: '1h ago',
    tone: 'text-primary',
  },
  {
    type: 'call',
    icon: Phone,
    user: 'Jenna Park',
    action: 'logged a call with',
    target: 'Regional Bank Corp',
    time: '2h ago',
    tone: 'text-muted-foreground',
  },
  {
    type: 'email',
    icon: Mail,
    user: 'Marcus Reid',
    action: 'emailed proposal to',
    target: 'Northwest Logistics',
    time: '3h ago',
    tone: 'text-muted-foreground',
  },
  {
    type: 'order',
    icon: ShoppingCart,
    user: 'Sarah Chen',
    action: 'converted quote to SO-3382 for',
    target: 'Apex Retail Group',
    amount: 34200,
    time: '5h ago',
    tone: 'text-success',
  },
];

const reps = [
  { name: 'Sarah Chen', closed: 348200, target: 400000, deals: 24, change: 18, badge: 'gold' },
  { name: 'Marcus Reid', closed: 312800, target: 350000, deals: 19, change: 12, badge: 'silver' },
  { name: 'Jenna Park', closed: 268400, target: 300000, deals: 22, change: 22, badge: 'bronze' },
  { name: 'David Kumar', closed: 198200, target: 250000, deals: 15, change: -4, badge: null },
  { name: 'Emily Rodriguez', closed: 184600, target: 220000, deals: 14, change: 6, badge: null },
  { name: 'James Liu', closed: 142000, target: 200000, deals: 11, change: -8, badge: null },
];

const badgeColors: Record<string, string> = {
  gold: 'bg-amber-400/15 text-amber-600 border-amber-400/20',
  silver: 'bg-slate-400/15 text-slate-600 border-slate-400/20',
  bronze: 'bg-orange-500/15 text-orange-600 border-orange-500/20',
};

export default function SalesOverviewPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Sales Overview"
        description="Pipeline health, revenue performance, and AR signals across every entity."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Sales' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <CalendarDays className="size-4" /> This quarter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm" asChild>
              <Link href="/app/sales/quotations/new">
                <Plus className="size-4" /> New quote
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
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue vs Target</CardTitle>
              <CardDescription>Trailing 12 months · all entities</CardDescription>
            </div>
            <Tabs defaultValue="monthly">
              <TabsList variant="pills">
                <TabsTrigger value="weekly" variant="pills">Week</TabsTrigger>
                <TabsTrigger value="monthly" variant="pills">Month</TabsTrigger>
                <TabsTrigger value="quarterly" variant="pills">Qtr</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <SalesTrend />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Funnel</CardTitle>
            <CardDescription>Conversion across all stages</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesFunnel />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>By revenue this quarter</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/sales/customers">
                View all <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th className="text-right">Revenue</th>
                  <th className="text-center">Orders</th>
                  <th className="text-right">Change</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c) => (
                  <tr key={c.name}>
                    <td>
                      <Link
                        href={`/app/sales/customers/${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center gap-2.5 transition-colors hover:text-primary"
                      >
                        <Avatar size="sm">
                          <AvatarFallback name={c.name}>{initials(c.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{c.name}</span>
                      </Link>
                    </td>
                    <td className="text-right font-mono tabular-nums">{formatCurrency(c.revenue)}</td>
                    <td className="text-center text-muted-foreground">{c.orders}</td>
                    <td
                      className={`text-right font-mono text-xs font-medium ${
                        c.change >= 0 ? 'text-success' : 'text-destructive'
                      }`}
                    >
                      <span className="inline-flex items-center gap-0.5">
                        {c.change >= 0 ? (
                          <ArrowUp className="size-3" />
                        ) : (
                          <ArrowDown className="size-3" />
                        )}
                        {Math.abs(c.change)}%
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={c.status} size="sm" />
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
              <CardTitle>AR Aging</CardTitle>
              <CardDescription>Outstanding receivables</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/sales/invoices">
                Details <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ArAging />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Across all reps and channels</CardDescription>
            </div>
            <Button variant="ghost" size="icon-sm">
              <MessageSquare className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {activities.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/40"
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted ${a.tone}`}
                >
                  <a.icon className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">
                    <span className="font-medium">{a.user}</span>{' '}
                    <span className="text-muted-foreground">{a.action}</span>{' '}
                    <span className="font-medium">{a.target}</span>
                    {a.amount && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {' · '}
                        {formatCurrency(a.amount)}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sales Leaderboard</CardTitle>
              <CardDescription>Top reps this quarter · ranked by closed revenue</CardDescription>
            </div>
            <Badge variant="soft">Q2 2026</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {reps.map((r, i) => {
              const pct = (r.closed / r.target) * 100;
              return (
                <div key={r.name} className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {i + 1}
                  </div>
                  <Avatar size="md">
                    <AvatarFallback name={r.name}>{initials(r.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">{r.name}</p>
                        {r.badge && (
                          <span
                            className={`rounded-md border px-1.5 py-0.5 text-2xs font-medium capitalize ${badgeColors[r.badge]}`}
                          >
                            <Trophy className="mr-0.5 inline size-2.5" />
                            {r.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-muted-foreground">{r.deals} deals</span>
                        <span
                          className={`flex items-center gap-0.5 font-medium ${
                            r.change >= 0 ? 'text-success' : 'text-destructive'
                          }`}
                        >
                          {r.change >= 0 ? (
                            <ArrowUp className="size-3" />
                          ) : (
                            <ArrowDown className="size-3" />
                          )}
                          {Math.abs(r.change)}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-1.5 flex items-center gap-3">
                      <Progress value={Math.min(100, pct)} className="h-1.5 flex-1" />
                      <div className="shrink-0 text-xs">
                        <span className="font-mono font-medium">{formatCurrency(r.closed)}</span>
                        <span className="text-muted-foreground">
                          {' / '}
                          {formatCurrency(r.target)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              AI Sales Insights
            </CardTitle>
            <CardDescription>Generated 12 minutes ago · refreshed hourly</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-success/30 bg-success/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-success" />
              <span className="text-xs font-semibold uppercase tracking-wide text-success">
                Opportunity
              </span>
            </div>
            <p className="text-sm">
              <span className="font-medium">Acme Industries</span> shows 24% YoY growth — consider
              upselling the new analytics module.
            </p>
          </div>
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="size-4 text-warning" />
              <span className="text-xs font-semibold uppercase tracking-wide text-warning">
                At risk
              </span>
            </div>
            <p className="text-sm">
              <span className="font-medium">3 quotes</span> over $50K haven&apos;t been viewed in 7+
              days. Recommended follow-up today.
            </p>
          </div>
          <div className="rounded-lg border border-info/30 bg-info/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="size-4 text-info" />
              <span className="text-xs font-semibold uppercase tracking-wide text-info">
                Forecast
              </span>
            </div>
            <p className="text-sm">
              Projected to close <span className="font-medium">{formatCurrency(682000)}</span> by
              quarter end — 94% to target.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
