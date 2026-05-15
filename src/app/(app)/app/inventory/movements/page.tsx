import {
  ArrowDownLeft,
  ArrowUpRight,
  Boxes,
  Download,
  Filter,
  Move,
  Package,
  PackageOpen,
  RefreshCw,
  Search,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, formatNumber, initials } from '@/lib/utils';

type MovementType = 'receipt' | 'issue' | 'transfer' | 'adjustment' | 'return' | 'scrap';

interface Movement {
  id: string;
  ts: string;
  type: MovementType;
  sku: string;
  name: string;
  qty: number;
  uom: string;
  from: string;
  to: string;
  ref: string;
  user: string;
}

const movements: Movement[] = [
  { id: '1', ts: '14:42', type: 'receipt', sku: 'BOLT-M8-40', name: 'Industrial Bolts M8 x 40mm', qty: 2000, uom: 'pcs', from: 'PO-1184', to: 'WH-CHI / A-12-04-B', ref: 'GR-2098', user: 'Maya Tao' },
  { id: '2', ts: '14:18', type: 'issue', sku: 'OIL-HYD-46', name: 'Hydraulic Oil ISO 46', qty: -2, uom: 'drum', from: 'WH-PHX', to: 'SO-3217', ref: 'PCK-3221', user: 'Jordan Park' },
  { id: '3', ts: '13:55', type: 'transfer', sku: 'CHIP-FPGA-32', name: 'FPGA Dev Chip 32K Logic', qty: 4, uom: 'pcs', from: 'WH-CHI', to: 'WH-EWR', ref: 'TR-512', user: 'Devon Tasker' },
  { id: '4', ts: '13:33', type: 'adjustment', sku: 'GASKET-12', name: 'Rubber Gasket 12mm Series A', qty: -3, uom: 'pcs', from: 'WH-DAL', to: 'Damaged in transit', ref: 'ADJ-024', user: 'Aisha Nakamura' },
  { id: '5', ts: '12:48', type: 'pack', sku: 'BEAR-6204', name: 'Ball Bearing 6204 ZZ', qty: -120, uom: 'pcs', from: 'WH-CHI', to: 'SO-3198', ref: 'PK-2987', user: 'Anna Liu' } as Movement,
  { id: '6', ts: '12:01', type: 'receipt', sku: 'CABLE-CAT6-305', name: 'CAT6 UTP Cable 305m Reel', qty: 24, uom: 'reel', from: 'PO-1191', to: 'WH-CHI / D-04-02-A', ref: 'GR-2099', user: 'Maya Tao' },
  { id: '7', ts: '11:22', type: 'issue', sku: 'PAINT-EPX-RAL5012', name: 'Epoxy Paint RAL5012 Blue', qty: -45, uom: 'liter', from: 'WH-ATL', to: 'WO-7211', ref: 'WI-1124', user: 'Priya Khatri' },
  { id: '8', ts: '10:48', type: 'return', sku: 'CART-HP-58A', name: 'HP Toner Cartridge 58A', qty: 4, uom: 'pcs', from: 'CUST-RET-088', to: 'WH-DAL', ref: 'RR-208', user: 'Carlos Mendoza' },
  { id: '9', ts: '10:03', type: 'issue', sku: 'FILTER-AC-18', name: 'Cabin Air Filter 18mm', qty: -42, uom: 'pcs', from: 'WH-CHI', to: 'SO-3203', ref: 'PCK-3217', user: 'Anna Liu' },
  { id: '10', ts: '09:42', type: 'transfer', sku: 'BOLT-M8-40', name: 'Industrial Bolts M8 x 40mm', qty: 80, uom: 'pcs', from: 'WH-CHI', to: 'WH-PHX', ref: 'TR-513', user: 'Devon Tasker' },
  { id: '11', ts: '09:15', type: 'scrap', sku: 'GLUE-EPX-2K', name: 'Epoxy Glue 2-Component 250ml', qty: -6, uom: 'tube', from: 'WH-MIA', to: 'Expired', ref: 'SC-044', user: 'Diego Salas' },
  { id: '12', ts: '08:50', type: 'receipt', sku: 'WELD-ROD-6013', name: 'Welding Rod 6013 3.2mm', qty: 200, uom: 'kg', from: 'PO-1188', to: 'WH-ATL / D-01-02-A', ref: 'GR-2097', user: 'Priya Khatri' },
];

