import Link from 'next/link';
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Download,
  Filter,
  Plus,
  Receipt,
  Search,
  Sparkles,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatCurrency, formatDate, initials } from '@/lib/utils';

type ExpenseStatus = 'draft' | 'submitted' | 'approved' | 'reimbursed' | 'rejected';

interface ExpenseReport {
  id: string;
  title: string;
  owner: string;
  ownerDept: string;
  category: string;
  lineItems: number;
  amount: number;
  approved?: number;
  status: ExpenseStatus;
  date: string;
  policyFlag?: boolean;
}

const reports: ExpenseReport[] = [
  { id: 'EXP-2026-0184', title: 'AWS re:Invent 2026', owner: 'Aisha Khan', ownerDept: 'Engineering', category: 'Travel', lineItems: 14, amount: 4820, status: 'submitted', date: '2026-05-13' },
  { id: 'EXP-2026-0183', title: 'Q2 sales kickoff dinner', owner: 'Marcus Rodriguez', ownerDept: 'Sales', category: 'Meals', lineItems: 6, amount: 1240, approved: 1180, status: 'approved', date: '2026-05-12', policyFlag: true },
  { id: 'EXP-2026-0182', title: 'May client visit – NYC', owner: 'Priya Patel', ownerDept: 'Customer Success', category: 'Travel', lineItems: 8, amount: 1840, approved: 1840, status: 'reimbursed', date: '2026-05-09' },
  { id: 'EXP-2026-0181', title: 'Office supplies', owner: 'Emma Thompson', ownerDept: 'Marketing', category: 'Office', lineItems: 4, amount: 318, status: 'draft', date: '2026-05-15' },
  { id: 'EXP-2026-0180', title: 'Customer lunch · Acme', owner: 'Diego Fernández', ownerDept: 'Sales', category: 'Meals', lineItems: 1, amount: 184, status: 'submitted', date: '2026-05-14' },
  { id: 'EXP-2026-0179', title: 'Conference – Webflow Summit', owner: 'Sarah Chen', ownerDept: 'Engineering', category: 'Training', lineItems: 5, amount: 1620, approved: 1620, status: 'reimbursed', date: '2026-05-06' },
  { id: 'EXP-2026-0178', title: 'Marketing software (Q2)', owner: 'Sofia Rossi', ownerDept: 'Marketing', category: 'Software', lineItems: 3, amount: 2840, approved: 2840, status: 'approved', date: '2026-05-04' },
  { id: 'EXP-2026-0177', title: 'Team offsite – Tahoe', owner: 'Rebecca Chen', ownerDept: 'Operations', category: 'Travel', lineItems: 22, amount: 8420, status: 'rejected', date: '2026-05-02' },
  { id: 'EXP-2026-0176', title: 'Recruiting flights – April', owner: 'Naomi Park', ownerDept: 'Human Resources', category: 'Travel', lineItems: 9, amount: 2960, approved: 2960, status: 'reimbursed', date: '2026-04-30' },
  { id: 'EXP-2026-0175', title: 'Hardware – monitors', owner: 'David Kim', ownerDept: 'Engineering', category: 'Equipment', lineItems: 2, amount: 1280, approved: 1280, status: 'approved', date: '2026-04-28' },
];

const totals = {
  claimed: reports.reduce((s, r) => s + r.amount, 0),
  approved: reports.reduce((s, r) => s + (r.approved ?? 0), 0),
  pending: reports.filter((r) => r.status === 'submitted').reduce((s, r) => s + r.amount, 0),
};

const stats = [
  { label: 'Total claimed (MTD)', value: 28420, format: 'currency' as const, delta: 12.4, icon: Receipt },
  { label: 'Approved', value: totals.approved, format: 'currency' as const, deltaLabel: `${Math.round((totals.approved / totals.claimed) * 100)}% of claimed`, icon: CheckCircle2 },
  { label: 'Pending review', value: totals.pending, format: 'currency' as const, deltaLabel: `${reports.filter((r) => r.status === 'submitted').length} reports`, icon: ArrowUpRight, invertTrend: true },
  { label: 'Avg time to approve', value: '2.4 d', deltaLabel: '-0.8d MoM', icon: Sparkles },
];

const categories = [
  { name: 'Travel', amount: 18040, color: 'bg-primary', share: 63 },
  { name: 'Meals', amount: 1424, color: 'bg-warning', share: 5 },
  { name: 'Software', amount: 2840, color: 'bg-info', share: 10 },
  { name: 'Equipment', amount: 1280, color: 'bg-success', share: 5 },
  { name: 'Training', amount: 1620, color: 'bg-purple-500', share: 6 },
  { name: 'Office', amount: 318, color: 'bg-pink-500', share: 1 },
];

