import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  Clock,
  Download,
  Filter,
  Plus,
  Search,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

interface PO {
  id: string;
  date: string;
  vendor: string;
  vendorCode: string;
  description: string;
  lines: number;
  total: number;
  receivedPct: number;
  billedPct: number;
  expectedDate: string;
  status: 'draft' | 'sent' | 'partial' | 'completed' | 'cancelled';
  buyer: string;
}

const pos: PO[] = [
  { id: 'PO-1204', date: '2026-05-14', vendor: 'Apex Industrial Supply', vendorCode: 'APX-001', description: 'M8/M10 bolt restock', lines: 12, total: 24800, receivedPct: 0, billedPct: 0, expectedDate: '2026-05-28', status: 'sent', buyer: 'Sara Kim' },
  { id: 'PO-1203', date: '2026-05-13', vendor: 'Shenzhen Tek Hardware', vendorCode: 'SZT-014', description: 'FPGA chips & sensors', lines: 8, total: 84200, receivedPct: 0, billedPct: 0, expectedDate: '2026-06-18', status: 'sent', buyer: 'Ravi Sharma' },
  { id: 'PO-1202', date: '2026-05-12', vendor: 'AirGuard Co Ltd', vendorCode: 'AGD-008', description: 'Cabin air filters Q2', lines: 6, total: 8400, receivedPct: 100, billedPct: 0, expectedDate: '2026-05-20', status: 'partial', buyer: 'Hugo Park' },
  { id: 'PO-1201', date: '2026-05-12', vendor: 'Apex Industrial Supply', vendorCode: 'APX-001', description: 'Q3 fastener call-off', lines: 38, total: 142000, receivedPct: 60, billedPct: 30, expectedDate: '2026-05-26', status: 'partial', buyer: 'Sara Kim' },
  { id: 'PO-1200', date: '2026-05-11', vendor: 'Petrolab Inc', vendorCode: 'PTL-019', description: 'Hydraulic oil restock', lines: 4, total: 12800, receivedPct: 100, billedPct: 100, expectedDate: '2026-05-18', status: 'completed', buyer: 'Hugo Park' },
  { id: 'PO-1199', date: '2026-05-10', vendor: 'CableNet Solutions', vendorCode: 'CBN-029', description: 'CAT6 cable reels', lines: 6, total: 6800, receivedPct: 100, billedPct: 100, expectedDate: '2026-05-17', status: 'completed', buyer: 'Ravi Sharma' },
  { id: 'PO-1198', date: '2026-05-08', vendor: 'EuroFasteners GmbH', vendorCode: 'EUF-022', description: 'Stainless fastener kit', lines: 18, total: 38400, receivedPct: 50, billedPct: 50, expectedDate: '2026-05-29', status: 'partial', buyer: 'Sara Kim' },
  { id: 'PO-1197', date: '2026-05-08', vendor: 'PowerCells Ltd', vendorCode: 'PWC-017', description: 'LiPo battery pack', lines: 4, total: 18200, receivedPct: 100, billedPct: 100, expectedDate: '2026-05-22', status: 'completed', buyer: 'Lina Wang' },
  { id: 'PO-1196', date: '2026-05-07', vendor: 'ColorMax AG', vendorCode: 'CMX-002', description: 'Epoxy paint RAL', lines: 4, total: 9200, receivedPct: 100, billedPct: 100, expectedDate: '2026-05-21', status: 'completed', buyer: 'Lina Wang' },
  { id: 'PO-1195', date: '2026-05-06', vendor: 'Bossard Industrial AG', vendorCode: 'BSI-007', description: 'Specialty hex bolts', lines: 8, total: 14400, receivedPct: 0, billedPct: 0, expectedDate: '2026-05-25', status: 'sent', buyer: 'Sara Kim' },
  { id: 'PO-1194', date: '2026-05-05', vendor: 'SealCo GmbH', vendorCode: 'SLC-011', description: 'Gasket replacement set', lines: 12, total: 6200, receivedPct: 0, billedPct: 0, expectedDate: '2026-05-24', status: 'sent', buyer: 'Hugo Park' },
  { id: 'PO-1193', date: '2026-05-04', vendor: 'ElectroMag Industries', vendorCode: 'EMI-005', description: 'Solenoid coils', lines: 4, total: 4800, receivedPct: 0, billedPct: 0, expectedDate: '2026-05-22', status: 'draft', buyer: 'Sara Kim' },
];

