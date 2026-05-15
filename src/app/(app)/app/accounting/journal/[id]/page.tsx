'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Clock,
  Download,
  Edit,
  FileText,
  History,
  Lock,
  RefreshCcw,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, formatRelativeTime, initials } from '@/lib/utils';

const je = {
  id: 'JE-2026-0421',
  status: 'posted',
  date: '2026-05-08',
  reference: 'May payroll accrual',
  source: 'Manual entry',
  description: 'Accrue salaries and wages for the pay period ending May 14, 2026.',
  total: 482450.00,
  fiscalPeriod: 'May 2026',
};

const lines = [
  { account: '5100 - Salaries Expense', dept: 'Engineering', dim: 'Project: Vendor Portal', debit: 218400, credit: 0, desc: 'Eng salary accrual' },
  { account: '5100 - Salaries Expense', dept: 'Sales', dim: 'Region: West', debit: 124800, credit: 0, desc: 'Sales salary accrual' },
  { account: '5110 - Payroll Taxes', dept: '—', dim: '—', debit: 41250, credit: 0, desc: 'Employer taxes' },
  { account: '5120 - Benefits', dept: '—', dim: '—', debit: 98000, credit: 0, desc: 'Health insurance employer share' },
  { account: '2100 - Accrued Payroll', dept: '—', dim: '—', debit: 0, credit: 343200, desc: 'Accrued wages' },
  { account: '2110 - Accrued Taxes', dept: '—', dim: '—', debit: 0, credit: 41250, desc: 'Accrued payroll taxes' },
  { account: '2120 - Accrued Benefits', dept: '—', dim: '—', debit: 0, credit: 98000, desc: 'Accrued benefits' },
];

const audit = [
  { id: 1, user: 'Maria Santos', action: 'Created entry', time: '2026-05-07T16:30:00Z' },
  { id: 2, user: 'Maria Santos', action: 'Edited line 4 (Benefits)', time: '2026-05-07T16:42:00Z' },
  { id: 3, user: 'Hannah Klein', action: 'Reviewed and approved', time: '2026-05-08T09:14:00Z' },
  { id: 4, user: 'System', action: 'Posted to GL', time: '2026-05-08T09:14:30Z' },
];

export default function JournalEntryPage() {
  const totalDebit = lines.reduce((s, l) => s + l.debit, 0);
  const totalCredit = lines.reduce((s, l) => s + l.credit, 0);
  const balanced = totalDebit === totalCredit;

  return (
    <div className="flex flex-col">
      <PageHeader
        title={<div className="flex items-center gap-2"><span className="font-mono">{je.id}</span><StatusBadge status={je.status} /></div>}
        description={je.reference}
        breadcrumbs={[{ label: 'Accounting', href: '/app/accounting' }, { label: 'Journal entries', href: '/app/accounting/journal' }, { label: je.id }]}
        back={<Button variant="ghost" size="icon-sm" asChild><Link href="/app/accounting/journal"><ChevronLeft className="size-4" /></Link></Button>}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="size-4" /> Export</Button>
            {je.status === 'draft' ? (
              <>
                <Button variant="outline" size="sm"><Edit className="size-4" /> Edit</Button>
                <Button size="sm"><Lock className="size-4" /> Post</Button>
              </>
            ) : (
              <Button variant="outline" size="sm"><RefreshCcw className="size-4" /> Reverse</Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Header</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Entry date</p><p className="mt-0.5 font-medium">{formatDate(je.date)}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Fiscal period</p><p className="mt-0.5 font-medium">{je.fiscalPeriod}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Source</p><p className="mt-0.5 font-medium">{je.source}</p></div>
              <div className="md:col-span-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Description</p>
                <p className="mt-0.5">{je.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Journal lines</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/20">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-muted-foreground">Account</th>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-muted-foreground">Description</th>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-muted-foreground">Dept</th>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-muted-foreground">Dimensions</th>
                    <th className="px-3 py-2 text-right text-xs uppercase tracking-wide text-muted-foreground w-28">Debit</th>
                    <th className="px-3 py-2 text-right text-xs uppercase tracking-wide text-muted-foreground w-28">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l, idx) => (
                    <tr key={idx} className="border-b border-border/60">
                      <td className="px-3 py-2 font-mono text-xs">{l.account}</td>
                      <td className="px-3 py-2 text-xs">{l.desc}</td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{l.dept}</td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{l.dim}</td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums">{l.debit ? formatCurrency(l.debit) : '—'}</td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums">{l.credit ? formatCurrency(l.credit) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 bg-muted/30">
                  <tr>
                    <td colSpan={4} className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide">Total</td>
                    <td className="px-3 py-2 text-right font-mono font-semibold tabular-nums">{formatCurrency(totalDebit)}</td>
                    <td className="px-3 py-2 text-right font-mono font-semibold tabular-nums">{formatCurrency(totalCredit)}</td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="size-4" /> Attachments</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: 'Payroll-2026-05-PR-1.pdf', size: '124 KB' },
                { name: 'Benefits-Accrual-Worksheet.xlsx', size: '38 KB' },
              ].map((a) => (
                <div key={a.name} className="flex items-center justify-between rounded-md border p-2.5 text-xs">
                  <div className="flex items-center gap-2"><FileText className="size-4 text-muted-foreground" /><div><p className="font-medium">{a.name}</p><p className="text-muted-foreground">{a.size}</p></div></div>
                  <Button variant="ghost" size="icon-sm"><Download className="size-3.5" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Balance check</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total debit</span><span className="font-mono tabular-nums">{formatCurrency(totalDebit)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total credit</span><span className="font-mono tabular-nums">{formatCurrency(totalCredit)}</span></div>
              <Separator />
              <div className={'flex items-center justify-between rounded-md p-2 ' + (balanced ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive')}>
                <span className="flex items-center gap-1.5 text-sm font-medium"><ShieldCheck className="size-4" /> {balanced ? 'Balanced' : 'Out of balance'}</span>
                <span className="font-mono tabular-nums">{formatCurrency(Math.abs(totalDebit - totalCredit))}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Details</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Created by</span><div className="flex items-center gap-1.5"><Avatar size="xs"><AvatarFallback>MS</AvatarFallback></Avatar><span>Maria Santos</span></div></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Approved by</span><div className="flex items-center gap-1.5"><Avatar size="xs"><AvatarFallback>HK</AvatarFallback></Avatar><span>Hannah Klein</span></div></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Posted</span><span>{formatDate(je.date)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Lines</span><span>{lines.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Auto-reverse</span><Badge variant="outline">Next month</Badge></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><History className="size-4" /> Audit trail</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {audit.map((a) => (
                <div key={a.id} className="flex gap-2.5">
                  <div className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1 text-xs">
                    <p><span className="font-medium">{a.user}</span> {a.action}</p>
                    <p className="text-muted-foreground">{formatRelativeTime(a.time)}</p>
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
