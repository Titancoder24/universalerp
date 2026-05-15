'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ChevronLeft,
  ClipboardList,
  Factory,
  Flag,
  Link2,
  Package,
  Play,
  Save,
  Search,
  Sparkles,
  Workflow,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatCurrency } from '@/lib/utils';

const bomItems = [
  { sku: 'COMP-201', name: 'Aluminum frame', qty: 1, uom: 'each', avail: 1245 },
  { sku: 'COMP-318', name: 'Bearing assembly', qty: 4, uom: 'each', avail: 5402 },
  { sku: 'COMP-507', name: 'Control board v2', qty: 1, uom: 'each', avail: 287 },
  { sku: 'COMP-621', name: 'Cable harness (1m)', qty: 2, uom: 'each', avail: 822 },
  { sku: 'COMP-714', name: 'Mounting bracket set', qty: 1, uom: 'kit', avail: 1100 },
];

const routing = [
  { op: '10', name: 'Frame prep', workCenter: 'WC-101', setup: 15, runPerUnit: 8 },
  { op: '20', name: 'Sub-assembly', workCenter: 'WC-205', setup: 20, runPerUnit: 24 },
  { op: '30', name: 'Final assembly', workCenter: 'WC-308', setup: 10, runPerUnit: 18 },
  { op: '40', name: 'QC test', workCenter: 'WC-410', setup: 5, runPerUnit: 6 },
];

