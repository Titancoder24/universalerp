'use client';

import * as React from 'react';
import { Download, MessageSquareWarning, Plus, Search } from 'lucide-react';
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

const complaints: Array<{
  id: string;
  customer: string;
  date: string;
  product: string;
  category: 'Defect' | 'Performance' | 'Delivery' | 'Documentation' | 'Other';
  description: string;
  severity: Severity;
  costImpact: number;
  status: 'open' | 'in_progress' | 'pending' | 'closed';
  resolution?: string;
  owner: string;
  ncr?: string;
}> = [
  { id: 'CPL-2401', customer: 'Acme Industries', date: '2026-05-14', product: 'PMP-310-X', category: 'Performance', description: 'Pump vibration > 4.5mm/s at full load, after 200 hrs operation', severity: 'critical', costImpact: 18500, status: 'in_progress', owner: 'A. Reyes', ncr: 'NCR-1135' },
  { id: 'CPL-2400', customer: 'TechCorp Solutions', date: '2026-05-12', product: 'CHN-CV-32', category: 'Performance', description: 'Chain misalignment 8mm after 240h operation', severity: 'major', costImpact: 6200, status: 'closed', resolution: 'Installation procedure updated. Free service visit completed.', owner: 'M. Stark', ncr: 'NCR-1134' },
  { id: 'CPL-2399', customer: 'Global Manufacturing', date: '2026-05-11', product: 'GBX-450-A', category: 'Defect', description: 'Oil leak from output shaft seal within 48 hrs of install', severity: 'major', costImpact: 4200, status: 'in_progress', owner: 'D. Thompson' },
  { id: 'CPL-2398', customer: 'StartupCo', date: '2026-05-10', product: 'MTR-2.2KW', category: 'Defect', description: 'Motor failed insulation test after 30 days storage', severity: 'major', costImpact: 1850, status: 'pending', owner: 'S. Davies' },
  { id: 'CPL-2397', customer: 'Enterprise Ltd', date: '2026-05-08', product: 'CTL-PCBA-200', category: 'Performance', description: 'Intermittent reset on units in high-temp environment', severity: 'critical', costImpact: 22000, status: 'in_progress', owner: 'M. Jensen' },
  { id: 'CPL-2396', customer: 'Acme Industries', date: '2026-05-07', product: 'BRK-220-S', category: 'Defect', description: 'Surface corrosion on 24/120 calipers received', severity: 'minor', costImpact: 720, status: 'closed', resolution: 'Replacement units shipped. Plating thickness CAPA opened.', owner: 'R. Chen' },
  { id: 'CPL-2395', customer: 'Eastern Distribution', date: '2026-05-05', product: 'VLV-104-B', category: 'Documentation', description: 'Spec sheet missing temperature rating for cold ops', severity: 'minor', costImpact: 0, status: 'closed', resolution: 'Updated data sheet published, customer notified.', owner: 'A. Reyes' },
  { id: 'CPL-2394', customer: 'Western Logistics', date: '2026-05-03', product: 'HVA-CMP-15', category: 'Delivery', description: 'Wrong voltage variant shipped (480V vs 380V)', severity: 'major', costImpact: 3400, status: 'closed', resolution: 'Correct units rushed. Order picking SOP updated.', owner: 'R. Chen' },
  { id: 'CPL-2393', customer: 'NorthCo Industries', date: '2026-05-02', product: 'LMP-LED-IND', category: 'Defect', description: '12 of 240 units DOA from shipment', severity: 'minor', costImpact: 268, status: 'closed', resolution: 'Replacement units issued under warranty.', owner: 'S. Lee' },
  { id: 'CPL-2392', customer: 'Pacific Manufacturing', date: '2026-04-29', product: 'SHF-660-C', category: 'Defect', description: 'Shaft surface finish coarser than spec (Ra 3.2 vs 1.6)', severity: 'major', costImpact: 1640, status: 'closed', resolution: 'Lot recalled. Grinding parameters adjusted.', owner: 'L. Rodriguez' },
  { id: 'CPL-2391', customer: 'Continental Auto Parts', date: '2026-04-28', product: 'GBX-450-A', category: 'Performance', description: 'Excessive noise at 1800 RPM (>72dB)', severity: 'major', costImpact: 5200, status: 'closed', resolution: 'Helical gear set revision v3.2 issued.', owner: 'M. Stark' },
  { id: 'CPL-2390', customer: 'Marine Systems Inc', date: '2026-04-25', product: 'PMP-310-X', category: 'Other', description: 'Request for marine-grade variant', severity: 'minor', costImpact: 0, status: 'closed', resolution: 'Forwarded to NPD. PMP-310-XM in roadmap.', owner: 'S. Lee' },
];

