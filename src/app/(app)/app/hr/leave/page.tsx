import Link from 'next/link';
import { Check, ChevronLeft, ChevronRight, Plus, Umbrella, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn, formatDate, initials } from '@/lib/utils';

const balanceCards = [
  { type: 'Vacation', remaining: 16, total: 20, color: 'bg-primary', accent: 'text-primary' },
  { type: 'Sick', remaining: 9, total: 10, color: 'bg-warning', accent: 'text-warning' },
  { type: 'Personal', remaining: 5, total: 5, color: 'bg-info', accent: 'text-info' },
  { type: 'Volunteer', remaining: 2, total: 2, color: 'bg-success', accent: 'text-success' },
];

const pending = [
  { id: 'LR-1042', name: 'Sarah Chen', type: 'Vacation', from: '2026-05-22', to: '2026-05-29', days: 5, reason: 'Family trip to Hawaii', submitted: '2 days ago' },
  { id: 'LR-1041', name: 'David Kim', type: 'Sick', from: '2026-05-16', to: '2026-05-16', days: 1, reason: 'Flu symptoms', submitted: '5 hours ago' },
  { id: 'LR-1040', name: 'Emma Thompson', type: 'Personal', from: '2026-05-19', to: '2026-05-19', days: 1, reason: 'House moving', submitted: '1 day ago' },
  { id: 'LR-1039', name: 'Carlos Mendes', type: 'Vacation', from: '2026-06-01', to: '2026-06-12', days: 8, reason: 'Wedding & honeymoon', submitted: '4 days ago' },
  { id: 'LR-1038', name: 'Hannah Bauer', type: 'Parental', from: '2026-06-15', to: '2026-09-15', days: 65, reason: 'Maternity leave', submitted: '1 week ago' },
  { id: 'LR-1037', name: 'Yuki Nakamura', type: 'Vacation', from: '2026-07-10', to: '2026-07-17', days: 5, reason: 'Visiting family in Hokkaido', submitted: '2 weeks ago' },
];

interface Booking {
  name: string;
  type: 'Vacation' | 'Sick' | 'Personal' | 'Parental';
  startCol: number;
  span: number;
  color: string;
}

const bookings: Booking[] = [
  { name: 'Liam O\'Brien', type: 'Vacation', startCol: 1, span: 5, color: 'bg-primary/15 border-primary/40 text-primary' },
  { name: 'Hannah Bauer', type: 'Sick', startCol: 3, span: 2, color: 'bg-warning/15 border-warning/40 text-warning' },
  { name: 'Sarah Chen', type: 'Vacation', startCol: 8, span: 6, color: 'bg-primary/15 border-primary/40 text-primary' },
  { name: 'David Kim', type: 'Sick', startCol: 2, span: 1, color: 'bg-warning/15 border-warning/40 text-warning' },
  { name: 'Emma Thompson', type: 'Personal', startCol: 5, span: 1, color: 'bg-info/15 border-info/40 text-info' },
  { name: 'Carlos Mendes', type: 'Vacation', startCol: 18, span: 8, color: 'bg-primary/15 border-primary/40 text-primary' },
  { name: 'Yuki Nakamura', type: 'Vacation', startCol: 14, span: 5, color: 'bg-primary/15 border-primary/40 text-primary' },
  { name: 'Diego Fernández', type: 'Personal', startCol: 21, span: 1, color: 'bg-info/15 border-info/40 text-info' },
  { name: 'Mei Lin', type: 'Vacation', startCol: 24, span: 3, color: 'bg-primary/15 border-primary/40 text-primary' },
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);

