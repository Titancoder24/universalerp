import {
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Plus,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/ui/stat-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { initials } from '@/lib/utils';

const cycle = {
  name: 'Q2 2026 Performance Review',
  description: 'Mid-year check-in across all teams',
  total: 248,
  selfDone: 184,
  managerDone: 142,
  calibrationDone: 38,
  start: 'May 1',
  end: 'May 31',
  daysLeft: 16,
};

const pendingSelf = [
  { name: 'Sarah Chen', dept: 'Engineering', due: 'May 22' },
  { name: 'David Kim', dept: 'Engineering', due: 'May 24' },
  { name: 'Emma Thompson', dept: 'Marketing', due: 'May 27' },
  { name: 'Diego Fernández', dept: 'Sales', due: 'May 28' },
  { name: 'Carlos Mendes', dept: 'Engineering', due: 'May 28' },
];

const pendingManager = [
  { manager: 'Aisha Khan', count: 6, due: 'May 26' },
  { manager: 'Marcus Rodriguez', count: 4, due: 'May 24' },
  { manager: 'Sofia Rossi', count: 3, due: 'May 27' },
  { manager: 'Olivia Martinez', count: 2, due: 'May 30' },
];

const ratingDistribution = [
  { rating: 'Outstanding', count: 18, pct: 12, color: 'bg-success' },
  { rating: 'Exceeds', count: 48, pct: 31, color: 'bg-primary' },
  { rating: 'Meets', count: 72, pct: 47, color: 'bg-info' },
  { rating: 'Developing', count: 12, pct: 8, color: 'bg-warning' },
  { rating: 'Below', count: 4, pct: 2, color: 'bg-destructive' },
];

const teamGoals = [
  { team: 'Engineering', total: 78, completed: 64, onTrack: 11, atRisk: 3 },
  { team: 'Sales', total: 42, completed: 32, onTrack: 7, atRisk: 3 },
  { team: 'Customer Success', total: 31, completed: 26, onTrack: 4, atRisk: 1 },
  { team: 'Marketing', total: 24, completed: 18, onTrack: 5, atRisk: 1 },
  { team: 'Operations', total: 28, completed: 22, onTrack: 5, atRisk: 1 },
];

const topPerformers = [
  { name: 'Hiroshi Tanaka', role: 'CTO', score: 4.9, growth: '+0.3' },
  { name: 'Marcus Rodriguez', role: 'VP Sales', score: 4.8, growth: '+0.2' },
  { name: 'Aisha Khan', role: 'Eng Director', score: 4.7, growth: '+0.1' },
  { name: 'Sarah Chen', role: 'Sr. Designer', score: 4.7, growth: '+0.4' },
  { name: 'Olivia Martinez', role: 'VP CS', score: 4.6, growth: '+0.2' },
];

const recentFeedback = [
  { from: 'Marcus Rodriguez', to: 'Diego Fernández', type: 'praise', text: 'Crushed the demo for the Acme deal. Composed under pressure.', date: '2 hours ago' },
  { from: 'Aisha Khan', to: 'David Kim', type: 'praise', text: 'Shipped the auth refactor 2 weeks early. Solid code quality.', date: '5 hours ago' },
  { from: 'Sofia Rossi', to: 'Hannah Bauer', type: 'coaching', text: 'Loved the launch brief. Next time, let\'s involve PR earlier.', date: 'Yesterday' },
  { from: 'Olivia Martinez', to: 'Priya Patel', type: 'praise', text: 'Customer save of the quarter on the Globex renewal. Bravo!', date: '2 days ago' },
];

const stats = [
  { label: 'Reviews in progress', value: cycle.total, deltaLabel: `${cycle.daysLeft} days left`, icon: Clock },
  { label: 'Self-assessments', value: cycle.selfDone, deltaLabel: `${Math.round((cycle.selfDone / cycle.total) * 100)}% complete`, icon: CheckCircle2 },
  { label: 'Manager reviews', value: cycle.managerDone, deltaLabel: `${Math.round((cycle.managerDone / cycle.total) * 100)}% complete`, icon: Users },
  { label: 'Avg performance score', value: '3.8/5', deltaLabel: '+0.2 vs Q1', icon: Star },
];

export default function PerformancePage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Performance"
        description="Run review cycles, track goals, and grow people"
        breadcrumbs={[{ label: 'People', href: '/app/hr' }, { label: 'Performance' }]}
        actions={
          <>
            <Button variant="outline">
              <Sparkles className="size-4" /> AI insights
            </Button>
            <Button>
              <Plus className="size-4" /> Start new cycle
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-info/5" />
          <div className="relative grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="soft">Active cycle</Badge>
                <span className="text-xs text-muted-foreground">{cycle.start} – {cycle.end}</span>
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">{cycle.name}</h2>
              <p className="text-sm text-muted-foreground">{cycle.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-6">
                <div>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Self-assessment</span>
                    <span className="text-xs font-medium tabular-nums">{cycle.selfDone}/{cycle.total}</span>
                  </div>
                  <Progress value={(cycle.selfDone / cycle.total) * 100} indicatorClassName="bg-primary" />
                </div>
                <div>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Manager review</span>
                    <span className="text-xs font-medium tabular-nums">{cycle.managerDone}/{cycle.total}</span>
                  </div>
                  <Progress value={(cycle.managerDone / cycle.total) * 100} indicatorClassName="bg-info" />
                </div>
                <div>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Calibration</span>
                    <span className="text-xs font-medium tabular-nums">{cycle.calibrationDone}/{cycle.total}</span>
                  </div>
                  <Progress value={(cycle.calibrationDone / cycle.total) * 100} indicatorClassName="bg-warning" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background p-6 text-center">
              <Clock className="size-6 text-primary" />
              <div className="mt-2 text-3xl font-bold tabular-nums">{cycle.daysLeft}</div>
              <div className="text-xs text-muted-foreground">days left in cycle</div>
              <Button variant="outline" size="sm" className="mt-3">
                Send reminder
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList variant="underline">
          <TabsTrigger value="overview" variant="underline">Overview</TabsTrigger>
          <TabsTrigger value="goals" variant="underline">Goals</TabsTrigger>
          <TabsTrigger value="reviews" variant="underline">Reviews</TabsTrigger>
          <TabsTrigger value="feedback" variant="underline">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Rating distribution</CardTitle>
                <CardDescription>Calibrated ratings from completed reviews</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {ratingDistribution.map((r) => (
                  <div key={r.rating}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>{r.rating}</span>
                      <span className="text-muted-foreground tabular-nums">{r.count} ({r.pct}%)</span>
                    </div>
                    <Progress value={r.pct * 2} indicatorClassName={r.color} />
                  </div>
                ))}
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm">
                  <Sparkles className="size-4 text-warning" />
                  <div className="flex-1">
                    <div className="font-medium">Calibration suggestion</div>
                    <div className="text-xs text-muted-foreground">Engineering has 38% "Exceeds" vs company avg 31%. Review for inflation.</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Award className="size-4 text-warning" /> Top performers
                </CardTitle>
                <CardDescription>By calibrated review score</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topPerformers.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-warning/10 text-xs font-bold text-warning">
                      {i + 1}
                    </div>
                    <Avatar size="sm"><AvatarFallback name={p.name}>{initials(p.name)}</AvatarFallback></Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold tabular-nums">{p.score}</div>
                      <div className="text-2xs text-success tabular-nums">{p.growth}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pending self-assessments</CardTitle>
                <CardDescription>{pendingSelf.length} employees · automatic reminders sent daily</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {pendingSelf.map((p) => (
                  <div key={p.name} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm"><AvatarFallback name={p.name}>{initials(p.name)}</AvatarFallback></Avatar>
                      <div>
                        <div className="text-sm font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.dept}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" size="sm">Due {p.due}</Badge>
                      <Button variant="ghost" size="icon-sm"><ChevronRight className="size-4" /></Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pending manager reviews</CardTitle>
                <CardDescription>{pendingManager.reduce((s, p) => s + p.count, 0)} reports across {pendingManager.length} managers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {pendingManager.map((m) => (
                  <div key={m.manager} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm"><AvatarFallback name={m.manager}>{initials(m.manager)}</AvatarFallback></Avatar>
                      <div>
                        <div className="text-sm font-medium">{m.manager}</div>
                        <div className="text-xs text-muted-foreground">{m.count} reviews pending</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" size="sm">Due {m.due}</Badge>
                      <Button variant="ghost" size="icon-sm"><ChevronRight className="size-4" /></Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Goals by team</CardTitle>
              <CardDescription>OKR completion across {teamGoals.length} teams · Q2 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Team</th>
                    <th className="text-right">Total</th>
                    <th className="text-right">Completed</th>
                    <th className="text-right">On track</th>
                    <th className="text-right">At risk</th>
                    <th>Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {teamGoals.map((t) => {
                    const pct = (t.completed / t.total) * 100;
                    return (
                      <tr key={t.team}>
                        <td className="font-medium">{t.team}</td>
                        <td className="text-right font-mono tabular-nums">{t.total}</td>
                        <td className="text-right font-mono tabular-nums text-success">{t.completed}</td>
                        <td className="text-right font-mono tabular-nums">{t.onTrack}</td>
                        <td className="text-right font-mono tabular-nums text-warning">{t.atRisk}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Progress value={pct} className="flex-1" />
                            <span className="text-xs font-medium tabular-nums">{Math.round(pct)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardContent className="py-16 text-center">
              <Target className="mx-auto size-10 text-muted-foreground/50" />
              <h3 className="mt-3 font-semibold">Review templates and history</h3>
              <p className="mt-1 text-sm text-muted-foreground">Configure cycle templates and view past reviews.</p>
              <Button className="mt-4">Manage templates</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent feedback</CardTitle>
              <CardDescription>Continuous feedback across the org</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentFeedback.map((f, i) => (
                <div key={i} className="flex gap-3 rounded-lg border border-border/60 p-4">
                  <Avatar size="md"><AvatarFallback name={f.from}>{initials(f.from)}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium">{f.from}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium">{f.to}</span>
                      <Badge variant={f.type === 'praise' ? 'success' : 'soft'} size="sm">
                        {f.type}
                      </Badge>
                      <span className="ml-auto text-xs text-muted-foreground">{f.date}</span>
                    </div>
                    <p className="mt-1 text-sm">{f.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
