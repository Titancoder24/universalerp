import Link from 'next/link';
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  Download,
  Filter,
  Plus,
  Search,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatCard } from '@/components/ui/stat-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatCurrency, formatDate, initials } from '@/lib/utils';

interface Requisition {
  id: string;
  date: string;
  requester: string;
  dept: string;
  description: string;
  items: number;
  amount: number;
  approvers: { name: string; status: 'pending' | 'approved' | 'rejected' | 'skipped' }[];
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'converted';
}

const reqs: Requisition[] = [
  {
    id: 'REQ-2098', date: '2026-05-14', requester: 'Sara Kim', dept: 'Engineering', description: 'Q3 prototype components',
    items: 8, amount: 24800, status: 'pending',
    approvers: [
      { name: 'Marcus Bell', status: 'approved' },
      { name: 'Dana Cole', status: 'pending' },
      { name: 'Eric Ng', status: 'pending' },
    ],
  },
  {
    id: 'REQ-2097', date: '2026-05-13', requester: 'Mark Eaton', dept: 'Operations', description: 'Quarterly office supplies',
    items: 12, amount: 8400, status: 'approved',
    approvers: [
      { name: 'Anika Sato', status: 'approved' },
      { name: 'Dana Cole', status: 'approved' },
    ],
  },
  {
    id: 'REQ-2096', date: '2026-05-12', requester: 'Lina Wang', dept: 'Production', description: 'Capital equipment expansion',
    items: 24, amount: 142000, status: 'pending',
    approvers: [
      { name: 'Marcus Bell', status: 'approved' },
      { name: 'Dana Cole', status: 'approved' },
      { name: 'Eric Ng', status: 'pending' },
      { name: 'CFO Review', status: 'pending' },
    ],
  },
  {
    id: 'REQ-2095', date: '2026-05-11', requester: 'Hugo Park', dept: 'Maintenance', description: 'Critical spare parts',
    items: 6, amount: 3800, status: 'approved',
    approvers: [
      { name: 'Anika Sato', status: 'approved' },
    ],
  },
  {
    id: 'REQ-2094', date: '2026-05-11', requester: 'Jen Cooper', dept: 'Quality', description: 'New calibration equipment',
    items: 4, amount: 48200, status: 'rejected',
    approvers: [
      { name: 'Marcus Bell', status: 'approved' },
      { name: 'Dana Cole', status: 'rejected' },
    ],
  },
  {
    id: 'REQ-2093', date: '2026-05-10', requester: 'Ravi Sharma', dept: 'IT', description: 'Software license renewals',
    items: 18, amount: 38400, status: 'converted',
    approvers: [
      { name: 'Anika Sato', status: 'approved' },
      { name: 'Dana Cole', status: 'approved' },
    ],
  },
  {
    id: 'REQ-2092', date: '2026-05-10', requester: 'Tina Brock', dept: 'Marketing', description: 'Trade show booth materials',
    items: 14, amount: 12200, status: 'converted',
    approvers: [
      { name: 'Anika Sato', status: 'approved' },
    ],
  },
  {
    id: 'REQ-2091', date: '2026-05-09', requester: 'Sara Kim', dept: 'Engineering', description: 'PPE replenishment lab',
    items: 9, amount: 2400, status: 'draft',
    approvers: [],
  },
];

const approverStatusColor: Record<string, string> = {
  approved: 'success',
  pending: 'muted',
  rejected: 'destructive',
  skipped: 'muted',
};

function ApprovalChain({ approvers }: { approvers: Requisition['approvers'] }) {
  if (approvers.length === 0) return <span className="text-xs text-muted-foreground">No approvals required</span>;
  return (
    <div className="flex items-center gap-1">
      {approvers.map((a, i) => (
        <div key={i} className="flex items-center gap-1" title={`${a.name} · ${a.status}`}>
          <div className={cn(
            'flex size-6 items-center justify-center rounded-full ring-2 ring-background',
            a.status === 'approved' && 'bg-success/15 text-success',
            a.status === 'pending' && 'bg-muted text-muted-foreground',
            a.status === 'rejected' && 'bg-destructive/15 text-destructive',
          )}>
            {a.status === 'approved' && <CheckCircle2 className="size-3.5" />}
            {a.status === 'pending' && <Clock className="size-3" />}
            {a.status === 'rejected' && <XCircle className="size-3.5" />}
          </div>
          {i < approvers.length - 1 && <div className={cn('h-px w-3', a.status === 'approved' ? 'bg-success' : 'bg-border')} />}
        </div>
      ))}
    </div>
  );
}

export default function RequisitionsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Purchase requisitions"
        description="Internal purchase requests routed through approval workflows."
        breadcrumbs={[
          { label: 'Procurement', href: '/app/procurement' },
          { label: 'Requisitions' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New requisition</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending approval" value={reqs.filter((r) => r.status === 'pending').length} format="number" delta={8} invertTrend />
        <StatCard label="Approved" value={reqs.filter((r) => r.status === 'approved').length} format="number" delta={14} />
        <StatCard label="Converted to PO" value={reqs.filter((r) => r.status === 'converted').length} format="number" delta={4} />
        <StatCard label="Pending value" value={reqs.filter((r) => r.status === 'pending').reduce((a, r) => a + r.amount, 0)} format="currency" />
      </div>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="all">All <Badge variant="soft" size="sm" className="ml-1">{reqs.length}</Badge></TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="converted">Converted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="pl-8 w-64" placeholder="Search REQ #, requester…" />
            </div>
            <Select>
              <SelectTrigger className="w-36"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All depts</SelectItem>
                <SelectItem value="eng">Engineering</SelectItem>
                <SelectItem value="ops">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all">
          <Card className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Requisition #</th>
                  <th>Date</th>
                  <th>Requester</th>
                  <th>Dept</th>
                  <th>Description</th>
                  <th className="text-right">Lines</th>
                  <th className="text-right">Amount</th>
                  <th>Approval</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reqs.map((r) => (
                  <tr key={r.id}>
                    <td className="font-mono text-xs text-primary">{r.id}</td>
                    <td className="text-xs text-muted-foreground">{formatDate(r.date)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar size="xs"><AvatarFallback name={r.requester}>{initials(r.requester)}</AvatarFallback></Avatar>
                        <span>{r.requester}</span>
                      </div>
                    </td>
                    <td><Badge variant="outline" size="sm">{r.dept}</Badge></td>
                    <td className="text-sm">{r.description}</td>
                    <td className="text-right font-mono">{r.items}</td>
                    <td className="text-right font-mono font-medium">{formatCurrency(r.amount)}</td>
                    <td><ApprovalChain approvers={r.approvers} /></td>
                    <td><StatusBadge status={r.status} /></td>
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
