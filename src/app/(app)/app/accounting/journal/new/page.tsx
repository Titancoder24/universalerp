'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRightLeft,
  CheckCircle2,
  CircleX,
  FileText,
  Info,
  Paperclip,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, cn } from '@/lib/utils';

interface Line {
  id: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
  department: string;
  project: string;
  costCenter: string;
}

const accounts = [
  { code: '1010', name: 'Operating Cash' },
  { code: '1100', name: 'Accounts Receivable' },
  { code: '1210', name: 'Raw Materials' },
  { code: '2010', name: 'Accounts Payable' },
  { code: '2040', name: 'Sales Tax Payable' },
  { code: '4010', name: 'Product Sales' },
  { code: '4020', name: 'Service Revenue' },
  { code: '5010', name: 'Raw Material Cost' },
  { code: '6010', name: 'Salaries & Wages' },
  { code: '6020', name: 'Rent Expense' },
  { code: '6030', name: 'Utilities' },
  { code: '6060', name: 'Depreciation' },
];

const departments = ['Operations', 'Sales', 'Marketing', 'Finance', 'HR', 'R&D', 'IT'];
const projects = ['ERP Migration', 'New Product Launch', 'Plant Expansion', 'Marketing Q2', 'None'];
const costCenters = ['CC-100 Manufacturing', 'CC-200 Sales', 'CC-300 Admin', 'CC-400 R&D'];

