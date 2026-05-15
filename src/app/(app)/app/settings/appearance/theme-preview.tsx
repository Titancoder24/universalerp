'use client';

import { Bell, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

export function ThemePreview() {
  return (
    <div className="space-y-4 text-sm">
      {/* Buttons */}
      <section>
        <div className="mb-2 text-2xs font-semibold uppercase tracking-wide text-muted-foreground">Buttons</div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">Secondary</Button>
          <Button size="sm" variant="outline">Outline</Button>
          <Button size="sm" variant="ghost">Ghost</Button>
          <Button size="sm" variant="destructive">Delete</Button>
        </div>
      </section>

      {/* Input */}
      <section>
        <div className="mb-2 text-2xs font-semibold uppercase tracking-wide text-muted-foreground">Inputs</div>
        <div className="space-y-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input placeholder="Search…" className="pl-8" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb-prev" defaultChecked />
            <label htmlFor="cb-prev" className="text-xs">Remember me</label>
            <div className="ml-auto flex items-center gap-2">
              <Switch defaultChecked />
              <span className="text-xs">Notifications</span>
            </div>
          </div>
        </div>
      </section>

      {/* Card */}
      <section>
        <div className="mb-2 text-2xs font-semibold uppercase tracking-wide text-muted-foreground">Card</div>
        <Card className="p-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-medium">INV-2089</div>
              <div className="text-xs text-muted-foreground">Acme Industries · Due May 15</div>
            </div>
            <Badge variant="default">Paid</Badge>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-lg font-semibold">$12,450</span>
            <Button size="xs" variant="outline">View</Button>
          </div>
        </Card>
      </section>

      {/* Badges */}
      <section>
        <div className="mb-2 text-2xs font-semibold uppercase tracking-wide text-muted-foreground">Status Pills</div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Failed</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="soft">Soft</Badge>
        </div>
      </section>

      {/* Mini chart */}
      <section>
        <div className="mb-2 text-2xs font-semibold uppercase tracking-wide text-muted-foreground">Chart palette</div>
        <div className="flex h-12 items-end gap-1 rounded-md border border-border bg-card p-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="flex-1 rounded-t"
              style={{
                background: `hsl(var(--chart-${i}))`,
                height: `${40 + Math.random() * 60}%`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Table */}
      <section>
        <div className="mb-2 text-2xs font-semibold uppercase tracking-wide text-muted-foreground">Table row</div>
        <div className="rounded-md border border-border overflow-hidden">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Item</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium">Widget A</td>
                <td className="text-right">12</td>
                <td className="text-right font-mono">$420</td>
              </tr>
              <tr>
                <td className="font-medium">Sprocket B</td>
                <td className="text-right">5</td>
                <td className="text-right font-mono">$175</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
