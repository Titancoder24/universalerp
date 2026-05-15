'use client';

import { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, cn } from '@/lib/utils';

type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

interface Account {
  code: string;
  name: string;
  type: AccountType;
  balance: number;
  parent?: string;
  isHeader?: boolean;
}

const accounts: Account[] = [
  // ASSETS — Current
  { code: '1000', name: 'Current Assets', type: 'Asset', balance: 1842380, isHeader: true },
  { code: '1010', name: 'Operating Cash', type: 'Asset', balance: 1248420, parent: '1000' },
  { code: '1020', name: 'Petty Cash', type: 'Asset', balance: 4800, parent: '1000' },
  { code: '1030', name: 'Money Market Fund', type: 'Asset', balance: 412000, parent: '1000' },
  { code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: 487320, parent: '1000' },
  { code: '1110', name: 'Allowance for Doubtful Accts', type: 'Asset', balance: -18400, parent: '1000' },
  { code: '1200', name: 'Inventory', type: 'Asset', balance: 842600, isHeader: true },
  { code: '1210', name: 'Raw Materials', type: 'Asset', balance: 324800, parent: '1200' },
  { code: '1220', name: 'Work in Progress', type: 'Asset', balance: 198400, parent: '1200' },
  { code: '1230', name: 'Finished Goods', type: 'Asset', balance: 319400, parent: '1200' },
  { code: '1240', name: 'Inventory Reserve', type: 'Asset', balance: -12400, parent: '1200' },
  { code: '1300', name: 'Prepaid Expenses', type: 'Asset', balance: 48200, parent: '1000' },
  { code: '1310', name: 'Prepaid Insurance', type: 'Asset', balance: 18400, parent: '1300' },
  { code: '1320', name: 'Prepaid Rent', type: 'Asset', balance: 24000, parent: '1300' },
  // ASSETS — Fixed
  { code: '1500', name: 'Fixed Assets', type: 'Asset', balance: 2418900, isHeader: true },
  { code: '1510', name: 'Land', type: 'Asset', balance: 480000, parent: '1500' },
  { code: '1520', name: 'Buildings', type: 'Asset', balance: 1240000, parent: '1500' },
  { code: '1521', name: 'Accum Depr - Buildings', type: 'Asset', balance: -148000, parent: '1500' },
  { code: '1530', name: 'Plant & Machinery', type: 'Asset', balance: 868000, parent: '1500' },
  { code: '1531', name: 'Accum Depr - Machinery', type: 'Asset', balance: -184000, parent: '1500' },
  { code: '1540', name: 'Vehicles', type: 'Asset', balance: 182000, parent: '1500' },
  { code: '1541', name: 'Accum Depr - Vehicles', type: 'Asset', balance: -38000, parent: '1500' },
  { code: '1550', name: 'Office Equipment', type: 'Asset', balance: 86400, parent: '1500' },
  { code: '1551', name: 'Accum Depr - Equipment', type: 'Asset', balance: -22400, parent: '1500' },
  // LIABILITIES
  { code: '2000', name: 'Current Liabilities', type: 'Liability', balance: 482900, isHeader: true },
  { code: '2010', name: 'Accounts Payable', type: 'Liability', balance: 318450, parent: '2000' },
  { code: '2020', name: 'Accrued Expenses', type: 'Liability', balance: 48200, parent: '2000' },
  { code: '2030', name: 'Wages Payable', type: 'Liability', balance: 62400, parent: '2000' },
  { code: '2040', name: 'Sales Tax Payable', type: 'Liability', balance: 28150, parent: '2000' },
  { code: '2050', name: 'Income Tax Payable', type: 'Liability', balance: 18420, parent: '2000' },
  { code: '2060', name: 'Customer Deposits', type: 'Liability', balance: 7280, parent: '2000' },
  { code: '2500', name: 'Long-term Liabilities', type: 'Liability', balance: 842000, isHeader: true },
  { code: '2510', name: 'Long-term Notes Payable', type: 'Liability', balance: 580000, parent: '2500' },
  { code: '2520', name: 'Mortgage Payable', type: 'Liability', balance: 262000, parent: '2500' },
  // EQUITY
  { code: '3000', name: 'Equity', type: 'Equity', balance: 3138380, isHeader: true },
  { code: '3010', name: 'Common Stock', type: 'Equity', balance: 500000, parent: '3000' },
  { code: '3020', name: 'Additional Paid-in Capital', type: 'Equity', balance: 1200000, parent: '3000' },
  { code: '3030', name: 'Retained Earnings', type: 'Equity', balance: 1025800, parent: '3000' },
  { code: '3040', name: 'Current Year Earnings', type: 'Equity', balance: 412580, parent: '3000' },
  // REVENUE
  { code: '4000', name: 'Revenue', type: 'Revenue', balance: 2284320, isHeader: true },
  { code: '4010', name: 'Product Sales', type: 'Revenue', balance: 1842500, parent: '4000' },
  { code: '4020', name: 'Service Revenue', type: 'Revenue', balance: 412800, parent: '4000' },
  { code: '4030', name: 'Other Revenue', type: 'Revenue', balance: 38420, parent: '4000' },
  { code: '4040', name: 'Sales Returns', type: 'Revenue', balance: -9400, parent: '4000' },
  // EXPENSES
  { code: '5000', name: 'Cost of Goods Sold', type: 'Expense', balance: 1305740, isHeader: true },
  { code: '5010', name: 'Raw Material Cost', type: 'Expense', balance: 624800, parent: '5000' },
  { code: '5020', name: 'Direct Labor', type: 'Expense', balance: 412400, parent: '5000' },
  { code: '5030', name: 'Manufacturing Overhead', type: 'Expense', balance: 218400, parent: '5000' },
  { code: '5040', name: 'Freight In', type: 'Expense', balance: 50140, parent: '5000' },
  { code: '6000', name: 'Operating Expenses', type: 'Expense', balance: 566000, isHeader: true },
  { code: '6010', name: 'Salaries & Wages', type: 'Expense', balance: 248000, parent: '6000' },
  { code: '6020', name: 'Rent Expense', type: 'Expense', balance: 84000, parent: '6000' },
  { code: '6030', name: 'Utilities', type: 'Expense', balance: 28400, parent: '6000' },
  { code: '6040', name: 'Marketing', type: 'Expense', balance: 78400, parent: '6000' },
  { code: '6050', name: 'Insurance', type: 'Expense', balance: 32400, parent: '6000' },
  { code: '6060', name: 'Depreciation', type: 'Expense', balance: 48400, parent: '6000' },
  { code: '6070', name: 'Office Supplies', type: 'Expense', balance: 12400, parent: '6000' },
  { code: '6080', name: 'Professional Fees', type: 'Expense', balance: 34000, parent: '6000' },
];

