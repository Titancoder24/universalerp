'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Archive,
  Boxes,
  Camera,
  ChevronLeft,
  Image as ImageIcon,
  Layers,
  Package,
  Plus,
  Save,
  Tag,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatCurrency } from '@/lib/utils';

const item = {
  id: 'ITM-04471',
  sku: 'WID-3000-BLK',
  name: 'Widget Pro 3000 - Black',
  category: 'Hardware / Widgets',
  status: 'active',
  uom: 'each',
  weight: 0.42,
  price: 89.99,
  cost: 31.20,
  reorderPoint: 250,
};

const variants = [
  { sku: 'WID-3000-BLK', label: 'Black', stock: 1245, price: 89.99 },
  { sku: 'WID-3000-WHT', label: 'White', stock: 820, price: 89.99 },
  { sku: 'WID-3000-RED', label: 'Red', stock: 156, price: 94.99 },
  { sku: 'WID-3000-BLU', label: 'Blue', stock: 478, price: 89.99 },
];

const warehouses = [
  { name: 'San Francisco - HQ', code: 'SF-01', onHand: 540, available: 480, reserved: 60 },
  { name: 'Reno - Distribution', code: 'RNO-02', onHand: 1240, available: 1240, reserved: 0 },
  { name: 'Atlanta - Southeast', code: 'ATL-03', onHand: 780, available: 720, reserved: 60 },
];

