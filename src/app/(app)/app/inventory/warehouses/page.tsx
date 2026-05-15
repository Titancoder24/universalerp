'use client';

import Link from 'next/link';
import {
  Building2,
  Filter,
  Layers,
  Map,
  MapPin,
  Phone,
  Plus,
  Search,
  TableProperties,
  User,
  Warehouse as WarehouseIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatNumber, initials } from '@/lib/utils';

interface Warehouse {
  id: string;
  code: string;
  name: string;
  type: string;
  address: string;
  city: string;
  manager: string;
  phone: string;
  items: number;
  bins: number;
  value: number;
  utilization: number;
}

const warehouses: Warehouse[] = [
  { id: 'WH-CHI', code: 'WH-CHI-01', name: 'Chicago Main DC', type: 'Distribution', address: '420 W Madison St', city: 'Chicago, IL', manager: 'Aisha Nakamura', phone: '+1 312 555 0142', items: 1840, bins: 480, value: 3120000, utilization: 78 },
  { id: 'WH-DAL', code: 'WH-DAL-01', name: 'Dallas Regional', type: 'Regional', address: '1480 Industrial Blvd', city: 'Dallas, TX', manager: 'Carlos Mendoza', phone: '+1 214 555 0188', items: 1120, bins: 320, value: 2080000, utilization: 64 },
  { id: 'WH-PHX', code: 'WH-PHX-01', name: 'Phoenix Western Hub', type: 'Distribution', address: '801 S 7th Ave', city: 'Phoenix, AZ', manager: 'Devon Tasker', phone: '+1 602 555 0233', items: 690, bins: 240, value: 1380000, utilization: 42 },
  { id: 'WH-ATL', code: 'WH-ATL-01', name: 'Atlanta Eastern', type: 'Distribution', address: '2100 Logistics Pkwy', city: 'Atlanta, GA', manager: 'Priya Khatri', phone: '+1 404 555 0167', items: 540, bins: 280, value: 1240000, utilization: 56 },
  { id: 'WH-EWR', code: 'WH-EWR-01', name: 'Newark Cross-dock', type: 'Cross-dock', address: '300 Port St', city: 'Newark, NJ', manager: 'Liam Rourke', phone: '+1 973 555 0419', items: 77, bins: 60, value: 600590, utilization: 89 },
  { id: 'WH-SEA', code: 'WH-SEA-01', name: 'Seattle North', type: 'Regional', address: '12 Pier Way', city: 'Seattle, WA', manager: 'Mira Holloway', phone: '+1 206 555 0721', items: 320, bins: 140, value: 720400, utilization: 51 },
  { id: 'WH-MIA', code: 'WH-MIA-01', name: 'Miami International', type: 'Bonded', address: '8800 NW 36th St', city: 'Miami, FL', manager: 'Diego Salas', phone: '+1 305 555 0682', items: 410, bins: 180, value: 940200, utilization: 67 },
];

