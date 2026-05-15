'use client';

import Link from 'next/link';
import { use } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  Edit3,
  FileText,
  Flag,
  MessageSquare,
  Milestone,
  MoreHorizontal,
  Paperclip,
  Pin,
  Plus,
  Settings,
  Share2,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCurrency, formatDate, initials, cn } from '@/lib/utils';

const ganttTasks = [
  { id: 'g1', name: 'Discovery & Planning', start: 0, duration: 14, progress: 100, owner: 'JL', color: 'hsl(var(--chart-1))' },
  { id: 'g2', name: 'Architecture Design', start: 10, duration: 21, progress: 100, owner: 'SC', color: 'hsl(var(--chart-2))' },
  { id: 'g3', name: 'Backend Development', start: 28, duration: 56, progress: 78, owner: 'DK', color: 'hsl(var(--chart-3))' },
  { id: 'g4', name: 'Frontend Development', start: 35, duration: 49, progress: 62, owner: 'SC', color: 'hsl(var(--chart-4))' },
  { id: 'g5', name: 'Data Migration', start: 56, duration: 28, progress: 32, owner: 'JL', color: 'hsl(var(--chart-5))' },
  { id: 'g6', name: 'UAT & QA', start: 77, duration: 21, progress: 0, owner: 'ER', color: 'hsl(var(--chart-6))' },
  { id: 'g7', name: 'Training & Rollout', start: 91, duration: 14, progress: 0, owner: 'MR', color: 'hsl(var(--chart-7))' },
  { id: 'g8', name: 'Go-Live & Stabilization', start: 105, duration: 14, progress: 0, owner: 'JL', color: 'hsl(var(--chart-8))' },
];

const milestones = [
  { name: 'Project Kickoff', date: '2026-01-15', status: 'completed' as const },
  { name: 'Architecture Sign-off', date: '2026-02-20', status: 'completed' as const },
  { name: 'Backend Alpha', date: '2026-04-05', status: 'completed' as const },
  { name: 'Phase 2 Go-Live', date: '2026-05-30', status: 'in_progress' as const },
  { name: 'UAT Complete', date: '2026-07-15', status: 'pending' as const },
  { name: 'Final Cutover', date: '2026-09-30', status: 'pending' as const },
];

const team = [
  { name: 'James Liu', role: 'Project Manager', allocation: 100, hoursWeek: 40 },
  { name: 'Sarah Chen', role: 'Lead Engineer', allocation: 80, hoursWeek: 32 },
  { name: 'David Kumar', role: 'Senior Engineer', allocation: 100, hoursWeek: 40 },
  { name: 'Emily Rodriguez', role: 'UX Designer', allocation: 50, hoursWeek: 20 },
  { name: 'Marcus Reid', role: 'Solutions Architect', allocation: 25, hoursWeek: 10 },
];

const timeEntries = [
  { date: '2026-05-14', user: 'James Liu', task: 'Backend Development', hours: 7.5, billable: true },
  { date: '2026-05-14', user: 'Sarah Chen', task: 'Frontend Development', hours: 8.0, billable: true },
  { date: '2026-05-14', user: 'David Kumar', task: 'Data Migration', hours: 6.5, billable: true },
  { date: '2026-05-13', user: 'James Liu', task: 'Code Review', hours: 4.0, billable: true },
  { date: '2026-05-13', user: 'Emily Rodriguez', task: 'Design QA', hours: 3.5, billable: true },
];

const activity = [
  { user: 'Sarah Chen', action: 'updated milestone', target: 'Phase 2 Go-Live', time: '12 min ago' },
  { user: 'James Liu', action: 'commented on', target: 'Data Migration task', time: '1h ago' },
  { user: 'David Kumar', action: 'logged 6.5 hrs to', target: 'Data Migration', time: '2h ago' },
  { user: 'Emily Rodriguez', action: 'uploaded', target: 'dashboard-v3.fig', time: '4h ago' },
  { user: 'Marcus Reid', action: 'approved', target: 'Architecture v2', time: 'Yesterday' },
];

