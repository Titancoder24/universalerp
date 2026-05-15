import Link from 'next/link';
import {
  ArrowRight,
  Banknote,
  Download,
  FileQuestion,
  Receipt,
  ShoppingBag,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatCurrency } from '@/lib/utils';

const summary = [
  { label: 'Open POs', value: '$87,400', icon: ShoppingBag, badge: '7 orders' },
  { label: 'Bills pending', value: '4', icon: Receipt, badge: '$23,180' },
  { label: 'Active RFQs', value: '2', icon: FileQuestion, badge: 'Respond by Fri' },
  { label: 'Payments YTD', value: '$184,200', icon: Banknote, badge: '+12% YoY' },
];

const openPOs = [
  { id: 'PO-3014', date: '2026-05-10', amount: 24500, status: 'sent' as const, items: 'Industrial bolts x 5000' },
  { id: 'PO-3018', date: '2026-05-08', amount: 18200, status: 'acknowledged' as const, items: 'Steel plates A36 grade' },
  { id: 'PO-3022', date: '2026-05-05', amount: 8900, status: 'partial' as const, items: 'Hydraulic cylinders' },
];

const activeRFQs = [
  { id: 'RFQ-127', name: 'Q3 raw materials supply', deadline: '2026-05-19', lines: 12 },
  { id: 'RFQ-129', name: 'Custom machined parts', deadline: '2026-05-22', lines: 6 },
];

export default function VendorPortalHome() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Hi Pacific Supplies</h1>
        <p className="text-muted-foreground">
          Your activity with Acme Corp procurement.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summary.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="size-4" />
                </div>
                <Badge variant="outline" className="text-2xs">{s.badge}</Badge>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-semibold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active RFQs</CardTitle>
              <CardDescription>Respond with your best pricing and lead times</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/vendor-portal/rfqs">All RFQs <ArrowRight className="size-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeRFQs.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 hover:bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-warning/10 text-warning">
                    <FileQuestion className="size-5" />
                  </div>
                  <div>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.id} · {r.lines} line items · deadline {r.deadline}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="xs" variant="outline">View</Button>
                  <Button size="xs">Submit response</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This week</CardTitle>
            <CardDescription>Upcoming deliveries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="text-xs text-muted-foreground">Wed · May 15</div>
              <div className="font-medium">PO-3014 delivery due</div>
              <div className="font-mono text-xs text-muted-foreground">5000 units</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="text-xs text-muted-foreground">Fri · May 17</div>
              <div className="font-medium">PO-3022 final shipment</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Open Purchase Orders</CardTitle>
            <CardDescription>Track POs from Acme Corp</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/vendor-portal/orders">All POs <ArrowRight className="size-3.5" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>PO #</th>
                <th>Date</th>
                <th>Items</th>
                <th>Status</th>
                <th className="text-right">Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {openPOs.map((po) => (
                <tr key={po.id}>
                  <td className="font-mono text-xs font-medium text-primary">{po.id}</td>
                  <td className="text-sm">{po.date}</td>
                  <td className="text-sm">{po.items}</td>
                  <td><StatusBadge status={po.status} /></td>
                  <td className="text-right font-mono">{formatCurrency(po.amount)}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-xs"><Download className="size-3" /></Button>
                      <Button variant="ghost" size="xs">View</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
