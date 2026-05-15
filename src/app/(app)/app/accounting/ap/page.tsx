'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CalendarDays,
  CheckSquare,
  Download,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Upload,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate, initials } from '@/lib/utils';

const buckets = [
  { label: 'Current', value: 184320, count: 24, tone: 'bg-success', text: 'text-success', pct: 0 },
  { label: '1–30 days', value: 84200, count: 18, tone: 'bg-info', text: 'text-info', pct: 0 },
  { label: '31–60 days', value: 32400, count: 8, tone: 'bg-warning', text: 'text-warning', pct: 0 },
  { label: '61–90 days', value: 14200, count: 3, tone: 'bg-warning/80', text: 'text-warning', pct: 0 },
  { label: '90+ days', value: 3330, count: 1, tone: 'bg-destructive', text: 'text-destructive', pct: 0 },
];

const totalAP = buckets.reduce((s, b) => s + b.value, 0);
buckets.forEach((b) => { b.pct = (b.value / totalAP) * 100; });

const upcomingPayments = [
  { day: 'Mon', date: 'May 18', items: [
    { vendor: 'Global Steel Supply', amount: 24800, method: 'ACH' },
    { vendor: 'Pacific Logistics', amount: 4200, method: 'Check' },
  ]},
  { day: 'Tue', date: 'May 19', items: [
    { vendor: 'Office Supply Co', amount: 1240, method: 'Card' },
  ]},
  { day: 'Wed', date: 'May 20', items: [
    { vendor: 'Acme Components', amount: 18420, method: 'ACH' },
    { vendor: 'Pacific Power & Gas', amount: 3680, method: 'ACH' },
    { vendor: 'TechRent Inc', amount: 8200, method: 'ACH' },
  ]},
  { day: 'Thu', date: 'May 21', items: [
    { vendor: 'Cleaning Services LLC', amount: 1800, method: 'ACH' },
  ]},
  { day: 'Fri', date: 'May 22', items: [
    { vendor: 'BlueChip Insurance', amount: 12400, method: 'ACH' },
    { vendor: 'Metro Property Mgmt', amount: 28000, method: 'Wire' },
  ]},
];

const topCreditors = [
  { name: 'Global Steel Supply', balance: 84200, bills: 6, terms: 'Net 30', avgDays: 28 },
  { name: 'Pacific Power & Gas', balance: 38600, bills: 12, terms: 'Net 15', avgDays: 13 },
  { name: 'Metro Property Mgmt', balance: 32400, bills: 1, terms: 'Net 5', avgDays: 5 },
  { name: 'Acme Components', balance: 28420, bills: 4, terms: 'Net 30', avgDays: 32 },
  { name: 'BlueChip Insurance', balance: 24800, bills: 2, terms: 'Net 30', avgDays: 25 },
  { name: 'TechRent Inc', balance: 18420, bills: 3, terms: 'Net 30', avgDays: 24 },
];

const paymentBatch = [
  { id: 'BILL-4521', vendor: 'Global Steel Supply', invoice: 'INV-8842', dueDate: '2026-05-18', amount: 24800, status: 'approved' as const, method: 'ACH' },
  { id: 'BILL-4520', vendor: 'Acme Components', invoice: 'INV-2418', dueDate: '2026-05-20', amount: 18420, status: 'approved' as const, method: 'ACH' },
  { id: 'BILL-4519', vendor: 'Pacific Logistics', invoice: 'INV-9821', dueDate: '2026-05-18', amount: 4200, status: 'pending' as const, method: 'Check' },
  { id: 'BILL-4518', vendor: 'TechRent Inc', invoice: 'INV-5512', dueDate: '2026-05-20', amount: 8200, status: 'approved' as const, method: 'ACH' },
  { id: 'BILL-4517', vendor: 'Metro Property Mgmt', invoice: 'INV-2105', dueDate: '2026-05-22', amount: 28000, status: 'approved' as const, method: 'Wire' },
  { id: 'BILL-4516', vendor: 'BlueChip Insurance', invoice: 'INV-7721', dueDate: '2026-05-22', amount: 12400, status: 'pending' as const, method: 'ACH' },
];