const typeIcons: Record<string, any> = {
  receipt: PackageOpen,
  issue: ArrowUpRight,
  transfer: Move,
  adjustment: RefreshCw,
  return: ArrowDownLeft,
  scrap: Boxes,
  pack: Package,
};

const typeColors: Record<string, string> = {
  receipt: 'success',
  issue: 'destructive',
  transfer: 'info',
  adjustment: 'warning',
  return: 'soft',
  scrap: 'destructive',
  pack: 'info',
};

export default function MovementsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Stock movements"
        description="Audit-grade ledger of every receipt, issue, transfer, and adjustment."
        breadcrumbs={[
          { label: 'Inventory', href: '/app/inventory' },
          { label: 'Movements' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button variant="outline"><RefreshCw className="size-4" /> Refresh</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Movements today" value={142} format="number" delta={8.2} />
        <StatCard label="Inbound units" value={2284} format="number" delta={12.4} />
        <StatCard label="Outbound units" value={1840} format="number" delta={-2.1} />
        <StatCard label="Adjustments" value={9} format="number" delta={50} invertTrend />
      </div>

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative max-w-sm flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="pl-8" placeholder="Search SKU, reference, user…" />
            </div>
            <Select>
              <SelectTrigger className="w-44"><SelectValue placeholder="All types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="receipt">Receipt</SelectItem>
                <SelectItem value="issue">Issue</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="adjustment">Adjustment</SelectItem>
                <SelectItem value="return">Return</SelectItem>
                <SelectItem value="scrap">Scrap</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-44"><SelectValue placeholder="Warehouse" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All warehouses</SelectItem>
                <SelectItem value="WH-CHI">WH-CHI</SelectItem>
                <SelectItem value="WH-DAL">WH-DAL</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="ml-auto"><Filter className="size-4" /> More filters</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="relative">
            <div className="absolute bottom-0 left-[58px] top-0 w-px bg-border" />
            {movements.map((m, idx) => {
              const Icon = typeIcons[m.type] ?? Package;
              const color = typeColors[m.type] ?? 'soft';
              const positive = m.qty > 0;
              return (
                <div key={m.id} className={cn('relative flex items-start gap-4 p-4 hover:bg-muted/30', idx !== movements.length - 1 && 'border-b border-border')}>
                  <div className="font-mono text-xs text-muted-foreground w-12 pt-2">{m.ts}</div>
                  <div className={cn('relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full ring-4 ring-background',
                    color === 'success' && 'bg-success/15 text-success',
                    color === 'destructive' && 'bg-destructive/15 text-destructive',
                    color === 'info' && 'bg-info/15 text-info',
                    color === 'warning' && 'bg-warning/15 text-warning',
                    color === 'soft' && 'bg-primary/10 text-primary',
                  )}>
                    <Icon className="size-4" />
                  </div>
                  <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                    <Badge variant={color === 'success' ? 'success' : color === 'destructive' ? 'destructive' : color === 'info' ? 'info' : color === 'warning' ? 'warning' : 'soft'} size="sm">
                      {m.type}
                    </Badge>
                    <span className="font-mono text-xs font-medium text-primary">{m.ref}</span>
                    <span className="font-medium">{m.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{m.sku}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      <span className="hidden sm:inline">{m.from} </span>
                      <span className="px-1 text-muted-foreground/60">→</span>
                      <span> {m.to}</span>
                    </span>
                  </div>
                  <div className={cn('font-mono tabular-nums font-semibold text-right w-20', positive ? 'text-success' : 'text-destructive')}>
                    {positive ? '+' : ''}{formatNumber(m.qty)} <span className="text-xs text-muted-foreground font-normal">{m.uom}</span>
                  </div>
                  <div className="flex items-center gap-2 w-32">
                    <Avatar size="xs"><AvatarFallback name={m.user}>{initials(m.user)}</AvatarFallback></Avatar>
                    <span className="truncate text-xs text-muted-foreground">{m.user}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
