import Link from 'next/link';
import {
  ArrowDownToLine,
  Box,
  Download,
  Filter,
  Image as ImageIcon,
  Layers,
  Plus,
  Search,
  Upload,
} from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency, formatNumber, initials, colorFromString } from '@/lib/utils';

type ItemType = 'goods' | 'service' | 'digital';
type StockLevel = 'low' | 'normal' | 'over';
type Status = 'active' | 'draft' | 'inactive';

interface Item {
  id: string;
  code: string;
  name: string;
  category: string;
  uom: string;
  onHand: number;
  available: number;
  cost: number;
  price: number;
  status: Status;
  type: ItemType;
  level: StockLevel;
}

const items: Item[] = [
  { id: '1', code: 'BOLT-M8-40', name: 'Industrial Bolts M8 x 40mm', category: 'Fasteners', uom: 'pcs', onHand: 142, available: 138, cost: 0.42, price: 0.95, status: 'active', type: 'goods', level: 'low' },
  { id: '2', code: 'SW-LIC-PREM', name: 'Software License - Premium', category: 'Digital', uom: 'license', onHand: 9999, available: 9712, cost: 0, price: 1200, status: 'active', type: 'digital', level: 'normal' },
  { id: '3', code: 'CONS-INSTALL', name: 'On-site Installation Service', category: 'Services', uom: 'hour', onHand: 0, available: 0, cost: 65, price: 145, status: 'active', type: 'service', level: 'normal' },
  { id: '4', code: 'GASKET-12', name: 'Rubber Gasket 12mm Series A', category: 'Seals', uom: 'pcs', onHand: 28, available: 22, cost: 1.85, price: 4.20, status: 'active', type: 'goods', level: 'low' },
  { id: '5', code: 'OIL-HYD-46', name: 'Hydraulic Oil ISO 46', category: 'Lubricants', uom: 'drum', onHand: 4, available: 4, cost: 240, price: 480, status: 'active', type: 'goods', level: 'low' },
  { id: '6', code: 'FILTER-AC-18', name: 'Cabin Air Filter 18mm', category: 'Filtration', uom: 'pcs', onHand: 67, available: 61, cost: 6.40, price: 18.50, status: 'active', type: 'goods', level: 'low' },
  { id: '7', code: 'WELD-ROD-6013', name: 'Welding Rod 6013 3.2mm', category: 'Welding', uom: 'kg', onHand: 12, available: 12, cost: 5.20, price: 12.40, status: 'active', type: 'goods', level: 'low' },
  { id: '8', code: 'CHIP-FPGA-32', name: 'FPGA Dev Chip 32K Logic', category: 'Electronics', uom: 'pcs', onHand: 8, available: 7, cost: 4150, price: 6800, status: 'active', type: 'goods', level: 'normal' },
  { id: '9', code: 'BEAR-6204', name: 'Ball Bearing 6204 ZZ', category: 'Bearings', uom: 'pcs', onHand: 482, available: 451, cost: 3.80, price: 9.40, status: 'active', type: 'goods', level: 'normal' },
  { id: '10', code: 'PAINT-EPX-RAL5012', name: 'Epoxy Paint RAL5012 Blue', category: 'Coatings', uom: 'liter', onHand: 184, available: 178, cost: 14.20, price: 32.80, status: 'active', type: 'goods', level: 'normal' },
  { id: '11', code: 'COIL-S400', name: 'Solenoid Coil S400 24V', category: 'Electronics', uom: 'pcs', onHand: 38, available: 38, cost: 26.50, price: 64.00, status: 'active', type: 'goods', level: 'normal' },
  { id: '12', code: 'PIPE-PVC-110', name: 'PVC Pipe Schedule 80 110mm', category: 'Piping', uom: 'meter', onHand: 1280, available: 1230, cost: 4.80, price: 11.20, status: 'active', type: 'goods', level: 'normal' },
  { id: '13', code: 'CART-HP-58A', name: 'HP Toner Cartridge 58A', category: 'Office', uom: 'pcs', onHand: 248, available: 232, cost: 78, price: 142, status: 'active', type: 'goods', level: 'over' },
  { id: '14', code: 'CABLE-CAT6-305', name: 'CAT6 UTP Cable 305m Reel', category: 'Cabling', uom: 'reel', onHand: 62, available: 58, cost: 124, price: 280, status: 'active', type: 'goods', level: 'normal' },
  { id: '15', code: 'SVC-AUDIT-QTR', name: 'Quarterly Compliance Audit', category: 'Services', uom: 'service', onHand: 0, available: 0, cost: 1200, price: 2800, status: 'active', type: 'service', level: 'normal' },
  { id: '16', code: 'TOOL-DRILL-18V', name: 'Cordless Drill 18V Pro', category: 'Tools', uom: 'pcs', onHand: 24, available: 18, cost: 142, price: 320, status: 'active', type: 'goods', level: 'normal' },
  { id: '17', code: 'SAFE-HELM-Y', name: 'Safety Helmet Yellow ANSI', category: 'PPE', uom: 'pcs', onHand: 412, available: 398, cost: 12.40, price: 28.80, status: 'active', type: 'goods', level: 'over' },
  { id: '18', code: 'SW-LIC-ENT', name: 'Software License - Enterprise', category: 'Digital', uom: 'license', onHand: 9999, available: 9988, cost: 0, price: 4800, status: 'active', type: 'digital', level: 'normal' },
  { id: '19', code: 'BOX-CORR-L', name: 'Corrugated Box Large 600x400x400', category: 'Packaging', uom: 'pcs', onHand: 2840, available: 2810, cost: 1.20, price: 2.80, status: 'active', type: 'goods', level: 'over' },
  { id: '20', code: 'GLUE-EPX-2K', name: 'Epoxy Glue 2-Component 250ml', category: 'Adhesives', uom: 'tube', onHand: 124, available: 118, cost: 6.80, price: 15.40, status: 'active', type: 'goods', level: 'normal' },
  { id: '21', code: 'SENSOR-IR-50', name: 'IR Proximity Sensor 50cm', category: 'Electronics', uom: 'pcs', onHand: 0, available: 0, cost: 18.40, price: 42.80, status: 'draft', type: 'goods', level: 'normal' },
  { id: '22', code: 'BATT-LIPO-3S', name: 'LiPo Battery 3S 5000mAh', category: 'Power', uom: 'pcs', onHand: 78, available: 71, cost: 38, price: 89, status: 'active', type: 'goods', level: 'normal' },
];