export default function NewJournalEntryPage() {
  const [date, setDate] = useState('2026-05-15');
  const [reference, setReference] = useState('');
  const [memo, setMemo] = useState('');
  const [lines, setLines] = useState<Line[]>([
    { id: '1', account: '1010', description: '', debit: 12500, credit: 0, department: 'Operations', project: 'None', costCenter: 'CC-100 Manufacturing' },
    { id: '2', account: '4010', description: '', debit: 0, credit: 12500, department: 'Sales', project: 'None', costCenter: 'CC-200 Sales' },
  ]);

  const addLine = () => {
    const newId = String(Date.now());
    setLines([...lines, { id: newId, account: '', description: '', debit: 0, credit: 0, department: 'Operations', project: 'None', costCenter: 'CC-100 Manufacturing' }]);
  };

  const removeLine = (id: string) => setLines(lines.filter((l) => l.id !== id));

  const update = (id: string, patch: Partial<Line>) => {
    setLines(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const totalDebit = lines.reduce((s, l) => s + (l.debit || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (l.credit || 0), 0);
  const balanced = totalDebit === totalCredit && totalDebit > 0;
  const variance = totalDebit - totalCredit;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="New Journal Entry"
        description="Record a manual GL entry. Debits must equal credits before posting."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Accounting', href: '/app/accounting' },
          { label: 'Journal', href: '/app/accounting/journal' },
          { label: 'New' },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/accounting/journal" aria-label="Back">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              <Save className="size-4" /> Save draft
            </Button>
            <Button size="sm" disabled={!balanced}>
              <CheckCircle2 className="size-4" /> Post entry
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Entry header</CardTitle>
              <CardDescription>Identify the entry and set its posting date.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="je-number">JE number</Label>
                <Input id="je-number" value="JE-2026-0429" disabled />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="je-date">Posting date</Label>
                <Input id="je-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="je-period">Period</Label>
                <Select defaultValue="may-2026">
                  <SelectTrigger id="je-period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="may-2026">May 2026</SelectItem>
                    <SelectItem value="jun-2026">June 2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="je-ref">Reference</Label>
                <Input id="je-ref" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. INV-2189, PO-3089" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="je-entity">Entity</Label>
                <Select defaultValue="parent">
                  <SelectTrigger id="je-entity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Universal ERP Inc.</SelectItem>
                    <SelectItem value="sub-uk">Universal ERP UK Ltd.</SelectItem>
                    <SelectItem value="sub-eu">Universal ERP EU B.V.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="je-currency">Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger id="je-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                    <SelectItem value="gbp">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3 space-y-1.5">
                <Label htmlFor="je-memo">Memo</Label>
                <Textarea id="je-memo" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="Provide a clear description of what this entry records…" rows={2} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Line items</CardTitle>
                <CardDescription>{lines.length} lines · debits must equal credits</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={addLine}>
                <Plus className="size-4" /> Add line
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="erp-table">
                  <thead>
                    <tr>
                      <th className="w-10">#</th>
                      <th className="w-60">Account</th>
                      <th>Description</th>
                      <th className="w-40">Department</th>
                      <th className="w-40">Project</th>
                      <th className="w-32 text-right">Debit</th>
                      <th className="w-32 text-right">Credit</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line, i) => (
                      <tr key={line.id} className="align-top">
                        <td className="pt-3 text-xs text-muted-foreground">{i + 1}</td>
                        <td>
                          <Select value={line.account} onValueChange={(v) => update(line.id, { account: v })}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                              {accounts.map((a) => (
                                <SelectItem key={a.code} value={a.code}>
                                  <span className="font-mono text-xs">{a.code}</span> · {a.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td>
                          <Input className="h-8" value={line.description} onChange={(e) => update(line.id, { description: e.target.value })} placeholder="Line description" />
                        </td>
                        <td>
                          <Select value={line.department} onValueChange={(v) => update(line.id, { department: v })}>
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </td>
                        <td>
                          <Select value={line.project} onValueChange={(v) => update(line.id, { project: v })}>
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {projects.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </td>
                        <td>
                          <Input
                            className="h-8 text-right font-mono"
                            type="number"
                            value={line.debit || ''}
                            onChange={(e) => update(line.id, { debit: parseFloat(e.target.value) || 0, credit: 0 })}
                            placeholder="0.00"
                          />
                        </td>
                        <td>
                          <Input
                            className="h-8 text-right font-mono"
                            type="number"
                            value={line.credit || ''}
                            onChange={(e) => update(line.id, { credit: parseFloat(e.target.value) || 0, debit: 0 })}
                            placeholder="0.00"
                          />
                        </td>
                        <td>
                          <Button variant="ghost" size="icon-sm" onClick={() => removeLine(line.id)} disabled={lines.length <= 2}>
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/30 font-semibold">
                      <td colSpan={5} className="text-right">Totals</td>
                      <td className="text-right font-mono tabular-nums">{formatCurrency(totalDebit)}</td>
                      <td className="text-right font-mono tabular-nums">{formatCurrency(totalCredit)}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total debit</span>
                <span className="font-mono font-medium tabular-nums">{formatCurrency(totalDebit)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total credit</span>
                <span className="font-mono font-medium tabular-nums">{formatCurrency(totalCredit)}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Variance</span>
                  <span className={cn('font-mono font-semibold tabular-nums', balanced ? 'text-success' : 'text-destructive')}>
                    {formatCurrency(variance)}
                  </span>
                </div>
                <div className={cn('mt-3 rounded-md p-3 text-xs', balanced ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive')}>
                  <div className="flex items-center gap-2">
                    {balanced ? <CheckCircle2 className="size-4" /> : <CircleX className="size-4" />}
                    <span className="font-medium">
                      {balanced ? 'Entry is balanced' : 'Debits must equal credits'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attachments</CardTitle>
              <CardDescription>Supporting documents for audit trail</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                <Paperclip className="size-4" /> Attach file
              </Button>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 rounded-md border border-border p-2 text-xs">
                  <FileText className="size-3.5 text-muted-foreground" />
                  <span className="flex-1 truncate">invoice_2189.pdf</span>
                  <span className="text-muted-foreground">142 KB</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Info className="size-4 text-info" />Audit trail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <p className="font-medium">Created by Sarah Chen</p>
                <p className="text-muted-foreground">May 15, 2026 · 9:42 AM</p>
              </div>
              <div className="border-t border-border pt-2">
                <p className="text-muted-foreground">Entry will require approval before posting</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
