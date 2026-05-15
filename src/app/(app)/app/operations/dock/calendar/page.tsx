'use client';

import * as React from 'react';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ApptKind = 'inbound' | 'outbound';
interface Appt {
  id: string;
  kind: ApptKind;
  dock: string;
  time: string;
  duration: number;
  carrier: string;
  reference: string;
  status: 'scheduled' | 'arrived' | 'in_progress' | 'completed';
}

const docks = ['Dock 1', 'Dock 2', 'Dock 3', 'Dock 4', 'Dock 5', 'Dock 6'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 11 }, (_, i) => i + 7);

const appointments: Appt[] = [
  { id: 'A1', kind: 'inbound', dock: 'Dock 1', time: '08:00', duration: 90, carrier: 'FedEx Freight', reference: 'PO-9214', status: 'completed' },
  { id: 'A2', kind: 'outbound', dock: 'Dock 1', time: '10:30', duration: 60, carrier: 'XPO Logistics', reference: 'SO-1248', status: 'in_progress' },
  { id: 'A3', kind: 'inbound', dock: 'Dock 2', time: '07:30', duration: 120, carrier: 'Old Dominion', reference: 'PO-9201', status: 'completed' },
  { id: 'A4', kind: 'outbound', dock: 'Dock 2', time: '13:00', duration: 90, carrier: 'Saia', reference: 'SO-1250', status: 'scheduled' },
  { id: 'A5', kind: 'inbound', dock: 'Dock 3', time: '09:00', duration: 60, carrier: 'YRC Freight', reference: 'PO-9217', status: 'arrived' },
  { id: 'A6', kind: 'outbound', dock: 'Dock 3', time: '14:30', duration: 60, carrier: 'XPO Logistics', reference: 'SO-1252', status: 'scheduled' },
  { id: 'A7', kind: 'inbound', dock: 'Dock 4', time: '11:00', duration: 60, carrier: 'UPS Freight', reference: 'PO-9220', status: 'scheduled' },
  { id: 'A8', kind: 'outbound', dock: 'Dock 4', time: '15:00', duration: 90, carrier: 'Estes Express', reference: 'SO-1255', status: 'scheduled' },
  { id: 'A9', kind: 'inbound', dock: 'Dock 5', time: '08:30', duration: 60, carrier: 'R+L Carriers', reference: 'PO-9224', status: 'completed' },
  { id: 'A10', kind: 'outbound', dock: 'Dock 5', time: '12:00', duration: 60, carrier: 'XPO Logistics', reference: 'SO-1258', status: 'in_progress' },
  { id: 'A11', kind: 'inbound', dock: 'Dock 6', time: '07:00', duration: 90, carrier: 'Saia', reference: 'PO-9226', status: 'completed' },
  { id: 'A12', kind: 'outbound', dock: 'Dock 6', time: '13:30', duration: 120, carrier: 'Old Dominion', reference: 'SO-1260', status: 'scheduled' },
];

function timeToMinutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

const dayStart = 7 * 60;
const slotHeight = 56;
const minutesPerSlot = 60;

export default function DockCalendarPage() {
  const [view, setView] = React.useState<'inbound' | 'outbound' | 'all'>('all');
  const filtered = view === 'all' ? appointments : appointments.filter((a) => a.kind === view);

  const stats = [
    { label: 'Today', value: appointments.length, sub: 'appointments' },
    { label: 'Inbound', value: appointments.filter((a) => a.kind === 'inbound').length, sub: 'arrivals' },
    { label: 'Outbound', value: appointments.filter((a) => a.kind === 'outbound').length, sub: 'departures' },
    { label: 'In progress', value: appointments.filter((a) => a.status === 'in_progress' || a.status === 'arrived').length, sub: 'active' },
  ];

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Dock calendar"
        description="Wed, May 15, 2026 - Reno Distribution Center"
        breadcrumbs={[{ label: 'Operations', href: '/app/operations' }, { label: 'Dock scheduling', href: '/app/operations/dock' }, { label: 'Calendar' }]}
        actions={
          <>
            <Button variant="outline" size="sm"><Filter className="size-4" /> Filter</Button>
            <Button size="sm"><Plus className="size-4" /> New appointment</Button>
          </>
        }
      />

      <div className="space-y-4 p-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-2xl font-semibold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-4 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon-sm"><ChevronLeft className="size-4" /></Button>
                <Button variant="outline" size="sm">Today</Button>
                <Button variant="outline" size="icon-sm"><ChevronRight className="size-4" /></Button>
                <p className="ml-2 text-sm font-medium">Wed, May 15 2026</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative"><Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search ref..." className="h-8 w-48 pl-8" /></div>
                <div className="flex rounded-md border p-0.5">
                  {(['all', 'inbound', 'outbound'] as const).map((v) => (
                    <button key={v} onClick={() => setView(v)} className={cn('rounded px-3 py-1 text-xs font-medium transition-colors capitalize', view === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent')}>{v}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><span className="size-3 rounded bg-info" /> Inbound</div>
              <div className="flex items-center gap-1.5"><span className="size-3 rounded bg-warning" /> Outbound</div>
              <div className="flex items-center gap-1.5"><span className="size-3 rounded border-2 border-success bg-success/20" /> Completed</div>
              <div className="flex items-center gap-1.5"><span className="size-3 rounded border-2 border-primary bg-primary/20" /> In progress</div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                <div className="grid border-b" style={{ gridTemplateColumns: `60px repeat(${docks.length}, 1fr)` }}>
                  <div className="px-2 py-2 text-xs font-medium text-muted-foreground">Time</div>
                  {docks.map((d) => (
                    <div key={d} className="border-l px-2 py-2 text-center text-xs font-medium">{d}</div>
                  ))}
                </div>
                <div className="relative grid" style={{ gridTemplateColumns: `60px repeat(${docks.length}, 1fr)` }}>
                  <div className="flex flex-col">
                    {hours.map((h) => (<div key={h} className="border-b" style={{ height: slotHeight }}><span className="-mt-2 inline-block px-2 text-2xs text-muted-foreground">{String(h).padStart(2, '0')}:00</span></div>))}
                  </div>
                  {docks.map((dock) => (
                    <div key={dock} className="relative border-l">
                      {hours.map((h) => (<div key={h} className="border-b" style={{ height: slotHeight }} />))}
                      {filtered.filter((a) => a.dock === dock).map((a) => {
                        const top = ((timeToMinutes(a.time) - dayStart) / minutesPerSlot) * slotHeight;
                        const height = (a.duration / minutesPerSlot) * slotHeight - 2;
                        const Icon = a.kind === 'inbound' ? ArrowDownToLine : ArrowUpFromLine;
                        return (
                          <button key={a.id} className={cn('absolute left-0.5 right-0.5 rounded-md border-l-2 p-1.5 text-left text-2xs transition-shadow hover:shadow-md', a.kind === 'inbound' ? 'bg-info/10 border-info' : 'bg-warning/10 border-warning', a.status === 'completed' && 'opacity-60', a.status === 'in_progress' && 'ring-2 ring-primary')} style={{ top, height }}>
                            <div className="flex items-center gap-1"><Icon className={cn('size-3', a.kind === 'inbound' ? 'text-info' : 'text-warning')} /><span className="font-mono">{a.reference}</span></div>
                            <p className="truncate text-2xs text-muted-foreground">{a.carrier}</p>
                            <p className="text-2xs text-muted-foreground">{a.time}</p>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
