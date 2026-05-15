import { CalendarDays, CheckCircle2, Clock, Download, Filter, MapPin, MoreHorizontal, Search, UserMinus } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn, initials } from '@/lib/utils';

const stats = [
  { label: 'Attendance rate', value: '91.6%', delta: 1.4, format: 'compact' as const, icon: CheckCircle2 },
  { label: 'Late arrivals', value: 9, deltaLabel: 'vs 14 yesterday', icon: Clock, invertTrend: true },
  { label: 'On leave', value: 14, format: 'number' as const, icon: CalendarDays },
  { label: 'Absent', value: 7, deltaLabel: 'unscheduled', icon: UserMinus, invertTrend: true },
];

interface Row {
  name: string;
  dept: string;
  location: string;
  in: string;
  out: string;
  hours: number;
  status: 'present' | 'late' | 'remote' | 'leave' | 'absent';
}

const today: Row[] = [
  { name: 'Sarah Chen', dept: 'Engineering', location: 'San Francisco HQ', in: '08:52', out: '17:21', hours: 8.48, status: 'present' },
  { name: 'Marcus Rodriguez', dept: 'Sales', location: 'New York', in: '08:31', out: '17:05', hours: 8.57, status: 'present' },
  { name: 'Priya Patel', dept: 'Customer Success', location: 'London (Remote)', in: '09:04', out: '17:30', hours: 8.43, status: 'remote' },
  { name: 'David Kim', dept: 'Engineering', location: 'San Francisco HQ', in: '09:48', out: '—', hours: 0, status: 'late' },
  { name: 'Emma Thompson', dept: 'Marketing', location: 'Chicago', in: '08:55', out: '17:12', hours: 8.28, status: 'present' },
  { name: 'Aisha Khan', dept: 'Engineering', location: 'San Francisco HQ', in: '08:12', out: '18:48', hours: 10.6, status: 'present' },
  { name: 'Hiroshi Tanaka', dept: 'Engineering', location: 'San Francisco HQ', in: '07:58', out: '17:42', hours: 9.73, status: 'present' },
  { name: 'Olivia Martinez', dept: 'Customer Success', location: 'San Francisco HQ', in: '09:11', out: '17:24', hours: 8.21, status: 'late' },
  { name: 'Liam O\'Brien', dept: 'Engineering', location: 'Dublin', in: '—', out: '—', hours: 0, status: 'leave' },
  { name: 'Sofia Rossi', dept: 'Marketing', location: 'San Francisco HQ', in: '08:48', out: '17:18', hours: 8.5, status: 'present' },
  { name: 'Ahmed Hassan', dept: 'Sales', location: 'Dubai', in: '08:24', out: '17:09', hours: 8.75, status: 'present' },
  { name: 'Yuki Nakamura', dept: 'Operations', location: 'Tokyo', in: '09:01', out: '17:55', hours: 8.9, status: 'present' },
  { name: 'Rebecca Chen', dept: 'Operations', location: 'San Francisco HQ', in: '08:36', out: '18:01', hours: 9.42, status: 'present' },
  { name: 'Felix Müller', dept: 'Sales', location: 'Berlin', in: '—', out: '—', hours: 0, status: 'absent' },
  { name: 'Naomi Park', dept: 'Human Resources', location: 'New York', in: '08:44', out: '17:30', hours: 8.77, status: 'present' },
];

const statusBadge: Record<Row['status'], React.ReactNode> = {
  present: <StatusBadge status="active" label="Present" />,
  late: <StatusBadge status="warning" label="Late" />,
  remote: <StatusBadge status="info" label="Remote" />,
  leave: <StatusBadge status="approved" label="On leave" />,
  absent: <StatusBadge status="destructive" label="Absent" />,
};

// 25 employees x 30 days heatmap
const heatmapEmployees = [
  'Sarah Chen', 'Marcus Rodriguez', 'Priya Patel', 'David Kim', 'Emma Thompson',
  'Aisha Khan', 'Hiroshi Tanaka', 'Olivia Martinez', 'Liam O\'Brien', 'Sofia Rossi',
  'Ahmed Hassan', 'Yuki Nakamura', 'Rebecca Chen', 'Felix Müller', 'Naomi Park',
  'Diego Fernández', 'Mei Lin', 'Hannah Bauer', 'Gabriel Silva', 'Ravi Sharma',
];

function pseudoRand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function heatColor(value: number) {
  if (value === 0) return 'bg-muted/40';
  if (value === 1) return 'bg-destructive/60';
  if (value === 2) return 'bg-warning/60';
  if (value === 3) return 'bg-success/40';
  return 'bg-success/80';
}

