'use client';

import * as React from 'react';
import { ChevronDown, ChevronRight, Download, Factory, Plus, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils';

type Operation = { seq: number; name: string; wc: string; setup: number; run: number; type: 'machining' | 'assembly' | 'qa' | 'finish' };
type Routing = { id: string; item: string; itemName: string; version: string; status: 'active' | 'draft'; updated: string; operations: Operation[] };

const routings: Routing[] = [
  {
    id: 'RTG-GBX-450', item: 'GBX-450-A', itemName: 'Gearbox Housing 450 Series', version: 'v3.2', status: 'active', updated: '2025-04-12',
    operations: [
      { seq: 10, name: 'CNC machining - housing prep', wc: 'CNC-04', setup: 45, run: 8.5, type: 'machining' },
      { seq: 20, name: 'Deburr & inspect', wc: 'BENCH-02', setup: 5, run: 2.0, type: 'qa' },
      { seq: 30, name: 'Gear assembly', wc: 'ASSY-03', setup: 15, run: 6.2, type: 'assembly' },
      { seq: 40, name: 'Oil fill & seal', wc: 'ASSY-04', setup: 5, run: 2.8, type: 'assembly' },
      { seq: 50, name: 'Final test & label', wc: 'TEST-01', setup: 10, run: 3.5, type: 'qa' },
    ],
  },
  {
    id: 'RTG-PMP-310', item: 'PMP-310-X', itemName: 'Centrifugal Pump Assembly', version: 'v2.1', status: 'active', updated: '2025-04-05',
    operations: [
      { seq: 10, name: 'Impeller balance', wc: 'BAL-01', setup: 20, run: 4.2, type: 'machining' },
      { seq: 20, name: 'Shaft press fit', wc: 'PRESS-01', setup: 10, run: 1.8, type: 'assembly' },
      { seq: 30, name: 'Casing assembly', wc: 'ASSY-02', setup: 15, run: 8.5, type: 'assembly' },
      { seq: 40, name: 'Hydro test 1.5×', wc: 'TEST-03', setup: 25, run: 12.0, type: 'qa' },
      { seq: 50, name: 'Paint & pack', wc: 'PAINT-01', setup: 30, run: 6.0, type: 'finish' },
    ],
  },
  {
    id: 'RTG-MTR-22K', item: 'MTR-2.2KW', itemName: '2.2kW Induction Motor', version: 'v4.0', status: 'active', updated: '2025-03-28',
    operations: [
      { seq: 10, name: 'Stator winding', wc: 'WIND-01', setup: 35, run: 18.0, type: 'assembly' },
      { seq: 20, name: 'Rotor balance', wc: 'BAL-02', setup: 15, run: 6.5, type: 'machining' },
      { seq: 30, name: 'Frame assembly', wc: 'ASSY-01', setup: 20, run: 9.5, type: 'assembly' },
      { seq: 40, name: 'Electrical test', wc: 'TEST-02', setup: 10, run: 5.5, type: 'qa' },
      { seq: 50, name: 'Run-in 30 min', wc: 'RUN-01', setup: 5, run: 30.0, type: 'qa' },
      { seq: 60, name: 'Pack & label', wc: 'PACK-01', setup: 5, run: 2.5, type: 'finish' },
    ],
  },
  {
    id: 'RTG-BRK-220', item: 'BRK-220-S', itemName: 'Brake Caliper Steel 220mm', version: 'v1.4', status: 'active', updated: '2025-03-22',
    operations: [
      { seq: 10, name: 'Press & form', wc: 'PRESS-01', setup: 30, run: 1.2, type: 'machining' },
      { seq: 20, name: 'CNC finishing', wc: 'CNC-02', setup: 25, run: 4.8, type: 'machining' },
      { seq: 30, name: 'Heat treatment', wc: 'HEAT-01', setup: 15, run: 90.0, type: 'finish' },
      { seq: 40, name: 'Inspection', wc: 'QA-01', setup: 5, run: 2.0, type: 'qa' },
    ],
  },
  {
    id: 'RTG-VLV-104', item: 'VLV-104-B', itemName: 'Hydraulic Valve 104B', version: 'v2.3', status: 'active', updated: '2025-03-15',
    operations: [
      { seq: 10, name: 'Body machining', wc: 'CNC-07', setup: 40, run: 6.5, type: 'machining' },
      { seq: 20, name: 'Spool grinding', wc: 'GRIND-01', setup: 20, run: 3.2, type: 'machining' },
      { seq: 30, name: 'Assembly', wc: 'ASSY-04', setup: 10, run: 5.5, type: 'assembly' },
      { seq: 40, name: 'Pressure test', wc: 'TEST-04', setup: 5, run: 4.0, type: 'qa' },
    ],
  },
  {
    id: 'RTG-CHN-CV', item: 'CHN-CV-32', itemName: 'Chain Conveyor 32m', version: 'v3.0', status: 'draft', updated: '2025-04-20',
    operations: [
      { seq: 10, name: 'Frame fabrication', wc: 'WELD-01', setup: 60, run: 240.0, type: 'machining' },
      { seq: 20, name: 'Motor mount', wc: 'ASSY-05', setup: 20, run: 45.0, type: 'assembly' },
      { seq: 30, name: 'Chain install', wc: 'ASSY-05', setup: 15, run: 80.0, type: 'assembly' },
      { seq: 40, name: 'Commission test', wc: 'TEST-05', setup: 30, run: 60.0, type: 'qa' },
    ],
  },
];

const opTypeColor: Record<Operation['type'], string> = {
  machining: 'bg-info/10 text-info border-info/40',
  assembly: 'bg-primary/10 text-primary border-primary/40',
  qa: 'bg-warning/10 text-warning border-warning/40',
  finish: 'bg-success/10 text-success border-success/40',
};

export default function RoutingsPage() {
  const [search, setSearch] = React.useState('');
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set(['RTG-GBX-450']));

  const filtered = routings.filter((r) =>
    !search || r.id.toLowerCase().includes(search.toLowerCase()) || r.itemName.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Routings"
        description="Manufacturing routings · operation sequences with work centers and times."
        breadcrumbs={[
          { label: 'Manufacturing', href: '/app/manufacturing' },
          { label: 'Routings' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New routing</Button>
          </>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search routings by ID, item or name..." className="pl-8 max-w-md" />
            </div>
            <Button variant="outline" size="sm"><Settings className="size-4" /> Filters</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filtered.map((r) => {
          const isOpen = expanded.has(r.id);
          const totalSetup = r.operations.reduce((s, o) => s + o.setup, 0);
          const totalRun = r.operations.reduce((s, o) => s + o.run, 0);
          return (
            <Card key={r.id}>
              <button
                onClick={() => toggle(r.id)}
                className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-primary">{r.id}</span>
                    <Badge variant="outline" size="sm">{r.version}</Badge>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="mt-0.5 text-sm">{r.itemName} <span className="text-xs text-muted-foreground">· {r.item}</span></div>
                </div>
                <div className="hidden gap-6 text-right text-sm sm:flex">
                  <div>
                    <div className="font-mono font-semibold tabular-nums">{r.operations.length}</div>
                    <div className="text-2xs uppercase text-muted-foreground">Operations</div>
                  </div>
                  <div>
                    <div className="font-mono font-semibold tabular-nums">{totalSetup}m</div>
                    <div className="text-2xs uppercase text-muted-foreground">Setup</div>
                  </div>
                  <div>
                    <div className="font-mono font-semibold tabular-nums">{totalRun.toFixed(1)}m</div>
                    <div className="text-2xs uppercase text-muted-foreground">Run / ea</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{r.updated}</div>
                    <div className="text-2xs uppercase text-muted-foreground">Updated</div>
                  </div>
                </div>
              </button>

              {isOpen && (
                <CardContent className="border-t border-border p-0">
                  <div className="relative px-6 py-6">
                    <div className="absolute left-9 top-12 bottom-12 w-px bg-border" />
                    {r.operations.map((op) => (
                      <div key={op.seq} className="relative flex items-start gap-4 py-3">
                        <div className={cn('z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 font-mono text-xs font-bold', opTypeColor[op.type])}>
                          {op.seq}
                        </div>
                        <div className="flex-1 rounded-lg border border-border bg-card p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-medium">{op.name}</div>
                              <div className="mt-1 flex items-center gap-2">
                                <Badge variant="outline" size="sm" className="font-mono"><Factory className="size-3" /> {op.wc}</Badge>
                                <Badge size="sm" className={cn('border capitalize', opTypeColor[op.type])}>{op.type}</Badge>
                              </div>
                            </div>
                            <div className="flex gap-6 text-right text-sm">
                              <div>
                                <div className="font-mono tabular-nums">{op.setup}m</div>
                                <div className="text-2xs uppercase text-muted-foreground">Setup</div>
                              </div>
                              <div>
                                <div className="font-mono tabular-nums">{op.run.toFixed(1)}m</div>
                                <div className="text-2xs uppercase text-muted-foreground">Run / ea</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
