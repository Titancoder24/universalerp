'use client';

import { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronRight,
  Download,
  RefreshCw,
  Settings2,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, cn } from '@/lib/utils';

type Scenario = 'base' | 'optimistic' | 'pessimistic';

const baseData = Array.from({ length: 13 }, (_, i) => {
  const week = i + 1;
  const inflows = 285000 + Math.sin(i * 0.5) * 42000 + (i * 8400);
  const outflows = 198000 + Math.cos(i * 0.6) * 28000 + (i * 6200);
  return { week: `W${week}`, inflows, outflows };
});

const buildForecast = (data: typeof baseData, scen: Scenario, deltaInflows: number, deltaOutflows: number) => {
  let cash = 2840000;
  return data.map((d) => {
    const adjIn = d.inflows * (scen === 'optimistic' ? 1.12 : scen === 'pessimistic' ? 0.88 : 1) * (1 + deltaInflows / 100);
    const adjOut = d.outflows * (scen === 'optimistic' ? 0.95 : scen === 'pessimistic' ? 1.08 : 1) * (1 + deltaOutflows / 100);
    cash = cash + adjIn - adjOut;
    return {
      week: d.week,
      inflows: Math.round(adjIn),
      outflows: -Math.round(adjOut),
      cash: Math.round(cash),
    };
  });
};

