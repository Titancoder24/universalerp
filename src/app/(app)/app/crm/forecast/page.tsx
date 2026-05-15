import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Calendar,
  Filter,
  Info,
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
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, formatCompactNumber, formatCurrency, initials } from '@/lib/utils';

const quarters = [
  { q: 'Q1 2026', target: 1800000, closed: 2120000, commit: 0, bestCase: 0, pipeline: 0, status: 'closed' as const },
  { q: 'Q2 2026', target: 2000000, closed: 1980000, commit: 0, bestCase: 0, pipeline: 0, status: 'closed' as const },
  { q: 'Q3 2026', target: 2400000, closed: 840000, commit: 1280000, bestCase: 2050000, pipeline: 4280000, status: 'current' as const },
  { q: 'Q4 2026', target: 2800000, closed: 0, commit: 380000, bestCase: 940000, pipeline: 3120000, status: 'future' as const },
];

const reps = [
  { name: 'Sarah Chen', target: 600000, closed: 220000, commit: 320000, bestCase: 480000, pipeline: 920000, deals: 14, change: 12 },
  { name: 'Marcus Rivera', target: 550000, closed: 195000, commit: 285000, bestCase: 440000, pipeline: 820000, deals: 11, change: 8 },
  { name: 'Priya Patel', target: 650000, closed: 235000, commit: 380000, bestCase: 560000, pipeline: 1180000, deals: 13, change: 22 },
  { name: 'James Okafor', target: 550000, closed: 145000, commit: 195000, bestCase: 340000, pipeline: 760000, deals: 9, change: -4 },
  { name: 'Emily Watson', target: 500000, closed: 105000, commit: 180000, bestCase: 310000, pipeline: 600000, deals: 8, change: 15 },
];

const currentQuarter = quarters[2];
const totalCommit = reps.reduce((sum, r) => sum + r.commit + r.closed, 0);
const totalBestCase = reps.reduce((sum, r) => sum + r.bestCase + r.closed, 0);
const totalTarget = reps.reduce((sum, r) => sum + r.target, 0);
const totalClosed = reps.reduce((sum, r) => sum + r.closed, 0);
const totalPipeline = reps.reduce((sum, r) => sum + r.pipeline, 0);

const gapFromTarget = totalTarget - totalCommit;
const attainmentPct = (totalCommit / totalTarget) * 100;

// Weekly forecast trend
const weeklyTrend = [
  { week: 'Wk 1', commit: 980, target: 240 },
  { week: 'Wk 2', commit: 1080, target: 480 },
  { week: 'Wk 3', commit: 1180, target: 720 },
  { week: 'Wk 4', commit: 1240, target: 960 },
  { week: 'Wk 5', commit: 1300, target: 1200 },
  { week: 'Wk 6', commit: 1360, target: 1440 },
  { week: 'Wk 7', commit: 1420, target: 1680 },
  { week: 'Wk 8', commit: 1480, target: 1920 },
  { week: 'Wk 9', commit: 1560, target: 2160 },
  { week: 'Now', commit: 1600, target: 2400 },
];

const maxValue = Math.max(...weeklyTrend.map((w) => Math.max(w.commit, w.target))) * 1000;

