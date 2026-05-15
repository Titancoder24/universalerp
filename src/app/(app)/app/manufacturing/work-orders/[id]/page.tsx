'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Factory,
  Pause,
  Play,
  Printer,
  Settings,
  Square,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { initials, formatNumber, formatDate, formatCurrency } from '@/lib/utils';

const wo = {
  number: 'WO-24891',
  item: 'GBX-450-A',
  desc: 'Gearbox Housing 450 Series',
  qty: 240,
  done: 156,
  scrap: 4,
  start: '2026-05-15 06:00',
  end: '2026-05-17 18:00',
  eta: '2026-05-17 16:20',
  owner: 'Carlos Mendez',
  team: ['Aisha N.', 'Devon T.', 'Priya K.', 'Liam R.'],
  bom: 'BOM-GBX-450-A-v3',
  routing: 'RTG-GBX-450',
  workCenter: 'WC-MACHINING',
  priority: 'high',
};

const components = [
  { code: 'HSG-CAST-450', name: 'Cast aluminum housing', required: 240, issued: 240, consumed: 156, scrap: 4 },
  { code: 'GEAR-SET-450', name: 'Helical gear set 450', required: 240, issued: 240, consumed: 156, scrap: 0 },
  { code: 'SEAL-LIP-22-40', name: 'Lip seal 22x40x7', required: 480, issued: 480, consumed: 312, scrap: 2 },
  { code: 'BOLT-M8-25', name: 'Hex bolt M8x25', required: 1920, issued: 1920, consumed: 1248, scrap: 12 },
  { code: 'GASKET-450', name: 'Cover gasket 450 series', required: 240, issued: 240, consumed: 156, scrap: 1 },
  { code: 'OIL-EP-220', name: 'Gear oil EP-220 (L)', required: 60, issued: 60, consumed: 39, scrap: 0 },
];

const operations = [
  { seq: 10, name: 'CNC machining - housing prep', wc: 'CNC-04', setup: 45, run: 8.5, status: 'completed', operator: 'C. Mendez' },
  { seq: 20, name: 'Deburr & inspect', wc: 'BENCH-02', setup: 5, run: 2.0, status: 'completed', operator: 'A. Nasser' },
  { seq: 30, name: 'Gear assembly', wc: 'ASSY-03', setup: 15, run: 6.2, status: 'in_progress', operator: 'D. Thompson' },
  { seq: 40, name: 'Oil fill & seal', wc: 'ASSY-04', setup: 5, run: 2.8, status: 'pending', operator: '—' },
  { seq: 50, name: 'Final test & label', wc: 'TEST-01', setup: 10, run: 3.5, status: 'pending', operator: '—' },
];

const productionLogs = [
  { time: '14:32', qty: 12, operator: 'D. Thompson', op: 'Op 30', notes: 'Run completed, no issues' },
  { time: '13:45', qty: 8, operator: 'D. Thompson', op: 'Op 30', notes: 'Started after shift change' },
  { time: '12:18', qty: 24, operator: 'A. Nasser', op: 'Op 20', notes: 'Batch passed inspection' },
  { time: '11:02', qty: 16, operator: 'A. Nasser', op: 'Op 20', notes: '' },
  { time: '09:48', qty: 32, operator: 'C. Mendez', op: 'Op 10', notes: 'Tool change at 30 units' },
  { time: '08:15', qty: 28, operator: 'C. Mendez', op: 'Op 10', notes: 'First-off approved by QA' },
];

const qualityChecks = [
  { id: 'INS-8801', characteristic: 'Bore diameter Φ22 H7', target: '22.000 +0.021/0', measured: 22.014, status: 'pass', operator: 'A. Nasser' },
  { id: 'INS-8802', characteristic: 'Face concentricity', target: '≤ 0.02 mm', measured: 0.014, status: 'pass', operator: 'A. Nasser' },
  { id: 'INS-8803', characteristic: 'Surface finish Ra', target: '≤ 1.6 µm', measured: 1.2, status: 'pass', operator: 'A. Nasser' },
  { id: 'INS-8804', characteristic: 'Weight', target: '4.2 ±0.1 kg', measured: 4.18, status: 'pass', operator: 'A. Nasser' },
  { id: 'INS-8805', characteristic: 'Visual defects', target: 'None', measured: 'Minor scratch', status: 'fail', operator: 'D. Thompson' },
];

const opStatusVariant: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
  completed: 'success', in_progress: 'info', pending: 'default',
};

