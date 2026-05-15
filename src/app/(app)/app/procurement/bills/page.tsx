import {
  CheckCircle2,
  Circle,
  Download,
  Filter,
  Plus,
  Search,
  Wallet,
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

type MatchStatus = 'matched' | 'mismatch' | 'pending' | 'partial';

interface Bill {
  id: string;
  date: string;
  due: string;
  po: string | null;
  gr: string | null;
  vendor: string;
  amount: number;
  paid: number;
  match: MatchStatus;
  status: 'pending' | 'approved' | 'paid' | 'overdue' | 'cancelled';
}

const bills: Bill[] = [
  { id: 'VB-2098', date: '2026-05-09', due: '2026-06-08', po: 'PO-1201', gr: 'GR-2098', vendor: 'Apex Industrial Supply', amount: 38400, paid: 0, match: 'matched', status: 'approved' },
  { id: 'VB-2097', date: '2026-05-08', due: '2026-06-07', po: 'PO-1199', gr: 'GR-2097', vendor: 'CableNet Solutions', amount: 6800, paid: 0, match: 'matched', status: 'approved' },
  { id: 'VB-2096', date: '2026-05-08', due: '2026-06-07', po: 'PO-1202', gr: 'GR-2099', vendor: 'AirGuard Co Ltd', amount: 8400, paid: 0, match: 'matched', status: 'pending' },
  { id: 'VB-2095', date: '2026-05-07', due: '2026-06-06', po: 'PO-1198', gr: 'GR-2093', vendor: 'EuroFasteners GmbH', amount: 19200, paid: 0, match: 'partial', status: 'pending' },
  { id: 'VB-2094', date: '2026-05-04', due: '2026-06-03', po: 'PO-1196', gr: 'GR-2095', vendor: 'ColorMax AG', amount: 9200, paid: 0, match: 'mismatch', status: 'pending' },
  { id: 'VB-2093', date: '2026-05-02', due: '2026-06-01', po: 'PO-1200', gr: 'GR-2094', vendor: 'Petrolab Inc', amount: 12800, paid: 12800, match: 'matched', status: 'paid' },
  { id: 'VB-2092', date: '2026-04-28', due: '2026-05-28', po: 'PO-1184', gr: 'GR-2087', vendor: 'Apex Industrial Supply', amount: 52800, paid: 52800, match: 'matched', status: 'paid' },
  { id: 'VB-2091', date: '2026-04-22', due: '2026-05-22', po: 'PO-1197', gr: 'GR-2096', vendor: 'PowerCells Ltd', amount: 18200, paid: 18200, match: 'matched', status: 'paid' },
  { id: 'VB-2090', date: '2026-04-15', due: '2026-05-15', po: 'PO-1182', gr: 'GR-2078', vendor: 'Apex Industrial Supply', amount: 18200, paid: 18200, match: 'matched', status: 'paid' },
  { id: 'VB-2089', date: '2026-04-12', due: '2026-05-12', po: 'PO-1181', gr: 'GR-2076', vendor: 'Shenzhen Tek Hardware', amount: 24800, paid: 0, match: 'partial', status: 'overdue' },
  { id: 'VB-2088', date: '2026-04-09', due: '2026-05-09', po: null, gr: null, vendor: 'Acme Office Supply', amount: 1200, paid: 0, match: 'pending', status: 'overdue' },
  { id: 'VB-2087', date: '2026-05-12', due: '2026-06-11', po: 'PO-1191', gr: 'GR-2089', vendor: 'AirGuard Co Ltd', amount: 9800, paid: 0, match: 'matched', status: 'pending' },
];

const matchDot = (m: MatchStatus) => {
  if (m === 'matched') return <span className="inline-flex items-center gap-1 text-success font-medium text-xs"><CheckCircle2 className="size-3.5" /> 3-way</span>;
  if (m === 'mismatch') return <span className="inline-flex items-center gap-1 text-destructive font-medium text-xs"><XCircle className="size-3.5" /> Mismatch</span>;
  if (m === 'partial') return <span className="inline-flex items-center gap-1 text-warning font-medium text-xs"><Circle className="size-3.5 fill-warning" /> Partial</span>;
  return <span className="inline-flex items-center gap-1 text-muted-foreground text-xs"><Circle className="size-3.5" /> No PO</span>;
};

export default function BillsPage() {
  const totalOutstanding = bills.filter((b) => b.status !== 'paid' && b.status !== 'cancelled').reduce((a, b) => a + b.amount - b.paid, 0);
  const overdueAmount = bills.filter((b) => b.status === 'overdue').reduce((a, b) => a + b.amount - b.paid, 0);
  const mismatched = bills.filter((b) => b.match === 'mismatch').length;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Vendor bills"
        description="Accounts payable with 3-way match against POs and goods receipts"
        breadcrumbs={[
          { label: 'Procurement', href: '/app/procurement' },
          { label: 'Bills' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New bill</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Outstanding" value={totalOutstanding} format="currency" delta={8.4} invertTrend />
        <StatCard label="Overdue" value={overdueAmount} format="currency" invertTrend />
        <StatCard label="Match mismatches" value={mismatched} format="number" invertTrend />
        <StatCard label="Paid this month" value={102000} format="currency" delta={14.2} />
      </div>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="all">All <Badge variant="soft" size="sm" className="ml-1">{bills.length}</Badge></TabsTrigger>
            <TabsTrigger value="pending">Pending <Badge variant="warning" size="sm" className="ml-1">{bills.filter((b) => b.status === 'pending').length}</Badge></TabsTrigger>
            <TabsTrigger value="approved">Approved <Badge variant="info" size="sm" className="ml-1">{bills.filter((b) => b.status === 'approved').length}</Badge></TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="overdue">Overdue <Badge variant="destructive" size="sm" className="ml-1">{bills.filter((b) => b.status === 'overdue').length}</Badge></TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="pl-8 w-64" placeholder="Search bill #, vendor…" />
            </div>
            <Select>
              <SelectTrigger className="w-36"><SelectValue placeholder="Match" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="matched">3-way match</SelectItem>
                <SelectItem value="mismatch">Mismatched</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all">
          <Card className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Bill #</th>
                  <th>Date</th>
                  <th>Due</th>
                  <th>Vendor</th>
                  <th>PO</th>
                  <th>GR</th>
                  <th>3-way match</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Paid</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((b) => (
                  <tr key={b.id}>
                    <td className="font-mono text-xs text-primary">{b.id}</td>
                    <td className="text-xs">{formatDate(b.date)}</td>
                    <td className={cn('text-xs', b.status === 'overdue' && 'text-destructive font-medium')}>{formatDate(b.due)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar size="xs"><AvatarFallback name={b.vendor}>{initials(b.vendor)}</AvatarFallback></Avatar>
                        <span className="truncate font-medium max-w-[180px]">{b.vendor}</span>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-muted-foreground">{b.po || '—'}</td>
                    <td className="font-mono text-xs text-muted-foreground">{b.gr || '—'}</td>
                    <td>{matchDot(b.match)}</td>
                    <td className="text-right font-mono font-medium">{formatCurrency(b.amount)}</td>
                    <td className="text-right font-mono text-success">{b.paid > 0 ? formatCurrency(b.paid) : '—'}</td>
                    <td><StatusBadge status={b.status} /></td>
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
