'use client';

import * as React from 'react';
import {
  BarChart3,
  ChevronLeft,
  Database,
  Download,
  Filter,
  Layers,
  LineChart as LineIcon,
  PieChart as PieIcon,
  Play,
  Plus,
  Save,
  Settings,
  Share2,
  Table as TableIcon,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency } from '@/lib/utils';

const sampleData = [
  { month: 'Jan', revenue: 184320, orders: 412, margin: 78940 },
  { month: 'Feb', revenue: 198540, orders: 438, margin: 82150 },
  { month: 'Mar', revenue: 214200, orders: 461, margin: 91780 },
  { month: 'Apr', revenue: 234810, orders: 489, margin: 102450 },
  { month: 'May', revenue: 284320, orders: 521, margin: 124800 },
];

const segmentData = [
  { name: 'Enterprise', value: 425000, color: 'hsl(var(--primary))' },
  { name: 'Mid-Market', value: 312000, color: 'hsl(var(--info))' },
  { name: 'SMB', value: 178000, color: 'hsl(var(--success))' },
  { name: 'Self-serve', value: 89000, color: 'hsl(var(--warning))' },
];

const fields = [
  { table: 'invoices', name: 'amount', type: 'currency' },
  { table: 'invoices', name: 'issue_date', type: 'date' },
  { table: 'invoices', name: 'status', type: 'enum' },
  { table: 'customers', name: 'segment', type: 'enum' },
  { table: 'customers', name: 'region', type: 'string' },
  { table: 'orders', name: 'count', type: 'number' },
  { table: 'orders', name: 'avg_value', type: 'currency' },
];

