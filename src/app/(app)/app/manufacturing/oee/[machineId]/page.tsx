'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';

const oeeData = Array.from({ length: 14 }, (_, i) => ({
  day: `Day ${i + 1}`,
  availability: 88 + Math.random() * 8,
  performance: 92 + Math.random() * 6,
  quality: 95 + Math.random() * 4,
  oee: 85 + Math.random() * 8,
}));

const lossBreakdown = [
  { reason: 'Planned downtime', minutes: 240, category: 'planned' },
  { reason: 'Setup & changeover', minutes: 145, category: 'setup' },
  { reason: 'Material wait', minutes: 78, category: 'wait' },
  { reason: 'Quality holds', minutes: 42, category: 'quality' },
  { reason: 'Operator break', minutes: 60, category: 'planned' },
  { reason: 'Minor stops', minutes: 28, category: 'minor' },
  { reason: 'Equipment breakdown', minutes: 24, category: 'breakdown' },
];

const categoryColors: Record<string, string> = {
  planned: 'hsl(var(--info))',
  setup: 'hsl(var(--warning))',
  wait: 'hsl(var(--chart-4))',
  quality: 'hsl(var(--destructive))',
  minor: 'hsl(var(--muted-foreground))',
  breakdown: 'hsl(var(--destructive))',
};

export default function OEEMachineDetailPage() {
  return (
    <div className="space-y-6 p-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/app/manufacturing/oee"><ArrowLeft className="size-4" /> Back to OEE dashboard</Link>
      </Button>

      <PageHeader
        title="CNC Line 1 — OEE Analysis"
        description="Mazak VTC-300 · Plant A · Last 14 days"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="OEE (14-day avg)" value={87.4} format="percent" delta={2.1} />
        <StatCard label="Availability" value={94.2} format="percent" />
        <StatCard label="Performance" value={96.1} format="percent" />
        <StatCard label="Quality" value={97.0} format="percent" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>OEE trend</CardTitle>
          <CardDescription>Daily OEE breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={oeeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="oee" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loss Pareto</CardTitle>
          <CardDescription>Time losses by category. Focus on the top 3 for highest impact.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lossBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis dataKey="reason" type="category" width={140} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="minutes" radius={[0, 4, 4, 0]}>
                {lossBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={categoryColors[entry.category]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
