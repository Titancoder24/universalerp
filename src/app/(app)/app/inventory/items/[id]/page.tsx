import Link from 'next/link';
import {
  ArrowLeft,
  Barcode,
  Box,
  Calendar,
  Copy,
  DollarSign,
  Download,
  Edit,
  ExternalLink,
  FileText,
  Layers,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Star,
  Truck,
  Warehouse,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/ui/stat-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency, formatDate, formatNumber, initials, colorFromString } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

const variants = [
  { id: 'v1', name: 'Standard - Zinc Coated', sku: 'BOLT-M8-40-ZN', stock: 142, price: 0.95 },
  { id: 'v2', name: 'Stainless Steel A2', sku: 'BOLT-M8-40-A2', stock: 86, price: 1.85 },
  { id: 'v3', name: 'Black Oxide Coated', sku: 'BOLT-M8-40-BO', stock: 0, price: 1.45 },
  { id: 'v4', name: 'Galvanized Heavy Duty', sku: 'BOLT-M8-40-GV', stock: 38, price: 1.25 },
];

const priceLists = [
  { name: 'Standard Retail', currency: 'USD', price: 0.95, margin: 55.8, effective: '2025-01-01' },
  { name: 'Distributor', currency: 'USD', price: 0.68, margin: 38.2, effective: '2025-01-01' },
  { name: 'Volume 1000+', currency: 'USD', price: 0.54, margin: 22.2, effective: '2025-01-01' },
  { name: 'EU Wholesale', currency: 'EUR', price: 0.82, margin: 40.5, effective: '2025-02-15' },
];

const stockPerWarehouse = [
  { warehouse: 'WH-Chicago - Main DC', bin: 'A-12-04-B', onHand: 142, reserved: 4, available: 138 },
  { warehouse: 'WH-Dallas - Regional', bin: 'B-08-02-A', onHand: 0, reserved: 0, available: 0 },
  { warehouse: 'WH-Phoenix - Western', bin: 'C-15-07-D', onHand: 86, reserved: 12, available: 74 },
  { warehouse: 'WH-Atlanta - Eastern', bin: 'A-22-11-C', onHand: 38, reserved: 0, available: 38 },
];

const movements = [
  { date: '2026-05-14', type: 'receipt', qty: 500, ref: 'GR-2098', from: 'PO-1184', to: 'WH-Chicago' },
  { date: '2026-05-12', type: 'issue', qty: -42, ref: 'SO-3217', from: 'WH-Chicago', to: 'Customer' },
  { date: '2026-05-09', type: 'transfer', qty: 80, ref: 'TR-512', from: 'WH-Chicago', to: 'WH-Phoenix' },
  { date: '2026-05-07', type: 'issue', qty: -120, ref: 'SO-3198', from: 'WH-Chicago', to: 'Customer' },
  { date: '2026-05-04', type: 'adjustment', qty: -3, ref: 'ADJ-024', from: 'WH-Chicago', to: 'Damage' },
  { date: '2026-05-02', type: 'receipt', qty: 800, ref: 'GR-2087', from: 'PO-1172', to: 'WH-Chicago' },
];

const vendors = [
  { name: 'Apex Industrial Supply', country: 'USA', leadTime: 14, moq: 500, price: 0.42, preferred: true, rating: 4.6 },
  { name: 'Shenzhen Tek Hardware', country: 'CN', leadTime: 35, moq: 5000, price: 0.18, preferred: true, rating: 4.4 },
  { name: 'EuroFasteners GmbH', country: 'DE', leadTime: 21, moq: 1000, price: 0.38, preferred: false, rating: 4.1 },
];

const documents = [
  { name: 'Datasheet_BOLT-M8-40.pdf', size: '420 KB', date: '2025-09-12' },
  { name: 'Mill_Certificate_Q3.pdf', size: '180 KB', date: '2025-09-04' },
  { name: 'RoHS_Compliance.pdf', size: '88 KB', date: '2025-01-22' },
  { name: 'CAD_Drawing_3D.step', size: '1.2 MB', date: '2024-11-08' },
];

const movementTone: Record<string, 'success' | 'destructive' | 'info' | 'warning'> = {
  receipt: 'success',
  issue: 'destructive',
  transfer: 'info',
  adjustment: 'warning',
};

