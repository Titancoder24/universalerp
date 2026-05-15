import Link from 'next/link';
import { ChevronLeft, Download, FileSearch, MoreHorizontal, Send, Shield, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatCurrency, initials } from '@/lib/utils';

const run = {
  id: 'PR-2026-05',
  period: 'May 1 – 31, 2026',
  payDate: 'June 1, 2026',
  employees: 248,
  gross: 1024500,
  deductions: 39360,
  tax: 142800,
  net: 842340,
  status: 'in_progress' as const,
  approvers: ['Naomi Park', 'Rebecca Chen', 'Jonathan Wright'],
};

interface PayrollRow {
  name: string;
  dept: string;
  base: number;
  variable: number;
  gross: number;
  deductions: number;
  tax: number;
  net: number;
  flag?: 'high' | 'missing' | 'fx';
}

const rows: PayrollRow[] = [
  { name: 'Sarah Chen', dept: 'Engineering', base: 11833, variable: 0, gross: 11833, deductions: 1672, tax: 2240, net: 7921 },
  { name: 'Marcus Rodriguez', dept: 'Sales', base: 18750, variable: 8400, gross: 27150, deductions: 3260, tax: 6420, net: 17470 },
  { name: 'Priya Patel', dept: 'Customer Success', base: 9200, variable: 1200, gross: 10400, deductions: 1395, tax: 1820, net: 7185 },
  { name: 'David Kim', dept: 'Engineering', base: 10500, variable: 0, gross: 10500, deductions: 1490, tax: 1995, net: 7015 },
  { name: 'Emma Thompson', dept: 'Marketing', base: 6850, variable: 0, gross: 6850, deductions: 982, tax: 1242, net: 4626 },
  { name: 'Jonathan Wright', dept: 'Executive', base: 35000, variable: 12000, gross: 47000, deductions: 5240, tax: 12180, net: 29580 },
  { name: 'Olivia Martinez', dept: 'Customer Success', base: 14583, variable: 2400, gross: 16983, deductions: 2104, tax: 3984, net: 10895 },
  { name: 'Aisha Khan', dept: 'Engineering', base: 17500, variable: 3200, gross: 20700, deductions: 2580, tax: 4938, net: 13182 },
  { name: 'Hiroshi Tanaka', dept: 'Engineering', base: 25000, variable: 6000, gross: 31000, deductions: 3450, tax: 7720, net: 19830 },
  { name: 'Liam O\'Brien', dept: 'Engineering', base: 12200, variable: 0, gross: 12200, deductions: 1820, tax: 0, net: 10380, flag: 'fx' },
  { name: 'Sofia Rossi', dept: 'Marketing', base: 19200, variable: 4200, gross: 23400, deductions: 2950, tax: 5604, net: 14846 },
  { name: 'Ahmed Hassan', dept: 'Sales', base: 11000, variable: 5800, gross: 16800, deductions: 1980, tax: 0, net: 14820, flag: 'fx' },
  { name: 'Yuki Nakamura', dept: 'Operations', base: 9200, variable: 800, gross: 10000, deductions: 1440, tax: 0, net: 8560, flag: 'missing' },
  { name: 'Rebecca Chen', dept: 'Operations', base: 21000, variable: 4800, gross: 25800, deductions: 3120, tax: 6210, net: 16470 },
  { name: 'Diego Fernández', dept: 'Sales', base: 5400, variable: 4200, gross: 9600, deductions: 1280, tax: 0, net: 8320, flag: 'high' },
];

const flagBadge = {
  high: <Badge variant="warning" size="sm">High variance</Badge>,
  missing: <Badge variant="destructive" size="sm">Tax form missing</Badge>,
  fx: <Badge variant="info" size="sm">FX</Badge>,
};

