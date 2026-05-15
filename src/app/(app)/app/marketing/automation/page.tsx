import {
  ArrowDown,
  Bell,
  Clock,
  Copy,
  Filter,
  GitBranch,
  Mail,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Split,
  Tag,
  Target,
  Timer,
  Users,
  Zap,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input, InputAddon } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatCompactNumber, formatNumber, formatRelativeTime, initials } from '@/lib/utils';

interface WorkflowStep {
  type: 'trigger' | 'wait' | 'email' | 'condition' | 'action' | 'tag';
  label: string;
  detail?: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  trigger: string;
  steps: WorkflowStep[];
  contacts: number;
  active: number;
  completed: number;
  conversionRate: number;
  owner: string;
  lastModified: Date;
}

const workflows: Workflow[] = [
  {
    id: 'WF-001',
    name: 'New trial signup nurture',
    description: 'Multi-touch onboarding for trial users with usage-based branching',
    status: 'active',
    trigger: 'New trial signup',
    steps: [
      { type: 'trigger', label: 'Trial signup', detail: 'User signs up' },
      { type: 'email', label: 'Welcome email', detail: 'T-001' },
      { type: 'wait', label: '2 days' },
      { type: 'condition', label: 'Active in app?' },
      { type: 'email', label: 'Setup guide', detail: 'T-002' },
      { type: 'tag', label: 'Add to "Active trial"' },
    ],
    contacts: 4820,
    active: 982,
    completed: 3624,
    conversionRate: 24.4,
    owner: 'Sofia Almeida',
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: 'WF-002',
    name: 'MQL handoff to sales',
    description: 'Score-based handoff with auto-assignment and follow-up sequence',
    status: 'active',
    trigger: 'Lead score >= 80',
    steps: [
      { type: 'trigger', label: 'Score >= 80' },
      { type: 'action', label: 'Assign to AE' },
      { type: 'email', label: 'SDR intro', detail: 'T-003' },
      { type: 'wait', label: '1 day' },
      { type: 'condition', label: 'Replied?' },
      { type: 'email', label: 'Follow-up', detail: 'T-005' },
    ],
    contacts: 1248,
    active: 184,
    completed: 1064,
    conversionRate: 38.2,
    owner: 'Maya Patel',
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: 'WF-003',
    name: 'Webinar registration follow-up',
    description: 'Pre and post-webinar nurture with attendee/no-show branching',
    status: 'active',
    trigger: 'Webinar registration',
    steps: [
      { type: 'trigger', label: 'Webinar reg' },
      { type: 'email', label: 'Confirmation' },
      { type: 'wait', label: '1 day before' },
      { type: 'email', label: 'Reminder' },
      { type: 'condition', label: 'Attended?' },
      { type: 'email', label: 'Recap or replay' },
    ],
    contacts: 6840,
    active: 412,
    completed: 6028,
    conversionRate: 28.4,
    owner: 'David Kim',
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: 'WF-004',
    name: 'Churn risk early warning',
    description: 'Triggered when health score drops below 50 - alerts CSM and runs win-back sequence',
    status: 'active',
    trigger: 'Health score < 50',
    steps: [
      { type: 'trigger', label: 'Health < 50' },
      { type: 'action', label: 'Notify CSM' },
      { type: 'wait', label: '3 days' },
      { type: 'email', label: 'Re-engagement', detail: 'T-007' },
      { type: 'wait', label: '7 days' },
      { type: 'condition', label: 'Engaged?' },
    ],
    contacts: 84,
    active: 24,
    completed: 60,
    conversionRate: 47.2,
    owner: 'Aisha Robinson',
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: 'WF-005',
    name: 'Renewal 90/60/30 day cadence',
    description: 'Automated renewal touchpoints with personalized messaging',
    status: 'active',
    trigger: '90 days before renewal',
    steps: [
      { type: 'trigger', label: 'T-90 days' },
      { type: 'email', label: 'Value recap' },
      { type: 'wait', label: '30 days' },
      { type: 'email', label: 'Renewal proposal' },
      { type: 'wait', label: '30 days' },
      { type: 'action', label: 'CSM call' },
    ],
    contacts: 184,
    active: 84,
    completed: 100,
    conversionRate: 82.1,
    owner: 'Aisha Robinson',
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: 'WF-006',
    name: 'Content downloader nurture',
    description: 'Tailored sequences based on which asset was downloaded',
    status: 'active',
    trigger: 'Content download',
    steps: [
      { type: 'trigger', label: 'Asset download' },
      { type: 'condition', label: 'Asset type?' },
      { type: 'email', label: 'Related content' },
      { type: 'wait', label: '5 days' },
      { type: 'email', label: 'Demo CTA' },
    ],
    contacts: 8420,
    active: 1240,
    completed: 7180,
    conversionRate: 12.8,
    owner: 'Maya Patel',
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: 'WF-007',
    name: 'Cold lead re-engagement Q4',
    description: 'Win-back campaign for 90+ day cold leads',
    status: 'paused',
    trigger: 'Manual',
    steps: [
      { type: 'trigger', label: 'Manual entry' },
      { type: 'email', label: 'Industry update' },
      { type: 'wait', label: '7 days' },
      { type: 'email', label: 'Case study' },
      { type: 'wait', label: '7 days' },
      { type: 'email', label: 'Direct ask' },
    ],
    contacts: 3420,
    active: 0,
    completed: 1240,
    conversionRate: 4.2,
    owner: 'Jamal Khan',
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
  },
  {
    id: 'WF-008',
    name: 'Account-based plays - Enterprise',
    description: 'Coordinated touches across email, ads, and SDR for enterprise accounts',
    status: 'active',
    trigger: 'Account tier = Enterprise',
    steps: [
      { type: 'trigger', label: 'Enterprise tier' },
      { type: 'action', label: 'Add to ad audience' },
      { type: 'email', label: 'Personalized outreach' },
      { type: 'action', label: 'SDR task' },
      { type: 'wait', label: '2 weeks' },
      { type: 'email', label: 'Value reinforcement' },
    ],
    contacts: 248,
    active: 184,
    completed: 64,
    conversionRate: 18.4,
    owner: 'Maya Patel',
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
  },
  {
    id: 'WF-009',
    name: 'Free → Paid conversion',
    description: 'Trial expiration sequence with upgrade incentives',
    status: 'draft',
    trigger: 'Trial day 14',
    steps: [
      { type: 'trigger', label: 'Day 14 of trial' },
      { type: 'email', label: 'Almost there' },
      { type: 'wait', label: '2 days' },
      { type: 'email', label: 'Discount offer' },
      { type: 'wait', label: '2 days' },
      { type: 'email', label: 'Last chance' },
    ],
    contacts: 0,
    active: 0,
    completed: 0,
    conversionRate: 0,
    owner: 'Sofia Almeida',
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
];

const stepStyle = (t: WorkflowStep['type']) => ({
  trigger: { icon: Zap, color: 'border-warning/40 bg-warning/10 text-warning' },
  wait: { icon: Clock, color: 'border-muted bg-muted text-muted-foreground' },
  email: { icon: Mail, color: 'border-info/40 bg-info/10 text-info' },
  condition: { icon: Split, color: 'border-primary/40 bg-primary/10 text-primary' },
  action: { icon: Settings, color: 'border-purple-500/40 bg-purple-500/10 text-purple-500' },
  tag: { icon: Tag, color: 'border-success/40 bg-success/10 text-success' },
}[t]);

const summary = {
  active: workflows.filter((w) => w.status === 'active').length,
  totalContacts: workflows.reduce((s, w) => s + w.contacts, 0),
  totalActive: workflows.reduce((s, w) => s + w.active, 0),
  avgConv: workflows.filter((w) => w.contacts > 0).reduce((s, w, _, arr) => s + w.conversionRate / arr.length, 0),
};

export default function AutomationPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Marketing automation"
        description="Visual workflows that nurture, qualify, and convert at every stage of the journey."
        actions={
          <>
            <Button variant="outline" size="sm">
              <ArrowDown className="size-4" /> Export
            </Button>
            <Button variant="outline" size="sm">
              <Sparkles className="size-4" /> AI workflow builder
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New workflow
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Active workflows</p>
            <p className="mt-1 text-2xl font-semibold text-success">{summary.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Contacts processed</p>
            <p className="mt-1 text-2xl font-semibold">{formatCompactNumber(summary.totalContacts)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Currently in flow</p>
            <p className="mt-1 text-2xl font-semibold text-primary">{formatCompactNumber(summary.totalActive)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Avg conversion</p>
            <p className="mt-1 text-2xl font-semibold">{summary.avgConv.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList variant="pills">
          <TabsTrigger variant="pills" value="all">All ({workflows.length})</TabsTrigger>
          <TabsTrigger variant="pills" value="active">Active ({summary.active})</TabsTrigger>
          <TabsTrigger variant="pills" value="paused">Paused</TabsTrigger>
          <TabsTrigger variant="pills" value="draft">Drafts</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-[240px] flex-1">
          <InputAddon prefix={<Search className="size-4" />}>
            <Input placeholder="Search workflows..." />
          </InputAddon>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All triggers</SelectItem>
            <SelectItem value="signup">Trial signup</SelectItem>
            <SelectItem value="score">Lead score</SelectItem>
            <SelectItem value="form">Form submission</SelectItem>
            <SelectItem value="health">Health score</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm">
          <Filter className="size-4" /> More
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {workflows.map((w) => (
          <Card key={w.id} className="group transition-all hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" size="sm" className={cn(
                      w.status === 'active' && 'border-success/30 bg-success/10 text-success',
                      w.status === 'paused' && 'border-warning/30 bg-warning/10 text-warning',
                      w.status === 'draft' && 'border-muted text-muted-foreground',
                    )}>
                      {w.status === 'active' && <span className="mr-1 size-1.5 animate-pulse rounded-full bg-success" />}
                      {w.status}
                    </Badge>
                    <Badge variant="outline" size="sm">
                      <Zap className="size-3" /> {w.trigger}
                    </Badge>
                  </div>
                  <h3 className="mt-2 font-semibold leading-snug">{w.name}</h3>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{w.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {w.status === 'active' ? (
                      <DropdownMenuItem><Pause className="size-4" /> Pause</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem><Play className="size-4" /> Activate</DropdownMenuItem>
                    )}
                    <DropdownMenuItem><Copy className="size-4" /> Duplicate</DropdownMenuItem>
                    <DropdownMenuItem><Settings className="size-4" /> Settings</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Visual workflow */}
              <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted/20 p-3">
                <div className="flex items-center gap-1">
                  {w.steps.map((s, i) => {
                    const ss = stepStyle(s.type);
                    return (
                      <div key={i} className="flex items-center gap-1">
                        <div className={cn('flex shrink-0 flex-col items-center gap-1 rounded-md border-2 px-2 py-1.5 min-w-[68px]', ss.color)}>
                          <ss.icon className="size-3.5" />
                          <span className="text-2xs font-medium text-center leading-tight">{s.label}</span>
                          {s.detail && <span className="text-2xs opacity-60">{s.detail}</span>}
                        </div>
                        {i < w.steps.length - 1 && (
                          <div className="h-px w-3 bg-border" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2 border-t border-border pt-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Contacts</p>
                  <p className="font-mono font-semibold tabular-nums">{formatNumber(w.contacts)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Active</p>
                  <p className="font-mono font-semibold tabular-nums text-primary">{formatNumber(w.active)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Completed</p>
                  <p className="font-mono font-semibold tabular-nums text-success">{formatNumber(w.completed)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Conversion</p>
                  <p className={cn(
                    'font-mono font-semibold tabular-nums',
                    w.conversionRate >= 30 && 'text-success',
                  )}>
                    {w.conversionRate.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <Avatar size="xs">
                    <AvatarFallback name={w.owner}>{initials(w.owner)}</AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">{w.owner}</span>
                </div>
                <span className="text-muted-foreground">Updated {formatRelativeTime(w.lastModified)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
