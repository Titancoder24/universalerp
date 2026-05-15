import Link from 'next/link';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ExternalLink,
  GripVertical,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Share2,
  Sparkles,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatDate, initials } from '@/lib/utils';

const job = {
  id: 'JOB-2102',
  title: 'Senior Backend Engineer',
  dept: 'Engineering',
  team: 'Platform',
  location: 'San Francisco · Remote (AMER)',
  type: 'Full-time',
  level: 'IC5',
  status: 'open' as const,
  posted: '2026-04-18',
  hiringManager: 'Aisha Khan',
  recruiter: 'Naomi Park',
  salary: '$210K – $250K + equity',
  applicants: 84,
  newThisWeek: 12,
};

const stages = [
  { id: 'applied', name: 'Applied', tone: 'border-t-muted-foreground' },
  { id: 'screened', name: 'Screened', tone: 'border-t-info' },
  { id: 'phone', name: 'Phone screen', tone: 'border-t-primary' },
  { id: 'onsite', name: 'Onsite', tone: 'border-t-warning' },
  { id: 'offer', name: 'Offer', tone: 'border-t-success' },
  { id: 'hired', name: 'Hired', tone: 'border-t-success' },
  { id: 'rejected', name: 'Rejected', tone: 'border-t-destructive' },
];

interface Candidate {
  name: string;
  stage: string;
  match: number;
  source: string;
  applied: string;
  flag?: 'hot' | 'referred' | 'top';
}

const candidates: Candidate[] = [
  { name: 'Alexander Petrov', stage: 'phone', match: 96, source: 'LinkedIn', applied: '2 days ago', flag: 'top' },
  { name: 'Maya Krishnamurthy', stage: 'onsite', match: 93, source: 'Referral · D. Kim', applied: '5 days ago', flag: 'referred' },
  { name: 'Wei Zhang', stage: 'onsite', match: 91, source: 'Inbound', applied: '1 week ago' },
  { name: 'Sebastián López', stage: 'phone', match: 89, source: 'Greenhouse' , applied: '4 days ago' },
  { name: 'Aleksandra Nowak', stage: 'screened', match: 88, source: 'LinkedIn', applied: '3 days ago' },
  { name: 'Bilal Ahmed', stage: 'screened', match: 86, source: 'Inbound', applied: '2 days ago', flag: 'hot' },
  { name: 'Yara Hassan', stage: 'applied', match: 84, source: 'Careers page', applied: '1 day ago' },
  { name: 'Henrik Lindgren', stage: 'applied', match: 82, source: 'Stack Overflow', applied: '3 days ago' },
  { name: 'Chloe Davenport', stage: 'offer', match: 95, source: 'Referral', applied: '3 weeks ago', flag: 'top' },
  { name: 'Marco Bianchi', stage: 'rejected', match: 64, source: 'Inbound', applied: '5 days ago' },
  { name: 'Aiyana Redhawk', stage: 'screened', match: 79, source: 'Greenhouse', applied: '4 days ago' },
  { name: 'Theodore Pierce', stage: 'applied', match: 76, source: 'LinkedIn', applied: '2 days ago' },
  { name: 'Ines Carvalho', stage: 'applied', match: 75, source: 'Careers page', applied: '4 hours ago' },
  { name: 'Jamal Reynolds', stage: 'applied', match: 73, source: 'Inbound', applied: '6 hours ago' },
  { name: 'Lara Petersen', stage: 'phone', match: 87, source: 'Referral', applied: '6 days ago', flag: 'referred' },
  { name: 'Omar El-Sayed', stage: 'rejected', match: 58, source: 'Inbound', applied: '8 days ago' },
];

