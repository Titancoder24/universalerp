'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowDownUp,
  Copy,
  Download,
  Eye,
  Filter,
  History,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { quotations, type QuoteStatus } from '../_data';
import { formatCurrency, formatDate, initials } from '@/lib/utils';

const statusTabs: { label: string; value: QuoteStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Sent', value: 'sent' },
  { label: 'Viewed', value: 'viewed' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Expired', value: 'expired' },
];

export default function QuotationsPage() {
  const [search, setSearch] = React.useState('');
  const [activeStatus, setActiveStatus] = React.useState<QuoteStatus | 'all'>('all');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    return quotations.filter((quote) => {
      if (activeStatus !== 'all' && quote.status !== activeStatus) return false;
      if (q && !quote.number.toLowerCase().includes(q) && !quote.customer.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [search, activeStatus]);

  const stats = {
    total: quotations.reduce((acc, q) => acc + q.amount, 0),
    accepted: quotations.filter((q) => q.status === 'accepted').reduce((acc, q) => acc + q.amount, 0),
    pending: quotations.filter((q) => ['sent', 'viewed'].includes(q.status)).reduce((acc, q) => acc + q.amount, 0),
    expired: quotations.filter((q) => q.status === 'expired').length,
  };

  const allSelected = filtered.length > 0 && filtered.every((q) => selected.has(q.id));
  const someSelected = filtered.some((q) => selected.has(q.id));

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((q) => q.id)));
  };

  const toggleOne = (id: string) => {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    setSelected(n);
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Quotations"
        description={`${quotations.length} quotes · ${formatCurrency(stats.total)} total value · ${formatCurrency(stats.pending)} awaiting response`}
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Sales', href: '/app/sales' },
          { label: 'Quotations' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
            <Button variant="outline" size="sm">
              <Sparkles className="size-4" /> AI templates
            </Button>
            <Button size="sm" asChild>
              <Link href="/app/sales/quotations/new">
                <Plus className="size-4" /> New quote
              </Link>
            </Button>
          </>
        }
      />

      <div className="space-y-4 p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Total pipeline</p>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums">{formatCurrency(stats.total)}</p>
            <p className="mt-1 text-xs text-muted-foreground">across {quotations.length} quotes</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Accepted</p>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums text-success">
              {formatCurrency(stats.accepted)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {quotations.filter((q) => q.status === 'accepted').length} quotes won
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Awaiting response</p>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums">
              {formatCurrency(stats.pending)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {quotations.filter((q) => ['sent', 'viewed'].includes(q.status)).length} open quotes
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Expired</p>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums text-warning">{stats.expired}</p>
            <p className="mt-1 text-xs text-muted-foreground">need follow-up or revision</p>
          </Card>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-x-auto">
            {statusTabs.map((tab) => {
              const count =
                tab.value === 'all'
                  ? quotations.length
                  : quotations.filter((q) => q.status === tab.value).length;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveStatus(tab.value)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeStatus === tab.value
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  <Badge variant={activeStatus === tab.value ? 'soft' : 'outline'} size="sm">
                    {count}
                  </Badge>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search quotes…"
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="size-4" /> Filters
            </Button>
          </div>
        </div>

        {selected.size > 0 && (
          <Card className="flex items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-3">
              <Badge variant="soft">{selected.size} selected</Badge>
              <Button variant="outline" size="sm">
                <Send className="size-4" /> Send
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="size-4" /> Duplicate
              </Button>
              <Button variant="outline" size="sm">
                <Download className="size-4" /> Export
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
                      onCheckedChange={toggleAll}
                    />
                  </th>
                  <th>Number</th>
                  <th>Customer</th>
                  <th>
                    <button className="inline-flex items-center gap-1 hover:text-foreground">
                      Issued <ArrowDownUp className="size-3" />
                    </button>
                  </th>
                  <th>Valid until</th>
                  <th>Items</th>
                  <th>Version</th>
                  <th>Owner</th>
                  <th className="text-right">
                    <button className="inline-flex items-center gap-1 hover:text-foreground">
                      Amount <ArrowDownUp className="size-3" />
                    </button>
                  </th>
                  <th>Status</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => {
                  const expiresSoon =
                    new Date(q.validUntil).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 7 &&
                    new Date(q.validUntil).getTime() > Date.now() &&
                    ['sent', 'viewed'].includes(q.status);
                  return (
                    <tr key={q.id} className="group">
                      <td>
                        <Checkbox
                          checked={selected.has(q.id)}
                          onCheckedChange={() => toggleOne(q.id)}
                        />
                      </td>
                      <td>
                        <Link
                          href={`/app/sales/quotations/${q.id}`}
                          className="font-mono text-xs font-medium text-primary hover:underline"
                        >
                          {q.number}
                        </Link>
                      </td>
                      <td>
                        <Link
                          href={`/app/sales/customers/${q.customerId}`}
                          className="flex items-center gap-2 transition-colors hover:text-primary"
                        >
                          <Avatar size="xs">
                            <AvatarFallback name={q.customer}>{initials(q.customer)}</AvatarFallback>
                          </Avatar>
                          <span className="truncate text-sm font-medium">{q.customer}</span>
                        </Link>
                      </td>
                      <td className="text-sm text-muted-foreground">{formatDate(q.issuedAt)}</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(q.validUntil)}
                          </span>
                          {expiresSoon && (
                            <Badge variant="warning" size="sm">
                              Soon
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="text-sm text-muted-foreground">{q.items}</td>
                      <td>
                        <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                          {q.version > 1 ? <History className="size-3" /> : null}v{q.version}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Avatar size="xs">
                            <AvatarFallback name={q.owner}>{initials(q.owner)}</AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">{q.owner.split(' ')[0]}</span>
                        </div>
                      </td>
                      <td className="text-right font-mono tabular-nums">
                        {formatCurrency(q.amount)}
                      </td>
                      <td>
                        <StatusBadge status={q.status} size="sm" />
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
                            <DropdownMenuItem asChild>
                              <Link href={`/app/sales/quotations/${q.id}`}>
                                <Eye className="size-4" /> View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="size-4" /> Send
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="size-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <History className="size-4" /> New revision
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem destructive>
                              <Trash2 className="size-4" /> Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
