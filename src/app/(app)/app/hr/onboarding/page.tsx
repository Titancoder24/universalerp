import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Laptop,
  MessageSquare,
  Plus,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/ui/stat-card';
import { cn, initials } from '@/lib/utils';

const stats = [
  { label: 'Active onboarding', value: 12, deltaLabel: '4 starting this week', icon: UserPlus },
  { label: 'Avg completion', value: '74%', delta: 6.2, icon: CheckCircle2 },
  { label: 'Avg time to productive', value: '18d', deltaLabel: '-3d MoM', icon: Sparkles },
  { label: 'Tasks pending', value: 38, deltaLabel: 'across 12 people', icon: ClipboardList, invertTrend: true },
];

interface OnboardingPerson {
  name: string;
  title: string;
  startDate: string;
  daysIn: number;
  progress: number;
  buddy: string;
  manager: string;
  tasksDone: number;
  tasksTotal: number;
  status: 'pre-start' | 'in-progress' | 'complete';
  nextTask: string;
}

const people: OnboardingPerson[] = [
  { name: 'Sarah Chen', title: 'Senior Product Designer', startDate: 'May 12', daysIn: 3, progress: 38, buddy: 'Carlos Mendes', manager: 'Aisha Khan', tasksDone: 12, tasksTotal: 32, status: 'in-progress', nextTask: 'Complete IT setup & laptop config' },
  { name: 'David Kim', title: 'Backend Engineer', startDate: 'May 1', daysIn: 14, progress: 72, buddy: 'Gabriel Silva', manager: 'Aisha Khan', tasksDone: 23, tasksTotal: 32, status: 'in-progress', nextTask: 'Week 2 manager 1:1' },
  { name: 'Emma Thompson', title: 'Marketing Coordinator', startDate: 'Apr 28', daysIn: 17, progress: 84, buddy: 'Hannah Bauer', manager: 'Sofia Rossi', tasksDone: 27, tasksTotal: 32, status: 'in-progress', nextTask: 'Submit 30-day goals' },
  { name: 'Marcus Rodriguez', title: 'VP of Sales', startDate: 'Mar 8', daysIn: 68, progress: 100, buddy: 'Olivia Martinez', manager: 'Jonathan Wright', tasksDone: 32, tasksTotal: 32, status: 'complete', nextTask: 'Onboarding complete!' },
  { name: 'Carlos Mendes', title: 'Frontend Engineer', startDate: 'May 22', daysIn: -7, progress: 16, buddy: 'David Kim', manager: 'Aisha Khan', tasksDone: 5, tasksTotal: 32, status: 'pre-start', nextTask: 'Sign offer letter' },
  { name: 'Felix Müller', title: 'Account Executive', startDate: 'Feb 27', daysIn: 78, progress: 100, buddy: 'Ahmed Hassan', manager: 'Marcus Rodriguez', tasksDone: 32, tasksTotal: 32, status: 'complete', nextTask: 'Onboarding complete!' },
];

const checklist = [
  { section: 'Pre-start', tasks: [
    { name: 'Sign offer letter', done: true, owner: 'Candidate' },
    { name: 'Complete background check', done: true, owner: 'Operations' },
    { name: 'Submit I-9 documents', done: true, owner: 'Candidate' },
    { name: 'Order equipment (laptop, monitor, peripherals)', done: false, owner: 'IT' },
    { name: 'Provision accounts (Slack, GitHub, Notion)', done: false, owner: 'IT' },
  ]},
  { section: 'Week 1', tasks: [
    { name: 'Day 1 welcome breakfast', done: false, owner: 'People Ops' },
    { name: 'Workplace tour & badge', done: false, owner: 'Office Manager' },
    { name: 'IT setup & laptop config', done: false, owner: 'IT' },
    { name: 'Benefits enrollment', done: false, owner: 'New hire' },
    { name: 'Meet your buddy (informal coffee)', done: false, owner: 'Buddy' },
  ]},
  { section: 'Week 2-4', tasks: [
    { name: 'Manager 1:1 cadence established', done: false, owner: 'Manager' },
    { name: 'Domain training modules (4 of 6 complete)', done: false, owner: 'New hire' },
    { name: 'Shadow customer call', done: false, owner: 'CS team' },
    { name: 'Submit 30-day goals', done: false, owner: 'New hire' },
    { name: 'Coffee chats with 5 cross-functional partners', done: false, owner: 'New hire' },
  ]},
];

const upcomingStarts = [
  { name: 'Carlos Mendes', title: 'Frontend Engineer', startDate: 'May 22', team: 'Engineering' },
  { name: 'Lila Sørensen', title: 'Sales Development Rep', startDate: 'May 28', team: 'Sales' },
  { name: 'Jordan Walsh', title: 'Customer Success Manager', startDate: 'Jun 2', team: 'Customer Success' },
  { name: 'Anisha Mehra', title: 'Product Manager', startDate: 'Jun 9', team: 'Engineering' },
];

