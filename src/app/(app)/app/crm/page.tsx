import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Award,
  Briefcase,
  CheckCircle2,
  CircleDollarSign,
  Filter,
  Flame,
  Mail,
  Phone,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/ui/stat-card';
import { cn, formatCompactNumber, formatCurrency, formatRelativeTime, initials } from '@/lib/utils';

const stats = [
  { label: 'Pipeline value', value: 4280000, delta: 8.4, format: 'currency' as const, icon: CircleDollarSign },
  { label: 'Weighted pipeline', value: 1860000, delta: 12.1, format: 'currency' as const, icon: Target },
  { label: 'Win rate', value: 0.286, delta: 3.2, format: 'percent' as const, icon: Trophy },
  { label: 'New leads (MTD)', value: 247, delta: 18.7, format: 'number' as const, icon: Users },
];

const stageBreakdown = [
  { stage: 'Discovery', value: 920000, count: 18, color: 'bg-info' },
  { stage: 'Qualification', value: 1240000, count: 14, color: 'bg-primary' },
  { stage: 'Proposal', value: 1140000, count: 9, color: 'bg-warning' },
  { stage: 'Negotiation', value: 680000, count: 5, color: 'bg-success' },
  { stage: 'Closed Won (MTD)', value: 480000, count: 7, color: 'bg-emerald-500' },
];

const conversionFunnel = [
  { stage: 'MQL', count: 1248, pct: 100 },
  { stage: 'SQL', count: 642, pct: 51 },
  { stage: 'Opportunity', count: 218, pct: 17 },
  { stage: 'Proposal', count: 84, pct: 6.7 },
  { stage: 'Closed Won', count: 32, pct: 2.6 },
];

const leaderboard = [
  { name: 'Sarah Chen', revenue: 482400, deals: 14, target: 500000, change: 12 },
  { name: 'Marcus Rivera', revenue: 421800, deals: 11, target: 450000, change: 8 },
  { name: 'Priya Patel', revenue: 389200, deals: 13, target: 400000, change: 22 },
  { name: 'James Okafor', revenue: 312600, deals: 9, target: 400000, change: -4 },
  { name: 'Emily Watson', revenue: 287400, deals: 8, target: 350000, change: 15 },
];

const hotLeads = [
  { name: 'Northwind Software', contact: 'Alicia Park', score: 94, value: 145000, source: 'Inbound', stage: 'Discovery' },
  { name: 'Helix Robotics', contact: 'Daniel Kim', score: 91, value: 87000, source: 'Referral', stage: 'Qualification' },
  { name: 'Lumen Health', contact: 'Rachel Goldberg', score: 89, value: 220000, source: 'Webinar', stage: 'Proposal' },
  { name: 'Vertex Logistics', contact: 'Tomas Becker', score: 87, value: 64000, source: 'Cold outbound', stage: 'Discovery' },
  { name: 'Brightline AI', contact: 'Ana Souza', score: 84, value: 112000, source: 'LinkedIn', stage: 'Qualification' },
];

