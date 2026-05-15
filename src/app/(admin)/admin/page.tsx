import Link from 'next/link';
import {
  Activity,
  AlertCircle,
  Boxes,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Cloud,
  HardDrive,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const stats = [
  { label: 'Total tenants', value: 1247, delta: 8.4, format: 'number' as const, icon: Building2 },
  { label: 'Active users', value: 23890, delta: 12.1, format: 'number' as const, icon: Users },
  { label: 'MRR', value: 184500, delta: 18.2, format: 'currency' as const, icon: CircleDollarSign },
  { label: 'AI spend MTD', value: 2840, delta: 24.5, format: 'currency' as const, icon: Sparkles },
];

const recentTenants = [
  { name: 'Acme Industries Inc.', plan: 'Enterprise', users: 142, mrr: 3500, since: '2024-09-12', status: 'active' },
  { name: 'TechCorp Solutions', plan: 'Pro', users: 38, mrr: 950, since: '2025-01-15', status: 'active' },
  { name: 'Global Manufacturing', plan: 'Enterprise', users: 89, mrr: 2400, since: '2025-03-04', status: 'active' },
  { name: 'StartupCo', plan: 'Starter', users: 8, mrr: 99, since: '2026-04-22', status: 'trial' },
  { name: 'Pacific Retail Group', plan: 'Pro', users: 24, mrr: 760, since: '2026-05-01', status: 'active' },
];

const health = [
  { service: 'API gateway', status: 'healthy', uptime: '99.99%', p95: '120ms' },
  { service: 'Database', status: 'healthy', uptime: '99.98%', p95: '8ms' },
  { service: 'Realtime', status: 'healthy', uptime: '99.95%', p95: '50ms' },
  { service: 'Storage', status: 'healthy', uptime: '100%', p95: '85ms' },
  { service: 'AI proxy', status: 'degraded', uptime: '99.2%', p95: '1.2s' },
  { service: 'Email relay', status: 'healthy', uptime: '99.96%', p95: '340ms' },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Platform Overview"
        description="Real-time view of the entire Universal ERP platform."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Resource usage */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Cloud className="size-4 text-primary" />
              <span className="text-sm font-medium">Database</span>
            </div>
            <Progress value={42} />
            <div className="text-xs text-muted-foreground">42.3 GB of 100 GB</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <HardDrive className="size-4 text-primary" />
              <span className="text-sm font-medium">File Storage</span>
            </div>
            <Progress value={28} />
            <div className="text-xs text-muted-foreground">280 GB of 1 TB</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              <span className="text-sm font-medium">API Calls (today)</span>
            </div>
            <Progress value={18} />
            <div className="text-xs text-muted-foreground">1.8M of 10M limit</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent tenants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Tenants</CardTitle>
              <CardDescription>Last 5 signups and trials</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/tenants">All tenants</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Plan</th>
                  <th className="text-center">Users</th>
                  <th className="text-right">MRR</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTenants.map((t) => (
                  <tr key={t.name}>
                    <td className="font-medium">{t.name}</td>
                    <td>
                      <Badge variant={t.plan === 'Enterprise' ? 'default' : t.plan === 'Pro' ? 'soft' : 'outline'}>
                        {t.plan}
                      </Badge>
                    </td>
                    <td className="text-center">{t.users}</td>
                    <td className="text-right font-mono">${t.mrr}</td>
                    <td>
                      <Badge variant={t.status === 'active' ? 'success' : 'warning'}>{t.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Service health */}
        <Card>
          <CardHeader>
            <CardTitle>Service Health</CardTitle>
            <CardDescription>Real-time platform status</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {health.map((h) => (
                <div key={h.service} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    {h.status === 'healthy' ? (
                      <CheckCircle2 className="size-4 text-success" />
                    ) : (
                      <AlertCircle className="size-4 text-warning" />
                    )}
                    <div>
                      <div className="text-sm font-medium">{h.service}</div>
                      <div className="text-2xs text-muted-foreground">
                        p95 {h.p95} · uptime {h.uptime}
                      </div>
                    </div>
                  </div>
                  <Badge variant={h.status === 'healthy' ? 'success' : 'warning'}>{h.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
