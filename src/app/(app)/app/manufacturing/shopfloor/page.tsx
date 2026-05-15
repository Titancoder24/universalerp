'use client';

import * as React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cog,
  Factory,
  LogIn,
  LogOut,
  Package,
  Pause,
  Play,
  Power,
  Settings,
  Siren,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, initials, formatNumber } from '@/lib/utils';

const operator = { name: 'Carlos Mendez', badge: 'B-04829', shift: 'Day · 06:00-14:00', clockedIn: true, since: '06:02' };

const assignedWO = [
  { wo: 'WO-24891', part: 'GBX-450-A', op: 'Op 30 · Gear assembly', remaining: 84, total: 240, machine: 'ASSY-03', priority: 'high' as const, eta: '4:20 PM' },
  { wo: 'WO-24890', part: 'BRK-220-S', op: 'Op 20 · Press & form', remaining: 68, total: 480, machine: 'PRESS-01', priority: 'med' as const, eta: '2:45 PM' },
  { wo: 'WO-24887', part: 'SHF-660-C', op: 'Op 10 · Lathe machining', remaining: 800, total: 800, machine: 'LATHE-01', priority: 'med' as const, eta: 'Tomorrow' },
];

const machines = [
  { id: 'CNC-01', name: 'Mazak VTC-300', state: 'running', util: 92, wo: 'WO-24881' },
  { id: 'CNC-02', name: 'Haas VF-2SS', state: 'running', util: 87, wo: 'WO-24885' },
  { id: 'CNC-03', name: 'Mazak QT-200', state: 'idle', util: 0, wo: null },
  { id: 'CNC-04', name: 'DMG Mori NLX', state: 'running', util: 94, wo: 'WO-24891' },
  { id: 'CNC-05', name: 'Okuma LB3000', state: 'setup', util: 0, wo: 'WO-24883' },
  { id: 'CNC-06', name: 'Doosan Puma', state: 'running', util: 78, wo: 'WO-24884' },
  { id: 'CNC-07', name: 'Hardinge Bridgeport', state: 'fault', util: 0, wo: null },
  { id: 'ASSY-01', name: 'Conveyor Cell A1', state: 'running', util: 82, wo: 'WO-24886' },
  { id: 'ASSY-02', name: 'Robotic Arm K2', state: 'running', util: 88, wo: 'WO-24884' },
  { id: 'ASSY-03', name: 'Manual Cell C3', state: 'running', util: 71, wo: 'WO-24891' },
  { id: 'LATHE-01', name: 'Mori Seiki NL', state: 'idle', util: 0, wo: null },
  { id: 'PRESS-01', name: 'Schuler 250T', state: 'running', util: 90, wo: 'WO-24890' },
];

const stateMeta: Record<string, { color: string; label: string }> = {
  running: { color: 'bg-success/15 border-success text-success', label: 'Running' },
  idle: { color: 'bg-muted border-border text-muted-foreground', label: 'Idle' },
  setup: { color: 'bg-warning/15 border-warning text-warning', label: 'Setup' },
  fault: { color: 'bg-destructive/15 border-destructive text-destructive', label: 'Fault' },
};

