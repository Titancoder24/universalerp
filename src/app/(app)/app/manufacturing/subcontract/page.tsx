'use client';

import * as React from 'react';
import { Download, Filter, Plus, Search, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, formatDate, formatNumber, initials } from '@/lib/utils';

const orders = [
  { id: 'SCO-7211', vendor: 'Precision Coatings LLC', item: 'GBX-450-A', process: 'Powder coat - RAL7011', qty: 240, received: 0, ship: '2026-05-16', return: '2026-05-19', status: 'released' as const, cost: 1440.00, buyer: 'M. Stark' },
  { id: 'SCO-7210', vendor: 'Atlas Heat Treat Inc.', item: 'BRK-220-S', process: 'Carburize + temper', qty: 480, received: 384, ship: '2026-05-12', return: '2026-05-17', status: 'in_progress' as const, cost: 2880.00, buyer: 'R. Chen' },
  { id: 'SCO-7209', vendor: 'Midwest Anodizing', item: 'HSG-AL-90', process: 'Type II anodize - black', qty: 1200, received: 1200, ship: '2026-05-08', return: '2026-05-14', status: 'completed' as const, cost: 3600.00, buyer: 'M. Stark' },
  { id: 'SCO-7208', vendor: 'PrecisionCNC Subcontract', item: 'SHF-660-C', process: 'CNC turning + grinding', qty: 800, received: 0, ship: '2026-05-18', return: '2026-05-25', status: 'planned' as const, cost: 6400.00, buyer: 'A. Reyes' },
  { id: 'SCO-7207', vendor: 'Apex Plating Services', item: 'BOLT-M8-25', process: 'Zinc-nickel plating', qty: 8000, received: 8000, ship: '2026-05-05', return: '2026-05-11', status: 'completed' as const, cost: 480.00, buyer: 'R. Chen' },
  { id: 'SCO-7206', vendor: 'Stellar Painting Co.', item: 'FRM-XL-180', process: 'Wet paint - 2K epoxy', qty: 24, received: 8, ship: '2026-05-13', return: '2026-05-20', status: 'in_progress' as const, cost: 2160.00, buyer: 'M. Stark' },
  { id: 'SCO-7205', vendor: 'Northern PCB Assembly', item: 'CTL-PCBA-200', process: 'SMT assembly', qty: 320, received: 0, ship: '2026-05-19', return: '2026-05-26', status: 'released' as const, cost: 9600.00, buyer: 'P. Krishnan' },
  { id: 'SCO-7204', vendor: 'Atlas Heat Treat Inc.', item: 'GEAR-IN-22T', process: 'Case hardening', qty: 480, received: 0, ship: '2026-05-22', return: '2026-05-28', status: 'planned' as const, cost: 1920.00, buyer: 'R. Chen' },
  { id: 'SCO-7203', vendor: 'Apex Plating Services', item: 'PIN-Φ6-DOWEL', process: 'Hard chrome plating', qty: 2400, received: 0, ship: '2026-05-15', return: '2026-05-20', status: 'released' as const, cost: 720.00, buyer: 'M. Stark' },
  { id: 'SCO-7202', vendor: 'Quality Welding LLC', item: 'CHN-CV-32', process: 'Frame welding subassembly', qty: 4, received: 4, ship: '2026-04-28', return: '2026-05-09', status: 'completed' as const, cost: 4800.00, buyer: 'A. Reyes' },
  { id: 'SCO-7201', vendor: 'Stellar Painting Co.', item: 'GBX-450-A', process: 'Touch-up rework', qty: 12, received: 0, ship: '2026-05-14', return: '2026-05-15', status: 'on_hold' as const, cost: 240.00, buyer: 'M. Stark' },
  { id: 'SCO-7200', vendor: 'Midwest Anodizing', item: 'CASE-DIN-32', process: 'Hard anodize', qty: 600, received: 0, ship: '2026-05-20', return: '2026-05-27', status: 'planned' as const, cost: 2400.00, buyer: 'R. Chen' },
];

export default function SubcontractPage() {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');

  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.vendor.toLowerCase().includes(search.toLowerCase()) || o.item.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'all' || o.status === status;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: orders.length,
    open: orders.filter((o) => o.status === 'released' || o.status === 'in_progress').length,
    value: orders.reduce((s, o) => s + o.cost, 0),
    pending: orders.filter((o) => o.received < o.qty && o.status !== 'completed').reduce((s, o) => s + (o.qty - o.received), 0),
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Subcontracting"
        description="External operations · outsourced processes performed by partner vendors."
        breadcrumbs={[
          { label: 'Manufacturing', href: '/app/manufacturing' },
          { label: 'Subcontracting' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New SC order</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Total orders</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Open</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Open value</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{formatCurrency(stats.value)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Awaiting return</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{formatNumber(stats.pending)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search SC orders, vendors, items..." className="pl-8" />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="released">Released</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="on_hold">On hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm"><Filter className="size-4" /> More filters</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>SC Order</th>
                <th>Vendor</th>
                <th>Item</th>
                <th>Process</th>
                <th className="text-right">Qty</th>
                <th>Progress</th>
                <th>Ship</th>
                <th>Return by</th>
                <th>Status</th>
                <th className="text-right">Cost</th>
                <th>Buyer</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const pct = Math.round((o.received / o.qty) * 100);
                return (
                  <tr key={o.id}>
                    <td className="font-mono text-xs font-medium text-primary">{o.id}</td>
                    <td className="text-sm flex items-center gap-2">
                      <Truck className="size-3.5 text-muted-foreground" />
                      <span>{o.vendor}</span>
                    </td>
                    <td className="font-mono text-xs">{o.item}</td>
                    <td className="text-xs text-muted-foreground">{o.process}</td>
                    <td className="text-right font-mono">{formatNumber(o.qty)}</td>
                    <td className="w-36">
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-1.5 w-20" />
                        <span className="text-2xs tabular-nums">{pct}%</span>
                      </div>
                    </td>
                    <td className="text-xs text-muted-foreground">{formatDate(o.ship)}</td>
                    <td className="text-xs text-muted-foreground">{formatDate(o.return)}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="text-right font-mono">{formatCurrency(o.cost)}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Avatar size="xs"><AvatarFallback>{initials(o.buyer)}</AvatarFallback></Avatar>
                        <span className="text-xs">{o.buyer}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
