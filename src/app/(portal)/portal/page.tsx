import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  CircleDollarSign,
  Clock,
  Download,
  FileCheck,
  FileText,
  Receipt,
  ShoppingBag,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

const summary = [
  { label: 'Open invoices', value: '$24,890', icon: Receipt, badge: '3 invoices' },
  { label: 'Pending quotes', value: '2', icon: FileText, badge: 'Action needed' },
  { label: 'Active orders', value: '5', icon: ShoppingBag, badge: '$67,200 in flight' },
  { label: 'Open tickets', value: '1', icon: Clock, badge: 'High priority' },
];

const upcomingInvoices = [
  { id: 'INV-2089', amount: 12450, due: '2026-05-25', status: 'sent' as const },
  { id: 'INV-2092', amount: 8900, due: '2026-06-01', status: 'sent' as const },
  { id: 'INV-2095', amount: 3540, due: '2026-06-10', status: 'sent' as const },
];

const pendingQuotes = [
  { id: 'QT-456', name: 'Q3 Hardware Expansion', amount: 45000, expires: '2026-05-30' },
  { id: 'QT-461', name: 'Support Renewal', amount: 12000, expires: '2026-06-15' },
];

const recentOrders = [
  { id: 'SO-2143', name: '500x Widget Bundle', status: 'shipped' as const, eta: '2026-05-18' },
  { id: 'SO-2148', name: 'Custom assembly Q2', status: 'in_production' as const, eta: '2026-05-25' },
  { id: 'SO-2151', name: 'Software License renewal', status: 'invoiced' as const, eta: '2026-05-15' },
];

export default function PortalHomePage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Welcome back, John</h1>
        <p className="text-muted-foreground">
          Here's an overview of your account with Acme Corp.
        </p>
      </div>

      {/* Summary */}
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
        {/* Pending quotes */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Quotes pending your approval</CardTitle>
              <CardDescription>Sign these off and we'll convert them to orders</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/portal/quotes">All quotes <ArrowRight className="size-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingQuotes.map((q) => (
              <div key={q.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-warning/10 text-warning">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <div className="font-medium">{q.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {q.id} · expires {q.expires}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-base font-semibold">{formatCurrency(q.amount)}</div>
                  <div className="mt-1 flex gap-1">
                    <Button size="xs" variant="outline">
                      <Download className="size-3" /> PDF
                    </Button>
                    <Button size="xs">
                      <FileCheck className="size-3" /> Accept
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Outstanding invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Outstanding</CardTitle>
            <CardDescription>Total due: $24,890</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-px">
              {upcomingInvoices.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/portal/invoices/${inv.id}`}
                  className="flex items-center justify-between gap-2 px-4 py-3 hover:bg-muted/40 transition-colors"
                >
                  <div>
                    <div className="font-mono text-xs font-medium text-primary">{inv.id}</div>
                    <div className="text-xs text-muted-foreground">Due {inv.due}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold">{formatCurrency(inv.amount)}</div>
                    <StatusBadge status={inv.status} className="text-2xs" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>Track your deliveries and production progress</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/portal/orders">All orders <ArrowRight className="size-3.5" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Description</th>
                <th>Status</th>
                <th>ETA</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td className="font-mono text-xs font-medium text-primary">{o.id}</td>
                  <td>{o.name}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="text-sm">{o.eta}</td>
                  <td className="text-right">
                    <Button variant="ghost" size="xs">View</Button>
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
