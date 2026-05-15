'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ArrowUp,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate, initials, cn } from '@/lib/utils';

const projects = [
  { id: 'p1', code: 'PRJ-001', name: 'ERP System Migration', client: 'Internal — IT', manager: 'James Liu', status: 'in_progress' as const, progress: 68, budget: 480000, spent: 312000, dueDate: '2026-09-30', health: 'green', team: ['JL', 'SC', 'DK', 'EP', 'MR'] },
  { id: 'p2', code: 'PRJ-002', name: 'New Product Launch — XR Series', client: 'Internal — R&D', manager: 'Emily Rodriguez', status: 'in_progress' as const, progress: 42, budget: 248000, spent: 124000, dueDate: '2026-08-15', health: 'yellow', team: ['ER', 'JL', 'DK'] },
  { id: 'p3', code: 'PRJ-003', name: 'Plant Capacity Upgrade', client: 'Internal — Ops', manager: 'Marcus Reid', status: 'in_progress' as const, progress: 28, budget: 1240000, spent: 384000, dueDate: '2026-12-31', health: 'green', team: ['MR', 'JL', 'SC', 'JP'] },
  { id: 'p4', code: 'PRJ-004', name: 'Acme Custom Integration', client: 'Acme Industries', manager: 'Sarah Chen', status: 'in_progress' as const, progress: 84, budget: 184000, spent: 168000, dueDate: '2026-06-15', health: 'yellow', team: ['SC', 'DK'] },
  { id: 'p5', code: 'PRJ-005', name: 'Q3 Marketing Campaign', client: 'Internal — Mkt', manager: 'David Kumar', status: 'in_progress' as const, progress: 16, budget: 84000, spent: 14000, dueDate: '2026-09-15', health: 'green', team: ['DK', 'JP'] },
  { id: 'p6', code: 'PRJ-006', name: 'Hospital Network Rollout', client: 'Hospital Network LLC', manager: 'Marcus Reid', status: 'on_hold' as const, progress: 32, budget: 312000, spent: 98400, dueDate: '2026-10-30', health: 'red', team: ['MR', 'SC'] },
  { id: 'p7', code: 'PRJ-007', name: 'TechCorp Phase 2', client: 'TechCorp Solutions', manager: 'Sarah Chen', status: 'completed' as const, progress: 100, budget: 124000, spent: 118000, dueDate: '2026-04-30', health: 'green', team: ['SC', 'DK', 'JL'] },
  { id: 'p8', code: 'PRJ-008', name: 'Global Mfg Implementation', client: 'Global Manufacturing', manager: 'James Liu', status: 'in_progress' as const, progress: 56, budget: 248000, spent: 142000, dueDate: '2026-07-31', health: 'green', team: ['JL', 'ER', 'JP'] },
];

const upcomingMilestones = [
  { project: 'Acme Custom Integration', milestone: 'UAT Sign-off', dueDate: '2026-05-22', days: 7 },
  { project: 'ERP System Migration', milestone: 'Phase 3 Go-Live', dueDate: '2026-05-30', days: 15 },
  { project: 'New Product Launch — XR Series', milestone: 'Prototype Review', dueDate: '2026-06-10', days: 26 },
  { project: 'Q3 Marketing Campaign', milestone: 'Creative Kickoff', dueDate: '2026-06-15', days: 31 },
];

const projectHealth = [
  { name: 'On track', value: 5, color: 'hsl(var(--success))' },
  { name: 'At risk', value: 2, color: 'hsl(var(--warning))' },
  { name: 'Critical', value: 1, color: 'hsl(var(--destructive))' },
];

const utilization = [
  { week: 'W1', billable: 72, internal: 28 },
  { week: 'W2', billable: 76, internal: 24 },
  { week: 'W3', billable: 68, internal: 32 },
  { week: 'W4', billable: 82, internal: 18 },
  { week: 'W5', billable: 78, internal: 22 },
  { week: 'W6', billable: 84, internal: 16 },
  { week: 'W7', billable: 80, internal: 20 },
];

const healthBg: Record<string, string> = {
  green: 'bg-success',
  yellow: 'bg-warning',
  red: 'bg-destructive',
};

