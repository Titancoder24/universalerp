'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronDown,
  ChevronRight,
  Download,
  FileBarChart,
  FileText,
  Mail,
  Printer,
  RefreshCw,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface Row {
  code?: string;
  label: string;
  current: number;
  prior: number;
  level: number;
  isTotal?: boolean;
  isSubtotal?: boolean;
  parent?: string;
}

const rows: Row[] = [
  // Revenue
  { label: 'REVENUE', current: 0, prior: 0, level: 0 },
  { code: '4010', label: 'Product Sales', current: 1842500, prior: 1648300, level: 1, parent: 'rev' },
  { code: '4020', label: 'Service Revenue', current: 412800, prior: 384200, level: 1, parent: 'rev' },
  { code: '4030', label: 'Other Revenue', current: 38420, prior: 32400, level: 1, parent: 'rev' },
  { code: '4040', label: 'Sales Returns & Allowances', current: -9400, prior: -12800, level: 1, parent: 'rev' },
  { label: 'Total Revenue', current: 2284320, prior: 2052100, level: 0, isSubtotal: true },
  // COGS
  { label: 'COST OF GOODS SOLD', current: 0, prior: 0, level: 0 },
  { code: '5010', label: 'Raw Material Cost', current: 624800, prior: 568200, level: 1, parent: 'cogs' },
  { code: '5020', label: 'Direct Labor', current: 412400, prior: 384200, level: 1, parent: 'cogs' },
  { code: '5030', label: 'Manufacturing Overhead', current: 218400, prior: 208400, level: 1, parent: 'cogs' },
  { code: '5040', label: 'Freight In', current: 50140, prior: 48200, level: 1, parent: 'cogs' },
  { label: 'Total COGS', current: 1305740, prior: 1209000, level: 0, isSubtotal: true },
  { label: 'GROSS PROFIT', current: 978580, prior: 843100, level: 0, isTotal: true },
  // Operating Expenses
  { label: 'OPERATING EXPENSES', current: 0, prior: 0, level: 0 },
  { code: '6010', label: 'Salaries & Wages', current: 248000, prior: 232000, level: 1, parent: 'opex' },
  { code: '6020', label: 'Rent Expense', current: 84000, prior: 80000, level: 1, parent: 'opex' },
  { code: '6030', label: 'Utilities', current: 28400, prior: 26800, level: 1, parent: 'opex' },
  { code: '6040', label: 'Marketing', current: 78400, prior: 62400, level: 1, parent: 'opex' },
  { code: '6050', label: 'Insurance', current: 32400, prior: 31200, level: 1, parent: 'opex' },
  { code: '6060', label: 'Depreciation', current: 48400, prior: 44200, level: 1, parent: 'opex' },
  { code: '6070', label: 'Office Supplies', current: 12400, prior: 13200, level: 1, parent: 'opex' },
  { code: '6080', label: 'Professional Fees', current: 34000, prior: 28400, level: 1, parent: 'opex' },
  { label: 'Total Operating Expenses', current: 566000, prior: 518200, level: 0, isSubtotal: true },
  { label: 'OPERATING INCOME', current: 412580, prior: 324900, level: 0, isTotal: true },
  // Other
  { label: 'OTHER INCOME / EXPENSE', current: 0, prior: 0, level: 0 },
  { code: '7010', label: 'Interest Income', current: 4280, prior: 3800, level: 1, parent: 'other' },
  { code: '7020', label: 'Interest Expense', current: -18400, prior: -19200, level: 1, parent: 'other' },
  { code: '7030', label: 'FX Gain/(Loss)', current: 2400, prior: -1200, level: 1, parent: 'other' },
  { label: 'Net Other Income', current: -11720, prior: -16600, level: 0, isSubtotal: true },
  { label: 'NET INCOME BEFORE TAX', current: 400860, prior: 308300, level: 0, isTotal: true },
  { code: '8010', label: 'Income Tax Expense', current: 84180, prior: 64700, level: 1 },
  { label: 'NET INCOME', current: 316680, prior: 243600, level: 0, isTotal: true },
];

