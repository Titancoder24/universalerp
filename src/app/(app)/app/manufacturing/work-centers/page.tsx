'use client';

import * as React from 'react';
import { Activity, AlertCircle, CheckCircle2, Filter, MoreHorizontal, Pause, Plus, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const workCenters = [
  { id: 'WC-101', name: 'CNC Line 1 (Mazak VTC-300)', branch: 'Plant A', oee: 87.4, status: 'running', currentJob: 'WO-2089', operator: 'Liu Wei', shiftTarget: 240, shiftActual: 198, downtime: 12 },
  { id: 'WC-102', name: 'CNC Line 2 (DMG Mori NLX)', branch: 'Plant A', oee: 91.2, status: 'running', currentJob: 'WO-2091', operator: 'Marcus Rodriguez', shiftTarget: 200, shiftActual: 187, downtime: 8 },
  { id: 'WC-103', name: 'Press Brake (Schuler 250T)', branch: 'Plant A', oee: 79.8, status: 'setup', currentJob: 'WO-2095', operator: 'Jake Thompson', shiftTarget: 180, shiftActual: 145, downtime: 32 },
  { id: 'WC-201', name: 'Welding Station 1', branch: 'Plant B', oee: 92.5, status: 'running', currentJob: 'WO-2098', operator: 'Diego Santos', shiftTarget: 100, shiftActual: 95, downtime: 4 },
  { id: 'WC-202', name: 'Welding Station 2', branch: 'Plant B', oee: 88.2, status: 'running', currentJob: 'WO-2099', operator: 'Yuki Tanaka', shiftTarget: 100, shiftActual: 88, downtime: 7 },
  { id: 'WC-301', name: 'Paint Booth A', branch: 'Plant B', oee: 65.3, status: 'breakdown', currentJob: null, operator: null, shiftTarget: 80, shiftActual: 42, downtime: 45 },
  { id: 'WC-302', name: 'Paint Booth B', branch: 'Plant B', oee: 84.7, status: 'idle', currentJob: null, operator: 'Sarah Chen', shiftTarget: 80, shiftActual: 0, downtime: 0 },
  { id: 'WC-401', name: 'Assembly Line', branch: 'Plant C', oee: 89.6, status: 'running', currentJob: 'WO-2102', operator: 'Aisha Patel', shiftTarget: 320, shiftActual: 287, downtime: 18 },
  { id: 'WC-501', name: 'Test Station 1 (Zeiss Contura)', branch: 'Plant C', oee: 95.2, status: 'running', currentJob: 'WO-2104', operator: 'Emma Williams', shiftTarget: 60, shiftActual: 57, downtime: 2 },
  { id: 'WC-502', name: 'Test Station 2', branch: 'Plant C', oee: 86.1, status: 'maintenance', currentJob: null, operator: null, shiftTarget: 60, shiftActual: 0, downtime: 480 },
];

const statusConfig = {
  running: { icon: Activity, color: 'bg-success/10 text-success', label: 'Running' },
  setup: { icon: Wrench, color: 'bg-warning/10 text-warning', label: 'Setup' },
  idle: { icon: Pause, color: 'bg-muted text-muted-foreground', label: 'Idle' },
  breakdown: { icon: AlertCircle, color: 'bg-destructive/10 text-destructive', label: 'Breakdown' },
  maintenance: { icon: Wrench, color: 'bg-info/10 text-info', label: 'Maintenance' },
};

export default function WorkCentersPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Work Centers"
        description="Real-time status of every machine and station across all plants."
        actions={
          <>
            <Button variant="outline"><Filter className="size-4" /> Filter</Button>
            <Button><Plus className="size-4" /> Add work center</Button>
          </>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = workCenters.filter((wc) => wc.status === status).length;
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className={cn('grid h-8 w-8 place-items-center rounded-lg', config.color)}>
                    <config.icon className="size-4" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold">{count}</div>
                    <div className="text-xs text-muted-foreground">{config.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Live grid */}
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {workCenters.map((wc) => {
          const status = statusConfig[wc.status as keyof typeof statusConfig];
          return (
            <Card key={wc.id} className={wc.status === 'breakdown' ? 'border-destructive/40 bg-destructive/5' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-2xs text-muted-foreground">{wc.id}</span>
                      <Badge className={status.color}>
                        <status.icon className="size-2.5" />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="font-medium text-sm">{wc.name}</div>
                    <div className="text-2xs text-muted-foreground">{wc.branch}</div>
                  </div>
                  <Button variant="ghost" size="icon-xs"><MoreHorizontal className="size-3" /></Button>
                </div>

                {/* Current job */}
                {wc.currentJob && (
                  <div className="mb-3 rounded-md bg-muted/30 p-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Running:</span>
                      <span className="font-mono font-medium text-primary">{wc.currentJob}</span>
                    </div>
                    {wc.operator && (
                      <div className="mt-0.5 text-2xs text-muted-foreground">Operator: {wc.operator}</div>
                    )}
                  </div>
                )}

                {/* OEE */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">OEE</span>
                    <span className={cn(
                      'font-semibold',
                      wc.oee >= 85 ? 'text-success' : wc.oee >= 70 ? 'text-warning' : 'text-destructive',
                    )}>
                      {wc.oee.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={wc.oee} className="mt-1" />
                </div>

                {/* Shift progress */}
                <div className="mb-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Shift output</span>
                    <span className="font-medium">{wc.shiftActual} / {wc.shiftTarget}</span>
                  </div>
                  <Progress value={(wc.shiftActual / wc.shiftTarget) * 100} className="mt-1" />
                </div>

                {wc.downtime > 0 && (
                  <div className="mt-2 text-2xs text-muted-foreground">
                    Downtime: {wc.downtime} min
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
