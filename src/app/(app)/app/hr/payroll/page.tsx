import Link from 'next/link';
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Download,
  FileText,
  PlayCircle,
  Receipt,
  Shield,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatCurrency, formatDate, initials } from '@/lib/utils';

const lastRunStats = [
  { label: 'Employees paid', value: 246, delta: 1.6, format: 'number' as const, icon: Users },
  { label: 'Total gross', value: 1024500, format: 'currency' as const, delta: 4.2, icon: Wallet },
  { label: 'Total deductions', value: 182160, format: 'currency' as const, delta: 3.8, icon: Receipt, invertTrend: true },
  { label: 'Total net paid', value: 842340, format: 'currency' as const, delta: 4.4, icon: CheckCircle2 },
];

const previousRuns = [
  { id: 'PR-2026-05', period: 'May 2026', payDate: '2026-06-01', employees: 248, gross: 1024500, net: 842340, status: 'in_progress' as const, processedBy: 'Naomi Park' },
  { id: 'PR-2026-04', period: 'April 2026', payDate: '2026-05-01', employees: 246, gross: 1018200, net: 838900, status: 'paid' as const, processedBy: 'Naomi Park' },
  { id: 'PR-2026-03', period: 'March 2026', payDate: '2026-04-01', employees: 244, gross: 1009800, net: 832200, status: 'paid' as const, processedBy: 'Naomi Park' },
  { id: 'PR-2026-02', period: 'February 2026', payDate: '2026-03-01', employees: 240, gross: 989650, net: 815700, status: 'paid' as const, processedBy: 'Naomi Park' },
  { id: 'PR-2026-01', period: 'January 2026', payDate: '2026-02-01', employees: 238, gross: 981200, net: 808800, status: 'paid' as const, processedBy: 'Linnea Johansson' },
  { id: 'PR-2025-12', period: 'December 2025', payDate: '2026-01-02', employees: 235, gross: 1142800, net: 935200, status: 'paid' as const, processedBy: 'Linnea Johansson' },
  { id: 'PR-2025-11', period: 'November 2025', payDate: '2025-12-01', employees: 234, gross: 968400, net: 798250, status: 'paid' as const, processedBy: 'Naomi Park' },
];

const checklist = [
  { label: 'Timesheets approved', done: true, info: '248 / 248 employees' },
  { label: 'Variable pay imported', done: true, info: 'Bonuses, commissions, OT' },
  { label: 'Benefit deductions synced', done: true, info: 'From Rippling Benefits' },
  { label: 'Tax forms validated', done: true, info: 'W-4, state withholdings' },
  { label: 'Manager approvals', done: false, info: '3 of 28 pending' },
  { label: 'Final review & sign-off', done: false, info: 'CFO sign-off required' },
];

const daysUntilPay = 17;

