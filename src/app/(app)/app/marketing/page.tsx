import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Calendar,
  CircleDollarSign,
  Filter,
  Layers,
  Mail,
  MessageSquare,
  MousePointerClick,
  Plus,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { StatCard } from '@/components/ui/stat-card';
import { cn, formatCompactNumber, formatCurrency, formatNumber, formatRelativeTime } from '@/lib/utils';

const stats = [
  { label: 'MQLs generated', value: 1842, delta: 14.2, format: 'number' as const, icon: Users },
  { label: 'Pipeline influenced', value: 3240000, delta: 18.7, format: 'currency' as const, icon: Target },
  { label: 'Avg cost per lead', value: 184, delta: -6.4, format: 'currency' as const, icon: CircleDollarSign },
  { label: 'Marketing ROI', value: 4.2, delta: 22.1, format: 'number' as const, icon: TrendingUp },
];

const channelPerf = [
  { channel: 'Paid search', leads: 412, spend: 78000, mqls: 198, opps: 42, color: 'bg-primary' },
  { channel: 'Organic search', leads: 348, spend: 12000, mqls: 167, opps: 31, color: 'bg-success' },
  { channel: 'LinkedIn ads', leads: 286, spend: 56000, mqls: 124, opps: 21, color: 'bg-info' },
  { channel: 'Webinar', leads: 218, spend: 22000, mqls: 142, opps: 28, color: 'bg-warning' },
  { channel: 'Content syndication', leads: 184, spend: 38000, mqls: 78, opps: 12, color: 'bg-purple-500' },
  { channel: 'Email nurture', leads: 142, spend: 8000, mqls: 98, opps: 18, color: 'bg-pink-500' },
  { channel: 'Trade shows', leads: 98, spend: 84000, mqls: 64, opps: 14, color: 'bg-orange-500' },
  { channel: 'Referral', leads: 64, spend: 4000, mqls: 52, opps: 24, color: 'bg-cyan-500' },
];

const activeCampaigns = [
  { name: 'Q3 Enterprise Demand Gen', type: 'multi-channel', status: 'active', leads: 432, ctr: 3.8, spent: 45000, budget: 80000 },
  { name: 'Healthcare Industry Webinar', type: 'webinar', status: 'active', leads: 218, ctr: 8.4, spent: 18000, budget: 25000 },
  { name: 'Founder LinkedIn Series', type: 'social', status: 'active', leads: 156, ctr: 5.2, spent: 28000, budget: 40000 },
  { name: 'Sustainability Case Study', type: 'content', status: 'active', leads: 124, ctr: 4.1, spent: 12000, budget: 20000 },
];

const topAssets = [
  { name: 'AI Procurement Buyer\'s Guide', type: 'whitepaper', downloads: 1240, mqls: 380, conversionRate: 30.6 },
  { name: 'TCO Calculator', type: 'interactive', downloads: 980, mqls: 412, conversionRate: 42.0 },
  { name: 'Helix Robotics Case Study', type: 'case study', downloads: 720, mqls: 198, conversionRate: 27.5 },
  { name: 'Q2 State of Manufacturing Report', type: 'report', downloads: 620, mqls: 184, conversionRate: 29.7 },
  { name: 'SOC 2 Compliance Checklist', type: 'checklist', downloads: 540, mqls: 142, conversionRate: 26.3 },
];

const recentLaunches = [
  { name: 'Black Friday EU campaign', launched: new Date(Date.now() - 1000 * 60 * 60 * 3), owner: 'Maya Patel' },
  { name: 'Welcome sequence v3', launched: new Date(Date.now() - 1000 * 60 * 60 * 8), owner: 'David Kim' },
  { name: 'Procurement persona retargeting', launched: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), owner: 'Sofia Almeida' },
  { name: 'Manufacturing newsletter Q3', launched: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), owner: 'Jamal Khan' },
];

const maxChannelLeads = Math.max(...channelPerf.map((c) => c.leads));

