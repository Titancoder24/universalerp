'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronRight,
  Download,
  FileBarChart,
  FileText,
  Mail,
  RefreshCw,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
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

interface BSRow {
  group: 'A' | 'L' | 'E';
  parent?: string;
  code?: string;
  label: string;
  current: number;
  prior: number;
  level: number;
  isTotal?: boolean;
  isSubtotal?: boolean;
}

const rows: BSRow[] = [
  // ASSETS
  { group: 'A', label: 'ASSETS', current: 0, prior: 0, level: 0 },
  { group: 'A', label: 'Current Assets', current: 0, prior: 0, level: 0 },
  { group: 'A', parent: 'ca', code: '1010', label: 'Operating Cash', current: 1248420, prior: 1124300, level: 1 },
  { group: 'A', parent: 'ca', code: '1020', label: 'Petty Cash', current: 4800, prior: 4200, level: 1 },
  { group: 'A', parent: 'ca', code: '1030', label: 'Money Market Fund', current: 412000, prior: 384200, level: 1 },
  { group: 'A', parent: 'ca', code: '1100', label: 'Accounts Receivable', current: 487320, prior: 512400, level: 1 },
  { group: 'A', parent: 'ca', code: '1110', label: 'Allowance for Doubtful Accts', current: -18400, prior: -16800, level: 1 },
  { group: 'A', parent: 'ca', code: '1210', label: 'Raw Materials', current: 324800, prior: 298000, level: 1 },
  { group: 'A', parent: 'ca', code: '1220', label: 'Work in Progress', current: 198400, prior: 184200, level: 1 },
  { group: 'A', parent: 'ca', code: '1230', label: 'Finished Goods', current: 319400, prior: 286400, level: 1 },
  { group: 'A', parent: 'ca', code: '1300', label: 'Prepaid Expenses', current: 48200, prior: 42400, level: 1 },
  { group: 'A', label: 'Total Current Assets', current: 3024940, prior: 2819100, level: 0, isSubtotal: true },
  // Fixed Assets
  { group: 'A', label: 'Fixed Assets', current: 0, prior: 0, level: 0 },
  { group: 'A', parent: 'fa', code: '1510', label: 'Land', current: 480000, prior: 480000, level: 1 },
  { group: 'A', parent: 'fa', code: '1520', label: 'Buildings (net)', current: 1092000, prior: 1108000, level: 1 },
  { group: 'A', parent: 'fa', code: '1530', label: 'Plant & Machinery (net)', current: 684000, prior: 720000, level: 1 },
  { group: 'A', parent: 'fa', code: '1540', label: 'Vehicles (net)', current: 144000, prior: 158000, level: 1 },
  { group: 'A', parent: 'fa', code: '1550', label: 'Office Equipment (net)', current: 64000, prior: 72000, level: 1 },
  { group: 'A', label: 'Total Fixed Assets', current: 2464000, prior: 2538000, level: 0, isSubtotal: true },
  { group: 'A', label: 'TOTAL ASSETS', current: 5488940, prior: 5357100, level: 0, isTotal: true },
  // LIABILITIES
  { group: 'L', label: 'LIABILITIES', current: 0, prior: 0, level: 0 },
  { group: 'L', label: 'Current Liabilities', current: 0, prior: 0, level: 0 },
  { group: 'L', parent: 'cl', code: '2010', label: 'Accounts Payable', current: 318450, prior: 298000, level: 1 },
  { group: 'L', parent: 'cl', code: '2020', label: 'Accrued Expenses', current: 48200, prior: 52000, level: 1 },
  { group: 'L', parent: 'cl', code: '2030', label: 'Wages Payable', current: 62400, prior: 58400, level: 1 },
  { group: 'L', parent: 'cl', code: '2040', label: 'Sales Tax Payable', current: 28150, prior: 24800, level: 1 },
  { group: 'L', parent: 'cl', code: '2050', label: 'Income Tax Payable', current: 18420, prior: 14200, level: 1 },
  { group: 'L', parent: 'cl', code: '2060', label: 'Customer Deposits', current: 7280, prior: 8400, level: 1 },
  { group: 'L', label: 'Total Current Liabilities', current: 482900, prior: 455800, level: 0, isSubtotal: true },
  // LT Liab
  { group: 'L', label: 'Long-term Liabilities', current: 0, prior: 0, level: 0 },
  { group: 'L', parent: 'ltl', code: '2510', label: 'Long-term Notes Payable', current: 580000, prior: 620000, level: 1 },
  { group: 'L', parent: 'ltl', code: '2520', label: 'Mortgage Payable', current: 262000, prior: 280000, level: 1 },
  { group: 'L', label: 'Total Long-term Liabilities', current: 842000, prior: 900000, level: 0, isSubtotal: true },
  { group: 'L', label: 'TOTAL LIABILITIES', current: 1324900, prior: 1355800, level: 0, isTotal: true },
  // EQUITY
  { group: 'E', label: 'EQUITY', current: 0, prior: 0, level: 0 },
  { group: 'E', parent: 'eq', code: '3010', label: 'Common Stock', current: 500000, prior: 500000, level: 1 },
  { group: 'E', parent: 'eq', code: '3020', label: 'Additional Paid-in Capital', current: 1200000, prior: 1200000, level: 1 },
  { group: 'E', parent: 'eq', code: '3030', label: 'Retained Earnings', current: 2147460, prior: 2057700, level: 1 },
  { group: 'E', parent: 'eq', code: '3040', label: 'Current Year Earnings', current: 316580, prior: 243600, level: 1 },
  { group: 'E', label: 'TOTAL EQUITY', current: 4164040, prior: 4001300, level: 0, isTotal: true },
  { group: 'E', label: 'TOTAL LIABILITIES + EQUITY', current: 5488940, prior: 5357100, level: 0, isTotal: true },
];

