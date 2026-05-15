'use client';

import * as React from 'react';
import { AlertTriangle, Download, Package, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, formatNumber } from '@/lib/utils';

const spares = [
  { id: 'SPR-001', name: 'Spindle bearing 7014-CD', mfg: 'SKF', forAsset: 'CNC-04', category: 'Bearing', onHand: 4, min: 2, max: 8, uom: 'ea', cost: 248, consumption30d: 0, location: 'Spares-A2-12', critical: true },
  { id: 'SPR-002', name: 'Way oil Mobil Vactra No. 2 (20L)', mfg: 'Mobil', forAsset: 'CNC-*', category: 'Lubricant', onHand: 8, min: 5, max: 15, uom: 'pail', cost: 142, consumption30d: 6, location: 'Spares-B1-01', critical: false },
  { id: 'SPR-003', name: 'Coolant filter Donaldson P171550', mfg: 'Donaldson', forAsset: 'CNC-*', category: 'Filter', onHand: 18, min: 10, max: 30, uom: 'ea', cost: 38, consumption30d: 14, location: 'Spares-B1-04', critical: false },
  { id: 'SPR-004', name: 'Hydraulic hose 1/2" SAE 100R2 - 2m', mfg: 'Parker', forAsset: 'PRESS-01', category: 'Hydraulic', onHand: 2, min: 2, max: 6, uom: 'ea', cost: 124, consumption30d: 1, location: 'Spares-C2-08', critical: true },
  { id: 'SPR-005', name: 'KUKA encoder cable 5m', mfg: 'KUKA', forAsset: 'ASSY-02', category: 'Electrical', onHand: 1, min: 1, max: 2, uom: 'ea', cost: 685, consumption30d: 0, location: 'Spares-A3-22', critical: true },
  { id: 'SPR-006', name: 'Compressor air filter ZA22', mfg: 'Atlas Copco', forAsset: 'HVAC-A1', category: 'Filter', onHand: 6, min: 4, max: 12, uom: 'ea', cost: 32, consumption30d: 4, location: 'Spares-B2-15', critical: false },
  { id: 'SPR-007', name: 'Toolchanger pneumatic cylinder', mfg: 'Mazak OEM', forAsset: 'CNC-01', category: 'Pneumatic', onHand: 0, min: 1, max: 2, uom: 'ea', cost: 1240, consumption30d: 1, location: 'Spares-A1-04', critical: true },
  { id: 'SPR-008', name: 'Forklift hydraulic seal kit', mfg: 'Toyota', forAsset: 'FORK-*', category: 'Seal', onHand: 3, min: 2, max: 6, uom: 'kit', cost: 88, consumption30d: 1, location: 'Spares-C3-11', critical: false },
  { id: 'SPR-009', name: 'Vibration sensor PCB 622A', mfg: 'PCB', forAsset: 'PdM', category: 'Sensor', onHand: 12, min: 6, max: 20, uom: 'ea', cost: 380, consumption30d: 3, location: 'Spares-D1-02', critical: false },
  { id: 'SPR-010', name: 'V-belt SPB 1900 La', mfg: 'Gates', forAsset: 'HVAC-*', category: 'Belt', onHand: 24, min: 10, max: 30, uom: 'ea', cost: 22, consumption30d: 8, location: 'Spares-B3-09', critical: false },
  { id: 'SPR-011', name: 'CMM probe stylus Φ3mm ruby', mfg: 'Renishaw', forAsset: 'CMM-001', category: 'Probe', onHand: 8, min: 4, max: 12, uom: 'ea', cost: 95, consumption30d: 2, location: 'Spares-D2-18', critical: false },
  { id: 'SPR-012', name: 'Press hydraulic pump A11VO40', mfg: 'Rexroth', forAsset: 'PRESS-01', category: 'Hydraulic', onHand: 0, min: 1, max: 1, uom: 'ea', cost: 4200, consumption30d: 0, location: 'Spares-C1-02', critical: true },
  { id: 'SPR-013', name: 'CNC servo motor MDS-D-V1-200', mfg: 'Mitsubishi', forAsset: 'CNC-04', category: 'Electrical', onHand: 1, min: 1, max: 2, uom: 'ea', cost: 3800, consumption30d: 0, location: 'Spares-A2-04', critical: true },
  { id: 'SPR-014', name: 'Coolant Trim MicroSol 642 (5gal)', mfg: 'Master', forAsset: 'CNC-*', category: 'Lubricant', onHand: 12, min: 6, max: 20, uom: 'pail', cost: 88, consumption30d: 4, location: 'Spares-B1-07', critical: false },
  { id: 'SPR-015', name: 'Industrial fan blade 24"', mfg: 'Generic', forAsset: 'HVAC-A1', category: 'HVAC', onHand: 4, min: 2, max: 6, uom: 'ea', cost: 124, consumption30d: 0, location: 'Spares-B2-22', critical: false },
];

