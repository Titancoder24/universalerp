'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Download,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Receipt,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate, initials } from '@/lib/utils';

const buckets = [
  { label: 'Current', value: 184250, count: 47, tone: 'bg-success', text: 'text-success', pct: 0 },
  { label: '1–30 days', value: 92480, count: 28, tone: 'bg-info', text: 'text-info', pct: 0 },
  { label: '31–60 days', value: 41320, count: 14, tone: 'bg-warning', text: 'text-warning', pct: 0 },
  { label: '61–90 days', value: 18950, count: 6, tone: 'bg-warning/80', text: 'text-warning', pct: 0 },
  { label: '90+ days', value: 12440, count: 4, tone: 'bg-destructive', text: 'text-destructive', pct: 0 },
];

const topDebtors = [
  { name: 'Acme Industries', balance: 86200, invoices: 5, oldest: 32, contact: 'David Lin', email: 'ap@acme.com' },
  { name: 'Global Manufacturing', balance: 68420, invoices: 7, oldest: 18, contact: 'Maria Sanchez', email: 'finance@globalmfg.com' },
  { name: 'Hospital Network LLC', balance: 54800, invoices: 3, oldest: 67, contact: 'Robert Tan', email: 'billing@hnl.com' },
  { name: 'TechCorp Solutions', balance: 42180, invoices: 6, oldest: 14, contact: 'Anna Park', email: 'ap@techcorp.com' },
  { name: 'Apex Retail Group', balance: 38420, invoices: 4, oldest: 41, contact: 'Diego Costa', email: 'finance@apexretail.com' },
  { name: 'Northwest Logistics', balance: 32800, invoices: 3, oldest: 23, contact: 'Yuki Tanaka', email: 'ap@nwlogistics.com' },
  { name: 'Enterprise Ltd', balance: 28400, invoices: 2, oldest: 8, contact: 'Sam Patel', email: 'invoices@enterprise.ltd' },
];

const collectionsWorklist = [
  { invoice: 'INV-2089', customer: 'Acme Industries', amount: 24500, daysOverdue: 32, action: 'Send 2nd reminder', priority: 'high' as const, assigned: 'Sarah Chen' },
  { invoice: 'INV-2068', customer: 'Hospital Network LLC', amount: 18420, daysOverdue: 67, action: 'Escalate to legal', priority: 'high' as const, assigned: 'Marcus Reid' },
  { invoice: 'INV-2079', customer: 'Apex Retail Group', amount: 12800, daysOverdue: 41, action: 'Call AP contact', priority: 'medium' as const, assigned: 'Jenna Park' },
  { invoice: 'INV-2091', customer: 'Global Manufacturing', amount: 8420, daysOverdue: 18, action: 'Send 1st reminder', priority: 'medium' as const, assigned: 'Sarah Chen' },
  { invoice: 'INV-2098', customer: 'Northwest Logistics', amount: 6200, daysOverdue: 8, action: 'Friendly reminder', priority: 'low' as const, assigned: 'Sarah Chen' },
  { invoice: 'INV-2102', customer: 'TechCorp Solutions', amount: 4280, daysOverdue: 4, action: 'Auto-reminder sent', priority: 'low' as const, assigned: 'System' },
];

const totalAR = buckets.reduce((s, b) => s + b.value, 0);
buckets.forEach((b) => { b.pct = (b.value / totalAR) * 100; });

const priorityClass = {
  high: 'text-destructive bg-destructive/10',
  medium: 'text-warning bg-warning/10',
  low: 'text-muted-foreground bg-muted',
};

