'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileBarChart,
  FileText,
  Filter,
  Globe,
  MoreHorizontal,
  Plus,
  Receipt,
  Scale,
  Sparkles,
  Upload,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

const taxCodes = [
  { code: 'SLS-CA-7.25', name: 'CA Sales Tax 7.25%', type: 'Sales Tax', rate: 7.25, jurisdiction: 'California', glAccount: '2041', active: true },
  { code: 'SLS-NY-8.875', name: 'NY Sales Tax 8.875%', type: 'Sales Tax', rate: 8.875, jurisdiction: 'New York', glAccount: '2041', active: true },
  { code: 'SLS-IL-6.25', name: 'IL Sales Tax 6.25%', type: 'Sales Tax', rate: 6.25, jurisdiction: 'Illinois', glAccount: '2041', active: true },
  { code: 'VAT-UK-20', name: 'UK VAT 20%', type: 'VAT', rate: 20.0, jurisdiction: 'United Kingdom', glAccount: '2042', active: true },
  { code: 'VAT-EU-21', name: 'EU VAT 21%', type: 'VAT', rate: 21.0, jurisdiction: 'Netherlands', glAccount: '2042', active: true },
  { code: 'GST-CA-5', name: 'CA GST 5%', type: 'GST', rate: 5.0, jurisdiction: 'Canada', glAccount: '2043', active: true },
  { code: 'PAY-FED-FICA', name: 'Federal FICA', type: 'Payroll Tax', rate: 7.65, jurisdiction: 'Federal', glAccount: '2044', active: true },
  { code: 'PAY-FED-FUTA', name: 'Federal FUTA', type: 'Payroll Tax', rate: 6.0, jurisdiction: 'Federal', glAccount: '2044', active: true },
  { code: 'INC-FED-21', name: 'Federal Corporate Income', type: 'Income Tax', rate: 21.0, jurisdiction: 'Federal', glAccount: '2050', active: true },
  { code: 'EXM-RESALE', name: 'Resale Exemption', type: 'Exemption', rate: 0, jurisdiction: 'Multi-state', glAccount: '—', active: true },
];

const filings = [
  { period: 'May 2026', type: 'Sales Tax', jurisdiction: 'California', amount: 18420, dueDate: '2026-06-15', status: 'draft' as const },
  { period: 'May 2026', type: 'Sales Tax', jurisdiction: 'New York', amount: 12180, dueDate: '2026-06-20', status: 'draft' as const },
  { period: 'Q1 2026', type: 'Payroll Tax', jurisdiction: 'Federal', amount: 84320, dueDate: '2026-04-30', status: 'paid' as const },
  { period: 'Q1 2026', type: 'Income Tax', jurisdiction: 'Federal Q1', amount: 124200, dueDate: '2026-04-15', status: 'paid' as const },
  { period: 'Apr 2026', type: 'VAT', jurisdiction: 'United Kingdom', amount: 28400, dueDate: '2026-06-07', status: 'pending' as const },
  { period: 'Apr 2026', type: 'Sales Tax', jurisdiction: 'California', amount: 16800, dueDate: '2026-05-15', status: 'paid' as const },
  { period: 'Q2 2026', type: 'Payroll Tax', jurisdiction: 'Federal', amount: 92400, dueDate: '2026-07-31', status: 'draft' as const },
  { period: 'Q2 2026', type: 'Income Tax', jurisdiction: 'Federal Q2', amount: 128500, dueDate: '2026-07-15', status: 'draft' as const },
];

const taxByJurisdiction = [
  { name: 'California', value: 184200, color: 'hsl(var(--chart-1))' },
  { name: 'New York', value: 128400, color: 'hsl(var(--chart-2))' },
  { name: 'Illinois', value: 68400, color: 'hsl(var(--chart-3))' },
  { name: 'Federal', value: 248000, color: 'hsl(var(--chart-4))' },
  { name: 'UK', value: 84200, color: 'hsl(var(--chart-5))' },
  { name: 'Other', value: 42000, color: 'hsl(var(--chart-6))' },
];

const monthlyTax = [
  { month: 'Jan', sales: 32000, payroll: 28000, income: 0 },
  { month: 'Feb', sales: 34000, payroll: 29400, income: 0 },
  { month: 'Mar', sales: 36800, payroll: 30800, income: 124200 },
  { month: 'Apr', sales: 38400, payroll: 28400, income: 0 },
  { month: 'May', sales: 42600, payroll: 31200, income: 0 },
];

