import {
  ArrowDown,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  GripVertical,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Trophy,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input, InputAddon } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, formatCompactNumber, formatCurrency, initials } from '@/lib/utils';

interface Deal {
  id: string;
  name: string;
  customer: string;
  value: number;
  probability: number;
  daysInStage: number;
  owner: string;
  closeDate: string;
  priority?: 'high' | 'medium';
}

interface Stage {
  key: string;
  name: string;
  accent: string;
  dot: string;
  deals: Deal[];
}

const stages: Stage[] = [
  {
    key: 'discovery',
    name: 'Discovery',
    accent: 'border-info/40 bg-info/5',
    dot: 'bg-info',
    deals: [
      { id: 'O-3104', name: 'Northwind ERP Rollout', customer: 'Northwind Software', value: 145000, probability: 20, daysInStage: 3, owner: 'Sarah Chen', closeDate: 'Aug 28', priority: 'high' },
      { id: 'O-3103', name: 'Boreal Energy SCADA Refresh', customer: 'Boreal Energy', value: 92000, probability: 15, daysInStage: 7, owner: 'Emily Watson', closeDate: 'Sep 12' },
      { id: 'O-3102', name: 'Aurora Materials Pilot', customer: 'Aurora Materials', value: 47000, probability: 25, daysInStage: 2, owner: 'Priya Patel', closeDate: 'Aug 30' },
      { id: 'O-3101', name: 'Gulf Hospitality Platform', customer: 'Gulf Hospitality Group', value: 165000, probability: 20, daysInStage: 12, owner: 'James Okafor', closeDate: 'Sep 30' },
      { id: 'O-3100', name: 'Pacific Marine PLM', customer: 'Pacific Marine', value: 78000, probability: 15, daysInStage: 18, owner: 'Marcus Rivera', closeDate: 'Oct 15' },
    ],
  },
  {
    key: 'qualification',
    name: 'Qualification',
    accent: 'border-primary/40 bg-primary/5',
    dot: 'bg-primary',
    deals: [
      { id: 'O-3099', name: 'Helix Robotics Expansion', customer: 'Helix Robotics', value: 87000, probability: 40, daysInStage: 5, owner: 'Marcus Rivera', closeDate: 'Aug 22', priority: 'high' },
      { id: 'O-3098', name: 'Mesa Manufacturing MRP', customer: 'Mesa Manufacturing', value: 98000, probability: 35, daysInStage: 9, owner: 'Marcus Rivera', closeDate: 'Aug 28' },
      { id: 'O-3097', name: 'Brightline AI - Year 1', customer: 'Brightline AI', value: 112000, probability: 45, daysInStage: 14, owner: 'James Okafor', closeDate: 'Sep 05' },
      { id: 'O-3096', name: 'Shamrock Distilleries Suite', customer: 'Shamrock Distilleries', value: 92000, probability: 40, daysInStage: 6, owner: 'Marcus Rivera', closeDate: 'Sep 18' },
      { id: 'O-3095', name: 'Crestwood Insurance Migration', customer: 'Crestwood Insurance', value: 132000, probability: 30, daysInStage: 21, owner: 'Emily Watson', closeDate: 'Oct 02' },
    ],
  },
  {
    key: 'proposal',
    name: 'Proposal',
    accent: 'border-warning/40 bg-warning/5',
    dot: 'bg-warning',
    deals: [
      { id: 'O-3094', name: 'Lumen Health Network Suite', customer: 'Lumen Health', value: 220000, probability: 60, daysInStage: 8, owner: 'Priya Patel', closeDate: 'Aug 25', priority: 'high' },
      { id: 'O-3093', name: 'Sakura Retail POS Platform', customer: 'Sakura Retail Group', value: 250000, probability: 55, daysInStage: 11, owner: 'Priya Patel', closeDate: 'Sep 10', priority: 'high' },
      { id: 'O-3092', name: 'Sentinel Cyber Tooling', customer: 'Sentinel Cybersecurity', value: 76000, probability: 65, daysInStage: 4, owner: 'James Okafor', closeDate: 'Aug 18' },
      { id: 'O-3091', name: 'Terra Verde Operations', customer: 'Terra Verde Agro', value: 58000, probability: 50, daysInStage: 16, owner: 'Sarah Chen', closeDate: 'Sep 22' },
    ],
  },
  {
    key: 'negotiation',
    name: 'Negotiation',
    accent: 'border-orange-500/40 bg-orange-500/5',
    dot: 'bg-orange-500',
    deals: [
      { id: 'O-3090', name: 'Vertex Logistics ERP', customer: 'Vertex Logistics', value: 64000, probability: 80, daysInStage: 6, owner: 'Sarah Chen', closeDate: 'Aug 15', priority: 'high' },
      { id: 'O-3089', name: 'NordicTech Industries Cloud', customer: 'NordicTech Industries', value: 108000, probability: 75, daysInStage: 9, owner: 'James Okafor', closeDate: 'Aug 20' },
      { id: 'O-3088', name: 'Nile Trading Platform', customer: 'Nile Trading Co', value: 88000, probability: 70, daysInStage: 22, owner: 'Priya Patel', closeDate: 'Aug 30' },
    ],
  },
  {
    key: 'won',
    name: 'Closed Won',
    accent: 'border-success/40 bg-success/5',
    dot: 'bg-success',
    deals: [
      { id: 'O-3087', name: 'Riverside Properties Suite', customer: 'Riverside Properties', value: 52000, probability: 100, daysInStage: 2, owner: 'Sarah Chen', closeDate: 'Today' },
      { id: 'O-3086', name: 'Bohemia Telecom Migration', customer: 'Bohemia Telecom', value: 142000, probability: 100, daysInStage: 4, owner: 'Marcus Rivera', closeDate: '2 days ago' },
      { id: 'O-3085', name: 'Artisan Bakery POS', customer: 'Artisan Bakery Chain', value: 34000, probability: 100, daysInStage: 8, owner: 'Marcus Rivera', closeDate: 'Aug 5' },
    ],
  },
  {
    key: 'lost',
    name: 'Closed Lost',
    accent: 'border-destructive/40 bg-destructive/5',
    dot: 'bg-destructive',
    deals: [
      { id: 'O-3084', name: 'OmniCorp Holdings', customer: 'OmniCorp Holdings', value: 320000, probability: 0, daysInStage: 5, owner: 'James Okafor', closeDate: 'Aug 10' },
      { id: 'O-3083', name: 'Quanta Industries Pilot', customer: 'Quanta Industries', value: 22000, probability: 0, daysInStage: 12, owner: 'Emily Watson', closeDate: 'Aug 2' },
    ],
  },
];

