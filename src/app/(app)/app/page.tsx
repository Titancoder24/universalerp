import { Suspense } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowRight,
  Banknote,
  Boxes,
  CircleDollarSign,
  Plus,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { initials, formatCurrency, formatRelativeTime } from '@/lib/utils';
import { RevenueChart } from './_components/revenue-chart';
import { PipelineKanban } from './_components/pipeline-kanban';
import { ActivityFeed } from './_components/activity-feed';

const stats = [
  { label: 'Revenue (MTD)', value: 284320, delta: 12.4, format: 'currency' as const, icon: CircleDollarSign },
  { label: 'New deals', value: 47, delta: 8.2, format: 'number' as const, icon: ShoppingCart },
  { label: 'Open invoices', value: 156320, delta: -4.1, format: 'currency' as const, icon: Receipt },
  { label: 'Active customers', value: 1247, delta: 3.4, format: 'number' as const, icon: Users },
];

const recentInvoices = [
  { id: 'INV-2089', customer: 'Acme Industries', amount: 12450, status: 'paid' as const, date: '2 hours ago' },
  { id: 'INV-2088', customer: 'TechCorp Solutions', amount: 8900, status: 'sent' as const, date: '5 hours ago' },
  { id: 'INV-2087', customer: 'Global Manufacturing', amount: 24500, status: 'partial' as const, date: 'Yesterday' },
  { id: 'INV-2086', customer: 'StartupCo', amount: 3200, status: 'overdue' as const, date: '2 days ago' },
  { id: 'INV-2085', customer: 'Enterprise Ltd', amount: 45000, status: 'paid' as const, date: '3 days ago' },
];

const topCustomers = [
  { name: 'Acme Industries', revenue: 245320, orders: 23, change: 12 },
  { name: 'Global Manufacturing', revenue: 198450, orders: 18, change: 8 },
  { name: 'TechCorp Solutions', revenue: 167200, orders: 21, change: -3 },
  { name: 'Enterprise Ltd', revenue: 142800, orders: 14, change: 22 },
  { name: 'StartupCo', revenue: 89400, orders: 11, change: 5 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's a real-time view of your business across every module."
        actions={
          <>
            <Button variant="outline">
              <ArrowDown className="size-4" /> Export
            </Button>
            <Button>
              <Plus className="size-4" /> New
            </Button>
          </>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            delta={s.delta}
            format={s.format}
            icon={s.icon}
          />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Last 12 months · all entities</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/accounting/reports">
                Full report <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-64 skeleton" />}>
              <RevenueChart />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Across all modules</CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <Suspense fallback={<div className="h-64 skeleton" />}>
              <ActivityFeed />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Sales Pipeline</CardTitle>
            <CardDescription>$1.2M in opportunities, weighted $620K</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/app/crm/opportunities">
              Open pipeline <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-48 skeleton" />}>
            <PipelineKanban />
          </Suspense>
        </CardContent>
      </Card>

      {/* Two-column tables */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Last 5 invoices issued</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/sales/invoices">
                All invoices <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Customer</th>
                  <th className="text-right">Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="font-mono text-xs font-medium text-primary">{inv.id}</td>
                    <td className="truncate font-medium">{inv.customer}</td>
                    <td className="text-right font-mono">{formatCurrency(inv.amount)}</td>
                    <td><StatusBadge status={inv.status} /></td>
                    <td className="text-xs text-muted-foreground">{inv.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>By revenue this quarter</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/sales/customers">
                All customers <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th className="text-right">Revenue</th>
                  <th className="text-center">Orders</th>
                  <th className="text-right">Change</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c) => (
                  <tr key={c.name}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar size="xs">
                          <AvatarFallback>{initials(c.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="text-right font-mono">{formatCurrency(c.revenue)}</td>
                    <td className="text-center text-muted-foreground">{c.orders}</td>
                    <td className={`text-right font-medium ${c.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {c.change >= 0 ? '+' : ''}{c.change}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