const sevVariant: Record<Severity, 'destructive' | 'warning' | 'secondary'> = {
  critical: 'destructive', major: 'warning', minor: 'secondary',
};

const categoryVariant: Record<string, 'destructive' | 'warning' | 'info' | 'soft' | 'secondary'> = {
  Defect: 'destructive', Performance: 'warning', Delivery: 'info', Documentation: 'soft', Other: 'secondary',
};

export default function ComplaintsPage() {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [severity, setSeverity] = React.useState('all');

  const filtered = complaints.filter((c) => {
    const matchSearch = !search || c.id.toLowerCase().includes(search.toLowerCase()) || c.customer.toLowerCase().includes(search.toLowerCase()) || c.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'all' || c.status === status;
    const matchSev = severity === 'all' || c.severity === severity;
    return matchSearch && matchStatus && matchSev;
  });

  const stats = {
    open: complaints.filter((c) => c.status !== 'closed').length,
    critical: complaints.filter((c) => c.severity === 'critical').length,
    closedThisMonth: complaints.filter((c) => c.status === 'closed').length,
    cost: complaints.reduce((s, c) => s + c.costImpact, 0),
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Customer Complaints"
        description="External quality complaints with severity, resolution and cost impact tracking."
        breadcrumbs={[
          { label: 'Quality', href: '/app/quality' },
          { label: 'Complaints' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> Log complaint</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <MessageSquareWarning className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Open</div>
              <div className="text-xl font-semibold tabular-nums">{stats.open}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Critical</div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-destructive">{stats.critical}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Closed this month</div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-success">{stats.closedThisMonth}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Cost of poor quality</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{formatCurrency(stats.cost)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search complaints..." className="pl-8" />
            </div>
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
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Severity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
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
                <th>Complaint</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Product</th>
                <th>Category</th>
                <th>Description / Resolution</th>
                <th>Severity</th>
                <th className="text-right">Cost</th>
                <th>Owner</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span className="font-mono text-xs text-primary">{c.id}</span>
                    {c.ncr && <div className="text-2xs text-muted-foreground">→ {c.ncr}</div>}
                  </td>
                  <td className="font-medium">{c.customer}</td>
                  <td className="text-xs text-muted-foreground">{formatDate(c.date)}</td>
                  <td className="font-mono text-xs">{c.product}</td>
                  <td><Badge variant={categoryVariant[c.category]} size="sm">{c.category}</Badge></td>
                  <td className="max-w-md">
                    <div className="text-sm">{c.description}</div>
                    {c.resolution && <div className="mt-0.5 text-xs text-success">→ {c.resolution}</div>}
                  </td>
                  <td><Badge variant={sevVariant[c.severity]} size="sm" className="capitalize">{c.severity}</Badge></td>
                  <td className="text-right font-mono">{c.costImpact ? formatCurrency(c.costImpact) : '—'}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Avatar size="xs"><AvatarFallback>{initials(c.owner)}</AvatarFallback></Avatar>
                      <span className="text-xs">{c.owner}</span>
                    </div>
                  </td>
                  <td><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
