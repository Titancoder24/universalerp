import Link from 'next/link';
import {
  Award,
  Download,
  Filter,
  Search,
  Star,
  TrendingDown,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/ui/stat-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, formatCurrency, initials } from '@/lib/utils';

interface Scorecard {
  id: string;
  name: string;
  category: string;
  overall: number;
  onTime: number;
  quality: number;
  price: number;
  responsiveness: number;
  documentation: number;
  trend: 'up' | 'down' | 'flat';
  trendValue: number;
  pos: number;
  ytdSpend: number;
  tier: 1 | 2 | 3;
}

const scorecards: Scorecard[] = [
  { id: 'V008', name: 'ElectroMag Industries', category: 'Electronics', overall: 96, onTime: 98, quality: 99, price: 88, responsiveness: 96, documentation: 98, trend: 'up', trendValue: 2.4, pos: 18, ytdSpend: 164000, tier: 1 },
  { id: 'V001', name: 'Apex Industrial Supply', category: 'Raw materials', overall: 94, onTime: 96, quality: 99, price: 87, responsiveness: 92, documentation: 94, trend: 'up', trendValue: 1.2, pos: 38, ytdSpend: 842000, tier: 1 },
  { id: 'V004', name: 'AirGuard Co Ltd', category: 'Filtration', overall: 93, onTime: 94, quality: 98, price: 86, responsiveness: 94, documentation: 92, trend: 'flat', trendValue: 0, pos: 14, ytdSpend: 338000, tier: 1 },
  { id: 'V003', name: 'EuroFasteners GmbH', category: 'Fasteners', overall: 91, onTime: 92, quality: 96, price: 84, responsiveness: 92, documentation: 90, trend: 'up', trendValue: 0.8, pos: 18, ytdSpend: 412000, tier: 1 },
  { id: 'V012', name: 'Bossard Industrial AG', category: 'Fasteners', overall: 90, onTime: 93, quality: 95, price: 80, responsiveness: 90, documentation: 92, trend: 'down', trendValue: -1.2, pos: 6, ytdSpend: 62000, tier: 2 },
  { id: 'V010', name: 'PowerCells Ltd', category: 'Power', overall: 89, onTime: 90, quality: 92, price: 88, responsiveness: 86, documentation: 90, trend: 'up', trendValue: 1.8, pos: 12, ytdSpend: 128000, tier: 2 },
  { id: 'V006', name: 'ColorMax AG', category: 'Coatings', overall: 88, onTime: 91, quality: 90, price: 82, responsiveness: 88, documentation: 90, trend: 'flat', trendValue: 0.2, pos: 9, ytdSpend: 242000, tier: 2 },
  { id: 'V002', name: 'Shenzhen Tek Hardware', category: 'Electronics', overall: 84, onTime: 88, quality: 88, price: 96, responsiveness: 72, documentation: 78, trend: 'up', trendValue: 4.2, pos: 22, ytdSpend: 624000, tier: 2 },
  { id: 'V005', name: 'Petrolab Inc', category: 'Lubricants', overall: 84, onTime: 86, quality: 87, price: 78, responsiveness: 88, documentation: 82, trend: 'down', trendValue: -0.8, pos: 12, ytdSpend: 286000, tier: 2 },
  { id: 'V007', name: 'SealCo GmbH', category: 'Seals', overall: 82, onTime: 84, quality: 86, price: 80, responsiveness: 78, documentation: 84, trend: 'flat', trendValue: 0, pos: 8, ytdSpend: 188000, tier: 2 },
  { id: 'V009', name: 'CableNet Solutions', category: 'Cabling', overall: 80, onTime: 82, quality: 84, price: 86, responsiveness: 76, documentation: 78, trend: 'down', trendValue: -2.4, pos: 6, ytdSpend: 142000, tier: 2 },
  { id: 'V011', name: 'StickIt Labs', category: 'Adhesives', overall: 76, onTime: 79, quality: 78, price: 84, responsiveness: 70, documentation: 74, trend: 'flat', trendValue: 0.4, pos: 4, ytdSpend: 84000, tier: 3 },
];

function Bar({ label, value, tone = 'success' }: { label: string; value: number; tone?: 'success' | 'warning' | 'destructive' }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">{value}%</span>
      </div>
      <Progress
        value={value}
        indicatorClassName={value >= 90 ? 'bg-success' : value >= 80 ? 'bg-info' : value >= 70 ? 'bg-warning' : 'bg-destructive'}
      />
    </div>
  );
}

const tierColor: Record<number, 'success' | 'info' | 'outline'> = {
  1: 'success',
  2: 'info',
  3: 'outline',
};

