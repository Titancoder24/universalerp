import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/ui/stat-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatCurrency, formatDate, initials } from '@/lib/utils';

interface RFQ {
  id: string;
  subject: string;
  category: string;
  invited: number;
  responded: number;
  deadline: string;
  best: number;
  budget: number;
  status: 'open' | 'closed' | 'awarded' | 'draft';
  owner: string;
}

const rfqs: RFQ[] = [
  { id: 'RFQ-2026-018', subject: 'M8 bolt restock — Q3', category: 'Fasteners', invited: 6, responded: 4, deadline: '2026-05-22', best: 18400, budget: 24000, status: 'open', owner: 'Sara Kim' },
  { id: 'RFQ-2026-017', subject: 'CAT6 cable annual contract', category: 'Cabling', invited: 5, responded: 5, deadline: '2026-05-19', best: 84200, budget: 95000, status: 'open', owner: 'Ravi Sharma' },
  { id: 'RFQ-2026-016', subject: 'Hydraulic oil bulk 2026', category: 'Lubricants', invited: 4, responded: 4, deadline: '2026-05-15', best: 142800, budget: 160000, status: 'closed', owner: 'Hugo Park' },
  { id: 'RFQ-2026-015', subject: 'PCB assembly services', category: 'Services', invited: 8, responded: 6, deadline: '2026-05-12', best: 248000, budget: 280000, status: 'closed', owner: 'Sara Kim' },
  { id: 'RFQ-2026-014', subject: 'Annual fastener contract', category: 'Fasteners', invited: 8, responded: 7, deadline: '2026-05-04', best: 384000, budget: 420000, status: 'awarded', owner: 'Sara Kim' },
  { id: 'RFQ-2026-013', subject: 'Bearing 6200-series', category: 'Bearings', invited: 5, responded: 5, deadline: '2026-04-28', best: 62400, budget: 75000, status: 'awarded', owner: 'Hugo Park' },
  { id: 'RFQ-2026-012', subject: 'Cabin air filters Q2-Q3', category: 'Filtration', invited: 4, responded: 4, deadline: '2026-04-22', best: 38200, budget: 45000, status: 'awarded', owner: 'Lina Wang' },
  { id: 'RFQ-2026-019', subject: 'Powder coating service', category: 'Services', invited: 0, responded: 0, deadline: '2026-05-30', best: 0, budget: 120000, status: 'draft', owner: 'Lina Wang' },
];

const openRfq = rfqs.filter((r) => r.status === 'open');
const closedRfq = rfqs.filter((r) => r.status === 'closed');
const awardedRfq = rfqs.filter((r) => r.status === 'awarded');

