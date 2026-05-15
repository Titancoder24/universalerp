import {
  AlertCircle,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  LayoutGrid,
  List,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Sparkles,
  StickyNote,
  Video,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input, InputAddon } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatRelativeTime, initials } from '@/lib/utils';

type ActivityType = 'call' | 'meeting' | 'email' | 'task' | 'demo';
type ActivityStatus = 'overdue' | 'today' | 'upcoming' | 'completed';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  related: string;
  relatedType: 'opp' | 'lead' | 'account' | 'contact';
  scheduledAt: Date;
  duration?: string;
  owner: string;
  status: ActivityStatus;
  priority?: 'high' | 'medium' | 'low';
  description?: string;
}

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const activities: Activity[] = [
  // Overdue
  { id: 'T-001', type: 'call', title: 'Follow up on proposal feedback', related: 'Lumen Health', relatedType: 'opp', scheduledAt: new Date(today.getTime() - 1000 * 60 * 60 * 48), owner: 'Priya Patel', status: 'overdue', priority: 'high', description: 'Rachel was supposed to come back on Wednesday with sign-off' },
  { id: 'T-002', type: 'email', title: 'Send case study to Boreal Energy', related: 'Boreal Energy', relatedType: 'lead', scheduledAt: new Date(today.getTime() - 1000 * 60 * 60 * 24), owner: 'Emily Watson', status: 'overdue', priority: 'medium' },
  { id: 'T-003', type: 'task', title: 'Update pricing model in Q4 deck', related: 'Q4 Pipeline Review', relatedType: 'account', scheduledAt: new Date(today.getTime() - 1000 * 60 * 60 * 26), owner: 'Sarah Chen', status: 'overdue', priority: 'medium' },
  // Today
  { id: 'T-004', type: 'meeting', title: 'Northwind discovery call', related: 'Northwind Software', relatedType: 'opp', scheduledAt: new Date(today.getTime() + 1000 * 60 * 60 * 1), duration: '30 min', owner: 'Sarah Chen', status: 'today', priority: 'high', description: 'Initial discovery with Alicia and engineering lead' },
  { id: 'T-005', type: 'demo', title: 'Product demo - Helix Robotics', related: 'Helix Robotics', relatedType: 'opp', scheduledAt: new Date(today.getTime() + 1000 * 60 * 60 * 3), duration: '60 min', owner: 'Marcus Rivera', status: 'today', priority: 'high' },
  { id: 'T-006', type: 'call', title: 'Quarterly check-in', related: 'Acme Industries', relatedType: 'account', scheduledAt: new Date(today.getTime() + 1000 * 60 * 60 * 5), duration: '45 min', owner: 'Priya Patel', status: 'today' },
  { id: 'T-007', type: 'email', title: 'Send revised proposal v3', related: 'Lumen Health', relatedType: 'opp', scheduledAt: new Date(today.getTime() + 1000 * 60 * 60 * 7), owner: 'Priya Patel', status: 'today', priority: 'high' },
  { id: 'T-008', type: 'task', title: 'Prep notes for Vertex negotiation', related: 'Vertex Logistics', relatedType: 'opp', scheduledAt: new Date(today.getTime() + 1000 * 60 * 60 * 8), owner: 'Sarah Chen', status: 'today' },
  // Upcoming
  { id: 'T-009', type: 'meeting', title: 'QBR with Margaret Liu', related: 'Acme Industries', relatedType: 'account', scheduledAt: new Date(today.getTime() + 1000 * 60 * 60 * 24), duration: '60 min', owner: 'Priya Patel', status: 'upcoming', priority: 'high' },
  { id: 'T-010', type: 'call', title: 'CFO pricing call', related: 'Lumen Health', relatedType: 'opp', scheduledAt: new Date(today.getTime() + 1000 * 60 * 60 * 30), duration: '30 min', owner: 'Priya Patel', status: 'upcoming', priority: 'high' },
  { id: 'T-011', type: 'demo', title: 'Sakura Retail product walkthrough', related: 'Sakura Retail Group', relatedType: 'opp', scheduledAt: new Date(today.getTime() + 1000 * 60 * 60 * 48), duration: '90 min', owner: 'Priya Patel', status: 'upcoming' },
  { id: 'T-012', type: 'email', title: 'Renewal follow-up campaign', related: 'Q3 Renewals', relatedType: 'account', scheduledAt: new Date(today.getTime() + 1000 * 60 * 60 * 72), owner: 'James Okafor', status: 'upcoming' },
  { id: 'T-013', type: 'meeting', title: 'Lumen Health security review', related: 'Lumen Health', relatedType: 'opp', scheduledAt: new Date(today.getTime() + 1000 * 60 * 60 * 96), duration: '60 min', owner: 'Priya Patel', status: 'upcoming', priority: 'high' },
  { id: 'T-014', type: 'task', title: 'Send NPS survey to Q2 customers', related: 'Q2 Customer Pulse', relatedType: 'account', scheduledAt: new Date(today.getTime() + 1000 * 60 * 60 * 120), owner: 'Emily Watson', status: 'upcoming' },
  // Completed
  { id: 'T-015', type: 'call', title: 'Tomas Becker - intro call', related: 'Vertex Logistics', relatedType: 'lead', scheduledAt: new Date(today.getTime() - 1000 * 60 * 60 * 8), duration: '24 min', owner: 'Sarah Chen', status: 'completed' },
  { id: 'T-016', type: 'meeting', title: 'Mesa Manufacturing scoping', related: 'Mesa Manufacturing', relatedType: 'opp', scheduledAt: new Date(today.getTime() - 1000 * 60 * 60 * 12), duration: '45 min', owner: 'Marcus Rivera', status: 'completed' },
];

