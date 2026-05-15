import Link from 'next/link';
import {
  Clipboard,
  ClipboardCheck,
  ClipboardList,
  Download,
  Filter,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/ui/stat-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn, formatCurrency, formatDate, initials } from '@/lib/utils';

interface Count {
  id: string;
  date: string;
  warehouse: string;
  type: 'Cycle' | 'Full' | 'Spot';
  zone: string;
  scanned: number;
  total: number;
  variance: number;
  varianceValue: number;
  assignee: string;
  status: 'in_progress' | 'pending' | 'completed' | 'approved';
}

const counts: Count[] = [
  { id: 'CNT-2026-018', date: '2026-05-15', warehouse: 'WH-CHI', type: 'Spot', zone: 'Bin D-04', scanned: 4, total: 12, variance: 0, varianceValue: 0, assignee: 'Anna Liu', status: 'in_progress' },
  { id: 'CNT-2026-017', date: '2026-05-15', warehouse: 'WH-DAL', type: 'Cycle', zone: 'Aisle C', scanned: 86, total: 142, variance: 2, varianceValue: 184, assignee: 'Carlos Mendoza', status: 'in_progress' },
  { id: 'CNT-2026-016', date: '2026-05-14', warehouse: 'WH-PHX', type: 'Full', zone: 'All zones', scanned: 0, total: 690, variance: 0, varianceValue: 0, assignee: 'Devon Tasker', status: 'pending' },
  { id: 'CNT-2026-015', date: '2026-05-12', warehouse: 'WH-CHI', type: 'Cycle', zone: 'Aisle A', scanned: 142, total: 142, variance: 2, varianceValue: 124.80, assignee: 'Maya Tao', status: 'completed' },
  { id: 'CNT-2026-014', date: '2026-05-10', warehouse: 'WH-CHI', type: 'Cycle', zone: 'Aisle B', scanned: 96, total: 96, variance: -1, varianceValue: -42.50, assignee: 'Maya Tao', status: 'approved' },
  { id: 'CNT-2026-013', date: '2026-05-08', warehouse: 'WH-ATL', type: 'Spot', zone: 'Bin C-09', scanned: 18, total: 18, variance: 0, varianceValue: 0, assignee: 'Priya Khatri', status: 'approved' },
  { id: 'CNT-2026-012', date: '2026-05-07', warehouse: 'WH-EWR', type: 'Cycle', zone: 'Aisle A', scanned: 77, total: 77, variance: -4, varianceValue: -2840, assignee: 'Liam Rourke', status: 'completed' },
  { id: 'CNT-2026-011', date: '2026-05-04', warehouse: 'WH-MIA', type: 'Full', zone: 'All zones', scanned: 410, total: 410, variance: 12, varianceValue: 4280, assignee: 'Diego Salas', status: 'approved' },
];

