'use client';

import { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Download,
  Filter,
  Pause,
  Play,
  Plus,
  Save,
  StopCircle,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const weekDates = ['Mon May 12', 'Tue May 13', 'Wed May 14', 'Thu May 15', 'Fri May 16', 'Sat May 17', 'Sun May 18'];

interface TimeRow {
  id: string;
  project: string;
  task: string;
  billable: boolean;
  hours: (number | null)[];
}

const initialRows: TimeRow[] = [
  { id: 'r1', project: 'ERP System Migration', task: 'Backend Development', billable: true, hours: [7.5, 8.0, 6.5, 7.0, null, null, null] },
  { id: 'r2', project: 'ERP System Migration', task: 'Code Review', billable: true, hours: [1.0, 0.5, 1.5, 1.0, null, null, null] },
  { id: 'r3', project: 'Acme Custom Integration', task: 'UAT Support', billable: true, hours: [2.0, null, 1.5, 2.5, null, null, null] },
  { id: 'r4', project: 'Internal', task: 'Team meetings', billable: false, hours: [1.0, 1.0, 1.5, 1.0, null, null, null] },
  { id: 'r5', project: 'Internal', task: 'Training', billable: false, hours: [null, 1.5, null, null, null, null, null] },
];

export default function TimeTrackingPage() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState('01:24:18');
  const [rows, setRows] = useState(initialRows);

  const totalByDay = weekDates.map((_, di) =>
    rows.reduce((s, r) => s + (r.hours[di] ?? 0), 0)
  );
  const weekTotal = totalByDay.reduce((s, h) => s + h, 0);
  const billableTotal = rows.filter(r => r.billable).reduce((s, r) => s + r.hours.reduce((a, h) => a + (h ?? 0), 0), 0);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Time Tracking"
        description="Track time across projects and tasks. Use the timer for active work or enter manually."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Projects', href: '/app/projects' },
          { label: 'Time' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="size-4" /> Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New entry
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Project</label>
                  <Select defaultValue="erp">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="erp">ERP System Migration</SelectItem>
                      <SelectItem value="acme">Acme Custom Integration</SelectItem>
                      <SelectItem value="xr">New Product Launch — XR</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Task</label>
                  <Select defaultValue="dev">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dev">Backend Development</SelectItem>
                      <SelectItem value="review">Code Review</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Description</label>
                  <Input className="mt-1" placeholder="What are you working on?" defaultValue="Implementing rate limiter for invoice API" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-medium text-muted-foreground">Elapsed</p>
                  <p className={cn(
                    'font-mono text-3xl font-semibold tabular-nums',
                    running && 'text-success',
                  )}>{elapsed}</p>
                </div>
                {running ? (
                  <>
                    <Button variant="outline" size="lg" className="h-12 w-12 p-0" onClick={() => setRunning(false)}>
                      <Pause className="size-5" />
                    </Button>
                    <Button variant="destructive" size="lg" className="h-12 w-12 p-0" onClick={() => setRunning(false)}>
                      <StopCircle className="size-5" />
                    </Button>
                  </>
                ) : (
                  <Button size="lg" className="h-12 px-6" onClick={() => setRunning(true)}>
                    <Play className="size-5" /> Start
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">This Week</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-semibold tabular-nums">{weekTotal.toFixed(1)}<span className="text-sm text-muted-foreground"> hr</span></p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Billable</p>
              <p className="text-xl font-semibold tabular-nums text-success">{billableTotal.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Utilization</p>
              <p className="text-xl font-semibold tabular-nums">{Math.round((billableTotal / weekTotal) * 100) || 0}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Weekly Timesheet</CardTitle>
            <CardDescription>Click any cell to enter hours</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm">
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium">Week of May 12, 2026</span>
            <Button variant="outline" size="icon-sm">
              <ChevronRight className="size-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="size-4" />
            </Button>
            <Button size="sm">
              <Save className="size-4" /> Save week
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th className="w-44">Project</th>
                <th>Task</th>
                <th className="w-20">Billable</th>
                {weekDates.map((d, i) => (
                  <th key={d} className={cn('w-20 text-center', i >= 5 && 'bg-muted/30')}>
                    <div className="font-semibold text-2xs uppercase">{d.split(' ')[0]}</div>
                    <div className="text-2xs font-normal text-muted-foreground">{d.split(' ').slice(1).join(' ')}</div>
                  </th>
                ))}
                <th className="w-20 text-center bg-primary/5">Total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const rowTotal = r.hours.reduce((s, h) => s + (h ?? 0), 0);
                return (
                  <tr key={r.id}>
                    <td className="text-sm font-medium">{r.project}</td>
                    <td className="text-sm">{r.task}</td>
                    <td>
                      {r.billable ? (
                        <Badge variant="success" size="sm">Yes</Badge>
                      ) : (
                        <Badge variant="outline" size="sm">No</Badge>
                      )}
                    </td>
                    {r.hours.map((h, di) => (
                      <td key={di} className={cn('p-0 w-20', di >= 5 && 'bg-muted/30')}>
                        <Input
                          className="h-9 w-full border-0 text-center font-mono text-sm rounded-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/40"
                          value={h ?? ''}
                          onChange={() => undefined}
                          placeholder="—"
                        />
                      </td>
                    ))}
                    <td className="bg-primary/5 text-center font-mono text-sm font-semibold tabular-nums">
                      {rowTotal > 0 ? rowTotal.toFixed(1) : '—'}
                    </td>
                    <td>
                      <Button variant="ghost" size="icon-sm">
                        <Trash2 className="size-3.5 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-primary/5 font-semibold">
                <td colSpan={3} className="text-right">Daily totals</td>
                {totalByDay.map((t, di) => (
                  <td key={di} className={cn('text-center font-mono tabular-nums', di >= 5 && 'bg-muted/30')}>
                    {t > 0 ? t.toFixed(1) : '—'}
                  </td>
                ))}
                <td className="text-center font-mono tabular-nums text-base">{weekTotal.toFixed(1)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </CardContent>
        <div className="flex items-center justify-between border-t border-border p-4 text-sm">
          <Button variant="ghost" size="sm">
            <Plus className="size-4" /> Add row
          </Button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            <span>AI suggests adding 2 hrs for <span className="font-medium text-foreground">design review</span> based on calendar.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