export default function OnboardingPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Onboarding"
        description="Set new hires up for success from offer letter to fully productive"
        breadcrumbs={[{ label: 'People', href: '/app/hr' }, { label: 'Onboarding' }]}
        actions={
          <>
            <Button variant="outline">
              <FileText className="size-4" /> Templates
            </Button>
            <Button>
              <Plus className="size-4" /> New onboarding
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
            <CardTitle>Active onboarding</CardTitle>
            <CardDescription>{people.length} employees in their first 90 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {people.map((p) => (
              <div key={p.name} className="rounded-xl border border-border/60 p-4 transition-colors hover:bg-muted/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar size="lg"><AvatarFallback name={p.name}>{initials(p.name)}</AvatarFallback></Avatar>
                    <div>
                      <div className="flex items-center gap-2 font-medium">
                        {p.name}
                        {p.status === 'pre-start' && <Badge variant="warning" size="sm">Pre-start</Badge>}
                        {p.status === 'in-progress' && <Badge variant="soft" size="sm">In progress</Badge>}
                        {p.status === 'complete' && <Badge variant="success" size="sm">Complete</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">{p.title}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><CalendarDays className="size-3" /> Started {p.startDate} · {p.daysIn >= 0 ? `Day ${p.daysIn}` : `${Math.abs(p.daysIn)}d to go`}</span>
                        <span>Manager: {p.manager}</span>
                        <span>Buddy: {p.buddy}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Progress</div>
                    <div className="text-2xl font-semibold tabular-nums">{p.progress}%</div>
                  </div>
                </div>
                <div className="mt-3">
                  <Progress
                    value={p.progress}
                    indicatorClassName={
                      p.progress === 100 ? 'bg-success' : p.progress >= 50 ? 'bg-primary' : 'bg-warning'
                    }
                  />
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {p.tasksDone}/{p.tasksTotal} tasks · <span className="text-foreground">Next: {p.nextTask}</span>
                    </span>
                    <Button variant="ghost" size="xs">
                      View checklist <ChevronRight className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming starts</CardTitle>
            <CardDescription>Next 30 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingStarts.map((p) => (
              <div key={p.name} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-md bg-primary/10 text-primary">
                  <div className="text-2xs">{p.startDate.split(' ')[0]}</div>
                  <div className="text-base font-semibold leading-none">{p.startDate.split(' ')[1]}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{p.title}</div>
                  <Badge variant="outline" size="sm" className="mt-0.5">{p.team}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Default checklist · Sarah Chen</CardTitle>
          <CardDescription>32 tasks across pre-start, week 1, and weeks 2–4 · personalize as needed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {checklist.map((section) => (
            <div key={section.section}>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{section.section}</h3>
                <Badge variant="outline" size="sm">{section.tasks.filter((t) => t.done).length}/{section.tasks.length}</Badge>
              </div>
              <div className="space-y-1.5">
                {section.tasks.map((t) => (
                  <div key={t.name} className="flex items-center gap-3 rounded-md border border-border/60 p-2.5">
                    <div className={cn('flex h-5 w-5 items-center justify-center rounded border-2', t.done ? 'border-success bg-success text-success-foreground' : 'border-border')}>
                      {t.done && <CheckCircle2 className="size-3" />}
                    </div>
                    <div className="flex-1 text-sm">
                      <span className={t.done ? 'text-muted-foreground line-through' : ''}>{t.name}</span>
                    </div>
                    <Badge variant="outline" size="sm">{t.owner}</Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Laptop className="size-4 text-primary" /> Equipment provisioning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">MacBook Pro 16" ordered</span>
              <Badge variant="success" size="sm">5 of 5</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monitors shipped</span>
              <Badge variant="warning" size="sm">3 of 5</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Peripherals kit</span>
              <Badge variant="success" size="sm">5 of 5</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Welcome swag</span>
              <Badge variant="success" size="sm">5 of 5</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4 text-success" /> Buddy program
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span className="text-muted-foreground">New hires with buddies</span><span className="font-medium">12/12</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Avg buddy chats / week</span><span className="font-medium">2.4</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Buddy NPS</span><span className="font-medium text-success">+68</span></div>
            <Button variant="outline" size="sm" className="w-full">
              <MessageSquare className="size-3.5" /> Message all buddies
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Briefcase className="size-4 text-warning" /> 30-60-90 day plans
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">30-day check-ins complete</span>
                <span className="font-medium">9/12</span>
              </div>
              <Progress value={75} />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">60-day reviews scheduled</span>
                <span className="font-medium">6/8</span>
              </div>
              <Progress value={75} />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">90-day reviews complete</span>
                <span className="font-medium">3/4</span>
              </div>
              <Progress value={75} indicatorClassName="bg-success" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
