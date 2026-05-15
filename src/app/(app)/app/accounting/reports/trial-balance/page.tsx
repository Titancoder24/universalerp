'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Download,
  FileBarChart,
  FileText,
  Filter,
  RefreshCw,
  Search,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, cn } from '@/lib/utils';

type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

const accounts: Array<{ code: string; name: string; type: AccountType; debit: number; credit: number }> = [
  { code: '1010', name: 'Operating Cash', type: 'Asset', debit: 1248420, credit: 0 },
  { code: '1020', name: 'Petty Cash', type: 'Asset', debit: 4800, credit: 0 },
  { code: '1030', name: 'Money Market Fund', type: 'Asset', debit: 412000, credit: 0 },
  { code: '1100', name: 'Accounts Receivable', type: 'Asset', debit: 487320, credit: 0 },
  { code: '1110', name: 'Allowance for Doubtful Accts', type: 'Asset', debit: 0, credit: 18400 },
  { code: '1210', name: 'Raw Materials', type: 'Asset', debit: 324800, credit: 0 },
  { code: '1220', name: 'Work in Progress', type: 'Asset', debit: 198400, credit: 0 },
  { code: '1230', name: 'Finished Goods', type: 'Asset', debit: 319400, credit: 0 },
  { code: '1300', name: 'Prepaid Expenses', type: 'Asset', debit: 48200, credit: 0 },
  { code: '1510', name: 'Land', type: 'Asset', debit: 480000, credit: 0 },
  { code: '1520', name: 'Buildings', type: 'Asset', debit: 1240000, credit: 0 },
  { code: '1521', name: 'Accum Depr - Buildings', type: 'Asset', debit: 0, credit: 148000 },
  { code: '1530', name: 'Plant & Machinery', type: 'Asset', debit: 868000, credit: 0 },
  { code: '1531', name: 'Accum Depr - Machinery', type: 'Asset', debit: 0, credit: 184000 },
  { code: '1540', name: 'Vehicles', type: 'Asset', debit: 182000, credit: 0 },
  { code: '1541', name: 'Accum Depr - Vehicles', type: 'Asset', debit: 0, credit: 38000 },
  { code: '1550', name: 'Office Equipment', type: 'Asset', debit: 86400, credit: 0 },
  { code: '1551', name: 'Accum Depr - Equipment', type: 'Asset', debit: 0, credit: 22400 },
  { code: '2010', name: 'Accounts Payable', type: 'Liability', debit: 0, credit: 318450 },
  { code: '2020', name: 'Accrued Expenses', type: 'Liability', debit: 0, credit: 48200 },
  { code: '2030', name: 'Wages Payable', type: 'Liability', debit: 0, credit: 62400 },
  { code: '2040', name: 'Sales Tax Payable', type: 'Liability', debit: 0, credit: 28150 },
  { code: '2050', name: 'Income Tax Payable', type: 'Liability', debit: 0, credit: 18420 },
  { code: '2060', name: 'Customer Deposits', type: 'Liability', debit: 0, credit: 7280 },
  { code: '2510', name: 'Long-term Notes Payable', type: 'Liability', debit: 0, credit: 580000 },
  { code: '2520', name: 'Mortgage Payable', type: 'Liability', debit: 0, credit: 262000 },
  { code: '3010', name: 'Common Stock', type: 'Equity', debit: 0, credit: 500000 },
  { code: '3020', name: 'Additional Paid-in Capital', type: 'Equity', debit: 0, credit: 1200000 },
  { code: '3030', name: 'Retained Earnings', type: 'Equity', debit: 0, credit: 2147460 },
  { code: '4010', name: 'Product Sales', type: 'Revenue', debit: 0, credit: 1842500 },
  { code: '4020', name: 'Service Revenue', type: 'Revenue', debit: 0, credit: 412800 },
  { code: '4030', name: 'Other Revenue', type: 'Revenue', debit: 0, credit: 38420 },
  { code: '4040', name: 'Sales Returns', type: 'Revenue', debit: 9400, credit: 0 },
  { code: '5010', name: 'Raw Material Cost', type: 'Expense', debit: 624800, credit: 0 },
  { code: '5020', name: 'Direct Labor', type: 'Expense', debit: 412400, credit: 0 },
  { code: '5030', name: 'Manufacturing Overhead', type: 'Expense', debit: 218400, credit: 0 },
  { code: '5040', name: 'Freight In', type: 'Expense', debit: 50140, credit: 0 },
  { code: '6010', name: 'Salaries & Wages', type: 'Expense', debit: 248000, credit: 0 },
  { code: '6020', name: 'Rent Expense', type: 'Expense', debit: 84000, credit: 0 },
  { code: '6030', name: 'Utilities', type: 'Expense', debit: 28400, credit: 0 },
  { code: '6040', name: 'Marketing', type: 'Expense', debit: 78400, credit: 0 },
  { code: '6050', name: 'Insurance', type: 'Expense', debit: 32400, credit: 0 },
  { code: '6060', name: 'Depreciation', type: 'Expense', debit: 48400, credit: 0 },
  { code: '6070', name: 'Office Supplies', type: 'Expense', debit: 12400, credit: 0 },
  { code: '6080', name: 'Professional Fees', type: 'Expense', debit: 34000, credit: 0 },
];