export default function CashFlowPage() {
  const [scenario, setScenario] = useState<Scenario>('base');
  const [deltaInflows, setDeltaInflows] = useState(0);
  const [deltaOutflows, setDeltaOutflows] = useState(0);
  const [horizon, setHorizon] = useState('13w');

  const data = useMemo(() => buildForecast(baseData, scenario, deltaInflows, deltaOutflows), [scenario, deltaInflows, deltaOutflows]);

  const endingCash = data[data.length - 1].cash;
  const minCash = Math.min(...data.map((d) => d.cash));
  const totalInflows = data.reduce((s, d) => s + d.inflows, 0);
  const totalOutflows = data.reduce((s, d) => s + Math.abs(d.outflows), 0);

  const scenarioConfig: Record<Scenario, { label: string; color: string }> = {
    base: { label: 'Base case', color: 'hsl(var(--chart-1))' },
    optimistic: { label: 'Optimistic', color: 'hsl(var(--success))' },
    pessimistic: { label: 'Pessimistic', color: 'hsl(var(--destructive))' },
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Cash Flow Forecast"
        description="13-week rolling forecast with scenario modeling and what-if analysis."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Accounting', href: '/app/accounting' },
          { label: 'Cash Flow' },
        ]}
        actions={
          <>
            <Select value={horizon} onValueChange={setHorizon}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4w">4 weeks</SelectItem>
                <SelectItem value="13w">13 weeks</SelectItem>
                <SelectItem value="26w">26 weeks</SelectItem>
                <SelectItem value="52w">52 weeks</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <RefreshCw className="size-4" /> Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Current cash</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(2840000)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Starting balance</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Ending cash (W13)</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(endingCash)}</p>
          <p className={cn('mt-1 text-xs', endingCash > 2840000 ? 'text-success' : 'text-destructive')}>
            {endingCash > 2840000 ? '+' : ''}{formatCurrency(endingCash - 2840000)} vs today
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Minimum cash</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(minCash)}</p>
          <p className={cn('mt-1 text-xs', minCash > 500000 ? 'text-success' : 'text-warning')}>
            {minCash > 500000 ? 'Healthy buffer' : 'Below safety threshold'}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Net change</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(totalInflows - totalOutflows)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Inflows minus outflows</p>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Cash Position Forecast</CardTitle>
            <CardDescription>Inflows vs outflows with running cash balance · scenario: {scenarioConfig[scenario].label}</CardDescription>
          </div>
          <Tabs value={scenario} onValueChange={(v) => setScenario(v as Scenario)}>
            <TabsList variant="pills">
              <TabsTrigger variant="pills" value="base">Base</TabsTrigger>
              <TabsTrigger variant="pills" value="optimistic">Optimistic</TabsTrigger>
              <TabsTrigger variant="pills" value="pessimistic">Pessimistic</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart data={data} margin={{ top: 10, right: 24, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={scenarioConfig[scenario].color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={scenarioConfig[scenario].color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: number, name: string) => [`$${Math.abs(value).toLocaleString()}`, name]}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
              <ReferenceLine yAxisId="left" y={0} stroke="hsl(var(--border))" />
              <Bar yAxisId="left" dataKey="inflows" name="Inflows" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
              <Bar yAxisId="left" dataKey="outflows" name="Outflows" fill="hsl(var(--chart-3))" radius={[0, 0, 2, 2]} />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="cash"
                name="Cash balance"
                stroke={scenarioConfig[scenario].color}
                strokeWidth={2.5}
                fill="url(#cashGradient)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="size-4 text-primary" />
              What-If Simulator
            </CardTitle>
            <CardDescription>Adjust forecast assumptions to model different scenarios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium">Inflows adjustment</label>
                <span className={cn('font-mono text-sm', deltaInflows > 0 && 'text-success', deltaInflows < 0 && 'text-destructive')}>
                  {deltaInflows > 0 ? '+' : ''}{deltaInflows}%
                </span>
              </div>
              <Slider
                value={[deltaInflows]}
                onValueChange={([v]) => setDeltaInflows(v)}
                min={-30}
                max={30}
                step={1}
              />
              <div className="mt-1 flex justify-between text-2xs text-muted-foreground">
                <span>-30%</span>
                <span>0</span>
                <span>+30%</span>
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium">Outflows adjustment</label>
                <span className={cn('font-mono text-sm', deltaOutflows > 0 && 'text-destructive', deltaOutflows < 0 && 'text-success')}>
                  {deltaOutflows > 0 ? '+' : ''}{deltaOutflows}%
                </span>
              </div>
              <Slider
                value={[deltaOutflows]}
                onValueChange={([v]) => setDeltaOutflows(v)}
                min={-30}
                max={30}
                step={1}
              />
              <div className="mt-1 flex justify-between text-2xs text-muted-foreground">
                <span>-30%</span>
                <span>0</span>
                <span>+30%</span>
              </div>
            </div>
            <div className="rounded-lg bg-muted/40 p-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Adjusted inflows</p>
                  <p className="font-mono font-semibold tabular-nums">{formatCurrency(totalInflows)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Adjusted outflows</p>
                  <p className="font-mono font-semibold tabular-nums">{formatCurrency(totalOutflows)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Net W13</p>
                  <p className={cn('font-mono font-semibold tabular-nums', endingCash > 2840000 ? 'text-success' : 'text-destructive')}>
                    {formatCurrency(endingCash)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              AI Forecast Notes
            </CardTitle>
            <CardDescription>Auto-generated recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-success/30 bg-success/5 p-3">
              <div className="mb-1 flex items-center gap-2">
                <TrendingUp className="size-4 text-success" />
                <span className="text-xs font-semibold uppercase text-success">Strong outlook</span>
              </div>
              <p className="text-sm">
                Forecast shows healthy cash through Q3 with no liquidity events in {scenarioConfig[scenario].label} scenario.
              </p>
            </div>
            <div className="rounded-lg border border-info/30 bg-info/5 p-3">
              <div className="mb-1 flex items-center gap-2">
                <Calendar className="size-4 text-info" />
                <span className="text-xs font-semibold uppercase text-info">Timing</span>
              </div>
              <p className="text-sm">
                Peak cash demand in W7 ({formatCurrency(minCash)}). Consider delaying $84K capex purchase.
              </p>
            </div>
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
              <div className="mb-1 flex items-center gap-2">
                <TrendingDown className="size-4 text-warning" />
                <span className="text-xs font-semibold uppercase text-warning">Sensitivity</span>
              </div>
              <p className="text-sm">
                A 15% drop in collections would breach minimum cash threshold by W9.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>13-Week Detail</CardTitle>
          <CardDescription>Week-by-week breakdown of cash movements</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Week</th>
                  <th className="text-right">Inflows</th>
                  <th className="text-right">Outflows</th>
                  <th className="text-right">Net</th>
                  <th className="text-right">Cash balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => {
                  const net = d.inflows + d.outflows;
                  const healthy = d.cash > 1000000;
                  return (
                    <tr key={d.week}>
                      <td className="font-medium">{d.week}</td>
                      <td className="text-right font-mono tabular-nums text-success">
                        <span className="inline-flex items-center gap-1">
                          <ArrowUp className="size-3" />
                          {formatCurrency(d.inflows)}
                        </span>
                      </td>
                      <td className="text-right font-mono tabular-nums text-destructive">
                        <span className="inline-flex items-center gap-1">
                          <ArrowDown className="size-3" />
                          {formatCurrency(Math.abs(d.outflows))}
                        </span>
                      </td>
                      <td className={cn('text-right font-mono tabular-nums font-medium', net > 0 ? 'text-success' : 'text-destructive')}>
                        {formatCurrency(net)}
                      </td>
                      <td className="text-right font-mono tabular-nums font-semibold">{formatCurrency(d.cash)}</td>
                      <td>
                        <Badge variant={healthy ? 'success' : 'warning'} size="sm">
                          {healthy ? 'Healthy' : 'Watch'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
