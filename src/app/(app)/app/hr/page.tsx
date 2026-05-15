import Link from 'next/link';
import {
  ArrowRight,
  Cake,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Gift,
  Heart,
  PartyPopper,
  Plus,
  TrendingUp,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn, formatCurrency, formatDate, initials } from '@/lib/utils';

const stats = [
  { label: 'Total headcount', value: 248, delta: 4.2, format: 'number' as const, icon: Users },
  { label: 'Hires this month', value: 12, delta: 33.3, format: 'number' as const, icon: UserPlus },
  { label: 'Terminations', value: 3, delta: -25, format: 'number' as const, icon: UserMinus, invertTrend: true },
  { label: 'On leave today', value: 14, deltaLabel: '5.6% of staff', format: 'number' as const, icon: Calendar },
];

const departmentBreakdown = [
  { name: 'Engineering', count: 78, color: 'hsl(220 70% 55%)' },
  { name: 'Sales', count: 42, color: 'hsl(25 80% 55%)' },
  { name: 'Marketing', count: 24, color: 'hsl(160 60% 40%)' },
  { name: 'Customer Success', count: 31, color: 'hsl(260 60% 60%)' },
  { name: 'Operations', count: 28, color: 'hsl(45 80% 50%)' },
  { name: 'Finance', count: 18, color: 'hsl(330 70% 55%)' },
  { name: 'Human Resources', count: 14, color: 'hsl(195 75% 45%)' },
  { name: 'Legal', count: 13, color: 'hsl(100 50% 45%)' },
];

const recentHires = [
  { name: 'Sarah Chen', title: 'Senior Product Designer', department: 'Engineering', startDate: '2026-05-12' },
  { name: 'Marcus Rodriguez', title: 'Account Executive', department: 'Sales', startDate: '2026-05-08' },
  { name: 'Priya Patel', title: 'Customer Success Manager', department: 'Customer Success', startDate: '2026-05-05' },
  { name: 'David Kim', title: 'Backend Engineer', department: 'Engineering', startDate: '2026-05-01' },
  { name: 'Emma Thompson', title: 'Marketing Coordinator', department: 'Marketing', startDate: '2026-04-28' },
];

const upcomingEvents = [
  { type: 'birthday' as const, name: 'Olivia Martinez', detail: 'Turning 32', date: 'May 17', daysAway: 2 },
  { type: 'anniversary' as const, name: 'Jonathan Wright', detail: '5 years at Universal', date: 'May 18', daysAway: 3 },
  { type: 'birthday' as const, name: 'Aisha Khan', detail: 'Turning 28', date: 'May 20', daysAway: 5 },
  { type: 'anniversary' as const, name: 'Liam O\'Brien', detail: '3 years at Universal', date: 'May 22', daysAway: 7 },
  { type: 'birthday' as const, name: 'Hiroshi Tanaka', detail: 'Turning 41', date: 'May 23', daysAway: 8 },
  { type: 'anniversary' as const, name: 'Sofia Rossi', detail: '7 years at Universal', date: 'May 25', daysAway: 10 },
];

const totalDeptCount = departmentBreakdown.reduce((sum, d) => sum + d.count, 0);

