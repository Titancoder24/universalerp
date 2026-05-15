'use client';

import Link from 'next/link';
import { ArrowLeft, Activity, Calendar, Settings, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/lib/utils';

const wc = {
  id: 'WC-101',
  name: 'CNC Line 1 (Mazak VTC-300)',
  branch: 'Plant A',
  capacity_hours_day: 16,
  hourly_cost: 85,
  status: 'running',
  oee: 87.4,
  availability: 94.2,
  performance: 96.1,
  quality: 97.0,
};

const recentJobs = [
  { id: 'WO-2089', date: '2026-05-13', duration: '4h 22m', good: 245, scrap: 5, oee: 92.1 },
  { id: 'WO-2087', date: '2026-05-12', duration: '6h 15m', good: 320, scrap: 8, oee: 88.5 },
  { id: 'WO-2084', date: '2026-05-12', duration: '3h 40m', good: 180, scrap: 2, oee: 95.2 },
  { id: 'WO-2081', date: '2026-05-11', duration: '7h 05m', good: 410, scrap: 12, oee: 86.4 },
];

export default function WorkCenterDetailPage() {
  return (
    <div className="space-y-6 p-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/app/manufacturing/work-centers"><ArrowLeft className="size-4" /> Back to work centers</Link>
      </Button>

      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <span>{wc.name}</span>
            <Badge variant="success" className="gap-1">
              <Activity className="size-3" /> Running
            </Badge>
          </div>
        }
        description={`${wc.id} · ${wc.branch} · Capacity ${wc.capacity_hours_day}h/day · $${wc.hourly_cost}/hr`}
        actions={
          <>
            <Button variant="outline"><Settings className="size-4" /> Configure</Button>
            <Button><Wrench className="size-4" /> Schedule maintenance</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="OEE" value={wc.oee} format="percent" delta={2.1} />
        <StatCard label="Availability" value={wc.availability} format="percent" />
        <StatCard label="Performance" value={wc.performance} format="percent" />
        <StatCard label="Quality" value={wc.quality} format="percent" />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="jobs">Recent Jobs</TabsTrigger>
          <TabsTrigger value="downtime">Downtime</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance breakdown</CardTitle>
                <CardDescription>OEE = Availability × Performance × Quality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Availability</span>
                    <span className="font-mono">{wc.availability}%</span>
                  </div>
                  <Progress value={wc.availability} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Performance</span>
                    <span className="font-mono">{wc.performance}%</span>
                  </div>
                  <Progress value={wc.performance} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Quality</span>
                    <span className="font-mono">{wc.quality}%</span>
                  </div>
                  <Progress value={wc.quality} />
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-base font-semibold">
                    <span>OEE</span>
                    <span className="font-mono text-success">{wc.oee}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {[
                  { label: 'Manufacturer', value: 'Mazak' },
                  { label: 'Model', value: 'VTC-300' },
                  { label: 'Year', value: '2021' },
                  { label: 'Asset code', value: 'AST-MFG-101' },
                  { label: 'Installed', value: '2021-08-14' },
                  { label: 'Service life', value: '20 years' },
                  { label: 'Power', value: '380V 3-phase, 60A' },
                  { label: 'Footprint', value: '4.2m × 3.8m' },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between py-1 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-medium">{s.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Production schedule (next 7 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Gantt-style schedule view would render here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardContent className="p-0">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Work Order</th>
                    <th>Date</th>
                    <th>Duration</th>
                    <th className="text-right">Good</th>
                    <th className="text-right">Scrap</th>
                    <th className="text-right">OEE</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((j) => (
                    <tr key={j.id}>
                      <td className="font-mono text-xs text-primary">{j.id}</td>
                      <td className="text-sm">{j.date}</td>
                      <td className="text-sm">{j.duration}</td>
                      <td className="text-right font-mono">{j.good}</td>
                      <td className="text-right font-mono text-destructive">{j.scrap}</td>
                      <td className="text-right font-mono font-semibold">{j.oee}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downtime">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Downtime pareto chart and event log would render here.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              PM schedule and work order history would render here.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
