'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { month: 'Jun', revenue: 124000, target: 110000 },
  { month: 'Jul', revenue: 142000, target: 120000 },
  { month: 'Aug', revenue: 168000, target: 130000 },
  { month: 'Sep', revenue: 195000, target: 140000 },
  { month: 'Oct', revenue: 213000, target: 150000 },
  { month: 'Nov', revenue: 248000, target: 160000 },
  { month: 'Dec', revenue: 268000, target: 170000 },
  { month: 'Jan', revenue: 245000, target: 180000 },
  { month: 'Feb', revenue: 271000, target: 190000 },
  { month: 'Mar', revenue: 294000, target: 200000 },
  { month: 'Apr', revenue: 312000, target: 210000 },
  { month: 'May', revenue: 284320, target: 220000 },
];

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
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
          labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="url(#revenueGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