export default function WorkOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const pct = Math.round((wo.done / wo.qty) * 100);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={id}
        description={`${wo.item} · ${wo.desc} · ${wo.workCenter}`}
        breadcrumbs={[
          { label: 'Manufacturing', href: '/app/manufacturing' },
          { label: 'Work Orders', href: '/app/manufacturing/work-orders' },
          { label: id },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/manufacturing/work-orders"><ArrowLeft className="size-4" /></Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline" size="sm"><Pause className="size-4" /> Pause</Button>
            <Button variant="outline" size="sm"><Printer className="size-4" /> Print traveler</Button>
            <Button size="sm" variant="success"><CheckCircle2 className="size-4" /> Close order</Button>
          </>
        }
      />

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <StatusBadge status="in_progress" />
                <Badge variant="warning" className="capitalize">{wo.priority}</Badge>
                <Badge variant="outline">BOM <Link href={`/app/manufacturing/bom/${wo.bom}`} className="ml-1 font-mono text-2xs text-primary hover:underline">{wo.bom}</Link></Badge>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Progress</div>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-3xl font-bold tabular-nums">{wo.done}</span>
                  <span className="text-lg text-muted-foreground tabular-nums">/ {wo.qty} units</span>
                  <span className="ml-auto text-2xl font-semibold tabular-nums">{pct}%</span>
                </div>
                <Progress value={pct} className="mt-2 h-2" />
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Scrap: <span className="text-destructive">{wo.scrap}</span></span>
                  <span>Good: {wo.done - wo.scrap}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-muted-foreground">Schedule</div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Start</span><span className="font-medium">{wo.start}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">End plan</span><span className="font-medium">{wo.end}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">ETA</span><span className="font-medium text-success">{wo.eta}</span></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-muted-foreground">Team</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar size="sm"><AvatarFallback>{initials(wo.owner)}</AvatarFallback></Avatar>
                  <div><div className="text-sm font-medium">{wo.owner}</div><div className="text-2xs text-muted-foreground">Owner</div></div>
                </div>
                <div className="flex -space-x-1.5">
                  {wo.team.map((p) => (
                    <Avatar key={p} size="xs" className="border-2 border-background"><AvatarFallback>{initials(p)}</AvatarFallback></Avatar>
                  ))}
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-2xs text-muted-foreground">+2</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="logs">Production Logs</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle>Order details</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[['BOM', wo.bom], ['Routing', wo.routing], ['Work center', wo.workCenter], ['Sales order', 'SO-44128'], ['Customer', 'Acme Industries'], ['Site', 'Plant 1 - Chicago']].map(([k,v]) => (
                  <div key={k} className="flex justify-between gap-3"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Cost summary</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[['Material', 124.50, 240, 29880], ['Labor', 18.20, 156, 2839.20], ['Overhead', 9.40, 156, 1466.40]].map(([k, _u, _q, v]) => (
                  <div key={k as string} className="flex justify-between gap-3"><span className="text-muted-foreground">{k}</span><span className="font-mono font-medium">{formatCurrency(v as number)}</span></div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between"><span className="font-medium">Total actual</span><span className="font-mono font-bold">{formatCurrency(34185.60)}</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Yield</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-4xl font-bold tabular-nums">97.5%</div>
                  <div className="text-xs text-muted-foreground">First pass yield</div>
                </div>
                <div className="flex items-center justify-around text-center">
                  <div><div className="text-lg font-semibold text-success">{wo.done - wo.scrap}</div><div className="text-2xs text-muted-foreground">Good</div></div>
                  <div><div className="text-lg font-semibold text-destructive">{wo.scrap}</div><div className="text-2xs text-muted-foreground">Scrap</div></div>
                  <div><div className="text-lg font-semibold">{wo.qty - wo.done}</div><div className="text-2xs text-muted-foreground">Remain</div></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="components">
          <Card>
            <CardContent className="p-0">
              <table className="erp-table">
                <thead><tr><th>Code</th><th>Component</th><th className="text-right">Required</th><th className="text-right">Issued</th><th className="text-right">Consumed</th><th className="text-right">Scrap</th><th className="text-right">Remaining</th></tr></thead>
                <tbody>
                  {components.map((c) => (
                    <tr key={c.code}>
                      <td className="font-mono text-xs text-primary">{c.code}</td>
                      <td>{c.name}</td>
                      <td className="text-right font-mono">{formatNumber(c.required)}</td>
                      <td className="text-right font-mono">{formatNumber(c.issued)}</td>
                      <td className="text-right font-mono">{formatNumber(c.consumed)}</td>
                      <td className="text-right font-mono text-destructive">{c.scrap}</td>
                      <td className="text-right font-mono">{formatNumber(c.issued - c.consumed - c.scrap)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations">
          <Card>
            <CardContent className="p-0">
              <table className="erp-table">
                <thead><tr><th>Seq</th><th>Operation</th><th>Work center</th><th className="text-right">Setup (min)</th><th className="text-right">Run (min/ea)</th><th>Operator</th><th>Status</th></tr></thead>
                <tbody>
                  {operations.map((o) => (
                    <tr key={o.seq}>
                      <td className="font-mono font-medium">{o.seq}</td>
                      <td>{o.name}</td>
                      <td className="font-mono text-xs">{o.wc}</td>
                      <td className="text-right font-mono">{o.setup}</td>
                      <td className="text-right font-mono">{o.run}</td>
                      <td className="text-xs">{o.operator}</td>
                      <td><StatusBadge status={o.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardContent className="p-0">
              <table className="erp-table">
                <thead><tr><th>Time</th><th>Operation</th><th className="text-right">Qty</th><th>Operator</th><th>Notes</th></tr></thead>
                <tbody>
                  {productionLogs.map((l, i) => (
                    <tr key={i}>
                      <td className="font-mono text-xs">{l.time}</td>
                      <td><Badge variant="outline" size="sm">{l.op}</Badge></td>
                      <td className="text-right font-mono font-semibold">+{l.qty}</td>
                      <td className="text-xs">{l.operator}</td>
                      <td className="text-xs text-muted-foreground">{l.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality">
          <Card>
            <CardContent className="p-0">
              <table className="erp-table">
                <thead><tr><th>Inspection</th><th>Characteristic</th><th>Target</th><th className="text-right">Measured</th><th>Result</th><th>Operator</th></tr></thead>
                <tbody>
                  {qualityChecks.map((q) => (
                    <tr key={q.id}>
                      <td className="font-mono text-xs text-primary">{q.id}</td>
                      <td>{q.characteristic}</td>
                      <td className="text-xs text-muted-foreground">{q.target}</td>
                      <td className="text-right font-mono">{q.measured}</td>
                      <td>{q.status === 'pass' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-success"><CheckCircle2 className="size-3" /> Pass</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-destructive"><XCircle className="size-3" /> Fail</span>
                      )}</td>
                      <td className="text-xs">{q.operator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