function stockStatus(s: typeof spares[0]): 'critical' | 'low' | 'ok' | 'over' {
  if (s.onHand < s.min) return s.onHand === 0 ? 'critical' : 'low';
  if (s.onHand > s.max) return 'over';
  return 'ok';
}

const statusVariant: Record<string, 'destructive' | 'warning' | 'success' | 'info'> = {
  critical: 'destructive', low: 'warning', ok: 'success', over: 'info',
};

const statusLabel: Record<string, string> = {
  critical: 'Out of stock', low: 'Below min', ok: 'In stock', over: 'Over max',
};

export default function SparesPage() {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [criticalOnly, setCriticalOnly] = React.useState(false);

  const filtered = spares.filter((s) => {
    const matchSearch = !search || s.id.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()) || s.forAsset.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || s.category === category;
    const matchCrit = !criticalOnly || s.critical;
    return matchSearch && matchCat && matchCrit;
  });

  const stats = {
    skus: spares.length,
    value: spares.reduce((s, sp) => s + sp.onHand * sp.cost, 0),
    critical: spares.filter((s) => s.critical).length,
    stockouts: spares.filter((s) => s.onHand === 0).length,
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Spare Parts"
        description="Maintenance spares catalog with stock levels, consumption and reorder triggers."
        breadcrumbs={[
          { label: 'Assets', href: '/app/assets' },
          { label: 'Spares' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New spare</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">SKUs</div>
              <div className="text-xl font-semibold tabular-nums">{stats.skus}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Stock value</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{formatCurrency(stats.value)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Critical spares</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{stats.critical}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Stockouts</div>
              <div className="text-xl font-semibold tabular-nums text-destructive">{stats.stockouts}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search spares..." className="pl-8" />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {['Bearing','Lubricant','Filter','Hydraulic','Electrical','Pneumatic','Seal','Sensor','Belt','Probe','HVAC'].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={criticalOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCriticalOnly(!criticalOnly)}
            >
              <AlertTriangle className="size-4" /> Critical only
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Spare part</th>
                <th>For asset</th>
                <th>Category</th>
                <th>Location</th>
                <th className="text-right">On hand</th>
                <th>Levels</th>
                <th className="text-right">30d use</th>
                <th className="text-right">Unit cost</th>
                <th className="text-right">Stock value</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const status = stockStatus(s);
                const pct = Math.min(100, (s.onHand / s.max) * 100);
                return (
                  <tr key={s.id}>
                    <td className="font-mono text-xs font-medium text-primary">{s.id}</td>
                    <td>
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-2xs text-muted-foreground">{s.mfg}</div>
                    </td>
                    <td className="font-mono text-xs">{s.forAsset}</td>
                    <td className="text-xs">{s.category}</td>
                    <td className="font-mono text-2xs text-muted-foreground">{s.location}</td>
                    <td className="text-right font-mono font-semibold">{s.onHand} <span className="text-2xs text-muted-foreground">{s.uom}</span></td>
                    <td className="w-32">
                      <div className="flex items-center gap-1">
                        <Progress value={pct} className="h-1 flex-1" indicatorClassName={status === 'critical' || status === 'low' ? 'bg-destructive' : 'bg-success'} />
                      </div>
                      <div className="mt-0.5 flex items-center justify-between text-2xs text-muted-foreground">
                        <span>Min {s.min}</span>
                        <span>Max {s.max}</span>
                      </div>
                    </td>
                    <td className="text-right font-mono">{formatNumber(s.consumption30d)}</td>
                    <td className="text-right font-mono">{formatCurrency(s.cost)}</td>
                    <td className="text-right font-mono">{formatCurrency(s.onHand * s.cost)}</td>
                    <td>
                      <Badge variant={statusVariant[status]} size="sm">{statusLabel[status]}</Badge>
                      {s.critical && <Badge variant="outline" size="sm" className="ml-1">CR</Badge>}
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
