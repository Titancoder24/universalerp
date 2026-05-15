'use client';

import Link from 'next/link';
import { use, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Calendar,
  CircleDollarSign,
  Download,
  Edit3,
  Filter,
  GripVertical,
  Maximize2,
  Plus,
  RefreshCw,
  Settings,
  Share2,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency, initials, cn } from '@/lib/utils';

const revenueData = [
  { month: 'Jul', actual: 248, budget: 240 },
  { month: 'Aug', actual: 268, budget: 250 },
  { month: 'Sep', actual: 245, budget: 260 },
  { month: 'Oct', actual: 271, budget: 270 },
  { month: 'Nov', actual: 294, budget: 280 },
  { month: 'Dec', actual: 312, budget: 290 },
  { month: 'Jan', actual: 268, budget: 300 },
  { month: 'Feb', actual: 294, budget: 310 },
  { month: 'Mar', actual: 326, budget: 320 },
  { month: 'Apr', actual: 348, budget: 330 },
  { month: 'May', actual: 384, budget: 340 },
];

const regionMix = [
  { name: 'North America', value: 1240, color: 'hsl(var(--chart-1))' },
  { name: 'Europe', value: 624, color: 'hsl(var(--chart-2))' },
  { name: 'Asia Pacific', value: 412, color: 'hsl(var(--chart-3))' },
  { name: 'LATAM', value: 248, color: 'hsl(var(--chart-4))' },
];

const productMix = [
  { product: 'Industrial Pumps', revenue: 842 },
  { product: 'Control Systems', revenue: 624 },
  { product: 'Filtration', revenue: 412 },
  { product: 'Sensors', revenue: 384 },
  { product: 'Accessories', revenue: 248 },
];

const cashTrend = [
  { week: 'W1', cash: 2.42 },
  { week: 'W2', cash: 2.48 },
  { week: 'W3', cash: 2.55 },
  { week: 'W4', cash: 2.62 },
  { week: 'W5', cash: 2.71 },
  { week: 'W6', cash: 2.78 },
  { week: 'W7', cash: 2.84 },
];

const topAccounts = [
  { name: 'Acme Industries', revenue: 312420, change: 12 },
  { name: 'Global Manufacturing', revenue: 248950, change: 8 },
  { name: 'TechCorp Solutions', revenue: 198200, change: -3 },
  { name: 'Hospital Network', revenue: 162800, change: 22 },
  { name: 'Apex Retail Group', revenue: 124300, change: -8 },
];

