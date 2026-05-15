import {
  ArrowDown,
  ArrowUpDown,
  Calendar,
  Copy,
  Filter,
  Image as ImageIcon,
  Mail,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Radio,
  Search,
  Share2,
  Target,
  Users,
  Video,
  Zap,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input, InputAddon } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatCurrency, formatDate, formatNumber, initials } from '@/lib/utils';

type CampaignType = 'email' | 'social' | 'content' | 'event' | 'paid' | 'webinar';
type CampaignStatus = 'active' | 'paused' | 'scheduled' | 'completed' | 'draft';

interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  audience: number;
  sent: number;
  opens: number;
  clicks: number;
  conversions: number;
  budget: number;
  spent: number;
  owner: string;
  startDate: Date;
  endDate: Date;
}

const campaigns: Campaign[] = [
  { id: 'CMP-101', name: 'Q3 Enterprise Demand Gen', type: 'paid', status: 'active', audience: 0, sent: 0, opens: 0, clicks: 14820, conversions: 432, budget: 80000, spent: 45000, owner: 'Maya Patel', startDate: new Date('2026-07-01'), endDate: new Date('2026-09-30') },
  { id: 'CMP-102', name: 'Healthcare Industry Webinar', type: 'webinar', status: 'active', audience: 4800, sent: 4800, opens: 1840, clicks: 412, conversions: 218, budget: 25000, spent: 18000, owner: 'David Kim', startDate: new Date('2026-07-15'), endDate: new Date('2026-08-30') },
  { id: 'CMP-103', name: 'Founder LinkedIn Series', type: 'social', status: 'active', audience: 0, sent: 0, opens: 0, clicks: 8920, conversions: 156, budget: 40000, spent: 28000, owner: 'Sofia Almeida', startDate: new Date('2026-06-01'), endDate: new Date('2026-12-31') },
  { id: 'CMP-104', name: 'Sustainability Case Study Drip', type: 'email', status: 'active', audience: 12480, sent: 9820, opens: 4140, clicks: 988, conversions: 124, budget: 20000, spent: 12000, owner: 'Jamal Khan', startDate: new Date('2026-07-22'), endDate: new Date('2026-08-31') },
  { id: 'CMP-105', name: 'AI Procurement Buyer\'s Guide Promo', type: 'content', status: 'active', audience: 0, sent: 0, opens: 0, clicks: 6420, conversions: 380, budget: 18000, spent: 11200, owner: 'Maya Patel', startDate: new Date('2026-07-10'), endDate: new Date('2026-10-10') },
  { id: 'CMP-106', name: 'Manufacturing Tech Summit 2026', type: 'event', status: 'scheduled', audience: 0, sent: 0, opens: 0, clicks: 0, conversions: 0, budget: 120000, spent: 24000, owner: 'David Kim', startDate: new Date('2026-09-15'), endDate: new Date('2026-09-17') },
  { id: 'CMP-107', name: 'Black Friday EU Campaign', type: 'paid', status: 'scheduled', audience: 0, sent: 0, opens: 0, clicks: 0, conversions: 0, budget: 65000, spent: 0, owner: 'Sofia Almeida', startDate: new Date('2026-11-15'), endDate: new Date('2026-11-30') },
  { id: 'CMP-108', name: 'Trial Conversion Nurture', type: 'email', status: 'active', audience: 4280, sent: 4280, opens: 2440, clicks: 988, conversions: 184, budget: 8000, spent: 5200, owner: 'Jamal Khan', startDate: new Date('2026-05-01'), endDate: new Date('2026-12-31') },
  { id: 'CMP-109', name: 'Spring Webinar Series 2026', type: 'webinar', status: 'completed', audience: 8400, sent: 8400, opens: 3420, clicks: 880, conversions: 412, budget: 32000, spent: 32000, owner: 'David Kim', startDate: new Date('2026-03-01'), endDate: new Date('2026-05-31') },
  { id: 'CMP-110', name: 'Q4 Renewal Campaign', type: 'email', status: 'draft', audience: 0, sent: 0, opens: 0, clicks: 0, conversions: 0, budget: 15000, spent: 0, owner: 'Maya Patel', startDate: new Date('2026-10-01'), endDate: new Date('2026-12-31') },
  { id: 'CMP-111', name: 'Healthcare AI Webinar', type: 'webinar', status: 'paused', audience: 3200, sent: 1840, opens: 720, clicks: 184, conversions: 48, budget: 18000, spent: 9400, owner: 'David Kim', startDate: new Date('2026-08-01'), endDate: new Date('2026-08-31') },
  { id: 'CMP-112', name: 'Brand Awareness - LinkedIn', type: 'social', status: 'active', audience: 0, sent: 0, opens: 0, clicks: 12480, conversions: 286, budget: 56000, spent: 38400, owner: 'Sofia Almeida', startDate: new Date('2026-04-01'), endDate: new Date('2026-12-31') },
];

const typeMap: Record<CampaignType, { icon: any; color: string; label: string }> = {
  email: { icon: Mail, color: 'text-info bg-info/10', label: 'Email' },
  social: { icon: Share2, color: 'text-primary bg-primary/10', label: 'Social' },
  content: { icon: ImageIcon, color: 'text-purple-500 bg-purple-500/10', label: 'Content' },
  event: { icon: Calendar, color: 'text-warning bg-warning/10', label: 'Event' },
  paid: { icon: Target, color: 'text-pink-500 bg-pink-500/10', label: 'Paid' },
  webinar: { icon: Video, color: 'text-success bg-success/10', label: 'Webinar' },
};

