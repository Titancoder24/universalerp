'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertCircle,
  Calendar,
  ChevronLeft,
  Clock,
  Download,
  FileText,
  Hammer,
  History,
  MapPin,
  MoreHorizontal,
  QrCode,
  Settings,
  TrendingDown,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency, formatDate, initials } from '@/lib/utils';

const asset = {
  id: 'AST-1024',
  name: 'CNC Mill #4 - Haas VF-2SS',
  category: 'Production Equipment',
  status: 'active',
  location: 'Reno DC - Mfg Bay A',
  serial: 'HAAS-VF2SS-2022-0884',
  purchasePrice: 142500,
  bookValue: 98400,
  acquired: '2022-08-15',
  warranty: '2025-08-15',
  hours: 8245,
};

const maintenanceHistory = [
  { id: 'WO-2104', date: '2026-04-12', type: 'preventive', tech: 'Akira Tanaka', cost: 380, hours: 2.5, notes: 'Spindle oil change, tool changer calibration' },
  { id: 'WO-2089', date: '2026-03-08', type: 'corrective', tech: 'Maria Santos', cost: 1240, hours: 4.5, notes: 'Coolant pump replacement - emergency' },
  { id: 'WO-2071', date: '2026-02-15', type: 'preventive', tech: 'Akira Tanaka', cost: 280, hours: 2, notes: 'Quarterly inspection and lubrication' },
  { id: 'WO-2048', date: '2026-01-10', type: 'preventive', tech: 'Akira Tanaka', cost: 380, hours: 2.5, notes: 'Spindle oil change' },
  { id: 'WO-2024', date: '2025-12-04', type: 'condition', tech: 'Dmitri Volkov', cost: 0, hours: 0.5, notes: 'Vibration anomaly - inspection cleared' },
];

const pmSchedule = [
  { id: 'PM-A1', name: 'Spindle oil change', interval: 'Quarterly', next: '2026-07-12', priority: 'medium' },
  { id: 'PM-A2', name: 'Tool changer calibration', interval: 'Quarterly', next: '2026-07-12', priority: 'medium' },
  { id: 'PM-A3', name: 'Way oil refill', interval: 'Monthly', next: '2026-06-01', priority: 'low' },
  { id: 'PM-A4', name: 'Coolant filter replace', interval: 'Monthly', next: '2026-05-30', priority: 'low' },
  { id: 'PM-A5', name: 'Annual certification', interval: 'Annual', next: '2026-08-15', priority: 'high' },
];

const conditionReadings = [
  { day: 'May 10', temp: 38.2, vibration: 0.42 },
  { day: 'May 11', temp: 39.1, vibration: 0.44 },
  { day: 'May 12', temp: 41.3, vibration: 0.51 },
  { day: 'May 13', temp: 40.8, vibration: 0.48 },
  { day: 'May 14', temp: 42.1, vibration: 0.56 },
  { day: 'May 15', temp: 41.7, vibration: 0.54 },
];

const docs = [
  { name: 'Operator Manual.pdf', size: '8.4 MB' },
  { name: 'Warranty Certificate.pdf', size: '124 KB' },
  { name: 'Installation Guide.pdf', size: '2.1 MB' },
  { name: 'CMM Calibration 2025.pdf', size: '320 KB' },
];

