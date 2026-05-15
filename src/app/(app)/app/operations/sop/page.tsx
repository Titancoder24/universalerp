import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Download,
  Filter,
  Plus,
  Target,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/ui/stat-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatCurrency, formatDate, initials } from '@/lib/utils';

interface SOPCycle {
  id: string;
  period: string;
  status: 'in_progress' | 'completed' | 'planned';
  startDate: string;
  endDate: string;
  owner: string;
  participants: string[];
  steps: {
    name: string;
    status: 'completed' | 'in_progress' | 'pending';
    completedAt?: string;
  }[];
  demandPlan: number;
  supplyPlan: number;
  variance: number;
}

const cycles: SOPCycle[] = [
  {
    id: 'SOP-2026-Q2', period: 'Q2 2026', status: 'in_progress', startDate: '2026-04-01', endDate: '2026-05-30',
    owner: 'Sara Kim', participants: ['Sara Kim', 'Marcus Bell', 'Dana Cole', 'Eric Ng', 'Lina Wang'],
    steps: [
      { name: 'Data gathering', status: 'completed', completedAt: '2026-04-08' },
      { name: 'Demand review', status: 'completed', completedAt: '2026-04-15' },
      { name: 'Supply review', status: 'completed', completedAt: '2026-04-22' },
      { name: 'Pre-S&OP meeting', status: 'in_progress' },
      { name: 'Executive S&OP', status: 'pending' },
      { name: 'Plan publication', status: 'pending' },
    ],
    demandPlan: 12400000, supplyPlan: 11800000, variance: -4.8,
  },
  {
    id: 'SOP-2026-Q3', period: 'Q3 2026', status: 'planned', startDate: '2026-07-01', endDate: '2026-08-30',
    owner: 'Sara Kim', participants: ['Sara Kim', 'Marcus Bell', 'Dana Cole'],
    steps: [
      { name: 'Data gathering', status: 'pending' },
      { name: 'Demand review', status: 'pending' },
      { name: 'Supply review', status: 'pending' },
      { name: 'Pre-S&OP meeting', status: 'pending' },
      { name: 'Executive S&OP', status: 'pending' },
      { name: 'Plan publication', status: 'pending' },
    ],
    demandPlan: 14200000, supplyPlan: 13800000, variance: -2.8,
  },
  {
    id: 'SOP-2026-Q1', period: 'Q1 2026', status: 'completed', startDate: '2026-01-15', endDate: '2026-02-28',
    owner: 'Dana Cole', participants: ['Sara Kim', 'Marcus Bell', 'Dana Cole', 'Eric Ng'],
    steps: [
      { name: 'Data gathering', status: 'completed', completedAt: '2026-01-22' },
      { name: 'Demand review', status: 'completed', completedAt: '2026-01-30' },
      { name: 'Supply review', status: 'completed', completedAt: '2026-02-08' },
      { name: 'Pre-S&OP meeting', status: 'completed', completedAt: '2026-02-15' },
      { name: 'Executive S&OP', status: 'completed', completedAt: '2026-02-22' },
      { name: 'Plan publication', status: 'completed', completedAt: '2026-02-28' },
    ],
    demandPlan: 10800000, supplyPlan: 10400000, variance: -3.7,
  },
];

const keyDecisions = [
  { date: '2026-04-22', decision: 'Approved 18% capacity increase for fastener line', impact: '$2.4M revenue', status: 'approved' },
  { date: '2026-04-18', decision: 'Defer Phoenix expansion to Q4 2026', impact: '-$1.2M capex', status: 'approved' },
  { date: '2026-04-12', decision: 'Award annual fastener contract to Apex Industrial', impact: '$842K savings', status: 'approved' },
  { date: '2026-04-08', decision: 'Tier 2 vendor consolidation initiative', impact: 'In review', status: 'pending' },
];

