import { Download, Plus, TrendingUp, Trophy } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatCard } from '@/components/ui/stat-card';
import { formatCurrency, initials, colorFromString } from '@/lib/utils';

const reps = [
  { name: 'Sarah Chen', quota: 500000, attainment: 645000, commission: 32250, deals: 18, role: 'Sales Manager' },
  { name: 'Tom Becker', quota: 350000, attainment: 412000, commission: 16480, deals: 12, role: 'Senior AE' },
  { name: 'Diego Santos', quota: 300000, attainment: 285000, commission: 11400, deals: 9, role: 'AE' },
  { name: 'Emma Williams', quota: 250000, attainment: 198000, commission: 7920, deals: 7, role: 'AE' },
  { name: 'Marcus Lee', quota: 250000, attainment: 312000, commission: 12480, deals: 11, role: 'AE' },
];

const plans = [
  { code: 'STANDARD', name: 'Standard Plan', description: '4% on closed-won revenue', activeReps: 8 },
  { code: 'TIERED', name: 'Tiered Accelerator', description: '4% up to quota, 6% above', activeReps: 3 },
  { code: 'TEAM_LEAD', name: 'Team Lead Override', description: '5% individual + 1% team', activeReps: 2 },
];

export default function CommissionsPage() {
  const totalCommissions = reps.reduce((s, r) => s + r.commission, 0);
  const totalRevenue = reps.reduce((s, r) => s + r.attainment, 0);
  const avgAttainment = (totalRevenue / reps.reduce((s, r) => s + r.quota, 0)) * 100;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Commissions"
        description="Sales rep commission plans, accruals, and statements."
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New plan</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total commissions YTD" value={totalCommissions} format="currency" delta={18.2} />
        <StatCard label="Avg quota attainment" value={avgAttainment} format="percent" delta={4.2} />
        <StatCard label="Revenue YTD" value={totalRevenue} format="currency" delta={22.4} />
        <StatCard label="Active commission plans" value={plans.length} format="number" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quota attainment leaderboard</CardTitle>
          <CardDescription>Current quarter performance vs target</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reps
              .sort((a, b) => b.attainment / b.quota - a.attainment / a.quota)
              .map((rep, i) => {
                const attainmentPct = (rep.attainment / rep.quota) * 100;
                return (
                  <div key={rep.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${
                          i === 0 ? 'bg-warning text-warning-foreground' :
                          i === 1 ? 'bg-muted-foreground/20' :
                          i === 2 ? 'bg-orange-500/20 text-orange-700' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {i + 1}
                        </span>
                        <Avatar size="sm">
                          <AvatarFallback style={{ backgroundColor: colorFromString(rep.name) }} className="text-xs text-white">
                            {initials(rep.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{rep.name}</div>
                          <div className="text-2xs text-muted-foreground">{rep.role} · {rep.deals} deals</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm font-semibold">{formatCurrency(rep.attainment)}</div>
                        <div className="text-2xs text-muted-foreground">of {formatCurrency(rep.quota)} quota</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={Math.min(100, attainmentPct)} className="flex-1" />
                      <span className={`text-sm font-semibold w-16 text-right ${
                        attainmentPct >= 100 ? 'text-success' : attainmentPct >= 75 ? 'text-warning' : 'text-muted-foreground'
                      }`}>
                        {attainmentPct.toFixed(0)}%
                      </span>
                      <div className="w-24 text-right">
                        <div className="text-xs text-muted-foreground">Commission</div>
                        <div className="font-mono text-sm font-medium">{formatCurrency(rep.commission)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission plans</CardTitle>
          <CardDescription>Configurable plans defining how commissions accrue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {plans.map((p) => (
            <div key={p.code} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Trophy className="size-5" />
                </div>
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.description}</div>
                  <Badge variant="outline" className="mt-1.5 text-2xs font-mono">{p.code}</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{p.activeReps} reps</div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