const groupKeys: Record<string, string> = {
  'Current Assets': 'ca',
  'Fixed Assets': 'fa',
  'Current Liabilities': 'cl',
  'Long-term Liabilities': 'ltl',
  'EQUITY': 'eq',
};

export default function BalanceSheetPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['ca', 'fa', 'cl', 'ltl', 'eq']));

  const toggle = (key: string) => {
    const next = new Set(expanded);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setExpanded(next);
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Balance Sheet"
        description="Statement of financial position as of period end."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Accounting', href: '/app/accounting' },
          { label: 'Reports', href: '/app/accounting/reports' },
          { label: 'Balance Sheet' },
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
              <SelectTrigger className="w-48">
                <Calendar className="size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="may-2026">As of May 31, 2026</SelectItem>
                <SelectItem value="apr-2026">As of Apr 30, 2026</SelectItem>
                <SelectItem value="q1-2026">As of Mar 31, 2026</SelectItem>
                <SelectItem value="fy2025">As of Dec 31, 2025</SelectItem>
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
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm">
              <Share2 className="size-4" /> Share
            </Button>
          </>
        }
      />

      <div className="flex items-center justify-end">
        <Badge variant="soft">Universal ERP Inc. · Consolidated · USD</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total assets</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(5488940)}</p>
          <p className="mt-1 text-xs text-success">+2.5% vs prior</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total liabilities</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(1324900)}</p>
          <p className="mt-1 text-xs text-success">-2.3% vs prior</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total equity</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(4164040)}</p>
          <p className="mt-1 text-xs text-success">+4.1% vs prior</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Current ratio</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">6.26</p>
          <p className="mt-1 text-xs text-success">Strong liquidity</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statement of Financial Position</CardTitle>
          <CardDescription>As of May 31, 2026 · all amounts in USD</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Account</th>
                  <th className="text-right">May 31, 2026</th>
                  <th className="text-right">Apr 30, 2026</th>
                  <th className="text-right">Change</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  // Top-level header
                  if (r.level === 0 && r.current === 0 && r.prior === 0) {
                    const groupKey = groupKeys[r.label];
                    if (groupKey) {
                      const isExpanded = expanded.has(groupKey);
                      return (
                        <tr key={i} className="bg-muted/20">
                          <td className="font-semibold">
                            <button onClick={() => toggle(groupKey)} className="inline-flex items-center gap-1 hover:text-primary">
                              {isExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                              {r.label}
                            </button>
                          </td>
                          <td colSpan={3} />
                        </tr>
                      );
                    }
                    return (
                      <tr key={i} className="bg-muted/40">
                        <td className="font-bold uppercase tracking-wide text-xs">{r.label}</td>
                        <td colSpan={3} />
                      </tr>
                    );
                  }

                  if (r.parent && !expanded.has(r.parent)) return null;

                  const change = r.current - r.prior;
                  return (
                    <tr
                      key={i}
                      className={cn(
                        r.isTotal && 'border-t-2 border-border bg-primary/5 font-bold',
                        r.isSubtotal && 'border-t border-border/60 bg-muted/20 font-semibold',
                      )}
                    >
                      <td>
                        <div className="flex items-center gap-2" style={{ paddingLeft: r.level === 1 ? '24px' : '0' }}>
                          {r.code && <span className="font-mono text-2xs text-muted-foreground">{r.code}</span>}
                          <span className={cn(r.isTotal && 'uppercase tracking-wide')}>{r.label}</span>
                        </div>
                      </td>
                      <td className={cn('text-right font-mono tabular-nums', r.current < 0 && 'text-destructive')}>
                        {formatCurrency(r.current)}
                      </td>
                      <td className={cn('text-right font-mono tabular-nums text-muted-foreground', r.prior < 0 && 'text-destructive/70')}>
                        {formatCurrency(r.prior)}
                      </td>
                      <td className={cn('text-right font-mono tabular-nums', change > 0 && 'text-success', change < 0 && 'text-destructive')}>
                        {change !== 0 && formatCurrency(change)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Ratios</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Current ratio</p>
            <p className="mt-1 text-xl font-semibold">6.26</p>
            <p className="mt-1 text-xs text-muted-foreground">CA / CL</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Quick ratio</p>
            <p className="mt-1 text-xl font-semibold">4.55</p>
            <p className="mt-1 text-xs text-muted-foreground">(CA - Inv) / CL</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Debt-to-equity</p>
            <p className="mt-1 text-xl font-semibold">0.32</p>
            <p className="mt-1 text-xs text-success">Healthy leverage</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Working capital</p>
            <p className="mt-1 text-xl font-semibold">{formatCurrency(2542040)}</p>
            <p className="mt-1 text-xs text-muted-foreground">CA - CL</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
