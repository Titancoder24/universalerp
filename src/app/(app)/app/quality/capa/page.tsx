'use client';

import * as React from 'react';
import { AlertCircle, Download, Plus, Search } from 'lucide-react';
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
import { formatDate, initials } from '@/lib/utils';

type CapaStatus = 'open' | 'verifying' | 'closed' | 'pending';

const capas: Array<{
  id: string;
  title: string;
  ncr: string;
  type: 'Corrective' | 'Preventive';
  rootCause: string;
  action: string;
  owner: string;
  due: string;
  status: CapaStatus;
  progress: number;
  effectiveness?: number;
  overdue?: boolean;
}> = [
  { id: 'CAPA-0421', title: 'Tool wear monitoring for Φ22 boring', ncr: 'NCR-1142', type: 'Corrective', rootCause: 'Boring tool exceeded wear life by 18%', action: 'Install in-process tool monitor on CNC-04. Update PM SOP to inspect every 200 units.', owner: 'P. Krishnan', due: '2026-05-28', status: 'open', progress: 25 },
  { id: 'CAPA-0420', title: 'O-ring damage during VLV-104 assembly', ncr: 'NCR-1139', type: 'Corrective', rootCause: 'Sharp edge on housing causing seal nicks during install', action: 'Add chamfer to housing 0.5x45°. Update assembly tooling.', owner: 'D. Thompson', due: '2026-05-22', status: 'verifying', progress: 80, effectiveness: 90 },
  { id: 'CAPA-0419', title: 'PrecisionCNC heat treat verification', ncr: 'NCR-1137', type: 'Corrective', rootCause: 'Supplier under-cycled heat treatment process', action: 'Require certified hardness report on each lot. Quarantine 100% of next 3 lots.', owner: 'P. Krishnan', due: '2026-05-25', status: 'open', progress: 40, overdue: false },
  { id: 'CAPA-0418', title: 'Impeller balancing process upgrade', ncr: 'NCR-1135', type: 'Corrective', rootCause: 'Balance grade G2.5 insufficient for high-speed pumps', action: 'Upgrade to G1.0 grade. Recalibrate balancing machine. Train 3 operators.', owner: 'A. Reyes', due: '2026-05-12', status: 'open', progress: 60, overdue: true },
  { id: 'CAPA-0417', title: 'PCBA solder profile optimization', ncr: 'NCR-1140', type: 'Corrective', rootCause: 'Reflow oven cold zone 8°C low', action: 'Recalibrate Zone 4 of reflow oven. Verify profile against IPC-A-610.', owner: 'M. Jensen', due: '2026-05-20', status: 'verifying', progress: 75, effectiveness: 95 },
  { id: 'CAPA-0416', title: 'Predictive analytics for chuck slipping', ncr: 'NCR-1131', type: 'Preventive', rootCause: 'Hydraulic chuck pressure degraded over 30 days', action: 'Deploy IoT sensor + ML model for chuck pressure trending. Auto-alert at 90% threshold.', owner: 'L. Rodriguez', due: '2026-06-15', status: 'open', progress: 35 },
  { id: 'CAPA-0415', title: 'Vendor scorecard for plating quality', ncr: 'NCR-1133', type: 'Preventive', rootCause: 'No formal vendor SQE program', action: 'Establish quarterly audits + plating thickness measurement at receiving.', owner: 'R. Chen', due: '2026-05-30', status: 'open', progress: 50 },
  { id: 'CAPA-0414', title: 'Casting porosity sand testing', ncr: 'NCR-1136', type: 'Corrective', rootCause: 'Acme Castings sand moisture exceeded 4%', action: 'Supplier to install sand moisture meter. Provide monthly trend reports.', owner: 'R. Chen', due: '2026-04-28', status: 'closed', progress: 100, effectiveness: 92 },
  { id: 'CAPA-0413', title: 'Customer chain alignment instructions', ncr: 'NCR-1134', type: 'Corrective', rootCause: 'Installation manual lacked chain tensioning specs', action: 'Update manual rev 2. Add tensioning tool + video. Train 8 customer techs.', owner: 'M. Stark', due: '2026-05-15', status: 'closed', progress: 100, effectiveness: 88 },
  { id: 'CAPA-0412', title: 'Seal dimension SPC implementation', ncr: 'NCR-1132', type: 'Preventive', rootCause: 'No SPC on seal supplier process', action: 'Require Cpk > 1.33 for ID dimension. Monthly cpk reporting.', owner: 'A. Nasser', due: '2026-05-10', status: 'closed', progress: 100, effectiveness: 100 },
  { id: 'CAPA-0411', title: 'Surface inspection training', ncr: 'NCR-1141', type: 'Preventive', rootCause: 'Inconsistent visual inspection criteria', action: 'Build photo standards. Train 12 inspectors. Test annually.', owner: 'A. Nasser', due: '2026-06-01', status: 'open', progress: 20 },
  { id: 'CAPA-0410', title: 'Motor IR testing automation', ncr: 'NCR-1138', type: 'Preventive', rootCause: 'Manual IR test sometimes skipped', action: 'Implement auto-IR fixture at end-of-line.', owner: 'S. Davies', due: '2026-06-20', status: 'pending', progress: 5 },
];