export default function TaxPage() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Tax Center"
        description="Tax codes, jurisdiction filings, and compliance tracking."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Accounting', href: '/app/accounting' },
          { label: 'Tax' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Upload className="size-4" /> Upload return
            </Button>
            <Button variant="outline" size="sm">
              <FileBarChart className="size-4" /> Tax report
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New tax code
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total tax liability</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(755200)}</p>
          <p className="mt-1 text-xs text-muted-foreground">YTD across all jurisdictions</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Due this month</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-warning">{formatCurrency(58020)}</p>
          <p className="mt-1 text-xs text-muted-foreground">3 filings · 2 jurisdictions</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Past due</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(0)}</p>
          <p className="mt-1 text-xs text-success">All filings on schedule</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Compliance rate</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-success">98.4%</p>
          <p className="mt-1 text-xs text-muted-foreground">Trailing 12 months</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tax Liability by Month</CardTitle>
            <CardDescription>YTD 2026 · stacked by tax type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyTax} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
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
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Bar dataKey="sales" name="Sales Tax" stackId="a" fill="hsl(var(--chart-1))" />
                <Bar dataKey="payroll" name="Payroll Tax" stackId="a" fill="hsl(var(--chart-2))" />
                <Bar dataKey="income" name="Income Tax" stackId="a" fill="hsl(var(--chart-4))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By Jurisdiction</CardTitle>
            <CardDescription>YTD 2026 distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={taxByJurisdiction}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={84}
                  paddingAngle={2}
                >
                  {taxByJurisdiction.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5">
              {taxByJurisdiction.map((j) => (
                <div key={j.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: j.color }} />
                    <span className="font-medium">{j.name}</span>
                  </div>
                  <span className="font-mono tabular-nums">{formatCurrency(j.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="filings">
        <TabsList variant="pills">
          <TabsTrigger variant="pills" value="filings">Period Filings</TabsTrigger>
          <TabsTrigger variant="pills" value="codes">Tax Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="filings">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Filings</CardTitle>
                <CardDescription>Upcoming, pending, and completed tax filings</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="size-4" /> Filter
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Type</th>
                    <th>Jurisdiction</th>
                    <th>Due date</th>
                    <th className="text-right">Amount</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filings.map((f) => {
                    const due = new Date(f.dueDate);
                    const today = new Date('2026-05-15');
                    const daysUntil = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <tr key={`${f.period}-${f.type}-${f.jurisdiction}`}>
                        <td className="font-medium">{f.period}</td>
                        <td><Badge variant="outline" size="sm">{f.type}</Badge></td>
                        <td className="text-sm">
                          <span className="inline-flex items-center gap-1.5">
                            <Globe className="size-3.5 text-muted-foreground" />
                            {f.jurisdiction}
                          </span>
                        </td>
                        <td>
                          <p className="text-xs text-muted-foreground">{formatDate(f.dueDate)}</p>
                          {f.status !== 'paid' && (
                            <p className={cn('mt-0.5 text-xs font-medium', daysUntil < 7 ? 'text-destructive' : daysUntil < 14 ? 'text-warning' : 'text-muted-foreground')}>
                              {daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : `${daysUntil}d remaining`}
                            </p>
                          )}
                        </td>
                        <td className="text-right font-mono tabular-nums">{formatCurrency(f.amount)}</td>
                        <td><StatusBadge status={f.status} /></td>
                        <td>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-sm">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><FileText className="size-4" /> View return</DropdownMenuItem>
                              <DropdownMenuItem>Mark as filed</DropdownMenuItem>
                              <DropdownMenuItem>Record payment</DropdownMenuItem>
                              <DropdownMenuItem><Download className="size-4" /> Download</DropdownMenuItem>
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
        </TabsContent>

        <TabsContent value="codes">
          <Card>
            <CardHeader>
              <CardTitle>Tax Codes</CardTitle>
              <CardDescription>{taxCodes.length} tax codes configured across jurisdictions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th className="text-right">Rate</th>
                    <th>Jurisdiction</th>
                    <th>GL Account</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {taxCodes.map((c) => (
                    <tr key={c.code}>
                      <td className="font-mono text-xs font-medium text-primary">{c.code}</td>
                      <td className="font-medium">{c.name}</td>
                      <td><Badge variant="outline" size="sm">{c.type}</Badge></td>
                      <td className="text-right font-mono tabular-nums">{c.rate.toFixed(3)}%</td>
                      <td className="text-sm">{c.jurisdiction}</td>
                      <td className="font-mono text-xs text-muted-foreground">{c.glAccount}</td>
                      <td><StatusBadge status={c.active ? 'active' : 'inactive'} /></td>
                      <td>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            Compliance Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-success/30 bg-success/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-success" />
              <span className="text-xs font-semibold uppercase text-success">On track</span>
            </div>
            <p className="text-sm">
              All Q1 returns filed and paid. <span className="font-medium">98.4%</span> on-time compliance over trailing 12 months.
            </p>
          </div>
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="size-4 text-warning" />
              <span className="text-xs font-semibold uppercase text-warning">Upcoming</span>
            </div>
            <p className="text-sm">
              UK VAT return due in <span className="font-medium">22 days</span>. Estimated liability {formatCurrency(28400)}.
            </p>
          </div>
          <div className="rounded-lg border border-info/30 bg-info/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Scale className="size-4 text-info" />
              <span className="text-xs font-semibold uppercase text-info">Strategy</span>
            </div>
            <p className="text-sm">
              R&D tax credit eligibility detected — estimated savings of <span className="font-medium">{formatCurrency(48200)}</span>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