const typeBadgeMap: Record<AccountType, string> = {
  Asset: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  Liability: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  Equity: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
  Revenue: 'bg-success/10 text-success border-success/20',
  Expense: 'bg-warning/10 text-warning border-warning/20',
};

export default function ChartOfAccountsPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<AccountType | 'All'>('All');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['1000', '1200', '1500', '2000', '2500', '3000', '4000', '5000', '6000']));

  const toggle = (code: string) => {
    const next = new Set(expanded);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    setExpanded(next);
  };

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      if (filterType !== 'All' && a.type !== filterType) return false;
      if (search && !`${a.code} ${a.name}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, filterType]);

  const totals = useMemo(() => {
    const t = { Asset: 0, Liability: 0, Equity: 0, Revenue: 0, Expense: 0 };
    accounts.filter((a) => !a.isHeader).forEach((a) => { t[a.type] += a.balance; });
    return t;
  }, []);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Chart of Accounts"
        description="Hierarchical view of every account across the general ledger."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Accounting', href: '/app/accounting' },
          { label: 'Chart of Accounts' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Upload className="size-4" /> Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New account
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {(Object.keys(totals) as AccountType[]).map((t) => (
          <Card key={t}>
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground">{t}s</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{formatCurrency(totals[t])}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {accounts.filter((a) => a.type === t && !a.isHeader).length} accounts
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code or name"
              className="pl-8"
            />
          </div>
          <Tabs value={filterType} onValueChange={(v) => setFilterType(v as AccountType | 'All')}>
            <TabsList variant="pills">
              {(['All', 'Asset', 'Liability', 'Equity', 'Revenue', 'Expense'] as const).map((t) => (
                <TabsTrigger key={t} variant="pills" value={t}>{t}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="overflow-x-auto">
          <table className="erp-table">
            <thead>
              <tr>
                <th className="w-32">Code</th>
                <th>Name</th>
                <th className="w-32">Type</th>
                <th className="w-44 text-right">Balance</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                if (a.parent && !expanded.has(a.parent) && filterType === 'All' && !search) return null;
                const isExpandable = a.isHeader;
                const isExpanded = expanded.has(a.code);
                return (
                  <tr key={a.code} className={cn(a.isHeader && 'bg-muted/30 font-medium')}>
                    <td className="font-mono text-xs tabular-nums">
                      <div className="flex items-center gap-1.5" style={{ paddingLeft: a.parent ? '24px' : '0' }}>
                        {isExpandable ? (
                          <button onClick={() => toggle(a.code)} className="text-muted-foreground hover:text-foreground">
                            {isExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                          </button>
                        ) : (
                          <span className="w-3.5" />
                        )}
                        <span className={a.isHeader ? 'font-semibold' : ''}>{a.code}</span>
                      </div>
                    </td>
                    <td>
                      <span className={a.isHeader ? 'font-semibold' : ''}>{a.name}</span>
                    </td>
                    <td>
                      <span className={cn('rounded-md border px-1.5 py-0.5 text-2xs font-medium', typeBadgeMap[a.type])}>
                        {a.type}
                      </span>
                    </td>
                    <td className={cn('text-right font-mono tabular-nums', a.balance < 0 && 'text-destructive')}>
                      {formatCurrency(a.balance)}
                    </td>
                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><FileText className="size-4" /> View ledger</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Add sub-account</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          {filtered.length} account{filtered.length === 1 ? '' : 's'} shown · last updated 4 minutes ago
        </div>
      </Card>
    </div>
  );
}