export default function ProjectsDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Projects"
        description="Portfolio health, milestones, and resource utilization across all active engagements."
        breadcrumbs={[{ label: 'Home', href: '/app' }, { label: 'Projects' }]}
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href="/app/projects/time">
                <Clock className="size-4" /> Time tracking
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/app/projects/resources">
                <Users className="size-4" /> Resources
              </Link>
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New project
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active projects" value={projects.filter(p => p.status === 'in_progress').length} icon={Briefcase} />
        <StatCard label="Total budget" value={projects.reduce((s, p) => s + p.budget, 0)} format="currency" icon={Wallet} sparkline={[2.4, 2.6, 2.8, 2.9, 3.0, 3.1, 3.2]} />
        <StatCard label="Avg progress" value={Math.round(projects.filter(p => p.status === 'in_progress').reduce((s, p) => s + p.progress, 0) / projects.filter(p => p.status === 'in_progress').length)} format="percent" icon={Target} delta={4.2} />
        <StatCard label="On-time delivery" value={0.84} delta={2.1} format="percent" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>{projects.filter(p => p.status === 'in_progress').length} in flight · {projects.filter(p => p.health === 'red').length} need attention</CardDescription>
            </div>
            <Button variant="ghost" size="sm">View all <ArrowRight className="size-3.5" /></Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Manager</th>
                  <th>Progress</th>
                  <th className="text-right">Budget used</th>
                  <th>Due</th>
                  <th>Health</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {projects.filter(p => p.status === 'in_progress').slice(0, 6).map((p) => {
                  const budgetUsed = p.spent / p.budget;
                  return (
                    <tr key={p.id}>
                      <td>
                        <Link href={`/app/projects/${p.id}`} className="block hover:text-primary">
                          <p className="text-xs font-mono text-muted-foreground">{p.code}</p>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.client}</p>
                        </Link>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Avatar size="xs">
                            <AvatarFallback name={p.manager}>{initials(p.manager)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{p.manager}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 w-32">
                          <Progress value={p.progress} className="h-1.5 flex-1" />
                          <span className="text-xs font-mono">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="text-right">
                        <p className="font-mono text-xs tabular-nums">{formatCurrency(p.spent)}</p>
                        <p className={cn('text-2xs', budgetUsed > 0.9 ? 'text-destructive' : 'text-muted-foreground')}>
                          {(budgetUsed * 100).toFixed(0)}% of {formatCurrency(p.budget)}
                        </p>
                      </td>
                      <td className="text-xs text-muted-foreground">{formatDate(p.dueDate)}</td>
                      <td>
                        <span className={cn('inline-block h-2.5 w-2.5 rounded-full', healthBg[p.health])} />
                      </td>
                      <td>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/app/projects/${p.id}`}>Open</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Log time</DropdownMenuItem>
                            <DropdownMenuItem>Update status</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Health</CardTitle>
            <CardDescription>Active project status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={projectHealth} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={80} paddingAngle={3}>
                  {projectHealth.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {projectHealth.map((h) => (
                <div key={h.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: h.color }} />
                    <span className="font-medium">{h.name}</span>
                  </div>
                  <span className="font-mono tabular-nums">{h.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Milestones</CardTitle>
            <CardDescription>Next 30 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingMilestones.map((m, i) => (
              <div key={i} className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{m.milestone}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.project}</p>
                </div>
                <div className="text-right">
                  <p className={cn('text-sm font-medium', m.days < 14 ? 'text-warning' : 'text-foreground')}>{m.days}d</p>
                  <p className="text-xs text-muted-foreground">{formatDate(m.dueDate)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Utilization</CardTitle>
            <CardDescription>Billable vs internal hours · last 7 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={utilization} margin={{ top: 6, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="billable" stackId="a" name="Billable" fill="hsl(var(--chart-1))" />
                <Bar dataKey="internal" stackId="a" name="Internal" fill="hsl(var(--chart-3))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            AI Project Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-xs font-semibold uppercase text-destructive">At risk</p>
            <p className="mt-1 text-sm">Hospital Network Rollout paused 14 days — recommend scope reset call.</p>
          </div>
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
            <p className="text-xs font-semibold uppercase text-warning">Budget watch</p>
            <p className="mt-1 text-sm">Acme Custom Integration at 91% spend with 35% work remaining.</p>
          </div>
          <div className="rounded-lg border border-success/30 bg-success/5 p-4">
            <p className="text-xs font-semibold uppercase text-success">Ahead</p>
            <p className="mt-1 text-sm">Plant Capacity Upgrade tracking 12% ahead of plan despite supplier delays.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
