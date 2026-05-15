'use client';

import { useState } from 'react';
import {
  Building2,
  Calendar,
  Car,
  Cog,
  Download,
  FileText,
  HardDrive,
  Laptop,
  MoreHorizontal,
  Plus,
  Printer,
  Search,
  Upload,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

const assets = [
  { code: 'FA-1001', name: 'CNC Milling Center #3', category: 'Machinery', purchaseDate: '2022-04-15', cost: 248000, life: 10, accumDepr: 84800, status: 'active' as const, location: 'Plant A' },
  { code: 'FA-1002', name: 'Hydraulic Press 200T', category: 'Machinery', purchaseDate: '2021-08-22', cost: 184000, life: 12, accumDepr: 72400, status: 'active' as const, location: 'Plant A' },
  { code: 'FA-1003', name: 'Plant Building A', category: 'Buildings', purchaseDate: '2018-01-10', cost: 1240000, life: 39, accumDepr: 264000, status: 'active' as const, location: 'Detroit, MI' },
  { code: 'FA-1004', name: 'Forklift Toyota 8FGCU25', category: 'Vehicles', purchaseDate: '2023-03-18', cost: 32400, life: 7, accumDepr: 14000, status: 'active' as const, location: 'Plant A' },
  { code: 'FA-1005', name: 'Delivery Truck Ford F-650', category: 'Vehicles', purchaseDate: '2022-11-05', cost: 84200, life: 8, accumDepr: 25800, status: 'active' as const, location: 'Distribution' },
  { code: 'FA-1006', name: 'Office Building HQ', category: 'Buildings', purchaseDate: '2015-06-22', cost: 1840000, life: 39, accumDepr: 518000, status: 'active' as const, location: 'Chicago, IL' },
  { code: 'FA-1007', name: 'Server Rack — Data Center', category: 'IT Equipment', purchaseDate: '2024-02-08', cost: 84200, life: 5, accumDepr: 19400, status: 'active' as const, location: 'HQ' },
  { code: 'FA-1008', name: 'MacBook Pro M3 Fleet (24x)', category: 'IT Equipment', purchaseDate: '2024-09-12', cost: 76800, life: 4, accumDepr: 12800, status: 'active' as const, location: 'Various' },
  { code: 'FA-1009', name: 'Industrial Welder #4', category: 'Machinery', purchaseDate: '2023-07-15', cost: 28400, life: 10, accumDepr: 5400, status: 'active' as const, location: 'Plant B' },
  { code: 'FA-1010', name: 'Conference Room AV System', category: 'Office Equipment', purchaseDate: '2023-12-01', cost: 18400, life: 7, accumDepr: 3800, status: 'active' as const, location: 'HQ' },
  { code: 'FA-1011', name: 'Sales Fleet Vehicle #4', category: 'Vehicles', purchaseDate: '2019-04-10', cost: 28400, life: 8, accumDepr: 24800, status: 'disposed' as const, location: 'Disposed' },
  { code: 'FA-1012', name: 'Robotic Arm Assembly', category: 'Machinery', purchaseDate: '2024-01-20', cost: 184000, life: 10, accumDepr: 26200, status: 'active' as const, location: 'Plant A' },
];

const categories = [
  { name: 'Buildings', value: 3080000, count: 2, icon: Building2, color: 'hsl(var(--chart-1))' },
  { name: 'Machinery', value: 644400, count: 4, icon: Cog, color: 'hsl(var(--chart-2))' },
  { name: 'Vehicles', value: 145000, count: 3, icon: Car, color: 'hsl(var(--chart-3))' },
  { name: 'IT Equipment', value: 161000, count: 2, icon: HardDrive, color: 'hsl(var(--chart-4))' },
  { name: 'Office Equipment', value: 18400, count: 1, icon: Printer, color: 'hsl(var(--chart-5))' },
];

const depreciationSchedule = [
  { year: '2022', buildings: 148000, machinery: 38400, vehicles: 14200, it: 0 },
  { year: '2023', buildings: 168000, machinery: 56400, vehicles: 18200, it: 8400 },
  { year: '2024', buildings: 184000, machinery: 84200, vehicles: 22400, it: 24800 },
  { year: '2025', buildings: 198000, machinery: 112800, vehicles: 26800, it: 38400 },
  { year: '2026', buildings: 84000, machinery: 56400, vehicles: 12400, it: 18400 },
];

const categoryIcon: Record<string, typeof Building2> = {
  Buildings: Building2,
  Machinery: Cog,
  Vehicles: Car,
  'IT Equipment': HardDrive,
  'Office Equipment': Printer,
};

const totalCost = assets.reduce((s, a) => s + a.cost, 0);
const totalAccum = assets.reduce((s, a) => s + a.accumDepr, 0);
const bookValue = totalCost - totalAccum;

export default function FixedAssetsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = assets.filter((a) => {
    if (category !== 'all' && a.category !== category) return false;
    if (search && !`${a.code} ${a.name}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Fixed Assets"
        description="Asset register, depreciation schedules, and book values."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Accounting', href: '/app/accounting' },
          { label: 'Fixed Assets' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Upload className="size-4" /> Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> Add asset
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total asset cost</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(totalCost)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{assets.length} assets</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Accum. depreciation</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(totalAccum)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{((totalAccum / totalCost) * 100).toFixed(1)}% of cost</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Net book value</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(bookValue)}</p>
          <p className="mt-1 text-xs text-success">+ $184K YoY</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">YTD Depreciation</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(171200)}</p>
          <p className="mt-1 text-xs text-muted-foreground">$42K monthly avg</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.name} className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md" style={{ background: `${c.color}15`, color: c.color }}>
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground">{c.name}</p>
                  <p className="font-mono text-base font-semibold tabular-nums">{formatCurrency(c.value)}</p>
                  <p className="text-xs text-muted-foreground">{c.count} {c.count === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="register">
        <TabsList variant="pills">
          <TabsTrigger variant="pills" value="register">Asset Register</TabsTrigger>
          <TabsTrigger variant="pills" value="depreciation">Depreciation Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="register">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative max-w-sm flex-1">
                  <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search code or name"
                    className="w-72 pl-8"
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th className="w-32">Asset Code</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Purchase date</th>
                    <th className="text-right">Cost</th>
                    <th className="text-right">Accum. Depr.</th>
                    <th className="text-right">Book Value</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => {
                    const Icon = categoryIcon[a.category] ?? Cog;
                    const bv = a.cost - a.accumDepr;
                    return (
                      <tr key={a.code}>
                        <td className="font-mono text-xs font-medium text-primary">{a.code}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                              <Icon className="size-3.5" />
                            </div>
                            <span className="font-medium">{a.name}</span>
                          </div>
                        </td>
                        <td className="text-xs text-muted-foreground">{a.category}</td>
                        <td className="text-xs text-muted-foreground">{a.location}</td>
                        <td className="text-xs text-muted-foreground">{formatDate(a.purchaseDate)}</td>
                        <td className="text-right font-mono tabular-nums">{formatCurrency(a.cost)}</td>
                        <td className="text-right font-mono tabular-nums text-muted-foreground">{formatCurrency(a.accumDepr)}</td>
                        <td className="text-right font-mono font-medium tabular-nums">{formatCurrency(bv)}</td>
                        <td><StatusBadge status={a.status} /></td>
                        <td>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-sm">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><FileText className="size-4" /> View detail</DropdownMenuItem>
                              <DropdownMenuItem>Run depreciation</DropdownMenuItem>
                              <DropdownMenuItem>Transfer location</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Dispose</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="depreciation">
          <Card>
            <CardHeader>
              <CardTitle>Depreciation by Year & Category</CardTitle>
              <CardDescription>Stacked depreciation expense across asset categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={depreciationSchedule} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
                  <Bar dataKey="buildings" stackId="a" name="Buildings" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="machinery" stackId="a" name="Machinery" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="vehicles" stackId="a" name="Vehicles" fill="hsl(var(--chart-3))" />
                  <Bar dataKey="it" stackId="a" name="IT Equipment" fill="hsl(var(--chart-4))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
