import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Flame,
  GraduationCap,
  Play,
  Plus,
  Search,
  Star,
  TrendingUp,
  Users,
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
import { cn, initials } from '@/lib/utils';

const stats = [
  { label: 'Active learners', value: 218, deltaLabel: '88% of staff', icon: Users },
  { label: 'Courses completed (MTD)', value: 184, delta: 22.4, format: 'number' as const, icon: CheckCircle2 },
  { label: 'Avg learning hours', value: '4.8h', deltaLabel: 'per learner / month', icon: Clock },
  { label: 'Certifications earned', value: 42, delta: 16.4, format: 'number' as const, icon: Award },
];

interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  enrolled: number;
  instructor: string;
  gradient: string;
  badge?: string;
}

const courses: Course[] = [
  { id: 'c1', title: 'Foundations of Universal · Product Tour', category: 'Onboarding', duration: '2h 14m', level: 'Beginner', rating: 4.9, enrolled: 248, instructor: 'Hiroshi Tanaka', gradient: 'from-primary/40 to-info/20', badge: 'Required' },
  { id: 'c2', title: 'Selling SaaS in the Age of AI', category: 'Sales', duration: '3h 42m', level: 'Intermediate', rating: 4.7, enrolled: 42, instructor: 'Marcus Rodriguez', gradient: 'from-success/40 to-emerald-300/20' },
  { id: 'c3', title: 'Product Design Systems Masterclass', category: 'Design', duration: '6h 18m', level: 'Advanced', rating: 4.9, enrolled: 36, instructor: 'Sarah Chen', gradient: 'from-pink-500/40 to-purple-500/20', badge: 'New' },
  { id: 'c4', title: 'Distributed Systems with Go', category: 'Engineering', duration: '8h 24m', level: 'Advanced', rating: 4.8, enrolled: 64, instructor: 'David Kim', gradient: 'from-cyan-500/40 to-blue-500/20' },
  { id: 'c5', title: 'Inclusive Leadership Workshop', category: 'Leadership', duration: '4h 00m', level: 'Intermediate', rating: 4.8, enrolled: 92, instructor: 'Olivia Martinez', gradient: 'from-warning/40 to-orange-300/20', badge: 'Trending' },
  { id: 'c6', title: 'Customer Success Playbook 2026', category: 'Customer Success', duration: '2h 36m', level: 'Beginner', rating: 4.6, enrolled: 31, instructor: 'Priya Patel', gradient: 'from-teal-500/40 to-cyan-300/20' },
  { id: 'c7', title: 'GDPR & Data Privacy Essentials', category: 'Compliance', duration: '1h 12m', level: 'Beginner', rating: 4.4, enrolled: 248, instructor: 'Mira Patel', gradient: 'from-slate-500/40 to-zinc-300/20', badge: 'Required' },
  { id: 'c8', title: 'Marketing Storytelling that Sells', category: 'Marketing', duration: '3h 06m', level: 'Intermediate', rating: 4.8, enrolled: 24, instructor: 'Sofia Rossi', gradient: 'from-rose-500/40 to-fuchsia-300/20' },
];

const assigned = [
  { title: 'Foundations of Universal', progress: 100, dueIn: 'Completed', required: true },
  { title: 'GDPR & Data Privacy Essentials', progress: 84, dueIn: 'May 20', required: true },
  { title: 'Product Design Systems Masterclass', progress: 42, dueIn: 'May 31', required: false },
  { title: 'Distributed Systems with Go', progress: 12, dueIn: 'Jun 14', required: false },
];

const learningPaths = [
  { name: 'Engineering Onboarding', courses: 6, learners: 22, duration: '32h', color: 'from-primary to-info' },
  { name: 'Sales Excellence', courses: 8, learners: 42, duration: '24h', color: 'from-success to-emerald-500' },
  { name: 'Manager Foundations', courses: 5, learners: 28, duration: '18h', color: 'from-warning to-orange-500' },
  { name: 'Customer Success', courses: 7, learners: 31, duration: '21h', color: 'from-purple-500 to-pink-500' },
];

const topLearners = [
  { name: 'Aisha Khan', hours: 18.4, courses: 6 },
  { name: 'Priya Patel', hours: 16.2, courses: 5 },
  { name: 'Carlos Mendes', hours: 14.8, courses: 5 },
  { name: 'David Kim', hours: 12.6, courses: 4 },
  { name: 'Hannah Bauer', hours: 11.4, courses: 4 },
];

const levelColors = {
  Beginner: 'bg-success/10 text-success',
  Intermediate: 'bg-warning/10 text-warning',
  Advanced: 'bg-destructive/10 text-destructive',
};