const typeMap: Record<ActivityType, { icon: any; color: string; label: string }> = {
  call: { icon: Phone, color: 'text-success bg-success/10', label: 'Call' },
  meeting: { icon: Video, color: 'text-primary bg-primary/10', label: 'Meeting' },
  email: { icon: Mail, color: 'text-info bg-info/10', label: 'Email' },
  task: { icon: CheckSquare, color: 'text-warning bg-warning/10', label: 'Task' },
  demo: { icon: Sparkles, color: 'text-purple-500 bg-purple-500/10', label: 'Demo' },
};

const priorityStyle = (p?: string) =>
  p === 'high'
    ? 'border-destructive/30 bg-destructive/10 text-destructive'
    : p === 'medium'
      ? 'border-warning/30 bg-warning/10 text-warning'
      : 'border-info/30 bg-info/10 text-info';

const summary = {
  overdue: activities.filter((a) => a.status === 'overdue').length,
  today: activities.filter((a) => a.status === 'today').length,
  upcoming: activities.filter((a) => a.status === 'upcoming').length,
  completed: activities.filter((a) => a.status === 'completed').length,
};

function ActivityRow({ a }: { a: Activity }) {
  const t = typeMap[a.type];
  return (
    <div className="group flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-sm">
      <Checkbox className="mt-0.5" defaultChecked={a.status === 'completed'} />
      <div className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full', t.color)}>
        <t.icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={cn('font-medium', a.status === 'completed' && 'text-muted-foreground line-through')}>
              {a.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {t.label} · {a.related}
              {a.duration && ` · ${a.duration}`}
            </p>
            {a.description && <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {a.priority && (
              <Badge variant="outline" size="sm" className={priorityStyle(a.priority)}>
                {a.priority}
              </Badge>
            )}
            <span className={cn(
              'text-xs tabular-nums',
              a.status === 'overdue' && 'font-semibold text-destructive',
              a.status === 'today' && 'font-medium text-warning',
              a.status === 'upcoming' && 'text-muted-foreground',
              a.status === 'completed' && 'text-muted-foreground',
            )}>
              {formatRelativeTime(a.scheduledAt)}
            </span>
            <Avatar size="xs">
              <AvatarFallback name={a.owner}>{initials(a.owner)}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate calendar grid
const startDay = new Date(now.getFullYear(), now.getMonth(), 1);
const startWeekday = startDay.getDay();
const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

const days: { date: number | null; activities: Activity[] }[] = [];
for (let i = 0; i < startWeekday; i++) {
  days.push({ date: null, activities: [] });
}
for (let i = 1; i <= daysInMonth; i++) {
  const dayDate = new Date(now.getFullYear(), now.getMonth(), i);
  const dayActivities = activities.filter((a) => {
    const ad = a.scheduledAt;
    return ad.getDate() === i && ad.getMonth() === now.getMonth();
  });
  days.push({ date: i, activities: dayActivities });
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

export default function ActivitiesPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Activities"
        description="Calls, meetings, emails, and tasks. Never let an account go cold."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="size-4" /> My team
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New activity
            </Button>
          </>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-destructive">
                <AlertCircle className="size-3.5" /> Overdue
              </p>
              <p className="mt-1 text-2xl font-bold text-destructive">{summary.overdue}</p>
            </div>
            <Button variant="ghost" size="sm">Resolve</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
              <Clock className="size-3.5" /> Today
            </p>
            <p className="mt-1 text-2xl font-bold">{summary.today}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
              <CalendarDays className="size-3.5" /> Upcoming
            </p>
            <p className="mt-1 text-2xl font-bold">{summary.upcoming}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-success">
              <CheckCircle2 className="size-3.5" /> Done today
            </p>
            <p className="mt-1 text-2xl font-bold text-success">{summary.completed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background p-0.5">
          <Button variant="soft" size="sm" className="gap-1.5">
            <List className="size-4" /> List
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <CalendarRange className="size-4" /> Calendar
          </Button>
        </div>
        <div className="min-w-[240px] flex-1">
          <InputAddon prefix={<Search className="size-4" />}>
            <Input placeholder="Search activities..." />
          </InputAddon>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="call">Calls</SelectItem>
            <SelectItem value="meeting">Meetings</SelectItem>
            <SelectItem value="email">Emails</SelectItem>
            <SelectItem value="task">Tasks</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="me">
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="me">Assigned to me</SelectItem>
            <SelectItem value="team">My team</SelectItem>
            <SelectItem value="all">Everyone</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* List view */}
        <div className="space-y-6 lg:col-span-2">
          {summary.overdue > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-destructive">Overdue ({summary.overdue})</h3>
                <div className="h-px flex-1 bg-destructive/20" />
              </div>
              {activities.filter((a) => a.status === 'overdue').map((a) => (
                <ActivityRow key={a.id} a={a} />
              ))}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Today ({summary.today})</h3>
              <div className="h-px flex-1 bg-border" />
            </div>
            {activities.filter((a) => a.status === 'today').map((a) => (
              <ActivityRow key={a.id} a={a} />
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Upcoming ({summary.upcoming})</h3>
              <div className="h-px flex-1 bg-border" />
            </div>
            {activities.filter((a) => a.status === 'upcoming').map((a) => (
              <ActivityRow key={a.id} a={a} />
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Completed ({summary.completed})</h3>
              <div className="h-px flex-1 bg-border" />
            </div>
            {activities.filter((a) => a.status === 'completed').map((a) => (
              <ActivityRow key={a.id} a={a} />
            ))}
          </div>
        </div>

        {/* Mini calendar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">{monthName}</CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm">
                  <ChevronLeft className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center">
                {weekdays.map((d) => (
                  <div key={d} className="text-2xs font-medium uppercase tracking-wide text-muted-foreground">
                    {d}
                  </div>
                ))}
                {days.map((d, i) => (
                  <div
                    key={i}
                    className={cn(
                      'relative aspect-square rounded-md p-1 text-xs',
                      d.date === null && 'invisible',
                      d.date === now.getDate() && 'bg-primary text-primary-foreground font-semibold',
                      d.date !== null && d.date !== now.getDate() && 'hover:bg-muted',
                    )}
                  >
                    <span>{d.date}</span>
                    {d.activities.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
                        {d.activities.slice(0, 3).map((a, j) => (
                          <span
                            key={j}
                            className={cn(
                              'h-1 w-1 rounded-full',
                              d.date === now.getDate() ? 'bg-primary-foreground' :
                                a.status === 'overdue' ? 'bg-destructive' :
                                  a.status === 'today' ? 'bg-warning' : 'bg-primary',
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Activity mix</CardTitle>
              <CardDescription>This week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {(Object.keys(typeMap) as ActivityType[]).map((t) => {
                const count = activities.filter((a) => a.type === t).length;
                const v = typeMap[t];
                return (
                  <div key={t} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={cn('grid h-6 w-6 place-items-center rounded-md', v.color)}>
                        <v.icon className="size-3.5" />
                      </div>
                      <span>{v.label}s</span>
                    </div>
                    <span className="font-mono font-semibold">{count}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
