'use client';

import * as React from 'react';
import { Calendar, MoreHorizontal, Pause, Play, Plus, Repeat } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate, initials, colorFromString } from '@/lib/utils';

const recurringInvoices = [
  { id: 'REC-001', customer: 'TechCorp Solutions', amount: 8900, currency: 'USD', frequency: 'Monthly', nextDate: '2026-06-01', status: 'active', total: 14, completed: 11 },
  { id: 'REC-002', customer: 'Acme Industries', amount: 24500, currency: 'USD', frequency: 'Quarterly', nextDate: '2026-07-01', status: 'active', total: 4, completed: 1 },
  { id: 'REC-003', customer: 'Global Manufacturing', amount: 67200, currency: 'USD', frequency: 'Annual', nextDate: '2026-12-31', status: 'active', total: null, completed: 0 },
  { id: 'REC-004', customer: 'Pacific Retail Group', amount: 4200, currency: 'USD', frequency: 'Monthly', nextDate: '2026-05-25', status: 'paused', total: null, completed: 6 },
  { id: 'REC-005', customer: 'Innovate Labs', amount: 1200, currency: 'USD', frequency: 'Monthly', nextDate: '2026-06-15', status: 'active', total: 12, completed: 4 },
  { id: 'REC-006', customer: 'StartupCo', amount: 99, currency: 'USD', frequency: 'Monthly', nextDate: '2026-06-01', status: 'active', total: null, completed: 23 },
];

export default function RecurringInvoicesPage() {
  const totals = {
    mrr: recurringInvoices
      .filter((r) => r.status === 'active' && r.frequency === 'Monthly')
      .reduce((s, r) => s + r.amount, 0),
    arr: recurringInvoices
      .filter((r) => r.status === 'active')
      .reduce((s, r) => {
        const multiplier = r.frequency === 'Monthly' ? 12 : r.frequency === 'Quarterly' ? 4 : 1;
        return s + r.amount * multiplier;
      }, 0),
    active: recurringInvoices.filter((r) => r.status === 'active').length,
    paused: recurringInvoices.filter((r) => r.status === 'paused').length,
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Recurring Invoices"
        description="Subscriptions that automatically generate invoices on a schedule."
        actions={<Button><Plus className="size-4" /> New recurring invoice</Button>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="MRR" value={totals.mrr} format="currency" delta={12.4} />
        <StatCard label="ARR" value={totals.arr} format="currency" delta={8.2} />
        <StatCard label="Active subscriptions" value={totals.active} format="number" />
        <StatCard label="Paused" value={totals.paused} format="number" />
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Recurring ID</th>
                <th>Customer</th>
                <th className="text-right">Amount</th>
                <th>Frequency</th>
                <th>Next invoice</th>
                <th>Progress</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recurringInvoices.map((r) => (
                <tr key={r.id}>
                  <td className="font-mono text-xs text-primary">{r.id}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar size="xs">
                        <AvatarFallback style={{ backgroundColor: colorFromString(r.customer) }} className="text-2xs text-white">
                          {initials(r.customer)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{r.customer}</span>
                    </div>
                  </td>
                  <td className="text-right font-mono">{formatCurrency(r.amount, r.currency)}</td>
                  <td>
                    <Badge variant="outline" className="gap-1">
                      <Repeat className="size-3" /> {r.frequency}
                    </Badge>
                  </td>
                  <td className="text-sm">{formatDate(r.nextDate)}</td>
                  <td className="text-sm">
                    {r.total ? `${r.completed} / ${r.total}` : `${r.completed} (ongoing)`}
                  </td>
                  <td>
                    <Badge variant={r.status === 'active' ? 'success' : 'warning'}>{r.status}</Badge>
                  </td>
                  <td className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit schedule</DropdownMenuItem>
                        <DropdownMenuItem>View invoices generated</DropdownMenuItem>
                        <DropdownMenuItem>
                          {r.status === 'active' ? <><Pause className="size-3" /> Pause</> : <><Play className="size-3" /> Resume</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
