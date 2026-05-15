import {
  AlertTriangle,
  Battery,
  Download,
  Filter,
  Fuel,
  Plus,
  Search,
  Truck,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/ui/stat-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatDate, formatNumber, initials } from '@/lib/utils';

interface Vehicle {
  id: string;
  type: 'Truck' | 'Van' | 'Trailer' | 'Forklift';
  make: string;
  plate: string;
  year: number;
  mileage: number;
  fuel: number;
  driver: string | null;
  status: 'active' | 'maintenance' | 'inactive' | 'in_progress';
  nextService: string;
  serviceMiles: number;
  location: string;
}

const fleet: Vehicle[] = [
  { id: 'TRK-018', type: 'Truck', make: 'Volvo VNL 760', plate: 'IL-FRT-0184', year: 2024, mileage: 84210, fuel: 78, driver: 'James Cole', status: 'in_progress', nextService: '2026-06-20', serviceMiles: 4200, location: 'Chicago, IL' },
  { id: 'TRK-022', type: 'Truck', make: 'Freightliner Cascadia', plate: 'TX-FRT-0822', year: 2023, mileage: 142840, fuel: 62, driver: 'Maria Santos', status: 'in_progress', nextService: '2026-05-28', serviceMiles: 800, location: 'Dallas, TX' },
  { id: 'TRK-014', type: 'Truck', make: 'Kenworth T680', plate: 'AZ-FRT-0144', year: 2022, mileage: 198420, fuel: 42, driver: 'Hugo Park', status: 'in_progress', nextService: '2026-06-04', serviceMiles: 2400, location: 'Phoenix, AZ' },
  { id: 'TRK-008', type: 'Truck', make: 'Volvo VNL 740', plate: 'GA-FRT-0084', year: 2023, mileage: 124200, fuel: 88, driver: null, status: 'active', nextService: '2026-07-15', serviceMiles: 6800, location: 'Atlanta, GA' },
  { id: 'VAN-005', type: 'Van', make: 'Ford Transit 350', plate: 'IL-VAN-0050', year: 2024, mileage: 38420, fuel: 92, driver: 'Kevin Diaz', status: 'in_progress', nextService: '2026-07-22', serviceMiles: 7200, location: 'Chicago, IL' },
  { id: 'VAN-009', type: 'Van', make: 'Mercedes Sprinter', plate: 'AZ-VAN-0090', year: 2024, mileage: 28840, fuel: 84, driver: 'Anna Petrov', status: 'in_progress', nextService: '2026-08-04', serviceMiles: 8400, location: 'Phoenix, AZ' },
  { id: 'VAN-012', type: 'Van', make: 'Ford Transit Connect', plate: 'TX-VAN-0120', year: 2022, mileage: 88420, fuel: 28, driver: null, status: 'maintenance', nextService: '2026-05-16', serviceMiles: 0, location: 'WH-Dallas' },
  { id: 'TRL-004', type: 'Trailer', make: 'Great Dane 53ft Reefer', plate: 'IL-TRL-0044', year: 2021, mileage: 220140, fuel: 0, driver: null, status: 'active', nextService: '2026-06-12', serviceMiles: 3200, location: 'Chicago, IL' },
  { id: 'TRL-007', type: 'Trailer', make: 'Wabash 53ft Dry Van', plate: 'IL-TRL-0074', year: 2020, mileage: 286400, fuel: 0, driver: null, status: 'inactive', nextService: '2026-05-22', serviceMiles: 0, location: 'WH-Chicago' },
  { id: 'FRK-001', type: 'Forklift', make: 'Toyota 8FGCU25', plate: 'INT-001', year: 2023, mileage: 4280, fuel: 68, driver: 'M. Tao', status: 'in_progress', nextService: '2026-06-30', serviceMiles: 240, location: 'WH-Chicago' },
  { id: 'FRK-002', type: 'Forklift', make: 'Hyster H50FT', plate: 'INT-002', year: 2022, mileage: 8420, fuel: 54, driver: null, status: 'active', nextService: '2026-07-18', serviceMiles: 480, location: 'WH-Dallas' },
];

const typeIcons: Record<string, any> = {
  Truck: Truck,
  Van: Truck,
  Trailer: Truck,
  Forklift: Truck,
};

