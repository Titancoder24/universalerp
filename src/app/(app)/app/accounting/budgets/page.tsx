'use client';

import { useState } from 'react';
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
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
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, cn } from '@/lib/utils';

const budgets = [
  { id: 'b1', name: 'FY2026 Operating Budget', period: 'Annual 2026', status: 'active', owner: 'Sarah Chen', total: 4842000, actual: 1842000 },
  { id: 'b2', name: 'Q2 Marketing Push', period: 'Q2 2026', status: 'active', owner: 'David Kumar', total: 248000, actual: 184200 },
  { id: 'b3', name: 'R&D Innovation Fund', period: 'FY2026', status: 'active', owner: 'James Liu', total: 480000, actual: 168000 },
  { id: 'b4', name: 'Plant Capacity Upgrade', period: 'Capex 2026', status: 'draft', owner: 'Marcus Reid', total: 1240000, actual: 0 },
  { id: 'b5', name: 'FY2025 Operating Budget', period: 'Annual 2025', status: 'closed', owner: 'Sarah Chen', total: 4200000, actual: 4184000 },
];

const variance = [
  { dept: 'Sales', budget: 480000, actual: 412000, variance: -68000 },
  { dept: 'Marketing', budget: 248000, actual: 284000, variance: 36000 },
  { dept: 'Operations', budget: 842000, actual: 798000, variance: -44000 },
  { dept: 'HR', budget: 184000, actual: 192000, variance: 8000 },
  { dept: 'R&D', budget: 480000, actual: 458000, variance: -22000 },
  { dept: 'IT', budget: 248000, actual: 268000, variance: 20000 },
  { dept: 'Finance', budget: 168000, actual: 162000, variance: -6000 },
];

const monthlyTrend = [
  { month: 'Jan', budget: 240, actual: 218 },
  { month: 'Feb', budget: 240, actual: 232 },
  { month: 'Mar', budget: 240, actual: 248 },
  { month: 'Apr', budget: 240, actual: 256 },
  { month: 'May', budget: 240, actual: 268 },
  { month: 'Jun', budget: 240, actual: null },
  { month: 'Jul', budget: 240, actual: null },
];

const statusMap = {
  active: { class: 'bg-success/10 text-success', label: 'Active' },
  draft: { class: 'bg-muted text-muted-foreground', label: 'Draft' },
  closed: { class: 'bg-info/10 text-info', label: 'Closed' },
};

