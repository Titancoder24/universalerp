import {
  ArrowDown,
  Building2,
  Filter,
  Layers,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, InputAddon } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, formatCompactNumber, formatNumber, formatRelativeTime, initials } from '@/lib/utils';

interface Segment {
  id: string;
  name: string;
  description: string;
  members: number;
  growth: number;
  type: 'dynamic' | 'static' | 'ai';
  source: 'CRM' | 'Marketing' | 'Product' | 'Imported';
  criteria: string[];
  lastUpdated: Date;
  owner: string;
  inUse: number;
}

const segments: Segment[] = [
  {
    id: 'S-001',
    name: 'Enterprise ICP - Decision Makers',
    description: 'C-level and VPs at companies with 1000+ employees in target verticals',
    members: 14820,
    growth: 8.4,
    type: 'dynamic',
    source: 'CRM',
    criteria: ['Company size > 1000', 'Title contains "VP" or "C-Level"', 'Industry in target list'],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2),
    owner: 'Maya Patel',
    inUse: 8,
  },
  {
    id: 'S-002',
    name: 'High-Intent Trial Users',
    description: 'Users in trial who viewed pricing page 3+ times in last 7 days',
    members: 482,
    growth: 24.1,
    type: 'ai',
    source: 'Product',
    criteria: ['Trial active', 'Pricing page views > 3', 'Last 7 days'],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30),
    owner: 'David Kim',
    inUse: 4,
  },
  {
    id: 'S-003',
    name: 'Healthcare Procurement Leaders',
    description: 'Procurement and supply chain leaders at healthcare organizations',
    members: 3240,
    growth: 12.7,
    type: 'dynamic',
    source: 'CRM',
    criteria: ['Industry = Healthcare', 'Title contains "Procurement" or "Supply Chain"', 'Country in US, CA, EU'],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 4),
    owner: 'Maya Patel',
    inUse: 5,
  },
  {
    id: 'S-004',
    name: 'Manufacturing Champions',
    description: 'Identified champions at manufacturing accounts',
    members: 168,
    growth: 4.2,
    type: 'dynamic',
    source: 'CRM',
    criteria: ['Account industry = Manufacturing', 'Role = Champion', 'Sentiment = Positive'],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 8),
    owner: 'Sofia Almeida',
    inUse: 3,
  },
  {
    id: 'S-005',
    name: 'Churn Risk - Critical',
    description: 'Customers showing 5+ churn signals in last 30 days',
    members: 24,
    growth: 0,
    type: 'ai',
    source: 'Product',
    criteria: ['Health score < 40', 'Usage dropped > 50%', 'Support tickets > 3'],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 1),
    owner: 'Aisha Robinson',
    inUse: 2,
  },
  {
    id: 'S-006',
    name: 'EMEA SMB Self-Serve',
    description: 'SMB accounts in EMEA on monthly plans, no rep contact',
    members: 1840,
    growth: 18.2,
    type: 'dynamic',
    source: 'CRM',
    criteria: ['Region = EMEA', 'Plan = Monthly', 'Employees < 100', 'No rep assigned'],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 6),
    owner: 'Jamal Khan',
    inUse: 6,
  },
  {
    id: 'S-007',
    name: 'Webinar Attendees Q2',
    description: 'Everyone who attended a Q2 2026 webinar',
    members: 6840,
    growth: 0,
    type: 'static',
    source: 'Marketing',
    criteria: ['Attended any Q2 2026 webinar'],
    lastUpdated: new Date('2026-06-30'),
    owner: 'David Kim',
    inUse: 3,
  },
  {
    id: 'S-008',
    name: 'Sustainability-Interested',
    description: 'Engaged with sustainability content in last 90 days',
    members: 2480,
    growth: 32.4,
    type: 'ai',
    source: 'Marketing',
    criteria: ['Downloaded sustainability assets', 'Clicked sustainability emails', 'AI-predicted interest'],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 3),
    owner: 'Maya Patel',
    inUse: 2,
  },
  {
    id: 'S-009',
    name: 'Renewing Q4 2026',
    description: 'Customers with renewal date in Q4',
    members: 184,
    growth: -2.1,
    type: 'dynamic',
    source: 'CRM',
    criteria: ['Renewal date between Oct 1 - Dec 31, 2026'],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 12),
    owner: 'Aisha Robinson',
    inUse: 4,
  },
  {
    id: 'S-010',
    name: 'CFO Persona - Active',
    description: 'CFOs active in our pipeline or product',
    members: 624,
    growth: 14.8,
    type: 'dynamic',
    source: 'CRM',
    criteria: ['Title contains "CFO" or "Chief Financial"', 'Active in last 30 days'],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 5),
    owner: 'Sofia Almeida',
    inUse: 3,
  },
  {
    id: 'S-011',
    name: 'Inactive Newsletter Subscribers',
    description: 'Subscribers who haven\'t opened in 90+ days',
    members: 3420,
    growth: -8.2,
    type: 'dynamic',
    source: 'Marketing',
    criteria: ['Subscribed to newsletter', 'No opens in 90 days'],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24),
    owner: 'Jamal Khan',
    inUse: 1,
  },
  {
    id: 'S-012',
    name: 'Expansion-Ready Accounts',
    description: 'Customers showing buying signals for additional modules',
    members: 84,
    growth: 26.7,
    type: 'ai',
    source: 'Product',
    criteria: ['Usage at 80%+ capacity', 'Feature request signals', 'Recent QBR'],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2),
    owner: 'Aisha Robinson',
    inUse: 2,
  },
];