export default function AssetDetailPage() {
  const totalMaintCost = maintenanceHistory.reduce((s, m) => s + m.cost, 0);

  return (
    <div className="flex flex-col">
      <PageHeader
        title={<div className="flex items-center gap-2"><span>{asset.name}</span><StatusBadge status={asset.status} /></div>}
        description={`${asset.id} - ${asset.location}`}
        breadcrumbs={[{ label: 'Assets', href: '/app/assets' }, { label: 'List', href: '/app/assets/list' }, { label: asset.id }]}
        back={<Button variant="ghost" size="icon-sm" asChild><Link href="/app/assets/list"><ChevronLeft className="size-4" /></Link></Button>}
        actions={
          <>
            <Button variant="outline" size="sm"><QrCode className="size-4" /> QR code</Button>
            <Button variant="outline" size="sm"><Wrench className="size-4" /> Log work</Button>
            <Button size="sm"><Hammer className="size-4" /> Schedule PM</Button>
            <Button variant="outline" size="icon-sm"><MoreHorizontal className="size-4" /></Button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card><CardContent className="pt-5"><div className="flex items-center justify-between"><p className="text-xs uppercase tracking-wide text-muted-foreground">Book value</p><TrendingDown className="size-4 text-muted-foreground" /></div><p className="mt-1 text-2xl font-semibold">{formatCurrency(asset.bookValue)}</p><p className="text-xs text-muted-foreground">{Math.round((asset.bookValue / asset.purchasePrice) * 100)}% of acq.</p></CardContent></Card>
          <Card><CardContent className="pt-5"><div className="flex items-center justify-between"><p className="text-xs uppercase tracking-wide text-muted-foreground">Run hours</p><Activity className="size-4 text-muted-foreground" /></div><p className="mt-1 text-2xl font-semibold">{asset.hours.toLocaleString()}</p><p className="text-xs text-muted-foreground">since acquisition</p></CardContent></Card>
          <Card><CardContent className="pt-5"><div className="flex items-center justify-between"><p className="text-xs uppercase tracking-wide text-muted-foreground">Maint. YTD</p><Hammer className="size-4 text-muted-foreground" /></div><p className="mt-1 text-2xl font-semibold">{formatCurrency(totalMaintCost)}</p><p className="text-xs text-muted-foreground">{maintenanceHistory.length} work orders</p></CardContent></Card>
          <Card className="border-warning/30"><CardContent className="pt-5"><div className="flex items-center justify-between"><p className="text-xs uppercase tracking-wide text-warning">Next PM</p><AlertCircle className="size-4 text-warning" /></div><p className="mt-1 text-2xl font-semibold">15 days</p><p className="text-xs text-muted-foreground">Coolant filter</p></CardContent></Card>
        </div>

        <Tabs defaultValue="history">
          <TabsList variant="pills">
            <TabsTrigger value="history" variant="pills"><History className="size-4" /> Maintenance history</TabsTrigger>
            <TabsTrigger value="pm" variant="pills"><Calendar className="size-4" /> PM schedule</TabsTrigger>
            <TabsTrigger value="condition" variant="pills"><Activity className="size-4" /> Condition</TabsTrigger>
            <TabsTrigger value="docs" variant="pills"><FileText className="size-4" /> Documents</TabsTrigger>
            <TabsTrigger value="info" variant="pills"><Settings className="size-4" /> Specifications</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <Card>
              <CardContent className="p-0">
                <table className="erp-table">
                  <thead><tr><th>WO #</th><th>Date</th><th>Type</th><th>Tech</th><th className="text-right">Hours</th><th className="text-right">Cost</th><th>Notes</th></tr></thead>
                  <tbody>{maintenanceHistory.map((m) => (
                    <tr key={m.id}>
                      <td className="font-mono text-xs text-primary">{m.id}</td>
                      <td className="text-xs">{formatDate(m.date)}</td>
                      <td><Badge variant={m.type === 'corrective' ? 'destructive' : m.type === 'preventive' ? 'outline' : 'secondary'}>{m.type}</Badge></td>
                      <td><div className="flex items-center gap-1.5"><Avatar size="xs"><AvatarFallback>{initials(m.tech)}</AvatarFallback></Avatar><span className="text-xs">{m.tech}</span></div></td>
                      <td className="text-right font-mono tabular-nums">{m.hours}</td>
                      <td className="text-right font-mono tabular-nums">{formatCurrency(m.cost)}</td>
                      <td className="text-xs text-muted-foreground">{m.notes}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pm">
            <Card>
              <CardContent className="p-0">
                <table className="erp-table">
                  <thead><tr><th>PM #</th><th>Task</th><th>Interval</th><th>Next due</th><th>Priority</th><th></th></tr></thead>
                  <tbody>{pmSchedule.map((p) => (
                    <tr key={p.id}>
                      <td className="font-mono text-xs">{p.id}</td>
                      <td className="font-medium">{p.name}</td>
                      <td className="text-xs text-muted-foreground">{p.interval}</td>
                      <td className="text-xs">{formatDate(p.next)}</td>
                      <td><Badge variant={p.priority === 'high' ? 'destructive' : p.priority === 'medium' ? 'warning' : 'outline'}>{p.priority}</Badge></td>
                      <td><Button variant="outline" size="sm">Schedule</Button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="condition">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="text-base">Spindle temperature (°C)</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={conditionReadings}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }} />
                      <Line type="monotone" dataKey="temp" stroke="hsl(var(--warning))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Vibration (mm/s RMS)</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={conditionReadings}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }} />
                      <Line type="monotone" dataKey="vibration" stroke="hsl(var(--info))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="docs">
            <Card>
              <CardContent className="space-y-2 pt-5">
                {docs.map((d) => (
                  <div key={d.name} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3"><FileText className="size-4 text-muted-foreground" /><div><p className="text-sm font-medium">{d.name}</p><p className="text-xs text-muted-foreground">{d.size}</p></div></div>
                    <Button variant="ghost" size="icon-sm"><Download className="size-3.5" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info">
            <Card>
              <CardContent className="grid grid-cols-2 gap-4 pt-5 text-sm md:grid-cols-3">
                <div><p className="text-xs text-muted-foreground">Asset ID</p><p className="mt-0.5 font-mono">{asset.id}</p></div>
                <div><p className="text-xs text-muted-foreground">Category</p><p className="mt-0.5">{asset.category}</p></div>
                <div><p className="text-xs text-muted-foreground">Serial number</p><p className="mt-0.5 font-mono">{asset.serial}</p></div>
                <div><p className="text-xs text-muted-foreground">Location</p><p className="mt-0.5 flex items-center gap-1"><MapPin className="size-3.5" />{asset.location}</p></div>
                <div><p className="text-xs text-muted-foreground">Acquired</p><p className="mt-0.5">{formatDate(asset.acquired)}</p></div>
                <div><p className="text-xs text-muted-foreground">Warranty until</p><p className="mt-0.5">{formatDate(asset.warranty)}</p></div>
                <div><p className="text-xs text-muted-foreground">Purchase price</p><p className="mt-0.5 font-mono">{formatCurrency(asset.purchasePrice)}</p></div>
                <div><p className="text-xs text-muted-foreground">Book value</p><p className="mt-0.5 font-mono">{formatCurrency(asset.bookValue)}</p></div>
                <div><p className="text-xs text-muted-foreground">Depreciation method</p><p className="mt-0.5">Straight-line, 7yr</p></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
