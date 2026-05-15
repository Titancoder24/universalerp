import { Download, Maximize2, Plus, Search, ZoomIn, ZoomOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { cn, initials } from '@/lib/utils';

interface OrgNode {
  name: string;
  title: string;
  dept: string;
  reports?: OrgNode[];
}

const tree: OrgNode = {
  name: 'Jonathan Wright',
  title: 'Chief Executive Officer',
  dept: 'Executive',
  reports: [
    {
      name: 'Hiroshi Tanaka',
      title: 'Chief Technology Officer',
      dept: 'Engineering',
      reports: [
        {
          name: 'Aisha Khan',
          title: 'Engineering Director',
          dept: 'Engineering',
          reports: [
            { name: 'David Kim', title: 'Backend Engineer', dept: 'Engineering' },
            { name: 'Carlos Mendes', title: 'Frontend Engineer', dept: 'Engineering' },
            { name: 'Gabriel Silva', title: 'Mobile Engineer', dept: 'Engineering' },
            { name: 'Liam O\'Brien', title: 'Staff Engineer', dept: 'Engineering' },
          ],
        },
        {
          name: 'Ravi Sharma',
          title: 'QA & Platform Lead',
          dept: 'Engineering',
          reports: [
            { name: 'Tobias Klein', title: 'DevOps Engineer', dept: 'Engineering' },
          ],
        },
      ],
    },
    {
      name: 'Marcus Rodriguez',
      title: 'VP of Sales',
      dept: 'Sales',
      reports: [
        { name: 'Ahmed Hassan', title: 'Regional Sales Mgr', dept: 'Sales' },
        { name: 'Felix Müller', title: 'Account Executive', dept: 'Sales' },
        { name: 'Diego Fernández', title: 'Sales Dev Rep', dept: 'Sales' },
      ],
    },
    {
      name: 'Sofia Rossi',
      title: 'Chief Marketing Officer',
      dept: 'Marketing',
      reports: [
        { name: 'Emma Thompson', title: 'Marketing Coordinator', dept: 'Marketing' },
        { name: 'Hannah Bauer', title: 'Content Strategist', dept: 'Marketing' },
      ],
    },
    {
      name: 'Rebecca Chen',
      title: 'Chief Operating Officer',
      dept: 'Operations',
      reports: [
        { name: 'Yuki Nakamura', title: 'Operations Lead', dept: 'Operations' },
        { name: 'Linnea Johansson', title: 'Senior Accountant', dept: 'Finance' },
      ],
    },
    {
      name: 'Olivia Martinez',
      title: 'VP of Customer Success',
      dept: 'Customer Success',
      reports: [
        { name: 'Priya Patel', title: 'CS Manager', dept: 'Customer Success' },
        { name: 'Mei Lin', title: 'Onboarding Specialist', dept: 'Customer Success' },
      ],
    },
  ],
};

const deptColors: Record<string, string> = {
  Executive: 'border-t-warning',
  Engineering: 'border-t-primary',
  Sales: 'border-t-success',
  Marketing: 'border-t-info',
  Operations: 'border-t-destructive',
  'Customer Success': 'border-t-purple-500',
  Finance: 'border-t-pink-500',
};

function NodeCard({ node, isRoot = false }: { node: OrgNode; isRoot?: boolean }) {
  const count = node.reports?.length ?? 0;
  return (
    <div
      className={cn(
        'surface-card relative flex w-56 flex-col items-center gap-2 border-t-4 px-4 py-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
        deptColors[node.dept] ?? 'border-t-primary',
        isRoot && 'w-64 border-t-warning',
      )}
    >
      <Avatar size={isRoot ? 'xl' : 'lg'}>
        <AvatarFallback name={node.name}>{initials(node.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="truncate font-semibold leading-tight">{node.name}</div>
        <div className="mt-0.5 truncate text-xs text-muted-foreground">{node.title}</div>
      </div>
      <Badge variant="outline" size="sm">{node.dept}</Badge>
      {count > 0 && (
        <div className="text-2xs text-muted-foreground">{count} direct {count === 1 ? 'report' : 'reports'}</div>
      )}
    </div>
  );
}

function TreeNode({ node, isRoot = false }: { node: OrgNode; isRoot?: boolean }) {
  const hasChildren = (node.reports?.length ?? 0) > 0;
  return (
    <li
      className={cn(
        'relative flex flex-col items-center pt-5',
        // vertical line from parent
        !isRoot && 'before:absolute before:top-0 before:left-1/2 before:h-5 before:w-px before:bg-border',
      )}
    >
      <NodeCard node={node} isRoot={isRoot} />
      {hasChildren && (
        <>
          <div className="h-5 w-px bg-border" />
          <ul
            className={cn(
              'relative flex justify-center gap-6',
              // horizontal line spanning all children
              'before:absolute before:top-0 before:left-[10%] before:right-[10%] before:h-px before:bg-border',
              (node.reports?.length ?? 0) === 1 && 'before:hidden',
            )}
          >
            {node.reports!.map((child) => (
              <TreeNode key={child.name} node={child} />
            ))}
          </ul>
        </>
      )}
    </li>
  );
}

export default function OrgChartPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Org chart"
        description="Visual map of how Universal is structured · 248 people across 8 departments"
        breadcrumbs={[{ label: 'People', href: '/app/hr' }, { label: 'Org chart' }]}
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" /> Export PNG
            </Button>
            <Button>
              <Plus className="size-4" /> Add node
            </Button>
          </>
        }
      />

      <Card className="flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
          <Input placeholder="Find a person in the org..." className="pl-8" />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {Object.entries(deptColors).map(([dept, color]) => (
            <div key={dept} className="flex items-center gap-1.5 text-muted-foreground">
              <span className={cn('h-2.5 w-2.5 rounded-sm', color.replace('border-t-', 'bg-'))} />
              {dept}
            </div>
          ))}
        </div>
        <div className="ml-auto inline-flex items-center gap-1 rounded-lg border border-border p-0.5">
          <Button variant="ghost" size="icon-sm"><ZoomOut className="size-4" /></Button>
          <span className="px-2 text-xs tabular-nums text-muted-foreground">100%</span>
          <Button variant="ghost" size="icon-sm"><ZoomIn className="size-4" /></Button>
          <Button variant="ghost" size="icon-sm"><Maximize2 className="size-4" /></Button>
        </div>
      </Card>

      <Card className="overflow-x-auto bg-gradient-to-b from-muted/20 via-background to-background p-6">
        <div className="flex min-w-max justify-center pb-6">
          <ul className="flex">
            <TreeNode node={tree} isRoot />
          </ul>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Total nodes</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">21</div>
          <div className="mt-1 text-xs text-muted-foreground">5 management layers</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Avg span of control</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">4.2</div>
          <div className="mt-1 text-xs text-muted-foreground">Reports per manager</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Open requisitions</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">12</div>
          <div className="mt-1 text-xs text-muted-foreground">Across 5 teams</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Largest team</div>
          <div className="mt-1 text-2xl font-semibold">Engineering</div>
          <div className="mt-1 text-xs text-muted-foreground">78 people · 31%</div>
        </Card>
      </div>
    </div>
  );
}
