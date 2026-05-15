'use client';

import * as React from 'react';
import {
  Area,
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

export interface ForecastDataPoint {
  period: string;
  actual?: number;
  forecast?: number;
  lower?: number;
  upper?: number;
  target?: number;
}

interface ForecastChartProps {
  data: ForecastDataPoint[];
  height?: number;
  currency?: string;
  showTarget?: boolean;
  showConfidence?: boolean;
}

export function ForecastChart({
  data,
  height = 320,
  currency = 'USD',
  showTarget = true,
  showConfidence = true,
}: ForecastChartProps) {
  const formatter = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: 'compact', maximumFractionDigits: 1 }).format(v);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--info))" stopOpacity={0.25} />
            <stop offset="100%" stopColor="hsl(var(--info))" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="period"
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatter}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: number) => formatter(value)}
        />
        <Legend wrapperStyle={{ fontSize: '11px' }} />

        {showConfidence && (
          <Area
            type="monotone"
            dataKey="upper"
            stackId="confidence"
            stroke="none"
            fill="hsl(var(--info))"
            fillOpacity={0.08}
            legendType="none"
          />
        )}
        {showConfidence && (
          <Area
            type="monotone"
            dataKey="lower"
            stackId="confidence"
            stroke="none"
            fill="hsl(var(--background))"
            fillOpacity={1}
            legendType="none"
          />
        )}

        <Area
          name="Actuals"
          type="monotone"
          dataKey="actual"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="url(#actualGradient)"
        />
        <Area
          name="Forecast"
          type="monotone"
          dataKey="forecast"
          stroke="hsl(var(--info))"
          strokeWidth={2}
          strokeDasharray="5 5"
          fill="url(#forecastGradient)"
        />
        {showTarget && (
          <Line
            name="Target"
            type="monotone"
            dataKey="target"
            stroke="hsl(var(--success))"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={false}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
