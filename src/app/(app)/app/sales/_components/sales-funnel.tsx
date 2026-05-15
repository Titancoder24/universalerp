'use client';

import { formatCurrency } from '@/lib/utils';

const stages = [
  { name: 'Leads', value: 1240, amount: 4200000, color: 'hsl(var(--chart-1))' },
  { name: 'Qualified', value: 612, amount: 2890000, color: 'hsl(var(--chart-2))' },
  { name: 'Proposals', value: 284, amount: 1820000, color: 'hsl(var(--chart-3))' },
  { name: 'Negotiation', value: 142, amount: 980000, color: 'hsl(var(--chart-4))' },
  { name: 'Closed Won', value: 87, amount: 632000, color: 'hsl(var(--success))' },
];

export function SalesFunnel() {
  const max = stages[0].value;
  return (
    <div className="flex flex-col gap-2">
      {stages.map((s, i) => {
        const widthPct = (s.value / max) * 100;
        const conv = i === 0 ? null : (s.value / stages[i - 1].value) * 100;
        return (
          <div key={s.name} className="group">
            <div className="mb-1 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{s.name}</span>
                {conv !== null && (
                  <span className="text-muted-foreground">{conv.toFixed(1)}% conv.</span>
                )}
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-muted-foreground">{s.value.toLocaleString()}</span>
                <span className="font-medium text-foreground">{formatCurrency(s.amount, 'USD')}</span>
              </div>
            </div>
            <div className="h-6 w-full overflow-hidden rounded-md bg-muted/40">
              <div
                className="h-full rounded-md transition-all duration-500 ease-out"
                style={{
                  width: `${widthPct}%`,
                  background: `linear-gradient(90deg, ${s.color}, ${s.color}cc)`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