export default function StockCountsPage() {
  const inProgress = counts.filter((c) => c.status === 'in_progress');
  const pending = counts.filter((c) => c.status === 'pending');
  const completed = counts.filter((c) => c.status === 'completed' || c.status === 'approved');
  const totalVariance = counts.reduce((a, c) => a + c.varianceValue, 0);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Stock counts"
        description="Cycle counting, full inventories, and variance reconciliation."
        breadcrumbs={[
          { label: 'Inventory', href: '/app/inventory' },
          { label: 'Counts' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New count</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="In progress" value={inProgress.length} format="number" />
        <StatCard label="Pending" value={pending.length} format="number" />
        <StatCard label="Completed YTD" value={184} format="number" delta={12.4} />
        <StatCard label="Net variance" value={totalVariance} format="currency" />
      </div>

      <Tabs defaultValue="active">
        <div className="flex items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="active">Active <Badge variant="info" size="sm" className="ml-1">{inProgress.length}</Badge></TabsTrigger>
            <TabsTrigger value="pending">Pending <Badge variant="warning" size="sm" className="ml-1">{pending.length}</Badge></TabsTrigger>
            <TabsTrigger value="completed">Completed <Badge variant="soft" size="sm" className="ml-1">{completed.length}</Badge></TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="pl-8 w-64" placeholder="Search count #, zone…" />
            </div>
            <Button variant="outline" size="sm"><Filter className="size-4" /> Filter</Button>
          </div>
        </div>

        <TabsContent value="active">
          <div className="grid gap-4 md:grid-cols-2">
            {inProgress.map((c) => {
              const pct = (c.scanned / c.total) * 100;
              return (
                <Card key={c.id}>
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-mono text-xs text-primary">{c.id}</div>
                        <div className="mt-1 text-lg font-semibold">{c.zone}</div>
                        <div className="text-xs text-muted-foreground">{c.warehouse} · {c.type} count</div>
                      </div>
                      <StatusBadge status="in_progress" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{c.scanned} / {c.total} scanned</span>
                      </div>
                      <Progress value={pct} />
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Avatar size="xs"><AvatarFallback name={c.assignee}>{initials(c.assignee)}</AvatarFallback></Avatar>
                        <span className="text-muted-foreground">{c.assignee}</span>
                      </div>
                      <Button variant="outline" size="sm"><ClipboardCheck className="size-4" /> Continue</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <Card className="p-0">
            <table className="erp-table">
              <thead><tr><th>Count #</th><th>Warehouse</th><th>Type</th><th>Zone</th><th className="text-right">Items</th><th>Assignee</th><th>Scheduled</th></tr></thead>
              <tbody>
                {pending.map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono text-xs text-primary">{c.id}</td>
                    <td>{c.warehouse}</td>
                    <td><Badge variant="outline" size="sm">{c.type}</Badge></td>
                    <td>{c.zone}</td>
                    <td className="text-right font-mono">{c.total}</td>
                    <td className="flex items-center gap-2"><Avatar size="xs"><AvatarFallback name={c.assignee}>{initials(c.assignee)}</AvatarFallback></Avatar>{c.assignee}</td>
                    <td>{formatDate(c.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="p-0">
            <table className="erp-table">
              <thead><tr><th>Count #</th><th>Date</th><th>Warehouse</th><th>Zone</th><th className="text-right">Items</th><th className="text-right">Variance</th><th className="text-right">Value impact</th><th>Status</th></tr></thead>
              <tbody>
                {completed.map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono text-xs text-primary">{c.id}</td>
                    <td>{formatDate(c.date)}</td>
                    <td>{c.warehouse}</td>
                    <td>{c.zone}</td>
                    <td className="text-right font-mono">{c.total}</td>
                    <td className={cn('text-right font-mono font-medium', c.variance === 0 ? 'text-muted-foreground' : c.variance > 0 ? 'text-success' : 'text-destructive')}>
                      <span className="inline-flex items-center gap-1 justify-end">
                        {c.variance > 0 && <TrendingUp className="size-3" />}
                        {c.variance < 0 && <TrendingDown className="size-3" />}
                        {c.variance === 0 ? '—' : c.variance > 0 ? `+${c.variance}` : c.variance}
                      </span>
                    </td>
                    <td className={cn('text-right font-mono', c.varianceValue === 0 ? 'text-muted-foreground' : c.varianceValue > 0 ? 'text-success' : 'text-destructive')}>
                      {c.varianceValue === 0 ? '—' : formatCurrency(c.varianceValue)}
                    </td>
                    <td><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card className="p-0">
            <table className="erp-table">
              <thead><tr><th>Count #</th><th>Date</th><th>Warehouse</th><th>Type</th><th>Zone</th><th className="text-right">Scanned</th><th className="text-right">Variance</th><th>Assignee</th><th>Status</th></tr></thead>
              <tbody>
                {counts.map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono text-xs text-primary">{c.id}</td>
                    <td>{formatDate(c.date)}</td>
                    <td>{c.warehouse}</td>
                    <td><Badge variant="outline" size="sm">{c.type}</Badge></td>
                    <td>{c.zone}</td>
                    <td className="text-right font-mono">{c.scanned} / {c.total}</td>
                    <td className={cn('text-right font-mono', c.variance > 0 ? 'text-success' : c.variance < 0 ? 'text-destructive' : 'text-muted-foreground')}>
                      {c.variance === 0 ? '—' : c.variance > 0 ? `+${c.variance}` : c.variance}
                    </td>
                    <td className="flex items-center gap-2"><Avatar size="xs"><AvatarFallback name={c.assignee}>{initials(c.assignee)}</AvatarFallback></Avatar>{c.assignee}</td>
                    <td><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
