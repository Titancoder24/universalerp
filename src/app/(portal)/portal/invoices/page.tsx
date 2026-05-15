'use client';

import * as React from 'react';
import { Download, Filter, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatCurrency, formatDate } from '@/lib/utils';

const invoices = [
  { id: 'INV-2089', date: '2026-05-13', due: '2026-05-25', amount: 12450, paid: 0, status: 'sent' as const },
  { id: 'INV-2087', date: '2026-05-08', due: '2026-05-20', amount: 24500, paid: 12250, status: 'partial' as const },
  { id: 'INV-2085', date: '2026-05-01', due: '2026-05-14', amount: 8900, paid: 8900, status: 'paid' as const },
  { id: 'INV-2078', date: '2026-04-22', due: '2026-05-04', amount: 18450, paid: 0, status: 'overdue' as const },
  { id: 'INV-2072', date: '2026-04-10', due: '2026-04-22', amount: 6800, paid: 6800, status: 'paid' as const },
  { id: 'INV-2065', date: '2026-03-28', due: '2026-04-10', amount: 14200, paid: 14200, status: 'paid' as const },
];

export default function PortalInvoicesPage() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const filtered = invoices.filter((i) => {
    const matchSearch = !search || i.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totals = {
    outstanding: invoices.filter((i) => i.status !== 'paid').reduce((s, i) => s + (i.amount - i.paid), 0),
    overdue: invoices.filter((i) => i.status === 'overdue').reduce((s, i) => s + (i.amount - i.paid), 0),
    paid: invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.paid, 0),
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Invoices</h1>
        <p className="text-muted-foreground">All invoices from Acme Corp</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Outstanding balance</div>
            <div className="mt-1 text-2xl font-semibold">{formatCurrency(totals.outstanding)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Overdue</div>
            <div className="mt-1 text-2xl font-semibold text-destructive">{formatCurrency(totals.overdue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Paid this year</div>
            <div className="mt-1 text-2xl font-semibold text-success">{formatCurrency(totals.paid)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                placeholder="Search invoices…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            {['all', 'sent', 'partial', 'paid', 'overdue'].map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(s)}
                className="capitalize"
              >
                {s}
              </Button>
            ))}
          </div>

          <table className="erp-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Due</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Paid</th>
                <th className="text-right">Balance</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id}>
                  <td className="font-mono text-xs font-medium text-primary">{i.id}</td>
                  <td className="text-sm">{formatDate(i.date)}</td>
                  <td className="text-sm">{formatDate(i.due)}</td>
                  <td className="text-right font-mono">{formatCurrency(i.amount)}</td>
                  <td className="text-right font-mono text-muted-foreground">{formatCurrency(i.paid)}</td>
                  <td className="text-right font-mono font-semibold">{formatCurrency(i.amount - i.paid)}</td>
                  <td><StatusBadge status={i.status} /></td>
                  <td className="text-right">
                    <Button variant="ghost" size="xs"><Download className="size-3" /> PDF</Button>
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