const typeStyle = (t: Segment['type']) => ({
  dynamic: { icon: RefreshCw, color: 'border-info/30 bg-info/10 text-info', label: 'Dynamic' },
  static: { icon: Layers, color: 'border-muted text-muted-foreground', label: 'Static' },
  ai: { icon: Sparkles, color: 'border-primary/30 bg-primary/10 text-primary', label: 'AI-driven' },
}[t]);

const totalMembers = segments.reduce((sum, s) => sum + s.members, 0);

export default function SegmentsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Segments"
        description="Static, dynamic, and AI-built audiences for every campaign and play."
        actions={
          <>
            <Button variant="outline" size="sm">
              <ArrowDown className="size-4" /> Export
            </Button>
            <Button variant="outline" size="sm">
              <Sparkles className="size-4" /> Build with AI
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New segment
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total segments</p>
            <p className="mt-1 text-2xl font-semibold">{segments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total reach</p>
            <p className="mt-1 text-2xl font-semibold">{formatCompactNumber(totalMembers)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Across all segments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">AI-driven</p>
            <p className="mt-1 text-2xl font-semibold text-primary">{segments.filter((s) => s.type === 'ai').length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Auto-updating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">In use</p>
            <p className="mt-1 text-2xl font-semibold">{segments.filter((s) => s.inUse > 0).length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Active in campaigns</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-2 p-3">
          <div className="min-w-[240px] flex-1">
            <InputAddon prefix={<Search className="size-4" />}>
              <Input placeholder="Search segments..." />
            </InputAddon>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="dynamic">Dynamic</SelectItem>
              <SelectItem value="static">Static</SelectItem>
              <SelectItem value="ai">AI-driven</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              <SelectItem value="crm">CRM</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="imported">Imported</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm">
            <Filter className="size-4" /> More
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {segments.map((s) => {
          const ts = typeStyle(s.type);
          return (
            <Card key={s.id} className="group transition-all hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" size="sm" className={ts.color}>
                        <ts.icon className="size-3" />
                        {ts.label}
                      </Badge>
                      <Badge variant="outline" size="sm">{s.source}</Badge>
                    </div>
                    <h3 className="mt-2 font-semibold leading-snug">{s.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{s.description}</p>
                  </div>
                  <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tabular-nums">{formatNumber(s.members)}</span>
                  <span className="text-xs text-muted-foreground">members</span>
                  {s.growth !== 0 && (
                    <span className={cn(
                      'ml-auto flex items-center gap-0.5 text-xs font-medium tabular-nums',
                      s.growth > 0 ? 'text-success' : 'text-destructive',
                    )}>
                      <TrendingUp className={cn('size-3', s.growth < 0 && 'rotate-180')} />
                      {s.growth > 0 ? '+' : ''}{s.growth}%
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1">
                  <p className="text-2xs font-medium uppercase tracking-wide text-muted-foreground">
                    Criteria
                  </p>
                  <div className="space-y-0.5">
                    {s.criteria.slice(0, 3).map((c) => (
                      <div key={c} className="flex items-start gap-1.5 text-xs">
                        <span className="mt-1 size-1 shrink-0 rounded-full bg-muted-foreground/40" />
                        <span className="text-muted-foreground">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Avatar size="xs">
                      <AvatarFallback name={s.owner}>{initials(s.owner)}</AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground">{s.owner}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="size-3" /> {s.inUse} active
                    </span>
                    <span>{formatRelativeTime(s.lastUpdated)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
