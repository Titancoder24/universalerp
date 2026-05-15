'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  Download,
  ExternalLink,
  Fish,
  HelpCircle,
  Lock,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate, formatRelativeTime, initials } from '@/lib/utils';

const capa = {
  id: 'CAPA-0421',
  title: 'Adhesive bond failure in assembly line 3',
  status: 'in_progress',
  ncr: 'NCR-1842',
  severity: 'major',
  raised: '2026-04-28',
  due: '2026-05-28',
  owner: 'Jamal Reed',
};

const fiveWhys = [
  { id: 1, q: 'Why did the bond fail?', a: 'Insufficient cure time at the adhesive dispensing station.' },
  { id: 2, q: 'Why was cure time insufficient?', a: 'Conveyor speed was increased by 12% without recipe adjustment.' },
  { id: 3, q: 'Why was conveyor speed increased without adjustment?', a: 'Production set point was changed to hit Q2 volume targets.' },
  { id: 4, q: 'Why was the recipe not reviewed?', a: 'No interlock between production set point changes and process recipes.' },
  { id: 5, q: 'Why is there no interlock?', a: 'MES did not have the cross-validation rule configured (root cause).' },
];

const actions = [
  { id: 'a1', kind: 'corrective', desc: 'Reduce conveyor speed to validated set point (5.2 m/min)', owner: 'Maria Santos', due: '2026-05-02', status: 'completed' },
  { id: 'a2', kind: 'corrective', desc: 'Re-inspect 100% of WIP from past 72 hours', owner: 'Akira Tanaka', due: '2026-05-03', status: 'completed' },
  { id: 'a3', kind: 'preventive', desc: 'Add MES cross-validation rule for recipe vs. set point', owner: 'Dmitri Volkov', due: '2026-05-20', status: 'in_progress' },
  { id: 'a4', kind: 'preventive', desc: 'Update operator SOP with recipe change procedure', owner: 'Sarah Chen', due: '2026-05-22', status: 'in_progress' },
  { id: 'a5', kind: 'preventive', desc: 'Training rollout for line supervisors', owner: 'Lena Park', due: '2026-05-28', status: 'open' },
];

const approvals = [
  { id: 1, role: 'Originator', user: 'Akira Tanaka', date: '2026-04-28', status: 'signed' },
  { id: 2, role: 'QA Manager', user: 'Maria Santos', date: '2026-04-29', status: 'signed' },
  { id: 3, role: 'Production Mgr', user: 'Jamal Reed', date: '2026-04-30', status: 'signed' },
  { id: 4, role: 'Director of Quality', user: 'Hannah Klein', date: null, status: 'pending' },
];

