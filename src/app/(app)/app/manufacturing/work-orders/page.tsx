'use client';

import * as React from 'react';
import Link from 'next/link';
import { Download, Filter, Hammer, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { initials, formatNumber, formatDate } from '@/lib/utils';

type WoStatus = 'planned' | 'released' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';

const workOrders: Array<{
  number: string;
  item: string;
  desc: string;
  qty: number;
  done: number;
  start: string;
  end: string;
  status: WoStatus;
  owner: string;
  priority: 'low' | 'med' | 'high' | 'urgent';
  routing: string;
}> = [
  { number: 'WO-24891', item: 'GBX-450-A', desc: 'Gearbox housing alloy', qty: 240, done: 156, start: '2026-05-15', end: '2026-05-17', status: 'in_progress', owner: 'Carlos M.', priority: 'high', routing: 'RTG-GBX-450' },
  { number: 'WO-24890', item: 'BRK-220-S', desc: 'Brake caliper steel', qty: 480, done: 412, start: '2026-05-14', end: '2026-05-16', status: 'in_progress', owner: 'Aisha N.', priority: 'med', routing: 'RTG-BRK-220' },
  { number: 'WO-24889', item: 'VLV-104-B', desc: 'Hydraulic valve', qty: 120, done: 120, start: '2026-05-13', end: '2026-05-15', status: 'completed', owner: 'Devon T.', priority: 'med', routing: 'RTG-VLV-104' },
  { number: 'WO-24888', item: 'PMP-310-X', desc: 'Centrifugal pump assy', qty: 60, done: 22, start: '2026-05-12', end: '2026-05-19', status: 'in_progress', owner: 'Priya K.', priority: 'urgent', routing: 'RTG-PMP-310' },
  { number: 'WO-24887', item: 'SHF-660-C', desc: 'Drive shaft machined', qty: 800, done: 0, start: '2026-05-15', end: '2026-05-22', status: 'released', owner: 'Liam R.', priority: 'med', routing: 'RTG-SHF-660' },
  { number: 'WO-24886', item: 'MTR-2.2KW', desc: '2.2kW induction motor', qty: 24, done: 18, start: '2026-05-14', end: '2026-05-18', status: 'on_hold', owner: 'Sofia D.', priority: 'high', routing: 'RTG-MTR-22K' },
  { number: 'WO-24885', item: 'CTL-PCBA-200', desc: 'Control PCBA 200V', qty: 320, done: 280, start: '2026-05-10', end: '2026-05-14', status: 'in_progress', owner: 'Maya J.', priority: 'high', routing: 'RTG-PCBA-200' },
  { number: 'WO-24884', item: 'CHN-CV-32', desc: 'Chain conveyor 32m', qty: 4, done: 4, start: '2026-05-05', end: '2026-05-12', status: 'completed', owner: 'Carlos M.', priority: 'med', routing: 'RTG-CHN-CV' },
  { number: 'WO-24883', item: 'LMP-LED-IND', desc: 'LED industrial lamp', qty: 1200, done: 0, start: '2026-05-18', end: '2026-05-21', status: 'planned', owner: 'Aisha N.', priority: 'low', routing: 'RTG-LMP-LED' },
  { number: 'WO-24882', item: 'HVA-CMP-15', desc: 'HVAC compressor 15kW', qty: 18, done: 0, start: '2026-05-20', end: '2026-05-27', status: 'planned', owner: 'Priya K.', priority: 'urgent', routing: 'RTG-HVA-CMP' },
  { number: 'WO-24881', item: 'SNS-TMP-PT100', desc: 'Temperature sensor PT100', qty: 2400, done: 1850, start: '2026-05-11', end: '2026-05-16', status: 'in_progress', owner: 'Devon T.', priority: 'low', routing: 'RTG-SNS-TMP' },
  { number: 'WO-24880', item: 'FRM-XL-180', desc: 'Equipment frame XL', qty: 12, done: 0, start: '2026-05-14', end: '2026-05-18', status: 'cancelled', owner: 'Liam R.', priority: 'med', routing: 'RTG-FRM-XL' },
];

const priorityVariant: Record<string, 'default' | 'secondary' | 'warning' | 'destructive'> = {
  low: 'secondary',
  med: 'default',
  high: 'warning',
  urgent: 'destructive',
};

const statusGroups: { status: WoStatus; label: string; tone: string }[] = [
  { status: 'planned', label: 'Planned', tone: 'bg-muted text-muted-foreground' },
  { status: 'released', label: 'Released', tone: 'bg-info/10 text-info' },
  { status: 'in_progress', label: 'In progress', tone: 'bg-primary/10 text-primary' },
  { status: 'on_hold', label: 'On hold', tone: 'bg-warning/10 text-warning' },
  { status: 'completed', label: 'Completed', tone: 'bg-success/10 text-success' },
];

export default function WorkOrdersPage() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [priority, setPriority] = React.useState('all');

  const filtered = workOrders.filter((w) => {
    const matchSearch = !search || w.number.toLowerCase().includes(search.toLowerCase()) || w.item.toLowerCase().includes(search.toLowerCase()) || w.desc.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || w.status === statusFilter;
    const matchPrio = priority === 'all' || w.priority === priority;
    return matchSearch && matchStatus && matchPrio;
  });

  const counts: Record<string, number> = workOrders.reduce((acc, w) => {
    acc[w.status] = (acc[w.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Work Orders"
        description="Production orders from planning through execution and closure."
        breadcrumbs={[
          { label: 'Manufacturing', href: '/app/manufacturing' },
          { label: 'Work Orders' },
        ]}
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" /> Export
            </Button>
            <Button>
              <Plus className="size-4" /> New work order
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {statusGroups.map((g) => (
          <button
            key={g.status}
            onClick={() => setStatusFilter(statusFilter === g.status ? 'all' : g.status)}
            className={`rounded-lg border p-3 text-left transition-colors hover:border-foreground/30 ${statusFilter === g.status ? 'border-foreground/40 ring-1 ring-ring' : 'border-border'}`}
          >
            <div className={`mb-2 inline-flex h-7 items-center rounded-md px-2 text-xs font-medium ${g.tone}`}>
              {g.label}
            </div>
            <div className="text-2xl font-bold tabular-nums">{counts[g.status] || 0}</div>
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by WO number, item, or description..." className="pl-8" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                {statusGroups.map((g) => (<SelectItem key={g.status} value={g.status}>{g.label}</SelectItem>))}
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="med">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="size-4" /> More filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Item</th>
                <th className="text-right">Qty</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Progress</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => {
                const pct = Math.round((w.done / w.qty) * 100);
                return (
                  <tr key={w.number}>
                    <td>
                      <Link href={`/app/manufacturing/work-orders/${w.number}`} className="font-mono text-xs font-medium text-primary hover:underline">
                        {w.number}
                      </Link>
                    </td>
                    <td>
                      <div className="font-mono text-xs">{w.item}</div>
                      <div className="text-xs text-muted-foreground">{w.desc}</div>
                    </td>
                    <td className="text-right font-mono">{formatNumber(w.qty)}</td>
                    <td className="text-xs text-muted-foreground">{formatDate(w.start)}</td>
                    <td className="text-xs text-muted-foreground">{formatDate(w.end)}</td>
                    <td><StatusBadge status={w.status} /></td>
                    <td><Badge variant={priorityVariant[w.priority]} size="sm" className="capitalize">{w.priority}</Badge></td>
                    <td className="w-44">
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-1.5 w-24" />
                        <span className="text-xs tabular-nums text-muted-foreground">{pct}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar size="xs"><AvatarFallback>{initials(w.owner)}</AvatarFallback></Avatar>
                        <span className="text-xs">{w.owner}</span>
                      </div>
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
