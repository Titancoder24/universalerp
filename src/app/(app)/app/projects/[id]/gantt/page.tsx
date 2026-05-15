'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, Download, Filter, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, initials } from '@/lib/utils';

interface GanttTask {
  id: string;
  name: string;
  start: number;
  duration: number;
  progress: number;
  assignee: string;
  type: 'milestone' | 'task' | 'phase';
  depends?: string[];
  status: 'open' | 'in_progress' | 'completed' | 'blocked';
}

const project = { name: 'Vendor Portal v2', start: '2026-04-01', end: '2026-08-30' };

const tasks: GanttTask[] = [
  { id: 'P1', name: 'Discovery & Research', start: 0, duration: 14, progress: 100, assignee: 'Lena Park', type: 'phase', status: 'completed' },
  { id: 'T1', name: 'User interviews', start: 0, duration: 7, progress: 100, assignee: 'Lena Park', type: 'task', status: 'completed' },
  { id: 'T2', name: 'Competitive analysis', start: 3, duration: 8, progress: 100, assignee: 'Sarah Chen', type: 'task', status: 'completed' },
  { id: 'M1', name: 'Discovery complete', start: 14, duration: 1, progress: 100, assignee: 'Lena Park', type: 'milestone', depends: ['T1', 'T2'], status: 'completed' },
  { id: 'P2', name: 'Design Phase', start: 14, duration: 28, progress: 75, assignee: 'Lena Park', type: 'phase', status: 'in_progress' },
  { id: 'T3', name: 'Wireframes', start: 14, duration: 10, progress: 100, assignee: 'Lena Park', type: 'task', depends: ['M1'], status: 'completed' },
  { id: 'T4', name: 'High-fi mockups', start: 22, duration: 14, progress: 80, assignee: 'Priya Khanna', type: 'task', depends: ['T3'], status: 'in_progress' },
  { id: 'T5', name: 'Prototype testing', start: 32, duration: 10, progress: 40, assignee: 'Sarah Chen', type: 'task', depends: ['T4'], status: 'in_progress' },
  { id: 'M2', name: 'Design approval', start: 42, duration: 1, progress: 0, assignee: 'Lena Park', type: 'milestone', depends: ['T5'], status: 'open' },
  { id: 'P3', name: 'Development', start: 42, duration: 60, progress: 20, assignee: 'Dmitri Volkov', type: 'phase', status: 'in_progress' },
  { id: 'T6', name: 'Backend API', start: 42, duration: 30, progress: 35, assignee: 'Dmitri Volkov', type: 'task', depends: ['M2'], status: 'in_progress' },
  { id: 'T7', name: 'OAuth integration', start: 52, duration: 14, progress: 20, assignee: 'Akira Tanaka', type: 'task', depends: ['T6'], status: 'in_progress' },
  { id: 'T8', name: 'Frontend SPA', start: 56, duration: 35, progress: 5, assignee: 'Hannah Klein', type: 'task', depends: ['T4'], status: 'open' },
  { id: 'T9', name: 'Integration testing', start: 88, duration: 14, progress: 0, assignee: 'Maria Santos', type: 'task', depends: ['T7', 'T8'], status: 'open' },
  { id: 'M3', name: 'Beta release', start: 102, duration: 1, progress: 0, assignee: 'Lena Park', type: 'milestone', depends: ['T9'], status: 'open' },
  { id: 'P4', name: 'Launch', start: 102, duration: 20, progress: 0, assignee: 'Sarah Chen', type: 'phase', status: 'open' },
  { id: 'T10', name: 'Marketing campaign', start: 102, duration: 14, progress: 0, assignee: 'Jamal Reed', type: 'task', depends: ['M3'], status: 'open' },
  { id: 'T11', name: 'Customer rollout', start: 112, duration: 10, progress: 0, assignee: 'Sarah Chen', type: 'task', depends: ['M3'], status: 'open' },
];

const totalDays = 150;
const dayWidth = 8;
const rowHeight = 36;

