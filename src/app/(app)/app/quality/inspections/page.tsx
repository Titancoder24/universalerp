'use client';

import * as React from 'react';
import Link from 'next/link';
import { Download, Filter, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { initials } from '@/lib/utils';

const inspections = [
  { id: 'INS-8821', type: 'Incoming', item: 'HSG-CAST-450', lot: 'L-24881', source: 'Acme Castings PO-19821', qty: 200, date: '2026-05-15 13:45', inspector: 'P. Krishnan', status: 'pending' as const, result: '—' },
  { id: 'INS-8820', type: 'In-Process', item: 'GBX-450-A', lot: 'WO-24891', source: 'Op 30 - first off', qty: 1, date: '2026-05-15 12:18', inspector: 'A. Nasser', status: 'passed' as const, result: '32/32 OK' },
  { id: 'INS-8819', type: 'Final', item: 'PMP-310-X', lot: 'WO-24888', source: 'End of line', qty: 8, date: '2026-05-15 11:02', inspector: 'D. Thompson', status: 'passed' as const, result: '8/8 OK' },
  { id: 'INS-8818', type: 'Incoming', item: 'GEAR-IN-22T', lot: 'L-24878', source: 'PrecisionCNC PO-19815', qty: 480, date: '2026-05-15 09:48', inspector: 'S. Davies', status: 'failed' as const, result: '12 rejected' },
  { id: 'INS-8817', type: 'Periodic', item: 'CTL-PCBA-200', lot: 'STK-PCBA-200-B12', source: 'Stock audit', qty: 40, date: '2026-05-15 09:15', inspector: 'M. Jensen', status: 'passed' as const, result: '40/40 OK' },
  { id: 'INS-8816', type: 'In-Process', item: 'BRK-220-S', lot: 'WO-24890', source: 'Op 20 - patrol', qty: 5, date: '2026-05-15 08:32', inspector: 'A. Nasser', status: 'passed' as const, result: '5/5 OK' },
  { id: 'INS-8815', type: 'Final', item: 'VLV-104-B', lot: 'WO-24889', source: 'Hydro test', qty: 120, date: '2026-05-14 16:48', inspector: 'D. Thompson', status: 'passed' as const, result: '120/120 OK' },
  { id: 'INS-8814', type: 'Incoming', item: 'BRG-6204-2RS', lot: 'L-24875', source: 'SKF PO-19808', qty: 1000, date: '2026-05-14 15:22', inspector: 'P. Krishnan', status: 'passed' as const, result: '1000/1000 OK' },
  { id: 'INS-8813', type: 'In-Process', item: 'SHF-660-C', lot: 'WO-24887', source: 'Setup approval', qty: 1, date: '2026-05-14 14:18', inspector: 'L. Rodriguez', status: 'failed' as const, result: 'Tolerance fail' },
  { id: 'INS-8812', type: 'Periodic', item: 'STK-MISC', lot: 'AUDIT-2026-04', source: 'Monthly stock', qty: 240, date: '2026-05-14 11:45', inspector: 'M. Jensen', status: 'passed' as const, result: '237/240 OK' },
  { id: 'INS-8811', type: 'Final', item: 'MTR-2.2KW', lot: 'WO-24886', source: 'Run-in test', qty: 18, date: '2026-05-14 10:20', inspector: 'S. Davies', status: 'failed' as const, result: '2 rejected' },
  { id: 'INS-8810', type: 'Incoming', item: 'AL-6061-T6', lot: 'L-24872', source: 'MetalCorp PO-19801', qty: 400, date: '2026-05-14 08:45', inspector: 'P. Krishnan', status: 'passed' as const, result: '400/400 OK' },
];

const typeVariant: Record<string, 'info' | 'warning' | 'soft' | 'default' | 'secondary'> = {
  'Incoming': 'info',
  'In-Process': 'warning',
  'Final': 'soft',
  'Periodic': 'secondary',
};

export default function InspectionsPage() {
  const [search, setSearch] = React.useState('');
  const [type, setType] = React.useState('all');
  const [status, setStatus] = React.useState('all');

  const filtered = inspections.filter((i) => {
    const matchSearch = !search || i.id.toLowerCase().includes(search.toLowerCase()) || i.item.toLowerCase().includes(search.toLowerCase()) || i.lot.toLowerCase().includes(search.toLowerCase());
    const matchType = type === 'all' || i.type === type;
    const matchStatus = status === 'all' || i.status === status;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Inspections"
        description="Incoming, in-process, final and periodic inspection records."
        breadcrumbs={[
          { label: 'Quality', href: '/app/quality' },
          { label: 'Inspections' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New inspection</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Total today</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{inspections.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Passed</div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-success">{inspections.filter((i) => i.status === 'passed').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Failed</div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-destructive">{inspections.filter((i) => i.status === 'failed').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Pending</div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-warning">{inspections.filter((i) => i.status === 'pending').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by ID, item, or lot..." className="pl-8" />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Incoming">Incoming</SelectItem>
                <SelectItem value="In-Process">In-process</SelectItem>
                <SelectItem value="Final">Final</SelectItem>
                <SelectItem value="Periodic">Periodic</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm"><Filter className="size-4" /> More</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Inspection</th>
                <th>Type</th>
                <th>Item</th>
                <th>Lot / WO</th>
                <th>Source</th>
                <th className="text-right">Qty</th>
                <th>Date / time</th>
                <th>Inspector</th>
                <th>Status</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id}>
                  <td>
                    <Link href={`/app/quality/inspections/${i.id}`} className="font-mono text-xs font-medium text-primary hover:underline">
                      {i.id}
                    </Link>
                  </td>
                  <td><Badge variant={typeVariant[i.type]} size="sm">{i.type}</Badge></td>
                  <td className="font-mono text-xs">{i.item}</td>
                  <td className="font-mono text-xs text-muted-foreground">{i.lot}</td>
                  <td className="text-xs text-muted-foreground">{i.source}</td>
                  <td className="text-right font-mono">{i.qty}</td>
                  <td className="text-xs text-muted-foreground">{i.date}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Avatar size="xs"><AvatarFallback>{initials(i.inspector)}</AvatarFallback></Avatar>
                      <span className="text-xs">{i.inspector}</span>
                    </div>
                  </td>
                  <td><StatusBadge status={i.status} /></td>
                  <td className="text-xs">{i.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
