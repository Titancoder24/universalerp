'use client';

import * as React from 'react';
import { Download, Filter, MapPin, Plus, Search } from 'lucide-react';
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

const assets = [
  { id: 'CNC-04', name: 'DMG Mori NLX 2500', category: 'CNC Machine', location: 'Plant 1 - Bay A', status: 'active' as const, criticality: 'A', nextPM: '2026-05-15', custodian: 'C. Mendez', value: 420000, install: '2021-03-15' },
  { id: 'CNC-01', name: 'Mazak VTC-300C', category: 'CNC Machine', location: 'Plant 1 - Bay A', status: 'active' as const, criticality: 'A', nextPM: '2026-06-08', custodian: 'A. Nasser', value: 380000, install: '2020-11-22' },
  { id: 'CNC-02', name: 'Haas VF-2SS', category: 'CNC Machine', location: 'Plant 1 - Bay A', status: 'active' as const, criticality: 'B', nextPM: '2026-05-28', custodian: 'D. Thompson', value: 165000, install: '2022-08-05' },
  { id: 'CNC-07', name: 'Hardinge Bridgeport', category: 'CNC Machine', location: 'Plant 1 - Bay B', status: 'inactive' as const, criticality: 'B', nextPM: '2026-05-17', custodian: 'L. Rodriguez', value: 88000, install: '2018-04-10' },
  { id: 'PRESS-01', name: 'Schuler 250T Press', category: 'Press', location: 'Plant 1 - Bay C', status: 'active' as const, criticality: 'A', nextPM: '2026-05-16', custodian: 'A. Reyes', value: 540000, install: '2019-10-30' },
  { id: 'CMM-001', name: 'Zeiss Contura G2', category: 'Measurement', location: 'CMM Room', status: 'active' as const, criticality: 'A', nextPM: '2026-05-19', custodian: 'M. Jensen', value: 218000, install: '2021-07-12' },
  { id: 'ASSY-01', name: 'Conveyor Cell A1', category: 'Assembly', location: 'Plant 1 - Assembly', status: 'active' as const, criticality: 'B', nextPM: '2026-06-22', custodian: 'P. Krishnan', value: 142000, install: '2020-05-18' },
  { id: 'ASSY-02', name: 'KUKA Robotic Arm K2', category: 'Robotics', location: 'Plant 1 - Assembly', status: 'active' as const, criticality: 'A', nextPM: '2026-06-15', custodian: 'S. Davies', value: 285000, install: '2022-02-08' },
  { id: 'HVAC-A1', name: 'Bay A AHU - Carrier 40HQ', category: 'HVAC', location: 'Plant 1 - Roof', status: 'active' as const, criticality: 'B', nextPM: '2026-05-12', custodian: 'M. Stark', value: 64000, install: '2017-09-25' },
  { id: 'FORK-08', name: 'Toyota 8FBC25 forklift', category: 'Material Handling', location: 'WH-Chicago', status: 'active' as const, criticality: 'C', nextPM: '2026-05-20', custodian: 'Yard Team', value: 32000, install: '2020-06-15' },
  { id: 'FORK-03', name: 'Hyster 50CT forklift', category: 'Material Handling', location: 'WH-Dallas', status: 'active' as const, criticality: 'C', nextPM: '2026-06-30', custodian: 'Yard Team', value: 28000, install: '2019-01-20' },
  { id: 'TRUCK-12', name: 'Volvo VNL Tractor', category: 'Vehicle', location: 'Yard', status: 'active' as const, criticality: 'C', nextPM: '2026-06-08', custodian: 'Fleet Mgr', value: 145000, install: '2023-04-12' },
  { id: 'LATHE-01', name: 'Mori Seiki NL2500', category: 'CNC Machine', location: 'Plant 1 - Bay B', status: 'active' as const, criticality: 'B', nextPM: '2026-07-04', custodian: 'L. Rodriguez', value: 198000, install: '2020-12-10' },
  { id: 'CNC-03', name: 'Mazak QT-200', category: 'CNC Machine', location: 'Plant 1 - Bay A', status: 'active' as const, criticality: 'B', nextPM: '2026-06-18', custodian: 'C. Mendez', value: 145000, install: '2019-08-30' },
  { id: 'CNC-05', name: 'Okuma LB3000-EX', category: 'CNC Machine', location: 'Plant 1 - Bay A', status: 'active' as const, criticality: 'B', nextPM: '2026-06-25', custodian: 'A. Nasser', value: 240000, install: '2021-11-05' },
  { id: 'CNC-06', name: 'Doosan Puma 2600Y', category: 'CNC Machine', location: 'Plant 1 - Bay A', status: 'active' as const, criticality: 'B', nextPM: '2026-07-10', custodian: 'D. Thompson', value: 285000, install: '2022-05-20' },
];