const levelTone: Record<StockLevel, 'destructive' | 'success' | 'warning'> = {
  low: 'destructive',
  normal: 'success',
  over: 'warning',
};

const typeBadge: Record<ItemType, { variant: 'soft' | 'outline' | 'secondary'; label: string }> = {
  goods: { variant: 'soft', label: 'Goods' },
  service: { variant: 'outline', label: 'Service' },
  digital: { variant: 'secondary', label: 'Digital' },
};

export default function ItemsListPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Items"
        description={`${items.length} catalog items across goods, services, and digital products.`}
        breadcrumbs={[
          { label: 'Inventory', href: '/app/inventory' },
          { label: 'Items' },
        ]}
        actions={
          <>
            <Button variant="outline"><Upload className="size-4" /> Import</Button>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button asChild>
              <Link href="/app/inventory/items/new"><Plus className="size-4" /> New item</Link>
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative max-w-sm flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="pl-8" placeholder="Search by code, name, category…" />
            </div>
            <Select>
              <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="Fasteners">Fasteners</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Tools">Tools</SelectItem>
                <SelectItem value="Packaging">Packaging</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-36"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="goods">Goods</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="digital">Digital</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-36"><SelectValue placeholder="Stock level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="over">Over</SelectItem>
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
              <th>Image</th>
              <th>Code</th>
              <th>Name</th>
              <th>Category</th>
              <th>UOM</th>
              <th className="text-right">On hand</th>
              <th className="text-right">Available</th>
              <th className="text-right">Cost</th>
              <th className="text-right">Price</th>
              <th>Status</th>
              <th>Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>
                  <div
                    className="flex size-9 items-center justify-center rounded-md border border-border"
                    style={{ backgroundColor: `${colorFromString(it.code)}15` }}
                  >
                    <Box className="size-4" style={{ color: colorFromString(it.code) }} />
                  </div>
                </td>
                <td className="font-mono text-xs font-medium text-primary">
                  <Link href={`/app/inventory/items/${it.id}`} className="hover:underline">{it.code}</Link>
                </td>
                <td className="font-medium">{it.name}</td>
                <td className="text-muted-foreground">{it.category}</td>
                <td className="text-xs text-muted-foreground">{it.uom}</td>
                <td className="text-right font-mono tabular-nums">{formatNumber(it.onHand)}</td>
                <td className="text-right font-mono tabular-nums">
                  <span className={it.available < it.onHand ? 'text-warning' : ''}>{formatNumber(it.available)}</span>
                </td>
                <td className="text-right font-mono text-xs text-muted-foreground">{formatCurrency(it.cost)}</td>
                <td className="text-right font-mono tabular-nums font-medium">{formatCurrency(it.price)}</td>
                <td><StatusBadge status={it.status} /></td>
                <td>
                  <Badge variant={typeBadge[it.type].variant} size="sm">{typeBadge[it.type].label}</Badge>
                </td>
                <td>
                  <Badge variant={levelTone[it.level] === 'destructive' ? 'destructive' : levelTone[it.level] === 'warning' ? 'warning' : 'success'} size="sm">
                    {it.level}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
