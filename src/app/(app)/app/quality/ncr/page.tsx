'use client';

import * as React from 'react';
import { Download, FileWarning, Filter, Plus, Search } from 'lucide-react';
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
import { formatCurrency, formatDate, initials } from '@/lib/utils';

type Severity = 'critical' | 'major' | 'minor';

const ncrs: Array<{
  id: string;
  date: string;
  part: string;
  partName: string;
  source: 'Internal' | 'Supplier' | 'Customer';
  issue: string;
  severity: Severity;
  qty: number;
  cost: number;
  owner: string;
  status: 'open' | 'in_progress' | 'closed' | 'pending';
  rootCause?: string;
}> = [
  { id: 'NCR-1142', date: '2026-05-14', part: 'GBX-450-A', partName: 'Gearbox housing', source: 'Internal', issue: 'Bore Φ22 oversized by 0.04mm on 8 units', severity: 'major', qty: 8, cost: 996.00, owner: 'P. Krishnan', status: 'open', rootCause: 'Tool wear suspected' },
  { id: 'NCR-1141', date: '2026-05-14', part: 'BRK-220-S', partName: 'Brake caliper', source: 'Internal', issue: 'Surface scratches > 5mm length', severity: 'minor', qty: 32, cost: 180.80, owner: 'A. Nasser', status: 'in_progress' },
  { id: 'NCR-1140', date: '2026-05-13', part: 'CTL-PCBA-200', partName: 'Control PCBA', source: 'Internal', issue: 'Cold solder joint at U3 pin 8', severity: 'critical', qty: 4, cost: 669.20, owner: 'M. Jensen', status: 'open' },
  { id: 'NCR-1139', date: '2026-05-13', part: 'VLV-104-B', partName: 'Hydraulic valve', source: 'Internal', issue: 'Hydro test - seal leak at 150 bar', severity: 'major', qty: 2, cost: 177.80, owner: 'D. Thompson', status: 'in_progress', rootCause: 'O-ring nick during assembly' },
  { id: 'NCR-1138', date: '2026-05-12', part: 'MTR-2.2KW', partName: '2.2kW motor', source: 'Internal', issue: 'Insulation resistance 8MΩ (<10MΩ spec)', severity: 'major', qty: 1, cost: 218.75, owner: 'S. Davies', status: 'pending' },
  { id: 'NCR-1137', date: '2026-05-12', part: 'GEAR-IN-22T', partName: 'Input pinion', source: 'Supplier', issue: 'Hardness 52HRC (60-65 spec)', severity: 'critical', qty: 12, cost: 220.80, owner: 'P. Krishnan', status: 'open', rootCause: 'Heat treat under-cycle - PrecisionCNC' },
  { id: 'NCR-1136', date: '2026-05-11', part: 'HSG-CAST-450', partName: 'Cast housing', source: 'Supplier', issue: 'Porosity defect, 6mm void on flange', severity: 'major', qty: 4, cost: 168.80, owner: 'R. Chen', status: 'closed', rootCause: 'Sand inclusion - corrected' },
  { id: 'NCR-1135', date: '2026-05-10', part: 'PMP-310-X', partName: 'Pump assembly', source: 'Customer', issue: 'Vibration > 4.5mm/s at full load (Acme Industries)', severity: 'critical', qty: 1, cost: 6400.00, owner: 'A. Reyes', status: 'in_progress', rootCause: 'Impeller imbalance' },
  { id: 'NCR-1134', date: '2026-05-09', part: 'CHN-CV-32', partName: 'Conveyor', source: 'Customer', issue: 'Chain misalignment after 240h (TechCorp)', severity: 'major', qty: 1, cost: 2400.00, owner: 'M. Stark', status: 'closed' },
  { id: 'NCR-1133', date: '2026-05-08', part: 'BOLT-M8-25', partName: 'Hex bolt M8x25', source: 'Supplier', issue: 'Plating thickness <5µm (8µm spec)', severity: 'minor', qty: 480, cost: 134.40, owner: 'R. Chen', status: 'closed' },
  { id: 'NCR-1132', date: '2026-05-07', part: 'SEAL-LIP-22-40', partName: 'Lip seal', source: 'Internal', issue: 'Dimensional, ID 22.4 (22.0±0.1)', severity: 'minor', qty: 24, cost: 28.80, owner: 'A. Nasser', status: 'closed' },
  { id: 'NCR-1131', date: '2026-05-06', part: 'SHF-660-C', partName: 'Drive shaft', source: 'Internal', issue: 'Concentricity > 0.05mm on Op 10', severity: 'major', qty: 16, cost: 184.00, owner: 'L. Rodriguez', status: 'closed', rootCause: 'Chuck slipping - PM completed' },
];

