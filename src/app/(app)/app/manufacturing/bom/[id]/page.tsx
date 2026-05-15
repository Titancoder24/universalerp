'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Edit,
  GitBranch,
  Layers,
  MoreVertical,
  Package,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, formatNumber } from '@/lib/utils';

type Component = {
  id: string;
  code: string;
  name: string;
  qty: number;
  uom: string;
  unitCost: number;
  type: 'assembly' | 'part' | 'raw';
  children?: Component[];
};

const bomTree: Component[] = [
  {
    id: '1',
    code: 'GBX-450-A',
    name: 'Gearbox Housing 450 Series',
    qty: 1,
    uom: 'ea',
    unitCost: 124.50,
    type: 'assembly',
    children: [
      {
        id: '1.1',
        code: 'HSG-CAST-450',
        name: 'Cast Aluminum Housing',
        qty: 1,
        uom: 'ea',
        unitCost: 42.20,
        type: 'assembly',
        children: [
          { id: '1.1.1', code: 'AL-6061-T6', name: 'Aluminum 6061-T6 ingot', qty: 2.4, uom: 'kg', unitCost: 8.50, type: 'raw' },
          { id: '1.1.2', code: 'PAINT-PWD-GR', name: 'Powder coat, grey RAL7011', qty: 0.05, uom: 'kg', unitCost: 32.00, type: 'raw' },
          { id: '1.1.3', code: 'MACH-SVC-CNC', name: 'CNC machining service', qty: 0.5, uom: 'hr', unitCost: 38.50, type: 'part' },
        ],
      },
      {
        id: '1.2',
        code: 'GEAR-SET-450',
        name: 'Helical Gear Set 450',
        qty: 1,
        uom: 'set',
        unitCost: 58.30,
        type: 'assembly',
        children: [
          { id: '1.2.1', code: 'GEAR-IN-22T', name: 'Input pinion 22 teeth', qty: 1, uom: 'ea', unitCost: 18.40, type: 'part' },
          { id: '1.2.2', code: 'GEAR-OUT-88T', name: 'Output gear 88 teeth', qty: 1, uom: 'ea', unitCost: 26.80, type: 'part' },
          { id: '1.2.3', code: 'SHAFT-Φ22', name: 'Drive shaft Φ22 hardened', qty: 1, uom: 'ea', unitCost: 9.20, type: 'part' },
          { id: '1.2.4', code: 'BRG-6204-2RS', name: 'Ball bearing 6204-2RS', qty: 4, uom: 'ea', unitCost: 0.97, type: 'part' },
        ],
      },
      { id: '1.3', code: 'SEAL-LIP-22-40', name: 'Lip seal 22x40x7', qty: 2, uom: 'ea', unitCost: 1.20, type: 'part' },
      { id: '1.4', code: 'OIL-EP-220', name: 'Gear oil EP-220', qty: 0.25, uom: 'L', unitCost: 14.80, type: 'raw' },
      { id: '1.5', code: 'BOLT-M8-25', name: 'Hex bolt M8x25 stainless', qty: 8, uom: 'ea', unitCost: 0.28, type: 'part' },
      { id: '1.6', code: 'GASKET-450', name: 'Cover gasket 450 series', qty: 1, uom: 'ea', unitCost: 2.10, type: 'part' },
      { id: '1.7', code: 'NAMEPLATE-AL', name: 'Aluminum nameplate', qty: 1, uom: 'ea', unitCost: 0.85, type: 'part' },
    ],
  },
];

function calcRollup(c: Component): number {
  if (!c.children || c.children.length === 0) return c.unitCost * c.qty;
  return c.children.reduce((sum, child) => sum + calcRollup(child), 0) * c.qty;
}

const typeColor: Record<Component['type'], string> = {
  assembly: 'text-info',
  part: 'text-foreground',
  raw: 'text-muted-foreground',
};

