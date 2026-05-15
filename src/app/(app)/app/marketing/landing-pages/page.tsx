import {
  ArrowDown,
  ArrowUpRight,
  Code,
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  Filter,
  Globe,
  Layout,
  LineChart,
  MoreHorizontal,
  MousePointerClick,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
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
import { cn, formatCompactNumber, formatNumber, formatRelativeTime, initials } from '@/lib/utils';

interface LandingPage {
  id: string;
  name: string;
  slug: string;
  status: 'published' | 'draft' | 'archived';
  visitors: number;
  conversions: number;
  conversionRate: number;
  campaign?: string;
  thumbnail: string;
  template: string;
  owner: string;
  updated: Date;
  abTest?: boolean;
  experiments?: number;
}

const pages: LandingPage[] = [
  { id: 'LP-001', name: 'Enterprise Demo Request', slug: '/demo-enterprise', status: 'published', visitors: 18420, conversions: 1240, conversionRate: 6.7, campaign: 'Q3 Enterprise Demand Gen', thumbnail: 'from-primary/30 to-primary/5', template: 'Demo request', owner: 'Maya Patel', updated: new Date(Date.now() - 1000 * 60 * 60 * 8), abTest: true, experiments: 3 },
  { id: 'LP-002', name: 'AI Procurement Buyer\'s Guide', slug: '/buyers-guide-ai-procurement', status: 'published', visitors: 12840, conversions: 1248, conversionRate: 9.7, campaign: 'AI Procurement Guide Promo', thumbnail: 'from-success/30 to-success/5', template: 'Content gate', owner: 'Maya Patel', updated: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: 'LP-003', name: 'Healthcare Solutions', slug: '/industries/healthcare', status: 'published', visitors: 8420, conversions: 412, conversionRate: 4.9, thumbnail: 'from-pink-500/30 to-pink-500/5', template: 'Industry page', owner: 'David Kim', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
  { id: 'LP-004', name: 'TCO Calculator', slug: '/tco-calculator', status: 'published', visitors: 7240, conversions: 980, conversionRate: 13.5, campaign: 'TCO Calculator Launch', thumbnail: 'from-warning/30 to-warning/5', template: 'Interactive tool', owner: 'Sofia Almeida', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), abTest: true, experiments: 2 },
  { id: 'LP-005', name: 'Healthcare Industry Webinar', slug: '/webinar/healthcare-procurement', status: 'published', visitors: 6840, conversions: 1820, conversionRate: 26.6, campaign: 'Healthcare Industry Webinar', thumbnail: 'from-info/30 to-info/5', template: 'Webinar registration', owner: 'David Kim', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4) },
  { id: 'LP-006', name: 'Free Trial Signup', slug: '/start-trial', status: 'published', visitors: 24820, conversions: 982, conversionRate: 4.0, thumbnail: 'from-purple-500/30 to-purple-500/5', template: 'Signup', owner: 'Sofia Almeida', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), abTest: true, experiments: 4 },
  { id: 'LP-007', name: 'Manufacturing Solutions', slug: '/industries/manufacturing', status: 'published', visitors: 5820, conversions: 248, conversionRate: 4.3, thumbnail: 'from-cyan-500/30 to-cyan-500/5', template: 'Industry page', owner: 'David Kim', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6) },
  { id: 'LP-008', name: 'Q4 Pricing Update', slug: '/pricing-q4-2026', status: 'draft', visitors: 0, conversions: 0, conversionRate: 0, thumbnail: 'from-orange-500/30 to-orange-500/5', template: 'Pricing', owner: 'Sofia Almeida', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
  { id: 'LP-009', name: 'Sustainability Report Download', slug: '/sustainability-report-2026', status: 'published', visitors: 4280, conversions: 620, conversionRate: 14.5, campaign: 'Sustainability Case Study Drip', thumbnail: 'from-emerald-500/30 to-emerald-500/5', template: 'Content gate', owner: 'Maya Patel', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9) },
  { id: 'LP-010', name: 'Partner Program Signup', slug: '/partners/apply', status: 'published', visitors: 2480, conversions: 184, conversionRate: 7.4, thumbnail: 'from-teal-500/30 to-teal-500/5', template: 'Application form', owner: 'Jamal Khan', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12) },
  { id: 'LP-011', name: 'Manufacturing Tech Summit', slug: '/events/mfg-tech-summit-2026', status: 'published', visitors: 1840, conversions: 312, conversionRate: 17.0, campaign: 'Manufacturing Tech Summit 2026', thumbnail: 'from-blue-500/30 to-blue-500/5', template: 'Event landing', owner: 'David Kim', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) },
  { id: 'LP-012', name: 'Old Pricing Page', slug: '/pricing-legacy', status: 'archived', visitors: 0, conversions: 0, conversionRate: 0, thumbnail: 'from-muted to-muted-foreground/5', template: 'Pricing', owner: 'Sofia Almeida', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60) },
];