function CandidateCard({ c }: { c: Candidate }) {
  return (
    <div className="surface-card group cursor-grab space-y-2 border border-border bg-background p-3 shadow-xs transition-all hover:shadow-md active:cursor-grabbing">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar size="sm"><AvatarFallback name={c.name}>{initials(c.name)}</AvatarFallback></Avatar>
          <div>
            <div className="text-sm font-medium leading-tight">{c.name}</div>
            <div className="text-2xs text-muted-foreground">{c.source}</div>
          </div>
        </div>
        <GripVertical className="size-3 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex-1">
          <div className="mb-0.5 flex items-center justify-between text-2xs">
            <span className="text-muted-foreground">AI match</span>
            <span className="font-medium tabular-nums">{c.match}%</span>
          </div>
          <Progress value={c.match} className="h-1" indicatorClassName={c.match >= 90 ? 'bg-success' : c.match >= 75 ? 'bg-primary' : 'bg-warning'} />
        </div>
      </div>
      <div className="flex items-center justify-between text-2xs">
        <span className="text-muted-foreground">{c.applied}</span>
        <div className="flex gap-1">
          {c.flag === 'top' && <Badge variant="success" size="sm">Top</Badge>}
          {c.flag === 'referred' && <Badge variant="info" size="sm">Referral</Badge>}
          {c.flag === 'hot' && <Badge variant="warning" size="sm">Hot</Badge>}
        </div>
      </div>
    </div>
  );
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await params;
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={job.title}
        description={`${job.id} · ${job.dept} · ${job.location}`}
        breadcrumbs={[
          { label: 'People', href: '/app/hr' },
          { label: 'Recruitment', href: '/app/hr/recruitment' },
          { label: 'Jobs', href: '/app/hr/recruitment/jobs' },
          { label: job.title },
        ]}
        back={
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/app/hr/recruitment/jobs"><ChevronLeft className="size-4" /></Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline">
              <Share2 className="size-4" /> Share
            </Button>
            <Button variant="outline">
              <ExternalLink className="size-4" /> View posting
            </Button>
            <Button>
              <Plus className="size-4" /> Add candidate
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={job.status} />
              <Badge variant="outline">{job.level}</Badge>
              <Badge variant="outline">{job.type}</Badge>
              <Badge variant="destructive" size="sm">P0</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div>
                <div className="text-xs text-muted-foreground">Hiring manager</div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <Avatar size="xs"><AvatarFallback name={job.hiringManager}>{initials(job.hiringManager)}</AvatarFallback></Avatar>
                  <span className="font-medium">{job.hiringManager}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Recruiter</div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <Avatar size="xs"><AvatarFallback name={job.recruiter}>{initials(job.recruiter)}</AvatarFallback></Avatar>
                  <span className="font-medium">{job.recruiter}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Team</div>
                <div className="mt-0.5 font-medium">{job.team}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Salary range</div>
                <div className="mt-0.5 font-medium">{job.salary}</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-2 lg:text-right">
            <div>
              <div className="text-xs text-muted-foreground">Applicants</div>
              <div className="text-2xl font-semibold tabular-nums">{job.applicants}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">New this week</div>
              <div className="text-2xl font-semibold tabular-nums text-success">{job.newThisWeek}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Days open</div>
              <div className="text-2xl font-semibold tabular-nums">27</div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="pipeline">
        <TabsList variant="underline">
          <TabsTrigger value="pipeline" variant="underline">Pipeline</TabsTrigger>
          <TabsTrigger value="description" variant="underline">Description</TabsTrigger>
          <TabsTrigger value="panel" variant="underline">Interview panel</TabsTrigger>
          <TabsTrigger value="activity" variant="underline">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline">
          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max gap-3">
              {stages.map((s) => {
                const stageCandidates = candidates.filter((c) => c.stage === s.id);
                return (
                  <div key={s.id} className="w-[280px] shrink-0">
                    <div className={cn('mb-2 rounded-t-lg border-t-2 bg-card px-3 pt-3', s.tone)}>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">{s.name}</div>
                        <Badge variant="outline" size="sm">{stageCandidates.length}</Badge>
                      </div>
                    </div>
                    <div className="space-y-2 rounded-b-lg bg-muted/30 p-2 min-h-[200px]">
                      {stageCandidates.map((c) => <CandidateCard key={c.name} c={c} />)}
                      <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                        <Plus className="size-3.5" /> Add
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="description">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About this role</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none space-y-4 text-sm">
              <p>
                Universal is hiring a Senior Backend Engineer to join our Platform team. You'll
                own the services that thousands of growing businesses rely on every day — from
                accounting ledgers to real-time inventory.
              </p>
              <div>
                <h4 className="font-semibold">What you'll do</h4>
                <ul className="ml-5 mt-1 list-disc space-y-1 text-muted-foreground">
                  <li>Design and ship distributed systems handling 10K+ TPS</li>
                  <li>Lead architecture decisions for a service used across 6 product areas</li>
                  <li>Mentor 2-3 mid-level engineers and elevate platform standards</li>
                  <li>Partner with product to shape the technical roadmap</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">What we look for</h4>
                <ul className="ml-5 mt-1 list-disc space-y-1 text-muted-foreground">
                  <li>7+ years building production backend systems</li>
                  <li>Deep expertise in Go, Rust, or modern TypeScript</li>
                  <li>Strong fundamentals in distributed systems, databases, and observability</li>
                  <li>Experience operating multi-tenant SaaS at scale</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="panel">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Interview panel</CardTitle>
              <CardDescription>Default scorecard for this requisition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: 'Aisha Khan', role: 'Hiring Manager', round: 'HM screen · 30 min' },
                { name: 'David Kim', role: 'Tech Screen', round: 'Coding · 60 min' },
                { name: 'Hiroshi Tanaka', role: 'System Design', round: 'Onsite · 90 min' },
                { name: 'Ravi Sharma', role: 'Bar Raiser', round: 'Onsite · 60 min' },
                { name: 'Carlos Mendes', role: 'Peer / Collab', round: 'Onsite · 60 min' },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                  <div className="flex items-center gap-3">
                    <Avatar size="sm"><AvatarFallback name={p.name}>{initials(p.name)}</AvatarFallback></Avatar>
                    <div>
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.role}</div>
                    </div>
                  </div>
                  <Badge variant="outline">{p.round}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { who: 'Aisha Khan', what: 'moved Chloe Davenport to Offer', when: '2 hours ago', icon: CheckCircle2 },
                { who: 'Naomi Park', what: 'scheduled Wei Zhang onsite for May 17', when: '4 hours ago', icon: Calendar },
                { who: 'David Kim', what: 'left feedback on Alexander Petrov', when: 'Yesterday', icon: MessageSquare },
                { who: 'AI Assistant', what: 'sourced 6 new candidates matching this role', when: '2 days ago', icon: Sparkles },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <a.icon className="size-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium">{a.who}</span> {a.what}
                    </div>
                    <div className="text-xs text-muted-foreground">{a.when}</div>
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