function TreeRow({ node, depth, expanded, onToggle }: {
  node: Component;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
}) {
  const hasChildren = !!node.children?.length;
  const isOpen = expanded.has(node.id);
  const extended = node.unitCost * node.qty;
  const rollup = hasChildren ? calcRollup(node) : extended;
  return (
    <>
      <tr className="group hover:bg-muted/40">
        <td className="font-mono text-xs">
          <div className="flex items-center gap-1" style={{ paddingLeft: depth * 20 }}>
            {hasChildren ? (
              <button onClick={() => onToggle(node.id)} className="flex h-5 w-5 items-center justify-center rounded hover:bg-accent">
                {isOpen ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
              </button>
            ) : (
              <span className="w-5" />
            )}
            <Package className={`size-3.5 ${typeColor[node.type]}`} />
            <span className="font-medium">{node.code}</span>
          </div>
        </td>
        <td className="text-sm">{node.name}</td>
        <td>
          <Badge variant="outline" size="sm" className="capitalize">{node.type}</Badge>
        </td>
        <td className="text-right font-mono">{formatNumber(node.qty, { maximumFractionDigits: 3 })}</td>
        <td className="text-xs text-muted-foreground">{node.uom}</td>
        <td className="text-right font-mono">{formatCurrency(node.unitCost)}</td>
        <td className="text-right font-mono">{formatCurrency(extended)}</td>
        <td className="text-right font-mono font-semibold">{hasChildren ? formatCurrency(rollup) : '—'}</td>
        <td className="text-right">
          <div className="flex items-center justify-end gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <Button variant="ghost" size="icon-xs"><Edit className="size-3" /></Button>
            <Button variant="ghost" size="icon-xs"><Plus className="size-3" /></Button>
            <Button variant="ghost" size="icon-xs"><Trash2 className="size-3 text-destructive" /></Button>
          </div>
        </td>
      </tr>
      {isOpen && node.children?.map((c) => (
        <React.Fragment key={c.id}>
          <TreeRow node={c} depth={depth + 1} expanded={expanded} onToggle={onToggle} />
        </React.Fragment>
      ))}
    </>
  );
}

export default function BomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set(['1', '1.1', '1.2']));

  const toggle = (nodeId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const rootCost = calcRollup(bomTree[0]);
  const totalParts = (() => {
    let count = 0;
    const walk = (n: Component) => { count++; n.children?.forEach(walk); };
    bomTree.forEach(walk);
    return count - 1;
  })();

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`BOM ${id}`}
        description="Gearbox Housing 450 Series · v3.2 · Manufacturing BOM"
        breadcrumbs={[
          { label: 'Manufacturing', href: '/app/manufacturing' },
          { label: 'BOMs', href: '/app/manufacturing/bom' },
          { label: id },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/manufacturing/bom"><ArrowLeft className="size-4" /></Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              <Copy className="size-4" /> Duplicate
            </Button>
            <Button variant="outline" size="sm">
              <GitBranch className="size-4" /> New revision
            </Button>
            <Button size="sm">
              <Save className="size-4" /> Save changes
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Components</div>
              <div className="text-xl font-semibold">{totalParts}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <Package className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Roll-up cost</div>
              <div className="text-xl font-semibold">{formatCurrency(rootCost)}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
              <GitBranch className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Revision</div>
              <div className="text-xl font-semibold">v3.2</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Layers className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="mt-1"><StatusBadge status="active" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="structure">
        <TabsList>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="where-used">Where used</TabsTrigger>
          <TabsTrigger value="revisions">Revisions</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>

        <TabsContent value="structure">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Component Structure</CardTitle>
                <CardDescription>Hierarchical roll-up · click chevrons to expand</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input placeholder="Search components..." className="h-8 w-64" />
                <Button size="sm" variant="outline">
                  <Plus className="size-4" /> Add component
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th className="text-right">Qty</th>
                    <th>UoM</th>
                    <th className="text-right">Unit cost</th>
                    <th className="text-right">Extended</th>
                    <th className="text-right">Roll-up</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {bomTree.map((root) => (
                    <React.Fragment key={root.id}>
                      <TreeRow node={root} depth={0} expanded={expanded} onToggle={toggle} />
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between gap-3 border-t border-border p-4">
                <div className="text-sm text-muted-foreground">
                  Total components: <span className="font-medium text-foreground">{totalParts}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Material cost: </span>
                    <span className="font-mono font-semibold tabular-nums">{formatCurrency(rootCost * 0.78)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Labor cost: </span>
                    <span className="font-mono font-semibold tabular-nums">{formatCurrency(rootCost * 0.18)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Overhead: </span>
                    <span className="font-mono font-semibold tabular-nums">{formatCurrency(rootCost * 0.04)}</span>
                  </div>
                  <div className="border-l border-border pl-6 text-base">
                    <span className="text-muted-foreground">Total: </span>
                    <span className="font-mono font-bold tabular-nums">{formatCurrency(rootCost)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>BOM Properties</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {[
                ['BOM ID', id],
                ['Item code', 'GBX-450-A'],
                ['Item name', 'Gearbox Housing 450 Series'],
                ['Version', 'v3.2'],
                ['Status', 'Active'],
                ['Type', 'Manufacturing'],
                ['Effective from', '2025-04-12'],
                ['Expires', '—'],
                ['Owner', 'Engineering Department'],
                ['Last modified by', 'Marcus Stark'],
                ['Default UoM', 'Each (ea)'],
                ['Default qty', '1'],
                ['Routing', 'RTG-GBX-450'],
                ['Approval status', 'Approved by R. Chen'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3 border-b border-border pb-2">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="where-used">
          <Card>
            <CardHeader>
              <CardTitle>Where Used</CardTitle>
              <CardDescription>Parent BOMs that consume this assembly</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="erp-table">
                <thead><tr><th>Parent BOM</th><th>Item</th><th className="text-right">Qty per parent</th><th>Version</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td className="font-mono text-xs text-primary">BOM-DRV-880-X-v2</td><td>Drive Module 880X</td><td className="text-right font-mono">2</td><td><Badge variant="outline" size="sm">v2.1</Badge></td><td><StatusBadge status="active" /></td></tr>
                  <tr><td className="font-mono text-xs text-primary">BOM-CHN-CV-v3</td><td>Chain Conveyor 32m</td><td className="text-right font-mono">1</td><td><Badge variant="outline" size="sm">v3.0</Badge></td><td><StatusBadge status="active" /></td></tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revisions">
          <Card>
            <CardContent className="p-0">
              <table className="erp-table">
                <thead><tr><th>Version</th><th>Effective from</th><th>Author</th><th>Change note</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td><Badge variant="soft">v3.2</Badge></td><td>2025-04-12</td><td>M. Stark</td><td>Updated gear set to harder steel alloy</td><td><StatusBadge status="active" /></td></tr>
                  <tr><td><Badge variant="outline">v3.1</Badge></td><td>2024-11-08</td><td>R. Chen</td><td>Replaced lip seals with NBR variant</td><td><StatusBadge status="closed" label="superseded" /></td></tr>
                  <tr><td><Badge variant="outline">v3.0</Badge></td><td>2024-06-22</td><td>A. Reyes</td><td>Major redesign for 25% weight reduction</td><td><StatusBadge status="closed" label="superseded" /></td></tr>
                  <tr><td><Badge variant="outline">v2.4</Badge></td><td>2023-09-14</td><td>M. Stark</td><td>Tightened tolerances on output shaft</td><td><StatusBadge status="closed" label="superseded" /></td></tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments">
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              No attachments yet. Drag and drop drawings, specs, or PDFs.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