export default function LearningPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Learning"
        description={`Universal's learning hub · ${courses.length} courses across 8 categories`}
        breadcrumbs={[{ label: 'People', href: '/app/hr' }, { label: 'Learning' }]}
        actions={
          <>
            <Button variant="outline">
              <GraduationCap className="size-4" /> My certificates
            </Button>
            <Button>
              <Plus className="size-4" /> New course
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-info/10 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant="soft">Continue learning</Badge>
              <h2 className="mt-2 text-xl font-semibold">Inclusive Leadership Workshop</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Module 3 of 8 · Olivia Martinez</p>
              <div className="mt-3 max-w-md">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">38% · 1h 32m remaining</span>
                </div>
                <Progress value={38} />
              </div>
            </div>
            <Button size="lg">
              <Play className="size-4" /> Resume
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Course catalog</CardTitle>
              <CardDescription>Browse and enroll in any of our {courses.length} active courses</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input placeholder="Search courses..." className="w-44 pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((c) => (
                <div key={c.id} className="group cursor-pointer overflow-hidden rounded-xl border border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className={cn('relative h-28 bg-gradient-to-br', c.gradient)}>
                    <div className="absolute right-2 top-2 flex gap-1">
                      {c.badge && (
                        <Badge variant={c.badge === 'Required' ? 'destructive' : c.badge === 'New' ? 'soft' : 'success'} size="sm">
                          {c.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                      <span className={cn('rounded px-1.5 py-0.5 text-2xs font-medium', levelColors[c.level], 'bg-background/90')}>{c.level}</span>
                      <span className="rounded bg-background/90 px-1.5 py-0.5 text-2xs font-medium text-foreground">{c.duration}</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/20 group-hover:opacity-100">
                      <Button size="sm">
                        <Play className="size-3.5" /> Start
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <Badge variant="outline" size="sm">{c.category}</Badge>
                    <h3 className="mt-1.5 font-semibold leading-tight">{c.title}</h3>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="size-3 fill-warning text-warning" />
                        <span className="font-medium tabular-nums text-foreground">{c.rating}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="size-3" /> {c.enrolled}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assigned to you</CardTitle>
              <CardDescription>{assigned.filter((a) => a.progress < 100).length} courses in progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {assigned.map((a) => (
                <div key={a.title} className="rounded-lg border border-border/60 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        {a.title}
                        {a.required && <Badge variant="destructive" size="sm">Required</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">Due {a.dueIn}</div>
                    </div>
                    <div className="text-xs font-medium tabular-nums">{a.progress}%</div>
                  </div>
                  <Progress
                    value={a.progress}
                    className="mt-2 h-1.5"
                    indicatorClassName={a.progress === 100 ? 'bg-success' : 'bg-primary'}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Flame className="size-4 text-warning" /> Top learners
              </CardTitle>
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {topLearners.map((l, i) => (
                <div key={l.name} className="flex items-center gap-3">
                  <div className="text-xs font-bold tabular-nums text-muted-foreground w-4">{i + 1}</div>
                  <Avatar size="sm"><AvatarFallback name={l.name}>{initials(l.name)}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{l.name}</div>
                    <div className="text-xs text-muted-foreground">{l.courses} courses</div>
                  </div>
                  <span className="text-sm font-mono tabular-nums">{l.hours}h</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning paths</CardTitle>
          <CardDescription>Curated sequences for specific roles and goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {learningPaths.map((p) => (
              <div key={p.name} className="overflow-hidden rounded-xl border border-border transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className={cn('flex h-20 items-center justify-center bg-gradient-to-br text-background', p.color)}>
                  <BookOpen className="size-8" />
                </div>
                <div className="p-3">
                  <div className="font-semibold">{p.name}</div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{p.courses} courses · {p.duration}</span>
                    <span className="inline-flex items-center gap-1"><Users className="size-3" /> {p.learners}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2 w-full justify-between">
                    Explore <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 text-success" /> Completion by department
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Engineering', rate: 91 },
              { name: 'Sales', rate: 76 },
              { name: 'Customer Success', rate: 94 },
              { name: 'Marketing', rate: 82 },
              { name: 'Operations', rate: 88 },
              { name: 'Finance', rate: 100 },
            ].map((d) => (
              <div key={d.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="font-medium tabular-nums">{d.rate}%</span>
                </div>
                <Progress value={d.rate} indicatorClassName={d.rate >= 90 ? 'bg-success' : d.rate >= 80 ? 'bg-primary' : 'bg-warning'} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="size-4 text-warning" /> Recent certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Aisha Khan', cert: 'AWS Solutions Architect', date: '2 days ago' },
              { name: 'Marcus Rodriguez', cert: 'Force Management Certified', date: '5 days ago' },
              { name: 'Priya Patel', cert: 'CS Manager Certification', date: '1 week ago' },
              { name: 'Hiroshi Tanaka', cert: 'Engineering Leadership', date: '2 weeks ago' },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-warning/10 text-warning">
                  <Award className="size-5" />
                </div>
                <Avatar size="sm"><AvatarFallback name={c.name}>{initials(c.name)}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{c.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{c.cert}</div>
                </div>
                <span className="text-xs text-muted-foreground">{c.date}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
