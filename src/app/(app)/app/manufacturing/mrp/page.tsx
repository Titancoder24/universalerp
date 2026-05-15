'use client';

import * as React from 'react';
import { AlertTriangle, ArrowDownToLine, CheckCircle2, Cog, Factory, Play, Repeat, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils';

type Action = 'PO' | 'MO' | 'TR';

const suggestions: Array<{
  id: string;
  item: string;
  desc: string;
  onHand: number;
  required: number;
  shortage: number;
  uom: string;
  action: Action;
  source: string;
  proposed: number;
  date: string;
  cost: number;
  urgency: 'low' | 'med' | 'high';
}> = [
  { id: 'S-001', item: 'HSG-CAST-450', desc: 'Cast aluminum housing', onHand: 84, required: 240, shortage: 156, uom: 'ea', action: 'PO', source: 'Acme Castings Co.', proposed: 200, date: '2026-05-18', cost: 8440, urgency: 'high' },
  { id: 'S-002', item: 'GEAR-SET-450', desc: 'Helical gear set 450', onHand: 32, required: 240, shortage: 208, uom: 'set', action: 'MO', source: 'Plant 2 - Detroit', proposed: 250, date: '2026-05-22', cost: 14575, urgency: 'high' },
  { id: 'S-003', item: 'BRG-6204-2RS', desc: 'Ball bearing 6204-2RS', onHand: 480, required: 960, shortage: 480, uom: 'ea', action: 'PO', source: 'SKF Distributors', proposed: 1000, date: '2026-05-20', cost: 970, urgency: 'med' },
  { id: 'S-004', item: 'OIL-HYD-46', desc: 'Hydraulic Oil ISO 46', onHand: 4, required: 25, shortage: 21, uom: 'drum', action: 'PO', source: 'Shell Industrial', proposed: 30, date: '2026-05-17', cost: 8400, urgency: 'high' },
  { id: 'S-005', item: 'BOLT-M8-25', desc: 'Hex bolt M8x25', onHand: 4200, required: 8000, shortage: 3800, uom: 'ea', action: 'TR', source: 'WH-Dallas → WH-Chicago', proposed: 5000, date: '2026-05-16', cost: 1400, urgency: 'med' },
  { id: 'S-006', item: 'SEAL-LIP-22-40', desc: 'Lip seal 22x40x7', onHand: 124, required: 480, shortage: 356, uom: 'ea', action: 'PO', source: 'Parker Seals Inc.', proposed: 500, date: '2026-05-19', cost: 600, urgency: 'med' },
  { id: 'S-007', item: 'AL-6061-T6', desc: 'Aluminum 6061-T6 ingot', onHand: 280, required: 576, shortage: 296, uom: 'kg', action: 'PO', source: 'MetalCorp USA', proposed: 400, date: '2026-05-21', cost: 3400, urgency: 'low' },
  { id: 'S-008', item: 'GASKET-12', desc: 'Rubber Gasket 12mm Series', onHand: 28, required: 150, shortage: 122, uom: 'ea', action: 'PO', source: 'Gasket Solutions', proposed: 200, date: '2026-05-23', cost: 420, urgency: 'low' },
  { id: 'S-009', item: 'CTL-PCBA-200', desc: 'Control PCBA 200V', onHand: 18, required: 80, shortage: 62, uom: 'ea', action: 'MO', source: 'Plant 1 - Electronics line', proposed: 100, date: '2026-05-25', cost: 16730, urgency: 'high' },
  { id: 'S-010', item: 'PAINT-PWD-GR', desc: 'Powder coat grey RAL7011', onHand: 8, required: 24, shortage: 16, uom: 'kg', action: 'PO', source: 'Sherwin-Williams', proposed: 25, date: '2026-05-26', cost: 800, urgency: 'low' },
  { id: 'S-011', item: 'WELD-ROD-6013', desc: 'Welding rod 6013 3.2mm', onHand: 12, required: 60, shortage: 48, uom: 'kg', action: 'TR', source: 'WH-Atlanta → WH-Chicago', proposed: 50, date: '2026-05-17', cost: 380, urgency: 'med' },
  { id: 'S-012', item: 'SHAFT-Φ22', desc: 'Drive shaft Φ22 hardened', onHand: 120, required: 240, shortage: 120, uom: 'ea', action: 'MO', source: 'Plant 1 - Machining', proposed: 150, date: '2026-05-19', cost: 1380, urgency: 'med' },
];

const actionMeta: Record<Action, { label: string; icon: typeof Truck; tone: string }> = {
  PO: { label: 'Purchase order', icon: Truck, tone: 'bg-info/10 text-info' },
  MO: { label: 'Manufacturing order', icon: Factory, tone: 'bg-primary/10 text-primary' },
  TR: { label: 'Stock transfer', icon: Repeat, tone: 'bg-warning/10 text-warning' },
};

const urgencyVariant = { high: 'destructive' as const, med: 'warning' as const, low: 'secondary' as const };

export default function MrpPage() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [actionFilter, setActionFilter] = React.useState<string>('all');

  const filtered = suggestions.filter((s) => actionFilter === 'all' || s.action === actionFilter);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((s) => s.id)));
  };

  const counts = {
    PO: suggestions.filter((s) => s.action === 'PO').length,
    MO: suggestions.filter((s) => s.action === 'MO').length,
    TR: suggestions.filter((s) => s.action === 'TR').length,
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="MRP Suggestions"
        description="Material requirements planning · automatic replenishment proposals."
        breadcrumbs={[
          { label: 'Manufacturing', href: '/app/manufacturing' },
          { label: 'MRP' },
        ]}
        actions={
          <>
            <Button variant="outline">
              <Cog className="size-4" /> MRP settings
            </Button>
            <Button>
              <Play className="size-4" /> Run MRP
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
              <Truck className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Purchase</div>
              <div className="text-xl font-semibold">{counts.PO}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Factory className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Manufacture</div>
              <div className="text-xl font-semibold">{counts.MO}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Repeat className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Transfer</div>
              <div className="text-xl font-semibold">{counts.TR}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Urgent</div>
              <div className="text-xl font-semibold">{suggestions.filter((s) => s.urgency === 'high').length}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-44"><SelectValue placeholder="Action type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  <SelectItem value="PO">Purchase orders</SelectItem>
                  <SelectItem value="MO">Manufacturing orders</SelectItem>
                  <SelectItem value="TR">Stock transfers</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                Last run: <span className="font-medium text-foreground">2026-05-15 06:00</span> · Next run: 18:00
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selected.size > 0 && (
                <Badge variant="soft">{selected.size} selected</Badge>
              )}
              <Button variant="outline" size="sm" disabled={selected.size === 0}>
                Reject
              </Button>
              <Button size="sm" disabled={selected.size === 0}>
                <CheckCircle2 className="size-4" /> Confirm {selected.size > 0 ? `(${selected.size})` : ''}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th className="w-8">
                  <Checkbox checked={selected.size === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} />
                </th>
                <th>Item</th>
                <th className="text-right">On hand</th>
                <th className="text-right">Required</th>
                <th className="text-right">Shortage</th>
                <th>Action</th>
                <th>Source</th>
                <th className="text-right">Propose qty</th>
                <th>Required by</th>
                <th className="text-right">Est. cost</th>
                <th>Urgency</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const meta = actionMeta[s.action];
                const Icon = meta.icon;
                return (
                  <tr key={s.id} className={selected.has(s.id) ? 'bg-primary/5' : ''}>
                    <td><Checkbox checked={selected.has(s.id)} onCheckedChange={() => toggle(s.id)} /></td>
                    <td>
                      <div className="font-mono text-xs text-primary">{s.item}</div>
                      <div className="text-xs text-muted-foreground">{s.desc}</div>
                    </td>
                    <td className="text-right font-mono">{formatNumber(s.onHand)} <span className="text-2xs text-muted-foreground">{s.uom}</span></td>
                    <td className="text-right font-mono">{formatNumber(s.required)}</td>
                    <td className="text-right font-mono text-destructive font-semibold">{formatNumber(s.shortage)}</td>
                    <td>
                      <Badge size="sm" className={`gap-1 ${meta.tone} border-transparent`}>
                        <Icon className="size-3" /> {s.action}
                      </Badge>
                    </td>
                    <td className="text-xs">{s.source}</td>
                    <td className="text-right">
                      <Input className="h-7 w-20 text-right font-mono text-xs" defaultValue={s.proposed} />
                    </td>
                    <td className="text-xs text-muted-foreground">{formatDate(s.date)}</td>
                    <td className="text-right font-mono">{formatCurrency(s.cost)}</td>
                    <td><Badge variant={urgencyVariant[s.urgency]} size="sm" className="capitalize">{s.urgency}</Badge></td>
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
