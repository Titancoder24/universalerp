'use client';

import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  Clock,
  Download,
  Headphones,
  MessageSquareReply,
  Plus,
  ShieldCheck,
  Star,
  Ticket,
  TrendingUp,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { initials, formatPercent } from '@/lib/utils';

const stats = [
  { label: 'Open tickets', value: 142, delta: -8.4, format: 'number' as const, icon: Ticket, invertTrend: true, sparkline: [165, 162, 158, 152, 148, 145, 142, 142] },
  { label: 'Overdue SLA', value: 8, delta: 14, format: 'number' as const, icon: AlertCircle, invertTrend: true, sparkline: [5, 6, 6, 7, 7, 8, 8, 8] },
  { label: 'Avg response', value: 28, delta: -12, format: 'number' as const, icon: Clock, invertTrend: true, sparkline: [38, 36, 34, 32, 30, 29, 28, 28] },
  { label: 'CSAT (30d)', value: 0.928, delta: 2.4, format: 'percent' as const, icon: Star, sparkline: [0.91, 0.915, 0.918, 0.922, 0.924, 0.926, 0.928, 0.928] },
];

const ticketTrend = [
  { day: 'Mon', new: 28, resolved: 32 },
  { day: 'Tue', new: 34, resolved: 30 },
  { day: 'Wed', new: 26, resolved: 36 },
  { day: 'Thu', new: 32, resolved: 38 },
  { day: 'Fri', new: 30, resolved: 34 },
  { day: 'Sat', new: 18, resolved: 16 },
  { day: 'Sun', new: 12, resolved: 14 },
];

const categories = [
  { name: 'Technical', value: 38, fill: 'hsl(var(--chart-1))' },
  { name: 'Billing', value: 22, fill: 'hsl(var(--chart-2))' },
  { name: 'Shipping', value: 18, fill: 'hsl(var(--chart-3))' },
  { name: 'Warranty', value: 14, fill: 'hsl(var(--chart-4))' },
  { name: 'General', value: 8, fill: 'hsl(var(--chart-5))' },
];

const agents = [
  { name: 'Sofia Lee', open: 12, resolved24h: 18, csat: 0.96, avgResponse: 22, status: 'online' },
  { name: 'Marcus Jensen', open: 9, resolved24h: 22, csat: 0.94, avgResponse: 18, status: 'online' },
  { name: 'Aisha Nasser', open: 14, resolved24h: 16, csat: 0.91, avgResponse: 32, status: 'away' },
  { name: 'Devon Thompson', open: 11, resolved24h: 14, csat: 0.93, avgResponse: 28, status: 'online' },
  { name: 'Priya Krishnan', open: 8, resolved24h: 20, csat: 0.97, avgResponse: 16, status: 'online' },
  { name: 'Liam Rodriguez', open: 13, resolved24h: 12, csat: 0.88, avgResponse: 38, status: 'busy' },
];

const slaSummary = [
  { tier: 'Premium', count: 24, met: 23, breach: 1, target: 99 },
  { tier: 'Standard', count: 88, met: 84, breach: 4, target: 95 },
  { tier: 'Basic', count: 56, met: 52, breach: 4, target: 90 },
];

const statusColor: Record<string, string> = {
  online: 'bg-success', busy: 'bg-warning', away: 'bg-muted-foreground',
};

const recentTickets = [
  { id: 'TKT-8421', subject: 'Pump PMP-310 vibration after install', customer: 'Acme Industries', priority: 'urgent', status: 'open' as const, agent: 'Sofia Lee', age: '12m' },
  { id: 'TKT-8420', subject: 'Invoice INV-2089 question on shipping', customer: 'TechCorp Solutions', priority: 'low', status: 'in_progress' as const, agent: 'Marcus Jensen', age: '24m' },
  { id: 'TKT-8419', subject: 'Need replacement encoder for ASSY-02', customer: 'Continental Auto Parts', priority: 'high', status: 'pending' as const, agent: 'Aisha Nasser', age: '1h' },
  { id: 'TKT-8418', subject: 'Warranty claim - GBX-450-A noise', customer: 'Global Manufacturing', priority: 'med', status: 'open' as const, agent: 'Devon Thompson', age: '2h' },
  { id: 'TKT-8417', subject: 'Shipment delay notification', customer: 'Western Logistics', priority: 'med', status: 'in_progress' as const, agent: 'Priya Krishnan', age: '3h' },
];