export default function GanttPage() {
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug'];

  return (
    <div className="flex flex-col">
      <PageHeader
        title={`${project.name} - Gantt`}
        description={`${project.start} → ${project.end}`}
        breadcrumbs={[{ label: 'Projects', href: '/app/projects' }, { label: project.name, href: '/app/projects' }, { label: 'Gantt' }]}
        back={<Button variant="ghost" size="icon-sm" asChild><Link href="/app/projects"><ChevronLeft className="size-4" /></Link></Button>}
        actions={
          <>
            <Button variant="outline" size="sm"><Filter className="size-4" /> Filter</Button>
            <Button variant="outline" size="sm"><Download className="size-4" /> Export</Button>
            <Button variant="outline" size="icon-sm"><ZoomOut className="size-4" /></Button>
            <Button variant="outline" size="icon-sm"><ZoomIn className="size-4" /></Button>
          </>
        }
      />

      <div className="space-y-4 p-6">
        <div className="grid grid-cols-4 gap-3">
          <Card><CardContent className="pt-5"><p className="text-xs uppercase tracking-wide text-muted-foreground">Progress</p><p className="mt-1 text-2xl font-semibold">38%</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-xs uppercase tracking-wide text-muted-foreground">On track</p><p className="mt-1 text-2xl font-semibold text-success">12</p><p className="text-xs text-muted-foreground">tasks</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-xs uppercase tracking-wide text-muted-foreground">At risk</p><p className="mt-1 text-2xl font-semibold text-warning">3</p><p className="text-xs text-muted-foreground">tasks</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-xs uppercase tracking-wide text-muted-foreground">Blocked</p><p className="mt-1 text-2xl font-semibold text-destructive">0</p><p className="text-xs text-muted-foreground">dependencies</p></CardContent></Card>
        </div>

        <Card>
          <CardContent className="overflow-x-auto p-0">
            <div className="flex">
              <div className="sticky left-0 z-10 w-72 shrink-0 border-r bg-card">
                <div className="flex h-14 items-center border-b bg-muted/20 px-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">Task</div>
                {tasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 border-b px-4" style={{ height: rowHeight }}>
                    <div className={cn('shrink-0 size-1.5 rounded-full', t.type === 'milestone' && 'bg-warning', t.type === 'phase' && 'bg-primary', t.type === 'task' && 'bg-muted-foreground/60')} />
                    <span className={cn('truncate text-xs', t.type === 'phase' && 'font-semibold', t.type === 'milestone' && 'font-medium text-warning')}>{t.name}</span>
                    <Avatar size="xs" className="ml-auto"><AvatarFallback>{initials(t.assignee)}</AvatarFallback></Avatar>
                  </div>
                ))}
              </div>
              <div className="relative" style={{ width: totalDays * dayWidth }}>
                <div className="flex h-14 border-b bg-muted/20">
                  {months.map((m) => (
                    <div key={m} className="flex items-center justify-center border-r text-xs font-medium" style={{ width: 30 * dayWidth }}>
                      {m} 2026
                    </div>
                  ))}
                </div>
                <svg className="absolute left-0" style={{ top: 56, width: totalDays * dayWidth, height: tasks.length * rowHeight, pointerEvents: 'none' }}>
                  {tasks.map((t, idx) => t.depends?.map((depId) => {
                    const dep = tasks.find((d) => d.id === depId);
                    const depIdx = tasks.findIndex((d) => d.id === depId);
                    if (!dep) return null;
                    const x1 = (dep.start + dep.duration) * dayWidth;
                    const y1 = depIdx * rowHeight + rowHeight / 2;
                    const x2 = t.start * dayWidth;
                    const y2 = idx * rowHeight + rowHeight / 2;
                    return (<path key={`${t.id}-${depId}`} d={`M ${x1} ${y1} L ${x1 + 5} ${y1} L ${x1 + 5} ${y2} L ${x2 - 3} ${y2}`} stroke="hsl(var(--muted-foreground))" strokeWidth={1} fill="none" strokeDasharray="2,2" />);
                  }))}
                </svg>
                {tasks.map((t, idx) => {
                  const left = t.start * dayWidth;
                  const width = t.duration * dayWidth;
                  return (
                    <div key={t.id} className="relative border-b" style={{ height: rowHeight }}>
                      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${totalDays}, 1fr)` }}>
                        {Array.from({ length: totalDays }).map((_, i) => (<div key={i} className={cn('border-r border-border/30', i % 7 === 0 && 'bg-muted/10')} />))}
                      </div>
                      {t.type === 'milestone' ? (
                        <div className="absolute top-1/2 -translate-y-1/2" style={{ left: left - 8 }}>
                          <div className={cn('size-4 rotate-45', t.progress === 100 ? 'bg-success' : 'bg-warning')} />
                        </div>
                      ) : (
                        <div className={cn('absolute top-1.5 flex items-center rounded-sm text-2xs text-white px-1.5 truncate', t.type === 'phase' ? 'bg-primary/30 border border-primary' : 'bg-primary')} style={{ left, width, height: rowHeight - 12 }}>
                          <div className="absolute inset-0 rounded-sm bg-primary/60" style={{ width: `${t.progress}%` }} />
                          <span className="relative truncate text-2xs font-medium">{t.progress > 0 && `${t.progress}%`}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5"><span className="block h-3 w-6 rounded-sm bg-primary/30 border border-primary" /> Phase</div>
          <div className="flex items-center gap-1.5"><span className="block h-3 w-6 rounded-sm bg-primary" /> Task</div>
          <div className="flex items-center gap-1.5"><span className="block size-3 rotate-45 bg-warning" /> Milestone</div>
          <div className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-success" /> Completed</div>
          <span>Dependencies shown as dotted lines</span>
        </div>
      </div>
    </div>
  );
}
