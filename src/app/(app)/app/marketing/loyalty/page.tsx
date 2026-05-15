import {
  Award,
  ArrowDown,
  ArrowUp,
  CircleDollarSign,
  Crown,
  Diamond,
  Gem,
  Gift,
  Heart,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, InputAddon } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatCard } from '@/components/ui/stat-card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatCurrency, formatNumber, formatRelativeTime, initials } from '@/lib/utils';

const tiers = [
  { name: 'Silver', members: 12480, color: 'bg-slate-400', icon: Star, minPoints: 0, perks: ['5% off purchases', 'Early access to events', 'Birthday rewards'] },
  { name: 'Gold', members: 4820, color: 'bg-warning', icon: Award, minPoints: 5000, perks: ['10% off purchases', 'Priority support', 'Quarterly gifts', '2x points on events'] },
  { name: 'Platinum', members: 1240, color: 'bg-info', icon: Crown, minPoints: 15000, perks: ['15% off purchases', 'Dedicated account manager', 'Annual VIP event', '3x points on everything'] },
  { name: 'Diamond', members: 184, color: 'bg-primary', icon: Diamond, minPoints: 50000, perks: ['20% off purchases', 'Executive briefings', 'Exclusive launches', '5x points on everything', 'Concierge service'] },
];

const recentActivity = [
  { customer: 'Acme Industries', action: 'Redeemed 5,000 points', value: '$500 credit', tier: 'Diamond', at: new Date(Date.now() - 1000 * 60 * 18) },
  { customer: 'Helix Robotics', action: 'Tier upgrade to Platinum', value: 'New tier', tier: 'Platinum', at: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { customer: 'Lumen Health', action: 'Earned 1,240 points', value: 'Webinar attendance', tier: 'Gold', at: new Date(Date.now() - 1000 * 60 * 60 * 4) },
  { customer: 'Global Manufacturing', action: 'Anniversary reward', value: '$200 credit', tier: 'Diamond', at: new Date(Date.now() - 1000 * 60 * 60 * 8) },
  { customer: 'Brightline AI', action: 'Referral bonus', value: '500 points', tier: 'Silver', at: new Date(Date.now() - 1000 * 60 * 60 * 12) },
];

const rewards = [
  { name: '$100 service credit', cost: 1000, redeemed: 1240, type: 'Credit', stock: 'Unlimited', icon: CircleDollarSign },
  { name: 'Priority support upgrade', cost: 2500, redeemed: 482, type: 'Service', stock: 'Unlimited', icon: Zap },
  { name: 'Annual user conference pass', cost: 5000, redeemed: 184, type: 'Event', stock: '120 left', icon: Trophy },
  { name: 'Custom integration credit', cost: 7500, redeemed: 64, type: 'Service', stock: 'Unlimited', icon: Settings },
  { name: 'Executive briefing day', cost: 10000, redeemed: 32, type: 'Event', stock: '8 left this Q', icon: Crown },
  { name: '$1000 charity donation', cost: 8000, redeemed: 86, type: 'Donation', stock: 'Unlimited', icon: Heart },
  { name: 'Personalized swag box', cost: 1500, redeemed: 320, type: 'Physical', stock: '482 left', icon: Gift },
  { name: 'Co-marketing campaign', cost: 12000, redeemed: 24, type: 'Service', stock: '6 left this Q', icon: Sparkles },
];

const topMembers = [
  { name: 'Acme Industries', points: 84200, tier: 'Diamond', lifetimeValue: 1840000, joined: new Date('2022-03-14') },
  { name: 'Global Manufacturing', points: 72400, tier: 'Diamond', lifetimeValue: 1620000, joined: new Date('2021-09-22') },
  { name: 'Enterprise Ltd', points: 64800, tier: 'Diamond', lifetimeValue: 1480000, joined: new Date('2022-01-08') },
  { name: 'TechCorp Solutions', points: 48200, tier: 'Platinum', lifetimeValue: 920000, joined: new Date('2023-04-11') },
  { name: 'Acme Industries Plant 4', points: 42800, tier: 'Platinum', lifetimeValue: 820000, joined: new Date('2023-06-18') },
  { name: 'Helix Robotics', points: 38400, tier: 'Platinum', lifetimeValue: 720000, joined: new Date('2023-11-02') },
  { name: 'Lumen Health Network', points: 32400, tier: 'Platinum', lifetimeValue: 680000, joined: new Date('2024-02-14') },
  { name: 'Brightline AI Solutions', points: 24800, tier: 'Gold', lifetimeValue: 480000, joined: new Date('2024-05-20') },
];

const tierStyle = (t: string) => ({
  Silver: 'border-slate-400/40 bg-slate-400/10 text-slate-600',
  Gold: 'border-warning/40 bg-warning/10 text-warning',
  Platinum: 'border-info/40 bg-info/10 text-info',
  Diamond: 'border-primary/40 bg-primary/10 text-primary',
}[t] || '');

const totalMembers = tiers.reduce((s, t) => s + t.members, 0);

export default function LoyaltyPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Loyalty program"
        description="Reward your best customers, encourage expansion, and build advocacy at scale."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Settings className="size-4" /> Program rules
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> Issue points
            </Button>
          </>
        }
      />

      {/* Top stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total members"
          value={totalMembers}
          delta={12.4}
          format="number"
          icon={Users}
          sparkline={[18, 22, 28, 32, 36, 42, 48, 52, 58, 62, 66, 72]}
        />
        <StatCard
          label="Points issued (MTD)"
          value={1840000}
          delta={18.2}
          format="number"
          icon={Sparkles}
          sparkline={[12, 18, 24, 30, 36, 42, 48, 54, 60, 66]}
        />
        <StatCard
          label="Points redeemed"
          value={420000}
          delta={24.8}
          format="number"
          icon={Gift}
          sparkline={[8, 12, 18, 24, 28, 32, 38, 42, 48, 52]}
        />
        <StatCard
          label="Program ROI"
          value={3.8}
          delta={6.4}
          format="number"
          icon={TrendingUp}
        />
      </div>

      {/* Tiers */}
      <Card>
        <CardHeader>
          <CardTitle>Membership tiers</CardTitle>
          <CardDescription>Distribution and benefits across each tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((t) => {
              const pct = (t.members / totalMembers) * 100;
              return (
                <div key={t.name} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className={cn('grid h-10 w-10 place-items-center rounded-lg text-white', t.color)}>
                      <t.icon className="size-5" />
                    </div>
                    <Badge variant="outline" size="sm" className={tierStyle(t.name)}>
                      {t.name}
                    </Badge>
                  </div>
                  <p className="mt-3 text-2xl font-bold tabular-nums">{formatNumber(t.members)}</p>
                  <p className="text-xs text-muted-foreground">{pct.toFixed(1)}% of members</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className={cn('h-full rounded-full', t.color)} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-3 space-y-1">
                    <p className="text-2xs font-medium uppercase tracking-wide text-muted-foreground">Benefits</p>
                    <ul className="space-y-0.5">
                      {t.perks.slice(0, 3).map((p) => (
                        <li key={p} className="flex items-start gap-1.5 text-xs">
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground/40" />
                          <span className="text-muted-foreground">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-3 text-2xs font-mono text-muted-foreground">
                    {t.minPoints > 0 ? `${formatNumber(t.minPoints)}+ pts` : 'Starting tier'}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Top members */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top members</CardTitle>
              <CardDescription>By points balance · Q3 2026</CardDescription>
            </div>
            <Button variant="ghost" size="sm">View all</Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Tier</th>
                  <th className="text-right">Points</th>
                  <th className="text-right">LTV</th>
                  <th>Member since</th>
                </tr>
              </thead>
              <tbody>
                {topMembers.map((m, i) => (
                  <tr key={m.name}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-muted-foreground">#{i + 1}</span>
                        <Avatar size="sm">
                          <AvatarFallback name={m.name}>{initials(m.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{m.name}</span>
                      </div>
                    </td>
                    <td>
                      <Badge variant="outline" size="sm" className={tierStyle(m.tier)}>
                        {m.tier}
                      </Badge>
                    </td>
                    <td className="text-right font-mono font-semibold tabular-nums">{formatNumber(m.points)}</td>
                    <td className="text-right font-mono tabular-nums">{formatCurrency(m.lifetimeValue)}</td>
                    <td className="text-xs text-muted-foreground">{formatRelativeTime(m.joined)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest point events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className={cn('mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full', tierStyle(a.tier))}>
                  <Sparkles className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.customer}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.action}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-2xs text-muted-foreground">
                    <span>{a.value}</span>
                    <span>·</span>
                    <span>{formatRelativeTime(a.at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Rewards catalog */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Rewards catalog</CardTitle>
            <CardDescription>Available redemptions and stock levels</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="min-w-[180px]">
              <InputAddon prefix={<Search className="size-4" />}>
                <Input placeholder="Search rewards..." />
              </InputAddon>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="size-4" /> New reward
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {rewards.map((r) => (
              <div key={r.name} className="group rounded-lg border border-border p-4 transition-shadow hover:shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <r.icon className="size-5" />
                  </div>
                  <Badge variant="outline" size="sm">{r.type}</Badge>
                </div>
                <h3 className="mt-3 font-semibold leading-tight">{r.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold tabular-nums">{formatNumber(r.cost)}</span>
                  <span className="text-xs text-muted-foreground">points</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="text-muted-foreground">{r.redeemed} redeemed</span>
                  <span className={cn(
                    'font-medium',
                    r.stock.includes('left') ? 'text-warning' : 'text-success',
                  )}>
                    {r.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
