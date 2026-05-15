'use client';

import { AlertTriangle, ChevronRight, Plus, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, LineChart, Line, ReferenceLine, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const charts = [
  { id: 1, item: 'GBX-450-A Gearbox Housing', characteristic: 'Bore diameter', type: 'x-bar R', cp: 1.42, cpk: 1.31, status: 'in_control', lastViolation: null },
  { id: 2, item: 'PMP-310-X Pump Body', characteristic: 'Surface finish (Ra)', type: 'x-bar R', cp: 1.85, cpk: 1.72, status: 'in_control', lastViolation: '2026-05-08' },
  { id: 3, item: 'CTL-PCBA-200', characteristic: 'Reflow temperature', type: 'individuals', cp: 1.15, cpk: 0.94, status: 'warning', lastViolation: '2026-05-13' },
  { id: 4, item: 'WGT-A-500 Widget', characteristic: 'Weight (grams)', type: 'x-bar R', cp: 2.10, cpk: 2.05, status: 'in_control', lastViolation: null },
  { id: 5, item: 'BRK-M8-PCK Bracket Pack', characteristic: 'Defect rate', type: 'p-chart', cp: null, cpk: null, status: 'out_of_control', lastViolation: '2026-05-14' },
];

const sampleSPCData = [
  { sample: 1, value: 25.04, ucl: 25.15, lcl: 24.85, mean: 25.00 },
  { sample: 2, value: 25.01, ucl: 25.15, lcl: 24.85, mean: 25.00 },
  { sample: 3, value: 24.98, ucl: 25.15, lcl: 24.85, mean: 25.00 },
  { sample: 4, value: 25.05, ucl: 25.15, lcl: 24.85, mean: 25.00 },
  { sample: 5, value: 24.92, ucl: 25.15, lcl: 24.85, mean: 25.00 },
  { sample: 6, value: 25.08, ucl: 25.15, lcl: 24.85, mean: 25.00 },
  { sample: 7, value: 25.12, ucl: 25.15, lcl: 24.85, mean: 25.00 },
  { sample: 8, value: 25.03, ucl: 25.15, lcl: 24.85, mean: 25.00 },
  { sample: 9, value: 24.95, ucl: 25.15, lcl: 24.85, mean: 25.00 },
  { sample: 10, value: 24.88, ucl: 25.15, lcl: 24.85, mean: 25.00 },
  { sample: 11, value: 25.06, ucl: 25.15, lcl: 24.85, mean: 25.00 },
  { sample: 12, value: 25.09, ucl: 25.15, lcl: 24.85, mean: 25.00 },
  { sample: 13, value: 25.18, ucl: 25.15, lcl: 24.85, mean: 25.00 },
  { sample: 14, value: 25.02, ucl: 25.15, lcl: 24.85, mean: 25.00 },
  { sample: 15, value: 24.97, ucl: 25.15, lcl: 24.85, mean: 25.00 },
];

const statusConfig: Record<string, { variant: any; label: string; icon: any }> = {
  in_control: { variant: 'success', label: 'In Control', icon: TrendingUp },
  warning: { variant: 'warning', label: 'Approaching limits', icon: AlertTriangle },
  out_of_control: { variant: 'destructive', label: 'Out of control', icon: AlertTriangle },
};

export default function SPCPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Statistical Process Control"
        description="Real-time control charts for critical product and process parameters. Detect out-of-control conditions before defects ship."
        actions={<Button><Plus className="size-4" /> New SPC chart</Button>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card><CardContent className="p-4"><div className="text-2xl font-semibold text-success">{charts.filter((c) => c.status === 'in_control').length}</div><div className="text-xs text-muted-foreground">In control</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-semibold text-warning">{charts.filter((c) => c.status === 'warning').length}</div><div className="text-xs text-muted-foreground">Approaching limits</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-semibold text-destructive">{charts.filter((c) => c.status === 'out_of_control').length}</div><div className="text-xs text-muted-foreground">Out of control</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-semibold">{charts.length}</div><div className="text-xs text-muted-foreground">Total active charts</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PMP-310-X · Surface finish</CardTitle>
          <CardDescription>X-bar R chart · Last 15 samples · Cp 1.85, Cpk 1.72</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={sampleSPCData} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="sample" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} domain={[24.8, 25.2]} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <ReferenceLine y={25.15} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: 'UCL', fill: 'hsl(var(--destructive))', fontSize: 10 }} />
              <ReferenceLine y={24.85} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: 'LCL', fill: 'hsl(var(--destructive))', fontSize: 10 }} />
              <ReferenceLine y={25.00} stroke="hsl(var(--success))" strokeDasharray="2 2" label={{ value: 'Mean', fill: 'hsl(var(--success))', fontSize: 10 }} />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All SPC charts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Item / Process</th>
                <th>Characteristic</th>
                <th>Chart Type</th>
                <th className="text-right">Cp</th>
                <th className="text-right">Cpk</th>
                <th>Last Violation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {charts.map((c) => {
                const cfg = statusConfig[c.status];
                return (
                  <tr key={c.id} className="cursor-pointer">
                    <td className="font-medium">{c.item}</td>
                    <td>{c.characteristic}</td>
                    <td><Badge variant="outline" className="text-2xs font-mono">{c.type}</Badge></td>
                    <td className="text-right font-mono">{c.cp?.toFixed(2) ?? '—'}</td>
                    <td className="text-right font-mono">{c.cpk?.toFixed(2) ?? '—'}</td>
                    <td className="text-sm text-muted-foreground">{c.lastViolation ?? 'Never'}</td>
                    <td>
                      <Badge variant={cfg.variant} className="gap-1">
                        <cfg.icon className="size-3" />
                        {cfg.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
