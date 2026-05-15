'use client';

import { useState } from 'react';
import {
  AreaChart as AreaChartIcon,
  BarChart3,
  Boxes,
  ChevronDown,
  ChevronRight,
  Copy,
  Database,
  Download,
  Eye,
  Filter,
  Folder,
  Grip,
  GripVertical,
  Hash,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Plus,
  Receipt,
  Save,
  Search,
  Settings2,
  Sparkles,
  Table as TableIcon,
  Trash2,
  TrendingUp,
  Type,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const dataSources = [
  {
    name: 'Sales',
    icon: TrendingUp,
    expanded: true,
    fields: [
      { name: 'Invoice', type: 'text' as const },
      { name: 'Customer', type: 'text' as const },
      { name: 'Date', type: 'date' as const },
      { name: 'Amount', type: 'number' as const },
      { name: 'Status', type: 'text' as const },
      { name: 'Sales Rep', type: 'text' as const },
      { name: 'Product Category', type: 'text' as const },
    ],
  },
  {
    name: 'Customers',
    icon: Users,
    expanded: false,
    fields: [
      { name: 'Name', type: 'text' as const },
      { name: 'Segment', type: 'text' as const },
      { name: 'Region', type: 'text' as const },
      { name: 'Lifetime Value', type: 'number' as const },
    ],
  },
  {
    name: 'GL Accounts',
    icon: Receipt,
    expanded: false,
    fields: [
      { name: 'Account Code', type: 'text' as const },
      { name: 'Account Name', type: 'text' as const },
      { name: 'Type', type: 'text' as const },
      { name: 'Balance', type: 'number' as const },
    ],
  },
  {
    name: 'Inventory',
    icon: Boxes,
    expanded: false,
    fields: [
      { name: 'SKU', type: 'text' as const },
      { name: 'Description', type: 'text' as const },
      { name: 'Quantity', type: 'number' as const },
      { name: 'Unit Cost', type: 'number' as const },
      { name: 'Warehouse', type: 'text' as const },
    ],
  },
];

const sampleData = [
  { month: 'Jan', revenue: 248, target: 240 },
  { month: 'Feb', revenue: 268, target: 250 },
  { month: 'Mar', revenue: 245, target: 260 },
  { month: 'Apr', revenue: 271, target: 270 },
  { month: 'May', revenue: 294, target: 280 },
  { month: 'Jun', revenue: 312, target: 290 },
];

const chartTypes = [
  { id: 'table', name: 'Table', icon: TableIcon },
  { id: 'bar', name: 'Bar', icon: BarChart3 },
  { id: 'line', name: 'Line', icon: LineChartIcon },
  { id: 'area', name: 'Area', icon: AreaChartIcon },
  { id: 'pie', name: 'Pie', icon: PieChartIcon },
  { id: 'stat', name: 'KPI', icon: Hash },
];

interface SelectedField {
  source: string;
  name: string;
  type: 'text' | 'number' | 'date';
  role: 'group' | 'measure' | 'filter';
  aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min';
}

const fieldTypeIcon: Record<string, typeof Hash> = {
  text: Type,
  number: Hash,
  date: Hash,
};

export default function ReportBuilderPage() {
  const [sources, setSources] = useState(dataSources);
  const [chartType, setChartType] = useState('bar');
  const [selected, setSelected] = useState<SelectedField[]>([
    { source: 'Sales', name: 'Date', type: 'date', role: 'group' },
    { source: 'Sales', name: 'Amount', type: 'number', role: 'measure', aggregation: 'sum' },
  ]);

  const toggle = (i: number) => {
    setSources(sources.map((s, idx) => idx === i ? { ...s, expanded: !s.expanded } : s));
  };

  const groups = selected.filter((s) => s.role === 'group');
  const measures = selected.filter((s) => s.role === 'measure');
  const filters = selected.filter((s) => s.role === 'filter');

  return (
    <div className="space-y-4 p-6">
      <PageHeader
        title="Report Builder"
        description="Drag fields, choose a visualization, and preview your custom report."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Reports', href: '/app/reports' },
          { label: 'Builder' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Eye className="size-4" /> Preview
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Save className="size-4" /> Save report
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-3 flex flex-col">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-base">Data Sources</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="h-8 pl-8" placeholder="Search fields…" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-2">
            {sources.map((s, i) => (
              <div key={s.name} className="mb-1">
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-muted"
                >
                  {s.expanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                  <s.icon className="size-3.5 text-muted-foreground" />
                  <span>{s.name}</span>
                  <Badge variant="outline" size="sm" className="ml-auto">{s.fields.length}</Badge>
                </button>
                {s.expanded && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {s.fields.map((f) => {
                      const Icon = fieldTypeIcon[f.type];
                      const inUse = selected.some((sf) => sf.source === s.name && sf.name === f.name);
                      return (
                        <div
                          key={f.name}
                          className={cn(
                            'flex items-center gap-2 rounded-md px-2 py-1 text-xs hover:bg-muted cursor-grab',
                            inUse && 'bg-primary/10 text-primary',
                          )}
                        >
                          <GripVertical className="size-3 text-muted-foreground/40" />
                          <Icon className="size-3" />
                          <span className="flex-1">{f.name}</span>
                          <Plus className="size-3 opacity-0 group-hover:opacity-100" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="col-span-6 flex flex-col">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Canvas</CardTitle>
                <CardDescription>Drag fields here · {selected.length} fields selected</CardDescription>
              </div>
              <Tabs value={chartType} onValueChange={setChartType}>
                <TabsList variant="pills">
                  {chartTypes.map((c) => (
                    <TabsTrigger key={c.id} variant="pills" value={c.id} className="px-2">
                      <c.icon className="size-4" />
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3">
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Rows / Groups</p>
                <div className="space-y-1.5">
                  {groups.length === 0 && <p className="text-xs italic text-muted-foreground">Drop dimension here</p>}
                  {groups.map((g, i) => (
                    <div key={i} className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs">
                      <Type className="size-3 text-muted-foreground" />
                      <span className="font-medium">{g.name}</span>
                      <button className="ml-auto opacity-60 hover:opacity-100">
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3">
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Values / Measures</p>
                <div className="space-y-1.5">
                  {measures.length === 0 && <p className="text-xs italic text-muted-foreground">Drop number here</p>}
                  {measures.map((m, i) => (
                    <div key={i} className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs">
                      <Hash className="size-3 text-muted-foreground" />
                      <span className="font-medium">{m.aggregation?.toUpperCase()}({m.name})</span>
                      <button className="ml-auto opacity-60 hover:opacity-100">
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3">
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Filters</p>
                <div className="space-y-1.5">
                  {filters.length === 0 && <p className="text-xs italic text-muted-foreground">Drop field to filter</p>}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Live Preview</p>
                <Badge variant="soft" size="sm">Auto-refresh</Badge>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sampleData} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}K`} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(v: number) => [`$${v}K`, '']}
                  />
                  <Bar dataKey="revenue" name="Sum of Amount" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 flex flex-col">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-base">Properties</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4">
            <Tabs defaultValue="format">
              <TabsList variant="pills" className="w-full">
                <TabsTrigger variant="pills" value="format" className="flex-1">Format</TabsTrigger>
                <TabsTrigger variant="pills" value="filters" className="flex-1">Filters</TabsTrigger>
                <TabsTrigger variant="pills" value="schedule" className="flex-1">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="format" className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Report title</label>
                  <Input className="mt-1 h-8" defaultValue="Monthly Revenue by Region" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Color palette</label>
                  <Select defaultValue="default">
                    <SelectTrigger className="mt-1 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default · 8 colors</SelectItem>
                      <SelectItem value="mono">Monochrome</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="cool">Cool</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Number format</label>
                  <Select defaultValue="currency">
                    <SelectTrigger className="mt-1 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="currency">Currency (USD)</SelectItem>
                      <SelectItem value="percent">Percent</SelectItem>
                      <SelectItem value="compact">Compact (K/M)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Decimal places</label>
                  <Select defaultValue="0">
                    <SelectTrigger className="mt-1 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Sort by</label>
                  <Select defaultValue="value-desc">
                    <SelectTrigger className="mt-1 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="value-desc">Value (high → low)</SelectItem>
                      <SelectItem value="value-asc">Value (low → high)</SelectItem>
                      <SelectItem value="label-asc">Label A → Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="filters" className="space-y-4">
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="size-4" /> Add filter
                </Button>
                <div className="rounded-md border border-border p-3">
                  <p className="text-xs font-medium">Date</p>
                  <p className="mt-1 text-xs text-muted-foreground">Last 12 months</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-xs font-medium">Status</p>
                  <p className="mt-1 text-xs text-muted-foreground">Equals: Paid, Sent</p>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Frequency</label>
                  <Select defaultValue="monthly">
                    <SelectTrigger className="mt-1 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Recipients</label>
                  <Input className="mt-1 h-8" placeholder="email@company.com" />
                </div>
                <div className="rounded-lg bg-info/5 border border-info/30 p-3 text-xs">
                  <p className="font-semibold text-info">Next run: June 1, 2026 · 9:00 AM</p>
                  <p className="mt-1 text-muted-foreground">Will be emailed to 4 recipients</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