export default function ExpensesPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Expenses"
        description="Submit, review, and reimburse employee expense reports"
        breadcrumbs={[{ label: 'People', href: '/app/hr' }, { label: 'Expenses' }]}
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" /> Export
            </Button>
            <Button asChild>
              <Link href="/app/hr/expenses/new">
                <Plus className="size-4" /> New report
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
          <CardHeader>
            <CardTitle className="text-base">Claimed vs approved · 6 month trend</CardTitle>
            <CardDescription>Visibility into reimbursement pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-44 items-end gap-3">
              {[
                { m: 'Dec', claimed: 22, approved: 19 },
                { m: 'Jan', claimed: 24, approved: 21 },
                { m: 'Feb', claimed: 19, approved: 18 },
                { m: 'Mar', claimed: 27, approved: 24 },
                { m: 'Apr', claimed: 31, approved: 28 },
                { m: 'May', claimed: 28, approved: 14 },
              ].map((d) => (
                <div key={d.m} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex h-full w-full items-end gap-1">
                    <div
                      className="flex-1 rounded-t-md bg-primary/70 transition-all hover:bg-primary"
                      style={{ height: `${(d.claimed / 35) * 100}%` }}
                      title={`${d.claimed}k claimed`}
                    />
                    <div
                      className="flex-1 rounded-t-md bg-success/70 transition-all hover:bg-success"
                      style={{ height: `${(d.approved / 35) * 100}%` }}
                      title={`${d.approved}k approved`}
                    />
                  </div>
                  <span className="text-2xs text-muted-foreground">{d.m}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary/70" /> Claimed</div>
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-success/70" /> Approved</div>
              <div className="ml-auto text-muted-foreground">All values in $1,000s</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top categories · May</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.map((c) => (
              <div key={c.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{c.name}</span>
                  <span className="font-mono tabular-nums">{formatCurrency(c.amount)}</span>
                </div>
                <Progress value={c.share} indicatorClassName={c.color} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Expense reports</CardTitle>
            <CardDescription>{reports.length} reports across all employees</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input placeholder="Search reports..." className="w-56 pl-8" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="reimbursed">Reimbursed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-cat">
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all-cat">All categories</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="meals">Meals</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="training">Training</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon"><Filter className="size-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Owner</th>
                <th>Category</th>
                <th className="text-right">Items</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Approved</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="cursor-pointer hover:bg-muted/40">
                  <td>
                    <div className="font-mono text-xs font-medium text-primary">{r.id}</div>
                    <div className="flex items-center gap-2 font-medium">
                      {r.title}
                      {r.policyFlag && <Badge variant="warning" size="sm">Policy</Badge>}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback name={r.owner}>{initials(r.owner)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{r.owner}</div>
                        <div className="text-xs text-muted-foreground">{r.ownerDept}</div>
                      </div>
                    </div>
                  </td>
                  <td><Badge variant="outline">{r.category}</Badge></td>
                  <td className="text-right font-mono tabular-nums">{r.lineItems}</td>
                  <td className="text-right font-mono">{formatCurrency(r.amount)}</td>
                  <td className="text-right font-mono text-muted-foreground">
                    {r.approved !== undefined ? formatCurrency(r.approved) : '—'}
                  </td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className="text-xs text-muted-foreground">{formatDate(r.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-primary" /> AI policy checks
            </CardTitle>
            <CardDescription>Auto-flagged issues this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
              <div className="font-medium">Over per-meal limit · $112</div>
              <div className="text-xs text-muted-foreground">Marcus Rodriguez · EXP-0183 · cap $75</div>
            </div>
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <div className="font-medium">Missing receipt over $25</div>
              <div className="text-xs text-muted-foreground">Diego Fernández · EXP-0180</div>
            </div>
            <div className="rounded-lg border border-info/30 bg-info/5 p-3">
              <div className="font-medium">Duplicate uploaded</div>
              <div className="text-xs text-muted-foreground">Same vendor + date + amount detected</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top spenders · YTD</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Marcus Rodriguez', amount: 28400 },
              { name: 'Aisha Khan', amount: 21800 },
              { name: 'Rebecca Chen', amount: 18600 },
              { name: 'Priya Patel', amount: 14200 },
              { name: 'Ahmed Hassan', amount: 12800 },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <Avatar size="sm"><AvatarFallback name={p.name}>{initials(p.name)}</AvatarFallback></Avatar>
                <span className="flex-1 truncate font-medium">{p.name}</span>
                <span className="font-mono text-sm tabular-nums">{formatCurrency(p.amount)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reimbursement cycle</CardTitle>
            <CardDescription>How long it takes to pay employees back</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Average</span>
              <span className="font-medium">5.2 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Fastest</span>
              <span className="font-medium">0.8 days <ArrowDownRight className="inline size-3 text-success" /></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Slowest</span>
              <span className="font-medium">17.4 days</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Within SLA (7 days)</span>
                <span className="font-medium">82%</span>
              </div>
              <Progress value={82} indicatorClassName="bg-success" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