function probabilityColor(p: number) {
  if (p >= 80) return 'bg-success';
  if (p >= 50) return 'bg-warning';
  if (p > 0) return 'bg-info';
  return 'bg-muted-foreground';
}

function ageColor(days: number) {
  if (days >= 20) return 'text-destructive';
  if (days >= 14) return 'text-warning';
  return 'text-muted-foreground';
}

export default function OpportunitiesPage() {
  const totals = stages.map((s) => ({
    key: s.key,
    total: s.deals.reduce((sum, d) => sum + d.value, 0),
    count: s.deals.length,
  }));
  const weightedTotal = stages
    .filter((s) => s.key !== 'won' && s.key !== 'lost')
    .reduce((sum, s) => sum + s.deals.reduce((ss, d) => ss + (d.value * d.probability) / 100, 0), 0);
  const totalPipeline = stages
    .filter((s) => s.key !== 'won' && s.key !== 'lost')
    .reduce((sum, s) => sum + s.deals.reduce((ss, d) => ss + d.value, 0), 0);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Opportunities"
        description="Drag deals between stages, see weighted forecasts in real time."
        actions={
          <>
            <Button variant="outline" size="sm">
              <ArrowDown className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New deal
            </Button>
          </>
        }
      />

      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background p-0.5">
          <Button variant="soft" size="sm" className="gap-1.5">
            <LayoutGrid className="size-4" /> Board
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <List className="size-4" /> List
          </Button>
        </div>
        <div className="min-w-[240px] flex-1">
          <InputAddon prefix={<Search className="size-4" />}>
            <Input placeholder="Search opportunities..." />
          </InputAddon>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All owners</SelectItem>
            <SelectItem value="sc">Sarah Chen</SelectItem>
            <SelectItem value="mr">Marcus Rivera</SelectItem>
            <SelectItem value="pp">Priya Patel</SelectItem>
            <SelectItem value="jo">James Okafor</SelectItem>
            <SelectItem value="ew">Emily Watson</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="q3">
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="q3">Q3 2026</SelectItem>
            <SelectItem value="q4">Q4 2026</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Filter className="size-4" /> Filters
        </Button>
      </div>

      {/* Summary strip */}
      <Card>
        <CardContent className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Open pipeline</p>
            <p className="mt-1 text-xl font-semibold">{formatCurrency(totalPipeline)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Weighted</p>
            <p className="mt-1 text-xl font-semibold text-primary">{formatCurrency(weightedTotal)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Open deals</p>
            <p className="mt-1 text-xl font-semibold">
              {stages.filter((s) => s.key !== 'won' && s.key !== 'lost').reduce((sum, s) => sum + s.deals.length, 0)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Avg deal size</p>
            <p className="mt-1 text-xl font-semibold">
              {formatCurrency(
                totalPipeline /
                  stages.filter((s) => s.key !== 'won' && s.key !== 'lost').reduce((sum, s) => sum + s.deals.length, 0),
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Kanban */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3" style={{ minWidth: 'min-content' }}>
          {stages.map((stage, i) => {
            const t = totals[i];
            return (
              <div key={stage.key} className="flex w-[300px] flex-shrink-0 flex-col">
                {/* Column header */}
                <div
                  className={cn(
                    'mb-2 flex items-center justify-between rounded-lg border-l-2 bg-card p-3',
                    stage.accent,
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2 w-2 rounded-full', stage.dot)} />
                    <span className="text-sm font-semibold">{stage.name}</span>
                    <Badge variant="outline" size="sm">
                      {t.count}
                    </Badge>
                  </div>
                  <span className="font-mono text-xs font-semibold tabular-nums">
                    ${formatCompactNumber(t.total)}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2">
                  {stage.deals.map((d) => (
                    <Link
                      key={d.id}
                      href={`/app/crm/opportunities/${d.id}`}
                      className="group block cursor-grab rounded-lg border border-border bg-card p-3 shadow-xs transition-all hover:border-primary/40 hover:shadow-md active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            {d.priority === 'high' && (
                              <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                            )}
                            <p className="truncate text-sm font-semibold">{d.name}</p>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {d.customer}
                          </p>
                        </div>
                        <GripVertical className="size-4 shrink-0 text-muted-foreground/40 opacity-0 group-hover:opacity-100" />
                      </div>

                      <div className="mt-2.5 flex items-baseline justify-between">
                        <span className="font-mono text-base font-bold tabular-nums">
                          {formatCurrency(d.value)}
                        </span>
                        {stage.key !== 'won' && stage.key !== 'lost' && (
                          <span className="font-mono text-xs text-muted-foreground">
                            {d.probability}%
                          </span>
                        )}
                      </div>

                      {stage.key !== 'won' && stage.key !== 'lost' && (
                        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn('h-full rounded-full', probabilityColor(d.probability))}
                            style={{ width: `${d.probability}%` }}
                          />
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Avatar size="xs">
                            <AvatarFallback name={d.owner}>{initials(d.owner)}</AvatarFallback>
                          </Avatar>
                          <span className="truncate text-xs text-muted-foreground">
                            {d.owner.split(' ')[0]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={cn('inline-flex items-center gap-0.5', ageColor(d.daysInStage))}>
                            <Clock className="size-3" />
                            {d.daysInStage}d
                          </span>
                          <span className="text-muted-foreground">
                            <Calendar className="mr-0.5 inline size-3" />
                            {d.closeDate}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {/* Add card */}
                  <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-muted/20 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary">
                    <Plus className="size-3.5" /> Add deal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
