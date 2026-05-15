import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock,
  DollarSign,
  Download,
  FileText,
  Plus,
  ShoppingBag,
  Truck,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatNumber, initials, formatCompactNumber } from '@/lib/utils';

const stats = [
  { label: 'Open POs', value: 142, delta: 8.2, format: 'number' as const, icon: ShoppingBag, sparkline: [128, 132, 130, 135, 138, 140, 141, 142] },
  { label: 'Committed spend', value: 4280590, delta: 12.4, format: 'currency' as const, icon: DollarSign, sparkline: [3.8, 4.0, 4.1, 4.0, 4.2, 4.3, 4.2, 4.3].map(v => v * 1000000) },
  { label: 'Awaiting approval', value: 24, delta: -8.5, format: 'number' as const, icon: ClipboardList, sparkline: [32, 30, 28, 27, 26, 25, 24, 24] },
  { label: 'Receipts this week', value: 38, delta: 18.4, format: 'number' as const, icon: Truck, sparkline: [22, 24, 27, 30, 32, 35, 37, 38] },
];

const topVendors = [
  { name: 'Apex Industrial Supply', spend: 842000, orders: 38, country: 'USA', performance: 96 },
  { name: 'Shenzhen Tek Hardware', spend: 624000, orders: 22, country: 'CN', performance: 88 },
  { name: 'EuroFasteners GmbH', spend: 412000, orders: 18, country: 'DE', performance: 92 },
  { name: 'AirGuard Co Ltd', spend: 338000, orders: 14, country: 'USA', performance: 94 },
  { name: 'Petrolab Inc', spend: 286000, orders: 12, country: 'USA', performance: 86 },
  { name: 'ColorMax AG', spend: 242000, orders: 9, country: 'CH', performance: 91 },
];

const pendingRequisitions = [
  { id: 'REQ-2098', requester: 'Sara Kim', dept: 'Engineering', amount: 24800, items: 8, age: '2h', status: 'pending' },
  { id: 'REQ-2097', requester: 'Mark Eaton', dept: 'Operations', amount: 8400, items: 12, age: '5h', status: 'approved' },
  { id: 'REQ-2096', requester: 'Lina Wang', dept: 'Production', amount: 142000, items: 24, age: '1d', status: 'pending' },
  { id: 'REQ-2095', requester: 'Hugo Park', dept: 'Maintenance', amount: 3800, items: 6, age: '2d', status: 'approved' },
  { id: 'REQ-2094', requester: 'Jen Cooper', dept: 'Quality', amount: 48200, items: 4, age: '2d', status: 'rejected' },
];

const upcomingReceipts = [
  { date: 'Tomorrow', po: 'PO-1204', vendor: 'Apex Industrial Supply', items: 12, value: 24800, eta: '09:30' },
  { date: 'Tue 5/19', po: 'PO-1201', vendor: 'Shenzhen Tek Hardware', items: 38, value: 142000, eta: '14:00' },
  { date: 'Wed 5/20', po: 'PO-1202', vendor: 'AirGuard Co Ltd', items: 6, value: 8400, eta: '10:00' },
  { date: 'Thu 5/21', po: 'PO-1198', vendor: 'EuroFasteners GmbH', items: 18, value: 38400, eta: '11:30' },
  { date: 'Fri 5/22', po: 'PO-1199', vendor: 'Petrolab Inc', items: 4, value: 12800, eta: '08:00' },
];

const categorySpend = [
  { name: 'Raw materials', spend: 1840000, percent: 43, color: 'hsl(var(--primary))' },
  { name: 'Components', spend: 1240000, percent: 29, color: 'hsl(var(--info))' },
  { name: 'Services', spend: 620000, percent: 14, color: 'hsl(var(--success))' },
  { name: 'IT & Software', spend: 380000, percent: 9, color: 'hsl(var(--warning))' },
  { name: 'Other', spend: 200590, percent: 5, color: 'hsl(var(--muted-foreground))' },
];

export default function ProcurementDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Procurement"
        description="From requisition to receipt — manage vendors, RFQs, POs, and bills."
        breadcrumbs={[{ label: 'Operations', href: '/app' }, { label: 'Procurement' }]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button asChild>
              <Link href="/app/procurement/orders"><Plus className="size-4" /> New PO</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top vendors by YTD spend</CardTitle>
              <CardDescription>Active suppliers with highest commitment</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/procurement/vendors">All vendors <ArrowRight className="size-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {topVendors.map((v) => (
              <div key={v.name} className="flex items-center gap-3">
                <Avatar size="sm"><AvatarFallback name={v.name}>{initials(v.name)}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{v.name}</span>
                    <Badge variant="outline" size="sm">{v.country}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{v.orders} POs · perf {v.performance}%</div>
                </div>
                <div className="w-40">
                  <Progress value={(v.spend / topVendors[0].spend) * 100} />
                </div>
                <div className="font-mono text-sm font-medium tabular-nums w-24 text-right">
                  {formatCompactNumber(v.spend)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category spend</CardTitle>
            <CardDescription>YTD distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              {categorySpend.map((c) => (
                <div key={c.name} style={{ width: `${c.percent}%`, backgroundColor: c.color }} />
              ))}
            </div>
            {categorySpend.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-sm" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono tabular-nums">{formatCompactNumber(c.spend)}</span>
                  <span className="text-xs text-muted-foreground w-8 text-right">{c.percent}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Requisitions awaiting approval</CardTitle>
              <CardDescription>Workflow status</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/procurement/requisitions">All <ArrowRight className="size-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead><tr><th>Number</th><th>Requester</th><th>Department</th><th className="text-right">Amount</th><th>Age</th><th>Status</th></tr></thead>
              <tbody>
                {pendingRequisitions.map((r) => (
                  <tr key={r.id}>
                    <td className="font-mono text-xs text-primary">{r.id}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar size="xs"><AvatarFallback name={r.requester}>{initials(r.requester)}</AvatarFallback></Avatar>
                        {r.requester}
                      </div>
                    </td>
                    <td className="text-muted-foreground">{r.dept}</td>
                    <td className="text-right font-mono">{formatCurrency(r.amount)}</td>
                    <td className="text-xs text-muted-foreground">{r.age}</td>
                    <td><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Expected receipts</CardTitle>
              <CardDescription>This week's deliveries</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/procurement/receipts">Receipts <ArrowRight className="size-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead><tr><th>Date</th><th>PO</th><th>Vendor</th><th className="text-right">Items</th><th className="text-right">Value</th><th>ETA</th></tr></thead>
              <tbody>
                {upcomingReceipts.map((r) => (
                  <tr key={r.po}>
                    <td className="text-xs font-medium">{r.date}</td>
                    <td className="font-mono text-xs text-primary">{r.po}</td>
                    <td className="font-medium truncate max-w-[180px]">{r.vendor}</td>
                    <td className="text-right font-mono">{r.items}</td>
                    <td className="text-right font-mono">{formatCurrency(r.value)}</td>
                    <td className="text-xs font-mono">{r.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