export default function CapaDetailPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title={<div className="flex items-center gap-2"><span>{capa.id}</span><StatusBadge status={capa.status} /><Badge variant="outline">{capa.severity}</Badge></div>}
        description={capa.title}
        breadcrumbs={[{ label: 'Quality', href: '/app/quality' }, { label: 'CAPA', href: '/app/quality/capa' }, { label: capa.id }]}
        back={<Button variant="ghost" size="icon-sm" asChild><Link href="/app/quality/capa"><ChevronLeft className="size-4" /></Link></Button>}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="size-4" /> Export</Button>
            <Button size="sm"><Lock className="size-4" /> Submit for closure</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="size-4 text-warning" /> Source NCR</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <Link href="/app/quality/ncr" className="flex items-center justify-between rounded-md border p-3 hover:bg-accent/30">
                <div>
                  <p className="font-mono text-primary">{capa.ncr}</p>
                  <p className="mt-0.5 font-medium">Adhesive bond failure - 18 units rejected</p>
                  <p className="mt-1 text-xs text-muted-foreground">Detected at QC inspection station 3 on 2026-04-27. 18/240 units in shift batch failed pull test.</p>
                </div>
                <ExternalLink className="size-4 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><HelpCircle className="size-4" /> Root cause - 5 Whys</CardTitle>
              <Button variant="outline" size="sm"><Fish className="size-4" /> Fishbone diagram</Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {fiveWhys.map((w) => (
                <div key={w.id} className="rounded-md border p-3">
                  <div className="flex items-center gap-2"><span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{w.id}</span><Label className="text-xs">{w.q}</Label></div>
                  <Textarea defaultValue={w.a} minRows={2} className="mt-2" autoGrow />
                </div>
              ))}
              <div className="rounded-md border-l-2 border-destructive bg-destructive/5 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-destructive">Identified root cause</p>
                <p className="mt-1 text-sm">MES lacks cross-validation between production set point and process recipe parameters.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base">Action plan</CardTitle><Button variant="outline" size="sm"><Plus className="size-4" /> Add action</Button></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/20">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-muted-foreground w-24">Type</th>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-muted-foreground">Action</th>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-muted-foreground w-40">Owner</th>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-muted-foreground w-32">Due</th>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-muted-foreground w-32">Status</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {actions.map((a) => (
                    <tr key={a.id} className="border-b border-border/60">
                      <td className="px-3 py-2"><Badge variant={a.kind === 'corrective' ? 'destructive' : 'outline'}>{a.kind}</Badge></td>
                      <td className="px-3 py-2">{a.desc}</td>
                      <td className="px-3 py-2"><div className="flex items-center gap-1.5"><Avatar size="xs"><AvatarFallback>{initials(a.owner)}</AvatarFallback></Avatar><span className="text-xs">{a.owner}</span></div></td>
                      <td className="px-3 py-2 text-xs">{formatDate(a.due)}</td>
                      <td className="px-3 py-2"><StatusBadge status={a.status} /></td>
                      <td className="px-3 py-2"><Button variant="ghost" size="icon-sm"><Trash2 className="size-3.5" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><CheckCircle2 className="size-4" /> Verification</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5"><Label>Verification method</Label><Select defaultValue="audit"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="audit">Audit / inspection</SelectItem><SelectItem value="test">Re-test sample</SelectItem><SelectItem value="data">Data analysis</SelectItem><SelectItem value="review">Document review</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Verification date</Label><Input type="date" defaultValue="2026-05-30" /></div>
                <div className="space-y-1.5"><Label>Verified by</Label><Input defaultValue="Hannah Klein" /></div>
                <div className="space-y-1.5"><Label>Findings</Label><Textarea placeholder="Document verification outcome…" defaultValue="MES rule deployed and tested on 5 set point changes. All flagged correctly." minRows={3} /></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="size-4" /> Effectiveness review</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5"><Label>Review window</Label><Select defaultValue="60d"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="30d">30 days</SelectItem><SelectItem value="60d">60 days</SelectItem><SelectItem value="90d">90 days</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Review date</Label><Input type="date" defaultValue="2026-07-27" /></div>
                <div className="space-y-1.5"><Label>Effectiveness criteria</Label><Textarea defaultValue="Zero recurrence of adhesive bond failures across all 3 assembly lines for 60-day window." minRows={3} /></div>
                <div className="rounded-md border border-info/30 bg-info/5 p-3 text-xs"><Calendar className="mb-1 size-4 text-info" /><p className="font-medium text-info">Auto-reminder scheduled</p><p className="text-muted-foreground">System will prompt review on 2026-07-27.</p></div>
              </CardContent>
            </Card>
          </div>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Details</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Owner</span><span className="font-medium">{capa.owner}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Raised</span><span>{formatDate(capa.raised)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Due</span><span>{formatDate(capa.due)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">NCR ref</span><Link href="#" className="font-mono text-primary">{capa.ncr}</Link></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Closure approvals</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {approvals.map((a, idx) => (
                <div key={a.id} className="relative flex gap-3">
                  {idx < approvals.length - 1 && <div className="absolute left-3.5 top-7 h-full w-px bg-border" />}
                  <div className={a.status === 'signed' ? 'flex size-7 items-center justify-center rounded-full bg-success/10 text-success' : 'flex size-7 items-center justify-center rounded-full border-2 border-dashed border-warning text-warning'}>
                    {a.status === 'signed' ? <Check className="size-3.5" /> : <span className="size-1.5 rounded-full bg-warning" />}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{a.role}</p>
                    <p className="text-sm font-medium">{a.user}</p>
                    {a.date ? <p className="text-xs text-success">Signed {formatRelativeTime(a.date)}</p> : <p className="text-xs text-warning">Pending signature</p>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