export default async function ItemDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Industrial Bolts M8 x 40mm"
        description="High-tensile zinc-coated bolts, DIN 933 standard."
        breadcrumbs={[
          { label: 'Inventory', href: '/app/inventory' },
          { label: 'Items', href: '/app/inventory/items' },
          { label: `BOLT-M8-40 #${id}` },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/inventory/items"><ArrowLeft className="size-4" /></Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline" size="sm"><Copy className="size-4" /> Duplicate</Button>
            <Button variant="outline" size="sm"><Download className="size-4" /> Export</Button>
            <Button><Edit className="size-4" /> Edit</Button>
          </>
        }
      />

      <Card>
        <CardContent className="flex flex-wrap items-center gap-6 p-6">
          <div className="flex size-28 items-center justify-center rounded-xl border border-border bg-muted/30" style={{ backgroundColor: `${colorFromString('BOLT-M8-40')}10` }}>
            <Box className="size-12" style={{ color: colorFromString('BOLT-M8-40') }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono text-primary">BOLT-M8-40</span>
              <Barcode className="size-3" />
              <span>EAN 8901234567890</span>
            </div>
            <h2 className="mt-1 text-xl font-semibold">Industrial Bolts M8 x 40mm</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="soft">Fasteners</Badge>
              <Badge variant="outline">Goods · Tracked</Badge>
              <StatusBadge status="active" />
              <span className="text-xs text-muted-foreground">UOM: pcs · Weight 0.038 kg</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard label="On hand" value={266} format="number" />
            <StatCard label="Available" value={250} format="number" />
            <StatCard label="Unit cost" value={0.42} format="currency" />
            <StatCard label="List price" value={0.95} format="currency" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="variants">Variants <Badge variant="soft" size="sm" className="ml-1">{variants.length}</Badge></TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Specifications</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                ['Material', 'Carbon steel grade 8.8'],
                ['Coating', 'Zinc plated, blue passivated'],
                ['Thread', 'M8 x 1.25 standard pitch'],
                ['Length', '40mm under head'],
                ['Head type', 'Hexagonal DIN 933'],
                ['Tensile strength', '800 MPa minimum'],
                ['Drive', '13mm hex socket'],
                ['Standard', 'DIN 933 / ISO 4017'],
                ['Country of origin', 'Germany / India'],
                ['HS Code', '7318.15.4200'],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Reorder rules</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Reorder point</span>
                <span className="font-mono font-medium">500 pcs</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Reorder qty</span>
                <span className="font-mono font-medium">2,000 pcs</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Safety stock</span>
                <span className="font-mono font-medium">200 pcs</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Lead time</span>
                <span className="font-mono font-medium">14 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="warning">Below ROP</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants">
          <Card className="p-0">
            <table className="erp-table">
              <thead>
                <tr><th>Variant</th><th>SKU</th><th className="text-right">Stock</th><th className="text-right">Price</th><th></th></tr>
              </thead>
              <tbody>
                {variants.map((v) => (
                  <tr key={v.id}>
                    <td className="font-medium">{v.name}</td>
                    <td className="font-mono text-xs text-primary">{v.sku}</td>
                    <td className="text-right font-mono tabular-nums">{v.stock}</td>
                    <td className="text-right font-mono">{formatCurrency(v.price)}</td>
                    <td className="text-right"><Button variant="ghost" size="icon-xs"><MoreHorizontal className="size-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card className="p-0">
            <table className="erp-table">
              <thead><tr><th>Price list</th><th>Currency</th><th className="text-right">Price</th><th className="text-right">Margin</th><th>Effective</th></tr></thead>
              <tbody>
                {priceLists.map((p) => (
                  <tr key={p.name}>
                    <td className="font-medium">{p.name}</td>
                    <td className="text-xs">{p.currency}</td>
                    <td className="text-right font-mono">{formatCurrency(p.price, p.currency)}</td>
                    <td className="text-right font-mono text-success">{p.margin.toFixed(1)}%</td>
                    <td className="text-xs text-muted-foreground">{formatDate(p.effective)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="stock">
          <Card className="p-0">
            <table className="erp-table">
              <thead><tr><th>Warehouse</th><th>Bin</th><th className="text-right">On hand</th><th className="text-right">Reserved</th><th className="text-right">Available</th></tr></thead>
              <tbody>
                {stockPerWarehouse.map((s) => (
                  <tr key={s.warehouse}>
                    <td className="font-medium">{s.warehouse}</td>
                    <td className="font-mono text-xs">{s.bin}</td>
                    <td className="text-right font-mono">{formatNumber(s.onHand)}</td>
                    <td className="text-right font-mono text-warning">{s.reserved > 0 ? formatNumber(s.reserved) : '—'}</td>
                    <td className="text-right font-mono font-medium">{formatNumber(s.available)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="movements">
          <Card className="p-0">
            <table className="erp-table">
              <thead><tr><th>Date</th><th>Type</th><th className="text-right">Qty</th><th>Reference</th><th>From</th><th>To</th></tr></thead>
              <tbody>
                {movements.map((m, i) => (
                  <tr key={i}>
                    <td className="text-xs text-muted-foreground">{formatDate(m.date)}</td>
                    <td><Badge variant={movementTone[m.type] === 'success' ? 'success' : movementTone[m.type] === 'destructive' ? 'destructive' : movementTone[m.type] === 'info' ? 'info' : 'warning'} size="sm">{m.type}</Badge></td>
                    <td className={`text-right font-mono tabular-nums font-medium ${m.qty > 0 ? 'text-success' : 'text-destructive'}`}>{m.qty > 0 ? '+' : ''}{m.qty}</td>
                    <td className="font-mono text-xs text-primary">{m.ref}</td>
                    <td>{m.from}</td>
                    <td>{m.to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="vendors">
          <Card className="p-0">
            <table className="erp-table">
              <thead><tr><th>Vendor</th><th>Country</th><th className="text-right">Lead time</th><th className="text-right">MOQ</th><th className="text-right">Unit price</th><th>Rating</th><th></th></tr></thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.name}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar size="xs"><AvatarFallback name={v.name}>{initials(v.name)}</AvatarFallback></Avatar>
                        <span className="font-medium">{v.name}</span>
                        {v.preferred && <Badge variant="soft" size="sm">Preferred</Badge>}
                      </div>
                    </td>
                    <td className="text-xs">{v.country}</td>
                    <td className="text-right">{v.leadTime}d</td>
                    <td className="text-right font-mono">{formatNumber(v.moq)}</td>
                    <td className="text-right font-mono">{formatCurrency(v.price)}</td>
                    <td><div className="flex items-center gap-1"><Star className="size-3 fill-warning text-warning" />{v.rating}</div></td>
                    <td className="text-right"><Button variant="ghost" size="xs"><ExternalLink className="size-3" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="grid gap-3 p-6 md:grid-cols-2">
              {documents.map((d) => (
                <div key={d.name} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary"><FileText className="size-5" /></div>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{d.name}</div>
                      <div className="text-xs text-muted-foreground">{d.size} · {formatDate(d.date)}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon-sm"><Download className="size-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
