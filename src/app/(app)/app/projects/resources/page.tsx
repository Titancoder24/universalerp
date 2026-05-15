'use client';

import {
  AlertCircle,
  Briefcase,
  Calendar,
  Download,
  Filter,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, initials } from '@/lib/utils';

const weeks = ['W19', 'W20', 'W21', 'W22', 'W23', 'W24', 'W25', 'W26'];

interface Resource {
  name: string;
  role: string;
  department: string;
  capacity: number; // hours/week
  allocation: number[]; // 0-1
}

const resources: Resource[] = [
  { name: 'Sarah Chen', role: 'Lead Engineer', department: 'Engineering', capacity: 40, allocation: [0.95, 1.0, 1.1, 1.0, 0.85, 0.7, 0.65, 0.6] },
  { name: 'James Liu', role: 'Project Manager', department: 'Engineering', capacity: 40, allocation: [0.9, 0.95, 0.92, 0.88, 0.84, 0.8, 0.75, 0.7] },
  { name: 'David Kumar', role: 'Senior Engineer', department: 'Engineering', capacity: 40, allocation: [0.85, 0.9, 1.05, 1.1, 0.95, 0.7, 0.5, 0.4] },
  { name: 'Emily Rodriguez', role: 'UX Designer', department: 'Design', capacity: 40, allocation: [0.6, 0.7, 0.8, 0.85, 0.75, 0.65, 0.5, 0.45] },
  { name: 'Marcus Reid', role: 'Solutions Architect', department: 'Engineering', capacity: 40, allocation: [0.4, 0.5, 0.6, 0.75, 0.8, 0.65, 0.55, 0.5] },
  { name: 'Jenna Park', role: 'Business Analyst', department: 'Operations', capacity: 40, allocation: [0.85, 0.9, 0.85, 0.7, 0.6, 0.55, 0.45, 0.4] },
  { name: 'Alex Chen', role: 'QA Engineer', department: 'Engineering', capacity: 40, allocation: [0.3, 0.4, 0.5, 0.8, 1.0, 1.05, 0.85, 0.65] },
  { name: 'Maya Patel', role: 'Product Designer', department: 'Design', capacity: 40, allocation: [0.7, 0.75, 0.8, 0.85, 0.7, 0.55, 0.4, 0.3] },
  { name: 'Tom Wilson', role: 'DevOps Engineer', department: 'Engineering', capacity: 40, allocation: [0.65, 0.7, 0.8, 0.85, 0.75, 0.7, 0.65, 0.55] },
  { name: 'Lisa Wang', role: 'Frontend Engineer', department: 'Engineering', capacity: 40, allocation: [0.8, 0.85, 0.95, 1.0, 0.9, 0.65, 0.4, 0.35] },
  { name: 'Carlos Garcia', role: 'Data Engineer', department: 'Engineering', capacity: 40, allocation: [0.7, 0.8, 0.9, 0.95, 0.85, 0.7, 0.5, 0.4] },
  { name: 'Nina Volkov', role: 'Tech Writer', department: 'Operations', capacity: 30, allocation: [0.4, 0.5, 0.6, 0.65, 0.55, 0.5, 0.4, 0.3] },
];

function getColor(allocation: number) {
  if (allocation > 1.0) return 'bg-destructive text-destructive-foreground';
  if (allocation >= 0.9) return 'bg-warning text-warning-foreground';
  if (allocation >= 0.7) return 'bg-success text-success-foreground';
  if (allocation >= 0.4) return 'bg-success/40 text-foreground';
  return 'bg-muted text-muted-foreground';
}