const summary = {
  published: pages.filter((p) => p.status === 'published').length,
  totalVisitors: pages.reduce((s, p) => s + p.visitors, 0),
  totalConversions: pages.reduce((s, p) => s + p.conversions, 0),
  avgRate: 0,
};
summary.avgRate = summary.totalVisitors > 0 ? (summary.totalConversions / summary.totalVisitors) * 100 : 0;

export default function LandingPagesPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Landing pages"
        description="Conversion-optimized pages for every campaign. Test, measure, iterate."
        actions={
          <>
            <Button variant="outline" size="sm">
              <ArrowDown className="size-4" /> Export
            </Button>
            <Button variant="outline" size="sm">
              <Sparkles className="size-4" /> Generate with AI
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New page
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Published</p>
            <p className="mt-1 text-2xl font-semibold">{summary.published}</p>
            <p className="mt-1 text-xs text-success">+2 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total visitors</p>
            <p className="mt-1 text-2xl font-semibold">{formatCompactNumber(summary.totalVisitors)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Conversions</p>
            <p className="mt-1 text-2xl font-semibold text-success">{formatCompactNumber(summary.totalConversions)}</p>
            <p className="mt-1 text-xs text-success">+18% vs prev</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Avg conversion rate</p>
            <p className="mt-1 text-2xl font-semibold">{summary.avgRate.toFixed(1)}%</p>
            <p className="mt-1 text-xs text-success">+0.8pt vs prev</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-[240px] flex-1">
          <InputAddon prefix={<Search className="size-4" />}>
            <Input placeholder="Search landing pages..." />
          </InputAddon>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All templates</SelectItem>
            <SelectItem value="demo">Demo request</SelectItem>
            <SelectItem value="content">Content gate</SelectItem>
            <SelectItem value="webinar">Webinar</SelectItem>
            <SelectItem value="signup">Signup</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm">
          <Filter className="size-4" /> More
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pages.map((p) => (
          <Card key={p.id} className="group overflow-hidden transition-all hover:shadow-md">
            <div className={cn('relative h-36 bg-gradient-to-br', p.thumbnail)}>
              <div className="absolute inset-0 grid place-items-center">
                <Layout className="size-12 text-foreground/30" />
              </div>
              <div className="absolute left-2 top-2 flex items-center gap-1">
                <Badge
                  variant="outline"
                  size="sm"
                  className={cn(
                    p.status === 'published' && 'border-success/30 bg-background/90 text-success backdrop-blur',
                    p.status === 'draft' && 'border-warning/30 bg-background/90 text-warning backdrop-blur',
                    p.status === 'archived' && 'border-muted bg-background/90 text-muted-foreground backdrop-blur',
                  )}
                >
                  {p.status === 'published' && <span className="mr-1 size-1.5 rounded-full bg-success" />}
                  {p.status}
                </Badge>
                {p.abTest && (
                  <Badge variant="outline" size="sm" className="border-primary/30 bg-background/90 text-primary backdrop-blur">
                    A/B · {p.experiments}
                  </Badge>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-end gap-1 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="outline" size="xs">
                  <Eye className="size-3" /> Preview
                </Button>
                <Button variant="default" size="xs">
                  <Edit3 className="size-3" /> Edit
                </Button>
              </div>
            </div>
            <CardContent className="p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">{p.name}</h3>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <Globe className="size-3" />
                    <span className="truncate">{p.slug}</span>
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="-mr-1 -mt-1">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="size-4" /> Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit3 className="size-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="size-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LineChart className="size-4" /> Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Code className="size-4" /> Embed code
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {p.status === 'published' && (
                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Visitors</p>
                      <p className="font-mono font-semibold tabular-nums">{formatNumber(p.visitors)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Conv</p>
                      <p className="font-mono font-semibold tabular-nums">{formatNumber(p.conversions)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rate</p>
                      <p className={cn(
                        'font-mono font-semibold tabular-nums',
                        p.conversionRate >= 10 && 'text-success',
                        p.conversionRate < 3 && 'text-warning',
                      )}>
                        {p.conversionRate}%
                      </p>
                    </div>
                  </div>
                  <Progress value={Math.min(p.conversionRate * 5, 100)} className="h-1" indicatorClassName={cn(
                    p.conversionRate >= 10 && 'bg-success',
                    p.conversionRate < 3 && 'bg-warning',
                  )} />
                </div>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <Avatar size="xs">
                    <AvatarFallback name={p.owner}>{initials(p.owner)}</AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">{p.owner.split(' ')[0]}</span>
                </div>
                <span className="text-muted-foreground">{formatRelativeTime(p.updated)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