const critVariant: Record<string, 'destructive' | 'warning' | 'secondary' | 'soft'> = {
  A: 'destructive', B: 'warning', C: 'secondary', D: 'soft',
};

function pmStatus(date: string): { label: string; color: string } {
  const today = new Date('2026-05-15');
  const due = new Date(date);
  const days = Math.floor((due.getTime() - today.getTime()) / 86400000);
  if (days < 0) return { label: `Overdue ${Math.abs(days)}d`, color: 'text-destructive font-semibold' };
  if (days <= 7) return { label: `Due in ${days}d`, color: 'text-warning font-semibold' };
  return { label: formatDate(date), color: 'text-muted-foreground' };
}

export default function AssetsListPage() {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [criticality, setCriticality] = React.useState('all');
  const [status, setStatus] = React.useState('all');

  const filtered = assets.filter((a) => {
    const matchSearch = !search || a.id.toLowerCase().includes(search.toLowerCase()) || a.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || a.category === category;
    const matchCrit = criticality === 'all' || a.criticality === criticality;
    const matchStatus = status === 'all' || a.status === status;
    return matchSearch && matchCat && matchCrit && matchStatus;
  });

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Assets"
        description="Complete asset register · machines, equipment, vehicles and infrastructure."
        breadcrumbs={[
          { label: 'Assets', href: '/app/assets' },
          { label: 'Asset list' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New asset</Button>
          </>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assets by code or name..." className="pl-8" />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {['CNC Machine','Press','Measurement','Assembly','Robotics','HVAC','Material Handling','Vehicle'].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={criticality} onValueChange={setCriticality}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Criticality" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All criticalities</SelectItem>
                <SelectItem value="A">A - Critical</SelectItem>
                <SelectItem value="B">B - High</SelectItem>
                <SelectItem value="C">C - Medium</SelectItem>
                <SelectItem value="D">D - Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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
                <th>Code</th>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Criticality</th>
                <th>Next PM</th>
                <th>Custodian</th>
                <th className="text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const pm = pmStatus(a.nextPM);
                return (
                  <tr key={a.id}>
                    <td className="font-mono text-xs font-medium text-primary">{a.id}</td>
                    <td>
                      <div className="font-medium">{a.name}</div>
                      <div className="text-2xs text-muted-foreground">Installed {formatDate(a.install)}</div>
                    </td>
                    <td className="text-xs">{a.category}</td>
                    <td>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" /> {a.location}
                      </div>
                    </td>
                    <td><StatusBadge status={a.status} /></td>
                    <td><Badge variant={critVariant[a.criticality]} size="sm">{a.criticality}</Badge></td>
                    <td className={`text-xs ${pm.color}`}>{pm.label}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {a.custodian === 'Yard Team' || a.custodian === 'Fleet Mgr' ? (
                          <span className="text-xs">{a.custodian}</span>
                        ) : (
                          <>
                            <Avatar size="xs"><AvatarFallback>{initials(a.custodian)}</AvatarFallback></Avatar>
                            <span className="text-xs">{a.custodian}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="text-right font-mono">{formatCurrency(a.value)}</td>
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