export default function MarketingDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Marketing"
        description="Demand gen performance, channel ROI, and pipeline contribution at a glance."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="size-4" /> This quarter
            </Button>
            <Button variant="outline" size="sm">
              <ArrowDown className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New campaign
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            delta={s.delta}
            format={s.format}
            icon={s.icon}
            sparkline={[24, 32, 28, 38, 42, 40, 48, 52, 56, 62, 60, 68]}
            invertTrend={s.label === 'Avg cost per lead'}
          />
        ))}
      </div>

      {/* Channel performance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Channel performance</CardTitle>
            <CardDescription>Leads, MQLs, and opportunities by source · last 30 days</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            Full attribution <ArrowRight className="size-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Volume</th>
                <th className="text-right">Leads</th>
                <th className="text-right">MQLs</th>
                <th className="text-right">Opps</th>
                <th className="text-right">Spend</th>
                <th className="text-right">CPL</th>
                <th className="text-right">MQL %</th>
              </tr>
            </thead>
            <tbody>
              {channelPerf.map((c) => {
                const w = (c.leads / maxChannelLeads) * 100;
                const cpl = c.spend / c.leads;
                const mqlRate = (c.mqls / c.leads) * 100;
                return (
                  <tr key={c.channel}>
                    <td className="font-medium">{c.channel}</td>
                    <td className="w-44">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 overflow-hidden rounded-full bg-muted">
                          <div className={cn('h-full rounded-full', c.color)} style={{ width: `${w}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="text-right font-mono tabular-nums">{formatNumber(c.leads)}</td>
                    <td className="text-right font-mono tabular-nums">{formatNumber(c.mqls)}</td>
                    <td className="text-right font-mono tabular-nums">{formatNumber(c.opps)}</td>
                    <td className="text-right font-mono tabular-nums">{formatCurrency(c.spend)}</td>
                    <td className="text-right font-mono tabular-nums">{formatCurrency(cpl)}</td>
                    <td className="text-right font-mono tabular-nums">{mqlRate.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Active campaigns */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active campaigns</CardTitle>
              <CardDescription>Live now across all channels</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/marketing/campaigns">
                View all <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeCampaigns.map((c) => {
              const usage = (c.spent / c.budget) * 100;
              return (
                <div key={c.name} className="rounded-lg border border-border p-3 hover:bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="font-medium">{c.name}</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <Badge variant="outline" size="sm" className="capitalize">
                          {c.type}
                        </Badge>
                        <Badge variant="success" size="sm">Active</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-xs text-muted-foreground">Leads</p>
                        <p className="font-mono font-semibold">{c.leads}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CTR</p>
                        <p className="font-mono font-semibold">{c.ctr}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {formatCurrency(c.spent)} / {formatCurrency(c.budget)}
                      </span>
                      <span className="font-mono">{Math.round(usage)}%</span>
                    </div>
                    <Progress value={usage} className="mt-1 h-1.5" indicatorClassName={cn(
                      usage > 90 && 'bg-warning',
                      usage > 100 && 'bg-destructive',
                    )} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent launches */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent launches</CardTitle>
            <CardDescription>Live in last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentLaunches.map((l) => (
              <div key={l.name} className="flex items-start gap-2.5">
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                  <Send className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.owner} · {formatRelativeTime(l.launched)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top assets */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top content assets</CardTitle>
            <CardDescription>Lead generation by asset</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/app/marketing/content">
              View library <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th className="text-right">Downloads</th>
                <th className="text-right">MQLs</th>
                <th className="text-right">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {topAssets.map((a, i) => (
                <tr key={a.name}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">#{i + 1}</span>
                      <span className="font-medium">{a.name}</span>
                    </div>
                  </td>
                  <td>
                    <Badge variant="outline" size="sm" className="capitalize">
                      {a.type}
                    </Badge>
                  </td>
                  <td className="text-right font-mono tabular-nums">{formatNumber(a.downloads)}</td>
                  <td className="text-right font-mono font-semibold tabular-nums">{formatNumber(a.mqls)}</td>
                  <td className="text-right font-mono tabular-nums">
                    <span className={cn(
                      'inline-flex items-center gap-0.5',
                      a.conversionRate >= 35 && 'text-success font-medium',
                    )}>
                      {a.conversionRate >= 35 && <Sparkles className="size-3" />}
                      {a.conversionRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