export default async function PayrollRunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`Payroll run ${id}`}
        description={`${run.period} · Pay date ${run.payDate}`}
        breadcrumbs={[
          { label: 'People', href: '/app/hr' },
          { label: 'Payroll', href: '/app/hr/payroll' },
          { label: id },
        ]}
        back={
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/app/hr/payroll"><ChevronLeft className="size-4" /></Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" /> Export
            </Button>
            <Button variant="outline">
              <X className="size-4" /> Reject
            </Button>
            <Button variant="success">
              <Send className="size-4" /> Approve & schedule
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="soft">{run.status === 'in_progress' ? 'In review' : run.status}</Badge>
                  <span className="text-xs text-muted-foreground">Cycle May 2026 · Monthly</span>
                </div>
                <CardTitle className="mt-1.5 text-3xl tabular-nums">{formatCurrency(run.net)}</CardTitle>
                <CardDescription>Net payable across {run.employees} employees</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Avatar size="sm" className="ring-2 ring-background">
                  <AvatarFallback name="Naomi Park">{initials('Naomi Park')}</AvatarFallback>
                </Avatar>
                <Avatar size="sm" className="-ml-3 ring-2 ring-background">
                  <AvatarFallback name="Rebecca Chen">{initials('Rebecca Chen')}</AvatarFallback>
                </Avatar>
                <Avatar size="sm" className="-ml-3 ring-2 ring-background">
                  <AvatarFallback name="Jonathan Wright">{initials('Jonathan Wright')}</AvatarFallback>
                </Avatar>
                <span className="ml-2 text-xs text-muted-foreground">3 approvers</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <div className="text-xs text-muted-foreground">Total gross</div>
              <div className="mt-1 text-xl font-semibold tabular-nums">{formatCurrency(run.gross)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Deductions</div>
              <div className="mt-1 text-xl font-semibold tabular-nums">{formatCurrency(run.deductions)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Tax withheld</div>
              <div className="mt-1 text-xl font-semibold tabular-nums">{formatCurrency(run.tax)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Net pay</div>
              <div className="mt-1 text-xl font-semibold tabular-nums text-success">{formatCurrency(run.net)}</div>
            </div>
            <div className="col-span-2 sm:col-span-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Approval progress · 2 of 3</span>
                <span className="font-medium">67%</span>
              </div>
              <Progress value={67} />
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <Badge variant="success" size="sm">Naomi Park · approved</Badge>
                <Badge variant="success" size="sm">Rebecca Chen · approved</Badge>
                <Badge variant="warning" size="sm">Jonathan Wright · pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="size-4 text-success" /> Run validations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Timesheets</span><Badge variant="success" size="sm">Synced</Badge></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Benefits</span><Badge variant="success" size="sm">Imported</Badge></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Tax filings</span><Badge variant="warning" size="sm">2 issues</Badge></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Bank funding</span><Badge variant="success" size="sm">Confirmed</Badge></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">FX rates</span><Badge variant="info" size="sm">Locked</Badge></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Audit trail</span><Badge variant="success" size="sm">Enabled</Badge></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle>Employee breakdown</CardTitle>
            <CardDescription>{rows.length} of {run.employees} shown · sorted by gross</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input placeholder="Search employees..." className="w-56" />
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                <SelectItem value="eng">Engineering</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="mkt">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-flags">
              <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all-flags">All flags</SelectItem>
                <SelectItem value="flagged">Flagged only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th className="text-right">Base</th>
                <th className="text-right">Variable</th>
                <th className="text-right">Gross</th>
                <th className="text-right">Deductions</th>
                <th className="text-right">Tax</th>
                <th className="text-right">Net</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback name={r.name}>{initials(r.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{r.name}</div>
                        {r.flag && <div className="mt-0.5">{flagBadge[r.flag]}</div>}
                      </div>
                    </div>
                  </td>
                  <td><Badge variant="outline">{r.dept}</Badge></td>
                  <td className="text-right font-mono">{formatCurrency(r.base)}</td>
                  <td className="text-right font-mono text-muted-foreground">{formatCurrency(r.variable)}</td>
                  <td className="text-right font-mono">{formatCurrency(r.gross)}</td>
                  <td className="text-right font-mono text-muted-foreground">{formatCurrency(r.deductions)}</td>
                  <td className="text-right font-mono text-muted-foreground">{formatCurrency(r.tax)}</td>
                  <td className="text-right font-mono font-medium">{formatCurrency(r.net)}</td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" aria-label="View payslip">
                        <FileSearch className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30 font-semibold">
                <td colSpan={2} className="px-3 py-3">Totals (shown)</td>
                <td className="text-right font-mono">{formatCurrency(rows.reduce((s, r) => s + r.base, 0))}</td>
                <td className="text-right font-mono">{formatCurrency(rows.reduce((s, r) => s + r.variable, 0))}</td>
                <td className="text-right font-mono">{formatCurrency(rows.reduce((s, r) => s + r.gross, 0))}</td>
                <td className="text-right font-mono">{formatCurrency(rows.reduce((s, r) => s + r.deductions, 0))}</td>
                <td className="text-right font-mono">{formatCurrency(rows.reduce((s, r) => s + r.tax, 0))}</td>
                <td className="text-right font-mono">{formatCurrency(rows.reduce((s, r) => s + r.net, 0))}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Journal entries</CardTitle>
            <CardDescription>Auto-generated GL entries on approval</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr><th>Account</th><th className="text-right">Debit</th><th className="text-right">Credit</th></tr>
              </thead>
              <tbody>
                <tr><td>Salary expense</td><td className="text-right font-mono">{formatCurrency(840000)}</td><td></td></tr>
                <tr><td>Bonus expense</td><td className="text-right font-mono">{formatCurrency(84500)}</td><td></td></tr>
                <tr><td>Benefits expense</td><td className="text-right font-mono">{formatCurrency(100000)}</td><td></td></tr>
                <tr><td>Tax withholdings payable</td><td></td><td className="text-right font-mono">{formatCurrency(142800)}</td></tr>
                <tr><td>Benefits payable</td><td></td><td className="text-right font-mono">{formatCurrency(39360)}</td></tr>
                <tr><td>Cash – Operating</td><td></td><td className="text-right font-mono">{formatCurrency(842340)}</td></tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity log</CardTitle>
            <CardDescription>Run history and audit trail</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { who: 'Rebecca Chen', what: 'approved this run', when: '2 hours ago' },
              { who: 'Naomi Park', what: 'submitted for approval', when: '5 hours ago' },
              { who: 'AI Validator', what: 'flagged 4 anomalies', when: '6 hours ago' },
              { who: 'Naomi Park', what: 'imported timesheets', when: '1 day ago' },
              { who: 'System', what: 'created run', when: '3 days ago' },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <Avatar size="sm">
                  <AvatarFallback name={a.who}>{initials(a.who)}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <span className="font-medium">{a.who}</span>
                  <span className="text-muted-foreground"> {a.what}</span>
                  <div className="text-xs text-muted-foreground">{a.when}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
