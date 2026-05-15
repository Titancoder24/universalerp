import { AlertTriangle, Download, Filter, Search, Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, formatCurrency, formatDate, formatNumber } from '@/lib/utils';

interface Stock {
  id: string;
  sku: string;
  name: string;
  warehouse: string;
  bin: string;
  batch: string;
  expiry: string | null;
  onHand: number;
  reserved: number;
  cost: number;
}

const stockLevels: Stock[] = [
  { id: '1', sku: 'BOLT-M8-40', name: 'Industrial Bolts M8 x 40mm', warehouse: 'WH-CHI', bin: 'A-12-04-B', batch: 'B-24-1142', expiry: null, onHand: 142, reserved: 4, cost: 0.42 },
  { id: '2', sku: 'GASKET-12', name: 'Rubber Gasket 12mm Series A', warehouse: 'WH-DAL', bin: 'B-08-02-A', batch: 'B-24-1109', expiry: '2027-02-14', onHand: 28, reserved: 6, cost: 1.85 },
  { id: '3', sku: 'OIL-HYD-46', name: 'Hydraulic Oil ISO 46', warehouse: 'WH-PHX', bin: 'D-01-01-X', batch: 'B-24-0987', expiry: '2026-08-22', onHand: 4, reserved: 0, cost: 240 },
  { id: '4', sku: 'FILTER-AC-18', name: 'Cabin Air Filter 18mm', warehouse: 'WH-CHI', bin: 'C-15-07-D', batch: 'B-24-1201', expiry: '2028-11-04', onHand: 67, reserved: 6, cost: 6.40 },
  { id: '5', sku: 'CHIP-FPGA-32', name: 'FPGA Dev Chip 32K Logic', warehouse: 'WH-EWR', bin: 'E-04-02-A', batch: 'B-24-0421', expiry: null, onHand: 8, reserved: 1, cost: 4150 },
  { id: '6', sku: 'BEAR-6204', name: 'Ball Bearing 6204 ZZ', warehouse: 'WH-CHI', bin: 'A-08-03-C', batch: 'B-24-1320', expiry: null, onHand: 482, reserved: 31, cost: 3.80 },
  { id: '7', sku: 'PAINT-EPX-RAL5012', name: 'Epoxy Paint RAL5012 Blue', warehouse: 'WH-ATL', bin: 'B-12-04-A', batch: 'B-24-0822', expiry: '2026-06-15', onHand: 184, reserved: 6, cost: 14.20 },
  { id: '8', sku: 'COIL-S400', name: 'Solenoid Coil S400 24V', warehouse: 'WH-SEA', bin: 'C-04-01-B', batch: 'B-24-0612', expiry: null, onHand: 38, reserved: 0, cost: 26.50 },
  { id: '9', sku: 'CART-HP-58A', name: 'HP Toner Cartridge 58A', warehouse: 'WH-DAL', bin: 'A-22-06-D', batch: 'B-24-1109', expiry: '2027-01-22', onHand: 248, reserved: 16, cost: 78 },
  { id: '10', sku: 'PIPE-PVC-110', name: 'PVC Pipe Schedule 80 110mm', warehouse: 'WH-PHX', bin: 'F-01-01-A', batch: 'B-24-0901', expiry: null, onHand: 1280, reserved: 50, cost: 4.80 },
  { id: '11', sku: 'CABLE-CAT6-305', name: 'CAT6 UTP Cable 305m Reel', warehouse: 'WH-CHI', bin: 'D-04-02-A', batch: 'B-24-1411', expiry: null, onHand: 62, reserved: 4, cost: 124 },
  { id: '12', sku: 'GLUE-EPX-2K', name: 'Epoxy Glue 2-Component 250ml', warehouse: 'WH-MIA', bin: 'B-02-01-X', batch: 'B-24-0719', expiry: '2026-05-30', onHand: 124, reserved: 6, cost: 6.80 },
  { id: '13', sku: 'BATT-LIPO-3S', name: 'LiPo Battery 3S 5000mAh', warehouse: 'WH-ATL', bin: 'C-09-04-B', batch: 'B-24-1502', expiry: '2027-12-08', onHand: 78, reserved: 7, cost: 38 },
  { id: '14', sku: 'BOLT-M8-40', name: 'Industrial Bolts M8 x 40mm', warehouse: 'WH-PHX', bin: 'C-15-07-D', batch: 'B-24-1142', expiry: null, onHand: 86, reserved: 12, cost: 0.42 },
  { id: '15', sku: 'WELD-ROD-6013', name: 'Welding Rod 6013 3.2mm', warehouse: 'WH-ATL', bin: 'D-01-02-A', batch: 'B-24-1018', expiry: '2028-03-12', onHand: 12, reserved: 0, cost: 5.20 },
];