export default function EditItemPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title={<div className="flex items-center gap-2"><span>Edit item</span><StatusBadge status={item.status} /></div>}
        description={`${item.name} - ${item.sku}`}
        breadcrumbs={[{ label: 'Inventory', href: '/app/inventory' }, { label: 'Items', href: '/app/inventory/items' }, { label: item.sku, href: `/app/inventory/items/${item.id}` }, { label: 'Edit' }]}
        back={<Button variant="ghost" size="icon-sm" asChild><Link href={`/app/inventory/items/${item.id}`}><ChevronLeft className="size-4" /></Link></Button>}
        actions={
          <>
            <Button variant="outline" size="sm" asChild><Link href={`/app/inventory/items/${item.id}`}><X className="size-4" /> Discard</Link></Button>
            <Button variant="outline" size="sm"><Archive className="size-4" /> Archive</Button>
            <Button size="sm"><Save className="size-4" /> Save changes</Button>
          </>
        }
      />

      <div className="p-6">
        <Tabs defaultValue="general">
          <TabsList variant="pills">
            <TabsTrigger value="general" variant="pills"><Package className="size-4" /> General</TabsTrigger>
            <TabsTrigger value="pricing" variant="pills"><Tag className="size-4" /> Pricing & Costs</TabsTrigger>
            <TabsTrigger value="inventory" variant="pills"><Boxes className="size-4" /> Inventory</TabsTrigger>
            <TabsTrigger value="variants" variant="pills"><Layers className="size-4" /> Variants</TabsTrigger>
            <TabsTrigger value="media" variant="pills"><ImageIcon className="size-4" /> Media</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader><CardTitle>Basic information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5 md:col-span-2"><Label required>Item name</Label><Input defaultValue={item.name} /></div>
                  <div className="space-y-1.5"><Label required>SKU</Label><Input defaultValue={item.sku} className="font-mono" /></div>
                  <div className="space-y-1.5"><Label>Barcode (UPC/EAN)</Label><Input defaultValue="0085671230412" className="font-mono" /></div>
                  <div className="space-y-1.5"><Label>Category</Label><Select defaultValue="widgets"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="widgets">Hardware / Widgets</SelectItem><SelectItem value="electronics">Electronics</SelectItem><SelectItem value="accessories">Accessories</SelectItem></SelectContent></Select></div>
                  <div className="space-y-1.5"><Label>Brand</Label><Input defaultValue="UniversalCorp" /></div>
                  <div className="space-y-1.5"><Label>Unit of measure</Label><Select defaultValue="each"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="each">Each</SelectItem><SelectItem value="kg">Kilogram</SelectItem><SelectItem value="case">Case</SelectItem><SelectItem value="pallet">Pallet</SelectItem></SelectContent></Select></div>
                  <div className="space-y-1.5"><Label>Weight (kg)</Label><Input type="number" step="0.01" defaultValue={item.weight} /></div>
                  <div className="space-y-1.5 md:col-span-2"><Label>Description</Label><Textarea defaultValue="Industrial-grade widget designed for high-throughput manufacturing applications. CE/UL certified, 5-year warranty." minRows={3} /></div>
                  <div className="space-y-1.5 md:col-span-2"><Label>Tags</Label><Input defaultValue="bestseller, ce-certified, ul-listed, manufacturing" /></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Item flags</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: 'Track inventory', desc: 'Auto-decrement on sale' },
                    { label: 'Track serial numbers', desc: 'Per-unit tracking' },
                    { label: 'Track lot/batch', desc: 'Group-level tracking' },
                    { label: 'Sellable', desc: 'Available for sale' },
                    { label: 'Purchasable', desc: 'Can be ordered from vendors' },
                    { label: 'Drop-ship eligible', desc: 'Vendor ships direct' },
                  ].map((f, i) => (
                    <div key={f.label} className="flex items-center justify-between">
                      <div><p className="text-sm font-medium">{f.label}</p><p className="text-xs text-muted-foreground">{f.desc}</p></div>
                      <Switch defaultChecked={i !== 1} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader><CardTitle>Pricing & costs</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1.5"><Label required>List price</Label><Input type="number" step="0.01" defaultValue={item.price} className="font-mono" /></div>
                <div className="space-y-1.5"><Label>Wholesale price</Label><Input type="number" step="0.01" defaultValue={64.99} className="font-mono" /></div>
                <div className="space-y-1.5"><Label>MSRP</Label><Input type="number" step="0.01" defaultValue={109.99} className="font-mono" /></div>
                <div className="space-y-1.5"><Label required>Standard cost</Label><Input type="number" step="0.01" defaultValue={item.cost} className="font-mono" /></div>
                <div className="space-y-1.5"><Label>Average cost</Label><Input type="number" step="0.01" defaultValue={30.85} readOnly className="font-mono bg-muted/30" /></div>
                <div className="space-y-1.5"><Label>Last PO cost</Label><Input type="number" step="0.01" defaultValue={29.40} readOnly className="font-mono bg-muted/30" /></div>
                <div className="space-y-1.5 md:col-span-3">
                  <div className="rounded-md border border-success/30 bg-success/5 p-3 text-xs"><p className="font-medium text-success">Margin: 65.3%</p><p className="mt-1 text-muted-foreground">Based on list price - standard cost. Healthy margin vs. category average (42%).</p></div>
                </div>
                <div className="space-y-1.5"><Label>Tax code</Label><Select defaultValue="us-tax"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="us-tax">US Sales Tax (standard)</SelectItem><SelectItem value="exempt">Tax exempt</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Revenue GL</Label><Input defaultValue="4001 - Product Revenue" /></div>
                <div className="space-y-1.5"><Label>COGS GL</Label><Input defaultValue="5001 - Cost of Goods Sold" /></div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle>Stock policy</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-1.5"><Label>Reorder point</Label><Input type="number" defaultValue={item.reorderPoint} /></div>
                  <div className="space-y-1.5"><Label>Reorder quantity</Label><Input type="number" defaultValue={500} /></div>
                  <div className="space-y-1.5"><Label>Safety stock</Label><Input type="number" defaultValue={100} /></div>
                  <div className="space-y-1.5"><Label>Lead time (days)</Label><Input type="number" defaultValue={14} /></div>
                  <div className="space-y-1.5"><Label>Stocking method</Label><Select defaultValue="fifo"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="fifo">FIFO</SelectItem><SelectItem value="lifo">LIFO</SelectItem><SelectItem value="avg">Weighted average</SelectItem></SelectContent></Select></div>
                  <div className="space-y-1.5"><Label>Primary vendor</Label><Input defaultValue="Northland Components Ltd." /></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Warehouse stock</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <table className="erp-table">
                    <thead><tr><th>Warehouse</th><th className="text-right">On hand</th><th className="text-right">Available</th><th className="text-right">Reserved</th></tr></thead>
                    <tbody>{warehouses.map((w) => (<tr key={w.code}><td><p className="font-medium">{w.name}</p><p className="font-mono text-xs text-muted-foreground">{w.code}</p></td><td className="text-right font-mono tabular-nums">{w.onHand}</td><td className="text-right font-mono tabular-nums text-success">{w.available}</td><td className="text-right font-mono tabular-nums">{w.reserved}</td></tr>))}</tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="variants">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Variants</CardTitle><Button variant="outline" size="sm"><Plus className="size-4" /> Add variant</Button></CardHeader>
              <CardContent className="p-0">
                <table className="erp-table">
                  <thead><tr><th>SKU</th><th>Variant</th><th className="text-right">Stock</th><th className="text-right">Price</th><th></th></tr></thead>
                  <tbody>{variants.map((v) => (<tr key={v.sku}><td className="font-mono text-xs text-primary">{v.sku}</td><td><Badge variant="outline">{v.label}</Badge></td><td className="text-right font-mono tabular-nums">{v.stock}</td><td className="text-right font-mono tabular-nums">{formatCurrency(v.price)}</td><td><Button variant="ghost" size="icon-sm"><Trash2 className="size-3.5" /></Button></td></tr>))}</tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardHeader><CardTitle>Product images</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="aspect-square rounded-md border border-border bg-muted/40 flex items-center justify-center">
                      <Camera className="size-8 text-muted-foreground/40" />
                    </div>
                  ))}
                  <button className="aspect-square rounded-md border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:bg-accent/20">
                    <Upload className="size-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Upload</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