export default function RFQListPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="RFQs / RFPs"
        description="Solicit bids from vendors, compare quotes, and award contracts."
        breadcrumbs={[
          { label: 'Procurement', href: '/app/procurement' },
          { label: 'RFQs' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New RFQ</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open RFQs" value={openRfq.length} format="number" delta={2} />
        <StatCard label="Avg responses" value={4.6} delta={8} />
        <StatCard label="Avg savings" value={12.4} format="percent" delta={1.8} />
        <StatCard label="Awarded YTD" value={awardedRfq.length * 8} format="number" delta={14} />
      </div>

      <Tabs defaultValue="open">
        <div className="flex items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="open">Open <Badge variant="info" size="sm" className="ml-1">{openRfq.length}</Badge></TabsTrigger>
            <TabsTrigger value="closed">Closed <Badge variant="warning" size="sm" className="ml-1">{closedRfq.length}</Badge></TabsTrigger>
            <TabsTrigger value="awarded">Awarded <Badge variant="soft" size="sm" className="ml-1">{awardedRfq.length}</Badge></TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="pl-8 w-64" placeholder="Search RFQ #, subject…" />
            </div>
          </div>
        </div>

        <TabsContent value="open">
          <div className="grid gap-4 md:grid-cols-2">
            {openRfq.map((r) => {
              const responseRate = (r.responded / r.invited) * 100;
              const savings = ((r.budget - r.best) / r.budget) * 100;
              const daysLeft = Math.ceil((new Date(r.deadline).getTime() - new Date('2026-05-15').getTime()) / 86400000);
              return (
                <Card key={r.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-mono text-xs text-primary">{r.id}</div>
                        <Link href={`/app/procurement/rfq/${r.id}`} className="block mt-1 text-base font-semibold hover:text-primary">{r.subject}</Link>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" size="sm">{r.category}</Badge>
                          <span>·</span>
                          <span>Owner {r.owner}</span>
                        </div>
                      </div>
                      <StatusBadge status="open" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Response rate</span>
                        <span className="font-medium">{r.responded} / {r.invited}</span>
                      </div>
                      <Progress value={responseRate} />
                    </div>

                    <div className="grid grid-cols-3 gap-3 rounded-lg border border-border p-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Best bid</div>
                        <div className="mt-0.5 font-mono text-sm font-semibold">{formatCurrency(r.best)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Budget</div>
                        <div className="mt-0.5 font-mono text-sm">{formatCurrency(r.budget)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Savings</div>
                        <div className="mt-0.5 font-mono text-sm font-semibold text-success">{savings.toFixed(1)}%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                      <div className="flex items-center gap-1.5 text-warning">
                        <Clock className="size-3.5" />
                        <span className="font-medium">{daysLeft} days left · closes {formatDate(r.deadline)}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/app/procurement/rfq/${r.id}`}>Compare <ArrowRight className="size-3.5" /></Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="closed">
          <Card className="p-0">
            <table className="erp-table">
              <thead><tr><th>RFQ #</th><th>Subject</th><th>Category</th><th className="text-right">Bids</th><th className="text-right">Best bid</th><th className="text-right">Budget</th><th>Closed</th></tr></thead>
              <tbody>
                {closedRfq.map((r) => (
                  <tr key={r.id}>
                    <td className="font-mono text-xs text-primary"><Link href={`/app/procurement/rfq/${r.id}`} className="hover:underline">{r.id}</Link></td>
                    <td className="font-medium">{r.subject}</td>
                    <td><Badge variant="outline" size="sm">{r.category}</Badge></td>
                    <td className="text-right font-mono">{r.responded}/{r.invited}</td>
                    <td className="text-right font-mono">{formatCurrency(r.best)}</td>
                    <td className="text-right font-mono text-muted-foreground">{formatCurrency(r.budget)}</td>
                    <td>{formatDate(r.deadline)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="awarded">
          <Card className="p-0">
            <table className="erp-table">
              <thead><tr><th>RFQ #</th><th>Subject</th><th>Category</th><th>Awarded vendor</th><th className="text-right">Amount</th><th className="text-right">Savings</th><th>Awarded</th></tr></thead>
              <tbody>
                {awardedRfq.map((r) => {
                  const savings = ((r.budget - r.best) / r.budget) * 100;
                  return (
                    <tr key={r.id}>
                      <td className="font-mono text-xs text-primary"><Link href={`/app/procurement/rfq/${r.id}`} className="hover:underline">{r.id}</Link></td>
                      <td className="font-medium">{r.subject}</td>
                      <td><Badge variant="outline" size="sm">{r.category}</Badge></td>
                      <td className="flex items-center gap-2"><Avatar size="xs"><AvatarFallback name="Apex">AI</AvatarFallback></Avatar>Apex Industrial</td>
                      <td className="text-right font-mono font-medium">{formatCurrency(r.best)}</td>
                      <td className="text-right font-mono text-success">{savings.toFixed(1)}%</td>
                      <td>{formatDate(r.deadline)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card className="p-0">
            <table className="erp-table">
              <thead><tr><th>RFQ #</th><th>Subject</th><th>Category</th><th className="text-right">Bids</th><th>Deadline</th><th>Owner</th><th>Status</th></tr></thead>
              <tbody>
                {rfqs.map((r) => (
                  <tr key={r.id}>
                    <td className="font-mono text-xs text-primary">{r.id}</td>
                    <td className="font-medium">{r.subject}</td>
                    <td><Badge variant="outline" size="sm">{r.category}</Badge></td>
                    <td className="text-right font-mono">{r.responded}/{r.invited}</td>
                    <td>{formatDate(r.deadline)}</td>
                    <td>{r.owner}</td>
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