const priorityVariant: Record<string, 'destructive' | 'warning' | 'default' | 'secondary'> = {
  urgent: 'destructive', high: 'warning', med: 'default', low: 'secondary',
};

export default function ServiceDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Customer Service"
        description="Ticket queue, SLA compliance, agent performance and CSAT in one view."
        breadcrumbs={[{ label: 'Operations', href: '/app' }, { label: 'Service' }]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button asChild><Link href="/app/service/tickets"><Plus className="size-4" /> New ticket</Link></Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (<StatCard key={s.label} {...s} deltaLabel={s.label.includes('response') ? 'min' : undefined} />))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ticket Activity</CardTitle>
            <CardDescription>New vs resolved, last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketTrend} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="new" fill="hsl(var(--chart-1))" name="New" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" fill="hsl(var(--chart-2))" name="Resolved" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>Open tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={70} paddingAngle={2}>
                    {categories.map((d, i) => (<Cell key={i} fill={d.fill} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {categories.map((c) => (
                <div key={c.name} className="flex items-center gap-2 text-xs">
                  <span className="size-2 rounded-sm" style={{ background: c.fill }} />
                  <span className="flex-1">{c.name}</span>
                  <span className="font-mono tabular-nums">{c.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th className="text-right">Open</th>
                  <th className="text-right">Resolved</th>
                  <th className="text-right">CSAT</th>
                  <th className="text-right">Avg resp</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((a) => (
                  <tr key={a.name}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Avatar size="xs"><AvatarFallback>{initials(a.name)}</AvatarFallback></Avatar>
                          <span className={`absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-background ${statusColor[a.status]}`} />
                        </div>
                        <span className="text-sm">{a.name}</span>
                      </div>
                    </td>
                    <td className="text-right font-mono">{a.open}</td>
                    <td className="text-right font-mono">{a.resolved24h}</td>
                    <td className="text-right">
                      <span className={`font-mono tabular-nums ${a.csat >= 0.95 ? 'text-success' : a.csat >= 0.90 ? '' : 'text-warning'}`}>
                        {formatPercent(a.csat)}
                      </span>
                    </td>
                    <td className="text-right font-mono text-xs text-muted-foreground">{a.avgResponse}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SLA Compliance</CardTitle>
            <CardDescription>Per tier, last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {slaSummary.map((s) => {
              const pct = (s.met / s.count) * 100;
              return (
                <div key={s.tier} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{s.tier}</span>
                      <Badge variant="outline" size="sm">target {s.target}%</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{s.met}/{s.count} met</span>
                      <span className="font-mono font-semibold text-foreground">{formatPercent(pct / 100)}</span>
                    </div>
                  </div>
                  <Progress
                    value={pct}
                    className="h-2"
                    indicatorClassName={pct >= s.target ? 'bg-success' : pct >= s.target - 5 ? 'bg-warning' : 'bg-destructive'}
                  />
                  {s.breach > 0 && <div className="text-2xs text-destructive">{s.breach} breach{s.breach !== 1 ? 'es' : ''}</div>}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>Latest activity</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/app/service/tickets">All tickets <ArrowRight className="size-3.5" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Subject</th>
                <th>Customer</th>
                <th>Priority</th>
                <th>Agent</th>
                <th>Age</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((t) => (
                <tr key={t.id}>
                  <td>
                    <Link href={`/app/service/tickets/${t.id}`} className="font-mono text-xs text-primary hover:underline">
                      {t.id}
                    </Link>
                  </td>
                  <td className="text-sm">{t.subject}</td>
                  <td className="text-sm">{t.customer}</td>
                  <td><Badge variant={priorityVariant[t.priority]} size="sm" className="capitalize">{t.priority}</Badge></td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Avatar size="xs"><AvatarFallback>{initials(t.agent)}</AvatarFallback></Avatar>
                      <span className="text-xs">{t.agent}</span>
                    </div>
                  </td>
                  <td className="text-xs text-muted-foreground">{t.age}</td>
                  <td><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