export default function ScorecardsPage() {
  const tier1 = scorecards.filter((s) => s.tier === 1);
  const tier2 = scorecards.filter((s) => s.tier === 2);
  const tier3 = scorecards.filter((s) => s.tier === 3);
  const avgOverall = scorecards.reduce((a, s) => a + s.overall, 0) / scorecards.length;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Vendor scorecards"
        description="Performance ratings across on-time delivery, quality, price, and responsiveness"
        breadcrumbs={[
          { label: 'Procurement', href: '/app/procurement' },
          { label: 'Scorecards' },
        ]}
        actions={
          <>
            <Button variant="outline"><Filter className="size-4" /> Filter</Button>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avg overall score" value={Math.round(avgOverall * 10) / 10} delta={1.4} />
        <StatCard label="Tier 1 (Strategic)" value={tier1.length} format="number" />
        <StatCard label="Tier 2 (Preferred)" value={tier2.length} format="number" />
        <StatCard label="Tier 3 (At risk)" value={tier3.length} format="number" invertTrend />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top performers</CardTitle>
            <CardDescription>Highest weighted scores across criteria</CardDescription>
          </div>
          <Trophy className="size-5 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scorecards.slice(0, 3).map((s, idx) => (
              <Card key={s.id} className={cn(idx === 0 && 'ring-2 ring-warning/40')}>
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex size-8 items-center justify-center rounded-full font-bold',
                        idx === 0 && 'bg-warning text-warning-foreground',
                        idx === 1 && 'bg-muted-foreground text-background',
                        idx === 2 && 'bg-warning/30 text-foreground',
                      )}>{idx + 1}</div>
                      <Avatar size="md"><AvatarFallback name={s.name}>{initials(s.name)}</AvatarFallback></Avatar>
                      <div>
                        <Link href={`/app/procurement/vendors/${s.id}`} className="font-semibold hover:text-primary">{s.name}</Link>
                        <div className="text-xs text-muted-foreground">{s.category}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Overall score</div>
                      <div className="text-2xl font-bold tabular-nums">{s.overall}<span className="text-sm font-normal text-muted-foreground">/100</span></div>
                    </div>
                    <div className={cn('flex items-center gap-1 text-sm font-medium', s.trend === 'up' && 'text-success', s.trend === 'down' && 'text-destructive', s.trend === 'flat' && 'text-muted-foreground')}>
                      {s.trend === 'up' && <TrendingUp className="size-4" />}
                      {s.trend === 'down' && <TrendingDown className="size-4" />}
                      {s.trendValue > 0 ? '+' : ''}{s.trendValue.toFixed(1)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All scorecards</CardTitle>
            <CardDescription>Detailed performance breakdown</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="pl-8 w-64" placeholder="Search vendor…" />
            </div>
            <Select>
              <SelectTrigger className="w-32"><SelectValue placeholder="Tier" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tiers</SelectItem>
                <SelectItem value="1">Tier 1</SelectItem>
                <SelectItem value="2">Tier 2</SelectItem>
                <SelectItem value="3">Tier 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Category</th>
                <th>Tier</th>
                <th className="text-right">Overall</th>
                <th className="w-28">On-time</th>
                <th className="w-28">Quality</th>
                <th className="w-28">Price</th>
                <th className="w-28">Resp.</th>
                <th className="text-right">Trend</th>
                <th className="text-right">YTD Spend</th>
              </tr>
            </thead>
            <tbody>
              {scorecards.map((s) => (
                <tr key={s.id}>
                  <td>
                    <Link href={`/app/procurement/vendors/${s.id}`} className="flex items-center gap-2 hover:text-primary">
                      <Avatar size="xs"><AvatarFallback name={s.name}>{initials(s.name)}</AvatarFallback></Avatar>
                      <span className="font-medium">{s.name}</span>
                    </Link>
                  </td>
                  <td><Badge variant="outline" size="sm">{s.category}</Badge></td>
                  <td><Badge variant={tierColor[s.tier]} size="sm">Tier {s.tier}</Badge></td>
                  <td className="text-right font-mono font-semibold">{s.overall}</td>
                  <td><Bar label="" value={s.onTime} /></td>
                  <td><Bar label="" value={s.quality} /></td>
                  <td><Bar label="" value={s.price} /></td>
                  <td><Bar label="" value={s.responsiveness} /></td>
                  <td className={cn('text-right font-mono', s.trend === 'up' && 'text-success', s.trend === 'down' && 'text-destructive', s.trend === 'flat' && 'text-muted-foreground')}>
                    <span className="inline-flex items-center gap-1">
                      {s.trend === 'up' && <TrendingUp className="size-3" />}
                      {s.trend === 'down' && <TrendingDown className="size-3" />}
                      {s.trendValue > 0 ? '+' : ''}{s.trendValue.toFixed(1)}
                    </span>
                  </td>
                  <td className="text-right font-mono">{formatCurrency(s.ytdSpend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