const totalDuration = 119;

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="ERP System Migration"
        description="Internal — IT · Multi-phase replatform from legacy SAP to Universal ERP"
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Projects', href: '/app/projects' },
          { label: 'PRJ-001' },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/projects" aria-label="Back">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              <Share2 className="size-4" /> Share
            </Button>
            <Button variant="outline" size="sm">
              <Edit3 className="size-4" /> Edit
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> Log time
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Progress</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">68%</p>
          <Progress value={68} className="mt-2 h-1.5" />
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Budget</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(312000)}</p>
          <p className="mt-1 text-xs text-muted-foreground">65% of {formatCurrency(480000)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Hours logged</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">2,842</p>
          <p className="mt-1 text-xs text-muted-foreground">of 4,200 estimated</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Due date</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">Sep 30</p>
          <p className="mt-1 text-xs text-success">On track · 138 days left</p>
        </Card>
      </div>

      <Tabs defaultValue="gantt">
        <TabsList variant="underline">
          <TabsTrigger value="gantt">Gantt</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="time">Time</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="gantt">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Project Timeline</CardTitle>
                <CardDescription>Week-by-week Gantt view · Jan 15 – Sep 30, 2026</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Weeks</Button>
                <Button variant="outline" size="sm">Months</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="text-xs font-medium text-muted-foreground">Task</div>
                  <div className="relative h-6">
                    <div className="flex justify-between text-2xs text-muted-foreground">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {ganttTasks.map((t) => (
                  <div key={t.id} className="grid grid-cols-[200px_1fr] gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Avatar size="xs"><AvatarFallback>{t.owner}</AvatarFallback></Avatar>
                      <span className="text-sm font-medium truncate">{t.name}</span>
                    </div>
                    <div className="relative h-7 rounded-md bg-muted/40">
                      <div
                        className="absolute top-0 h-full rounded-md"
                        style={{
                          left: `${(t.start / totalDuration) * 100}%`,
                          width: `${(t.duration / totalDuration) * 100}%`,
                          background: `${t.color}40`,
                          border: `1px solid ${t.color}`,
                        }}
                      >
                        <div
                          className="h-full rounded-l-md"
                          style={{ background: t.color, width: `${t.progress}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-2xs font-medium text-foreground">
                          {t.progress > 0 && `${t.progress}%`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardContent className="p-0">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Assignee</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Due</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {ganttTasks.map((t) => (
                    <tr key={t.id}>
                      <td className="font-medium">{t.name}</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Avatar size="xs"><AvatarFallback>{t.owner}</AvatarFallback></Avatar>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={t.progress === 100 ? 'completed' : t.progress > 0 ? 'in_progress' : 'pending'} />
                      </td>
                      <td>
                        <div className="flex items-center gap-2 w-32">
                          <Progress value={t.progress} className="h-1.5 flex-1" />
                          <span className="text-xs font-mono">{t.progress}%</span>
                        </div>
                      </td>
                      <td className="text-xs text-muted-foreground">{formatDate(new Date(2026, 0, 15 + t.start + t.duration))}</td>
                      <td>
                        <Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardContent className="p-6">
              <div className="relative border-l-2 border-border space-y-6 ml-2">
                {milestones.map((m, i) => {
                  const isCompleted = m.status === 'completed';
                  const isCurrent = m.status === 'in_progress';
                  return (
                    <div key={i} className="relative pl-6">
                      <div className={cn(
                        'absolute -left-[10px] top-0 flex h-5 w-5 items-center justify-center rounded-full',
                        isCompleted && 'bg-success text-success-foreground',
                        isCurrent && 'bg-warning text-warning-foreground',
                        !isCompleted && !isCurrent && 'bg-muted border-2 border-border',
                      )}>
                        {isCompleted ? <CheckCircle2 className="size-3" /> : isCurrent ? <Circle className="size-3 fill-current" /> : null}
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{m.name}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(m.date)}</p>
                        </div>
                        <StatusBadge status={m.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle>Recent Time Entries</CardTitle>
              <CardDescription>{timeEntries.reduce((s, e) => s + e.hours, 0)} hours · last 2 days</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Task</th>
                    <th className="text-right">Hours</th>
                    <th>Billable</th>
                  </tr>
                </thead>
                <tbody>
                  {timeEntries.map((e, i) => (
                    <tr key={i}>
                      <td className="text-xs text-muted-foreground">{formatDate(e.date)}</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Avatar size="xs">
                            <AvatarFallback name={e.user}>{initials(e.user)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{e.user}</span>
                        </div>
                      </td>
                      <td>{e.task}</td>
                      <td className="text-right font-mono tabular-nums">{e.hours.toFixed(1)}</td>
                      <td>
                        {e.billable ? <Badge variant="success" size="sm">Billable</Badge> : <Badge variant="outline" size="sm">Internal</Badge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Project Team</CardTitle>
              <CardDescription>{team.length} members allocated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {team.map((m) => (
                <div key={m.name} className="flex items-center gap-3 rounded-md border border-border p-3">
                  <Avatar size="md">
                    <AvatarFallback name={m.name}>{initials(m.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-mono font-medium">{m.allocation}%</p>
                    <p className="text-xs text-muted-foreground">{m.hoursWeek} hrs/wk</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activity.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <Avatar size="sm">
                <AvatarFallback name={a.user}>{initials(a.user)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{a.user}</span>{' '}
                  <span className="text-muted-foreground">{a.action}</span>{' '}
                  <span className="font-medium">{a.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
