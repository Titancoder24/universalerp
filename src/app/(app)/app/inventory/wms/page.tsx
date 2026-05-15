import {
  ArrowDown,
  ArrowUp,
  Award,
  Boxes,
  Clock,
  Loader2,
  Package,
  PackageOpen,
  Play,
  Truck,
  TruckIcon,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { cn, formatNumber, initials } from '@/lib/utils';

const queue = [
  { id: 'PCK-3221', type: 'pick', priority: 'high', items: 12, eta: '8m', dock: 'D-04', customer: 'Acme Industries' },
  { id: 'GR-2098', type: 'receive', priority: 'normal', items: 24, eta: '12m', dock: 'D-01', customer: 'PO from Apex Supply' },
  { id: 'PK-2987', type: 'pack', priority: 'high', items: 6, eta: '4m', dock: '—', customer: 'Global Manufacturing' },
  { id: 'PCK-3222', type: 'pick', priority: 'normal', items: 18, eta: '15m', dock: 'D-06', customer: 'TechCorp Solutions' },
  { id: 'SH-1442', type: 'ship', priority: 'urgent', items: 8, eta: '2m', dock: 'D-08', customer: 'StartupCo' },
  { id: 'PA-1820', type: 'putaway', priority: 'low', items: 62, eta: '22m', dock: '—', customer: 'PO from CableNet' },
];

const workers = [
  { name: 'Anna Liu', role: 'Picker', tasksDone: 142, taskCurrent: 'PCK-3221', perf: 96, avatar: '' },
  { name: 'Maya Tao', role: 'Receiver', tasksDone: 38, taskCurrent: 'GR-2098', perf: 94, avatar: '' },
  { name: 'Jordan Park', role: 'Shipper', tasksDone: 87, taskCurrent: 'SH-1442', perf: 91, avatar: '' },
  { name: 'Devon Tasker', role: 'Manager', tasksDone: 24, taskCurrent: 'TR-512', perf: 88, avatar: '' },
  { name: 'Carlos Mendoza', role: 'Forklift', tasksDone: 56, taskCurrent: 'PA-1820', perf: 85, avatar: '' },
  { name: 'Liam Rourke', role: 'Cross-dock', tasksDone: 41, taskCurrent: '—', perf: 82, avatar: '' },
];

const typeColors: Record<string, string> = {
  pick: 'warning',
  receive: 'success',
  pack: 'info',
  ship: 'primary',
  putaway: 'soft',
};

const priorityColors: Record<string, 'destructive' | 'warning' | 'soft' | 'outline'> = {
  urgent: 'destructive',
  high: 'warning',
  normal: 'soft',
  low: 'outline',
};

export default function WMSPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="WMS operations"
        description="Live warehouse execution: pick, pack, receive, ship — across all DCs."
        breadcrumbs={[
          { label: 'Inventory', href: '/app/inventory' },
          { label: 'WMS' },
        ]}
        actions={
          <>
            <Button variant="outline"><Zap className="size-4" /> Wave plan</Button>
            <Button><Play className="size-4" /> Release wave</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Pending picks" value={38} format="number" delta={12.4} invertTrend />
        <StatCard label="In-progress packs" value={14} format="number" />
        <StatCard label="Receives waiting" value={6} format="number" delta={-8} />
        <StatCard label="Ships today" value={42} format="number" delta={18} />
        <StatCard label="Pick accuracy" value={99.4} format="percent" delta={0.4} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Live queue</CardTitle>
              <CardDescription>Tasks being executed right now</CardDescription>
            </div>
            <Badge variant="info">{queue.length} active</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {queue.map((q) => (
              <div key={q.id} className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30">
                <div className={cn(
                  'flex size-9 items-center justify-center rounded-md',
                  typeColors[q.type] === 'warning' && 'bg-warning/15 text-warning',
                  typeColors[q.type] === 'success' && 'bg-success/15 text-success',
                  typeColors[q.type] === 'info' && 'bg-info/15 text-info',
                  typeColors[q.type] === 'primary' && 'bg-primary/15 text-primary',
                  typeColors[q.type] === 'soft' && 'bg-muted text-muted-foreground',
                )}>
                  {q.type === 'pick' && <Package className="size-4" />}
                  {q.type === 'receive' && <PackageOpen className="size-4" />}
                  {q.type === 'pack' && <Boxes className="size-4" />}
                  {q.type === 'ship' && <Truck className="size-4" />}
                  {q.type === 'putaway' && <ArrowDown className="size-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium text-primary">{q.id}</span>
                    <Badge variant={priorityColors[q.priority]} size="sm">{q.priority}</Badge>
                    <span className="text-sm capitalize">{q.type}</span>
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{q.customer}</div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-center">
                    <div className="font-mono font-medium text-foreground">{q.items}</div>
                    <div className="text-muted-foreground">items</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono font-medium text-foreground">{q.dock}</div>
                    <div className="text-muted-foreground">dock</div>
                  </div>
                  <div className="flex items-center gap-1 text-info">
                    <Clock className="size-3" />
                    <span className="font-medium">{q.eta}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Worker leaderboard</CardTitle>
              <CardDescription>Today's performance</CardDescription>
            </div>
            <Award className="size-5 text-warning" />
          </CardHeader>
          <CardContent className="space-y-3">
            {workers.map((w, idx) => (
              <div key={w.name} className="flex items-center gap-3">
                <div className={cn(
                  'flex size-6 items-center justify-center rounded-full text-xs font-bold',
                  idx === 0 && 'bg-warning text-warning-foreground',
                  idx === 1 && 'bg-muted-foreground text-background',
                  idx === 2 && 'bg-warning/40 text-foreground',
                  idx > 2 && 'bg-muted text-muted-foreground',
                )}>
                  {idx + 1}
                </div>
                <Avatar size="sm"><AvatarFallback name={w.name}>{initials(w.name)}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">{w.name}</div>
                  <div className="text-xs text-muted-foreground">{w.role} · {w.tasksDone} tasks</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold">{w.perf}%</div>
                  {w.taskCurrent !== '—' && <Loader2 className="ml-auto size-3 animate-spin text-info" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          { title: 'Pick rate', value: 142, target: 180, unit: 'units/hr', icon: Package, tone: 'warning' },
          { title: 'Receive rate', value: 88, target: 100, unit: 'lines/hr', icon: PackageOpen, tone: 'success' },
          { title: 'Ship accuracy', value: 99.4, target: 99.5, unit: '%', icon: Truck, tone: 'info' },
        ].map((m) => (
          <Card key={m.title}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">{m.title}</div>
                  <div className="mt-1 text-2xl font-semibold tabular-nums">{m.value}<span className="text-sm font-normal text-muted-foreground ml-1">{m.unit}</span></div>
                </div>
                <div className={cn('flex size-10 items-center justify-center rounded-lg',
                  m.tone === 'warning' && 'bg-warning/15 text-warning',
                  m.tone === 'success' && 'bg-success/15 text-success',
                  m.tone === 'info' && 'bg-info/15 text-info',
                )}>
                  <m.icon className="size-5" />
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">vs target {m.target}</span>
                  <span className="font-medium">{Math.round((m.value / m.target) * 100)}%</span>
                </div>
                <Progress value={(m.value / m.target) * 100} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