export default function ReportBuilderCanvasPage() {
  const [chartType, setChartType] = React.useState<'bar' | 'line' | 'pie' | 'table'>('bar');

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Revenue by Segment & Month"
        description="Untitled report - last saved 5 minutes ago"
        breadcrumbs={[{ label: 'Reports', href: '/app/reports' }, { label: 'Builder', href: '/app/reports/builder' }, { label: 'Canvas' }]}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="size-4" /> Export</Button>
            <Button variant="outline" size="sm"><Share2 className="size-4" /> Share</Button>
            <Button variant="outline" size="sm"><Save className="size-4" /> Save</Button>
            <Button size="sm"><Play className="size-4" /> Run</Button>
          </>
        }
      />

      <div className="grid h-[calc(100vh-150px)] grid-cols-1 gap-4 p-6 lg:grid-cols-[260px_1fr_280px]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b p-4">
            <CardTitle className="text-sm flex items-center gap-2"><Database className="size-4" /> Data sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            <div>
              <Input placeholder="Search fields…" className="h-8" />
            </div>
            <Tabs defaultValue="fields">
              <TabsList variant="pills" className="w-full">
                <TabsTrigger value="fields" variant="pills" className="flex-1">Fields</TabsTrigger>
                <TabsTrigger value="metrics" variant="pills" className="flex-1">Metrics</TabsTrigger>
              </TabsList>
              <TabsContent value="fields" className="mt-3 space-y-1">
                {fields.map((f) => (
                  <div key={`${f.table}.${f.name}`} className="flex cursor-grab items-center justify-between rounded-md border border-dashed p-2 text-xs hover:bg-accent/30">
                    <div><p className="font-mono">{f.table}.{f.name}</p><p className="text-muted-foreground capitalize">{f.type}</p></div>
                    <Plus className="size-3.5 text-muted-foreground" />
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="metrics" className="mt-3 space-y-1">
                {['Total revenue', 'Order count', 'Avg deal size', 'Win rate', 'Customer LTV'].map((m) => (
                  <div key={m} className="flex cursor-grab items-center justify-between rounded-md border border-dashed bg-primary/5 p-2 text-xs hover:bg-primary/10">
                    <span className="font-medium">{m}</span>
                    <Plus className="size-3.5 text-primary" />
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b p-3">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'bar', icon: BarChart3 },
                { id: 'line', icon: LineIcon },
                { id: 'pie', icon: PieIcon },
                { id: 'table', icon: TableIcon },
              ].map((t) => {
                const Ic = t.icon;
                return (
                  <button key={t.id} onClick={() => setChartType(t.id as typeof chartType)} className={cn('flex size-8 items-center justify-center rounded-md transition-colors', chartType === t.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent')}>
                    <Ic className="size-4" />
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 text-xs"><Badge variant="outline">Auto-refresh: on</Badge><span className="text-muted-foreground">5,234 rows</span></div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-full min-h-[400px] w-full">
              {chartType === 'table' ? (
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/20">
                    <tr><th className="px-3 py-2 text-left text-xs uppercase tracking-wide">Month</th><th className="px-3 py-2 text-right text-xs uppercase tracking-wide">Revenue</th><th className="px-3 py-2 text-right text-xs uppercase tracking-wide">Orders</th><th className="px-3 py-2 text-right text-xs uppercase tracking-wide">Margin</th></tr>
                  </thead>
                  <tbody>{sampleData.map((r) => (<tr key={r.month} className="border-b"><td className="px-3 py-2 font-medium">{r.month}</td><td className="px-3 py-2 text-right font-mono">{formatCurrency(r.revenue)}</td><td className="px-3 py-2 text-right font-mono">{r.orders}</td><td className="px-3 py-2 text-right font-mono">{formatCurrency(r.margin)}</td></tr>))}</tbody>
                </table>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  {chartType === 'bar' ? (
                    <BarChart data={sampleData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="margin" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : chartType === 'line' ? (
                    <LineChart data={sampleData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                      <Line type="monotone" dataKey="margin" stroke="hsl(var(--success))" strokeWidth={2} />
                    </LineChart>
                  ) : (
                    <PieChart>
                      <Pie data={segmentData} cx="50%" cy="50%" outerRadius={120} dataKey="value" label />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }} />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b p-4"><CardTitle className="text-sm flex items-center gap-2"><Settings className="size-4" /> Configure</CardTitle></CardHeader>
          <CardContent className="space-y-4 p-4">
            <Tabs defaultValue="config">
              <TabsList variant="pills" className="w-full">
                <TabsTrigger value="config" variant="pills" className="flex-1">Config</TabsTrigger>
                <TabsTrigger value="filters" variant="pills" className="flex-1">Filters</TabsTrigger>
              </TabsList>
              <TabsContent value="config" className="space-y-3 mt-3">
                <div className="space-y-1.5"><Label className="text-xs">X axis</Label><Select defaultValue="month"><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="month">Month</SelectItem><SelectItem value="quarter">Quarter</SelectItem><SelectItem value="region">Region</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label className="text-xs">Y axis (metric)</Label><Select defaultValue="revenue"><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="revenue">Revenue</SelectItem><SelectItem value="orders">Order count</SelectItem><SelectItem value="margin">Margin</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label className="text-xs">Group by</Label><Select defaultValue="segment"><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="segment">Segment</SelectItem><SelectItem value="region">Region</SelectItem><SelectItem value="none">None</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label className="text-xs">Aggregation</Label><Select defaultValue="sum"><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sum">Sum</SelectItem><SelectItem value="avg">Average</SelectItem><SelectItem value="count">Count</SelectItem><SelectItem value="min">Min</SelectItem><SelectItem value="max">Max</SelectItem></SelectContent></Select></div>
              </TabsContent>
              <TabsContent value="filters" className="space-y-3 mt-3">
                <div className="rounded-md border p-2 text-xs"><p className="font-medium">Date range</p><p className="text-muted-foreground">Last 6 months</p></div>
                <div className="rounded-md border p-2 text-xs"><p className="font-medium">Status</p><p className="text-muted-foreground">paid, sent</p></div>
                <Button variant="outline" size="sm" className="w-full"><Plus className="size-4" /> Add filter</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
