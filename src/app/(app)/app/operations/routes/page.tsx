import {
  ArrowRight,
  Clock,
  Download,
  Filter,
  MapPin,
  Navigation,
  Plus,
  Route as RouteIcon,
  Search,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatCard } from '@/components/ui/stat-card';
import { cn, formatDate, initials } from '@/lib/utils';

interface RoutePlan {
  id: string;
  date: string;
  origin: string;
  driver: string;
  vehicle: string;
  stops: { name: string; address: string; time: string; status: 'pending' | 'arrived' | 'completed' }[];
  miles: number;
  hours: number;
  status: 'planned' | 'in_progress' | 'completed';
}

const routes: RoutePlan[] = [
  {
    id: 'RT-2026-0418', date: '2026-05-15', origin: 'WH-CHI Main DC', driver: 'James Cole', vehicle: 'TRK-018',
    miles: 184, hours: 8,
    status: 'in_progress',
    stops: [
      { name: 'Acme Industries', address: '420 Industry Blvd, Aurora, IL', time: '09:00', status: 'completed' },
      { name: 'Northwind Tools', address: '880 Trade Way, Naperville, IL', time: '10:30', status: 'completed' },
      { name: 'Global Mfg Aurora', address: '124 Steel St, Aurora, IL', time: '11:45', status: 'arrived' },
      { name: 'TechCorp HQ', address: '2200 Innovation Dr, Chicago, IL', time: '14:00', status: 'pending' },
      { name: 'StartupCo Loop', address: '88 Wabash Ave, Chicago, IL', time: '15:30', status: 'pending' },
    ],
  },
  {
    id: 'RT-2026-0419', date: '2026-05-15', origin: 'WH-DAL Regional', driver: 'Maria Santos', vehicle: 'TRK-022',
    miles: 312, hours: 10,
    status: 'in_progress',
    stops: [
      { name: 'Plano Industrial', address: '1200 Park Blvd, Plano, TX', time: '08:00', status: 'completed' },
      { name: 'Fort Worth Mfg', address: '450 Vickery St, Fort Worth, TX', time: '10:00', status: 'completed' },
      { name: 'Arlington Distribution', address: '780 Cooper, Arlington, TX', time: '11:30', status: 'arrived' },
      { name: 'Mesquite Storage', address: '8800 Town East, Mesquite, TX', time: '13:30', status: 'pending' },
      { name: 'Garland HQ', address: '440 Walnut St, Garland, TX', time: '15:00', status: 'pending' },
      { name: 'Irving Tech Park', address: '120 Las Colinas, Irving, TX', time: '16:30', status: 'pending' },
    ],
  },
  {
    id: 'RT-2026-0420', date: '2026-05-16', origin: 'WH-CHI Main DC', driver: 'Kevin Diaz', vehicle: 'VAN-005',
    miles: 96, hours: 6,
    status: 'planned',
    stops: [
      { name: 'Customer A', address: 'Schaumburg, IL', time: '09:00', status: 'pending' },
      { name: 'Customer B', address: 'Wheeling, IL', time: '10:30', status: 'pending' },
      { name: 'Customer C', address: 'Buffalo Grove, IL', time: '11:45', status: 'pending' },
    ],
  },
  {
    id: 'RT-2026-0417', date: '2026-05-14', origin: 'WH-PHX Western', driver: 'Anna Petrov', vehicle: 'TRK-014',
    miles: 248, hours: 9,
    status: 'completed',
    stops: [
      { name: 'Tucson Distribution', address: 'Tucson, AZ', time: '08:00', status: 'completed' },
      { name: 'Mesa Industrial', address: 'Mesa, AZ', time: '12:00', status: 'completed' },
      { name: 'Scottsdale Office', address: 'Scottsdale, AZ', time: '14:30', status: 'completed' },
    ],
  },
];

export default function RoutePlanningPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Route planning"
        description="Multi-stop route optimization with live driver tracking"
        breadcrumbs={[
          { label: 'Operations', href: '/app' },
          { label: 'Routes' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New route</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active routes" value={routes.filter((r) => r.status === 'in_progress').length} format="number" />
        <StatCard label="Planned today" value={routes.filter((r) => r.date === '2026-05-15').length} format="number" />
        <StatCard label="Total miles today" value={routes.filter((r) => r.date === '2026-05-15').reduce((a, r) => a + r.miles, 0)} format="number" />
        <StatCard label="Avg stops/route" value={4.4} delta={0.2} />
      </div>

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative max-w-sm flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="pl-8" placeholder="Search routes, drivers, vehicles…" />
            </div>
            <Button variant="outline" size="sm"><Filter className="size-4" /> Filter</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {routes.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <RouteIcon className="size-4 text-primary" />
                  <span className="font-mono text-xs text-primary">{r.id}</span>
                  <Badge variant="outline" size="sm">{r.vehicle}</Badge>
                </div>
                <CardTitle className="mt-1 text-base">{formatDate(r.date)} · {r.miles} mi · ~{r.hours}h</CardTitle>
                <CardDescription>From {r.origin}</CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={r.status} />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Avatar size="xs"><AvatarFallback name={r.driver}>{initials(r.driver)}</AvatarFallback></Avatar>
                  {r.driver}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-3">
                <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
                {r.stops.map((s, i) => (
                  <div key={i} className="relative flex items-start gap-3">
                    <div className={cn(
                      'relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full ring-4 ring-background text-xs font-medium',
                      s.status === 'completed' && 'bg-success text-success-foreground',
                      s.status === 'arrived' && 'bg-info text-info-foreground animate-pulse',
                      s.status === 'pending' && 'bg-muted text-muted-foreground border border-border',
                    )}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm">{s.name}</span>
                        <span className="font-mono text-xs text-muted-foreground">{s.time}</span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{s.address}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