export default function ShopFloorPage() {
  const [clockedIn, setClockedIn] = React.useState(operator.clockedIn);
  const [activeWO, setActiveWO] = React.useState<string | null>(assignedWO[0].wo);
  const [andonOpen, setAndonOpen] = React.useState(false);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Shop Floor Terminal"
        description="Touch-optimized operator workstation"
        breadcrumbs={[{ label: 'Manufacturing', href: '/app/manufacturing' }, { label: 'Shop floor' }]}
      />

      <Card className="border-foreground/20">
        <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row">
          <Avatar size="lg" className="size-16">
            <AvatarFallback className="text-xl">{initials(operator.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <div className="text-2xl font-bold">{operator.name}</div>
            <div className="mt-1 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge variant="outline" size="sm" className="font-mono">{operator.badge}</Badge>
              <Badge variant="soft" size="sm">{operator.shift}</Badge>
              {clockedIn && (
                <Badge variant="success" size="sm" className="gap-1">
                  <CheckCircle2 className="size-3" /> Clocked in since {operator.since}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Current time</div>
              <div className="font-mono text-2xl font-bold tabular-nums">14:32</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <button
          onClick={() => setClockedIn(true)}
          disabled={clockedIn}
          className="group relative h-32 overflow-hidden rounded-xl border-2 border-success/40 bg-success/5 transition-all hover:bg-success/10 active:scale-95 disabled:opacity-50"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <LogIn className="size-10 text-success" />
            <div className="text-lg font-bold text-success">Clock On</div>
          </div>
        </button>

        <button className="group relative h-32 overflow-hidden rounded-xl border-2 border-primary/40 bg-primary/5 transition-all hover:bg-primary/10 active:scale-95">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Package className="size-10 text-primary" />
            <div className="text-lg font-bold text-primary">Report Production</div>
          </div>
        </button>

        <button
          onClick={() => setAndonOpen(true)}
          className={cn(
            'group relative h-32 overflow-hidden rounded-xl border-2 transition-all active:scale-95',
            andonOpen
              ? 'animate-pulse border-destructive bg-destructive/20'
              : 'border-destructive/40 bg-destructive/5 hover:bg-destructive/10',
          )}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Siren className="size-10 text-destructive" />
            <div className="text-lg font-bold text-destructive">Andon</div>
            {andonOpen && <div className="text-2xs uppercase tracking-wide text-destructive">Active · supervisor notified</div>}
          </div>
        </button>

        <button
          onClick={() => setClockedIn(false)}
          disabled={!clockedIn}
          className="group relative h-32 overflow-hidden rounded-xl border-2 border-warning/40 bg-warning/5 transition-all hover:bg-warning/10 active:scale-95 disabled:opacity-50"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <LogOut className="size-10 text-warning" />
            <div className="text-lg font-bold text-warning">Clock Off</div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Work Orders</CardTitle>
            <CardDescription>Tap a card to set active</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignedWO.map((w) => {
              const isActive = activeWO === w.wo;
              const pct = Math.round(((w.total - w.remaining) / w.total) * 100);
              return (
                <button
                  key={w.wo}
                  onClick={() => setActiveWO(w.wo)}
                  className={cn(
                    'w-full rounded-xl border-2 p-4 text-left transition-all active:scale-[0.99]',
                    isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/30',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-sm font-bold">{w.wo}</div>
                      <div className="mt-0.5 font-medium">{w.part}</div>
                      <div className="text-sm text-muted-foreground">{w.op}</div>
                    </div>
                    <div className="text-right">
                      {w.priority === 'high' && <Badge variant="warning" size="sm">High</Badge>}
                      {w.priority === 'med' && <Badge variant="outline" size="sm">Medium</Badge>}
                      <div className="mt-2 text-xs text-muted-foreground">ETA {w.eta}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <Progress value={pct} className="h-2 flex-1" />
                    <span className="font-mono text-sm font-semibold tabular-nums">{w.total - w.remaining}/{w.total}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="soft" size="sm" className="font-mono">{w.machine}</Badge>
                    {isActive && (
                      <div className="flex items-center gap-1 text-xs font-medium text-primary">
                        <Play className="size-3" /> Active
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <button className="rounded-xl border border-border p-4 text-center transition-colors hover:bg-accent">
              <Pause className="mx-auto size-8 text-warning" />
              <div className="mt-2 text-sm font-medium">Pause Job</div>
            </button>
            <button className="rounded-xl border border-border p-4 text-center transition-colors hover:bg-accent">
              <Wrench className="mx-auto size-8 text-info" />
              <div className="mt-2 text-sm font-medium">Setup Time</div>
            </button>
            <button className="rounded-xl border border-border p-4 text-center transition-colors hover:bg-accent">
              <AlertTriangle className="mx-auto size-8 text-destructive" />
              <div className="mt-2 text-sm font-medium">Report Scrap</div>
            </button>
            <button className="rounded-xl border border-border p-4 text-center transition-colors hover:bg-accent">
              <CheckCircle2 className="mx-auto size-8 text-success" />
              <div className="mt-2 text-sm font-medium">QA Check</div>
            </button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Machine Status</CardTitle>
          <CardDescription>All machines on Plant 1 floor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {machines.map((m) => {
              const meta = stateMeta[m.state];
              return (
                <div key={m.id} className={cn('rounded-lg border p-3 transition-colors', meta.color)}>
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-xs font-bold">{m.id}</div>
                    <Factory className="size-4 opacity-60" />
                  </div>
                  <div className="mt-0.5 truncate text-2xs opacity-80">{m.name}</div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold tabular-nums">{m.util}</span>
                    <span className="text-xs opacity-70">%</span>
                  </div>
                  <div className="mt-1 text-2xs uppercase tracking-wide opacity-70">
                    {meta.label}{m.wo ? ` · ${m.wo}` : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