const pipeline = [
  { stage: 'Draft', count: pos.filter((p) => p.status === 'draft').length, color: 'hsl(var(--muted-foreground))' },
  { stage: 'Sent', count: pos.filter((p) => p.status === 'sent').length, color: 'hsl(var(--info))' },
  { stage: 'Partial receipt', count: pos.filter((p) => p.status === 'partial').length, color: 'hsl(var(--warning))' },
  { stage: 'Completed', count: pos.filter((p) => p.status === 'completed').length, color: 'hsl(var(--success))' },
];

export default function PurchaseOrdersPage() {
  const totalValue = pos.reduce((a, p) => a + p.total, 0);
  const committedValue = pos.filter((p) => p.status !== 'completed' && p.status !== 'cancelled').reduce((a, p) => a + p.total, 0);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Purchase orders"
        description={`${pos.length} POs · ${formatCurrency(totalValue)} total value · ${formatCurrency(committedValue)} committed`}
        breadcrumbs={[
          { label: 'Procurement', href: '/app/procurement' },
          { label: 'Orders' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New PO</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open POs" value={pos.filter((p) => p.status !== 'completed' && p.status !== 'cancelled').length} format="number" delta={6} />
        <StatCard label="Committed spend" value={committedValue} format="currency" delta={12.4} />
        <StatCard label="Avg cycle time" value={9.4} deltaLabel="days" />
        <StatCard label="On-time receipts" value={92.4} format="percent" delta={1.2} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline</CardTitle>
          <CardDescription>Status distribution by count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {pipeline.map((p, i) => (
              <div key={p.stage} className="relative">
                <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                  <div className="size-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <div>
                    <div className="text-2xl font-semibold tabular-nums">{p.count}</div>
                    <div className="text-xs text-muted-foreground">{p.stage}</div>
                  </div>
                </div>
                {i < pipeline.length - 1 && <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground/50">→</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative max-w-sm flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="pl-8" placeholder="Search PO #, vendor…" />
            </div>
            <Select>
              <SelectTrigger className="w-44"><SelectValue placeholder="All vendors" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All vendors</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="ml-auto"><Filter className="size-4" /> More filters</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="p-0">
        <table className="erp-table">
          <thead>
            <tr>
              <th>PO #</th>
              <th>Date</th>
              <th>Vendor</th>
              <th>Description</th>
              <th className="text-right">Lines</th>
              <th className="text-right">Total</th>
              <th>Received</th>
              <th>Billed</th>
              <th>Expected</th>
              <th>Buyer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pos.map((p) => (
              <tr key={p.id}>
                <td className="font-mono text-xs text-primary">
                  <Link href={`/app/procurement/orders/${p.id}`} className="hover:underline">{p.id}</Link>
                </td>
                <td className="text-xs text-muted-foreground">{formatDate(p.date)}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <Avatar size="xs"><AvatarFallback name={p.vendor}>{initials(p.vendor)}</AvatarFallback></Avatar>
                    <span className="truncate font-medium max-w-[180px]">{p.vendor}</span>
                  </div>
                </td>
                <td className="text-sm">{p.description}</td>
                <td className="text-right font-mono">{p.lines}</td>
                <td className="text-right font-mono font-medium">{formatCurrency(p.total)}</td>
                <td>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-info" style={{ width: `${p.receivedPct}%` }} />
                    </div>
                    <span className="text-muted-foreground">{p.receivedPct}%</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-success" style={{ width: `${p.billedPct}%` }} />
                    </div>
                    <span className="text-muted-foreground">{p.billedPct}%</span>
                  </div>
                </td>
                <td className="text-xs">{formatDate(p.expectedDate)}</td>
                <td className="text-xs text-muted-foreground">{p.buyer}</td>
                <td><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
