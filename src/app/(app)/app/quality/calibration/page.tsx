'use client';

import * as React from 'react';
import { AlertTriangle, Calendar, CheckCircle2, Download, Plus, Search, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate } from '@/lib/utils';

const equipment = [
  { id: 'GAGE-0124', name: 'Mitutoyo digital caliper 0-150mm', category: 'Linear', location: 'QC Lab A', custodian: 'P. Krishnan', lastCal: '2026-03-15', nextDue: '2026-09-15', interval: '6 months', accuracy: '±0.02 mm', cert: 'NIST traceable', status: 'active' as const },
  { id: 'GAGE-0123', name: 'Mahr digital micrometer 25-50mm', category: 'Linear', location: 'QC Lab A', custodian: 'P. Krishnan', lastCal: '2026-04-02', nextDue: '2026-10-02', interval: '6 months', accuracy: '±0.001 mm', cert: 'NIST traceable', status: 'active' as const },
  { id: 'CMM-001', name: 'Zeiss Contura CMM', category: 'CMM', location: 'CMM Room', custodian: 'M. Jensen', lastCal: '2025-11-20', nextDue: '2026-05-20', interval: '6 months', accuracy: '±1.8 µm', cert: 'A2LA accredited', status: 'pending' as const },
  { id: 'PG-0042', name: 'Druck DPI 705 pressure gauge', category: 'Pressure', location: 'Hydro Test Cell', custodian: 'D. Thompson', lastCal: '2025-10-12', nextDue: '2026-04-12', interval: '6 months', accuracy: '±0.04% FS', cert: 'NIST traceable', status: 'overdue' as const },
  { id: 'TG-0018', name: 'Fluke 80PK thermocouple probe', category: 'Temperature', location: 'Heat Treat', custodian: 'L. Rodriguez', lastCal: '2026-02-08', nextDue: '2026-08-08', interval: '6 months', accuracy: '±2 °C', cert: 'NIST traceable', status: 'active' as const },
  { id: 'TQ-0091', name: 'Norbar TS 300 torque wrench', category: 'Torque', location: 'Assembly Line A', custodian: 'A. Nasser', lastCal: '2026-01-25', nextDue: '2026-05-25', interval: '4 months', accuracy: '±3%', cert: 'ISO 6789', status: 'pending' as const },
  { id: 'HG-0007', name: 'Wilson Rockwell hardness tester', category: 'Hardness', location: 'Metallurgy Lab', custodian: 'M. Jensen', lastCal: '2026-03-10', nextDue: '2026-09-10', interval: '6 months', accuracy: '±0.5 HRC', cert: 'A2LA accredited', status: 'active' as const },
  { id: 'BG-0003', name: 'Schenck balancing machine', category: 'Balance', location: 'Balance Cell', custodian: 'A. Reyes', lastCal: '2025-09-30', nextDue: '2026-03-30', interval: '6 months', accuracy: 'G1.0', cert: 'ISO 1940', status: 'overdue' as const },
  { id: 'VM-0014', name: 'PCB IMI vibration meter', category: 'Vibration', location: 'Test Lab', custodian: 'S. Davies', lastCal: '2026-04-18', nextDue: '2026-10-18', interval: '6 months', accuracy: '±5%', cert: 'NIST traceable', status: 'active' as const },
  { id: 'EM-0028', name: 'Fluke 87V multimeter', category: 'Electrical', location: 'Electrical Lab', custodian: 'M. Jensen', lastCal: '2026-02-22', nextDue: '2026-08-22', interval: '6 months', accuracy: '±0.05%', cert: 'NIST traceable', status: 'active' as const },
  { id: 'EM-0029', name: 'Megger MIT525 insulation tester', category: 'Electrical', location: 'Motor Test Cell', custodian: 'S. Davies', lastCal: '2025-12-15', nextDue: '2026-06-15', interval: '6 months', accuracy: '±5%', cert: 'NIST traceable', status: 'active' as const },
  { id: 'GAGE-0145', name: 'Starrett 3989 height gauge 0-300mm', category: 'Linear', location: 'QC Lab B', custodian: 'P. Krishnan', lastCal: '2026-04-10', nextDue: '2026-10-10', interval: '6 months', accuracy: '±0.005 mm', cert: 'NIST traceable', status: 'active' as const },
  { id: 'PG-0043', name: 'Wika pressure transducer 0-400 bar', category: 'Pressure', location: 'Hydro Test Cell', custodian: 'D. Thompson', lastCal: '2026-01-08', nextDue: '2026-07-08', interval: '6 months', accuracy: '±0.25%', cert: 'NIST traceable', status: 'active' as const },
  { id: 'FG-0011', name: 'Optical flatness gauge', category: 'Surface', location: 'QC Lab A', custodian: 'P. Krishnan', lastCal: '2025-11-04', nextDue: '2026-05-04', interval: '6 months', accuracy: 'λ/4 He', cert: 'A2LA accredited', status: 'overdue' as const },
];