const isExpiringSoon = (date: string | null): boolean => {
  if (!date) return false;
  const days = (new Date(date).getTime() - new Date('2026-05-15').getTime()) / 86400000;
  return days < 30 && days > 0;
};

const totalValue = stockLevels.reduce((sum, s) => sum + s.onHand * s.cost, 0);
const totalUnits = stockLevels.reduce((sum, s) => sum + s.onHand, 0);
const reservedUnits = stockLevels.reduce((sum, s) => sum + s.reserved, 0);
const expiringSoon = stockLevels.filter((s) => isExpiringSoon(s.expiry)).length;

export default function StockLevelsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Stock levels"
        description="Real-time on-hand, reserved, and available quantities across every bin and batch."
        breadcrumbs={[
          { label: 'Inventory', href: '/app/inventory' },
          { label: 'Stock' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button variant="outline"><Filter className="size-4" /> Saved views</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total stock value" value={totalValue} format="currency" delta={4.2} />
        <StatCard label="Total units" value={totalUnits} format="number" delta={1.8} />
        <StatCard label="Reserved units" value={reservedUnits} format="number" delta={-2.4} />
        <StatCard label="Expiring 30d" value={expiringSoon} format="number" invertTrend delta={8.4} />
      </div>

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative max-w-sm flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="pl-8" placeholder="Search SKU, batch, bin…" />
            </div>
            <Select>
              <SelectTrigger className="w-44"><SelectValue placeholder="All warehouses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All warehouses</SelectItem>
                <SelectItem value="WH-CHI">WH-CHI Chicago</SelectItem>
                <SelectItem value="WH-DAL">WH-DAL Dallas</SelectItem>
                <SelectItem value="WH-PHX">WH-PHX Phoenix</SelectItem>
                <SelectItem value="WH-ATL">WH-ATL Atlanta</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="expiring">Expiring soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="p-0">
        <table className="erp-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Item</th>
              <th>Warehouse</th>
              <th>Bin</th>
              <th>Batch</th>
              <th>Expiry</th>
              <th className="text-right">On hand</th>
              <th className="text-right">Reserved</th>
              <th className="text-right">Available</th>
              <th className="text-right">Cost</th>
              <th className="text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {stockLevels.map((s) => {
              const available = s.onHand - s.reserved;
              const expiring = isExpiringSoon(s.expiry);
              return (
                <tr key={s.id}>
                  <td className="font-mono text-xs text-primary">{s.sku}</td>
                  <td className="font-medium">{s.name}</td>
                  <td className="text-xs">{s.warehouse}</td>
                  <td className="font-mono text-xs">{s.bin}</td>
                  <td className="font-mono text-xs text-muted-foreground">{s.batch}</td>
                  <td>
                    {s.expiry ? (
                      <span className={cn('text-xs', expiring && 'text-destructive font-medium')}>
                        {expiring && <Snowflake className="inline size-3 mr-1" />}
                        {formatDate(s.expiry)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="text-right font-mono tabular-nums">{formatNumber(s.onHand)}</td>
                  <td className="text-right font-mono tabular-nums text-warning">
                    {s.reserved > 0 ? formatNumber(s.reserved) : '—'}
                  </td>
                  <td className="text-right font-mono tabular-nums font-medium">{formatNumber(available)}</td>
                  <td className="text-right font-mono text-xs text-muted-foreground">{formatCurrency(s.cost)}</td>
                  <td className="text-right font-mono">{formatCurrency(s.onHand * s.cost)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
