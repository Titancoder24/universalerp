import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  DollarSign,
  Download,
  Fuel,
  MapPin,
  Package,
  Plus,
  Route,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, formatCurrency, formatNumber, initials } from '@/lib/utils';

const stats = [
  { label: 'Active shipments', value: 84, delta: 6.4, format: 'number' as const, icon: Truck, sparkline: [72, 74, 76, 78, 80, 82, 83, 84] },
  { label: 'On-time delivery', value: 94.2, delta: 1.4, format: 'percent' as const, icon: Clock },
  { label: 'Fuel spend MTD', value: 38420, delta: -2.8, format: 'currency' as const, icon: Fuel },
  { label: 'Avg cost/mile', value: 2.18, delta: -1.2, format: 'currency' as const, icon: DollarSign, invertTrend: true },
];

const inTransit = [
  { id: 'SH-1442', destination: 'Acme Industries · Chicago, IL', driver: 'James Cole', eta: '2h 14m', status: 'in_progress', progress: 78, stops: 4, weight: '12,400 lb', vehicle: 'TRK-018' },
  { id: 'SH-1441', destination: 'Global Manufacturing · Dallas, TX', driver: 'Maria Santos', eta: '4h 32m', status: 'in_progress', progress: 52, stops: 6, weight: '18,200 lb', vehicle: 'TRK-022' },
  { id: 'SH-1440', destination: 'TechCorp · Boston, MA', driver: 'Kevin Diaz', eta: '8h 12m', status: 'in_progress', progress: 28, stops: 3, weight: '4,800 lb', vehicle: 'VAN-005' },
  { id: 'SH-1439', destination: 'StartupCo · Phoenix, AZ', driver: 'Anna Petrov', eta: '12h 06m', status: 'in_progress', progress: 12, stops: 2, weight: '2,400 lb', vehicle: 'VAN-009' },
  { id: 'SH-1438', destination: 'Enterprise Ltd · Seattle, WA', driver: 'Hugo Park', eta: '18h 22m', status: 'in_progress', progress: 4, stops: 5, weight: '24,000 lb', vehicle: 'TRK-014' },
];

const carriers = [
  { name: 'Fleet (in-house)', shipments: 142, cost: 86200, ontime: 96 },
  { name: 'XPO Logistics', shipments: 38, cost: 42800, ontime: 94 },
  { name: 'Old Dominion', shipments: 24, cost: 28400, ontime: 92 },
  { name: 'FedEx Freight', shipments: 18, cost: 18800, ontime: 91 },
  { name: 'UPS Freight', shipments: 12, cost: 12400, ontime: 89 },
];

const exceptionShipments = [
  { id: 'SH-1428', issue: 'Delayed at customs', destination: 'EU - Berlin', delay: '2d' },
  { id: 'SH-1431', issue: 'Mechanical breakdown', destination: 'Atlanta, GA', delay: '6h' },
  { id: 'SH-1434', issue: 'Weather hold', destination: 'Denver, CO', delay: '4h' },
];

export default function LogisticsDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Logistics"
        description="Real-time visibility across shipments, carriers, and routes."
        breadcrumbs={[
          { label: 'Operations', href: '/app' },
          { label: 'Logistics' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button asChild><Link href="/app/operations/routes"><Plus className="size-4" /> Plan route</Link></Button>
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
              <CardTitle>Active shipments</CardTitle>
              <CardDescription>Live in-transit tracking</CardDescription>
            </div>
            <Badge variant="info">{inTransit.length} in transit</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {inTransit.map((s) => (
              <div key={s.id} className="space-y-2 rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-primary">{s.id}</span>
                      <Badge variant="outline" size="sm">{s.vehicle}</Badge>
                      <Badge variant="soft" size="sm">{s.stops} stops · {s.weight}</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm">
                      <MapPin className="size-3.5 text-muted-foreground" />
                      <span className="font-medium truncate">{s.destination}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-info">
                      <Clock className="size-3.5" />
                      <span className="font-medium text-sm">{s.eta}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 justify-end text-xs text-muted-foreground">
                      <Avatar size="xs"><AvatarFallback name={s.driver}>{initials(s.driver)}</AvatarFallback></Avatar>
                      {s.driver}
                    </div>
                  </div>
                </div>
                <Progress value={s.progress} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Exceptions</CardTitle><CardDescription>Shipments needing attention</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {exceptionShipments.map((e) => (
              <div key={e.id} className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-xs text-primary">{e.id}</div>
                    <div className="text-sm font-medium text-destructive">{e.issue}</div>
                    <div className="text-xs text-muted-foreground">{e.destination}</div>
                  </div>
                  <Badge variant="destructive" size="sm">+{e.delay}</Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">View all exceptions</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Carrier performance</CardTitle>
          <CardDescription>YTD shipment volume and reliability</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead><tr><th>Carrier</th><th className="text-right">Shipments</th><th className="text-right">Spend YTD</th><th className="text-right">On-time</th><th>Performance</th></tr></thead>
            <tbody>
              {carriers.map((c) => (
                <tr key={c.name}>
                  <td className="font-medium">{c.name}</td>
                  <td className="text-right font-mono">{formatNumber(c.shipments)}</td>
                  <td className="text-right font-mono">{formatCurrency(c.cost)}</td>
                  <td className={cn('text-right font-mono', c.ontime >= 95 ? 'text-success' : c.ontime >= 90 ? 'text-warning' : 'text-destructive')}>{c.ontime}%</td>
                  <td><Progress value={c.ontime} indicatorClassName={c.ontime >= 95 ? 'bg-success' : 'bg-warning'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