function daysUntil(dateStr: string): number {
  const today = new Date('2026-05-15');
  const d = new Date(dateStr);
  return Math.floor((d.getTime() - today.getTime()) / 86400000);
}

export default function CalibrationPage() {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [status, setStatus] = React.useState('all');

  const filtered = equipment.filter((e) => {
    const matchSearch = !search || e.id.toLowerCase().includes(search.toLowerCase()) || e.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || e.category === category;
    const days = daysUntil(e.nextDue);
    let computed: 'active' | 'pending' | 'overdue' = 'active';
    if (days < 0) computed = 'overdue';
    else if (days < 30) computed = 'pending';
    const matchStatus = status === 'all' || computed === status;
    return matchSearch && matchCat && matchStatus;
  });

  const stats = {
    total: equipment.length,
    overdue: equipment.filter((e) => daysUntil(e.nextDue) < 0).length,
    due30: equipment.filter((e) => { const d = daysUntil(e.nextDue); return d >= 0 && d <= 30; }).length,
    active: equipment.filter((e) => daysUntil(e.nextDue) > 30).length,
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Calibration"
        description="Measurement & test equipment calibration tracker with next-due dates."
        breadcrumbs={[
          { label: 'Quality', href: '/app/quality' },
          { label: 'Calibration' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New equipment</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wrench className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total instruments</div>
              <div className="text-xl font-semibold tabular-nums">{stats.total}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">In date</div>
              <div className="text-xl font-semibold tabular-nums text-success">{stats.active}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Calendar className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Due in 30 days</div>
              <div className="text-xl font-semibold tabular-nums text-warning">{stats.due30}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Overdue</div>
              <div className="text-xl font-semibold tabular-nums text-destructive">{stats.overdue}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search equipment..." className="pl-8" />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {['Linear','CMM','Pressure','Temperature','Torque','Hardness','Balance','Vibration','Electrical','Surface'].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">In date</SelectItem>
                <SelectItem value="pending">Due soon</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Instrument</th>
                <th>Category</th>
                <th>Location</th>
                <th>Custodian</th>
                <th>Accuracy</th>
                <th>Last cal.</th>
                <th>Next due</th>
                <th className="text-right">Days</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const days = daysUntil(e.nextDue);
                const computedStatus: 'active' | 'pending' | 'overdue' = days < 0 ? 'overdue' : days < 30 ? 'pending' : 'active';
                return (
                  <tr key={e.id}>
                    <td className="font-mono text-xs text-primary">{e.id}</td>
                    <td>
                      <div className="text-sm font-medium">{e.name}</div>
                      <div className="text-2xs text-muted-foreground">{e.cert}</div>
                    </td>
                    <td><Badge variant="outline" size="sm">{e.category}</Badge></td>
                    <td className="text-xs text-muted-foreground">{e.location}</td>
                    <td className="text-xs">{e.custodian}</td>
                    <td className="font-mono text-xs">{e.accuracy}</td>
                    <td className="text-xs text-muted-foreground">{formatDate(e.lastCal)}</td>
                    <td className="text-xs">{formatDate(e.nextDue)}</td>
                    <td className={`text-right font-mono tabular-nums text-xs ${days < 0 ? 'text-destructive font-semibold' : days < 30 ? 'text-warning font-semibold' : 'text-muted-foreground'}`}>
                      {days < 0 ? `${days}d` : `${days}d`}
                    </td>
                    <td><StatusBadge status={computedStatus} /></td>
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