export default function AccountsPayablePage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Accounts Payable"
        description="Aging, upcoming payments, and payment batch processing."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Accounting', href: '/app/accounting' },
          { label: 'Accounts Payable' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Upload className="size-4" /> Upload bills
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Aging report
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New bill
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total payable</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(totalAP)}</p>
          <p className="mt-1 text-xs text-muted-foreground">54 open bills</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Due this week</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-warning">{formatCurrency(102740)}</p>
          <p className="mt-1 text-xs text-muted-foreground">9 bills · 5 vendors</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">DPO</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">28 <span className="text-sm text-muted-foreground">days</span></p>
          <p className="mt-1 text-xs text-success">-2 days vs last month</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Paid MTD</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(624830)}</p>
          <p className="mt-1 text-xs text-muted-foreground">42 bills paid</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AP Aging</CardTitle>
          <CardDescription>Distribution of vendor payables by age bucket</CardDescription>
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
                  <span>{b.count} bills</span>
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
              <CardTitle>Upcoming Payments Calendar</CardTitle>
              <CardDescription>Next 5 business days</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <CalendarDays className="size-4" /> Full calendar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {upcomingPayments.map((day) => {
                const dayTotal = day.items.reduce((s, i) => s + i.amount, 0);
                return (
                  <div key={day.date} className="rounded-lg border border-border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground">{day.day}</p>
                        <p className="text-sm font-medium">{day.date}</p>
                      </div>
                      <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-2xs font-medium text-primary">
                        {day.items.length}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {day.items.map((item, i) => (
                        <div key={i} className="rounded-md bg-muted/40 p-2 text-xs">
                          <p className="truncate font-medium">{item.vendor}</p>
                          <div className="mt-0.5 flex items-center justify-between">
                            <span className="font-mono text-muted-foreground">{formatCurrency(item.amount)}</span>
                            <span className="rounded bg-background px-1 text-2xs">{item.method}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 border-t border-border pt-2 text-right text-xs font-mono font-medium">
                      {formatCurrency(dayTotal)}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Creditors</CardTitle>
            <CardDescription>By balance owed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCreditors.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar size="sm">
                    <AvatarFallback name={c.name}>{initials(c.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.bills} bills · {c.terms}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-medium tabular-nums">{formatCurrency(c.balance)}</p>
                  <p className="text-xs text-muted-foreground">{c.avgDays}d avg</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payment Batch</CardTitle>
            <CardDescription>Select bills to include in the next payment run</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="size-4" /> Schedule
            </Button>
            <Button size="sm">
              <Send className="size-4" /> Approve & pay batch
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th className="w-10"><Checkbox /></th>
                <th>Bill</th>
                <th>Vendor</th>
                <th>Invoice</th>
                <th>Due date</th>
                <th>Method</th>
                <th>Status</th>
                <th className="text-right">Amount</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {paymentBatch.map((b) => (
                <tr key={b.id}>
                  <td><Checkbox defaultChecked={b.status === 'approved'} /></td>
                  <td className="font-mono text-xs font-medium text-primary">{b.id}</td>
                  <td className="font-medium">{b.vendor}</td>
                  <td className="font-mono text-xs">{b.invoice}</td>
                  <td className="text-xs text-muted-foreground">{formatDate(b.dueDate)}</td>
                  <td><span className="rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-2xs font-medium">{b.method}</span></td>
                  <td><StatusBadge status={b.status} /></td>
                  <td className="text-right font-mono tabular-nums">{formatCurrency(b.amount)}</td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View bill</DropdownMenuItem>
                        <DropdownMenuItem><CheckSquare className="size-4" /> Approve</DropdownMenuItem>
                        <DropdownMenuItem>Schedule payment</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Hold</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
          <span className="text-muted-foreground">6 bills selected · 4 approved · 2 pending</span>
          <span className="font-mono font-semibold tabular-nums">Total: {formatCurrency(paymentBatch.reduce((s, b) => s + b.amount, 0))}</span>
        </div>
      </Card>
    </div>
  );
}
