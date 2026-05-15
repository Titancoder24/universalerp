'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Calendar,
  ChevronRight,
  Clock,
  Copy,
  Crown,
  Edit3,
  LayoutDashboard,
  LineChart,
  MoreHorizontal,
  PackageOpen,
  PieChart,
  Plus,
  Search,
  Share2,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart as RcLineChart,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, initials } from '@/lib/utils';

const dashboards = [
  {
    id: 'ceo',
    title: 'CEO Daily Dashboard',
    description: 'Top-line KPIs across revenue, cash, headcount, and operations',
    category: 'Executive',
    icon: Crown,
    color: 'hsl(var(--chart-1))',
    owner: 'Sarah Chen',
    sharedWith: 8,
    views: 1428,
    lastViewed: '2 hours ago',
    starred: true,
    chartType: 'area' as const,
    chartData: [40, 48, 52, 58, 62, 68, 72, 76, 84, 91, 98, 104],
  },
  {
    id: 'sales-perf',
    title: 'Sales Performance',
    description: 'Pipeline health, rep leaderboard, and win rate trends',
    category: 'Sales',
    icon: TrendingUp,
    color: 'hsl(var(--chart-2))',
    owner: 'Marcus Reid',
    sharedWith: 24,
    views: 842,
    lastViewed: '8 minutes ago',
    starred: true,
    chartType: 'bar' as const,
    chartData: [42, 58, 62, 84, 78, 92, 88, 104],
  },
  {
    id: 'operations',
    title: 'Operations Control',
    description: 'OEE, production output, and quality metrics across plants',
    category: 'Operations',
    icon: Briefcase,
    color: 'hsl(var(--chart-3))',
    owner: 'James Liu',
    sharedWith: 14,
    views: 612,
    lastViewed: '1 hour ago',
    starred: false,
    chartType: 'line' as const,
    chartData: [62, 68, 72, 71, 78, 82, 85, 88, 92],
  },
  {
    id: 'finance',
    title: 'Finance Cockpit',
    description: 'Cash position, AR/AP aging, and burn rate monitoring',
    category: 'Finance',
    icon: LineChart,
    color: 'hsl(var(--chart-4))',
    owner: 'Sarah Chen',
    sharedWith: 12,
    views: 524,
    lastViewed: 'Yesterday',
    starred: false,
    chartType: 'area' as const,
    chartData: [80, 84, 82, 88, 92, 96, 98, 102, 108],
  },
  {
    id: 'inventory',
    title: 'Inventory Insights',
    description: 'Stock levels, slow movers, and reorder alerts',
    category: 'Inventory',
    icon: PackageOpen,
    color: 'hsl(var(--chart-5))',
    owner: 'David Kumar',
    sharedWith: 6,
    views: 392,
    lastViewed: '3 days ago',
    starred: false,
    chartType: 'bar' as const,
    chartData: [120, 134, 128, 142, 138, 152, 148, 162],
  },
  {
    id: 'hr',
    title: 'People & Culture',
    description: 'Headcount, attrition, engagement scores, and recruiting funnel',
    category: 'HR',
    icon: Users,
    color: 'hsl(var(--chart-6))',
    owner: 'Emily Rodriguez',
    sharedWith: 9,
    views: 284,
    lastViewed: '2 days ago',
    starred: false,
    chartType: 'line' as const,
    chartData: [42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62],
  },
  {
    id: 'marketing',
    title: 'Marketing Analytics',
    description: 'Campaign ROI, MQL-to-SQL conversion, attribution',
    category: 'Marketing',
    icon: Target,
    color: 'hsl(var(--chart-7))',
    owner: 'David Kumar',
    sharedWith: 7,
    views: 412,
    lastViewed: '6 hours ago',
    starred: false,
    chartType: 'area' as const,
    chartData: [60, 64, 72, 68, 78, 82, 84, 88, 92, 98],
  },
  {
    id: 'product',
    title: 'Product Mix Analysis',
    description: 'Revenue and margin contribution by product line',
    category: 'Sales',
    icon: PieChart,
    color: 'hsl(var(--chart-8))',
    owner: 'James Liu',
    sharedWith: 5,
    views: 168,
    lastViewed: '5 days ago',
    starred: false,
    chartType: 'bar' as const,
    chartData: [88, 76, 94, 82, 102, 96, 104, 112],
  },
];

const categories = ['All', 'Executive', 'Sales', 'Finance', 'Operations', 'Inventory', 'HR', 'Marketing'];

function MiniChart({ type, data, color }: { type: 'area' | 'line' | 'bar'; data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={64}>
      {type === 'area' ? (
        <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#grad-${color})`} />
        </AreaChart>
      ) : type === 'bar' ? (
        <BarChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <Bar dataKey="v" fill={color} radius={[2, 2, 0, 0]} />
        </BarChart>
      ) : (
        <RcLineChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
        </RcLineChart>
      )}
    </ResponsiveContainer>
  );
}

export default function DashboardsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = dashboards.filter((d) => {
    if (category !== 'All' && d.category !== category) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Dashboards"
        description="Custom dashboards combining KPIs, charts, and tables from across the ERP."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Reports', href: '/app/reports' },
          { label: 'Dashboards' },
        ]}
        actions={
          <Button size="sm">
            <Plus className="size-4" /> Create dashboard
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total dashboards</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{dashboards.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">3 created this month</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Starred</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{dashboards.filter(d => d.starred).length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Pinned to your home</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total views (30d)</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">4,612</p>
          <p className="mt-1 text-xs text-success">+24% vs last 30d</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Shared dashboards</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{dashboards.filter(d => d.sharedWith > 0).length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across {Math.max(...dashboards.map(d => d.sharedWith))} team members</p>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dashboards…"
            className="pl-8"
          />
        </div>
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList variant="pills">
            {categories.map((c) => (
              <TabsTrigger key={c} variant="pills" value={c}>{c}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d) => (
          <Link key={d.id} href={`/app/reports/dashboards/${d.id}`} className="group">
            <Card className="h-full transition-all hover:shadow-md">
              <div className="relative h-32 overflow-hidden rounded-t-lg" style={{ background: `${d.color}10` }}>
                <div className="absolute inset-x-0 bottom-0 h-full">
                  <MiniChart type={d.chartType} data={d.chartData} color={d.color} />
                </div>
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md" style={{ background: d.color, color: 'white' }}>
                    <d.icon className="size-4" />
                  </div>
                  <Badge variant="soft" size="sm">{d.category}</Badge>
                </div>
                {d.starred && (
                  <div className="absolute right-3 top-3">
                    <Star className="size-4 fill-warning text-warning" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold leading-tight">{d.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{d.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Edit3 className="size-4" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem><Copy className="size-4" /> Duplicate</DropdownMenuItem>
                      <DropdownMenuItem><Share2 className="size-4" /> Share</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Avatar size="xs">
                      <AvatarFallback name={d.owner}>{initials(d.owner)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{d.owner}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{d.views} views</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
