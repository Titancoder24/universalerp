'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  Download,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate, initials } from '@/lib/utils';

const entries = [
  { number: 'JE-2026-0428', date: '2026-05-14', reference: 'INV-2189', description: 'Acme Industries — May invoice batch', debit: 248420, credit: 248420, status: 'posted' as const, source: 'AR', createdBy: 'Sarah Chen' },
  { number: 'JE-2026-0427', date: '2026-05-14', reference: 'PAY-1842', description: 'Vendor payment — Global Steel Supply', debit: 84200, credit: 84200, status: 'posted' as const, source: 'AP', createdBy: 'Marcus Reid' },
  { number: 'JE-2026-0426', date: '2026-05-13', reference: 'DEPR-MAY', description: 'Monthly depreciation entry', debit: 48400, credit: 48400, status: 'posted' as const, source: 'Manual', createdBy: 'Sarah Chen' },
  { number: 'JE-2026-0425', date: '2026-05-13', reference: 'PAYROLL-052026', description: 'Bi-weekly payroll run', debit: 142800, credit: 142800, status: 'posted' as const, source: 'Payroll', createdBy: 'System' },
  { number: 'JE-2026-0424', date: '2026-05-12', reference: 'BANK-RECON', description: 'Bank fee reconciliation — Chase', debit: 1240, credit: 1240, status: 'posted' as const, source: 'Bank', createdBy: 'Marcus Reid' },
  { number: 'JE-2026-0423', date: '2026-05-12', reference: 'INV-2188', description: 'TechCorp Solutions — software license', debit: 18900, credit: 18900, status: 'posted' as const, source: 'AR', createdBy: 'Sarah Chen' },
  { number: 'JE-2026-0422', date: '2026-05-11', reference: 'ADJ-INV-Q2', description: 'Q2 inventory adjustment — physical count', debit: 12400, credit: 12400, status: 'draft' as const, source: 'Manual', createdBy: 'Jenna Park' },
  { number: 'JE-2026-0421', date: '2026-05-11', reference: 'PO-3089', description: 'Goods received — raw materials', debit: 42800, credit: 42800, status: 'posted' as const, source: 'Inventory', createdBy: 'System' },
  { number: 'JE-2026-0420', date: '2026-05-10', reference: 'REV-0419', description: 'Reversal: duplicate payment entry', debit: 8420, credit: 8420, status: 'reversed' as const, source: 'Manual', createdBy: 'Marcus Reid' },
  { number: 'JE-2026-0419', date: '2026-05-10', reference: 'EXP-2419', description: 'Marketing campaign — May launch', debit: 28400, credit: 28400, status: 'posted' as const, source: 'AP', createdBy: 'David Kumar' },
  { number: 'JE-2026-0418', date: '2026-05-09', reference: 'FX-USD-EUR', description: 'FX revaluation — month-end', debit: 4280, credit: 4280, status: 'posted' as const, source: 'Manual', createdBy: 'Sarah Chen' },
  { number: 'JE-2026-0417', date: '2026-05-09', reference: 'INV-2187', description: 'Global Manufacturing — order #4421', debit: 56200, credit: 56200, status: 'posted' as const, source: 'AR', createdBy: 'Sarah Chen' },
  { number: 'JE-2026-0416', date: '2026-05-08', reference: 'ACC-RENT', description: 'Accrued rent — May', debit: 12000, credit: 12000, status: 'draft' as const, source: 'Manual', createdBy: 'Jenna Park' },
  { number: 'JE-2026-0415', date: '2026-05-08', reference: 'INV-2186', description: 'Hospital Network — supply contract', debit: 124800, credit: 124800, status: 'posted' as const, source: 'AR', createdBy: 'Marcus Reid' },
];

export default function JournalEntriesPage() {
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('may-2026');
  const [status, setStatus] = useState('all');

  const filtered = entries.filter((e) => {
    if (status !== 'all' && e.status !== status) return false;
    if (search && !`${e.number} ${e.reference} ${e.description}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalDebit = filtered.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = filtered.reduce((sum, e) => sum + e.credit, 0);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Journal Entries"
        description="All manual and system-generated GL entries across your selected period."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Accounting', href: '/app/accounting' },
          { label: 'Journal Entries' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Upload className="size-4" /> Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm" asChild>
              <Link href="/app/accounting/journal/new">
                <Plus className="size-4" /> New entry
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total entries</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{filtered.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">{entries.filter(e => e.status === 'draft').length} drafts pending review</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total debit</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(totalDebit)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across {filtered.length} entries</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total credit</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(totalCredit)}</p>
          <p className="mt-1 text-xs text-success">Balanced · variance $0</p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by number, reference, description"
                className="w-72 pl-8"
              />
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-44">
                <Calendar className="size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="may-2026">May 2026</SelectItem>
                <SelectItem value="apr-2026">April 2026</SelectItem>
                <SelectItem value="mar-2026">March 2026</SelectItem>
                <SelectItem value="q2-2026">Q2 2026</SelectItem>
                <SelectItem value="ytd-2026">YTD 2026</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="posted">Posted</SelectItem>
                <SelectItem value="reversed">Reversed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="size-4" /> More filters
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="erp-table">
            <thead>
              <tr>
                <th className="w-40">Number</th>
                <th className="w-28">Date</th>
                <th className="w-32">Reference</th>
                <th>Description</th>
                <th className="w-24">Source</th>
                <th className="w-32 text-right">Debit</th>
                <th className="w-32 text-right">Credit</th>
                <th className="w-32">Created by</th>
                <th className="w-28">Status</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.number}>
                  <td className="font-mono text-xs font-medium text-primary">{e.number}</td>
                  <td className="text-xs text-muted-foreground">{formatDate(e.date)}</td>
                  <td className="font-mono text-xs">{e.reference}</td>
                  <td className="truncate font-medium">{e.description}</td>
                  <td>
                    <span className="rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-2xs font-medium uppercase">
                      {e.source}
                    </span>
                  </td>
                  <td className="text-right font-mono tabular-nums">{formatCurrency(e.debit)}</td>
                  <td className="text-right font-mono tabular-nums">{formatCurrency(e.credit)}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Avatar size="xs">
                        <AvatarFallback name={e.createdBy}>{initials(e.createdBy)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{e.createdBy}</span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={e.status} />
                  </td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><FileText className="size-4" /> View detail</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        {e.status === 'draft' && <DropdownMenuItem>Post entry</DropdownMenuItem>}
                        {e.status === 'posted' && <DropdownMenuItem>Reverse</DropdownMenuItem>}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {entries.length} entries</span>
          <div className="flex items-center gap-4">
            <span>Total DR: <span className="font-mono font-medium text-foreground">{formatCurrency(totalDebit)}</span></span>
            <span>Total CR: <span className="font-mono font-medium text-foreground">{formatCurrency(totalCredit)}</span></span>
          </div>
        </div>
      </Card>
    </div>
  );
}
