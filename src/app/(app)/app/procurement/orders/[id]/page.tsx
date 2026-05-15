import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Download,
  Edit,
  FileText,
  Mail,
  Printer,
  Send,
  Truck,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatCurrency, formatDate, initials } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

const lineItems = [
  { id: 'L1', sku: 'BOLT-M8-40', description: 'Industrial Bolts M8 x 40mm zinc plated DIN 933', qty: 20000, uom: 'pcs', unit: 0.42, total: 8400, received: 12000, billed: 8000 },
  { id: 'L2', sku: 'BOLT-M10-50', description: 'Industrial Bolts M10 x 50mm zinc plated DIN 933', qty: 8000, uom: 'pcs', unit: 0.74, total: 5920, received: 5000, billed: 3000 },
  { id: 'L3', sku: 'NUT-M8', description: 'Hex nut M8 zinc plated DIN 934', qty: 30000, uom: 'pcs', unit: 0.10, total: 3000, received: 30000, billed: 30000 },
  { id: 'L4', sku: 'WASHER-M8', description: 'Flat washer M8 zinc plated DIN 125', qty: 30000, uom: 'pcs', unit: 0.038, total: 1140, received: 30000, billed: 30000 },
];

const subtotal = lineItems.reduce((a, l) => a + l.total, 0);
const tax = subtotal * 0.08;
const shipping = 420;
const total = subtotal + tax + shipping;

const auditTrail = [
  { date: '2026-05-12 09:14', actor: 'Sara Kim', action: 'PO created from REQ-2096', icon: FileText },
  { date: '2026-05-12 11:38', actor: 'Dana Cole', action: 'Approved by department head', icon: CheckCircle2 },
  { date: '2026-05-12 14:02', actor: 'Sara Kim', action: 'Sent to Apex Industrial', icon: Send },
  { date: '2026-05-12 16:48', actor: 'Heinrich M. (vendor)', action: 'Acknowledged, confirmed delivery May 26', icon: CheckCircle2 },
  { date: '2026-05-14 08:30', actor: 'Maya Tao', action: 'Partial receipt GR-2098 (12,000 pcs)', icon: Truck },
  { date: '2026-05-15 10:12', actor: 'Finance', action: 'Bill VB-2098 received & matched', icon: Wallet },
];

export default async function POdetailPage({ params }: PageProps) {
  const { id } = await params;

  const matchStatus = [
    { label: 'PO', value: '$' + total.toFixed(2), match: true },
    { label: 'Goods Receipt', value: 'GR-2098 (partial)', match: true },
    { label: 'Vendor Bill', value: 'VB-2098', match: true },
  ];

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`Purchase Order ${id}`}
        description="Annual fastener contract · Apex Industrial Supply"
        breadcrumbs={[
          { label: 'Procurement', href: '/app/procurement' },
          { label: 'Orders', href: '/app/procurement/orders' },
          { label: id },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/procurement/orders"><ArrowLeft className="size-4" /></Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline"><Printer className="size-4" /> Print</Button>
            <Button variant="outline"><Mail className="size-4" /> Email</Button>
            <Button variant="outline"><Download className="size-4" /> PDF</Button>
            <Button><Edit className="size-4" /> Edit</Button>
          </>
        }
      />

      <Card className="border-success/30 bg-success/5">
        <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_auto]">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-success" />
              <span className="font-semibold">3-way match: matched</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">PO, goods receipt, and vendor bill all aligned within tolerance. Ready for payment.</p>
          </div>
          <div className="flex items-center gap-4">
            {matchStatus.map((m) => (
              <div key={m.label} className="flex items-center gap-2 rounded-md border border-success/30 bg-background px-3 py-1.5">
                <CheckCircle2 className="size-4 text-success" />
                <div>
                  <div className="text-xs text-muted-foreground">{m.label}</div>
                  <div className="text-sm font-medium">{m.value}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-2 gap-6 border-b border-border bg-muted/30 p-6">
              <div>
                <div className="text-xs uppercase text-muted-foreground tracking-wide">Purchase Order</div>
                <div className="mt-1 font-mono text-2xl font-bold">{id}</div>
                <div className="mt-3 text-sm space-y-1">
                  <div><span className="text-muted-foreground">Date issued: </span>{formatDate('2026-05-12')}</div>
                  <div><span className="text-muted-foreground">Expected: </span>{formatDate('2026-05-26')}</div>
                  <div><span className="text-muted-foreground">Currency: </span>USD</div>
                  <div><span className="text-muted-foreground">Incoterms: </span>DDP - Chicago DC</div>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge status="partial" />
                <div className="mt-3 text-sm space-y-1">
                  <div><span className="text-muted-foreground">Payment: </span>Net 30</div>
                  <div><span className="text-muted-foreground">Buyer: </span>Sara Kim</div>
                  <div><span className="text-muted-foreground">From REQ: </span><span className="font-mono">REQ-2096</span></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 border-b border-border p-6">
              <div>
                <div className="text-xs uppercase text-muted-foreground tracking-wide">Vendor</div>
                <div className="mt-1 font-semibold">Apex Industrial Supply</div>
                <div className="text-sm text-muted-foreground">420 W Madison St<br />Chicago, IL 60607<br />USA</div>
                <div className="mt-2 text-sm font-mono">+1 312 555 0142</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground tracking-wide">Ship to</div>
                <div className="mt-1 font-semibold">WH-CHI Main DC</div>
                <div className="text-sm text-muted-foreground">420 W Madison St<br />Chicago, IL 60607<br />USA</div>
                <div className="mt-2 text-sm">Attn: Aisha Nakamura</div>
              </div>
            </div>

            <div className="p-6">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>SKU</th>
                    <th>Description</th>
                    <th className="text-right">Qty</th>
                    <th className="text-right">Unit</th>
                    <th className="text-right">Total</th>
                    <th className="text-right">Recv</th>
                    <th className="text-right">Billed</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((l, idx) => (
                    <tr key={l.id}>
                      <td className="text-muted-foreground">{idx + 1}</td>
                      <td className="font-mono text-xs text-primary">{l.sku}</td>
                      <td className="text-sm">{l.description}</td>
                      <td className="text-right font-mono">{l.qty.toLocaleString()}</td>
                      <td className="text-right font-mono">{formatCurrency(l.unit)}</td>
                      <td className="text-right font-mono font-medium">{formatCurrency(l.total)}</td>
                      <td className="text-right font-mono text-info">{l.received.toLocaleString()}</td>
                      <td className="text-right font-mono text-success">{l.billed.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex justify-end">
                <div className="w-72 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{formatCurrency(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span className="font-mono">{formatCurrency(tax)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-mono">{formatCurrency(shipping)}</span></div>
                  <div className="flex justify-between border-t border-border pt-2 text-base font-semibold"><span>Total</span><span className="font-mono">{formatCurrency(total)}</span></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="relative px-6 py-2">
                <div className="absolute left-9 top-0 bottom-0 w-px bg-border" />
                {auditTrail.map((a, i) => (
                  <div key={i} className="flex gap-3 py-3">
                    <div className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-background">
                      <a.icon className="size-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">{a.action}</div>
                      <div className="text-xs text-muted-foreground">{a.actor} · {a.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start"><Truck className="size-4" /> Record receipt</Button>
              <Button variant="outline" className="w-full justify-start"><Wallet className="size-4" /> Match bill</Button>
              <Button variant="outline" className="w-full justify-start"><FileText className="size-4" /> Duplicate PO</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
