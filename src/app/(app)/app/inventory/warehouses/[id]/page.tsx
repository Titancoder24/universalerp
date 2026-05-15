import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Clipboard,
  Edit,
  MapPin,
  Package,
  Phone,
  Plus,
  Truck,
  User,
  Warehouse,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/ui/stat-card';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn, formatCurrency, formatDate, formatNumber } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

const aisles = [
  { aisle: 'A', racks: 24, used: 88 },
  { aisle: 'B', racks: 24, used: 72 },
  { aisle: 'C', racks: 18, used: 56 },
  { aisle: 'D', racks: 12, used: 41 },
  { aisle: 'E', racks: 12, used: 28 },
];

const recentStock = [
  { code: 'BOLT-M8-40', name: 'Industrial Bolts M8 x 40mm', bin: 'A-12-04-B', qty: 142, value: 59.64 },
  { code: 'GASKET-12', name: 'Rubber Gasket 12mm Series', bin: 'B-08-02-A', qty: 28, value: 51.80 },
  { code: 'OIL-HYD-46', name: 'Hydraulic Oil ISO 46', bin: 'D-01-01-X', qty: 4, value: 960 },
  { code: 'FILTER-AC-18', name: 'Cabin Air Filter 18mm', bin: 'C-15-07-D', qty: 67, value: 428.80 },
  { code: 'CHIP-FPGA-32', name: 'FPGA Dev Chip 32K Logic', bin: 'E-04-02-A', qty: 8, value: 33200 },
];

const movements = [
  { time: '08:42', type: 'receipt', ref: 'GR-2114', item: 'BOLT-M8-40', qty: 2000, worker: 'M. Tao' },
  { time: '09:15', type: 'putaway', ref: 'PA-1820', item: 'CABLE-CAT6-305', qty: 62, worker: 'M. Tao' },
  { time: '10:03', type: 'pick', ref: 'PCK-3221', item: 'FILTER-AC-18', qty: -42, worker: 'A. Liu' },
  { time: '10:48', type: 'pack', ref: 'PK-2987', item: 'BEAR-6204', qty: -120, worker: 'A. Liu' },
  { time: '11:22', type: 'ship', ref: 'SH-1442', item: 'OIL-HYD-46', qty: -2, worker: 'J. Park' },
  { time: '12:01', type: 'transfer', ref: 'TR-512', item: 'BOLT-M8-40', qty: -80, worker: 'D. Tasker' },
];

const counts = [
  { id: 'CNT-2026-014', date: '2026-05-12', type: 'Cycle', zone: 'Aisle A', items: 142, variance: 2, status: 'completed' },
  { id: 'CNT-2026-013', date: '2026-05-10', type: 'Cycle', zone: 'Aisle B', items: 96, variance: 0, status: 'completed' },
  { id: 'CNT-2026-015', date: '2026-05-14', type: 'Full', zone: 'Aisle C', items: 88, variance: -1, status: 'in_progress' },
  { id: 'CNT-2026-016', date: '2026-05-15', type: 'Spot', zone: 'Bin D-04', items: 12, variance: 0, status: 'pending' },
];

const movementColor: Record<string, string> = {
  receipt: 'success',
  putaway: 'info',
  pick: 'warning',
  pack: 'warning',
  ship: 'primary',
  transfer: 'info',
};