export default function AccountsReceivablePage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Accounts Receivable"
        description="Aging buckets, top debtors, and prioritized collections worklist."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Accounting', href: '/app/accounting' },
          { label: 'Accounts Receivable' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <RefreshCw className="size-4" /> Sync
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Aging report
            </Button>
            <Button size="sm" asChild>
              <Link href="/app/sales/invoices">
                <Plus className="size-4" /> New invoice
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total outstanding</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(totalAR)}</p>
          <p className="mt-1 text-xs text-muted-foreground">99 open invoices</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Past due</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-warning">{formatCurrency(165190)}</p>
          <p className="mt-1 text-xs text-muted-foreground">52 invoices · 52.5% of AR</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">DSO</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">52 <span className="text-sm text-muted-foreground">days</span></p>
          <p className="mt-1 text-xs text-warning">+4 days vs last month</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Collected MTD</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-success">{formatCurrency(842300)}</p>
          <p className="mt-1 text-xs text-success">+12% vs target</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AR Aging</CardTitle>
          <CardDescription>Distribution of outstanding receivables by age bucket</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
            {buckets.map((b) => (
              <div key={b.label} className={b.tone} style={{ width: `${b.pct}%` }} />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-5">
            {buckets.map((b) => (
              <div key={b.label} className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${b.tone}`} />
                  <span className="text-xs font-medium">{b.label}</span>
                </div>
                <p className="mt-2 text-xl font-semibold tabular-nums">{formatCurrency(b.value)}</p>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{b.count} invoices</span>
                  <span className={b.text}>{b.pct.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Debtors</CardTitle>
              <CardDescription>By outstanding balance</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View all <ArrowRight className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th className="text-center">Invoices</th>
                  <th className="text-center">Oldest</th>
                  <th>Contact</th>
                  <th className="text-right">Balance</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {topDebtors.map((d) => (
                  <tr key={d.name}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar size="sm">
                          <AvatarFallback name={d.name}>{initials(d.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{d.name}</span>
                      </div>
                    </td>
                    <td className="text-center">{d.invoices}</td>
                    <td className="text-center">
                      <span className={d.oldest > 60 ? 'text-destructive' : d.oldest > 30 ? 'text-warning' : 'text-muted-foreground'}>
                        {d.oldest}d
                      </span>
                    </td>
                    <td className="text-xs text-muted-foreground">
                      <p className="text-foreground">{d.contact}</p>
                      <p>{d.email}</p>
                    </td>
                    <td className="text-right font-mono tabular-nums">{formatCurrency(d.balance)}</td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" title="Send email">
                          <Mail className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" title="Log call">
                          <Phone className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              AI Insights
            </CardTitle>
            <CardDescription>Predictions on collection probability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <div className="mb-1 flex items-center gap-2">
                <AlertTriangle className="size-4 text-destructive" />
                <span className="text-xs font-semibold uppercase text-destructive">High risk</span>
              </div>
              <p className="text-sm">
                <span className="font-medium">Hospital Network</span> showing payment delay patterns — 67 days outstanding. Recommend escalation.
              </p>
            </div>
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
              <div className="mb-1 flex items-center gap-2">
                <AlertTriangle className="size-4 text-warning" />
                <span className="text-xs font-semibold uppercase text-warning">Watch</span>
              </div>
              <p className="text-sm">
                3 customers slowing payment cycles. Projected DSO increase of 4 days next month.
              </p>
            </div>
            <div className="rounded-lg border border-success/30 bg-success/5 p-3">
              <div className="mb-1 flex items-center gap-2">
                <Receipt className="size-4 text-success" />
                <span className="text-xs font-semibold uppercase text-success">Forecast</span>
              </div>
              <p className="text-sm">
                Projected collections of <span className="font-medium">{formatCurrency(948000)}</span> by month-end at 87% confidence.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Collections Worklist</CardTitle>
            <CardDescription>Prioritized follow-ups for this week</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="size-4" /> This week
            </Button>
            <Button size="sm">
              <Mail className="size-4" /> Batch reminders
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Overdue</th>
                <th>Suggested action</th>
                <th>Priority</th>
                <th>Assigned</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {collectionsWorklist.map((c) => (
                <tr key={c.invoice}>
                  <td className="font-mono text-xs font-medium text-primary">{c.invoice}</td>
                  <td>{c.customer}</td>
                  <td className="text-right font-mono tabular-nums">{formatCurrency(c.amount)}</td>
                  <td className="text-center">
                    <span className={c.daysOverdue > 30 ? 'font-medium text-destructive' : 'text-warning'}>
                      {c.daysOverdue} days
                    </span>
                  </td>
                  <td>{c.action}</td>
                  <td>
                    <span className={`rounded-md px-1.5 py-0.5 text-2xs font-medium capitalize ${priorityClass[c.priority]}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <Avatar size="xs">
                        <AvatarFallback name={c.assigned}>{initials(c.assigned)}</AvatarFallback>
                      </Avatar>
                      <span>{c.assigned}</span>
                    </div>
                  </td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Mail className="size-4" /> Send reminder</DropdownMenuItem>
                        <DropdownMenuItem><Phone className="size-4" /> Log call</DropdownMenuItem>
                        <DropdownMenuItem>Mark as paid</DropdownMenuItem>
                        <DropdownMenuItem>Write off</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