export default function AttendancePage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Attendance"
        description="Live workforce visibility across all 11 locations · May 15, 2026"
        breadcrumbs={[{ label: 'People', href: '/app/hr' }, { label: 'Attendance' }]}
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" /> Export
            </Button>
            <Button>
              <Clock className="size-4" /> Check-in entry
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Hourly check-ins</CardTitle>
            <CardDescription>Today's arrival distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-end gap-1.5">
              {[2, 5, 18, 45, 89, 52, 17, 9, 7, 4].map((v, i) => {
                const start = 6 + i;
                const pct = (v / 89) * 100;
                return (
                  <div key={i} className="group relative flex flex-1 flex-col items-center justify-end">
                    <div
                      className={cn(
                        'w-full rounded-md transition-all',
                        i === 4 ? 'bg-primary' : 'bg-primary/30 group-hover:bg-primary/50',
                      )}
                      style={{ height: `${pct}%` }}
                    />
                    <div className="mt-1 text-2xs text-muted-foreground">{start}:00</div>
                    <div className="absolute -top-7 hidden rounded-md bg-foreground px-1.5 py-0.5 text-2xs text-background group-hover:block">
                      {v}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Peak: 10:00 (89 check-ins)</span>
              <span>Avg arrival: 9:14 AM</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By department</CardTitle>
            <CardDescription>Attendance rate today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Engineering', rate: 96 },
              { name: 'Sales', rate: 88 },
              { name: 'Marketing', rate: 92 },
              { name: 'Operations', rate: 94 },
              { name: 'Customer Success', rate: 87 },
              { name: 'Finance', rate: 100 },
              { name: 'Human Resources', rate: 95 },
            ].map((d) => (
              <div key={d.name}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="font-medium tabular-nums">{d.rate}%</span>
                </div>
                <Progress
                  value={d.rate}
                  indicatorClassName={d.rate >= 95 ? 'bg-success' : d.rate >= 90 ? 'bg-primary' : 'bg-warning'}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance heatmap</CardTitle>
          <CardDescription>Last 30 days per employee · click a cell for details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <div className="mb-1 grid grid-cols-[180px_repeat(30,minmax(20px,1fr))] gap-1 text-2xs text-muted-foreground">
                <div></div>
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="text-center tabular-nums">{i + 1 < 10 ? `0${i + 1}` : i + 1}</div>
                ))}
              </div>
              {heatmapEmployees.map((emp, eIdx) => (
                <div key={emp} className="grid grid-cols-[180px_repeat(30,minmax(20px,1fr))] gap-1 py-0.5">
                  <div className="flex items-center gap-2 truncate text-xs">
                    <Avatar size="xs">
                      <AvatarFallback name={emp}>{initials(emp)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{emp}</span>
                  </div>
                  {Array.from({ length: 30 }).map((_, dIdx) => {
                    const r = pseudoRand(eIdx * 100 + dIdx);
                    const dayOfWeek = (dIdx + 1) % 7;
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                    const v = isWeekend ? 0 : r < 0.05 ? 1 : r < 0.12 ? 2 : r < 0.25 ? 3 : 4;
                    return (
                      <div
                        key={dIdx}
                        className={cn('h-5 rounded-sm transition-transform hover:scale-125', heatColor(v))}
                        title={`${emp} · Day ${dIdx + 1}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 text-xs">
            <span className="text-muted-foreground">Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((v) => (
                <div key={v} className={cn('h-3.5 w-3.5 rounded-sm', heatColor(v))} />
              ))}
            </div>
            <span className="text-muted-foreground">More</span>
            <div className="ml-auto flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-success/80" /> Full day</div>
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-warning/60" /> Late</div>
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-destructive/60" /> Absent</div>
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-muted/40" /> Off / weekend</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Today's attendance</CardTitle>
            <CardDescription>{today.length} of 248 visible · live updates</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input placeholder="Search employees..." className="w-56 pl-8" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                <SelectItem value="eng">Engineering</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="cs">Customer Success</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="today">
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon"><Filter className="size-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Location</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th className="text-right">Hours</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {today.map((r) => (
                <tr key={r.name}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback name={r.name}>{initials(r.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{r.name}</span>
                    </div>
                  </td>
                  <td><Badge variant="outline">{r.dept}</Badge></td>
                  <td className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {r.location}</span>
                  </td>
                  <td className="font-mono">{r.in}</td>
                  <td className="font-mono">{r.out}</td>
                  <td className="text-right font-mono tabular-nums">{r.hours > 0 ? r.hours.toFixed(2) : '—'}</td>
                  <td>{statusBadge[r.status]}</td>
                  <td>
                    <Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-4" /></Button>
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