const typeBadgeMap: Record<AccountType, string> = {
  Asset: 'bg-chart-1/10 text-chart-1',
  Liability: 'bg-chart-3/10 text-chart-3',
  Equity: 'bg-chart-5/10 text-chart-5',
  Revenue: 'bg-success/10 text-success',
  Expense: 'bg-warning/10 text-warning',
};

export default function TrialBalancePage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<AccountType | 'All'>('All');

  const filtered = accounts.filter((a) => {
    if (type !== 'All' && a.type !== type) return false;
    if (search && !`${a.code} ${a.name}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalDebit = filtered.reduce((s, a) => s + a.debit, 0);
  const totalCredit = filtered.reduce((s, a) => s + a.credit, 0);
  const balanced = totalDebit === totalCredit;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Trial Balance"
        description="All GL accounts with debit and credit balances for verification."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Accounting', href: '/app/accounting' },
          { label: 'Reports', href: '/app/accounting/reports' },
          { label: 'Trial Balance' },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/accounting/reports" aria-label="Back">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        }
        actions={
          <>
            <Select defaultValue="may-2026">
              <SelectTrigger className="w-44">
                <Calendar className="size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="may-2026">May 31, 2026</SelectItem>
                <SelectItem value="apr-2026">Apr 30, 2026</SelectItem>
                <SelectItem value="q1-2026">Q1 2026</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <RefreshCw className="size-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="size-4" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><FileBarChart className="size-4" /> Excel</DropdownMenuItem>
                <DropdownMenuItem><FileText className="size-4" /> PDF</DropdownMenuItem>
                <DropdownMenuItem>CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total accounts</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{filtered.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">of {accounts.length} total</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total debit</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(totalDebit)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across {filtered.filter(a => a.debit > 0).length} accounts</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total credit</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(totalCredit)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across {filtered.filter(a => a.credit > 0).length} accounts</p>
        </Card>
        <Card className={cn('p-4', balanced ? 'bg-success/5 border-success/30' : 'bg-destructive/5 border-destructive/30')}>
          <p className="text-xs font-medium text-muted-foreground">Status</p>
          <p className={cn('mt-1 text-2xl font-semibold tabular-nums', balanced ? 'text-success' : 'text-destructive')}>
            {balanced ? 'Balanced' : 'Out of balance'}
          </p>
          <p className="mt-1 text-xs">
            Variance: <span className={cn('font-mono', balanced ? 'text-success' : 'text-destructive')}>{formatCurrency(totalDebit - totalCredit)}</span>
          </p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search code or name"
                className="w-72 pl-8"
              />
            </div>
            <Select value={type} onValueChange={(v) => setType(v as AccountType | 'All')}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All account types</SelectItem>
                <SelectItem value="Asset">Assets</SelectItem>
                <SelectItem value="Liability">Liabilities</SelectItem>
                <SelectItem value="Equity">Equity</SelectItem>
                <SelectItem value="Revenue">Revenue</SelectItem>
                <SelectItem value="Expense">Expenses</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Badge variant="soft">As of May 31, 2026 · USD</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="erp-table">
            <thead>
              <tr>
                <th className="w-28">Code</th>
                <th>Account Name</th>
                <th className="w-32">Type</th>
                <th className="w-40 text-right">Debit</th>
                <th className="w-40 text-right">Credit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.code}>
                  <td className="font-mono text-xs tabular-nums">{a.code}</td>
                  <td className="font-medium">{a.name}</td>
                  <td>
                    <span className={cn('rounded-md px-1.5 py-0.5 text-2xs font-medium', typeBadgeMap[a.type])}>
                      {a.type}
                    </span>
                  </td>
                  <td className="text-right font-mono tabular-nums">
                    {a.debit > 0 ? formatCurrency(a.debit) : <span className="text-muted-foreground/40">—</span>}
                  </td>
                  <td className="text-right font-mono tabular-nums">
                    {a.credit > 0 ? formatCurrency(a.credit) : <span className="text-muted-foreground/40">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-primary/5 font-bold">
                <td colSpan={3} className="uppercase tracking-wide text-sm">Totals</td>
                <td className="text-right font-mono tabular-nums">{formatCurrency(totalDebit)}</td>
                <td className="text-right font-mono tabular-nums">{formatCurrency(totalCredit)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className={cn('flex items-center justify-between border-t border-border px-4 py-3 text-sm', balanced ? 'bg-success/5' : 'bg-destructive/5')}>
          <span className="text-muted-foreground">Variance check</span>
          <div className="flex items-center gap-2">
            {balanced && <CheckCircle2 className="size-4 text-success" />}
            <span className={cn('font-mono font-medium', balanced ? 'text-success' : 'text-destructive')}>
              {balanced ? 'Debits equal credits' : `Out of balance by ${formatCurrency(Math.abs(totalDebit - totalCredit))}`}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