export default function FleetPage() {
  const activeCount = fleet.filter((v) => v.status === 'in_progress' || v.status === 'active').length;
  const maintenanceCount = fleet.filter((v) => v.status === 'maintenance').length;
  const utilization = (fleet.filter((v) => v.status === 'in_progress').length / fleet.length) * 100;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Fleet"
        description={`${fleet.length} vehicles · ${activeCount} active · ${maintenanceCount} in service`}
        breadcrumbs={[
          { label: 'Operations', href: '/app' },
          { label: 'Fleet' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> Add vehicle</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Fleet size" value={fleet.length} format="number" />
        <StatCard label="Utilization" value={Math.round(utilization)} format="percent" delta={4.2} />
        <StatCard label="Due for service" value={fleet.filter((v) => v.serviceMiles < 2000 && v.serviceMiles > 0).length} format="number" invertTrend />
        <StatCard label="Out of service" value={maintenanceCount + fleet.filter((v) => v.status === 'inactive').length} format="number" invertTrend />
      </div>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="all">All <Badge variant="soft" size="sm" className="ml-1">{fleet.length}</Badge></TabsTrigger>
            <TabsTrigger value="trucks">Trucks</TabsTrigger>
            <TabsTrigger value="vans">Vans</TabsTrigger>
            <TabsTrigger value="trailers">Trailers</TabsTrigger>
            <TabsTrigger value="forklifts">Forklifts</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="pl-8 w-64" placeholder="Search vehicle, plate, driver…" />
            </div>
            <Select>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">In service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all">
          <Card className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Make / Model</th>
                  <th>Plate</th>
                  <th className="text-right">Year</th>
                  <th className="text-right">Mileage</th>
                  <th>Fuel</th>
                  <th>Driver</th>
                  <th>Location</th>
                  <th>Next service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fleet.map((v) => {
                  const Icon = typeIcons[v.type];
                  const serviceClose = v.serviceMiles < 2000 && v.serviceMiles > 0;
                  const overdue = v.serviceMiles === 0 && v.status !== 'inactive';
                  return (
                    <tr key={v.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'flex size-8 items-center justify-center rounded-md',
                            v.type === 'Truck' && 'bg-primary/10 text-primary',
                            v.type === 'Van' && 'bg-info/10 text-info',
                            v.type === 'Trailer' && 'bg-warning/10 text-warning',
                            v.type === 'Forklift' && 'bg-success/10 text-success',
                          )}>
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <div className="font-mono text-xs font-medium text-primary">{v.id}</div>
                            <div className="text-xs text-muted-foreground">{v.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="font-medium">{v.make}</td>
                      <td className="font-mono text-xs">{v.plate}</td>
                      <td className="text-right">{v.year}</td>
                      <td className="text-right font-mono">{formatNumber(v.mileage)}</td>
                      <td>
                        {v.type === 'Trailer' ? <span className="text-xs text-muted-foreground">N/A</span> : (
                          <div className="flex items-center gap-2">
                            <Fuel className={cn('size-3.5', v.fuel < 30 ? 'text-destructive' : v.fuel < 50 ? 'text-warning' : 'text-muted-foreground')} />
                            <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                              <div className={cn('h-full', v.fuel < 30 ? 'bg-destructive' : v.fuel < 50 ? 'bg-warning' : 'bg-success')} style={{ width: `${v.fuel}%` }} />
                            </div>
                            <span className="font-mono text-xs">{v.fuel}%</span>
                          </div>
                        )}
                      </td>
                      <td className="text-xs">
                        {v.driver ? (
                          <div className="flex items-center gap-1.5">
                            <Avatar size="xs"><AvatarFallback name={v.driver}>{initials(v.driver)}</AvatarFallback></Avatar>
                            {v.driver}
                          </div>
                        ) : <span className="text-muted-foreground">Unassigned</span>}
                      </td>
                      <td className="text-xs">{v.location}</td>
                      <td className={cn('text-xs', serviceClose && 'text-warning font-medium', overdue && 'text-destructive font-medium')}>
                        {serviceClose && <AlertTriangle className="inline size-3 mr-1" />}
                        {formatDate(v.nextService)}
                      </td>
                      <td><StatusBadge status={v.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