export default async function WarehouseDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Chicago Main DC"
        description="Distribution Center · 12,000 capacity · 480 active bins"
        breadcrumbs={[
          { label: 'Inventory', href: '/app/inventory' },
          { label: 'Warehouses', href: '/app/inventory/warehouses' },
          { label: id },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/inventory/warehouses"><ArrowLeft className="size-4" /></Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline"><Clipboard className="size-4" /> Start count</Button>
            <Button><Edit className="size-4" /> Edit</Button>
          </>
        }
      />

      <Card>
        <CardContent className="grid gap-6 p-6 md:grid-cols-[1fr_auto]">
          <div className="flex gap-4">
            <div className="flex size-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Warehouse className="size-7" />
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-xs font-mono text-primary">WH-CHI-01</div>
                <h2 className="text-xl font-semibold">Chicago Main DC</h2>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5"><MapPin className="size-4" /> 420 W Madison St, Chicago, IL 60607</div>
                <div className="flex items-center gap-1.5"><User className="size-4" /> Aisha Nakamura</div>
                <div className="flex items-center gap-1.5"><Phone className="size-4" /> +1 312 555 0142</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Distribution</Badge>
                <Badge variant="soft">3PL Integrated</Badge>
                <StatusBadge status="active" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:w-[420px]">
            <StatCard label="Items" value={1840} format="number" />
            <StatCard label="Stock value" value={3120000} format="currency" />
            <StatCard label="Bins" value={480} format="number" />
            <StatCard label="Utilization" value={78} deltaLabel="of 12,000" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bins">Bins</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="counts">Counts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Aisle utilization</CardTitle><CardDescription>By zone occupancy</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {aisles.map((a) => (
                <div key={a.aisle} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Aisle {a.aisle}</span>
                    <span className="text-muted-foreground">{a.racks} racks · {a.used}% used</span>
                  </div>
                  <Progress value={a.used} indicatorClassName={a.used > 85 ? 'bg-destructive' : a.used > 70 ? 'bg-warning' : 'bg-primary'} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Today's activity</CardTitle><CardDescription>Live operations</CardDescription></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { label: 'Receipts processed', val: 8, sub: '2,840 units in' },
                { label: 'Putaways completed', val: 12, sub: '+18 pending' },
                { label: 'Picks fulfilled', val: 42, sub: '8 in progress' },
                { label: 'Shipments dispatched', val: 28, sub: '12 docks active' },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div>
                    <div className="font-medium">{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.sub}</div>
                  </div>
                  <div className="text-2xl font-semibold tabular-nums">{s.val}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bins">
          <Card>
            <CardHeader>
              <CardTitle>Bin layout — Aisle A</CardTitle>
              <CardDescription>Visual rack &amp; shelf occupancy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((rack) => (
                  <div key={rack} className="rounded-lg border border-border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-sm font-medium">Rack A-{String(rack).padStart(2, '0')}</span>
                      <Badge variant="outline" size="sm">5 levels × 8 bins</Badge>
                    </div>
                    <div className="grid grid-cols-8 gap-1">
                      {Array.from({ length: 40 }).map((_, i) => {
                        const fill = (i * 37 + rack * 13) % 100;
                        const tone = fill > 80 ? 'bg-destructive/30 border-destructive/40' : fill > 50 ? 'bg-warning/30 border-warning/40' : fill > 10 ? 'bg-success/30 border-success/40' : 'bg-muted border-border';
                        return (
                          <div
                            key={i}
                            className={cn('flex h-9 items-center justify-center rounded border text-[10px] font-mono tabular-nums', tone)}
                            title={`Bin A-${rack}-${i}`}
                          >
                            {fill > 10 ? fill : ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><span className="size-3 rounded bg-muted border border-border" /> Empty</div>
                  <div className="flex items-center gap-1.5"><span className="size-3 rounded bg-success/30 border border-success/40" /> 10–50%</div>
                  <div className="flex items-center gap-1.5"><span className="size-3 rounded bg-warning/30 border border-warning/40" /> 50–80%</div>
                  <div className="flex items-center gap-1.5"><span className="size-3 rounded bg-destructive/30 border border-destructive/40" /> &gt;80%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock">
          <Card className="p-0">
            <table className="erp-table">
              <thead><tr><th>SKU</th><th>Item</th><th>Bin</th><th className="text-right">Qty</th><th className="text-right">Value</th></tr></thead>
              <tbody>
                {recentStock.map((r) => (
                  <tr key={r.code}>
                    <td className="font-mono text-xs text-primary">{r.code}</td>
                    <td className="font-medium">{r.name}</td>
                    <td className="font-mono text-xs">{r.bin}</td>
                    <td className="text-right font-mono">{r.qty}</td>
                    <td className="text-right font-mono">{formatCurrency(r.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="movements">
          <Card>
            <CardContent className="space-y-2 p-4">
              {movements.map((m, i) => (
                <div key={i} className="flex items-center gap-3 rounded-md border border-border p-3">
                  <div className="font-mono text-xs text-muted-foreground w-12">{m.time}</div>
                  <Badge variant={movementColor[m.type] === 'success' ? 'success' : movementColor[m.type] === 'warning' ? 'warning' : movementColor[m.type] === 'info' ? 'info' : 'soft'} size="sm">{m.type}</Badge>
                  <div className="flex-1">
                    <span className="font-mono text-xs text-primary mr-2">{m.ref}</span>
                    <span className="text-sm">{m.item}</span>
                  </div>
                  <div className={cn('font-mono tabular-nums font-medium', m.qty > 0 ? 'text-success' : 'text-destructive')}>
                    {m.qty > 0 ? '+' : ''}{m.qty}
                  </div>
                  <div className="text-xs text-muted-foreground w-20 text-right">{m.worker}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="counts">
          <Card className="p-0">
            <table className="erp-table">
              <thead><tr><th>Count #</th><th>Date</th><th>Type</th><th>Zone</th><th className="text-right">Items</th><th className="text-right">Variance</th><th>Status</th></tr></thead>
              <tbody>
                {counts.map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono text-xs text-primary">{c.id}</td>
                    <td>{formatDate(c.date)}</td>
                    <td><Badge variant="outline" size="sm">{c.type}</Badge></td>
                    <td>{c.zone}</td>
                    <td className="text-right font-mono">{c.items}</td>
                    <td className={cn('text-right font-mono font-medium', c.variance === 0 ? 'text-muted-foreground' : c.variance > 0 ? 'text-success' : 'text-destructive')}>
                      {c.variance === 0 ? '—' : c.variance > 0 ? `+${c.variance}` : c.variance}
                    </td>
                    <td><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