export default function DashboardViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="CEO Daily Dashboard"
        description="Top-line KPIs across revenue, cash, headcount, and operations · refreshed every 15 min"
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Reports', href: '/app/reports' },
          { label: 'Dashboards', href: '/app/reports/dashboards' },
          { label: 'CEO Daily Dashboard' },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/reports/dashboards" aria-label="Back">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        }
        actions={
          <>
            <div className="flex items-center gap-2 rounded-md border border-border px-2.5 h-8">
              <Edit3 className="size-3.5 text-muted-foreground" />
              <span className="text-xs">Edit mode</span>
              <Switch checked={editMode} onCheckedChange={setEditMode} />
            </div>
            <Select defaultValue="ytd">
              <SelectTrigger className="w-32">
                <Calendar className="size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="wtd">Week to date</SelectItem>
                <SelectItem value="mtd">Month to date</SelectItem>
                <SelectItem value="qtd">Quarter to date</SelectItem>
                <SelectItem value="ytd">YTD 2026</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="size-4" /> Filters
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="size-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Share2 className="size-4" /> Share
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Revenue (MTD)', value: 384320, delta: 14.2, format: 'currency' as const, icon: CircleDollarSign, sparkline: [248, 268, 245, 271, 294, 326, 348, 384] },
          { label: 'Cash position', value: 2840320, delta: 4.2, format: 'currency' as const, icon: Wallet, sparkline: [2.42, 2.48, 2.55, 2.62, 2.71, 2.78, 2.84] },
          { label: 'Active customers', value: 1247, delta: 3.4, format: 'number' as const, icon: Users, sparkline: [1180, 1198, 1212, 1225, 1238, 1247] },
          { label: 'Gross margin', value: 0.428, delta: 1.7, format: 'percent' as const, icon: TrendingUp, sparkline: [40.2, 40.8, 41.5, 41.8, 42.4, 42.8] },
        ].map((s) => (
          <div key={s.label} className={cn('group relative', editMode && 'ring-2 ring-primary/40 rounded-lg')}>
            {editMode && (
              <div className="absolute right-1 top-1 z-10 flex gap-1">
                <Button variant="ghost" size="icon-xs"><GripVertical className="size-3" /></Button>
                <Button variant="ghost" size="icon-xs"><Settings className="size-3" /></Button>
              </div>
            )}
            <StatCard {...s} />
          </div>
        ))}
      </div>

      <div className={cn('grid grid-cols-1 gap-4 lg:grid-cols-3', editMode && '[&>*]:ring-2 [&>*]:ring-primary/40 [&>*]:rounded-lg')}>
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue vs Budget</CardTitle>
              <CardDescription>Trailing 11 months · actual vs plan</CardDescription>
            </div>
            <Button variant="ghost" size="icon-sm">
              <Maximize2 className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}K`} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v: number) => [`$${v}K`, '']}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
                <Bar dataKey="actual" name="Actual" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="budget" name="Budget" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Region</CardTitle>
            <CardDescription>YTD 2026 distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={regionMix} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={80} paddingAngle={2}>
                  {regionMix.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v: number) => [`$${v}K`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5">
              {regionMix.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                    <span>{r.name}</span>
                  </div>
                  <span className="font-mono">${r.value}K</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={cn('grid grid-cols-1 gap-4 lg:grid-cols-2', editMode && '[&>*]:ring-2 [&>*]:ring-primary/40 [&>*]:rounded-lg')}>
        <Card>
          <CardHeader>
            <CardTitle>Cash Position Trend</CardTitle>
            <CardDescription>Last 7 weeks · all accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={cashTrend} margin={{ top: 6, right: 12, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="cashG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v: number) => [`$${v.toFixed(2)}M`, 'Cash']}
                />
                <Area type="monotone" dataKey="cash" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="url(#cashG)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products by Revenue</CardTitle>
            <CardDescription>YTD 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={productMix} layout="vertical" margin={{ top: 6, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}K`} />
                <YAxis dataKey="product" type="category" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={110} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v: number) => [`$${v}K`, '']}
                />
                <Bar dataKey="revenue" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className={cn('grid grid-cols-1 gap-4 lg:grid-cols-3', editMode && '[&>*]:ring-2 [&>*]:ring-primary/40 [&>*]:rounded-lg')}>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Customer Accounts</CardTitle>
            <CardDescription>Ranked by trailing 90-day revenue</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th className="text-right">Revenue</th>
                  <th className="text-right">Change</th>
                </tr>
              </thead>
              <tbody>
                {topAccounts.map((a) => (
                  <tr key={a.name}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar size="sm">
                          <AvatarFallback name={a.name}>{initials(a.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{a.name}</span>
                      </div>
                    </td>
                    <td className="text-right font-mono tabular-nums">{formatCurrency(a.revenue)}</td>
                    <td className={cn('text-right font-mono text-xs', a.change >= 0 ? 'text-success' : 'text-destructive')}>
                      <span className="inline-flex items-center gap-0.5">
                        {a.change >= 0 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                        {Math.abs(a.change)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              AI Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-success/30 bg-success/5 p-3">
              <p className="text-xs font-semibold uppercase text-success">Beat plan</p>
              <p className="mt-1 text-sm">Revenue tracking <span className="font-medium">+12.8%</span> above plan with 3 weeks left in May.</p>
            </div>
            <div className="rounded-lg border border-info/30 bg-info/5 p-3">
              <p className="text-xs font-semibold uppercase text-info">Forecast</p>
              <p className="mt-1 text-sm">Projected to close Q2 at <span className="font-medium">{formatCurrency(1248000)}</span>, 8% over target.</p>
            </div>
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
              <p className="text-xs font-semibold uppercase text-warning">Watch</p>
              <p className="mt-1 text-sm">TechCorp revenue down 3% — outreach recommended.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {editMode && (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center p-12">
            <Button variant="outline" size="lg">
              <Plus className="size-5" /> Add widget
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
