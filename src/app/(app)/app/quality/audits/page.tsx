'use client';

import * as React from 'react';
import { Calendar, CheckCircle2, Download, FileCheck, FileWarning, Plus, ShieldCheck } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate, formatPercent, initials } from '@/lib/utils';

const audits = [
  { id: 'AUD-2026-014', type: 'Internal', scope: 'ISO 9001 - Plant 1', auditor: 'C. Rivera', date: '2026-05-20', status: 'pending' as const, findings: 0, compliance: null, area: 'Mfg' },
  { id: 'AUD-2026-013', type: 'External', scope: 'NSF Certification renewal', auditor: 'NSF Auditor', date: '2026-05-18', status: 'in_progress' as const, findings: 3, compliance: 92, area: 'Whole site' },
  { id: 'AUD-2026-012', type: 'Supplier', scope: 'Acme Castings - quality system', auditor: 'R. Chen', date: '2026-05-15', status: 'completed' as const, findings: 4, compliance: 86, area: 'Supplier' },
  { id: 'AUD-2026-011', type: 'Internal', scope: 'Calibration program', auditor: 'P. Krishnan', date: '2026-05-12', status: 'completed' as const, findings: 2, compliance: 94, area: 'Lab' },
  { id: 'AUD-2026-010', type: 'Layered', scope: 'Layered Process Audit - CNC line', auditor: 'Multiple', date: '2026-05-10', status: 'completed' as const, findings: 1, compliance: 96, area: 'Mfg' },
  { id: 'AUD-2026-009', type: 'Internal', scope: 'Document control', auditor: 'M. Stark', date: '2026-05-08', status: 'completed' as const, findings: 5, compliance: 82, area: 'Engineering' },
  { id: 'AUD-2026-008', type: 'External', scope: 'IATF 16949 surveillance', auditor: 'TUV Auditor', date: '2026-05-05', status: 'completed' as const, findings: 6, compliance: 88, area: 'Whole site' },
  { id: 'AUD-2026-007', type: 'Supplier', scope: 'PrecisionCNC - capability', auditor: 'A. Reyes', date: '2026-05-02', status: 'completed' as const, findings: 2, compliance: 90, area: 'Supplier' },
  { id: 'AUD-2026-006', type: 'Internal', scope: '5S Plant 1 Bay A', auditor: 'L. Rodriguez', date: '2026-04-28', status: 'completed' as const, findings: 3, compliance: 91, area: 'Mfg' },
  { id: 'AUD-2026-005', type: 'Layered', scope: 'LPA - Assembly line', auditor: 'Multiple', date: '2026-04-25', status: 'completed' as const, findings: 0, compliance: 100, area: 'Mfg' },
  { id: 'AUD-2026-022', type: 'Internal', scope: 'ISO 14001 environmental', auditor: 'M. Stark', date: '2026-06-15', status: 'pending' as const, findings: 0, compliance: null, area: 'Site' },
  { id: 'AUD-2026-021', type: 'Supplier', scope: 'SKF - delivery quality', auditor: 'R. Chen', date: '2026-06-10', status: 'pending' as const, findings: 0, compliance: null, area: 'Supplier' },
];

const typeVariant: Record<string, 'info' | 'warning' | 'soft' | 'secondary'> = {
  Internal: 'info', External: 'warning', Supplier: 'soft', Layered: 'secondary',
};

const monthlyCompliance = [
  { month: 'Dec', score: 89 },
  { month: 'Jan', score: 90 },
  { month: 'Feb', score: 92 },
  { month: 'Mar', score: 91 },
  { month: 'Apr', score: 93 },
  { month: 'May', score: 91 },
];

const findingsByArea = [
  { area: 'Mfg', open: 4, closed: 22 },
  { area: 'Lab', open: 2, closed: 18 },
  { area: 'Supplier', open: 6, closed: 12 },
  { area: 'Engineering', open: 5, closed: 8 },
  { area: 'Site', open: 1, closed: 15 },
];

export default function AuditsPage() {
  const completed = audits.filter((a) => a.status === 'completed');
  const avgCompliance = completed.reduce((s, a) => s + (a.compliance || 0), 0) / completed.length;
  const totalFindings = audits.reduce((s, a) => s + a.findings, 0);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Audits"
        description="Internal, external, supplier and layered process audits with findings tracking."
        breadcrumbs={[
          { label: 'Quality', href: '/app/quality' },
          { label: 'Audits' },
        ]}
        actions={
          <>
            <Button variant="outline"><Calendar className="size-4" /> Schedule</Button>
            <Button><Plus className="size-4" /> New audit</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Audits this month</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{audits.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2 className="size-5 text-success" />
            <div>
              <div className="text-xs text-muted-foreground">Avg compliance</div>
              <div className="text-2xl font-bold tabular-nums text-success">{formatPercent(avgCompliance / 100)}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <FileWarning className="size-5 text-warning" />
            <div>
              <div className="text-xs text-muted-foreground">Total findings</div>
              <div className="text-2xl font-bold tabular-nums">{totalFindings}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Completion rate</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{formatPercent(completed.length / audits.length)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Trend</CardTitle>
            <CardDescription>Rolling monthly average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyCompliance} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[80, 100]} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {monthlyCompliance.map((d, i) => (<Cell key={i} fill={d.score >= 92 ? 'hsl(var(--success))' : 'hsl(var(--chart-1))'} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Findings by Area</CardTitle>
            <CardDescription>Open vs closed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={findingsByArea} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis type="category" dataKey="area" stroke="hsl(var(--muted-foreground))" fontSize={11} width={80} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="open" stackId="a" fill="hsl(var(--destructive))" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="closed" stackId="a" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Schedule & History</CardTitle>
          <CardDescription>All planned and completed audits</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Audit</th>
                <th>Type</th>
                <th>Scope</th>
                <th>Area</th>
                <th>Auditor</th>
                <th>Date</th>
                <th className="text-right">Findings</th>
                <th>Compliance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((a) => (
                <tr key={a.id}>
                  <td className="font-mono text-xs text-primary">{a.id}</td>
                  <td><Badge variant={typeVariant[a.type]} size="sm">{a.type}</Badge></td>
                  <td className="text-sm">{a.scope}</td>
                  <td className="text-xs text-muted-foreground">{a.area}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {a.auditor !== 'Multiple' && a.auditor !== 'NSF Auditor' && a.auditor !== 'TUV Auditor' ? (
                        <>
                          <Avatar size="xs"><AvatarFallback>{initials(a.auditor)}</AvatarFallback></Avatar>
                          <span className="text-xs">{a.auditor}</span>
                        </>
                      ) : <span className="text-xs">{a.auditor}</span>}
                    </div>
                  </td>
                  <td className="text-xs text-muted-foreground">{formatDate(a.date)}</td>
                  <td className="text-right font-mono">{a.findings}</td>
                  <td className="w-32">
                    {a.compliance !== null ? (
                      <div className="flex items-center gap-2">
                        <Progress value={a.compliance} className="h-1 w-16" indicatorClassName={a.compliance >= 90 ? 'bg-success' : 'bg-warning'} />
                        <span className="font-mono text-xs">{a.compliance}%</span>
                      </div>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
