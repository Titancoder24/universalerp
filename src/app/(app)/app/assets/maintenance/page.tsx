'use client';

import * as React from 'react';
import { Activity, Calendar, Clock, Cog, Download, Plus, Search, Wrench } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { formatDate, initials } from '@/lib/utils';

type WoType = 'Preventive' | 'Corrective' | 'Predictive';

const orders: Array<{
  id: string;
  asset: string;
  assetName: string;
  type: WoType;
  description: string;
  scheduled: string;
  priority: 'low' | 'med' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'completed' | 'on_hold';
  technician: string;
  duration: number;
}> = [
  { id: 'MWO-2891', asset: 'CNC-07', assetName: 'Hardinge Bridgeport', type: 'Corrective', description: 'Spindle overheat - investigate bearing & coolant flow', scheduled: '2026-05-15', priority: 'urgent', status: 'in_progress', technician: 'R. Patel', duration: 240 },
  { id: 'MWO-2890', asset: 'CNC-04', assetName: 'DMG Mori NLX', type: 'Preventive', description: '500hr lubrication service - way oil + spindle', scheduled: '2026-05-15', priority: 'med', status: 'in_progress', technician: 'J. Kim', duration: 90 },
  { id: 'MWO-2889', asset: 'HVAC-A1', assetName: 'Bay A AHU', type: 'Preventive', description: 'Monthly filter replacement', scheduled: '2026-05-16', priority: 'low', status: 'open', technician: 'F. Garcia', duration: 60 },
  { id: 'MWO-2888', asset: 'PRESS-01', assetName: 'Schuler 250T', type: 'Predictive', description: 'Hydraulic pump bearing - vibration trend rising', scheduled: '2026-05-17', priority: 'med', status: 'open', technician: 'R. Patel', duration: 180 },
  { id: 'MWO-2887', asset: 'FORK-03', assetName: 'Hyster 50CT', type: 'Corrective', description: 'Lift cylinder seal leak', scheduled: '2026-05-12', priority: 'high', status: 'completed', technician: 'F. Garcia', duration: 145 },
  { id: 'MWO-2886', asset: 'CMM-001', assetName: 'Zeiss Contura', type: 'Preventive', description: 'Bi-annual calibration check', scheduled: '2026-05-19', priority: 'high', status: 'open', technician: 'J. Kim', duration: 240 },
  { id: 'MWO-2885', asset: 'ASSY-02', assetName: 'KUKA Robotic Arm K2', type: 'Predictive', description: 'Joint 3 backlash trending - re-tension', scheduled: '2026-05-20', priority: 'med', status: 'open', technician: 'R. Patel', duration: 120 },
  { id: 'MWO-2884', asset: 'CNC-01', assetName: 'Mazak VTC-300', type: 'Corrective', description: 'Tool changer carousel jamming', scheduled: '2026-05-14', priority: 'high', status: 'completed', technician: 'R. Patel', duration: 95 },
  { id: 'MWO-2883', asset: 'TRUCK-12', assetName: 'Volvo VNL Tractor', type: 'Preventive', description: 'Quarterly inspection + brake check', scheduled: '2026-05-08', priority: 'med', status: 'completed', technician: 'Fleet Vendor', duration: 210 },
  { id: 'MWO-2882', asset: 'FORK-08', assetName: 'Toyota 8FBC25', type: 'Preventive', description: '250hr service', scheduled: '2026-05-20', priority: 'low', status: 'open', technician: 'F. Garcia', duration: 75 },
  { id: 'MWO-2881', asset: 'LATHE-01', assetName: 'Mori Seiki NL2500', type: 'Corrective', description: 'Coolant pump pressure low', scheduled: '2026-05-13', priority: 'high', status: 'on_hold', technician: 'J. Kim', duration: 0 },
  { id: 'MWO-2880', asset: 'CNC-05', assetName: 'Okuma LB3000', type: 'Preventive', description: 'Quarterly lubrication + axis check', scheduled: '2026-05-22', priority: 'med', status: 'open', technician: 'R. Patel', duration: 120 },
];