const recentActivities = [
  { type: 'call', icon: Phone, color: 'text-success', user: 'Sarah Chen', text: 'logged a 24-min call with Northwind Software', at: new Date(Date.now() - 1000 * 60 * 8) },
  { type: 'email', icon: Mail, color: 'text-info', user: 'Marcus Rivera', text: 'sent proposal to Helix Robotics', at: new Date(Date.now() - 1000 * 60 * 32) },
  { type: 'won', icon: CheckCircle2, color: 'text-success', user: 'Priya Patel', text: 'closed Vertex Logistics ($64K)', at: new Date(Date.now() - 1000 * 60 * 90) },
  { type: 'lead', icon: Sparkles, color: 'text-primary', user: 'James Okafor', text: 'added 12 new leads from Q2 trade show', at: new Date(Date.now() - 1000 * 60 * 60 * 3) },
  { type: 'meeting', icon: Briefcase, color: 'text-warning', user: 'Emily Watson', text: 'scheduled demo with Lumen Health', at: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { type: 'won', icon: CheckCircle2, color: 'text-success', user: 'Sarah Chen', text: 'closed Brightline AI renewal ($88K)', at: new Date(Date.now() - 1000 * 60 * 60 * 7) },
];

function scoreColor(score: number) {
  if (score >= 80) return 'bg-success';
  if (score >= 60) return 'bg-warning';
  if (score >= 40) return 'bg-info';
  return 'bg-muted-foreground';
}

export default function CRMDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="CRM"
        description="Pipeline, performance, and pulse on every revenue motion across your team."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="size-4" /> This quarter
            </Button>
            <Button variant="outline" size="sm">
              <ArrowDown className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New lead
            </Button>
          </>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            delta={s.delta}
            format={s.format}
            icon={s.icon}
            sparkline={[12, 18, 14, 22, 26, 24, 30, 28, 34, 38, 36, 42]}
          />
        ))}
      </div>

      {/* Pipeline by stage + hot leads */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pipeline by stage</CardTitle>
              <CardDescription>$4.28M across 53 open opportunities</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/crm/opportunities">
                Open pipeline <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {stageBreakdown.map((s) => {
              const pct = (s.value / 1240000) * 100;
              return (
                <div key={s.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={cn('h-2 w-2 rounded-full', s.color)} />
                      <span className="font-medium">{s.stage}</span>
                      <span className="text-xs text-muted-foreground">· {s.count} deals</span>
                    </div>
                    <span className="font-mono text-sm font-semibold tabular-nums">
                      {formatCurrency(s.value)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn('h-full rounded-full transition-all', s.color)}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="size-4 text-destructive" />
              <div>
                <CardTitle>Hot leads</CardTitle>
                <CardDescription>Top 5 by AI score</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/crm/leads">
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 pb-4">
            {hotLeads.map((l) => (
              <Link
                key={l.name}
                href="/app/crm/leads/L-001"
                className="block rounded-md border border-border p-2.5 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{l.name}</p>
                  <span className="font-mono text-xs font-semibold text-success">{l.score}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="truncate">{l.contact}</span>
                  <span className="font-mono">{formatCurrency(l.value)}</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn('h-full rounded-full', scoreColor(l.score))}
                    style={{ width: `${l.score}%` }}
                  />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Funnel + leaderboard */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Conversion funnel</CardTitle>
            <CardDescription>Last 90 days · MQL to Closed Won</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {conversionFunnel.map((f, i) => (
              <div key={f.stage} className="flex items-center gap-3">
                <div className="w-24 flex-shrink-0 text-xs font-medium text-muted-foreground">
                  {f.stage}
                </div>
                <div className="flex-1">
                  <div className="relative h-7 overflow-hidden rounded-md bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 flex items-center justify-end rounded-md bg-primary/15 pr-2 text-xs font-semibold text-primary"
                      style={{ width: `${f.pct}%` }}
                    >
                      {f.pct}%
                    </div>
                  </div>
                </div>
                <div className="w-12 text-right font-mono text-xs tabular-nums">
                  {formatCompactNumber(f.count)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="size-4 text-warning" />
              <div>
                <CardTitle>Sales leaderboard</CardTitle>
                <CardDescription>Q2 attainment by rep</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              View all <ArrowRight className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Rep</th>
                  <th className="text-right">Revenue</th>
                  <th className="text-center">Deals</th>
                  <th>Attainment</th>
                  <th className="text-right">Δ</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((r, i) => {
                  const att = (r.revenue / r.target) * 100;
                  return (
                    <tr key={r.name}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs text-muted-foreground">#{i + 1}</span>
                          <Avatar size="xs">
                            <AvatarFallback name={r.name}>{initials(r.name)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{r.name}</span>
                        </div>
                      </td>
                      <td className="text-right font-mono">{formatCurrency(r.revenue)}</td>
                      <td className="text-center text-muted-foreground">{r.deals}</td>
                      <td className="w-48">
                        <div className="flex items-center gap-2">
                          <Progress value={Math.min(att, 100)} className="h-1.5" />
                          <span className="w-12 text-right font-mono text-xs tabular-nums">
                            {Math.round(att)}%
                          </span>
                        </div>
                      </td>
                      <td className={cn('text-right font-medium tabular-nums', r.change >= 0 ? 'text-success' : 'text-destructive')}>
                        <span className="inline-flex items-center gap-0.5">
                          {r.change >= 0 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                          {Math.abs(r.change)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <div>
              <CardTitle>Team activity</CardTitle>
              <CardDescription>Live feed across CRM</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/app/crm/activities">
              All activity <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-1 pb-4">
          {recentActivities.map((a, i) => (
            <div key={i} className="flex items-start gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/50">
              <div className={cn('mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted', a.color)}>
                <a.icon className="size-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  <span className="font-medium">{a.user}</span>{' '}
                  <span className="text-muted-foreground">{a.text}</span>
                </p>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(a.at)}</p>
              </div>
              <Badge variant="outline" size="sm" className="capitalize">
                {a.type}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
