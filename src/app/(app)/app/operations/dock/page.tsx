import {
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Plus,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { StatCard } from '@/components/ui/stat-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatDate, initials } from '@/lib/utils';

interface Appointment {
  dock: string;
  time: string;
  duration: number; // in hours
  type: 'inbound' | 'outbound' | 'crossdock';
  vendor: string;
  reference: string;
  status: 'scheduled' | 'arrived' | 'in_progress' | 'completed';
}

const docks = ['D-01', 'D-02', 'D-03', 'D-04', 'D-05', 'D-06', 'D-07', 'D-08'];
const hours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const appointments: Appointment[] = [
  { dock: 'D-01', time: '07:00', duration: 1.5, type: 'inbound', vendor: 'Apex Industrial', reference: 'PO-1204', status: 'completed' },
  { dock: 'D-01', time: '09:00', duration: 2, type: 'inbound', vendor: 'Shenzhen Tek', reference: 'PO-1203', status: 'completed' },
  { dock: 'D-01', time: '13:00', duration: 1, type: 'outbound', vendor: 'Acme Industries', reference: 'SO-3217', status: 'in_progress' },
  { dock: 'D-02', time: '08:00', duration: 2, type: 'inbound', vendor: 'EuroFasteners', reference: 'PO-1198', status: 'completed' },
  { dock: 'D-02', time: '11:00', duration: 1.5, type: 'crossdock', vendor: 'Transit hub', reference: 'TR-512', status: 'completed' },
  { dock: 'D-02', time: '15:00', duration: 2, type: 'outbound', vendor: 'Global Mfg', reference: 'SO-3219', status: 'scheduled' },
  { dock: 'D-03', time: '09:00', duration: 1, type: 'outbound', vendor: 'TechCorp', reference: 'SO-3214', status: 'completed' },
  { dock: 'D-03', time: '12:00', duration: 2, type: 'inbound', vendor: 'AirGuard Co', reference: 'PO-1202', status: 'in_progress' },
  { dock: 'D-03', time: '16:00', duration: 1.5, type: 'outbound', vendor: 'StartupCo', reference: 'SO-3220', status: 'scheduled' },
  { dock: 'D-04', time: '07:00', duration: 2.5, type: 'inbound', vendor: 'Petrolab Inc', reference: 'PO-1200', status: 'completed' },
  { dock: 'D-04', time: '14:00', duration: 1, type: 'outbound', vendor: 'Enterprise Ltd', reference: 'SO-3221', status: 'arrived' },
  { dock: 'D-05', time: '08:00', duration: 1.5, type: 'crossdock', vendor: 'Multi-stop run', reference: 'RT-0418', status: 'completed' },
  { dock: 'D-05', time: '11:00', duration: 2, type: 'inbound', vendor: 'ColorMax AG', reference: 'PO-1196', status: 'completed' },
  { dock: 'D-06', time: '09:00', duration: 1, type: 'outbound', vendor: 'TechCorp', reference: 'SO-3215', status: 'completed' },
  { dock: 'D-06', time: '13:00', duration: 2, type: 'inbound', vendor: 'PowerCells', reference: 'PO-1197', status: 'completed' },
  { dock: 'D-07', time: '10:00', duration: 1.5, type: 'outbound', vendor: 'Acme Industries', reference: 'SO-3218', status: 'completed' },
  { dock: 'D-07', time: '15:00', duration: 2, type: 'inbound', vendor: 'CableNet', reference: 'PO-1199', status: 'scheduled' },
  { dock: 'D-08', time: '07:00', duration: 1, type: 'outbound', vendor: 'Ship-out wave A', reference: 'WAVE-082', status: 'completed' },
  { dock: 'D-08', time: '10:00', duration: 1.5, type: 'outbound', vendor: 'Ship-out wave B', reference: 'WAVE-083', status: 'in_progress' },
  { dock: 'D-08', time: '14:00', duration: 2, type: 'outbound', vendor: 'Ship-out wave C', reference: 'WAVE-084', status: 'scheduled' },
];

const typeColors: Record<string, string> = {
  inbound: 'bg-success/15 border-success/40 text-success',
  outbound: 'bg-info/15 border-info/40 text-info',
  crossdock: 'bg-warning/15 border-warning/40 text-warning',
};

export default function DockSchedulingPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Dock scheduling"
        description="Daily appointment calendar for inbound, outbound, and cross-dock operations"
        breadcrumbs={[
          { label: 'Operations', href: '/app' },
          { label: 'Dock' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> Book slot</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Inbound today" value={appointments.filter((a) => a.type === 'inbound').length} format="number" />
        <StatCard label="Outbound today" value={appointments.filter((a) => a.type === 'outbound').length} format="number" />
        <StatCard label="Dock utilization" value={68} format="percent" delta={4.2} />
        <StatCard label="Avg turnaround" value={1.4} deltaLabel="hrs" />
      </div>

      <Tabs defaultValue="schedule">
        <div className="flex items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="schedule"><Calendar className="size-4" /> Schedule</TabsTrigger>
            <TabsTrigger value="list">List view</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm"><ChevronLeft className="size-4" /></Button>
            <span className="text-sm font-medium">Thu · May 15, 2026 · WH-Chicago</span>
            <Button variant="outline" size="icon-sm"><ChevronRight className="size-4" /></Button>
            <Button variant="outline" size="sm">Today</Button>
          </div>
        </div>

        <TabsContent value="schedule">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  <div className="grid grid-cols-[80px_repeat(12,minmax(70px,1fr))] border-b border-border bg-muted/30">
                    <div className="border-r border-border p-2 text-xs font-medium text-muted-foreground">Dock</div>
                    {hours.map((h) => (
                      <div key={h} className="border-r border-border p-2 text-xs font-mono text-muted-foreground last:border-r-0">{h}</div>
                    ))}
                  </div>
                  {docks.map((d) => (
                    <div key={d} className="grid grid-cols-[80px_repeat(12,minmax(70px,1fr))] border-b border-border last:border-b-0">
                      <div className="border-r border-border p-2 text-sm font-medium">
                        <Truck className="inline size-3.5 mr-1 text-muted-foreground" />
                        {d}
                      </div>
                      <div className="col-span-12 relative h-16">
                        <div className="absolute inset-0 grid grid-cols-12">
                          {hours.map((h, idx) => (
                            <div key={`${d}-${h}`} className={cn('border-r border-border', idx === hours.length - 1 && 'border-r-0')} />
                          ))}
                        </div>
                        {appointments
                          .filter((a) => a.dock === d)
                          .map((a, i) => {
                            const startHour = parseInt(a.time.split(':')[0]);
                            const startIdx = startHour - 7;
                            return (
                              <div
                                key={i}
                                className={cn(
                                  'absolute top-1.5 bottom-1.5 rounded border-l-2 px-2 py-1 text-xs overflow-hidden',
                                  typeColors[a.type],
                                  a.status === 'completed' && 'opacity-50',
                                )}
                                style={{
                                  left: `${(startIdx / 12) * 100}%`,
                                  width: `${(a.duration / 12) * 100}%`,
                                }}
                              >
                                <div className="flex items-center gap-1 truncate">
                                  {a.type === 'inbound' && <ArrowDown className="size-3" />}
                                  {a.type === 'outbound' && <ArrowUp className="size-3" />}
                                  <span className="truncate font-medium">{a.vendor}</span>
                                </div>
                                <div className="truncate font-mono text-[10px] opacity-80">{a.reference}</div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 border-t border-border p-4 text-xs">
                <div className="flex items-center gap-1.5"><div className={cn('h-3 w-6 rounded border-l-2', typeColors.inbound)} /> Inbound</div>
                <div className="flex items-center gap-1.5"><div className={cn('h-3 w-6 rounded border-l-2', typeColors.outbound)} /> Outbound</div>
                <div className="flex items-center gap-1.5"><div className={cn('h-3 w-6 rounded border-l-2', typeColors.crossdock)} /> Cross-dock</div>
                <div className="ml-auto text-muted-foreground">{appointments.length} appointments today</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card className="p-0">
            <table className="erp-table">
              <thead>
                <tr><th>Time</th><th>Duration</th><th>Dock</th><th>Type</th><th>Vendor / Customer</th><th>Reference</th><th>Status</th></tr>
              </thead>
              <tbody>
                {appointments.sort((a, b) => a.time.localeCompare(b.time)).map((a, i) => (
                  <tr key={i}>
                    <td className="font-mono text-xs">{a.time}</td>
                    <td className="text-xs text-muted-foreground">{a.duration}h</td>
                    <td className="font-mono text-xs font-medium">{a.dock}</td>
                    <td>
                      <Badge variant={a.type === 'inbound' ? 'success' : a.type === 'outbound' ? 'info' : 'warning'} size="sm">
                        {a.type === 'inbound' && <ArrowDown className="size-3" />}
                        {a.type === 'outbound' && <ArrowUp className="size-3" />}
                        {a.type}
                      </Badge>
                    </td>
                    <td className="font-medium">{a.vendor}</td>
                    <td className="font-mono text-xs text-primary">{a.reference}</td>
                    <td><StatusBadge status={a.status} /></td>
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
