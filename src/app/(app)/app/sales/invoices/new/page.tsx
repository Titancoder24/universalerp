'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, Search, Send, Save, Sparkles, Trash2, FileText } from 'lucide-react';
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

interface Line {
  id: string;
  sku: string;
  description: string;
  qty: number;
  price: number;
  discount: number;
  tax: number;
}

const customers = [
  { id: 'c1', code: 'CUST-0021', name: 'Acme Industries', email: 'ap@acme.com' },
  { id: 'c2', code: 'CUST-0042', name: 'TechCorp Solutions', email: 'finance@techcorp.io' },
  { id: 'c3', code: 'CUST-0118', name: 'Global Manufacturing', email: 'invoices@globalmfg.com' },
  { id: 'c4', code: 'CUST-0204', name: 'Enterprise Ltd', email: 'ap@enterprise.co.uk' },
  { id: 'c5', code: 'CUST-0317', name: 'StartupCo', email: 'billing@startupco.com' },
];

const items = [
  { sku: 'PROD-001', name: 'Enterprise License (annual)', price: 12000 },
  { sku: 'PROD-002', name: 'Implementation Services', price: 250 },
  { sku: 'PROD-003', name: 'Premium Support Tier', price: 4800 },
  { sku: 'PROD-004', name: 'Analytics Add-on Module', price: 3200 },
  { sku: 'PROD-007', name: 'Data Migration Service', price: 8500 },
];

const calcLine = (l: Line) => {
  const sub = l.qty * l.price;
  const disc = sub * (l.discount / 100);
  const after = sub - disc;
  const tax = after * (l.tax / 100);
  return { sub, disc, tax, total: after + tax };
};

