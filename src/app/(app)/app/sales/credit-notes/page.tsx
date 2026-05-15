'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowDownUp,
  ArrowLeftRight,
  Download,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { creditNotes, type CreditNoteStatus } from '../_data';
import { formatCurrency, formatDate, initials } from '@/lib/utils';

const tabs: { label: string; value: CreditNoteStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Issued', value: 'issued' },
  { label: 'Applied', value: 'applied' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function CreditNotesPage() {
  const [search, setSearch] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<CreditNoteStatus | 'all'>('all');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    return creditNotes.filter((cn) => {
      if (activeTab !== 'all' && cn.status !== activeTab) return false;
      if (q && !cn.number.toLowerCase().includes(q) && !cn.customer.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [search, activeTab]);

  const stats = {
    total: creditNotes.reduce((acc, cn) => acc + cn.amount, 0),
    applied: creditNotes
      .filter((cn) => cn.status === 'applied')
      .reduce((acc, cn) => acc + cn.amount, 0),
    pending: creditNotes
      .filter((cn) => ['draft', 'issued'].includes(cn.status))
      .reduce((acc, cn) => acc + cn.amount, 0),
    refunded: creditNotes
      .filter((cn) => cn.status === 'refunded')
      .reduce((acc, cn) => acc + cn.amount, 0),
  };

  const allSelected = filtered.length > 0 && filtered.every((cn) => selected.has(cn.id));
  const someSelected = filtered.some((cn) => selected.has(cn.id));

  const toggleOne = (id: string) => {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    setSelected(n);
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Credit Notes"
        description={`${creditNotes.length} credit notes · ${formatCurrency(stats.total)} total value`}
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Sales', href: '/app/sales' },
          { label: 'Credit Notes' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New credit note
            </Button>
          </>
        }
      />

      <div className="space-y-4 p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Total issued</p>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums">
              {formatCurrency(stats.total)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{creditNotes.length} notes</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Applied</p>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums text-success">
              {formatCurrency(stats.applied)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {creditNotes.filter((cn) => cn.status === 'applied').length} applied
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Pending</p>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums text-warning">
              {formatCurrency(stats.pending)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">awaiting action</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Refunded</p>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums">
              {formatCurrency(stats.refunded)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {creditNotes.filter((cn) => cn.status === 'refunded').length} cash refunds
            </p>
          </Card>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const count =
                tab.value === 'all'
                  ? creditNotes.length
                  : creditNotes.filter((cn) => cn.status === tab.value).length;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeTab === tab.value
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  <Badge variant={activeTab === tab.value ? 'soft' : 'outline'} size="sm">
                    {count}
                  </Badge>
                </button>
              );
            })}
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search credit notes…"
              className="pl-8"
            />
          </div>
        </div>

        {selected.size > 0 && (
          <Card className="flex items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-2">
              <Badge variant="soft">{selected.size} selected</Badge>
              <Button variant="outline" size="sm">
                <Send className="size-4" /> Send
              </Button>
              <Button variant="outline" size="sm">
                <ArrowLeftRight className="size-4" /> Apply to invoices
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
              Cancel
            </Button>
          </Card>
        )}

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr>
                  <th className="w-9">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={!allSelected && someSelected}
                      onCheckedChange={() => {
                        if (allSelected) setSelected(new Set());
                        else setSelected(new Set(filtered.map((cn) => cn.id)));
                      }}
                    />
                  </th>
                  <th>Number</th>
                  <th>Customer</th>
                  <th>
                    <button className="inline-flex items-center gap-1 hover:text-foreground">
                      Issued <ArrowDownUp className="size-3" />
                    </button>
                  </th>
                  <th>Reason</th>
                  <th>Original invoice</th>
                  <th>Applied to</th>
                  <th className="text-right">Amount</th>
                  <th>Status</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((cn) => (
                  <tr key={cn.id} className="group">
                    <td>
                      <Checkbox
                        checked={selected.has(cn.id)}
                        onCheckedChange={() => toggleOne(cn.id)}
                      />
                    </td>
                    <td>
                      <span className="font-mono text-xs font-medium text-primary">{cn.number}</span>
                    </td>
                    <td>
                      <Link
                        href={`/app/sales/customers/${cn.customerId}`}
                        className="flex items-center gap-2 transition-colors hover:text-primary"
                      >
                        <Avatar size="xs">
                          <AvatarFallback name={cn.customer}>
                            {initials(cn.customer)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate font-medium">{cn.customer}</span>
                      </Link>
                    </td>
                    <td className="text-sm text-muted-foreground">{formatDate(cn.issuedAt)}</td>
                    <td className="max-w-xs truncate text-sm text-muted-foreground">
                      {cn.reason}
                    </td>
                    <td>
                      {cn.invoiceRef ? (
                        <span className="font-mono text-xs text-primary">{cn.invoiceRef}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td>
                      {cn.appliedTo ? (
                        <span className="font-mono text-xs text-success">{cn.appliedTo}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="text-right font-mono tabular-nums">
                      <span className="text-warning">-{formatCurrency(cn.amount)}</span>
                    </td>
                    <td>
                      <StatusBadge status={cn.status} size="sm" />
                    </td>
                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="size-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="size-4" /> Send
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArrowLeftRight className="size-4" /> Apply to invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>Issue refund</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem destructive>Cancel</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
