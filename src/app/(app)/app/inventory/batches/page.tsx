import {
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  GitBranch,
  Hash,
  Search,
  Snowflake,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { StatCard } from '@/components/ui/stat-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn, formatDate, formatNumber } from '@/lib/utils';

interface Batch {
  id: string;
  sku: string;
  name: string;
  warehouse: string;
  manufactured: string;
  expiry: string | null;
  received: number;
  remaining: number;
  status: 'active' | 'expired' | 'recalled' | 'quarantine';
  vendor: string;
  po: string;
}

const batches: Batch[] = [
  { id: 'B-24-1142', sku: 'BOLT-M8-40', name: 'Industrial Bolts M8 x 40mm', warehouse: 'WH-CHI', manufactured: '2024-08-12', expiry: null, received: 2000, remaining: 142, status: 'active', vendor: 'Apex Industrial', po: 'PO-1184' },
  { id: 'B-24-1109', sku: 'GASKET-12', name: 'Rubber Gasket 12mm Series A', warehouse: 'WH-DAL', manufactured: '2024-07-22', expiry: '2027-02-14', received: 500, remaining: 28, status: 'active', vendor: 'SealCo GmbH', po: 'PO-1147' },
  { id: 'B-24-0987', sku: 'OIL-HYD-46', name: 'Hydraulic Oil ISO 46', warehouse: 'WH-PHX', manufactured: '2024-04-08', expiry: '2026-08-22', received: 20, remaining: 4, status: 'active', vendor: 'Petrolab Inc', po: 'PO-1112' },
  { id: 'B-24-1201', sku: 'FILTER-AC-18', name: 'Cabin Air Filter 18mm', warehouse: 'WH-CHI', manufactured: '2024-09-14', expiry: '2028-11-04', received: 500, remaining: 67, status: 'active', vendor: 'AirGuard Co', po: 'PO-1191' },
  { id: 'B-24-0421', sku: 'CHIP-FPGA-32', name: 'FPGA Dev Chip 32K Logic', warehouse: 'WH-EWR', manufactured: '2024-02-18', expiry: null, received: 50, remaining: 8, status: 'active', vendor: 'Shenzhen Tek', po: 'PO-1098' },
  { id: 'B-24-1320', sku: 'BEAR-6204', name: 'Ball Bearing 6204 ZZ', warehouse: 'WH-CHI', manufactured: '2024-10-08', expiry: null, received: 1000, remaining: 482, status: 'active', vendor: 'Apex Industrial', po: 'PO-1201' },
  { id: 'B-24-0822', sku: 'PAINT-EPX-RAL5012', name: 'Epoxy Paint RAL5012 Blue', warehouse: 'WH-ATL', manufactured: '2024-03-19', expiry: '2026-06-15', received: 500, remaining: 184, status: 'active', vendor: 'ColorMax AG', po: 'PO-1077' },
  { id: 'B-24-0612', sku: 'COIL-S400', name: 'Solenoid Coil S400 24V', warehouse: 'WH-SEA', manufactured: '2024-05-30', expiry: null, received: 100, remaining: 38, status: 'active', vendor: 'ElectroMag', po: 'PO-1109' },
  { id: 'B-23-2204', sku: 'GASKET-08', name: 'Rubber Gasket 8mm Series A', warehouse: 'WH-DAL', manufactured: '2023-11-04', expiry: '2026-04-22', received: 800, remaining: 12, status: 'expired', vendor: 'SealCo GmbH', po: 'PO-0982' },
  { id: 'B-24-0719', sku: 'GLUE-EPX-2K', name: 'Epoxy Glue 2-Component 250ml', warehouse: 'WH-MIA', manufactured: '2024-06-04', expiry: '2026-05-30', received: 200, remaining: 124, status: 'active', vendor: 'StickIt Labs', po: 'PO-1132' },
  { id: 'B-24-0103', sku: 'CHIP-XR-12', name: 'Driver Chip XR12 Discontinued', warehouse: 'WH-EWR', manufactured: '2024-01-14', expiry: null, received: 200, remaining: 18, status: 'recalled', vendor: 'Shenzhen Tek', po: 'PO-1042' },
  { id: 'B-24-1502', sku: 'BATT-LIPO-3S', name: 'LiPo Battery 3S 5000mAh', warehouse: 'WH-ATL', manufactured: '2024-11-22', expiry: '2027-12-08', received: 150, remaining: 78, status: 'active', vendor: 'PowerCells Ltd', po: 'PO-1218' },
];

const serials = [
  { id: 'SN-FPGA-32-00188', sku: 'CHIP-FPGA-32', batch: 'B-24-0421', status: 'in_stock', warehouse: 'WH-EWR', received: '2024-03-04' },
  { id: 'SN-FPGA-32-00189', sku: 'CHIP-FPGA-32', batch: 'B-24-0421', status: 'in_stock', warehouse: 'WH-EWR', received: '2024-03-04' },
  { id: 'SN-FPGA-32-00190', sku: 'CHIP-FPGA-32', batch: 'B-24-0421', status: 'shipped', warehouse: 'Customer ACM-1188', received: '2024-03-04' },
  { id: 'SN-DRILL-18V-0721', sku: 'TOOL-DRILL-18V', batch: 'B-24-0822', status: 'in_stock', warehouse: 'WH-CHI', received: '2024-09-12' },
  { id: 'SN-DRILL-18V-0722', sku: 'TOOL-DRILL-18V', batch: 'B-24-0822', status: 'reserved', warehouse: 'WH-CHI', received: '2024-09-12' },
  { id: 'SN-DRILL-18V-0723', sku: 'TOOL-DRILL-18V', batch: 'B-24-0822', status: 'in_stock', warehouse: 'WH-CHI', received: '2024-09-12' },
  { id: 'SN-BATT-LIPO-1101', sku: 'BATT-LIPO-3S', batch: 'B-24-1502', status: 'in_stock', warehouse: 'WH-ATL', received: '2024-11-28' },
];

const isExpiring = (d: string | null) => {
  if (!d) return false;
  const days = (new Date(d).getTime() - new Date('2026-05-15').getTime()) / 86400000;
  return days < 60 && days > 0;
};

const expiring = batches.filter((b) => isExpiring(b.expiry));
const expired = batches.filter((b) => b.status === 'expired');

export default function BatchesPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Batches & serials"
        description="Full traceability of lots, batches, and serial numbers across the supply chain."
        breadcrumbs={[
          { label: 'Inventory', href: '/app/inventory' },
          { label: 'Batches' },
        ]}
        actions={
          <>
            <Button variant="outline"><GitBranch className="size-4" /> Genealogy</Button>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active batches" value={batches.filter((b) => b.status === 'active').length} format="number" />
        <StatCard label="Expiring 60d" value={expiring.length} format="number" invertTrend delta={18.2} />
        <StatCard label="Expired" value={expired.length} format="number" invertTrend />
        <StatCard label="Recalled / Quarantine" value={batches.filter((b) => b.status === 'recalled' || b.status === 'quarantine').length} format="number" />
      </div>

      <Tabs defaultValue="batches">
        <div className="flex items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="batches"><Hash className="size-4" /> Batches</TabsTrigger>
            <TabsTrigger value="serials">Serials</TabsTrigger>
            <TabsTrigger value="expiring"><Snowflake className="size-4" /> Expiring</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="pl-8 w-72" placeholder="Search batch #, SKU, vendor…" />
            </div>
            <Select>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="recalled">Recalled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="batches">
          <Card className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Batch #</th>
                  <th>SKU</th>
                  <th>Item</th>
                  <th>Warehouse</th>
                  <th>Manufactured</th>
                  <th>Expiry</th>
                  <th className="text-right">Received</th>
                  <th className="text-right">Remaining</th>
                  <th>Vendor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => {
                  const expiring = isExpiring(b.expiry);
                  return (
                    <tr key={b.id}>
                      <td className="font-mono text-xs text-primary">{b.id}</td>
                      <td className="font-mono text-xs">{b.sku}</td>
                      <td className="font-medium">{b.name}</td>
                      <td className="text-xs">{b.warehouse}</td>
                      <td className="text-xs text-muted-foreground">{formatDate(b.manufactured)}</td>
                      <td>
                        {b.expiry ? (
                          <span className={cn('text-xs', expiring && 'text-warning font-medium', b.status === 'expired' && 'text-destructive font-medium')}>
                            {expiring && <AlertTriangle className="inline size-3 mr-1" />}
                            {formatDate(b.expiry)}
                          </span>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="text-right font-mono">{formatNumber(b.received)}</td>
                      <td className="text-right font-mono font-medium">{formatNumber(b.remaining)}</td>
                      <td className="text-xs text-muted-foreground">{b.vendor}</td>
                      <td><StatusBadge status={b.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="serials">
          <Card className="p-0">
            <table className="erp-table">
              <thead><tr><th>Serial #</th><th>SKU</th><th>Batch</th><th>Status</th><th>Location</th><th>Received</th></tr></thead>
              <tbody>
                {serials.map((s) => (
                  <tr key={s.id}>
                    <td className="font-mono text-xs text-primary">{s.id}</td>
                    <td className="font-mono text-xs">{s.sku}</td>
                    <td className="font-mono text-xs text-muted-foreground">{s.batch}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td>{s.warehouse}</td>
                    <td className="text-xs text-muted-foreground">{formatDate(s.received)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="expiring">
          <Card>
            <CardContent className="p-0">
              {expiring.length === 0 ? (
                <div className="empty-state">
                  <Calendar className="size-8 text-muted-foreground" />
                  <div className="text-sm">No batches expiring within 60 days.</div>
                </div>
              ) : (
                <table className="erp-table">
                  <thead><tr><th>Batch #</th><th>Item</th><th>Warehouse</th><th>Expires</th><th className="text-right">Days left</th><th className="text-right">Qty at risk</th></tr></thead>
                  <tbody>
                    {expiring.map((b) => {
                      const days = Math.ceil((new Date(b.expiry!).getTime() - new Date('2026-05-15').getTime()) / 86400000);
                      return (
                        <tr key={b.id}>
                          <td className="font-mono text-xs text-primary">{b.id}</td>
                          <td className="font-medium">{b.name}</td>
                          <td>{b.warehouse}</td>
                          <td className="text-warning font-medium">{formatDate(b.expiry!)}</td>
                          <td className={cn('text-right font-mono font-medium', days < 14 ? 'text-destructive' : 'text-warning')}>{days}d</td>
                          <td className="text-right font-mono">{formatNumber(b.remaining)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