export default function SOPPage() {
  const activeCycle = cycles.find((c) => c.status === 'in_progress');

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="S&OP cycles"
        description="Sales & Operations Planning · cross-functional alignment"
        breadcrumbs={[
          { label: 'Operations', href: '/app' },
          { label: 'S&OP' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New cycle</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active cycle" value="Q2 2026" />
        <StatCard label="Demand plan" value={12400000} format="currency" delta={14.8} />
        <StatCard label="Supply plan" value={11800000} format="currency" delta={11.2} />
        <StatCard label="Plan variance" value={-4.8} format="percent" delta={4.8} invertTrend />
      </div>

      {activeCycle && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Active: {activeCycle.id} · {activeCycle.period}</CardTitle>
                <CardDescription>
                  {formatDate(activeCycle.startDate)} → {formatDate(activeCycle.endDate)} · Owner {activeCycle.owner}
                </CardDescription>
              </div>
              <StatusBadge status="in_progress" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium">Process steps</div>
                <div className="text-xs text-muted-foreground">{activeCycle.steps.filter((s) => s.status === 'completed').length} of {activeCycle.steps.length} complete</div>
              </div>
              <div className="grid gap-2 md:grid-cols-6">
                {activeCycle.steps.map((s, i) => (
                  <div key={i} className={cn(
                    'rounded-lg border p-3',
                    s.status === 'completed' && 'border-success/30 bg-success/5',
                    s.status === 'in_progress' && 'border-info/30 bg-info/5 ring-2 ring-info/20',
                    s.status === 'pending' && 'border-border',
                  )}>
                    <div className="flex items-center gap-2">
                      {s.status === 'completed' && <CheckCircle2 className="size-4 text-success" />}
                      {s.status === 'in_progress' && <Clock className="size-4 text-info animate-pulse" />}
                      {s.status === 'pending' && <Circle className="size-4 text-muted-foreground" />}
                      <span className="text-xs font-medium">Step {i + 1}</span>
                    </div>
                    <div className="mt-1.5 text-sm font-medium">{s.name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {s.status === 'completed' && s.completedAt && formatDate(s.completedAt)}
                      {s.status === 'in_progress' && 'In progress'}
                      {s.status === 'pending' && 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border p-4">
                <div className="text-xs text-muted-foreground">Demand plan</div>
                <div className="mt-1 text-2xl font-bold tabular-nums">{formatCurrency(activeCycle.demandPlan)}</div>
                <div className="mt-1 text-xs text-muted-foreground">Forecast revenue</div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="text-xs text-muted-foreground">Supply plan</div>
                <div className="mt-1 text-2xl font-bold tabular-nums">{formatCurrency(activeCycle.supplyPlan)}</div>
                <div className="mt-1 text-xs text-muted-foreground">Achievable capacity</div>
              </div>
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
                <div className="text-xs text-muted-foreground">Variance</div>
                <div className="mt-1 text-2xl font-bold tabular-nums text-warning">{activeCycle.variance}%</div>
                <div className="mt-1 text-xs text-muted-foreground">Gap to close</div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Participants ({activeCycle.participants.length})</div>
              <div className="flex flex-wrap gap-2">
                {activeCycle.participants.map((p) => (
                  <div key={p} className="flex items-center gap-2 rounded-full border border-border px-2.5 py-1">
                    <Avatar size="xs"><AvatarFallback name={p}>{initials(p)}</AvatarFallback></Avatar>
                    <span className="text-xs">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Cycle history</CardTitle><CardDescription>Past & upcoming cycles</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {cycles.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className={cn(
                  'flex size-10 items-center justify-center rounded-md',
                  c.status === 'in_progress' && 'bg-info/15 text-info',
                  c.status === 'completed' && 'bg-success/15 text-success',
                  c.status === 'planned' && 'bg-muted text-muted-foreground',
                )}>
                  <Target className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{c.id} · {c.period}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(c.startDate)} → {formatDate(c.endDate)}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-medium">{formatCurrency(c.demandPlan).replace('.00', '')}</div>
                  <StatusBadge status={c.status} size="sm" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Key decisions</CardTitle><CardDescription>Outcomes from S&OP meetings</CardDescription></CardHeader>
          <CardContent className="space-y-2">
            {keyDecisions.map((d, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="text-xs text-muted-foreground tabular-nums w-20 shrink-0">{formatDate(d.date)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{d.decision}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Impact: {d.impact}</div>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
