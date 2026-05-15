'use client';

import * as React from 'react';
import { Download, PackageX, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/utils';

const rmas = [
  { id: 'RMA-1018', customer: 'Acme Industries', date: '2026-05-14', invoice: 'INV-2089', product: 'PMP-310-X', qty: 1, reason: 'Performance - vibration', disposition: 'Repair', amount: 6400, status: 'in_progress' as const, days: 1 },
  { id: 'RMA-1017', customer: 'TechCorp Solutions', date: '2026-05-12', invoice: 'INV-2088', product: 'CHN-CV-32', qty: 1, reason: 'Performance - alignment', disposition: 'Repair', amount: 2400, status: 'closed' as const, days: 3 },
  { id: 'RMA-1016', customer: 'Global Manufacturing', date: '2026-05-11', invoice: 'INV-2087', product: 'GBX-450-A', qty: 4, reason: 'Defect - oil leak', disposition: 'Replace', amount: 498, status: 'pending' as const, days: 4 },
  { id: 'RMA-1015', customer: 'StartupCo', date: '2026-05-10', invoice: 'INV-2086', product: 'MTR-2.2KW', qty: 2, reason: 'Defect - IR low', disposition: 'Replace', amount: 437.50, status: 'in_progress' as const, days: 5 },
  { id: 'RMA-1014', customer: 'Enterprise Ltd', date: '2026-05-08', invoice: 'INV-2085', product: 'CTL-PCBA-200', qty: 12, reason: 'Performance - intermittent', disposition: 'Investigate', amount: 2008, status: 'open' as const, days: 7 },
  { id: 'RMA-1013', customer: 'Acme Industries', date: '2026-05-07', invoice: 'INV-2084', product: 'BRK-220-S', qty: 24, reason: 'Defect - corrosion', disposition: 'Replace', amount: 1354, status: 'closed' as const, days: 8 },
  { id: 'RMA-1012', customer: 'NorthCo Industries', date: '2026-05-02', invoice: 'INV-2079', product: 'LMP-LED-IND', qty: 12, reason: 'Defect - DOA', disposition: 'Credit', amount: 268, status: 'closed' as const, days: 13 },
  { id: 'RMA-1011', customer: 'Pacific Manufacturing', date: '2026-04-29', invoice: 'INV-2076', product: 'SHF-660-C', qty: 16, reason: 'Defect - finish', disposition: 'Replace', amount: 659.20, status: 'closed' as const, days: 16 },
  { id: 'RMA-1010', customer: 'Continental Auto Parts', date: '2026-04-28', invoice: 'INV-2075', product: 'GBX-450-A', qty: 2, reason: 'Performance - noise', disposition: 'Replace', amount: 249, status: 'closed' as const, days: 17 },
  { id: 'RMA-1009', customer: 'Western Logistics', date: '2026-05-03', invoice: 'INV-2080', product: 'HVA-CMP-15', qty: 1, reason: 'Wrong voltage shipped', disposition: 'Replace', amount: 1240, status: 'closed' as const, days: 12 },
  { id: 'RMA-1008', customer: 'Eastern Distribution', date: '2026-04-22', invoice: 'INV-2070', product: 'VLV-104-B', qty: 8, reason: 'Spec mismatch', disposition: 'Credit', amount: 711, status: 'closed' as const, days: 23 },
  { id: 'RMA-1007', customer: 'Marine Systems Inc', date: '2026-04-18', invoice: 'INV-2068', product: 'SNS-TMP-PT100', qty: 240, reason: 'Wrong configuration', disposition: 'Credit', amount: 4536, status: 'closed' as const, days: 27 },
];

const dispositionVariant: Record<string, 'info' | 'warning' | 'destructive' | 'success' | 'soft'> = {
  Repair: 'info', Replace: 'warning', Credit: 'destructive', Investigate: 'soft', Scrap: 'destructive',
};

export default function RmaPage() {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [disposition, setDisposition] = React.useState('all');

  const filtered = rmas.filter((r) => {
    const matchSearch = !search || r.id.toLowerCase().includes(search.toLowerCase()) || r.customer.toLowerCase().includes(search.toLowerCase()) || r.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'all' || r.status === status;
    const matchDisp = disposition === 'all' || r.disposition === disposition;
    return matchSearch && matchStatus && matchDisp;
  });

  const stats = {
    open: rmas.filter((r) => r.status !== 'closed').length,
    units: rmas.reduce((s, r) => s + r.qty, 0),
    creditValue: rmas.reduce((s, r) => s + r.amount, 0),
    avgDays: Math.round(rmas.reduce((s, r) => s + r.days, 0) / rmas.length),
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Returns Authorization (RMA)"
        description="Customer return authorizations with disposition tracking and credit management."
        breadcrumbs={[
          { label: 'Quality', href: '/app/quality' },
          { label: 'RMA' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New RMA</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <PackageX className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Open RMAs</div>
              <div className="text-xl font-semibold tabular-nums">{stats.open}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Units returned</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{stats.units}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Total credit/repair</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{formatCurrency(stats.creditValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Avg cycle time</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{stats.avgDays}d</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search RMAs..." className="pl-8" />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={disposition} onValueChange={setDisposition}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Disposition" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All dispositions</SelectItem>
                <SelectItem value="Repair">Repair</SelectItem>
                <SelectItem value="Replace">Replace</SelectItem>
                <SelectItem value="Credit">Credit</SelectItem>
                <SelectItem value="Investigate">Investigate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>RMA</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Original invoice</th>
                <th>Product</th>
                <th className="text-right">Qty</th>
                <th>Return reason</th>
                <th>Disposition</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Age</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="font-mono text-xs font-medium text-primary">{r.id}</td>
                  <td className="font-medium">{r.customer}</td>
                  <td className="text-xs text-muted-foreground">{formatDate(r.date)}</td>
                  <td className="font-mono text-xs">{r.invoice}</td>
                  <td className="font-mono text-xs">{r.product}</td>
                  <td className="text-right font-mono">{r.qty}</td>
                  <td className="text-sm">{r.reason}</td>
                  <td><Badge variant={dispositionVariant[r.disposition]} size="sm">{r.disposition}</Badge></td>
                  <td className="text-right font-mono">{formatCurrency(r.amount)}</td>
                  <td className="text-right text-xs text-muted-foreground">{r.days}d</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
