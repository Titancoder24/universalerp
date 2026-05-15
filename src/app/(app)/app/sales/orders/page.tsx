'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowDownUp,
  Box,
  Clock,
  Download,
  Factory,
  FileText,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Truck,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { orders, type OrderStatus } from '../_data';
import { formatCurrency, formatDate, initials } from '@/lib/utils';

const pipelineStages: {
  status: OrderStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}[] = [
  { status: 'pending', label: 'Pending', icon: Clock, tone: 'text-warning' },
  { status: 'in_production', label: 'In Production', icon: Factory, tone: 'text-info' },
  { status: 'shipped', label: 'Shipped', icon: Truck, tone: 'text-primary' },
  { status: 'delivered', label: 'Delivered', icon: Package, tone: 'text-success' },
  { status: 'invoiced', label: 'Invoiced', icon: FileText, tone: 'text-success' },
];

export default function OrdersPage() {
  const [search, setSearch] = React.useState('');
  const [activeStatus, setActiveStatus] = React.useState<OrderStatus | 'all'>('all');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    return orders.filter((o) => {
      if (activeStatus !== 'all' && o.status !== activeStatus) return false;
      if (q && !o.number.toLowerCase().includes(q) && !o.customer.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [search, activeStatus]);

  const stageStats = pipelineStages.map((s) => ({
    ...s,
    count: orders.filter((o) => o.status === s.status).length,
    value: orders
      .filter((o) => o.status === s.status)
      .reduce((acc, o) => acc + o.amount, 0),
  }));

  const totalValue = orders.reduce((acc, o) => acc + o.amount, 0);

  const toggleOne = (id: string) => {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    setSelected(n);
  };

  const allSelected = filtered.length > 0 && filtered.every((o) => selected.has(o.id));
  const someSelected = filtered.some((o) => selected.has(o.id));

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Sales Orders"
        description={`${orders.length} orders · ${formatCurrency(totalValue)} total order value`}
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Sales', href: '/app/sales' },
          { label: 'Orders' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New order
            </Button>
          </>
        }
      />

      <div className="space-y-4 p-6">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Order pipeline</h2>
            <p className="text-xs text-muted-foreground">
              Click a stage to filter orders
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            <button
              onClick={() => setActiveStatus('all')}
              className={`rounded-lg border p-3 text-left transition-all ${
                activeStatus === 'all'
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-border hover:border-primary/30 hover:bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                  <Box className="size-3.5 text-muted-foreground" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  All
                </span>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-semibold tabular-nums">{orders.length}</p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {formatCurrency(totalValue)}
                </p>
              </div>
            </button>
            {stageStats.map((s) => (
              <button
                key={s.status}
                onClick={() => setActiveStatus(s.status)}
                className={`rounded-lg border p-3 text-left transition-all ${
                  activeStatus === s.status
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border hover:border-primary/30 hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`flex size-7 items-center justify-center rounded-md bg-muted ${s.tone}`}>
                    <s.icon className="size-3.5" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-semibold tabular-nums">{s.count}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {formatCurrency(s.value)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders…"
                className="pl-8"
              />
            </div>
            {activeStatus !== 'all' && (
              <Badge variant="soft" className="gap-1.5">
                Status: {pipelineStages.find((s) => s.status === activeStatus)?.label}
                <button onClick={() => setActiveStatus('all')}>
                  <XCircle className="size-3" />
                </button>
              </Badge>
            )}
          </div>
          {selected.size > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="soft">{selected.size} selected</Badge>
              <Button variant="outline" size="sm">
                <Truck className="size-4" /> Mark shipped
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="size-4" /> Generate invoice
              </Button>
            </div>
          )}
        </div>

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
                        else setSelected(new Set(filtered.map((o) => o.id)));
                      }}
                    />
                  </th>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>
                    <button className="inline-flex items-center gap-1 hover:text-foreground">
                      Ordered <ArrowDownUp className="size-3" />
                    </button>
                  </th>
                  <th>Ship by</th>
                  <th>Items</th>
                  <th className="min-w-[140px]">Progress</th>
                  <th>Rep</th>
                  <th className="text-right">Amount</th>
                  <th>Status</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="group">
                    <td>
                      <Checkbox
                        checked={selected.has(o.id)}
                        onCheckedChange={() => toggleOne(o.id)}
                      />
                    </td>
                    <td>
                      <span className="font-mono text-xs font-medium text-primary">{o.number}</span>
                    </td>
                    <td>
                      <Link
                        href={`/app/sales/customers/${o.customerId}`}
                        className="flex items-center gap-2 transition-colors hover:text-primary"
                      >
                        <Avatar size="xs">
                          <AvatarFallback name={o.customer}>{initials(o.customer)}</AvatarFallback>
                        </Avatar>
                        <span className="truncate font-medium">{o.customer}</span>
                      </Link>
                    </td>
                    <td className="text-sm text-muted-foreground">{formatDate(o.orderedAt)}</td>
                    <td className="text-sm text-muted-foreground">{formatDate(o.shipBy)}</td>
                    <td className="text-sm text-muted-foreground">{o.items}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Progress value={o.shipmentProgress} className="h-1.5 w-20" />
                        <span className="font-mono text-xs text-muted-foreground">
                          {o.shipmentProgress}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Avatar size="xs">
                          <AvatarFallback name={o.owner}>{initials(o.owner)}</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">{o.owner.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td className="text-right font-mono tabular-nums">{formatCurrency(o.amount)}</td>
                    <td>
                      <StatusBadge status={o.status} size="sm" />
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
                          <DropdownMenuItem>View order</DropdownMenuItem>
                          <DropdownMenuItem>Generate invoice</DropdownMenuItem>
                          <DropdownMenuItem>Print pick list</DropdownMenuItem>
                          <DropdownMenuItem>Track shipment</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem destructive>Cancel order</DropdownMenuItem>
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
