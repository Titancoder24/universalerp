import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Plus,
  Sparkles,
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
import { StatusBadge } from '@/components/ui/status-badge';
import { cn, formatDate, initials } from '@/lib/utils';

const stats = [
  { label: 'Open requisitions', value: 12, delta: 20, format: 'number' as const, icon: Briefcase },
  { label: 'Candidates in pipeline', value: 184, delta: 8.4, format: 'number' as const, icon: Users },
  { label: 'Avg time to hire', value: '32d', deltaLabel: '-6d MoM', icon: Clock },
  { label: 'Offers extended', value: 8, deltaLabel: 'this month', icon: CheckCircle2 },
];

const funnel = [
  { stage: 'Applied', count: 1248, color: 'bg-muted-foreground', pct: 100 },
  { stage: 'Screened', count: 386, color: 'bg-info', pct: 31 },
  { stage: 'Phone screen', count: 142, color: 'bg-primary', pct: 11.4 },
  { stage: 'Onsite', count: 56, color: 'bg-warning', pct: 4.5 },
  { stage: 'Offer', count: 14, color: 'bg-success', pct: 1.1 },
  { stage: 'Hired', count: 9, color: 'bg-success', pct: 0.7 },
];

const jobs = [
  { id: 'JOB-2102', title: 'Senior Backend Engineer', dept: 'Engineering', location: 'San Francisco · Remote', applicants: 84, type: 'Full-time', status: 'open' as const, posted: '2026-04-18', priority: 'high' },
  { id: 'JOB-2101', title: 'Account Executive (AMER)', dept: 'Sales', location: 'New York', applicants: 142, type: 'Full-time', status: 'open' as const, posted: '2026-04-22', priority: 'high' },
  { id: 'JOB-2100', title: 'Product Manager · Platform', dept: 'Engineering', location: 'San Francisco', applicants: 68, type: 'Full-time', status: 'open' as const, posted: '2026-04-25', priority: 'med' },
  { id: 'JOB-2099', title: 'Customer Success Manager', dept: 'Customer Success', location: 'London', applicants: 52, type: 'Full-time', status: 'open' as const, posted: '2026-05-02', priority: 'med' },
  { id: 'JOB-2098', title: 'Marketing Designer', dept: 'Marketing', location: 'Remote · AMER', applicants: 96, type: 'Full-time', status: 'open' as const, posted: '2026-04-30', priority: 'med' },
  { id: 'JOB-2097', title: 'Engineering Intern · Summer 2026', dept: 'Engineering', location: 'San Francisco', applicants: 312, type: 'Intern', status: 'open' as const, posted: '2026-03-15', priority: 'low' },
  { id: 'JOB-2096', title: 'VP of Engineering', dept: 'Engineering', location: 'San Francisco', applicants: 28, type: 'Full-time', status: 'on_hold' as const, posted: '2026-04-10', priority: 'high' },
];

const aiCandidates = [
  { name: 'Alexander Petrov', role: 'Senior Backend Engineer', match: 96, source: 'LinkedIn AI search' },
  { name: 'Maya Krishnamurthy', role: 'Senior Backend Engineer', match: 93, source: 'Referral · D. Kim' },
  { name: 'Wei Zhang', role: 'Senior Backend Engineer', match: 91, source: 'Inbound' },
  { name: 'Sebastián López', role: 'Account Executive', match: 89, source: 'Greenhouse import' },
];

const priorityBadge = (p: string) =>
  p === 'high' ? <Badge variant="destructive" size="sm">P0</Badge> :
  p === 'med' ? <Badge variant="warning" size="sm">P1</Badge> :
  <Badge variant="soft" size="sm">P2</Badge>;