export default function PayrollPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Payroll"
        description="Run payroll, track liabilities, and stay compliant across 11 jurisdictions"
        breadcrumbs={[{ label: 'People', href: '/app/hr' }, { label: 'Payroll' }]}
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" /> Export
            </Button>
            <Button>
              <PlayCircle className="size-4" /> Run payroll
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-info/5" />
            <div className="relative grid grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_auto]">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="soft">In review</Badge>
                  <span className="text-xs text-muted-foreground">Cycle May 2026</span>
                </div>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">{formatCurrency(842340)}</h2>
                <p className="text-sm text-muted-foreground">Net payable across 248 employees</p>
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Pay date</div>
                    <div className="mt-0.5 font-medium">Jun 1, 2026</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Funding cutoff</div>
                    <div className="mt-0.5 font-medium">May 30, 5:00 PM</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Currency</div>
                    <div className="mt-0.5 font-medium">USD (multi-currency)</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background p-6 text-center">
                <CalendarClock className="size-6 text-primary" />
                <div className="mt-2 text-3xl font-bold tabular-nums">{daysUntilPay}</div>
                <div className="text-xs text-muted-foreground">days to pay date</div>
                <div className="mt-2 text-2xs text-muted-foreground">Funded by May 30</div>
              </div>
            </div>
          </div>
          <CardContent className="border-t border-border pt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Run readiness</span>
              <span className="text-sm text-muted-foreground tabular-nums">{checklist.filter((c) => c.done).length}/{checklist.length} complete</span>
            </div>
            <Progress value={(checklist.filter((c) => c.done).length / checklist.length) * 100} />
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {checklist.map((c) => (
                <div key={c.label} className="flex items-center gap-2 rounded-md border border-border/60 px-3 py-2 text-sm">
                  <CheckCircle2 className={`size-4 ${c.done ? 'text-success' : 'text-muted-foreground/40'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{c.label}</div>
                    <div className="truncate text-xs text-muted-foreground">{c.info}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4 text-primary" /> Anomalies detected
              </CardTitle>
              <CardDescription>AI flagged 4 items for review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                <div className="font-medium">Outlier overtime · Diego Fernández</div>
                <div className="text-xs text-muted-foreground">82h OT vs 14h avg over last 6 months</div>
              </div>
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                <div className="font-medium">Missing tax form · 2 employees</div>
                <div className="text-xs text-muted-foreground">Carlos Mendes (BR), Yuki Nakamura (JP)</div>
              </div>
              <div className="rounded-lg border border-info/30 bg-info/5 p-3">
                <div className="font-medium">FX rate change · EUR</div>
                <div className="text-xs text-muted-foreground">EUR up 1.2% vs last run; impact $4,300</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="size-4 text-success" /> Compliance status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Federal tax filing</span>
                <Badge variant="success">Current</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">State tax (5 states)</span>
                <Badge variant="success">Current</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">International filings</span>
                <Badge variant="warning">2 pending</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">SOC 1 audit trail</span>
                <Badge variant="success">Enabled</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {lastRunStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payroll runs</CardTitle>
            <CardDescription>History of all processed and in-progress runs</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            View archive <ArrowRight className="size-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Period</th>
                <th>Pay date</th>
                <th className="text-right">Employees</th>
                <th className="text-right">Gross</th>
                <th className="text-right">Net</th>
                <th>Processed by</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {previousRuns.map((r) => (
                <tr key={r.id}>
                  <td className="font-mono text-xs font-medium text-primary">{r.id}</td>
                  <td className="font-medium">{r.period}</td>
                  <td className="text-sm">{formatDate(r.payDate)}</td>
                  <td className="text-right font-mono tabular-nums">{r.employees}</td>
                  <td className="text-right font-mono">{formatCurrency(r.gross)}</td>
                  <td className="text-right font-mono font-medium">{formatCurrency(r.net)}</td>
                  <td>
                    <div className="flex items-center gap-2 text-sm">
                      <Avatar size="xs">
                        <AvatarFallback name={r.processedBy}>{initials(r.processedBy)}</AvatarFallback>
                      </Avatar>
                      <span>{r.processedBy}</span>
                    </div>
                  </td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" asChild>
                        <Link href={`/app/hr/payroll/runs/${r.id}`}>
                          <FileText className="size-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Download className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payroll cost trend</CardTitle>
            <CardDescription>Last 12 months · USD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-end gap-1.5">
              {[820, 830, 845, 850, 855, 870, 882, 890, 905, 920, 935, 1024].map((v, i) => {
                const max = 1100;
                return (
                  <div key={i} className="group flex flex-1 flex-col items-center gap-1">
                    <div className="relative w-full flex-1">
                      <div
                        className="absolute bottom-0 w-full rounded-t-md bg-primary/30 transition-all group-hover:bg-primary/50"
                        style={{ height: `${(v / max) * 100}%` }}
                      />
                    </div>
                    <div className="text-2xs text-muted-foreground">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Headcount by pay type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Salaried full-time', count: 218, pct: 88 },
              { label: 'Hourly full-time', count: 14, pct: 6 },
              { label: 'Part-time', count: 8, pct: 3 },
              { label: 'Contract / 1099', count: 8, pct: 3 },
            ].map((p) => (
              <div key={p.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{p.label}</span>
                  <span className="font-medium tabular-nums">{p.count}</span>
                </div>
                <Progress value={p.pct} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top expense categories</CardTitle>
            <CardDescription>This pay period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Base salary</span>
              <span className="font-mono">{formatCurrency(840000)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Bonuses</span>
              <span className="font-mono">{formatCurrency(84500)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Health insurance</span>
              <span className="font-mono">{formatCurrency(48200)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">401(k) match</span>
              <span className="font-mono">{formatCurrency(28400)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Stock vesting</span>
              <span className="font-mono">{formatCurrency(23400)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 font-medium">
              <span>Total cost</span>
              <span className="font-mono">{formatCurrency(1024500)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
