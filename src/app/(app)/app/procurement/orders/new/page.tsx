'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Building2,
  ChevronLeft,
  FileText,
  Plus,
  Save,
  Search,
  Send,
  Sparkles,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, initials } from '@/lib/utils';

const vendors = [
  { id: 'v1', code: 'VEN-101', name: 'Northland Components Ltd.', email: 'orders@northland.com', terms: 'Net 30' },
  { id: 'v2', code: 'VEN-208', name: 'Pacific Plastics Co.', email: 'sales@pacplastics.com', terms: 'Net 45' },
  { id: 'v3', code: 'VEN-319', name: 'Bayside Industrial Supply', email: 'po@baysideind.com', terms: 'Net 30' },
  { id: 'v4', code: 'VEN-447', name: 'Continental Steel Works', email: 'orders@contsteel.com', terms: 'Net 60' },
];

interface PoLine {
  id: string;
  sku: string;
  description: string;
  qty: number;
  uom: string;
  price: number;
  taxRate: number;
}

export default function NewPurchaseOrderPage() {
  const [vendor, setVendor] = React.useState(vendors[0]);
  const [vendOpen, setVendOpen] = React.useState(false);
  const [shipping, setShipping] = React.useState(125);
  const [lines, setLines] = React.useState<PoLine[]>([
    { id: '1', sku: 'COMP-201', description: 'Aluminum frame, 250mm', qty: 500, uom: 'each', price: 14.25, taxRate: 8.25 },
    { id: '2', sku: 'COMP-318', description: 'Bearing assembly, ball type', qty: 2000, uom: 'each', price: 3.40, taxRate: 8.25 },
    { id: '3', sku: 'COMP-507', description: 'Control board v2 (PCB only)', qty: 350, uom: 'each', price: 42.80, taxRate: 8.25 },
  ]);

  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const tax = lines.reduce((s, l) => s + l.qty * l.price * (l.taxRate / 100), 0);
  const total = subtotal + tax + shipping;

  const update = (id: string, patch: Partial<PoLine>) => setLines((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const remove = (id: string) => setLines((p) => p.filter((l) => l.id !== id));
  const add = () => setLines((p) => [...p, { id: String(Date.now()), sku: '', description: '', qty: 1, uom: 'each', price: 0, taxRate: 8.25 }]);

  return (
    <div className="flex flex-col">
      <PageHeader
        title="New purchase order"
        breadcrumbs={[{ label: 'Procurement', href: '/app/procurement' }, { label: 'Orders', href: '/app/procurement/orders' }, { label: 'New' }]}
        back={<Button variant="ghost" size="icon-sm" asChild><Link href="/app/procurement/orders"><ChevronLeft className="size-4" /></Link></Button>}
        actions={
          <>
            <Button variant="outline" size="sm" asChild><Link href="/app/procurement/orders"><X className="size-4" /> Cancel</Link></Button>
            <Button variant="outline" size="sm"><Sparkles className="size-4" /> AI suggest</Button>
            <Button variant="outline" size="sm"><Save className="size-4" /> Save draft</Button>
            <Button size="sm"><Send className="size-4" /> Send to vendor</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Vendor & header</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2"><Label required>Vendor</Label>
                <Popover open={vendOpen} onOpenChange={setVendOpen}>
                  <PopoverTrigger asChild>
                    <button type="button" className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm shadow-xs hover:bg-accent/30">
                      <div className="flex items-center gap-2"><Avatar size="xs"><AvatarFallback>{initials(vendor.name)}</AvatarFallback></Avatar><div className="text-left"><p className="font-medium">{vendor.name}</p><p className="font-mono text-xs text-muted-foreground">{vendor.code}</p></div></div>
                      <Search className="size-4 opacity-60" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[420px] p-0">
                    <div className="border-b p-2"><Input placeholder="Search vendors…" className="h-8" /></div>
                    <div className="max-h-72 overflow-y-auto p-1">
                      {vendors.map((v) => (
                        <button key={v.id} onClick={() => { setVendor(v); setVendOpen(false); }} className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm hover:bg-accent">
                          <Avatar size="xs"><AvatarFallback>{initials(v.name)}</AvatarFallback></Avatar>
                          <div><p className="font-medium">{v.name}</p><p className="text-xs text-muted-foreground">{v.email}</p></div>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5"><Label>PO number</Label><Input value="PO-9217" readOnly className="font-mono" /></div>
              <div className="space-y-1.5"><Label required>Order date</Label><Input type="date" defaultValue="2026-05-15" /></div>
              <div className="space-y-1.5"><Label required>Expected delivery</Label><Input type="date" defaultValue="2026-05-29" /></div>
              <div className="space-y-1.5"><Label>Payment terms</Label><Select defaultValue={vendor.terms}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Net 15">Net 15</SelectItem><SelectItem value="Net 30">Net 30</SelectItem><SelectItem value="Net 45">Net 45</SelectItem><SelectItem value="Net 60">Net 60</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Ship-to warehouse</Label><Select defaultValue="rno"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sf">SF-01 - HQ</SelectItem><SelectItem value="rno">RNO-02 - Reno</SelectItem><SelectItem value="atl">ATL-03 - Atlanta</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Cost center</Label><Select defaultValue="cc-mfg"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cc-mfg">CC-MFG - Manufacturing</SelectItem><SelectItem value="cc-it">CC-IT - IT</SelectItem><SelectItem value="cc-ops">CC-OPS - Operations</SelectItem></SelectContent></Select></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Line items</CardTitle><Button variant="outline" size="sm" onClick={add}><Plus className="size-4" /> Add line</Button></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/20">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-muted-foreground">SKU / Description</th>
                      <th className="px-3 py-2 text-right text-xs uppercase tracking-wide text-muted-foreground w-20">Qty</th>
                      <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-muted-foreground w-20">UoM</th>
                      <th className="px-3 py-2 text-right text-xs uppercase tracking-wide text-muted-foreground w-28">Unit price</th>
                      <th className="px-3 py-2 text-right text-xs uppercase tracking-wide text-muted-foreground w-20">Tax %</th>
                      <th className="px-3 py-2 text-right text-xs uppercase tracking-wide text-muted-foreground w-28">Total</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((l) => (
                      <tr key={l.id} className="border-b border-border/60">
                        <td className="px-3 py-2"><Input value={l.description} onChange={(e) => update(l.id, { description: e.target.value })} className="h-8 border-transparent bg-transparent hover:border-input" />{l.sku && <p className="ml-3 font-mono text-2xs text-muted-foreground">{l.sku}</p>}</td>
                        <td className="px-3 py-2"><Input type="number" value={l.qty} onChange={(e) => update(l.id, { qty: Number(e.target.value) || 0 })} className="h-8 text-right tabular-nums" /></td>
                        <td className="px-3 py-2"><Input value={l.uom} onChange={(e) => update(l.id, { uom: e.target.value })} className="h-8" /></td>
                        <td className="px-3 py-2"><Input type="number" step="0.01" value={l.price} onChange={(e) => update(l.id, { price: Number(e.target.value) || 0 })} className="h-8 text-right tabular-nums" /></td>
                        <td className="px-3 py-2"><Input type="number" step="0.01" value={l.taxRate} onChange={(e) => update(l.id, { taxRate: Number(e.target.value) || 0 })} className="h-8 text-right tabular-nums" /></td>
                        <td className="px-3 py-2 text-right font-mono tabular-nums">{formatCurrency(l.qty * l.price * (1 + l.taxRate / 100))}</td>
                        <td className="px-3 py-2"><Button variant="ghost" size="icon-sm" onClick={() => remove(l.id)}><Trash2 className="size-3.5" /></Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-base">Delivery instructions</CardTitle></CardHeader><CardContent><Textarea placeholder="Delivery notes for vendor" defaultValue="Deliver to Receiving Dock 4. Operating hours 7am-3pm M-F." minRows={3} /></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Internal notes</CardTitle></CardHeader><CardContent><Textarea placeholder="Notes for our team" defaultValue="Critical for May production schedule. Coordinate with Sarah for QA inspection on receipt." minRows={3} /></CardContent></Card>
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader><CardTitle className="text-base">Totals</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono tabular-nums">{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="font-mono tabular-nums">{formatCurrency(tax)}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Shipping</span><Input type="number" value={shipping} onChange={(e) => setShipping(Number(e.target.value) || 0)} className="h-7 w-24 text-right tabular-nums" /></div>
              <Separator />
              <div className="flex items-baseline justify-between"><span className="font-medium">Total</span><span className="font-mono text-2xl font-semibold tabular-nums">{formatCurrency(total)}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Building2 className="size-4" /> Vendor info</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Code</span><span className="font-mono">{vendor.code}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="truncate">{vendor.email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Terms</span><span>{vendor.terms}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Open POs</span><span>3</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">YTD spend</span><span className="font-mono">{formatCurrency(284500)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">OTIF rate</span><span className="text-success">96.2%</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Truck className="size-4" /> Approval routing</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center gap-2 rounded-md border p-2"><div className="size-2 rounded-full bg-success" /><span className="flex-1">Auto-approved (under $50k threshold)</span></div>
              <div className="flex items-center gap-2 rounded-md border p-2 opacity-50"><div className="size-2 rounded-full bg-muted" /><span className="flex-1">Director approval</span></div>
              <div className="flex items-center gap-2 rounded-md border p-2 opacity-50"><div className="size-2 rounded-full bg-muted" /><span className="flex-1">CFO approval (>$250k)</span></div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