export default function WarehousesPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Warehouses"
        description={`${warehouses.length} active facilities · ${formatNumber(warehouses.reduce((a, w) => a + w.items, 0))} SKUs tracked`}
        breadcrumbs={[
          { label: 'Inventory', href: '/app/inventory' },
          { label: 'Warehouses' },
        ]}
        actions={
          <>
            <Button variant="outline"><Map className="size-4" /> Map view</Button>
            <Button><Plus className="size-4" /> New warehouse</Button>
          </>
        }
      />

      <Tabs defaultValue="cards">
        <div className="flex items-center justify-between gap-3">
          <TabsList variant="pills">
            <TabsTrigger variant="pills" value="cards"><Layers className="size-4" /> Cards</TabsTrigger>
            <TabsTrigger variant="pills" value="map"><Map className="size-4" /> Map</TabsTrigger>
            <TabsTrigger variant="pills" value="table"><TableProperties className="size-4" /> Table</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="pl-8 w-64" placeholder="Search warehouse, city, manager…" />
            </div>
            <Button variant="outline" size="sm"><Filter className="size-4" /> Filter</Button>
          </div>
        </div>

        <TabsContent value="cards">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {warehouses.map((w) => (
              <Card key={w.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="border-b border-border bg-muted/30 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <WarehouseIcon className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <Link href={`/app/inventory/warehouses/${w.id}`} className="block truncate font-semibold hover:text-primary">{w.name}</Link>
                        <div className="font-mono text-xs text-muted-foreground">{w.code}</div>
                      </div>
                    </div>
                    <Badge variant="outline" size="sm">{w.type}</Badge>
                  </div>
                </div>
                <CardContent className="space-y-4 p-4">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="mt-0.5 size-3.5 shrink-0" />
                      <div>
                        <div>{w.address}</div>
                        <div>{w.city}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="size-3.5" />
                      <span>{w.manager}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="size-3.5" />
                      <span className="font-mono text-xs">{w.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Utilization</span>
                      <span className="font-medium">{w.utilization}%</span>
                    </div>
                    <Progress
                      value={w.utilization}
                      indicatorClassName={
                        w.utilization > 85 ? 'bg-destructive' : w.utilization > 70 ? 'bg-warning' : 'bg-primary'
                      }
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-border pt-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Items</div>
                      <div className="font-mono text-sm font-semibold">{formatNumber(w.items)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Bins</div>
                      <div className="font-mono text-sm font-semibold">{formatNumber(w.bins)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Value</div>
                      <div className="font-mono text-sm font-semibold">{formatCurrency(w.value).replace('.00', '')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardContent className="p-0">
              <div className="relative flex h-[420px] items-center justify-center overflow-hidden rounded-lg bg-muted/30">
                <div className="absolute inset-0 opacity-50" style={{
                  backgroundImage:
                    'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />
                {warehouses.map((w, idx) => (
                  <div
                    key={w.id}
                    className="absolute"
                    style={{
                      left: `${15 + (idx * 11) % 70}%`,
                      top: `${20 + (idx * 17) % 60}%`,
                    }}
                  >
                    <div className="group relative">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20">
                        <WarehouseIcon className="size-5" />
                      </div>
                      <div className="absolute left-12 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-popover px-3 py-2 shadow-md group-hover:block z-10">
                        <div className="text-sm font-medium">{w.name}</div>
                        <div className="text-xs text-muted-foreground">{w.city}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-4 right-4 rounded-md border border-border bg-background/80 p-3 text-xs backdrop-blur">
                  <div className="font-medium">{warehouses.length} locations</div>
                  <div className="text-muted-foreground">Hover pins for details</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table">
          <Card className="p-0">
            <table className="erp-table">
              <thead>
                <tr><th>Code</th><th>Name</th><th>Type</th><th>City</th><th>Manager</th><th className="text-right">Items</th><th className="text-right">Bins</th><th className="text-right">Value</th><th className="text-right">Util.</th></tr>
              </thead>
              <tbody>
                {warehouses.map((w) => (
                  <tr key={w.id}>
                    <td className="font-mono text-xs text-primary"><Link href={`/app/inventory/warehouses/${w.id}`} className="hover:underline">{w.code}</Link></td>
                    <td className="font-medium">{w.name}</td>
                    <td><Badge variant="outline" size="sm">{w.type}</Badge></td>
                    <td>{w.city}</td>
                    <td className="flex items-center gap-2"><Avatar size="xs"><AvatarFallback name={w.manager}>{initials(w.manager)}</AvatarFallback></Avatar>{w.manager}</td>
                    <td className="text-right font-mono">{formatNumber(w.items)}</td>
                    <td className="text-right font-mono">{formatNumber(w.bins)}</td>
                    <td className="text-right font-mono">{formatCurrency(w.value)}</td>
                    <td className="text-right font-medium">{w.utilization}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
