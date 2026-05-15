'use client';

import * as React from 'react';
import Link from 'next/link';
import { Download, FileText, Filter, GitBranch, Layers, Plus, Search } from 'lucide-react';
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
import { formatCurrency, formatNumber } from '@/lib/utils';

const boms = [
  { id: 'BOM-GBX-450-A-v3', item: 'GBX-450-A', name: 'Gearbox Housing 450 Series', version: 'v3.2', status: 'active' as const, comps: 18, cost: 124.50, type: 'Manufacturing', updated: '2025-04-12', owner: 'Eng. Dept' },
  { id: 'BOM-PMP-310-X-v2', item: 'PMP-310-X', name: 'Centrifugal Pump Assembly', version: 'v2.1', status: 'active' as const, comps: 42, cost: 384.20, type: 'Manufacturing', updated: '2025-04-05', owner: 'Eng. Dept' },
  { id: 'BOM-MTR-2.2KW-v4', item: 'MTR-2.2KW', name: '2.2kW Induction Motor', version: 'v4.0', status: 'active' as const, comps: 27, cost: 218.75, type: 'Manufacturing', updated: '2025-03-28', owner: 'M. Stark' },
  { id: 'BOM-BRK-220-S-v1', item: 'BRK-220-S', name: 'Brake Caliper Steel 220mm', version: 'v1.4', status: 'active' as const, comps: 11, cost: 56.40, type: 'Manufacturing', updated: '2025-03-22', owner: 'Eng. Dept' },
  { id: 'BOM-VLV-104-B-v2', item: 'VLV-104-B', name: 'Hydraulic Valve 104B', version: 'v2.3', status: 'active' as const, comps: 14, cost: 88.90, type: 'Manufacturing', updated: '2025-03-15', owner: 'R. Patel' },
  { id: 'BOM-SHF-660-C-v1', item: 'SHF-660-C', name: 'Drive Shaft 660mm', version: 'v1.0', status: 'draft' as const, comps: 6, cost: 41.20, type: 'Manufacturing', updated: '2025-04-18', owner: 'M. Stark' },
  { id: 'BOM-CTL-PCBA-v5', item: 'CTL-PCBA-200', name: 'Control PCBA 200V', version: 'v5.1', status: 'active' as const, comps: 58, cost: 167.30, type: 'Electronics', updated: '2025-04-10', owner: 'Eng. Dept' },
  { id: 'BOM-FRM-XL-v2', item: 'FRM-XL-180', name: 'Equipment Frame XL', version: 'v2.0', status: 'active' as const, comps: 9, cost: 240.00, type: 'Fabrication', updated: '2025-02-28', owner: 'Eng. Dept' },
  { id: 'BOM-HVA-CMP-v1', item: 'HVA-CMP-15', name: 'HVAC Compressor 15kW', version: 'v1.2', status: 'in_progress' as const, comps: 32, cost: 412.80, type: 'Manufacturing', updated: '2025-04-20', owner: 'A. Reyes' },
  { id: 'BOM-CHN-CV-v3', item: 'CHN-CV-32', name: 'Chain Conveyor 32m', version: 'v3.0', status: 'active' as const, comps: 23, cost: 1240.50, type: 'Manufacturing', updated: '2025-03-05', owner: 'Eng. Dept' },
  { id: 'BOM-LMP-LED-v6', item: 'LMP-LED-IND', name: 'LED Industrial Lamp', version: 'v6.2', status: 'active' as const, comps: 15, cost: 22.40, type: 'Electronics', updated: '2025-04-08', owner: 'R. Patel' },
  { id: 'BOM-SNS-TMP-v2', item: 'SNS-TMP-PT100', name: 'Temperature Sensor PT100', version: 'v2.1', status: 'on_hold' as const, comps: 8, cost: 18.90, type: 'Electronics', updated: '2025-04-15', owner: 'A. Reyes' },
];

export default function BomListPage() {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [type, setType] = React.useState('all');

  const filtered = boms.filter((b) => {
    const matchSearch = !search || b.id.toLowerCase().includes(search.toLowerCase()) || b.name.toLowerCase().includes(search.toLowerCase()) || b.item.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'all' || b.status === status;
    const matchType = type === 'all' || b.type === type;
    return matchSearch && matchStatus && matchType;
  });

  const totalCost = filtered.reduce((sum, b) => sum + b.cost, 0);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Bills of Materials"
        description="Engineering and manufacturing BOMs with revisions and cost roll-up."
        breadcrumbs={[
          { label: 'Manufacturing', href: '/app/manufacturing' },
          { label: 'BOMs' },
        ]}
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" /> Export
            </Button>
            <Button asChild>
              <Link href="/app/manufacturing/bom/new">
                <Plus className="size-4" /> New BOM
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total BOMs</div>
              <div className="text-xl font-semibold">{boms.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <FileText className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Active</div>
              <div className="text-xl font-semibold">{boms.filter((b) => b.status === 'active').length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <GitBranch className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">In revision</div>
              <div className="text-xl font-semibold">{boms.filter((b) => b.status === 'draft' || b.status === 'in_progress').length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
              <Layers className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Avg cost</div>
              <div className="text-xl font-semibold">{formatCurrency(totalCost / Math.max(filtered.length, 1))}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search BOMs by ID, name or item..." className="pl-8" />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="on_hold">On hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Fabrication">Fabrication</SelectItem>
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
                <th>BOM</th>
                <th>Item</th>
                <th>Version</th>
                <th>Status</th>
                <th>Type</th>
                <th className="text-right">Components</th>
                <th className="text-right">Total cost</th>
                <th>Owner</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td>
                    <Link href={`/app/manufacturing/bom/${b.id}`} className="font-mono text-xs font-medium text-primary hover:underline">
                      {b.id}
                    </Link>
                    <div className="text-xs text-muted-foreground">{b.name}</div>
                  </td>
                  <td><span className="font-mono text-xs">{b.item}</span></td>
                  <td><Badge variant="outline" size="sm">{b.version}</Badge></td>
                  <td><StatusBadge status={b.status} /></td>
                  <td className="text-xs text-muted-foreground">{b.type}</td>
                  <td className="text-right font-mono">{formatNumber(b.comps)}</td>
                  <td className="text-right font-mono">{formatCurrency(b.cost)}</td>
                  <td className="text-xs">{b.owner}</td>
                  <td className="text-xs text-muted-foreground">{b.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
