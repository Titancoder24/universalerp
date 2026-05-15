import Link from 'next/link';
import {
  ArrowLeft,
  Box,
  Image as ImageIcon,
  Layers,
  Package,
  Save,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function NewItemPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="New item"
        description="Add a product, service, or digital good to the catalog."
        breadcrumbs={[
          { label: 'Inventory', href: '/app/inventory' },
          { label: 'Items', href: '/app/inventory/items' },
          { label: 'New' },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/inventory/items"><ArrowLeft className="size-4" /></Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline">Save draft</Button>
            <Button><Save className="size-4" /> Publish</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic information</CardTitle>
              <CardDescription>Identification and core attributes</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="name">Item name</Label>
                <Input id="name" placeholder="e.g. Industrial Bolts M8 x 40mm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="code">SKU / Code</Label>
                <Input id="code" placeholder="BOLT-M8-40" className="font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="barcode">Barcode / EAN</Label>
                <Input id="barcode" placeholder="8901234567890" className="font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue="goods">
                  <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goods">Goods (physical)</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fasteners">Fasteners</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" rows={3} placeholder="Detailed description, specifications, use cases…" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="uom">Unit of measure</Label>
                <Select defaultValue="pcs">
                  <SelectTrigger id="uom"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="meter">Meter (m)</SelectItem>
                    <SelectItem value="liter">Liter (l)</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" step="0.001" placeholder="0.038" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory settings</CardTitle>
              <CardDescription>Tracking, reorder, and stock control</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="track">Track inventory</Label>
                <div className="flex h-9 items-center gap-2 rounded-lg border border-input bg-background px-3">
                  <Switch defaultChecked />
                  <span className="text-sm text-muted-foreground">Maintain quantity on hand</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="serialized">Serialized / batch tracked</Label>
                <Select defaultValue="none">
                  <SelectTrigger id="serialized"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="batch">Batch / lot</SelectItem>
                    <SelectItem value="serial">Serial number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rop">Reorder point</Label>
                <Input id="rop" type="number" placeholder="500" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="roq">Reorder quantity</Label>
                <Input id="roq" type="number" placeholder="2000" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="safety">Safety stock</Label>
                <Input id="safety" type="number" placeholder="200" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead">Lead time (days)</Label>
                <Input id="lead" type="number" placeholder="14" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Cost and selling prices, taxation</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="cost">Unit cost</Label>
                <Input id="cost" type="number" step="0.01" placeholder="0.42" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">List price</Label>
                <Input id="price" type="number" step="0.01" placeholder="0.95" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="USD">
                  <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tax">Tax category</Label>
                <Select>
                  <SelectTrigger id="tax"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (20%)</SelectItem>
                    <SelectItem value="reduced">Reduced (5%)</SelectItem>
                    <SelectItem value="zero">Zero rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="discount">Max discount %</Label>
                <Input id="discount" type="number" placeholder="15" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="margin">Margin target %</Label>
                <Input id="margin" type="number" placeholder="40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <CardDescription>Different configurations of this item</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <Layers className="mx-auto size-8 text-muted-foreground" />
                <div className="mt-2 text-sm font-medium">No variants yet</div>
                <p className="mt-1 text-xs text-muted-foreground">Variants like size, color, or finish create child SKUs.</p>
                <Button variant="outline" size="sm" className="mt-3">Add variant option</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vendor info</CardTitle>
              <CardDescription>Preferred suppliers and procurement defaults</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="vendor">Preferred vendor</Label>
                <Select>
                  <SelectTrigger id="vendor"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apex">Apex Industrial Supply</SelectItem>
                    <SelectItem value="shenzhen">Shenzhen Tek Hardware</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vsku">Vendor SKU</Label>
                <Input id="vsku" placeholder="APEX-B8-40-ZN" className="font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="moq">MOQ</Label>
                <Input id="moq" type="number" placeholder="500" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vcurrency">Purchase currency</Label>
                <Select defaultValue="USD">
                  <SelectTrigger id="vcurrency"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="CNY">CNY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom fields</CardTitle>
              <CardDescription>Additional metadata for reporting</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="hs">HS Code</Label>
                <Input id="hs" placeholder="7318.15.4200" className="font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="origin">Country of origin</Label>
                <Input id="origin" placeholder="Germany" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input id="manufacturer" placeholder="Bossard AG" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mpn">MPN</Label>
                <Input id="mpn" placeholder="DIN933-M8x40-Z" className="font-mono" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Primary and gallery photos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
                <div className="text-center">
                  <ImageIcon className="mx-auto size-10 text-muted-foreground" />
                  <Button variant="outline" size="sm" className="mt-3"><Upload className="size-4" /> Upload image</Button>
                  <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square rounded-md border border-dashed border-border bg-muted/20" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Sellable</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Purchasable</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Available in POS</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>E-commerce listed</span>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Type and press enter" />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {['hardware', 'fastener', 'din-933', 'm8'].map((t) => (
                  <Badge key={t} variant="soft" size="sm">{t} <X className="size-3" /></Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