const typeVariant: Record<string, 'warning' | 'info'> = {
  Corrective: 'warning', Preventive: 'info',
};

export default function CapaPage() {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [type, setType] = React.useState('all');

  const filtered = capas.filter((c) => {
    const matchSearch = !search || c.id.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'all' || c.status === status;
    const matchType = type === 'all' || c.type === type;
    return matchSearch && matchStatus && matchType;
  });

  const stats = {
    open: capas.filter((c) => c.status === 'open' || c.status === 'pending').length,
    verifying: capas.filter((c) => c.status === 'verifying').length,
    closed: capas.filter((c) => c.status === 'closed').length,
    overdue: capas.filter((c) => c.overdue).length,
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="CAPA"
        description="Corrective and Preventive Actions · root cause investigation and verified resolution."
        breadcrumbs={[
          { label: 'Quality', href: '/app/quality' },
          { label: 'CAPA' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New CAPA</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Open</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Verifying</div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-info">{stats.verifying}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Closed (30d)</div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-success">{stats.closed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="size-5 text-destructive" />
            <div>
              <div className="text-xs text-muted-foreground">Overdue</div>
              <div className="text-2xl font-bold tabular-nums text-destructive">{stats.overdue}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search CAPAs..." className="pl-8" />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="verifying">Verifying</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Corrective">Corrective</SelectItem>
                <SelectItem value="Preventive">Preventive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filtered.map((c) => (
          <Card key={c.id} className={c.overdue ? 'border-destructive/40' : ''}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-primary">{c.id}</span>
                    <Badge variant={typeVariant[c.type]} size="sm">{c.type}</Badge>
                    <StatusBadge status={c.status} />
                    {c.overdue && <Badge variant="destructive" size="sm">Overdue</Badge>}
                    {c.ncr && <Badge variant="outline" size="sm" className="font-mono">{c.ncr}</Badge>}
                  </div>
                  <div className="mt-1.5 text-base font-medium">{c.title}</div>
                  <div className="mt-1 grid grid-cols-1 gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                    <div><span className="font-medium text-foreground">Root cause:</span> {c.rootCause}</div>
                    <div><span className="font-medium text-foreground">Action:</span> {c.action}</div>
                  </div>
                </div>
                <div className="sm:w-64 sm:flex-shrink-0 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-mono font-semibold">{c.progress}%</span>
                  </div>
                  <Progress
                    value={c.progress}
                    className="h-1.5"
                    indicatorClassName={c.status === 'closed' ? 'bg-success' : c.overdue ? 'bg-destructive' : 'bg-primary'}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Due</span>
                    <span className={`font-medium ${c.overdue ? 'text-destructive' : ''}`}>{formatDate(c.due)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Owner</span>
                    <div className="flex items-center gap-1.5">
                      <Avatar size="xs"><AvatarFallback>{initials(c.owner)}</AvatarFallback></Avatar>
                      <span className="text-xs">{c.owner}</span>
                    </div>
                  </div>
                  {c.effectiveness !== undefined && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Effectiveness</span>
                      <span className="font-mono font-semibold text-success">{c.effectiveness}%</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