export default function ForecastPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Forecast"
        description="Weighted pipeline against quotas — by quarter, by rep, with risk signals."
        actions={
          <>
            <Select defaultValue="q3">
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q3">Q3 2026</SelectItem>
                <SelectItem value="q4">Q4 2026</SelectItem>
                <SelectItem value="fy">FY 2026</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <ArrowDown className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Target className="size-4" /> Commit
            </Button>
          </>
        }
      />

      {/* Hero metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Q3 target</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{formatCurrency(currentQuarter.target)}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3" /> 42 days remaining
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Closed won</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-success">{formatCurrency(currentQuarter.closed)}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-success">
              <ArrowUp className="size-3" /> 35% of target
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Commit forecast</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{formatCurrency(currentQuarter.commit + currentQuarter.closed)}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-warning">
              <Info className="size-3" /> 88% of target
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Best case</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{formatCurrency(currentQuarter.bestCase + currentQuarter.closed)}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-success">
              <TrendingUp className="size-3" /> 121% of target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attainment chart + breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pacing vs target</CardTitle>
                <CardDescription>Q3 2026 · 10-week trend</CardDescription>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Commit
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground" /> Linear target
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-64">
              {/* Y-axis labels */}
              <div className="absolute inset-y-0 left-0 flex flex-col justify-between py-1 text-xs text-muted-foreground">
                <span>{formatCurrency(maxValue)}</span>
                <span>{formatCurrency(maxValue * 0.75)}</span>
                <span>{formatCurrency(maxValue * 0.5)}</span>
                <span>{formatCurrency(maxValue * 0.25)}</span>
                <span>$0</span>
              </div>
              {/* Chart area */}
              <div className="absolute inset-y-0 left-20 right-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-dashed border-border/60" />
                ))}
              </div>
              {/* Bars */}
              <div className="absolute inset-y-2 left-20 right-2 flex items-end justify-between gap-2">
                {weeklyTrend.map((w, i) => {
                  const commitH = (w.commit * 1000 / maxValue) * 100;
                  const targetH = (w.target * 1000 / maxValue) * 100;
                  return (
                    <div key={w.week} className="group flex h-full flex-1 flex-col items-center justify-end gap-1">
                      <div className="flex w-full items-end gap-1">
                        <div
                          className={cn(
                            'flex-1 rounded-t bg-primary/80 transition-all hover:bg-primary',
                            i === weeklyTrend.length - 1 && 'bg-primary',
                          )}
                          style={{ height: `${commitH * 2}px`, maxHeight: '220px' }}
                        />
                        <div
                          className="flex-1 rounded-t bg-muted-foreground/40"
                          style={{ height: `${targetH * 2}px`, maxHeight: '220px' }}
                        />
                      </div>
                      <span className="text-2xs text-muted-foreground">{w.week}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Forecast breakdown</CardTitle>
            <CardDescription>Confidence-weighted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Closed won</span>
                <span className="font-mono font-semibold text-success">{formatCurrency(currentQuarter.closed)}</span>
              </div>
              <Progress value={(currentQuarter.closed / currentQuarter.target) * 100} className="mt-1.5 h-2" indicatorClassName="bg-success" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Commit</span>
                <span className="font-mono font-semibold">{formatCurrency(currentQuarter.commit)}</span>
              </div>
              <Progress value={(currentQuarter.commit / currentQuarter.target) * 100} className="mt-1.5 h-2" indicatorClassName="bg-primary" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Best case</span>
                <span className="font-mono font-semibold">{formatCurrency(currentQuarter.bestCase - currentQuarter.commit)}</span>
              </div>
              <Progress value={((currentQuarter.bestCase - currentQuarter.commit) / currentQuarter.target) * 100} className="mt-1.5 h-2" indicatorClassName="bg-warning" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">Pipeline</span>
                <span className="font-mono font-semibold text-muted-foreground">{formatCurrency(currentQuarter.pipeline)}</span>
              </div>
              <Progress value={(currentQuarter.pipeline / currentQuarter.target) * 100} className="mt-1.5 h-2" indicatorClassName="bg-muted-foreground/50" />
            </div>
            <Separator />
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Gap to target</span>
                <span className={cn('font-mono font-semibold', gapFromTarget > 0 ? 'text-destructive' : 'text-success')}>
                  {gapFromTarget > 0 ? '-' : '+'}
                  {formatCurrency(Math.abs(gapFromTarget))}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Commit coverage</span>
                <span className="font-mono font-semibold">{Math.round(attainmentPct)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rep table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Forecast by rep</CardTitle>
            <CardDescription>Q3 2026 commits and pipeline coverage</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            View 1:1 cadence <ArrowRight className="size-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Rep</th>
                <th className="text-right">Target</th>
                <th className="text-right">Closed</th>
                <th className="text-right">Commit</th>
                <th className="text-right">Best case</th>
                <th className="text-right">Pipeline</th>
                <th>Attainment</th>
                <th className="text-right">Δ vs last week</th>
              </tr>
            </thead>
            <tbody>
              {reps.map((r) => {
                const att = ((r.closed + r.commit) / r.target) * 100;
                const coverage = r.pipeline / (r.target - r.closed);
                return (
                  <tr key={r.name}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <Avatar size="sm">
                          <AvatarFallback name={r.name}>{initials(r.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{r.deals} active deals · {coverage.toFixed(1)}x coverage</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right font-mono tabular-nums">{formatCurrency(r.target)}</td>
                    <td className="text-right font-mono tabular-nums text-success">{formatCurrency(r.closed)}</td>
                    <td className="text-right font-mono font-semibold tabular-nums">{formatCurrency(r.commit)}</td>
                    <td className="text-right font-mono tabular-nums text-warning">{formatCurrency(r.bestCase)}</td>
                    <td className="text-right font-mono tabular-nums text-muted-foreground">{formatCurrency(r.pipeline)}</td>
                    <td className="w-48">
                      <div className="flex items-center gap-2">
                        <Progress value={Math.min(att, 100)} className="h-1.5" indicatorClassName={cn(
                          att >= 100 && 'bg-success',
                          att >= 80 && att < 100 && 'bg-primary',
                          att >= 60 && att < 80 && 'bg-warning',
                          att < 60 && 'bg-destructive',
                        )} />
                        <span className="w-11 text-right font-mono text-xs tabular-nums">{Math.round(att)}%</span>
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
              <tr className="bg-muted/40 font-semibold">
                <td>Team total</td>
                <td className="text-right font-mono tabular-nums">{formatCurrency(totalTarget)}</td>
                <td className="text-right font-mono tabular-nums text-success">{formatCurrency(totalClosed)}</td>
                <td className="text-right font-mono tabular-nums">{formatCurrency(totalCommit - totalClosed)}</td>
                <td className="text-right font-mono tabular-nums text-warning">{formatCurrency(totalBestCase - totalClosed)}</td>
                <td className="text-right font-mono tabular-nums">{formatCurrency(totalPipeline)}</td>
                <td className="w-48">
                  <div className="flex items-center gap-2">
                    <Progress value={Math.min(attainmentPct, 100)} className="h-1.5" />
                    <span className="w-11 text-right font-mono text-xs tabular-nums">{Math.round(attainmentPct)}%</span>
                  </div>
                </td>
                <td className="text-right text-success">+11%</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Quarter view */}
      <Card>
        <CardHeader>
          <CardTitle>Quarterly trajectory</CardTitle>
          <CardDescription>FY 2026 plan vs actual</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Quarter</th>
                <th className="text-right">Target</th>
                <th className="text-right">Closed</th>
                <th className="text-right">Commit</th>
                <th className="text-right">Best case</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {quarters.map((q) => {
                const closeAttain = (q.closed / q.target) * 100;
                const commitAttain = ((q.closed + q.commit) / q.target) * 100;
                return (
                  <tr key={q.q}>
                    <td className="font-medium">{q.q}</td>
                    <td className="text-right font-mono tabular-nums">{formatCurrency(q.target)}</td>
                    <td className="text-right font-mono tabular-nums text-success">{formatCurrency(q.closed)}</td>
                    <td className="text-right font-mono tabular-nums">{q.commit > 0 ? formatCurrency(q.commit) : '—'}</td>
                    <td className="text-right font-mono tabular-nums text-warning">{q.bestCase > 0 ? formatCurrency(q.bestCase) : '—'}</td>
                    <td>
                      {q.status === 'closed' && (
                        <Badge variant="outline" size="sm" className={cn(
                          closeAttain >= 100 ? 'border-success/30 bg-success/10 text-success' : 'border-warning/30 bg-warning/10 text-warning',
                        )}>
                          {closeAttain >= 100 ? 'Hit target' : 'Missed'} · {Math.round(closeAttain)}%
                        </Badge>
                      )}
                      {q.status === 'current' && (
                        <Badge variant="outline" size="sm" className="border-primary/30 bg-primary/10 text-primary">
                          In progress · {Math.round(commitAttain)}% commit
                        </Badge>
                      )}
                      {q.status === 'future' && (
                        <Badge variant="outline" size="sm">
                          Forming · {Math.round(commitAttain)}% covered
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