const typeVariant: Record<WoType, 'info' | 'destructive' | 'warning'> = {
  Preventive: 'info', Corrective: 'destructive', Predictive: 'warning',
};

const priorityVariant: Record<string, 'default' | 'secondary' | 'warning' | 'destructive'> = {
  low: 'secondary', med: 'default', high: 'warning', urgent: 'destructive',
};

const mtbfTrend = [
  { month: 'Dec', cnc: 286, press: 412, assy: 198 },
  { month: 'Jan', cnc: 312, press: 388, assy: 220 },
  { month: 'Feb', cnc: 298, press: 440, assy: 244 },
  { month: 'Mar', cnc: 340, press: 458, assy: 252 },
  { month: 'Apr', cnc: 358, press: 482, assy: 268 },
  { month: 'May', cnc: 372, press: 495, assy: 278 },
];

export default function MaintenancePage() {
  const [search, setSearch] = React.useState('');
  const [type, setType] = React.useState('all');
  const [status, setStatus] = React.useState('all');

  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.asset.toLowerCase().includes(search.toLowerCase()) || o.description.toLowerCase().includes(search.toLowerCase());
    const matchType = type === 'all' || o.type === type;
    const matchStatus = status === 'all' || o.status === status;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Maintenance"
        description="Preventive, corrective and predictive maintenance work orders with MTBF/MTTR metrics."
        breadcrumbs={[
          { label: 'Assets', href: '/app/assets' },
          { label: 'Maintenance' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New work order</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">MTBF (Mean Time Between Failures)</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">372 <span className="text-base font-normal text-muted-foreground">hrs</span></div>
            <div className="mt-1 text-xs text-success">+4.0% vs last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">MTTR (Mean Time To Repair)</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">2.4 <span className="text-base font-normal text-muted-foreground">hrs</span></div>
            <div className="mt-1 text-xs text-success">-12% vs last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">PM compliance</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">94.2%</div>
            <div className="mt-1 text-xs text-muted-foreground">target: 95%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Open WOs</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{orders.filter((o) => o.status !== 'completed').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>MTBF Trend by Equipment Class</CardTitle>
          <CardDescription>Hours between failures, last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mtbfTrend} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="cnc" fill="hsl(var(--chart-1))" name="CNC" radius={[4, 4, 0, 0]} />
                <Bar dataKey="press" fill="hsl(var(--chart-2))" name="Press" radius={[4, 4, 0, 0]} />
                <Bar dataKey="assy" fill="hsl(var(--chart-3))" name="Assembly" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search maintenance WOs..." className="pl-8" />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Preventive">Preventive</SelectItem>
                <SelectItem value="Corrective">Corrective</SelectItem>
                <SelectItem value="Predictive">Predictive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="on_hold">On hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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
                <th>WO</th>
                <th>Asset</th>
                <th>Description</th>
                <th>Type</th>
                <th>Scheduled</th>
                <th>Priority</th>
                <th>Technician</th>
                <th className="text-right">Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td className="font-mono text-xs font-medium text-primary">{o.id}</td>
                  <td>
                    <div className="font-mono text-xs">{o.asset}</div>
                    <div className="text-2xs text-muted-foreground">{o.assetName}</div>
                  </td>
                  <td className="text-sm max-w-md">{o.description}</td>
                  <td><Badge variant={typeVariant[o.type]} size="sm">{o.type}</Badge></td>
                  <td className="text-xs text-muted-foreground">{formatDate(o.scheduled)}</td>
                  <td><Badge variant={priorityVariant[o.priority]} size="sm" className="capitalize">{o.priority}</Badge></td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {o.technician !== 'Fleet Vendor' ? (
                        <>
                          <Avatar size="xs"><AvatarFallback>{initials(o.technician)}</AvatarFallback></Avatar>
                          <span className="text-xs">{o.technician}</span>
                        </>
                      ) : <span className="text-xs">{o.technician}</span>}
                    </div>
                  </td>
                  <td className="text-right font-mono">{o.duration > 0 ? `${o.duration}m` : '—'}</td>
                  <td><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
