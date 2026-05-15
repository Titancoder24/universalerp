'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';

const data = [
  { month: 'Jun', revenue: 184000, target: 180000 },
  { month: 'Jul', revenue: 212000, target: 190000 },
  { month: 'Aug', revenue: 248000, target: 200000 },
  { month: 'Sep', revenue: 275000, target: 210000 },
  { month: 'Oct', revenue: 263000, target: 220000 },
  { month: 'Nov', revenue: 318000, target: 230000 },
  { month: 'Dec', revenue: 348000, target: 240000 },
  { month: 'Jan', revenue: 295000, target: 250000 },
  { month: 'Feb', revenue: 341000, target: 260000 },
  { month: 'Mar', revenue: 384000, target: 270000 },
  { month: 'Apr', revenue: 412000, target: 280000 },
  { month: 'May', revenue: 438000, target: 290000 },
];

export function SalesTrend() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="targetArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.18} />
            <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
        />
        <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" />
        <Area
          type="monotone"
          dataKey="target"
          name="Target"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          fill="url(#targetArea)"
        />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="url(#revenueArea)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