export default function PnLPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['rev', 'cogs', 'opex', 'other']));
  const [view, setView] = useState<'comparative' | 'budget'>('comparative');

  const toggle = (key: string) => {
    const next = new Set(expanded);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setExpanded(next);
  };

  const pctChange = (curr: number, prior: number) => {
    if (prior === 0) return 0;
    return ((curr - prior) / Math.abs(prior)) * 100;
  };

  const groupMap: Record<string, string> = {
    'REVENUE': 'rev',
    'COST OF GOODS SOLD': 'cogs',
    'OPERATING EXPENSES': 'opex',
    'OTHER INCOME / EXPENSE': 'other',
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Profit & Loss Statement"
        description="Revenue, expenses, and net income for the selected period."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Accounting', href: '/app/accounting' },
          { label: 'Reports', href: '/app/accounting/reports' },
          { label: 'P&L' },
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
                <SelectItem value="may-2026">May 2026</SelectItem>
                <SelectItem value="q2-2026">Q2 2026</SelectItem>
                <SelectItem value="ytd-2026">YTD 2026</SelectItem>
                <SelectItem value="fy2025">FY 2025</SelectItem>
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
                <DropdownMenuItem><FileBarChart className="size-4" /> Excel (.xlsx)</DropdownMenuItem>
                <DropdownMenuItem><FileText className="size-4" /> PDF</DropdownMenuItem>
                <DropdownMenuItem>CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline">
              <Mail className="size-4" /> Email
            </Button>
            <Button size="sm">
              <Share2 className="size-4" /> Share
            </Button>
          </>
        }
      />

      <div className="flex items-center justify-between">
        <Tabs value={view} onValueChange={(v) => setView(v as 'comparative' | 'budget')}>
          <TabsList variant="pills">
            <TabsTrigger variant="pills" value="comparative">vs Prior Period</TabsTrigger>
            <TabsTrigger variant="pills" value="budget">vs Budget</TabsTrigger>
          </TabsList>
        </Tabs>
        <Badge variant="soft">Universal ERP Inc. · Consolidated · USD</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Revenue</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(2284320)}</p>
          <p className="mt-1 text-xs text-success font-medium">+11.3% YoY</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Gross profit</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(978580)}</p>
          <p className="mt-1 text-xs text-success font-medium">42.8% margin</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Operating income</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(412580)}</p>
          <p className="mt-1 text-xs text-success font-medium">18.1% margin</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Net income</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(316680)}</p>
          <p className="mt-1 text-xs text-success font-medium">+30% YoY</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income Statement — May 2026</CardTitle>
          <CardDescription>Comparison with same period prior year</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Account</th>
                  <th className="text-right">Current Period</th>
                  <th className="text-right">Prior Period</th>
                  <th className="text-right">$ Change</th>
                  <th className="text-right">% Change</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  // Group header — toggleable
                  if (r.level === 0 && !r.isTotal && !r.isSubtotal) {
                    const groupKey = groupMap[r.label];
                    if (!groupKey) {
                      return (
                        <tr key={i} className="bg-muted/30">
                          <td className="font-bold uppercase tracking-wide text-xs">{r.label}</td>
                          <td colSpan={4} />
                        </tr>
                      );
                    }
                    const isExpanded = expanded.has(groupKey);
                    return (
                      <tr key={i} className="bg-muted/30">
                        <td className="font-bold uppercase tracking-wide text-xs">
                          <button onClick={() => toggle(groupKey)} className="inline-flex items-center gap-1 hover:text-primary">
                            {isExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                            {r.label}
                          </button>
                        </td>
                        <td colSpan={4} />
                      </tr>
                    );
                  }

                  // Line items — hide if parent collapsed
                  if (r.parent && !expanded.has(r.parent)) return null;

                  const change = r.current - r.prior;
                  const pct = pctChange(r.current, r.prior);

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
                      <td className="text-right font-mono tabular-nums">
                        {formatCurrency(r.current)}
                      </td>
                      <td className="text-right font-mono tabular-nums text-muted-foreground">
                        {formatCurrency(r.prior)}
                      </td>
                      <td className={cn('text-right font-mono tabular-nums', change > 0 && 'text-success', change < 0 && 'text-destructive')}>
                        {change !== 0 && (
                          <span className="inline-flex items-center gap-0.5">
                            {change > 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                            {formatCurrency(Math.abs(change))}
                          </span>
                        )}
                      </td>
                      <td className={cn('text-right font-mono tabular-nums', pct > 0 && 'text-success', pct < 0 && 'text-destructive')}>
                        {pct !== 0 && `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`}
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
          <CardTitle>Key Margins & Ratios</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Gross margin</p>
            <p className="mt-1 text-xl font-semibold">42.8%</p>
            <p className="mt-1 text-xs text-success">+1.7pp vs prior</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Operating margin</p>
            <p className="mt-1 text-xl font-semibold">18.1%</p>
            <p className="mt-1 text-xs text-success">+2.3pp vs prior</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Net margin</p>
            <p className="mt-1 text-xl font-semibold">13.9%</p>
            <p className="mt-1 text-xs text-success">+2.0pp vs prior</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">OpEx ratio</p>
            <p className="mt-1 text-xl font-semibold">24.8%</p>
            <p className="mt-1 text-xs text-warning">+0.6pp vs prior</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
