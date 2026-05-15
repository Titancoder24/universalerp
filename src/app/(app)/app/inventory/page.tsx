import Link from 'next/link';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Boxes,
  Building2,
  Clock,
  DollarSign,
  Download,
  Layers,
  Package,
  Plus,
  Snowflake,
  TrendingDown,
  TrendingUp,
  Warehouse,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatNumber, formatCompactNumber } from '@/lib/utils';

const stats = [
  { label: 'Stock value', value: 8420590, delta: 4.2, format: 'currency' as const, icon: DollarSign, sparkline: [82, 84, 83, 85, 84, 86, 84, 85] },
  { label: 'SKUs tracked', value: 4267, delta: 2.1, format: 'number' as const, icon: Boxes, sparkline: [4180, 4200, 4220, 4240, 4250, 4260, 4265, 4267] },
  { label: 'Low stock', value: 38, delta: 18.5, format: 'number' as const, icon: AlertTriangle, invertTrend: true, sparkline: [22, 28, 25, 30, 32, 36, 38, 38] },
  { label: 'Expiring 30d', value: 17, delta: -12, format: 'number' as const, icon: Clock, invertTrend: true, sparkline: [25, 23, 21, 19, 18, 18, 17, 17] },
];

const lowStockItems = [
  { code: 'BOLT-M8-40', name: 'Industrial Bolts M8 x 40mm', onHand: 142, min: 500, uom: 'pcs', warehouse: 'WH-Chicago' },
  { code: 'GASKET-12', name: 'Rubber Gasket 12mm Series', onHand: 28, min: 150, uom: 'pcs', warehouse: 'WH-Dallas' },
  { code: 'OIL-HYD-46', name: 'Hydraulic Oil ISO 46', onHand: 4, min: 25, uom: 'drum', warehouse: 'WH-Phoenix' },
  { code: 'FILTER-AC-18', name: 'Cabin Air Filter 18mm', onHand: 67, min: 200, uom: 'pcs', warehouse: 'WH-Chicago' },
  { code: 'WELD-ROD-6013', name: 'Welding Rod 6013 3.2mm', onHand: 12, min: 80, uom: 'kg', warehouse: 'WH-Atlanta' },
];

const warehouses = [
  { name: 'WH-Chicago - Main DC', items: 1840, value: 3120000, util: 78, capacity: 12000, manager: 'Aisha N.' },
  { name: 'WH-Dallas - Regional', items: 1120, value: 2080000, util: 64, capacity: 9500, manager: 'Carlos M.' },
  { name: 'WH-Phoenix - Western', items: 690, value: 1380000, util: 42, capacity: 7200, manager: 'Devon T.' },
  { name: 'WH-Atlanta - Eastern', items: 540, value: 1240000, util: 56, capacity: 8000, manager: 'Priya K.' },
  { name: 'WH-Newark - Cross-dock', items: 77, value: 600590, util: 89, capacity: 2400, manager: 'Liam R.' },
];

const slowMoving = [
  { code: 'DISP-XJ7', name: 'Display Module XJ7 OLED', daysIdle: 184, value: 24800, qty: 12 },
  { code: 'CABLE-MIL-6F', name: 'Mil-Spec Cable 6ft', daysIdle: 156, value: 8400, qty: 240 },
  { code: 'COIL-S400', name: 'Solenoid Coil S400', daysIdle: 142, value: 15200, qty: 38 },
  { code: 'CHIP-FPGA-32', name: 'FPGA Dev Chip 32K', daysIdle: 127, value: 41200, qty: 8 },
];

const abcSegments = [
  { tier: 'A', items: 412, percent: 9.7, valuePercent: 78, value: 6567970, color: 'hsl(var(--success))' },
  { tier: 'B', items: 1054, percent: 24.7, valuePercent: 16, value: 1347294, color: 'hsl(var(--info))' },
  { tier: 'C', items: 2801, percent: 65.6, valuePercent: 6, value: 505325, color: 'hsl(var(--muted-foreground))' },
];

export default function InventoryDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Inventory"
        description="Real-time stock visibility across warehouses, bins, batches, and serials."
        breadcrumbs={[{ label: 'Operations', href: '/app' }, { label: 'Inventory' }]}
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" /> Export
            </Button>
            <Button asChild>
              <Link href="/app/inventory/items/new">
                <Plus className="size-4" /> New item
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Warehouse Utilization</CardTitle>
              <CardDescription>Capacity vs items across all DCs</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/inventory/warehouses">
                All warehouses <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {warehouses.map((w) => (
              <div key={w.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Warehouse className="size-4 text-muted-foreground" />
                    <span className="font-medium">{w.name}</span>
                    <Badge variant="outline" size="sm">{w.manager}</Badge>
                  </div>
                  <div className="flex items-center gap-3 tabular-nums text-xs text-muted-foreground">
                    <span>{formatNumber(w.items)} items</span>
                    <span>{formatCurrency(w.value)}</span>
                    <span className="font-medium text-foreground">{w.util}%</span>
                  </div>
                </div>
                <Progress
                  value={w.util}
                  indicatorClassName={
                    w.util > 85 ? 'bg-destructive' : w.util > 70 ? 'bg-warning' : 'bg-primary'
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ABC Analysis</CardTitle>
            <CardDescription>Value concentration by tier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              {abcSegments.map((s) => (
                <div
                  key={s.tier}
                  style={{ width: `${s.valuePercent}%`, backgroundColor: s.color }}
                  className="transition-all"
                />
              ))}
            </div>
            {abcSegments.map((s) => (
              <div key={s.tier} className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-md font-bold text-white"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.tier}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{formatNumber(s.items)} items</div>
                    <div className="text-xs text-muted-foreground">{s.percent}% of catalog</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium tabular-nums">{formatCompactNumber(s.value)}</div>
                  <div className="text-xs text-muted-foreground">{s.valuePercent}% of value</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>Items below reorder point</CardDescription>
            </div>
            <Badge variant="warning">{lowStockItems.length} alerts</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Item</th>
                  <th className="text-right">On hand</th>
                  <th className="text-right">Min</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((i) => {
                  const ratio = i.onHand / i.min;
                  const status = ratio < 0.1 ? 'overdue' : ratio < 0.3 ? 'pending' : 'open';
                  return (
                    <tr key={i.code}>
                      <td className="font-mono text-xs text-primary">{i.code}</td>
                      <td className="font-medium">{i.name}</td>
                      <td className="text-right font-mono">{i.onHand} {i.uom}</td>
                      <td className="text-right font-mono text-muted-foreground">{i.min}</td>
                      <td><StatusBadge status={status} label={ratio < 0.1 ? 'critical' : ratio < 0.3 ? 'low' : 'reorder'} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Slow Moving Inventory</CardTitle>
              <CardDescription>No movement in last 120 days</CardDescription>
            </div>
            <Badge variant="soft"><TrendingDown className="size-3" /> {slowMoving.length}</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Item</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Value</th>
                  <th className="text-right">Idle</th>
                </tr>
              </thead>
              <tbody>
                {slowMoving.map((i) => (
                  <tr key={i.code}>
                    <td className="font-mono text-xs text-primary">{i.code}</td>
                    <td className="font-medium">{i.name}</td>
                    <td className="text-right font-mono">{i.qty}</td>
                    <td className="text-right font-mono">{formatCurrency(i.value)}</td>
                    <td className="text-right text-warning font-medium">{i.daysIdle}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