function DonutChart() {
  const radius = 70;
  const stroke = 24;
  const center = 96;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;
  return (
    <svg viewBox="0 0 192 192" className="h-48 w-48">
      <circle cx={center} cy={center} r={radius} stroke="hsl(var(--muted))" strokeWidth={stroke} fill="transparent" />
      {departmentBreakdown.map((d) => {
        const pct = d.count / totalDeptCount;
        const offset = circumference * (1 - pct);
        const rotation = (cumulative / totalDeptCount) * 360 - 90;
        cumulative += d.count;
        return (
          <circle
            key={d.name}
            cx={center}
            cy={center}
            r={radius}
            stroke={d.color}
            strokeWidth={stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(${rotation} ${center} ${center})`}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        );
      })}
      <text x={center} y={center - 6} textAnchor="middle" className="fill-foreground text-2xl font-semibold">
        {totalDeptCount}
      </text>
      <text x={center} y={center + 14} textAnchor="middle" className="fill-muted-foreground text-xs">
        Employees
      </text>
    </svg>
  );
}

export default function HRDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="People"
        description="A single source of truth for your workforce, attendance, and culture."
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" /> Export
            </Button>
            <Button asChild>
              <Link href="/app/hr/employees">
                <Plus className="size-4" /> New employee
              </Link>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Attendance · Today</CardTitle>
              <CardDescription>Real-time check-in status across all locations</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/app/hr/attendance">
                Full report <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-border bg-success/5 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="size-3.5 text-success" /> Present
                </div>
                <div className="mt-1 text-2xl font-semibold tabular-nums text-success">218</div>
                <div className="text-xs text-muted-foreground">88% of workforce</div>
              </div>
              <div className="rounded-lg border border-border bg-warning/5 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="size-3.5 text-warning" /> Late
                </div>
                <div className="mt-1 text-2xl font-semibold tabular-nums text-warning">9</div>
                <div className="text-xs text-muted-foreground">3.6% of workforce</div>
              </div>
              <div className="rounded-lg border border-border bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="size-3.5 text-primary" /> On leave
                </div>
                <div className="mt-1 text-2xl font-semibold tabular-nums text-primary">14</div>
                <div className="text-xs text-muted-foreground">5.6% of workforce</div>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <UserMinus className="size-3.5" /> Absent
                </div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">7</div>
                <div className="text-xs text-muted-foreground">2.8% of workforce</div>
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Overall attendance rate</span>
                <span className="font-medium tabular-nums">91.6%</span>
              </div>
              <Progress value={91.6} indicatorClassName="bg-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Payroll</CardTitle>
              <CardDescription>Next run scheduled</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/app/hr/payroll">
                Manage <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-gradient-to-br from-primary/5 to-primary/0 p-4">
              <div className="text-xs text-muted-foreground">Cycle · May 2026</div>
              <div className="mt-1 text-3xl font-semibold tabular-nums">{formatCurrency(842340)}</div>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <Badge variant="soft">In review</Badge>
                <span className="text-muted-foreground">Runs in 11 days · Jun 1</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total gross</span>
                <span className="font-mono">{formatCurrency(1024500)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tax withheld</span>
                <span className="font-mono">{formatCurrency(142800)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Benefits / deductions</span>
                <span className="font-mono">{formatCurrency(39360)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2 font-medium">
                <span>Net payable</span>
                <span className="font-mono">{formatCurrency(842340)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Headcount by department</CardTitle>
            <CardDescription>Distribution across {departmentBreakdown.length} teams</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5 sm:flex-row">
            <DonutChart />
            <div className="grid flex-1 grid-cols-1 gap-2 text-sm">
              {departmentBreakdown.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                  <span className="flex-1 truncate text-muted-foreground">{d.name}</span>
                  <span className="font-medium tabular-nums">{d.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent hires</CardTitle>
              <CardDescription>Welcome the newest additions to Universal</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/app/hr/employees">
                All employees <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentHires.map((h) => (
              <div key={h.name} className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/40">
                <Avatar size="md">
                  <AvatarFallback name={h.name}>{initials(h.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="truncate font-medium">{h.name}</div>
                    <Badge variant="soft" size="sm">New</Badge>
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {h.title} · {h.department}
                  </div>
                </div>
                <div className="hidden text-right text-xs text-muted-foreground sm:block">
                  <div>Started</div>
                  <div className="font-medium text-foreground">{formatDate(h.startDate)}</div>
                </div>
                <StatusBadge status="active" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Celebrations</CardTitle>
              <CardDescription>Birthdays and work anniversaries this month</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <PartyPopper className="size-3.5" /> Send wishes
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingEvents.map((e) => (
              <div key={e.name} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/40">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    e.type === 'birthday' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary',
                  )}
                >
                  {e.type === 'birthday' ? <Cake className="size-5" /> : <Heart className="size-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.detail}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{e.date}</div>
                  <div className="text-xs text-muted-foreground">in {e.daysAway} {e.daysAway === 1 ? 'day' : 'days'}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workforce health</CardTitle>
            <CardDescription>Engagement signals from the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Employee Net Promoter Score</span>
                <span className="flex items-center gap-1 font-medium tabular-nums">
                  <TrendingUp className="size-3.5 text-success" /> +42
                </span>
              </div>
              <Progress value={71} indicatorClassName="bg-success" />
              <div className="mt-1 text-xs text-muted-foreground">3.2 point increase MoM</div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Voluntary attrition (TTM)</span>
                <span className="font-medium tabular-nums">4.8%</span>
              </div>
              <Progress value={48} indicatorClassName="bg-warning" />
              <div className="mt-1 text-xs text-muted-foreground">Industry benchmark · 9.2%</div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Goal completion</span>
                <span className="font-medium tabular-nums">82%</span>
              </div>
              <Progress value={82} indicatorClassName="bg-primary" />
              <div className="mt-1 text-xs text-muted-foreground">196 / 240 quarterly goals met</div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Compliance training</span>
                <span className="font-medium tabular-nums">94%</span>
              </div>
              <Progress value={94} indicatorClassName="bg-success" />
              <div className="mt-1 text-xs text-muted-foreground">15 employees pending completion</div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/app/hr/performance">
                <Gift className="size-4" /> Open performance hub
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
