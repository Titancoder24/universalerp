'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Download,
  Filter,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Truck,
  Warehouse,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatDate, formatRelativeTime, initials } from '@/lib/utils';

const transfers = [
  { id: 'TRF-3014', from: 'SF-01', to: 'RNO-02', items: 12, units: 240, status: 'in_progress', created: '2026-05-13', expectedDelivery: '2026-05-16', initiator: 'Maria Santos', shipMethod: 'Internal truck' },
  { id: 'TRF-3013', from: 'RNO-02', to: 'ATL-03', items: 8, units: 480, status: 'in_progress', created: '2026-05-13', expectedDelivery: '2026-05-17', initiator: 'Akira Tanaka', shipMethod: 'XPO Logistics' },
  { id: 'TRF-3012', from: 'ATL-03', to: 'SF-01', items: 5, units: 120, status: 'completed', created: '2026-05-10', expectedDelivery: '2026-05-13', initiator: 'James Wright', shipMethod: 'FedEx' },
  { id: 'TRF-3011', from: 'SF-01', to: 'ATL-03', items: 18, units: 364, status: 'completed', created: '2026-05-08', expectedDelivery: '2026-05-12', initiator: 'Sarah Chen', shipMethod: 'Internal truck' },
  { id: 'TRF-3010', from: 'RNO-02', to: 'SF-01', items: 4, units: 88, status: 'completed', created: '2026-05-06', expectedDelivery: '2026-05-09', initiator: 'Dmitri Volkov', shipMethod: 'UPS' },
  { id: 'TRF-3009', from: 'RNO-02', to: 'ATL-03', items: 22, units: 612, status: 'completed', created: '2026-05-04', expectedDelivery: '2026-05-08', initiator: 'Maria Santos', shipMethod: 'Saia' },
  { id: 'TRF-3008', from: 'SF-01', to: 'RNO-02', items: 9, units: 178, status: 'draft', created: '2026-05-15', expectedDelivery: '2026-05-19', initiator: 'Hannah Klein', shipMethod: '—' },
  { id: 'TRF-3007', from: 'ATL-03', to: 'RNO-02', items: 14, units: 280, status: 'cancelled', created: '2026-05-03', expectedDelivery: '—', initiator: 'Jamal Reed', shipMethod: '—' },
];

const warehouses = [
  { code: 'SF-01', name: 'San Francisco HQ', incoming: 1, outgoing: 2 },
  { code: 'RNO-02', name: 'Reno Distribution', incoming: 2, outgoing: 1 },
  { code: 'ATL-03', name: 'Atlanta Southeast', incoming: 1, outgoing: 1 },
];

export default function TransfersPage() {
  const inTransit = transfers.filter((t) => t.status === 'in_progress').length;
  const draft = transfers.filter((t) => t.status === 'draft').length;
  const totalUnits = transfers.filter((t) => t.status === 'in_progress').reduce((s, t) => s + t.units, 0);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Stock transfers"
        description="Move inventory between warehouses with full chain-of-custody tracking"
        breadcrumbs={[{ label: 'Inventory', href: '/app/inventory' }, { label: 'Transfers' }]}
        actions={
          <>
            <Button variant="outline" size="sm"><Filter className="size-4" /> Filter</Button>
            <Button variant="outline" size="sm"><Download className="size-4" /> Export</Button>
            <Button size="sm"><Plus className="size-4" /> New transfer</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="In transit" value={inTransit} format="number" icon={Truck} deltaLabel="active shipments" />
        <StatCard label="Units moving" value={totalUnits} format="compact" icon={Package} deltaLabel="across all transfers" />
        <StatCard label="Drafts" value={draft} format="number" trend="flat" deltaLabel="awaiting release" />
        <StatCard label="Completed (30d)" value={28} format="number" delta={12.4} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {warehouses.map((w) => (
          <Card key={w.code}>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Warehouse className="size-4" /> {w.name}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Code</span><span className="font-mono">{w.code}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Incoming</span><Badge variant="outline">{w.incoming} transfers</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Outgoing</span><Badge variant="outline">{w.outgoing} transfers</Badge></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">All transfers</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative"><Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search by ID, warehouse…" className="h-8 w-64 pl-8" /></div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <div className="border-b px-6">
              <TabsList className="-mb-px">
                <TabsTrigger value="all">All ({transfers.length})</TabsTrigger>
                <TabsTrigger value="in_progress">In transit ({inTransit})</TabsTrigger>
                <TabsTrigger value="draft">Drafts ({draft})</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all" className="m-0">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/20">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Transfer #</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Route</th>
                    <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Items</th>
                    <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Units</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Method</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Initiator</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Expected</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {transfers.map((t) => (
                    <tr key={t.id} className="border-b hover:bg-accent/30">
                      <td className="px-3 py-2"><Link href={`/app/inventory/transfers/${t.id}`} className="font-mono text-xs font-medium text-primary">{t.id}</Link></td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Badge variant="outline" className="font-mono">{t.from}</Badge>
                          <ArrowRight className="size-3 text-muted-foreground" />
                          <Badge variant="outline" className="font-mono">{t.to}</Badge>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums">{t.items}</td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums font-medium">{t.units}</td>
                      <td className="px-3 py-2 text-xs">{t.shipMethod}</td>
                      <td className="px-3 py-2"><div className="flex items-center gap-1.5"><Avatar size="xs"><AvatarFallback>{initials(t.initiator)}</AvatarFallback></Avatar><span className="text-xs">{t.initiator}</span></div></td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{t.expectedDelivery === '—' ? '—' : formatDate(t.expectedDelivery)}</td>
                      <td className="px-3 py-2"><StatusBadge status={t.status} /></td>
                      <td className="px-3 py-2"><Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-3.5" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabsContent>
            <TabsContent value="in_progress" className="m-0 p-6 text-center text-sm text-muted-foreground">Showing {inTransit} in-transit transfers</TabsContent>
            <TabsContent value="draft" className="m-0 p-6 text-center text-sm text-muted-foreground">Showing {draft} draft transfers</TabsContent>
            <TabsContent value="completed" className="m-0 p-6 text-center text-sm text-muted-foreground">Showing completed transfers</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
