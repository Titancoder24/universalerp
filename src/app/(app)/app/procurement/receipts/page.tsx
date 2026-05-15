import {
  CheckCircle2,
  Download,
  Filter,
  PackageCheck,
  Plus,
  Search,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatCard } from '@/components/ui/stat-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, formatCurrency, formatDate, initials } from '@/lib/utils';

interface Receipt {
  id: string;
  date: string;
  po: string;
  vendor: string;
  warehouse: string;
  itemsExpected: number;
  itemsReceived: number;
  value: number;
  status: 'pending' | 'partial' | 'completed' | 'discrepancy';
  receiver: string;
  carrier: string;
}

const receipts: Receipt[] = [
  { id: 'GR-2099', date: '2026-05-15', po: 'PO-1202', vendor: 'AirGuard Co Ltd', warehouse: 'WH-CHI', itemsExpected: 6, itemsReceived: 6, value: 8400, status: 'completed', receiver: 'Maya Tao', carrier: 'FedEx' },
  { id: 'GR-2098', date: '2026-05-14', po: 'PO-1201', vendor: 'Apex Industrial Supply', warehouse: 'WH-CHI', itemsExpected: 38, itemsReceived: 22, value: 84200, status: 'partial', receiver: 'Maya Tao', carrier: 'XPO Logistics' },
  { id: 'GR-2097', date: '2026-05-14', po: 'PO-1199', vendor: 'CableNet Solutions', warehouse: 'WH-CHI', itemsExpected: 6, itemsReceived: 6, value: 6800, status: 'completed', receiver: 'Maya Tao', carrier: 'UPS' },
  { id: 'GR-2096', date: '2026-05-13', po: 'PO-1197', vendor: 'PowerCells Ltd', warehouse: 'WH-ATL', itemsExpected: 4, itemsReceived: 4, value: 18200, status: 'completed', receiver: 'Priya Khatri', carrier: 'DHL' },
  { id: 'GR-2095', date: '2026-05-13', po: 'PO-1196', vendor: 'ColorMax AG', warehouse: 'WH-ATL', itemsExpected: 4, itemsReceived: 3, value: 9200, status: 'discrepancy', receiver: 'Priya Khatri', carrier: 'DHL' },
  { id: 'GR-2094', date: '2026-05-12', po: 'PO-1200', vendor: 'Petrolab Inc', warehouse: 'WH-PHX', itemsExpected: 4, itemsReceived: 4, value: 12800, status: 'completed', receiver: 'Devon Tasker', carrier: 'Old Dominion' },
  { id: 'GR-2093', date: '2026-05-11', po: 'PO-1198', vendor: 'EuroFasteners GmbH', warehouse: 'WH-CHI', itemsExpected: 18, itemsReceived: 9, value: 38400, status: 'partial', receiver: 'Maya Tao', carrier: 'DSV Air & Sea' },
  { id: 'GR-2092', date: '2026-05-15', po: 'PO-1195', vendor: 'Bossard Industrial AG', warehouse: 'WH-CHI', itemsExpected: 8, itemsReceived: 0, value: 14400, status: 'pending', receiver: '—', carrier: 'Pending' },
  { id: 'GR-2091', date: '2026-05-15', po: 'PO-1194', vendor: 'SealCo GmbH', warehouse: 'WH-DAL', itemsExpected: 12, itemsReceived: 0, value: 6200, status: 'pending', receiver: '—', carrier: 'Pending' },
  { id: 'GR-2090', date: '2026-05-10', po: 'PO-1188', vendor: 'Apex Industrial Supply', warehouse: 'WH-ATL', itemsExpected: 200, itemsReceived: 200, value: 4800, status: 'completed', receiver: 'Priya Khatri', carrier: 'XPO' },
];

export default function ReceiptsPage() {
  const completedCount = receipts.filter((r) => r.status === 'completed').length;
  const pendingCount = receipts.filter((r) => r.status === 'pending').length;
  const partialCount = receipts.filter((r) => r.status === 'partial').length;
  const discrepancyCount = receipts.filter((r) => r.status === 'discrepancy').length;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Goods receipts"
        description="Inbound deliveries from purchase orders"
        breadcrumbs={[
          { label: 'Procurement', href: '/app/procurement' },
          { label: 'Receipts' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New receipt</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Completed today" value={completedCount} format="number" delta={12} />
        <StatCard label="Pending receipt" value={pendingCount} format="number" />
        <StatCard label="Partial deliveries" value={partialCount} format="number" />
        <StatCard label="With discrepancies" value={discrepancyCount} format="number" invertTrend />
      </div>

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative max-w-sm flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="pl-8" placeholder="Search GR #, PO #, vendor…" />
            </div>
            <Select>
              <SelectTrigger className="w-44"><SelectValue placeholder="Warehouse" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All warehouses</SelectItem>
                <SelectItem value="WH-CHI">WH-CHI Chicago</SelectItem>
                <SelectItem value="WH-DAL">WH-DAL Dallas</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="discrepancy">Discrepancy</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="ml-auto"><Filter className="size-4" /> More</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="p-0">
        <table className="erp-table">
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Date</th>
              <th>PO #</th>
              <th>Vendor</th>
              <th>Warehouse</th>
              <th className="text-right">Expected</th>
              <th className="text-right">Received</th>
              <th className="text-right">Value</th>
              <th>Carrier</th>
              <th>Receiver</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((r) => {
              const pct = r.itemsExpected > 0 ? (r.itemsReceived / r.itemsExpected) * 100 : 0;
              return (
                <tr key={r.id}>
                  <td className="font-mono text-xs text-primary">{r.id}</td>
                  <td className="text-xs">{formatDate(r.date)}</td>
                  <td className="font-mono text-xs text-muted-foreground">{r.po}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar size="xs"><AvatarFallback name={r.vendor}>{initials(r.vendor)}</AvatarFallback></Avatar>
                      <span className="truncate font-medium max-w-[180px]">{r.vendor}</span>
                    </div>
                  </td>
                  <td className="font-mono text-xs">{r.warehouse}</td>
                  <td className="text-right font-mono">{r.itemsExpected}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                        <div className={cn('h-full', pct === 100 ? 'bg-success' : 'bg-info')} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="font-mono">{r.itemsReceived}</span>
                    </div>
                  </td>
                  <td className="text-right font-mono">{formatCurrency(r.value)}</td>
                  <td className="text-xs">{r.carrier}</td>
                  <td className="text-xs">{r.receiver === '—' ? <span className="text-muted-foreground">—</span> : r.receiver}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