export default function BudgetsPage() {
  const [selectedBudget, setSelectedBudget] = useState('b1');

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Budgets"
        description="Plan, monitor, and analyze budget vs actual performance by department."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Accounting', href: '/app/accounting' },
          { label: 'Budgets' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Copy className="size-4" /> Clone budget
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New budget
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Active budgets</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{budgets.filter(b => b.status === 'active').length}</p>
          <p className="mt-1 text-xs text-muted-foreground">3 in approval queue</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total budgeted (YTD)</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(2650000)}</p>
          <p className="mt-1 text-xs text-muted-foreground">55% of annual</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Actual spend (YTD)</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(2574000)}</p>
          <p className="mt-1 text-xs text-success">2.9% under budget</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Departments over budget</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-warning">3</p>
          <p className="mt-1 text-xs text-muted-foreground">Mkt, HR, IT trending high</p>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Budgets</CardTitle>
            <CardDescription>All budget plans across the organization</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Period</th>
                <th>Owner</th>
                <th className="text-right">Budget</th>
                <th className="text-right">Actual</th>
                <th>Utilization</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {budgets.map((b) => {
                const utilization = b.total > 0 ? (b.actual / b.total) * 100 : 0;
                const isOver = utilization > 100;
                return (
                  <tr key={b.id} className="cursor-pointer" onClick={() => setSelectedBudget(b.id)}>
                    <td className="font-medium">{b.name}</td>
                    <td className="text-xs text-muted-foreground">{b.period}</td>
                    <td className="text-xs">{b.owner}</td>
                    <td className="text-right font-mono tabular-nums">{formatCurrency(b.total)}</td>
                    <td className="text-right font-mono tabular-nums">{formatCurrency(b.actual)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={Math.min(100, utilization)}
                          className="h-1.5 w-24"
                          indicatorClassName={cn(isOver ? 'bg-destructive' : utilization > 80 ? 'bg-warning' : 'bg-primary')}
                        />
                        <span className={cn('text-xs font-mono w-12 text-right', isOver && 'text-destructive')}>
                          {utilization.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`rounded-md px-1.5 py-0.5 text-2xs font-medium ${statusMap[b.status as keyof typeof statusMap].class}`}>
                        {statusMap[b.status as keyof typeof statusMap].label}
                      </span>
                    </td>
                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><FileText className="size-4" /> Open</DropdownMenuItem>
                          <DropdownMenuItem><Copy className="size-4" /> Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>Export</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Tabs defaultValue="dept">
        <div className="flex items-center justify-between">
          <TabsList variant="pills">
            <TabsTrigger variant="pills" value="dept">By Department</TabsTrigger>
            <TabsTrigger variant="pills" value="trend">Monthly Trend</TabsTrigger>
          </TabsList>
          <Select defaultValue="ytd">
            <SelectTrigger className="w-36">
              <Calendar className="size-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ytd">YTD 2026</SelectItem>
              <SelectItem value="q2">Q2 2026</SelectItem>
              <SelectItem value="month">May 2026</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="dept">
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual by Department</CardTitle>
              <CardDescription>YTD 2026 · variance highlighted</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={variance} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="dept" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
                  <Bar dataKey="budget" name="Budget" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" name="Actual" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 space-y-2">
                {variance.map((v) => {
                  const isOver = v.variance > 0;
                  const pct = ((Math.abs(v.variance) / v.budget) * 100).toFixed(1);
                  return (
                    <div key={v.dept} className="flex items-center justify-between rounded-md border border-border p-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{v.dept}</span>
                        {isOver ? (
                          <Badge variant="destructive" size="sm"><AlertCircle className="size-3" /> Over by {pct}%</Badge>
                        ) : (
                          <Badge variant="success" size="sm"><CheckCircle2 className="size-3" /> Under by {pct}%</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Budget</p>
                          <p className="font-mono tabular-nums">{formatCurrency(v.budget)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Actual</p>
                          <p className="font-mono tabular-nums">{formatCurrency(v.actual)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Variance</p>
                          <p className={cn('font-mono tabular-nums font-semibold inline-flex items-center gap-1', isOver ? 'text-destructive' : 'text-success')}>
                            {isOver ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                            {formatCurrency(Math.abs(v.variance))}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget vs Actual</CardTitle>
              <CardDescription>FY2026 operating budget tracker</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyTrend} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}K`}
                  />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value: number) => [`$${value}K`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
                  <Bar dataKey="budget" name="Budget" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" name="Actual" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            AI Budget Insights
          </CardTitle>
          <CardDescription>Anomaly detection and forecast adjustments</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <AlertCircle className="size-4 text-warning" />
              <span className="text-xs font-semibold uppercase tracking-wide text-warning">Anomaly</span>
            </div>
            <p className="text-sm">
              Marketing trending <span className="font-medium">15% over</span> Q2 budget driven by paid acquisition spike. Recommend reallocation review.
            </p>
          </div>
          <div className="rounded-lg border border-info/30 bg-info/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="size-4 text-info" />
              <span className="text-xs font-semibold uppercase tracking-wide text-info">Forecast</span>
            </div>
            <p className="text-sm">
              Year-end actuals projected at <span className="font-medium">{formatCurrency(4624000)}</span> — 4.5% favorable variance to plan.
            </p>
          </div>
          <div className="rounded-lg border border-success/30 bg-success/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-success" />
              <span className="text-xs font-semibold uppercase tracking-wide text-success">On track</span>
            </div>
            <p className="text-sm">
              Sales and Operations both pacing 8-14% under budget. Consider strategic reinvestment in Q3.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