export default function NewInvoicePage() {
  const [customer, setCustomer] = React.useState(customers[0]);
  const [custOpen, setCustOpen] = React.useState(false);
  const [shippingFee, setShippingFee] = React.useState(0);
  const [globalDiscount, setGlobalDiscount] = React.useState(0);
  const [lines, setLines] = React.useState<Line[]>([
    { id: '1', sku: 'PROD-001', description: 'Enterprise License (annual)', qty: 12, price: 12000, discount: 5, tax: 8.25 },
    { id: '2', sku: 'PROD-003', description: 'Premium Support Tier', qty: 1, price: 4800, discount: 0, tax: 8.25 },
    { id: '3', sku: 'PROD-002', description: 'Implementation Services - Phase 1', qty: 40, price: 250, discount: 0, tax: 0 },
  ]);

  const totals = lines.reduce(
    (a, l) => {
      const c = calcLine(l);
      a.sub += c.sub; a.disc += c.disc; a.tax += c.tax; a.total += c.total;
      return a;
    },
    { sub: 0, disc: 0, tax: 0, total: 0 },
  );

  const grand = totals.total - globalDiscount + shippingFee;

  const addLine = () => setLines((p) => [...p, { id: String(Date.now()), sku: '', description: '', qty: 1, price: 0, discount: 0, tax: 8.25 }]);
  const removeLine = (id: string) => setLines((p) => p.filter((l) => l.id !== id));
  const update = (id: string, patch: Partial<Line>) => setLines((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const addFromCatalog = (sku: string) => {
    const it = items.find((i) => i.sku === sku);
    if (!it) return;
    setLines((p) => [...p, { id: String(Date.now()), sku: it.sku, description: it.name, qty: 1, price: it.price, discount: 0, tax: 8.25 }]);
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="New invoice"
        breadcrumbs={[{ label: 'Home', href: '/app' }, { label: 'Sales', href: '/app/sales' }, { label: 'Invoices', href: '/app/sales/invoices' }, { label: 'New' }]}
        back={<Button variant="ghost" size="icon-sm" asChild><Link href="/app/sales/invoices"><ChevronLeft className="size-4" /></Link></Button>}
        actions={
          <>
            <Button variant="outline" size="sm"><Sparkles className="size-4" /> AI Draft</Button>
            <Button variant="outline" size="sm">Preview PDF</Button>
            <Button variant="outline" size="sm"><Save className="size-4" /> Save draft</Button>
            <Button size="sm"><Send className="size-4" /> Save & send</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Invoice header</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-1.5 md:col-span-3">
                <Label required>Customer</Label>
                <Popover open={custOpen} onOpenChange={setCustOpen}>
                  <PopoverTrigger asChild>
                    <button type="button" className="flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm shadow-xs hover:bg-accent/30">
                      <div className="flex min-w-0 items-center gap-2">
                        <Avatar size="xs"><AvatarFallback>{initials(customer.name)}</AvatarFallback></Avatar>
                        <span className="truncate font-medium">{customer.name}</span>
                        <span className="font-mono text-xs text-muted-foreground">{customer.code}</span>
                      </div>
                      <Search className="size-4 opacity-60" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[420px] p-0">
                    <div className="border-b p-2"><Input placeholder="Search customers…" className="h-8" /></div>
                    <div className="max-h-72 overflow-y-auto p-1">
                      {customers.map((c) => (
                        <button key={c.id} onClick={() => { setCustomer(c); setCustOpen(false); }} className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm hover:bg-accent">
                          <Avatar size="xs"><AvatarFallback>{initials(c.name)}</AvatarFallback></Avatar>
                          <div className="min-w-0"><p className="truncate font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.email}</p></div>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5"><Label>Invoice number</Label><Input value="INV-2091" readOnly className="font-mono" /></div>
              <div className="space-y-1.5"><Label required>Issue date</Label><Input type="date" defaultValue="2026-05-15" /></div>
              <div className="space-y-1.5"><Label required>Due date</Label><Input type="date" defaultValue="2026-06-14" /></div>
              <div className="space-y-1.5"><Label>PO reference</Label><Input placeholder="Customer PO #" defaultValue="PO-44781" /></div>
              <div className="space-y-1.5"><Label>Sales order ref</Label><Input placeholder="SO-#####" defaultValue="SO-1209" /></div>
              <div className="space-y-1.5"><Label>Currency</Label><Select defaultValue="USD"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="GBP">GBP</SelectItem></SelectContent></Select></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Line items</CardTitle>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild><Button variant="outline" size="sm"><Plus className="size-4" /> From catalog</Button></PopoverTrigger>
                  <PopoverContent align="end" className="w-[380px] p-0">
                    <div className="border-b p-2"><Input placeholder="Search items…" className="h-8" /></div>
                    <div className="max-h-72 overflow-y-auto p-1">
                      {items.map((p) => (
                        <button key={p.sku} onClick={() => addFromCatalog(p.sku)} className="flex w-full justify-between rounded-md p-2 text-left text-sm hover:bg-accent">
                          <div><p className="font-medium">{p.name}</p><p className="font-mono text-xs text-muted-foreground">{p.sku}</p></div>
                          <span className="font-mono text-xs">{formatCurrency(p.price)}</span>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button variant="outline" size="sm" onClick={addLine}><Plus className="size-4" /> Blank row</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/20">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-muted-foreground">Item / Description</th>
                      <th className="px-3 py-2 text-right text-xs uppercase tracking-wide text-muted-foreground w-20">Qty</th>
                      <th className="px-3 py-2 text-right text-xs uppercase tracking-wide text-muted-foreground w-28">Price</th>
                      <th className="px-3 py-2 text-right text-xs uppercase tracking-wide text-muted-foreground w-20">Disc %</th>
                      <th className="px-3 py-2 text-right text-xs uppercase tracking-wide text-muted-foreground w-20">Tax %</th>
                      <th className="px-3 py-2 text-right text-xs uppercase tracking-wide text-muted-foreground w-28">Line total</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((l) => {
                      const c = calcLine(l);
                      return (
                        <tr key={l.id} className="border-b border-border/60">
                          <td className="px-3 py-2"><Input value={l.description} onChange={(e) => update(l.id, { description: e.target.value })} placeholder="Item or description" className="h-8 border-transparent bg-transparent hover:border-input" />{l.sku && <p className="ml-3 font-mono text-2xs text-muted-foreground">{l.sku}</p>}</td>
                          <td className="px-3 py-2"><Input type="number" value={l.qty} onChange={(e) => update(l.id, { qty: Number(e.target.value) || 0 })} className="h-8 text-right tabular-nums" /></td>
                          <td className="px-3 py-2"><Input type="number" step="0.01" value={l.price} onChange={(e) => update(l.id, { price: Number(e.target.value) || 0 })} className="h-8 text-right tabular-nums" /></td>
                          <td className="px-3 py-2"><Input type="number" value={l.discount} onChange={(e) => update(l.id, { discount: Number(e.target.value) || 0 })} className="h-8 text-right tabular-nums" /></td>
                          <td className="px-3 py-2"><Input type="number" step="0.01" value={l.tax} onChange={(e) => update(l.id, { tax: Number(e.target.value) || 0 })} className="h-8 text-right tabular-nums" /></td>
                          <td className="px-3 py-2 text-right font-mono tabular-nums">{formatCurrency(c.total)}</td>
                          <td className="px-3 py-2"><Button variant="ghost" size="icon-sm" onClick={() => removeLine(l.id)}><Trash2 className="size-3.5" /></Button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-3"><Button variant="ghost" size="sm" onClick={addLine}><Plus className="size-4" /> Add line item</Button></div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Customer notes</CardTitle></CardHeader>
              <CardContent><Textarea placeholder="Visible on invoice" defaultValue="Thank you for your business. Please remit payment by the due date." minRows={4} /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Terms & conditions</CardTitle></CardHeader>
              <CardContent><Textarea placeholder="Payment terms" defaultValue="Net 30. Late payments subject to 1.5% monthly finance charge." minRows={4} /></CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader><CardTitle className="text-base">Internal notes</CardTitle></CardHeader>
              <CardContent><Textarea placeholder="Only visible to your team" defaultValue="Customer requested net 30 even though plan is net 15. Approved by Sarah." minRows={3} /></CardContent>
            </Card>
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader><CardTitle className="text-base">Totals</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono tabular-nums">{formatCurrency(totals.sub)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Line discounts</span><span className="font-mono tabular-nums text-warning">-{formatCurrency(totals.disc)}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Order discount</span><Input type="number" value={globalDiscount} onChange={(e) => setGlobalDiscount(Number(e.target.value) || 0)} className="h-7 w-24 text-right tabular-nums" /></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="font-mono tabular-nums">{formatCurrency(totals.tax)}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Shipping</span><Input type="number" value={shippingFee} onChange={(e) => setShippingFee(Number(e.target.value) || 0)} className="h-7 w-24 text-right tabular-nums" /></div>
              </div>
              <Separator />
              <div className="flex items-baseline justify-between"><span className="text-sm font-medium">Grand total</span><span className="font-mono text-2xl font-semibold tabular-nums">{formatCurrency(grand)}</span></div>
              <Separator />
              <div className="space-y-1.5"><Label>Payment terms</Label><Select defaultValue="net30"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="receipt">Due on receipt</SelectItem><SelectItem value="net15">Net 15</SelectItem><SelectItem value="net30">Net 30</SelectItem><SelectItem value="net60">Net 60</SelectItem></SelectContent></Select></div>
              <div className="rounded-md border border-info/30 bg-info/5 p-3 text-xs"><FileText className="mb-1 size-4 text-info" /><p className="font-medium text-info">Auto-numbered</p><p className="mt-1 text-muted-foreground">INV-2091 will be assigned on save. Next available number.</p></div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
