'use client';

import * as React from 'react';
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';

interface SparklineProps {
  data: number[];
  height?: number;
  color?: 'primary' | 'success' | 'warning' | 'destructive' | 'info' | 'muted';
  showDots?: boolean;
}

export function Sparkline({ data, height = 30, color = 'primary', showDots = false }: SparklineProps) {
  const colorMap = {
    primary: 'hsl(var(--primary))',
    success: 'hsl(var(--success))',
    warning: 'hsl(var(--warning))',
    destructive: 'hsl(var(--destructive))',
    info: 'hsl(var(--info))',
    muted: 'hsl(var(--muted-foreground))',
  };

  const chartData = data.map((value, i) => ({ index: i, value }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 4, right: 0, bottom: 4, left: 0 }}>
        <YAxis hide domain={['dataMin', 'dataMax']} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={colorMap[color]}
          strokeWidth={1.5}
          dot={showDots ? { r: 2, fill: colorMap[color] } : false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
