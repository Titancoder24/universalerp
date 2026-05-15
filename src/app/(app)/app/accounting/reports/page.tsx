'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  Calculator,
  Clock,
  Download,
  FileBarChart,
  FileText,
  Landmark,
  LineChart,
  PieChart,
  Receipt,
  Scale,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const reports = [
  {
    id: 'pnl',
    title: 'Profit & Loss Statement',
    description: 'Revenue, expenses, and net income across reporting periods',
    icon: TrendingUp,
    href: '/app/accounting/reports/pnl',
    category: 'Statements',
    starred: true,
    color: 'hsl(var(--chart-1))',
    lastRun: '4 hours ago',
  },
  {
    id: 'bs',
    title: 'Balance Sheet',
    description: 'Snapshot of assets, liabilities, and equity at period end',
    icon: Scale,
    href: '/app/accounting/reports/balance-sheet',
    category: 'Statements',
    starred: true,
    color: 'hsl(var(--chart-2))',
    lastRun: 'Yesterday',
  },
  {
    id: 'cf',
    title: 'Cash Flow Statement',
    description: 'Operating, investing, and financing activities',
    icon: LineChart,
    href: '/app/accounting/cashflow',
    category: 'Statements',
    starred: false,
    color: 'hsl(var(--chart-3))',
    lastRun: '2 days ago',
  },
  {
    id: 'tb',
    title: 'Trial Balance',
    description: 'All accounts and balances for verification',
    icon: BookOpen,
    href: '/app/accounting/reports/trial-balance',
    category: 'Statements',
    starred: false,
    color: 'hsl(var(--chart-4))',
    lastRun: '1 week ago',
  },
  {
    id: 'gl',
    title: 'General Ledger',
    description: 'Detailed transactions across every GL account',
    icon: FileText,
    href: '/app/accounting/journal',
    category: 'Detail',
    starred: false,
    color: 'hsl(var(--chart-5))',
    lastRun: '3 hours ago',
  },
  {
    id: 'ar-aging',
    title: 'AR Aging',
    description: 'Outstanding receivables by age bucket',
    icon: Receipt,
    href: '/app/accounting/ar',
    category: 'AR/AP',
    starred: false,
    color: 'hsl(var(--chart-6))',
    lastRun: '12 hours ago',
  },
  {
    id: 'ap-aging',
    title: 'AP Aging',
    description: 'Outstanding payables by age bucket',
    icon: Receipt,
    href: '/app/accounting/ap',
    category: 'AR/AP',
    starred: false,
    color: 'hsl(var(--chart-7))',
    lastRun: '8 hours ago',
  },
  {
    id: 'tax',
    title: 'Tax Summary',
    description: 'Tax liability by jurisdiction and period',
    icon: Calculator,
    href: '/app/accounting/tax',
    category: 'Tax',
    starred: false,
    color: 'hsl(var(--chart-8))',
    lastRun: '1 day ago',
  },
  {
    id: 'budget-actual',
    title: 'Budget vs Actual',
    description: 'Variance analysis by department and account',
    icon: BarChart3,
    href: '/app/accounting/budgets',
    category: 'Analysis',
    starred: false,
    color: 'hsl(var(--chart-1))',
    lastRun: '6 hours ago',
  },
  {
    id: 'fixed-assets',
    title: 'Fixed Assets Register',
    description: 'Asset listing with depreciation schedules',
    icon: Landmark,
    href: '/app/accounting/fixed-assets',
    category: 'Analysis',
    starred: false,
    color: 'hsl(var(--chart-2))',
    lastRun: '3 days ago',
  },
  {
    id: 'bank-recon',
    title: 'Bank Reconciliation',
    description: 'Bank statement matching status by account',
    icon: Landmark,
    href: '/app/accounting/bank',
    category: 'Detail',
    starred: false,
    color: 'hsl(var(--chart-3))',
    lastRun: '5 hours ago',
  },
  {
    id: 'consolidated',
    title: 'Consolidated Statements',
    description: 'Multi-entity consolidated financial statements',
    icon: PieChart,
    href: '#',
    category: 'Statements',
    starred: false,
    color: 'hsl(var(--chart-4))',
    lastRun: 'Monthly',
  },
];

const recentRuns = [
  { name: 'P&L Statement', period: 'May 2026', runBy: 'Sarah Chen', time: '4 hours ago' },
  { name: 'Trial Balance', period: 'May 2026', runBy: 'Marcus Reid', time: '6 hours ago' },
  { name: 'AR Aging', period: 'May 15, 2026', runBy: 'System', time: '12 hours ago' },
  { name: 'Budget vs Actual', period: 'YTD 2026', runBy: 'Sarah Chen', time: '1 day ago' },
];

export default function FinancialReportsPage() {
  const [category, setCategory] = useState<'All' | 'Statements' | 'AR/AP' | 'Tax' | 'Detail' | 'Analysis'>('All');
  const [period, setPeriod] = useState('may-2026');

  const filtered = reports.filter((r) => category === 'All' || r.category === category);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Financial Reports"
        description="Run, schedule, and export every financial report your team needs."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Accounting', href: '/app/accounting' },
          { label: 'Reports' },
        ]}
        actions={
          <>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-44">
                <Calendar className="size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="may-2026">May 2026</SelectItem>
                <SelectItem value="apr-2026">April 2026</SelectItem>
                <SelectItem value="q2-2026">Q2 2026</SelectItem>
                <SelectItem value="q1-2026">Q1 2026</SelectItem>
                <SelectItem value="ytd-2026">YTD 2026</SelectItem>
                <SelectItem value="fy2025">FY 2025</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Bulk export
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Available reports</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{reports.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across 5 categories</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Reports run (today)</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">14</p>
          <p className="mt-1 text-xs text-success">+3 vs yesterday</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Scheduled reports</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">8</p>
          <p className="mt-1 text-xs text-muted-foreground">Auto-emailed monthly</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Saved exports</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">42</p>
          <p className="mt-1 text-xs text-muted-foreground">Last 90 days</p>
        </Card>
      </div>

      <Tabs value={category} onValueChange={(v) => setCategory(v as any)}>
        <TabsList variant="pills">
          <TabsTrigger variant="pills" value="All">All reports</TabsTrigger>
          <TabsTrigger variant="pills" value="Statements">Statements</TabsTrigger>
          <TabsTrigger variant="pills" value="AR/AP">AR/AP</TabsTrigger>
          <TabsTrigger variant="pills" value="Tax">Tax</TabsTrigger>
          <TabsTrigger variant="pills" value="Detail">Detail</TabsTrigger>
          <TabsTrigger variant="pills" value="Analysis">Analysis</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <Card key={r.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-lg"
                  style={{ background: `${r.color}15`, color: r.color }}
                >
                  <r.icon className="size-5" />
                </div>
                {r.starred && <Star className="size-4 fill-warning text-warning" />}
              </div>
              <h3 className="mt-4 font-semibold leading-tight">{r.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  <span>Last run {r.lastRun}</span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={r.href}>
                    Open <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Report Runs</CardTitle>
          <CardDescription>Latest executions across your team</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Period</th>
                <th>Run by</th>
                <th>Time</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {recentRuns.map((r, i) => (
                <tr key={i}>
                  <td className="font-medium">{r.name}</td>
                  <td className="text-xs text-muted-foreground">{r.period}</td>
                  <td className="text-sm">{r.runBy}</td>
                  <td className="text-xs text-muted-foreground">{r.time}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="xs">View</Button>
                      <Button variant="ghost" size="icon-sm" title="Download">
                        <Download className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
