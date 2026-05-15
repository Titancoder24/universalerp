'use client';

import * as React from 'react';
import { Check, ChevronLeft, ChevronRight, Clock, Download, Filter, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { cn, initials } from '@/lib/utils';

interface DayEntry {
  hours: number;
  project?: string;
}

interface EmpRow {
  id: string;
  name: string;
  role: string;
  days: DayEntry[];
  status: 'draft' | 'pending' | 'approved' | 'rejected';
}

const weekDays = [
  { label: 'Mon', date: '05-11' },
  { label: 'Tue', date: '05-12' },
  { label: 'Wed', date: '05-13' },
  { label: 'Thu', date: '05-14' },
  { label: 'Fri', date: '05-15' },
  { label: 'Sat', date: '05-16' },
  { label: 'Sun', date: '05-17' },
];

const employees: EmpRow[] = [
  { id: 'e1', name: 'Sarah Chen', role: 'Senior AE', status: 'approved', days: [{ hours: 8 }, { hours: 8 }, { hours: 8 }, { hours: 8 }, { hours: 8 }, { hours: 0 }, { hours: 0 }] },
  { id: 'e2', name: 'Dmitri Volkov', role: 'Senior Engineer', status: 'pending', days: [{ hours: 9 }, { hours: 9 }, { hours: 8 }, { hours: 7.5 }, { hours: 8.5 }, { hours: 2 }, { hours: 0 }] },
  { id: 'e3', name: 'Lena Park', role: 'VP Design', status: 'approved', days: [{ hours: 8 }, { hours: 8 }, { hours: 9 }, { hours: 8 }, { hours: 7 }, { hours: 0 }, { hours: 0 }] },
  { id: 'e4', name: 'Akira Tanaka', role: 'Engineer', status: 'pending', days: [{ hours: 8 }, { hours: 8 }, { hours: 8 }, { hours: 8 }, { hours: 8 }, { hours: 0 }, { hours: 0 }] },
  { id: 'e5', name: 'Maria Santos', role: 'QA Manager', status: 'approved', days: [{ hours: 8 }, { hours: 8 }, { hours: 8 }, { hours: 8 }, { hours: 8 }, { hours: 0 }, { hours: 0 }] },
  { id: 'e6', name: 'Hannah Klein', role: 'Director QA', status: 'pending', days: [{ hours: 8 }, { hours: 8.5 }, { hours: 9 }, { hours: 8 }, { hours: 0 }, { hours: 0 }, { hours: 0 }] },
  { id: 'e7', name: 'Jamal Reed', role: 'Marketing Lead', status: 'draft', days: [{ hours: 7 }, { hours: 8 }, { hours: 0 }, { hours: 0 }, { hours: 0 }, { hours: 0 }, { hours: 0 }] },
  { id: 'e8', name: 'Priya Khanna', role: 'Designer', status: 'rejected', days: [{ hours: 8 }, { hours: 6 }, { hours: 8 }, { hours: 8 }, { hours: 8 }, { hours: 0 }, { hours: 0 }] },
  { id: 'e9', name: 'James Wright', role: 'Account Manager', status: 'approved', days: [{ hours: 8 }, { hours: 8 }, { hours: 8 }, { hours: 8 }, { hours: 8 }, { hours: 4 }, { hours: 0 }] },
  { id: 'e10', name: 'Maya Patel', role: 'Product Manager', status: 'pending', days: [{ hours: 9 }, { hours: 9 }, { hours: 8 }, { hours: 9 }, { hours: 8 }, { hours: 0 }, { hours: 0 }] },
];

export default function TimesheetsPage() {
  const totalHours = employees.reduce((s, e) => s + e.days.reduce((d, x) => d + x.hours, 0), 0);
  const pending = employees.filter((e) => e.status === 'pending').length;
  const billable = totalHours * 0.78;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Team timesheets"
        description="Week of May 11-17, 2026"
        breadcrumbs={[{ label: 'HR', href: '/app/hr' }, { label: 'Timesheets' }]}
        actions={
          <>
            <Button variant="outline" size="sm"><Filter className="size-4" /> Filter</Button>
            <Button variant="outline" size="sm"><Download className="size-4" /> Export</Button>
            <Button size="sm"><Send className="size-4" /> Send reminders</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total hours logged" value={totalHours} format="number" delta={4.2} icon={Clock} />
        <StatCard label="Pending approval" value={pending} format="number" trend="flat" deltaLabel="requires action" />
        <StatCard label="Billable hours" value={Math.round(billable)} format="number" delta={6.4} />
        <StatCard label="Utilization" value={87.5} format="percent" delta={2.1} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm"><ChevronLeft className="size-4" /></Button>
            <CardTitle className="text-base">Week of May 11 - 17, 2026</CardTitle>
            <Button variant="outline" size="icon-sm"><ChevronRight className="size-4" /></Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Period: 2026-W20</Badge>
            <Badge variant="outline">Approval window closes Fri 5pm</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/20">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sticky left-0 bg-muted/30">Employee</th>
                  {weekDays.map((d) => (
                    <th key={d.date} className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <div>{d.label}</div>
                      <div className="text-2xs font-normal opacity-70">{d.date}</div>
                    </th>
                  ))}
                  <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Total</th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</th>
                  <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => {
                  const total = e.days.reduce((s, d) => s + d.hours, 0);
                  return (
                    <tr key={e.id} className="border-b">
                      <td className="px-3 py-2 sticky left-0 bg-card">
                        <div className="flex items-center gap-2">
                          <Avatar size="xs"><AvatarFallback>{initials(e.name)}</AvatarFallback></Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{e.name}</p>
                            <p className="text-xs text-muted-foreground">{e.role}</p>
                          </div>
                        </div>
                      </td>
                      {e.days.map((d, idx) => (
                        <td key={idx} className="px-3 py-2 text-center">
                          <div className={cn('mx-auto inline-flex h-9 w-12 items-center justify-center rounded-md text-sm tabular-nums', d.hours === 0 && 'text-muted-foreground/50', d.hours > 8 && 'bg-warning/10 text-warning font-medium', d.hours > 0 && d.hours <= 8 && 'bg-muted/30')}>
                            {d.hours > 0 ? d.hours : '—'}
                          </div>
                        </td>
                      ))}
                      <td className="px-3 py-2 text-right font-mono font-semibold tabular-nums">{total}h</td>
                      <td className="px-3 py-2"><StatusBadge status={e.status} /></td>
                      <td className="px-3 py-2">
                        {e.status === 'pending' ? (
                          <div className="flex justify-end gap-1">
                            <Button variant="outline" size="icon-xs"><Check className="size-3" /></Button>
                            <Button variant="outline" size="icon-xs"><X className="size-3" /></Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-muted/30 border-t-2">
                <tr>
                  <td className="px-3 py-2 sticky left-0 bg-muted/40 text-xs font-semibold uppercase tracking-wide">Team total</td>
                  {weekDays.map((_, idx) => {
                    const sum = employees.reduce((s, e) => s + e.days[idx].hours, 0);
                    return <td key={idx} className="px-3 py-2 text-center font-mono font-semibold tabular-nums">{sum}h</td>;
                  })}
                  <td className="px-3 py-2 text-right font-mono font-bold tabular-nums">{totalHours}h</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