export default function ResourcesPage() {
  const avgAllocation = resources.reduce((s, r) => s + r.allocation.reduce((a, v) => a + v, 0) / r.allocation.length, 0) / resources.length;
  const overallocated = resources.filter(r => r.allocation.some(a => a > 1.0)).length;
  const underutilized = resources.filter(r => r.allocation.every(a => a < 0.5)).length;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Resource Availability"
        description="Capacity heatmap across teams. Spot over/under-allocation at a glance."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Projects', href: '/app/projects' },
          { label: 'Resources' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="size-4" /> Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> Allocate
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Active resources</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{resources.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across {new Set(resources.map(r => r.department)).size} departments</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Avg utilization</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{(avgAllocation * 100).toFixed(0)}%</p>
          <p className="mt-1 text-xs text-success">+3pp vs last 8 weeks</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Overallocated</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-destructive">{overallocated}</p>
          <p className="mt-1 text-xs text-muted-foreground">Need redistribution</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Available bandwidth</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{(resources.length * 40 - resources.reduce((s, r) => s + r.allocation[0] * 40, 0)).toFixed(0)}h</p>
          <p className="mt-1 text-xs text-muted-foreground">This week · across team</p>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle>Capacity Heatmap</CardTitle>
            <CardDescription>Next 8 weeks · darker = higher allocation</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="h-8 w-64 pl-8" placeholder="Search resource" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="h-8 w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                <SelectItem value="eng">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="ops">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="sticky left-0 z-10 bg-muted/30 px-4 py-2 text-left text-xs font-semibold uppercase text-muted-foreground">Resource</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase text-muted-foreground">Role</th>
                  {weeks.map((w) => (
                    <th key={w} className="px-2 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">{w}</th>
                  ))}
                  <th className="px-2 py-2 text-right text-xs font-semibold uppercase text-muted-foreground">Avg</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => {
                  const avg = r.allocation.reduce((s, v) => s + v, 0) / r.allocation.length;
                  return (
                    <tr key={r.name} className="border-t border-border">
                      <td className="sticky left-0 z-10 bg-background px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Avatar size="sm">
                            <AvatarFallback name={r.name}>{initials(r.name)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{r.name}</p>
                            <p className="text-2xs text-muted-foreground">{r.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-xs text-muted-foreground">{r.role}</td>
                      {r.allocation.map((a, i) => (
                        <td key={i} className="px-1 py-1.5 text-center">
                          <div
                            className={cn(
                              'mx-auto flex h-9 w-14 items-center justify-center rounded-md text-xs font-semibold tabular-nums',
                              getColor(a),
                            )}
                            title={`${Math.round(a * 100)}% — ${Math.round(a * r.capacity)} hrs`}
                          >
                            {(a * 100).toFixed(0)}%
                          </div>
                        </td>
                      ))}
                      <td className="px-2 py-2 text-right">
                        <Badge variant={avg > 1 ? 'destructive' : avg < 0.5 ? 'outline' : 'success'} size="sm">
                          {(avg * 100).toFixed(0)}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
        <div className="flex flex-wrap items-center gap-4 border-t border-border p-4 text-xs">
          <span className="font-medium text-muted-foreground">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-muted" />
            <span>{'<'}40% underutilized</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-success/40" />
            <span>40-70%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-success" />
            <span>70-90% optimal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-warning" />
            <span>90-100%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-destructive" />
            <span>{'>'}100% overallocated</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="size-4 text-destructive" />
              Overallocated Resources
            </CardTitle>
            <CardDescription>Capacity exceeds 100% in upcoming weeks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {resources.filter((r) => r.allocation.some((a) => a > 1)).map((r) => {
              const overWeek = weeks[r.allocation.findIndex((a) => a > 1)];
              const peak = Math.max(...r.allocation);
              return (
                <div key={r.name} className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-3">
                  <Avatar size="sm">
                    <AvatarFallback name={r.name}>{initials(r.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold text-destructive">{(peak * 100).toFixed(0)}%</p>
                    <p className="text-2xs text-muted-foreground">peak {overWeek}</p>
                  </div>
                </div>
              );
            })}
            {resources.filter((r) => r.allocation.some((a) => a > 1)).length === 0 && (
              <p className="text-sm text-muted-foreground">No overallocated resources.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              AI Recommendations
            </CardTitle>
            <CardDescription>Smart suggestions for rebalancing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm">
              <p className="font-medium">Reassign Sarah Chen → Carlos Garcia</p>
              <p className="mt-1 text-xs text-muted-foreground">12 hrs of W21 backend work could shift to Carlos who has 25% bandwidth.</p>
            </div>
            <div className="rounded-lg border border-info/30 bg-info/5 p-3 text-sm">
              <p className="font-medium">Bring forward QA cycle</p>
              <p className="mt-1 text-xs text-muted-foreground">Alex Chen has spike in W22-W24. Starting test scripting in W20 reduces peak by 15%.</p>
            </div>
            <div className="rounded-lg border border-success/30 bg-success/5 p-3 text-sm">
              <p className="font-medium">Nina Volkov available</p>
              <p className="mt-1 text-xs text-muted-foreground">Tech writer has 60% open capacity in W22-W26. Ideal for documentation sprint.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
