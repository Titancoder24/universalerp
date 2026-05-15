'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Briefcase,
  Building2,
  Calendar,
  ClipboardList,
  Clock,
  Database,
  Download,
  FileBarChart,
  FileSpreadsheet,
  FileText,
  Filter,
  LayoutDashboard,
  LineChart,
  PackageOpen,
  PieChart,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categories = [
  {
    name: 'Sales',
    icon: TrendingUp,
    color: 'hsl(var(--chart-1))',
    reports: [
      { title: 'Sales Performance', description: 'Revenue, pipeline, and win-rate across reps', icon: BarChart3 },
      { title: 'Customer Lifetime Value', description: 'CLV by segment, geography, and tier', icon: Users },
      { title: 'Pipeline Funnel', description: 'Conversion rates at each opportunity stage', icon: LineChart },
      { title: 'Quote-to-Cash', description: 'Time and conversion from quote to invoice', icon: Receipt },
      { title: 'Product Mix Analysis', description: 'Revenue contribution by product line', icon: PieChart },
    ],
  },
  {
    name: 'Finance',
    icon: Wallet,
    color: 'hsl(var(--chart-2))',
    reports: [
      { title: 'P&L Statement', description: 'Income and expense by period and entity', icon: TrendingUp, href: '/app/accounting/reports/pnl' },
      { title: 'Balance Sheet', description: 'Assets, liabilities, and equity snapshot', icon: ClipboardList, href: '/app/accounting/reports/balance-sheet' },
      { title: 'Cash Flow Forecast', description: '13-week rolling forecast with scenarios', icon: LineChart, href: '/app/accounting/cashflow' },
      { title: 'AR/AP Aging', description: 'Aging buckets for receivables and payables', icon: Receipt, href: '/app/accounting/ar' },
      { title: 'Budget vs Actual', description: 'Variance analysis by department', icon: BarChart3, href: '/app/accounting/budgets' },
    ],
  },
  {
    name: 'HR',
    icon: Users,
    color: 'hsl(var(--chart-3))',
    reports: [
      { title: 'Headcount Analytics', description: 'Workforce by department, location, role', icon: Users },
      { title: 'Payroll Summary', description: 'Total comp, benefits, and tax burden', icon: Receipt },
      { title: 'Attendance & PTO', description: 'Time-off usage and patterns', icon: Calendar },
      { title: 'Performance Reviews', description: 'Cycle completion and rating distribution', icon: ShieldCheck },
      { title: 'Recruitment Funnel', description: 'Source-to-hire conversion metrics', icon: BarChart3 },
    ],
  },
  {
    name: 'Inventory',
    icon: PackageOpen,
    color: 'hsl(var(--chart-4))',
    reports: [
      { title: 'Stock Valuation', description: 'Inventory value across warehouses', icon: Boxes },
      { title: 'Stock Movement', description: 'Receipts, issues, and adjustments', icon: Truck },
      { title: 'Slow-Moving Items', description: 'Aged inventory needing attention', icon: Clock },
      { title: 'ABC Analysis', description: 'Pareto classification of SKUs', icon: PieChart },
      { title: 'Reorder Suggestions', description: 'Items below safety stock', icon: ClipboardList },
    ],
  },
  {
    name: 'Operations',
    icon: Briefcase,
    color: 'hsl(var(--chart-5))',
    reports: [
      { title: 'Production Output', description: 'Daily/weekly production by line', icon: Wrench },
      { title: 'OEE Dashboard', description: 'Overall equipment effectiveness', icon: BarChart3 },
      { title: 'Quality Metrics', description: 'Defect rates and rework costs', icon: ShieldCheck },
      { title: 'Project Health', description: 'On-time, on-budget across projects', icon: ClipboardList },
      { title: 'Vendor Performance', description: 'Lead times, quality, and OTD', icon: Truck },
    ],
  },
];

const starredReports = [
  { title: 'CEO Daily Dashboard', category: 'Cross-functional', icon: LayoutDashboard, href: '/app/reports/dashboards/ceo' },
  { title: 'P&L Statement', category: 'Finance', icon: TrendingUp, href: '/app/accounting/reports/pnl' },
  { title: 'Sales Performance', category: 'Sales', icon: BarChart3 },
  { title: 'Cash Flow Forecast', category: 'Finance', icon: LineChart, href: '/app/accounting/cashflow' },
];

export default function ReportsHubPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | string>('All');

  const filteredCategories = categories.filter((c) => category === 'All' || c.name === category);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Reports"
        description="Every report across every module — search, run, schedule, or export."
        breadcrumbs={[{ label: 'Home', href: '/app' }, { label: 'Reports' }]}
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href="/app/reports/builder">
                <Sparkles className="size-4" /> Report builder
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/app/reports/dashboards">
                <LayoutDashboard className="size-4" /> Dashboards
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/app/reports/ai">
                <Sparkles className="size-4" /> Ask AI
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileBarChart className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Reports</p>
              <p className="text-xl font-semibold">{categories.reduce((s, c) => s + c.reports.length, 0)}+</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/15 text-chart-2">
              <LayoutDashboard className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Saved dashboards</p>
              <p className="text-xl font-semibold">14</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/15 text-chart-3">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Scheduled reports</p>
              <p className="text-xl font-semibold">28</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15 text-success">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">AI queries this month</p>
              <p className="text-xl font-semibold">142</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports across every module…"
            className="pl-8"
          />
        </div>
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList variant="pills">
            <TabsTrigger variant="pills" value="All">All</TabsTrigger>
            {categories.map((c) => (
              <TabsTrigger key={c.name} variant="pills" value={c.name}>{c.name}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {category === 'All' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="size-4 fill-warning text-warning" /> Starred
              </CardTitle>
              <CardDescription>Your most-used reports</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {starredReports.map((r) => (
              <Link
                key={r.title}
                href={r.href ?? '#'}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-warning/10 text-warning">
                  <r.icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.category}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {filteredCategories.map((c) => {
        const filtered = c.reports.filter((r) => !search || r.title.toLowerCase().includes(search.toLowerCase()));
        if (filtered.length === 0) return null;
        return (
          <Card key={c.name}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `${c.color}15`, color: c.color }}>
                  <c.icon className="size-5" />
                </div>
                <div>
                  <CardTitle>{c.name}</CardTitle>
                  <CardDescription>{filtered.length} reports available</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r) => {
                const inner = (
                  <div className="flex h-full flex-col gap-2 rounded-lg border border-border p-4 transition-colors hover:bg-muted/40">
                    <div className="flex items-start justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <r.icon className="size-4" />
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-2 font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.description}</p>
                  </div>
                );
                const href = (r as any).href ?? '#';
                return (
                  <Link key={r.title} href={href} className="group block">
                    {inner}
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