export default function NewWorkOrderPage() {
  const [qty, setQty] = React.useState(100);
  const totalRouting = routing.reduce((s, r) => s + r.setup + r.runPerUnit * qty, 0);
  const totalHours = Math.round((totalRouting / 60) * 10) / 10;
  const matlCost = 312.50 * qty;

  return (
    <div className="flex flex-col">
      <PageHeader
        title="New work order"
        breadcrumbs={[{ label: 'Manufacturing', href: '/app/manufacturing' }, { label: 'Work orders', href: '/app/manufacturing/work-orders' }, { label: 'New' }]}
        back={<Button variant="ghost" size="icon-sm" asChild><Link href="/app/manufacturing/work-orders"><ChevronLeft className="size-4" /></Link></Button>}
        actions={
          <>
            <Button variant="outline" size="sm" asChild><Link href="/app/manufacturing/work-orders"><X className="size-4" /> Cancel</Link></Button>
            <Button variant="outline" size="sm"><Save className="size-4" /> Save draft</Button>
            <Button size="sm"><Play className="size-4" /> Release to floor</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Manufacturing item</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2"><Label required>Finished good</Label>
                <div className="flex h-10 items-center justify-between rounded-lg border border-input bg-background px-3">
                  <div className="flex items-center gap-2"><Package className="size-4 text-muted-foreground" /><div><p className="text-sm font-medium">Widget Pro 3000 - Assembly</p><p className="font-mono text-xs text-muted-foreground">WID-3000-ASM</p></div></div>
                  <Search className="size-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-1.5"><Label required>Quantity to produce</Label><Input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value) || 0)} /></div>
              <div className="space-y-1.5"><Label>UoM</Label><Select defaultValue="each"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="each">Each</SelectItem><SelectItem value="case">Case</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label required>BOM version</Label><Select defaultValue="bom-v3.2"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="bom-v3.0">v3.0 (2025-08)</SelectItem><SelectItem value="bom-v3.1">v3.1 (2026-01)</SelectItem><SelectItem value="bom-v3.2">v3.2 (2026-04) - current</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label required>Routing</Label><Select defaultValue="rt-std"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="rt-std">Standard assembly</SelectItem><SelectItem value="rt-fast">Fast-track (parallel ops)</SelectItem><SelectItem value="rt-rework">Rework routing</SelectItem></SelectContent></Select></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Schedule & priority</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5"><Label required>Planned start</Label><Input type="datetime-local" defaultValue="2026-05-20T07:00" /></div>
              <div className="space-y-1.5"><Label required>Planned end</Label><Input type="datetime-local" defaultValue="2026-05-23T17:00" /></div>
              <div className="space-y-1.5"><Label required>Production warehouse</Label><Select defaultValue="rno"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sf">SF-01 - HQ</SelectItem><SelectItem value="rno">RNO-02 - Reno (Mfg)</SelectItem><SelectItem value="atl">ATL-03 - Atlanta</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Output location</Label><Select defaultValue="rno-fg"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="rno-fg">RNO-02 FG-A1</SelectItem><SelectItem value="rno-stage">RNO-02 STAGE</SelectItem></SelectContent></Select></div>
              <div className="md:col-span-2 space-y-1.5"><Label>Priority</Label>
                <RadioGroup defaultValue="normal" className="grid grid-cols-4 gap-2">
                  {(['low', 'normal', 'high', 'urgent'] as const).map((p) => (
                    <label key={p} className="flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm hover:bg-accent/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <RadioGroupItem value={p} /><span className="capitalize">{p}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="size-4" /> Bill of materials (preview)</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="erp-table">
                <thead><tr><th>SKU</th><th>Component</th><th className="text-right">Per unit</th><th className="text-right">Required</th><th className="text-right">Available</th><th>Status</th></tr></thead>
                <tbody>{bomItems.map((b) => {
                  const required = b.qty * qty;
                  const short = required > b.avail;
                  return (
                    <tr key={b.sku}>
                      <td className="font-mono text-xs text-primary">{b.sku}</td>
                      <td className="font-medium">{b.name}</td>
                      <td className="text-right font-mono tabular-nums">{b.qty}</td>
                      <td className="text-right font-mono tabular-nums">{required}</td>
                      <td className="text-right font-mono tabular-nums">{b.avail}</td>
                      <td>{short ? <Badge variant="destructive">Short {required - b.avail}</Badge> : <Badge>OK</Badge>}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Workflow className="size-4" /> Routing & operations</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="erp-table">
                <thead><tr><th>Op</th><th>Operation</th><th>Work center</th><th className="text-right">Setup (min)</th><th className="text-right">Run/unit</th><th className="text-right">Total min</th></tr></thead>
                <tbody>{routing.map((r) => (
                  <tr key={r.op}><td className="font-mono">{r.op}</td><td>{r.name}</td><td className="font-mono text-xs">{r.workCenter}</td><td className="text-right tabular-nums">{r.setup}</td><td className="text-right tabular-nums">{r.runPerUnit}</td><td className="text-right font-mono tabular-nums">{r.setup + r.runPerUnit * qty}</td></tr>
                ))}</tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
            <CardContent><Textarea placeholder="Production instructions, special handling, customer notes…" minRows={3} defaultValue="Customer order - prioritize for shipment 2026-05-25." /></CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Factory className="size-4" /> Planning summary</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span className="font-mono">{qty} units</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Est. labor hours</span><span className="font-mono">{totalHours}h</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Est. material cost</span><span className="font-mono">{formatCurrency(matlCost)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Est. labor cost</span><span className="font-mono">{formatCurrency(totalHours * 38)}</span></div>
              <Separator />
              <div className="flex justify-between font-semibold"><span>Total est. cost</span><span className="font-mono">{formatCurrency(matlCost + totalHours * 38)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Unit cost</span><span className="font-mono">{formatCurrency((matlCost + totalHours * 38) / Math.max(qty, 1))}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Link2 className="size-4" /> Linked records</CardTitle></CardHeader>
            <CardContent className="space-y-1.5">
              <Link href="#" className="flex items-center justify-between rounded-md border p-2 text-xs hover:bg-accent/30">
                <div><p className="font-mono text-primary">SO-1248</p><p className="text-muted-foreground">Acme Industries</p></div>
                <Flag className="size-3.5 text-warning" />
              </Link>
              <Button variant="outline" size="sm" className="w-full"><Link2 className="size-4" /> Link sales order</Button>
            </CardContent>
          </Card>

          <Card className="border-warning/30 bg-warning/[0.04]">
            <CardContent className="pt-6 space-y-2">
              <div className="flex items-center gap-2"><AlertCircle className="size-4 text-warning" /><p className="text-sm font-medium text-warning">Material shortage</p></div>
              <p className="text-xs text-muted-foreground">Control board v2 will be short by 13 units at planned start. Consider raising PO to Northland Components.</p>
              <Button variant="outline" size="sm" className="w-full"><Sparkles className="size-4" /> Auto-create PO</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