const sevVariant: Record<Severity, 'destructive' | 'warning' | 'secondary'> = {
  critical: 'destructive', major: 'warning', minor: 'secondary',
};

const sourceVariant: Record<string, 'info' | 'warning' | 'destructive'> = {
  Internal: 'info', Supplier: 'warning', Customer: 'destructive',
};

export default function NcrPage() {
  const [search, setSearch] = React.useState('');
  const [severity, setSeverity] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const [source, setSource] = React.useState('all');

  const filtered = ncrs.filter((n) => {
    const matchSearch = !search || n.id.toLowerCase().includes(search.toLowerCase()) || n.part.toLowerCase().includes(search.toLowerCase()) || n.issue.toLowerCase().includes(search.toLowerCase());
    const matchSev = severity === 'all' || n.severity === severity;
    const matchStatus = status === 'all' || n.status === status;
    const matchSource = source === 'all' || n.source === source;
    return matchSearch && matchSev && matchStatus && matchSource;
  });

  const totalCost = filtered.reduce((s, n) => s + n.cost, 0);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Non-Conformance Reports"
        description="Track quality issues from detection through containment, root cause and closure."
        breadcrumbs={[
          { label: 'Quality', href: '/app/quality' },
          { label: 'NCRs' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New NCR</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Total NCRs</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{ncrs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Open</div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-destructive">{ncrs.filter((n) => n.status === 'open' || n.status === 'in_progress').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Critical</div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-destructive">{ncrs.filter((n) => n.severity === 'critical').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Cost impact</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{formatCurrency(totalCost)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search NCRs..." className="pl-8" />
            </div>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Severity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                <SelectItem value="Internal">Internal</SelectItem>
                <SelectItem value="Supplier">Supplier</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
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
                <th>NCR</th>
                <th>Date</th>
                <th>Part</th>
                <th>Issue</th>
                <th>Source</th>
                <th>Severity</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Cost</th>
                <th>Owner</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((n) => (
                <tr key={n.id}>
                  <td className="font-mono text-xs text-primary">{n.id}</td>
                  <td className="text-xs text-muted-foreground">{formatDate(n.date)}</td>
                  <td>
                    <div className="font-mono text-xs">{n.part}</div>
                    <div className="text-2xs text-muted-foreground">{n.partName}</div>
                  </td>
                  <td className="text-sm max-w-md">
                    <div>{n.issue}</div>
                    {n.rootCause && <div className="text-xs text-muted-foreground">RC: {n.rootCause}</div>}
                  </td>
                  <td><Badge variant={sourceVariant[n.source]} size="sm">{n.source}</Badge></td>
                  <td><Badge variant={sevVariant[n.severity]} size="sm" className="capitalize">{n.severity}</Badge></td>
                  <td className="text-right font-mono">{n.qty}</td>
                  <td className="text-right font-mono">{formatCurrency(n.cost)}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Avatar size="xs"><AvatarFallback>{initials(n.owner)}</AvatarFallback></Avatar>
                      <span className="text-xs">{n.owner}</span>
                    </div>
                  </td>
                  <td><StatusBadge status={n.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
