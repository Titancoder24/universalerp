'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowDownUp,
  Bell,
  CheckCircle2,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { invoices, type InvoiceStatus } from '../_data';
import { formatCurrency, formatDate, initials } from '@/lib/utils';

type FilterChip = 'all' | 'outstanding' | 'paid' | 'overdue';

const chips: { label: string; value: FilterChip }[] = [
  { label: 'All', value: 'all' },
  { label: 'Outstanding', value: 'outstanding' },
  { label: 'Paid', value: 'paid' },
  { label: 'Overdue', value: 'overdue' },
];

export default function InvoicesPage() {
  const [search, setSearch] = React.useState('');
  const [chip, setChip] = React.useState<FilterChip>('all');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    return invoices.filter((inv) => {
      if (chip === 'outstanding' && inv.paid >= inv.amount) return false;
      if (chip === 'paid' && inv.status !== 'paid') return false;
      if (chip === 'overdue' && inv.status !== 'overdue') return false;
      if (q && !inv.number.toLowerCase().includes(q) && !inv.customer.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [search, chip]);

  // AR aging buckets
  const today = new Date('2026-05-15').getTime();
  const buckets = invoices.reduce(
    (acc, inv) => {
      if (inv.paid >= inv.amount) return acc;
      const due = new Date(inv.dueAt).getTime();
      const daysLate = Math.floor((today - due) / (1000 * 60 * 60 * 24));
      const outstanding = inv.amount - inv.paid;
      if (daysLate <= 0) acc.current += outstanding;
      else if (daysLate <= 30) acc.d30 += outstanding;
      else if (daysLate <= 60) acc.d60 += outstanding;
      else if (daysLate <= 90) acc.d90 += outstanding;
      else acc.d90p += outstanding;
      return acc;
    },
    { current: 0, d30: 0, d60: 0, d90: 0, d90p: 0 },
  );

  const totalOutstanding =
    buckets.current + buckets.d30 + buckets.d60 + buckets.d90 + buckets.d90p;

  const agingCards = [
    { label: 'Current', value: buckets.current, tone: 'success', barClass: 'bg-success' },
    { label: '1-30 days', value: buckets.d30, tone: 'info', barClass: 'bg-info' },
    { label: '31-60 days', value: buckets.d60, tone: 'warning', barClass: 'bg-warning' },
    { label: '61-90 days', value: buckets.d90, tone: 'warning', barClass: 'bg-warning/80' },
    { label: '90+ days', value: buckets.d90p, tone: 'destructive', barClass: 'bg-destructive' },
  ];

  const allSelected = filtered.length > 0 && filtered.every((i) => selected.has(i.id));
  const someSelected = filtered.some((i) => selected.has(i.id));

  const toggleOne = (id: string) => {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    setSelected(n);
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Invoices"
        description={`${invoices.length} invoices · ${formatCurrency(totalOutstanding)} outstanding`}
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Sales', href: '/app/sales' },
          { label: 'Invoices' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="size-4" /> Send reminders
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New invoice
            </Button>
          </>
        }
      />

      <div className="space-y-4 p-6">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">AR Aging Summary</h2>
              <p className="text-xs text-muted-foreground">As of {formatDate('2026-05-15')}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold tabular-nums">
                {formatCurrency(totalOutstanding)}
              </p>
              <p className="text-xs text-muted-foreground">Total outstanding</p>
            </div>
          </div>
          <div className="mb-4 flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
            {agingCards.map((c) => (
              <div
                key={c.label}
                className={c.barClass}
                style={{ width: `${totalOutstanding > 0 ? (c.value / totalOutstanding) * 100 : 0}%` }}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {agingCards.map((c) => (
              <button
                key={c.label}
                onClick={() => c.value > 0 && setChip('outstanding')}
                className="rounded-lg border border-border p-3 text-left transition-colors hover:border-primary/30 hover:bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${c.barClass}`} />
                  <p className="text-xs font-medium text-muted-foreground">{c.label}</p>
                </div>
                <p className="mt-1.5 font-mono text-lg font-semibold tabular-nums">
                  {formatCurrency(c.value)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {totalOutstanding > 0
                    ? Math.round((c.value / totalOutstanding) * 100)
                    : 0}
                  % of total
                </p>
              </button>
            ))}
          </div>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            {chips.map((c) => {
              const count =
                c.value === 'all'
                  ? invoices.length
                  : c.value === 'paid'
                    ? invoices.filter((i) => i.status === 'paid').length
                    : c.value === 'overdue'
                      ? invoices.filter((i) => i.status === 'overdue').length
                      : invoices.filter((i) => i.paid < i.amount).length;
              return (
                <button
                  key={c.value}
                  onClick={() => setChip(c.value)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    chip === c.value
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {c.label}
                  <Badge variant={chip === c.value ? 'soft' : 'outline'} size="sm">
                    {count}
                  </Badge>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoices…"
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="size-4" /> Filters
            </Button>
          </div>
        </div>

        {selected.size > 0 && (
          <Card className="flex items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-2">
              <Badge variant="soft">{selected.size} selected</Badge>
              <Button variant="outline" size="sm">
                <Bell className="size-4" /> Send reminder
              </Button>
              <Button variant="outline" size="sm">
                <CheckCircle2 className="size-4" /> Mark as paid
              </Button>
              <Button variant="outline" size="sm">
                <Download className="size-4" /> Export
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
              Cancel
            </Button>
          </Card>
        )}

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr>
                  <th className="w-9">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={!allSelected && someSelected}
                      onCheckedChange={() => {
                        if (allSelected) setSelected(new Set());
                        else setSelected(new Set(filtered.map((i) => i.id)));
                      }}
                    />
                  </th>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>
                    <button className="inline-flex items-center gap-1 hover:text-foreground">
                      Issued <ArrowDownUp className="size-3" />
                    </button>
                  </th>
                  <th>Due</th>
                  <th>Reference</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Balance</th>
                  <th className="min-w-[120px]">Paid</th>
                  <th>Status</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => {
                  const paidPct = inv.amount > 0 ? Math.round((inv.paid / inv.amount) * 100) : 0;
                  const balance = inv.amount - inv.paid;
                  return (
                    <tr key={inv.id} className="group">
                      <td>
                        <Checkbox
                          checked={selected.has(inv.id)}
                          onCheckedChange={() => toggleOne(inv.id)}
                        />
                      </td>
                      <td>
                        <Link
                          href={`/app/sales/invoices/${inv.id}`}
                          className="font-mono text-xs font-medium text-primary hover:underline"
                        >
                          {inv.number}
                        </Link>
                      </td>
                      <td>
                        <Link
                          href={`/app/sales/customers/${inv.customerId}`}
                          className="flex items-center gap-2 transition-colors hover:text-primary"
                        >
                          <Avatar size="xs">
                            <AvatarFallback name={inv.customer}>
                              {initials(inv.customer)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate font-medium">{inv.customer}</span>
                        </Link>
                      </td>
                      <td className="text-sm text-muted-foreground">{formatDate(inv.issuedAt)}</td>
                      <td>
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className={inv.status === 'overdue' ? 'text-destructive' : 'text-muted-foreground'}>
                            {formatDate(inv.dueAt)}
                          </span>
                          {inv.daysOverdue && (
                            <Badge variant="destructive" size="sm" className="gap-1">
                              <AlertCircle className="size-3" />
                              {inv.daysOverdue}d
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="font-mono text-xs text-muted-foreground">{inv.reference}</td>
                      <td className="text-right font-mono tabular-nums">
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="text-right font-mono tabular-nums">
                        {balance > 0 ? (
                          <span className={inv.status === 'overdue' ? 'text-destructive' : ''}>
                            {formatCurrency(balance)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={paidPct}
                            className="h-1.5 w-16"
                            indicatorClassName={
                              inv.status === 'overdue' ? 'bg-destructive' : 'bg-success'
                            }
                          />
                          <span className="font-mono text-xs text-muted-foreground">{paidPct}%</span>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={inv.status} size="sm" />
                      </td>
                      <td>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/app/sales/invoices/${inv.id}`}>
                                <Eye className="size-4" /> View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="size-4" /> Send
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bell className="size-4" /> Send reminder
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle2 className="size-4" /> Mark as paid
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Create credit note</DropdownMenuItem>
                            <DropdownMenuItem destructive>Void invoice</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