export default function LeavePage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Leave"
        description="Time off requests, balances, and team coverage"
        breadcrumbs={[{ label: 'People', href: '/app/hr' }, { label: 'Leave' }]}
        actions={
          <Button asChild>
            <Link href="/app/hr/leave/new">
              <Plus className="size-4" /> Apply for leave
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {balanceCards.map((b) => {
          const used = b.total - b.remaining;
          const pct = b.total ? (used / b.total) * 100 : 0;
          return (
            <Card key={b.type}>
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn('flex h-8 w-8 items-center justify-center rounded-md bg-muted', b.accent)}>
                      <Umbrella className="size-4" />
                    </span>
                    <span className="text-sm font-medium">{b.type}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{used}/{b.total} used</span>
                </div>
                <div>
                  <div className="text-3xl font-semibold tabular-nums">{b.remaining}</div>
                  <div className="text-xs text-muted-foreground">days available this year</div>
                </div>
                <Progress value={pct} indicatorClassName={b.color} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Team calendar · May 2026</CardTitle>
            <CardDescription>Who is on leave when, across all departments</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm"><ChevronLeft className="size-4" /></Button>
            <Button variant="outline" size="sm">Today</Button>
            <Button variant="outline" size="icon-sm"><ChevronRight className="size-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[820px]">
              <div className="mb-2 grid grid-cols-31 gap-px text-2xs text-muted-foreground" style={{ gridTemplateColumns: 'repeat(31, minmax(0, 1fr))' }}>
                {days.map((d) => {
                  const dow = (d - 1) % 7;
                  const weekend = dow === 5 || dow === 6;
                  return (
                    <div key={d} className={cn('px-1 text-center tabular-nums', weekend && 'text-destructive/70')}>
                      {d}
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2">
                {bookings.map((b, i) => (
                  <div
                    key={i}
                    className="grid items-center gap-px"
                    style={{ gridTemplateColumns: 'repeat(31, minmax(0, 1fr))' }}
                  >
                    {days.map((d) => {
                      const dow = (d - 1) % 7;
                      const weekend = dow === 5 || dow === 6;
                      const inRange = d >= b.startCol && d < b.startCol + b.span;
                      const isStart = d === b.startCol;
                      return (
                        <div
                          key={d}
                          className={cn(
                            'h-8 border border-transparent text-2xs',
                            weekend && !inRange && 'bg-muted/40',
                            inRange && cn(b.color, 'border'),
                            inRange && isStart && 'rounded-l-md pl-2',
                            inRange && d === b.startCol + b.span - 1 && 'rounded-r-md',
                          )}
                        >
                          {isStart && (
                            <div className="flex h-full items-center gap-1.5 truncate whitespace-nowrap px-1">
                              <Avatar size="xs">
                                <AvatarFallback name={b.name}>{initials(b.name)}</AvatarFallback>
                              </Avatar>
                              <span className="truncate font-medium">{b.name}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary/40" /> Vacation</div>
                <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-warning/40" /> Sick</div>
                <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-info/40" /> Personal</div>
                <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-success/40" /> Parental</div>
                <div className="ml-auto text-muted-foreground">{bookings.length} bookings · weekends shaded</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pending requests</CardTitle>
            <CardDescription>{pending.length} requests waiting on your approval</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="soft">{pending.length} pending</Badge>
            <Button variant="outline" size="sm">Bulk approve</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Request</th>
                <th>Employee</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th className="text-right">Days</th>
                <th>Reason</th>
                <th>Submitted</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((p) => (
                <tr key={p.id}>
                  <td className="font-mono text-xs font-medium text-primary">{p.id}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback name={p.name}>{initials(p.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td><Badge variant="outline">{p.type}</Badge></td>
                  <td className="text-sm">{formatDate(p.from)}</td>
                  <td className="text-sm">{formatDate(p.to)}</td>
                  <td className="text-right font-mono tabular-nums">{p.days}</td>
                  <td className="max-w-[220px] truncate text-sm text-muted-foreground">{p.reason}</td>
                  <td className="text-xs text-muted-foreground">{p.submitted}</td>
                  <td>
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="outline" size="xs"><X className="size-3" /> Reject</Button>
                      <Button variant="success" size="xs"><Check className="size-3" /> Approve</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recently approved</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { name: 'Marcus Rodriguez', type: 'Vacation', range: 'Jun 4 – Jun 11', days: 5 },
              { name: 'Aisha Khan', type: 'Personal', range: 'May 26', days: 1 },
              { name: 'Sofia Rossi', type: 'Sick', range: 'May 7 – May 8', days: 2 },
              { name: 'Naomi Park', type: 'Vacation', range: 'May 1 – May 5', days: 5 },
            ].map((r) => (
              <div key={r.name} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback name={r.name}>{initials(r.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.type} · {r.range}</div>
                  </div>
                </div>
                <StatusBadge status="approved" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Holidays · United States</CardTitle>
            <CardDescription>Public holidays for 2026</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { name: 'Memorial Day', date: '2026-05-25' },
              { name: 'Juneteenth', date: '2026-06-19' },
              { name: 'Independence Day', date: '2026-07-03' },
              { name: 'Labor Day', date: '2026-09-07' },
              { name: 'Thanksgiving Day', date: '2026-11-26' },
            ].map((h) => (
              <div key={h.name} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-col items-center justify-center rounded-md bg-primary/10 text-primary">
                    <div className="text-2xs font-medium uppercase">{new Date(h.date).toLocaleString('en', { month: 'short' })}</div>
                    <div className="text-sm font-semibold leading-none">{new Date(h.date).getDate()}</div>
                  </div>
                  <div className="text-sm font-medium">{h.name}</div>
                </div>
                <Badge variant="outline" size="sm">Paid</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