export default function RecruitmentPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Recruitment"
        description="Hire faster with a unified pipeline across all open roles"
        breadcrumbs={[{ label: 'People', href: '/app/hr' }, { label: 'Recruitment' }]}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/app/hr/recruitment/candidates">
                <Users className="size-4" /> Candidates
              </Link>
            </Button>
            <Button>
              <Plus className="size-4" /> New job
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
              <CardTitle>Candidate funnel</CardTitle>
              <CardDescription>Conversion at every stage · last 90 days</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              Pipeline detail <ArrowRight className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funnel.map((f, i) => {
                const widthPct = (f.count / funnel[0].count) * 100;
                const dropoff = i > 0 ? Math.round((1 - f.count / funnel[i - 1].count) * 100) : 0;
                return (
                  <div key={f.stage}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{f.stage}</span>
                      <div className="flex items-center gap-3 text-xs">
                        {i > 0 && <span className="text-muted-foreground">-{dropoff}% drop</span>}
                        <span className="font-mono tabular-nums">{f.count.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-7 overflow-hidden rounded-md bg-muted/40">
                      <div className={cn('flex h-full items-center justify-end pr-2 text-2xs font-medium text-background', f.color)}
                        style={{ width: `${widthPct}%` }}
                      >
                        {f.pct}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm">
              <Sparkles className="size-4 text-warning" />
              <div className="flex-1">
                <div className="font-medium">Biggest drop-off: Phone screen → Onsite</div>
                <div className="text-xs text-muted-foreground">61% of candidates lost. Consider streamlining interview scheduling.</div>
              </div>
              <Button variant="outline" size="sm">Investigate</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-primary" /> AI sourced
            </CardTitle>
            <CardDescription>High-match passive candidates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiCandidates.map((c) => (
              <div key={c.name} className="flex items-center gap-3 rounded-lg border border-border/60 p-2.5">
                <Avatar size="sm"><AvatarFallback name={c.name}>{initials(c.name)}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{c.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{c.role}</div>
                  <div className="text-2xs text-muted-foreground">{c.source}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary">{c.match}%</div>
                  <div className="text-2xs text-muted-foreground">match</div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" size="sm">
              <ExternalLink className="size-3.5" /> See all 36 prospects
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Open requisitions</CardTitle>
            <CardDescription>{jobs.length} active roles · {jobs.reduce((s, j) => s + j.applicants, 0)} total applicants</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/app/hr/recruitment/jobs">
              All jobs <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Department</th>
                <th>Location</th>
                <th>Type</th>
                <th className="text-right">Applicants</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Posted</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="cursor-pointer hover:bg-muted/40">
                  <td>
                    <Link href={`/app/hr/recruitment/jobs/${j.id}`} className="block">
                      <div className="font-mono text-xs font-medium text-primary">{j.id}</div>
                      <div className="font-medium">{j.title}</div>
                    </Link>
                  </td>
                  <td><Badge variant="outline">{j.dept}</Badge></td>
                  <td className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {j.location}</span>
                  </td>
                  <td className="text-sm">{j.type}</td>
                  <td className="text-right font-mono tabular-nums">{j.applicants}</td>
                  <td>{priorityBadge(j.priority)}</td>
                  <td><StatusBadge status={j.status} /></td>
                  <td className="text-xs text-muted-foreground">{formatDate(j.posted)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="size-4" /> Upcoming interviews
            </CardTitle>
            <CardDescription>Next 5 scheduled across all panels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { time: 'Today · 2:00 PM', name: 'Alexander Petrov', role: 'Sr Backend', stage: 'Tech screen', interviewer: 'David Kim' },
              { time: 'Today · 3:30 PM', name: 'Marisol Vega', role: 'AE · AMER', stage: 'Hiring manager', interviewer: 'Marcus Rodriguez' },
              { time: 'Tomorrow · 10:00 AM', name: 'Wei Zhang', role: 'Sr Backend', stage: 'Onsite (4hr)', interviewer: 'Aisha Khan + panel' },
              { time: 'May 17 · 1:00 PM', name: 'Ophelia Hart', role: 'PM Platform', stage: 'Phone screen', interviewer: 'Hiroshi Tanaka' },
              { time: 'May 17 · 4:00 PM', name: 'Kai Saito', role: 'CSM London', stage: 'Final round', interviewer: 'Priya Patel' },
            ].map((iv, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-md bg-primary/10 text-primary">
                  <div className="text-2xs">{iv.time.split(' · ')[0]}</div>
                  <div className="text-xs font-semibold leading-none">{iv.time.split(' · ')[1]}</div>
                </div>
                <Avatar size="sm"><AvatarFallback name={iv.name}>{initials(iv.name)}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{iv.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{iv.role} · {iv.stage}</div>
                </div>
                <Badge variant="outline" size="sm">{iv.interviewer.split(' ')[0]}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 text-success" /> Source effectiveness
            </CardTitle>
            <CardDescription>By hire conversion rate · last 12 months</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { source: 'Employee referrals', hires: 18, rate: 12.4, color: 'bg-success' },
              { source: 'LinkedIn', hires: 14, rate: 4.2, color: 'bg-primary' },
              { source: 'Greenhouse + jobs board', hires: 9, rate: 1.8, color: 'bg-info' },
              { source: 'Recruiting agency', hires: 7, rate: 6.1, color: 'bg-warning' },
              { source: 'Inbound applications', hires: 5, rate: 0.9, color: 'bg-muted-foreground' },
            ].map((s) => (
              <div key={s.source}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{s.source}</span>
                  <span className="text-muted-foreground">
                    {s.hires} hires · {s.rate}% conv
                  </span>
                </div>
                <Progress value={s.rate * 7} indicatorClassName={s.color} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