const totals = {
  active: campaigns.filter((c) => c.status === 'active').length,
  scheduled: campaigns.filter((c) => c.status === 'scheduled').length,
  totalSpent: campaigns.reduce((s, c) => s + c.spent, 0),
  totalLeads: campaigns.reduce((s, c) => s + c.conversions, 0),
};

export default function CampaignsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Campaigns"
        description="Every email, ad, event, and nurture campaign in one place."
        actions={
          <>
            <Button variant="outline" size="sm">
              <ArrowDown className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New campaign
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Active</p>
            <p className="mt-1 text-2xl font-semibold text-success">{totals.active}</p>
            <p className="mt-1 text-xs text-muted-foreground">Running now</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Scheduled</p>
            <p className="mt-1 text-2xl font-semibold">{totals.scheduled}</p>
            <p className="mt-1 text-xs text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total spend</p>
            <p className="mt-1 text-2xl font-semibold">{formatCurrency(totals.totalSpent)}</p>
            <p className="mt-1 text-xs text-success">+12% vs last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total leads</p>
            <p className="mt-1 text-2xl font-semibold">{formatNumber(totals.totalLeads)}</p>
            <p className="mt-1 text-xs text-muted-foreground">From campaigns</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList variant="pills">
          <TabsTrigger variant="pills" value="all">All ({campaigns.length})</TabsTrigger>
          <TabsTrigger variant="pills" value="active">Active ({totals.active})</TabsTrigger>
          <TabsTrigger variant="pills" value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger variant="pills" value="completed">Completed</TabsTrigger>
          <TabsTrigger variant="pills" value="draft">Drafts</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-2 p-3">
          <div className="min-w-[240px] flex-1">
            <InputAddon prefix={<Search className="size-4" />}>
              <Input placeholder="Search campaigns..." />
            </InputAddon>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="webinar">Webinar</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any owner</SelectItem>
              <SelectItem value="mp">Maya Patel</SelectItem>
              <SelectItem value="dk">David Kim</SelectItem>
              <SelectItem value="sa">Sofia Almeida</SelectItem>
              <SelectItem value="jk">Jamal Khan</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm">
            <Filter className="size-4" /> More
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th className="w-8 pl-4">
                  <Checkbox />
                </th>
                <th>
                  <button className="inline-flex items-center gap-1 hover:text-foreground">
                    Campaign <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th>Status</th>
                <th>Audience</th>
                <th>Performance</th>
                <th className="text-right">Conversions</th>
                <th>Budget</th>
                <th>Owner</th>
                <th>Schedule</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => {
                const t = typeMap[c.type];
                const openRate = c.sent > 0 ? (c.opens / c.sent) * 100 : 0;
                const clickRate = c.sent > 0 ? (c.clicks / c.sent) * 100 : c.clicks > 0 ? null : null;
                const budgetUsage = (c.spent / c.budget) * 100;
                return (
                  <tr key={c.id} className="group">
                    <td className="pl-4">
                      <Checkbox />
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg', t.color)}>
                          <t.icon className="size-4" />
                        </div>
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{t.label} · {c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge variant="outline" size="sm" className={cn(
                        c.status === 'active' && 'border-success/30 bg-success/10 text-success',
                        c.status === 'paused' && 'border-warning/30 bg-warning/10 text-warning',
                        c.status === 'scheduled' && 'border-info/30 bg-info/10 text-info',
                        c.status === 'completed' && 'border-muted text-muted-foreground',
                        c.status === 'draft' && 'border-muted text-muted-foreground',
                      )}>
                        {c.status === 'active' && <span className="mr-1 h-1.5 w-1.5 animate-pulse rounded-full bg-success" />}
                        {c.status}
                      </Badge>
                    </td>
                    <td className="text-sm tabular-nums">
                      {c.audience > 0 ? formatNumber(c.audience) : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td>
                      {c.sent > 0 ? (
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground w-10">Open</span>
                            <Progress value={openRate} className="h-1 w-20" />
                            <span className="font-mono tabular-nums">{openRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground w-10">Click</span>
                            <Progress value={(c.clicks / c.sent) * 100 * 5} className="h-1 w-20" />
                            <span className="font-mono tabular-nums">{((c.clicks / c.sent) * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      ) : c.clicks > 0 ? (
                        <div className="text-xs">
                          <p>{formatNumber(c.clicks)} clicks</p>
                          <p className="text-muted-foreground">via paid channels</p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No data yet</span>
                      )}
                    </td>
                    <td className="text-right font-mono font-semibold tabular-nums">
                      {c.conversions > 0 ? formatNumber(c.conversions) : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="w-40">
                      <div className="text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono tabular-nums">{formatCurrency(c.spent)}</span>
                          <span className="text-muted-foreground">/ {formatCurrency(c.budget)}</span>
                        </div>
                        <Progress value={budgetUsage} className="mt-1 h-1" indicatorClassName={cn(
                          budgetUsage > 90 && 'bg-warning',
                          budgetUsage > 100 && 'bg-destructive',
                        )} />
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Avatar size="xs">
                          <AvatarFallback name={c.owner}>{initials(c.owner)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{c.owner.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td className="text-xs text-muted-foreground">
                      {formatDate(c.startDate)} – {formatDate(c.endDate)}
                    </td>
                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {c.status === 'active' ? (
                            <DropdownMenuItem>
                              <Pause className="size-4" /> Pause
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <Play className="size-4" /> Launch
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Copy className="size-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="size-4" /> View audience
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
