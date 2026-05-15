'use client';

import * as React from 'react';
import { Filter, Plus, RotateCcw, Search } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency, formatDate, initials, colorFromString } from '@/lib/utils';

const returns = [
  { id: 'RTN-1024', invoiceId: 'INV-2089', customer: 'Acme Industries', reason: 'defective', items: 'Widget Pro x 12', amount: 4500, date: '2026-05-12', status: 'pending_inspection' },
  { id: 'RTN-1019', invoiceId: 'INV-2078', customer: 'TechCorp Solutions', reason: 'wrong_size', items: 'Bracket Set', amount: 1240, date: '2026-05-08', status: 'inspected_accept' },
  { id: 'RTN-1015', invoiceId: 'INV-2065', customer: 'Global Manufacturing', reason: 'damaged_shipping', items: 'Steel Plates x 4', amount: 2000, date: '2026-05-02', status: 'credit_issued' },
  { id: 'RTN-1003', invoiceId: 'INV-2045', customer: 'StartupCo', reason: 'customer_changed_mind', items: 'Software License', amount: 99, date: '2026-04-22', status: 'rejected' },
];

const reasonLabels: Record<string, string> = {
  defective: 'Defective',
  wrong_size: 'Wrong Size/Spec',
  damaged_shipping: 'Damaged in Shipping',
  customer_changed_mind: 'Changed Mind',
  not_as_described: 'Not as Described',
};

const statusColors: Record<string, string> = {
  pending_inspection: 'warning',
  inspected_accept: 'info',
  credit_issued: 'success',
  rejected: 'destructive',
};

export default function ReturnsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Sales Returns"
        description="Returns Merchandise Authorization (RMA) tracking. Inspect, accept, and credit returned items."
        actions={<Button><Plus className="size-4" /> New return</Button>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Open returns" value={returns.filter((r) => r.status !== 'credit_issued' && r.status !== 'rejected').length} format="number" />
        <StatCard label="Credit YTD" value={returns.filter((r) => r.status === 'credit_issued').reduce((s, r) => s + r.amount, 0)} format="currency" />
        <StatCard label="Return rate" value={1.2} format="percent" />
        <StatCard label="Avg processing time" value="3.2 days" format="number" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input placeholder="Search returns…" className="pl-8" />
            </div>
            <Button variant="outline" size="sm"><Filter className="size-3.5" /> Filter</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>RTN #</th>
                <th>Customer</th>
                <th>Source Invoice</th>
                <th>Items</th>
                <th>Reason</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((r) => (
                <tr key={r.id} className="cursor-pointer">
                  <td className="font-mono text-xs font-medium text-primary">{r.id}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar size="xs">
                        <AvatarFallback style={{ backgroundColor: colorFromString(r.customer) }} className="text-2xs text-white">
                          {initials(r.customer)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{r.customer}</span>
                    </div>
                  </td>
                  <td className="font-mono text-xs text-primary">{r.invoiceId}</td>
                  <td className="text-sm text-muted-foreground">{r.items}</td>
                  <td>
                    <Badge variant="outline">{reasonLabels[r.reason] ?? r.reason}</Badge>
                  </td>
                  <td className="text-sm">{formatDate(r.date)}</td>
                  <td className="text-right font-mono">{formatCurrency(r.amount)}</td>
                  <td>
                    <Badge variant={statusColors[r.status] as any}>{r.status.replace(/_/g, ' ')}</Badge>
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
