'use client';

import { useState } from 'react';
import {
  ArrowLeftRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Download,
  Eye,
  Landmark,
  Link as LinkIcon,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Sparkles,
  Upload,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

const bankAccounts = [
  { id: '1', name: 'Operating Account', bank: 'Chase Business', number: '****4218', balance: 1248420, lastReconciled: '2026-05-12', status: 'connected' as const, type: 'Checking', color: 'bg-chart-1' },
  { id: '2', name: 'Payroll Account', bank: 'Bank of America', number: '****7849', balance: 184200, lastReconciled: '2026-05-10', status: 'connected' as const, type: 'Checking', color: 'bg-chart-2' },
  { id: '3', name: 'Money Market', bank: 'Wells Fargo', number: '****2389', balance: 412000, lastReconciled: '2026-05-08', status: 'connected' as const, type: 'Savings', color: 'bg-chart-4' },
  { id: '4', name: 'Petty Cash', bank: 'In-House', number: 'PC-001', balance: 4800, lastReconciled: '2026-05-14', status: 'manual' as const, type: 'Cash', color: 'bg-chart-6' },
  { id: '5', name: 'EU Operations', bank: 'HSBC UK', number: '****5821', balance: 285420, lastReconciled: '2026-05-09', status: 'connected' as const, type: 'Checking', color: 'bg-chart-3' },
  { id: '6', name: 'Capital Reserve', bank: 'Goldman Sachs', number: '****9412', balance: 705480, lastReconciled: '2026-05-05', status: 'connected' as const, type: 'Investment', color: 'bg-chart-5' },
];

const statementLines = [
  { id: 's1', date: '2026-05-14', description: 'ACH DEPOSIT — Acme Industries', amount: 24500, type: 'credit', matched: 'm1', confidence: 98 },
  { id: 's2', date: '2026-05-14', description: 'CHECK 1842 — Global Steel Supply', amount: -8420, type: 'debit', matched: 'm2', confidence: 95 },
  { id: 's3', date: '2026-05-13', description: 'WIRE OUT — Metro Property Mgmt', amount: -28000, type: 'debit', matched: 'm3', confidence: 92 },
  { id: 's4', date: '2026-05-13', description: 'ACH DEPOSIT — TechCorp Solutions', amount: 18900, type: 'credit', matched: 'm4', confidence: 87 },
  { id: 's5', date: '2026-05-13', description: 'BANK FEE — Monthly maintenance', amount: -125, type: 'debit', matched: null, confidence: 0 },
  { id: 's6', date: '2026-05-12', description: 'ACH DEPOSIT — Hospital Network', amount: 54800, type: 'credit', matched: null, confidence: 72 },
  { id: 's7', date: '2026-05-12', description: 'CARD PAYMENT — Office Supply Co', amount: -1240, type: 'debit', matched: 'm5', confidence: 89 },
  { id: 's8', date: '2026-05-11', description: 'DIRECT DEBIT — BlueChip Insurance', amount: -12400, type: 'debit', matched: 'm6', confidence: 96 },
];

const journalLines = [
  { id: 'm1', date: '2026-05-14', reference: 'INV-2189', account: 'Accounts Receivable', amount: 24500, type: 'debit' },
  { id: 'm2', date: '2026-05-14', reference: 'BILL-4521', account: 'Accounts Payable', amount: -8420, type: 'credit' },
  { id: 'm3', date: '2026-05-13', reference: 'BILL-4517', account: 'Rent Expense', amount: -28000, type: 'credit' },
  { id: 'm4', date: '2026-05-13', reference: 'INV-2188', account: 'Accounts Receivable', amount: 18900, type: 'debit' },
  { id: 'm5', date: '2026-05-12', reference: 'EXP-2412', account: 'Office Supplies', amount: -1240, type: 'credit' },
  { id: 'm6', date: '2026-05-11', reference: 'BILL-4516', account: 'Insurance', amount: -12400, type: 'credit' },
  { id: 'm7', date: '2026-05-11', reference: 'INV-2187', account: 'Accounts Receivable', amount: 56200, type: 'debit' },
];

export default function BankingPage() {
  const [selectedAccount, setSelectedAccount] = useState('1');
  const acct = bankAccounts.find((a) => a.id === selectedAccount) ?? bankAccounts[0];
  const matchedCount = statementLines.filter((l) => l.matched).length;
  const matchPct = (matchedCount / statementLines.length) * 100;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Banking"
        description="Bank account balances and AI-assisted reconciliation."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Accounting', href: '/app/accounting' },
          { label: 'Banking' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Upload className="size-4" /> Import statement
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="size-4" /> Sync all
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> Add account
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bankAccounts.map((a) => (
          <Card
            key={a.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              selectedAccount === a.id && 'ring-2 ring-primary/60',
            )}
            onClick={() => setSelectedAccount(a.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${a.color} text-white`}>
                    <Landmark className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.bank} · {a.number}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Eye className="size-4" /> View transactions</DropdownMenuItem>
                    <DropdownMenuItem><RefreshCw className="size-4" /> Sync now</DropdownMenuItem>
                    <DropdownMenuItem>Edit account</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Disconnect</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-semibold tabular-nums">{formatCurrency(a.balance)}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last reconciled {formatDate(a.lastReconciled)}</span>
                  <span className={cn(
                    'rounded-md px-1.5 py-0.5 text-2xs font-medium capitalize',
                    a.status === 'connected' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                  )}>
                    {a.status === 'connected' ? <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Connected</span> : 'Manual'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="size-5 text-primary" />
              Reconciliation Workspace — {acct.name}
            </CardTitle>
            <CardDescription>
              {matchedCount} of {statementLines.length} matched · last sync 12 minutes ago
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Match rate</p>
              <p className="font-mono text-sm font-semibold">{matchPct.toFixed(0)}%</p>
            </div>
            <Button variant="outline" size="sm">
              <Sparkles className="size-4" /> AI auto-match
            </Button>
            <Button size="sm">
              <CheckCircle2 className="size-4" /> Complete reconciliation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={matchPct} indicatorClassName="bg-primary" className="mb-6 h-2" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold">Bank Statement</h4>
                <Badge variant="soft" size="sm">{statementLines.length} lines</Badge>
              </div>
              <div className="space-y-2">
                {statementLines.map((line) => (
                  <div
                    key={line.id}
                    className={cn(
                      'rounded-lg border p-3 transition-colors',
                      line.matched
                        ? 'border-success/40 bg-success/5'
                        : line.confidence > 80
                          ? 'border-warning/40 bg-warning/5'
                          : 'border-border hover:bg-muted/40',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{line.description}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(line.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn('font-mono text-sm font-semibold tabular-nums', line.type === 'credit' ? 'text-success' : 'text-foreground')}>
                          {line.type === 'credit' ? '+' : ''}{formatCurrency(line.amount)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2 text-xs">
                      {line.matched ? (
                        <span className="inline-flex items-center gap-1 text-success">
                          <CheckCircle2 className="size-3" />
                          Matched to {line.matched}
                        </span>
                      ) : line.confidence > 0 ? (
                        <span className="inline-flex items-center gap-1 text-warning">
                          <Sparkles className="size-3" />
                          AI suggests match · {line.confidence}% confidence
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No suggested match</span>
                      )}
                      {!line.matched && (
                        <Button variant="ghost" size="xs">Find match <ChevronRight className="size-3" /></Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold">Journal Entries</h4>
                <Badge variant="soft" size="sm">{journalLines.length} lines</Badge>
              </div>
              <div className="space-y-2">
                {journalLines.map((j) => {
                  const isMatched = statementLines.some((s) => s.matched === j.id);
                  return (
                    <div
                      key={j.id}
                      className={cn(
                        'rounded-lg border p-3 transition-colors',
                        isMatched ? 'border-success/40 bg-success/5' : 'border-border hover:bg-muted/40',
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-medium text-primary">{j.reference}</span>
                            {isMatched && <CheckCircle2 className="size-3 text-success" />}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">{j.account}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(j.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className={cn('font-mono text-sm font-semibold tabular-nums', j.type === 'debit' ? 'text-success' : 'text-foreground')}>
                            {j.type === 'debit' ? '+' : ''}{formatCurrency(j.amount)}
                          </p>
                        </div>
                      </div>
                      {!isMatched && (
                        <div className="mt-2 border-t border-border/40 pt-2">
                          <Button variant="ghost" size="xs">
                            <LinkIcon className="size-3" /> Link to statement line
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            Reconciliation Summary
          </CardTitle>
          <CardDescription>Current period: May 2026</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Statement balance</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{formatCurrency(1248420)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Book balance</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{formatCurrency(1249545)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Outstanding deposits</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{formatCurrency(4200)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Outstanding checks</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{formatCurrency(3075)}</p>
          </div>
          <div className="col-span-2 md:col-span-4 border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Adjusted variance</span>
              <span className="font-mono text-lg font-semibold text-success tabular-nums">{formatCurrency(0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
