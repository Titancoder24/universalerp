import Link from 'next/link';
import {
  ArrowLeft,
  Award,
  Brain,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Send,
  Sparkles,
  Star,
  Trophy,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatCard } from '@/components/ui/stat-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatCurrency, formatDate, initials } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Bidder {
  id: string;
  name: string;
  country: string;
  score: number;
  total: number;
  delivery: string;
  payment: string;
  recommended: boolean;
  lines: number[];
}

interface LineItem {
  id: string;
  sku: string;
  description: string;
  qty: number;
  uom: string;
  budget: number;
}

const lineItems: LineItem[] = [
  { id: 'L1', sku: 'BOLT-M8-40', description: 'Bolt M8 x 40mm zinc plated DIN 933', qty: 20000, uom: 'pcs', budget: 0.45 },
  { id: 'L2', sku: 'BOLT-M10-50', description: 'Bolt M10 x 50mm zinc plated DIN 933', qty: 8000, uom: 'pcs', budget: 0.78 },
  { id: 'L3', sku: 'NUT-M8', description: 'Hex nut M8 zinc plated', qty: 30000, uom: 'pcs', budget: 0.12 },
  { id: 'L4', sku: 'WASHER-M8', description: 'Flat washer M8 zinc plated', qty: 30000, uom: 'pcs', budget: 0.04 },
];

const bidders: Bidder[] = [
  { id: 'V001', name: 'Apex Industrial Supply', country: 'USA', score: 94, total: 19840, delivery: '14 days', payment: 'Net 30', recommended: true, lines: [0.42, 0.74, 0.10, 0.038] },
  { id: 'V002', name: 'Shenzhen Tek Hardware', country: 'CN', score: 88, total: 14620, delivery: '35 days', payment: 'Net 45', recommended: false, lines: [0.18, 0.32, 0.08, 0.021] },
  { id: 'V003', name: 'EuroFasteners GmbH', country: 'DE', score: 91, total: 22480, delivery: '21 days', payment: 'Net 30', recommended: false, lines: [0.38, 0.62, 0.11, 0.041] },
  { id: 'V012', name: 'Bossard Industrial AG', country: 'CH', score: 92, total: 24160, delivery: '18 days', payment: 'Net 30', recommended: false, lines: [0.44, 0.78, 0.13, 0.042] },
];

export default async function RFQDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`Annual fastener contract`}
        description="Bid comparison · 4 bidders · closes May 22"
        breadcrumbs={[
          { label: 'Procurement', href: '/app/procurement' },
          { label: 'RFQs', href: '/app/procurement/rfq' },
          { label: id },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/procurement/rfq"><ArrowLeft className="size-4" /></Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button variant="outline"><Send className="size-4" /> Re-invite</Button>
            <Button><Trophy className="size-4" /> Award</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Bids received" value={bidders.length} format="number" deltaLabel="of 6 invited" />
        <StatCard label="Best bid" value={Math.min(...bidders.map((b) => b.total))} format="currency" />
        <StatCard label="vs budget" value={-32.4} format="percent" delta={32.4} />
        <StatCard label="Closes in" value={7} deltaLabel="days" />
      </div>

      <Card className="border-success/30 bg-success/5">
        <CardContent className="flex items-start gap-3 p-5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-success/15 text-success">
            <Sparkles className="size-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold">AI recommendation: Apex Industrial Supply</div>
            <p className="text-sm text-muted-foreground mt-1">
              Score 94/100. Best total cost of ownership when factoring delivery speed (14d vs 35d for cheapest), historical on-time rate (96%), and quality score (99.4%).
              Net price gap of $5,220 offset by faster lead time and 7.5% lower defect rate.
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="success" size="sm">Strategic supplier</Badge>
              <Badge variant="success" size="sm">Best TCO</Badge>
              <Badge variant="soft" size="sm">14 day lead</Badge>
              <Badge variant="soft" size="sm">96% on-time</Badge>
            </div>
          </div>
          <Button variant="success" size="sm"><Award className="size-4" /> Award to Apex</Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="comparison">
        <TabsList>
          <TabsTrigger value="comparison">Bid Matrix</TabsTrigger>
          <TabsTrigger value="bidders">Bidders</TabsTrigger>
          <TabsTrigger value="details">RFQ Details</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison">
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-background z-10 min-w-[260px]">Line item</th>
                    <th className="text-right">Qty</th>
                    <th className="text-right">Budget</th>
                    {bidders.map((b) => (
                      <th key={b.id} className="text-center min-w-[150px]">
                        <div className="flex flex-col items-center gap-1">
                          <Avatar size="xs"><AvatarFallback name={b.name}>{initials(b.name)}</AvatarFallback></Avatar>
                          <span className="text-xs">{b.name.split(' ')[0]}</span>
                          {b.recommended && <Badge variant="success" size="sm"><Trophy className="size-3" /> Best</Badge>}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((line, idx) => {
                    const bidsForLine = bidders.map((b) => b.lines[idx]);
                    const minPrice = Math.min(...bidsForLine);
                    return (
                      <tr key={line.id}>
                        <td className="sticky left-0 bg-background z-10 min-w-[260px]">
                          <div className="font-mono text-xs text-primary">{line.sku}</div>
                          <div className="text-sm">{line.description}</div>
                        </td>
                        <td className="text-right font-mono">{line.qty.toLocaleString()}</td>
                        <td className="text-right font-mono text-muted-foreground">{formatCurrency(line.budget)}</td>
                        {bidders.map((b, bi) => {
                          const price = b.lines[idx];
                          const isMin = price === minPrice;
                          const lineTotal = price * line.qty;
                          return (
                            <td key={b.id} className={cn('text-center', isMin && 'bg-success/5')}>
                              <div className={cn('font-mono text-sm font-medium', isMin && 'text-success')}>{formatCurrency(price)}</div>
                              <div className="text-xs text-muted-foreground">{formatCurrency(lineTotal)}</div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  <tr className="bg-muted/40 font-medium">
                    <td className="sticky left-0 bg-muted/40 z-10">Total</td>
                    <td></td>
                    <td className="text-right font-mono">{formatCurrency(lineItems.reduce((a, l) => a + l.budget * l.qty, 0))}</td>
                    {bidders.map((b) => {
                      const isLowest = b.total === Math.min(...bidders.map((x) => x.total));
                      return (
                        <td key={b.id} className={cn('text-center font-mono font-semibold', isLowest && 'bg-success/10 text-success')}>
                          {formatCurrency(b.total)}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="sticky left-0 bg-background z-10">AI score</td>
                    <td></td>
                    <td></td>
                    {bidders.map((b) => (
                      <td key={b.id} className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Brain className="size-3.5 text-info" />
                          <span className={cn('font-semibold', b.score >= 90 ? 'text-success' : b.score >= 80 ? 'text-warning' : 'text-muted-foreground')}>{b.score}</span>
                          <span className="text-xs text-muted-foreground">/100</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky left-0 bg-background z-10">Delivery</td>
                    <td></td>
                    <td></td>
                    {bidders.map((b) => (<td key={b.id} className="text-center text-xs">{b.delivery}</td>))}
                  </tr>
                  <tr>
                    <td className="sticky left-0 bg-background z-10">Payment terms</td>
                    <td></td>
                    <td></td>
                    {bidders.map((b) => (<td key={b.id} className="text-center text-xs">{b.payment}</td>))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="bidders">
          <div className="grid gap-4 md:grid-cols-2">
            {bidders.map((b) => (
              <Card key={b.id} className={cn(b.recommended && 'ring-2 ring-success/40')}>
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar size="lg"><AvatarFallback name={b.name}>{initials(b.name)}</AvatarFallback></Avatar>
                      <div>
                        <div className="font-semibold">{b.name}</div>
                        <div className="text-xs text-muted-foreground">{b.country} · {b.payment}</div>
                      </div>
                    </div>
                    {b.recommended && <Badge variant="success"><Trophy className="size-3" /> Recommended</Badge>}
                  </div>
                  <div className="grid grid-cols-3 gap-3 rounded-lg border border-border p-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Total</div>
                      <div className="mt-0.5 font-mono text-sm font-bold">{formatCurrency(b.total)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Lead time</div>
                      <div className="mt-0.5 font-mono text-sm">{b.delivery}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">AI Score</div>
                      <div className="mt-0.5 font-mono text-sm font-bold">{b.score}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1"><FileText className="size-4" /> Quote</Button>
                    <Button size="sm" className="flex-1"><Award className="size-4" /> Award</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader><CardTitle>RFQ specifications</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                ['Reference', id],
                ['Subject', 'Annual fastener contract 2026'],
                ['Category', 'Fasteners'],
                ['Currency', 'USD'],
                ['Incoterms', 'DDP — Delivered duty paid'],
                ['Payment', 'Net 30, 2% / 10 EOM discount'],
                ['Contract length', '12 months'],
                ['Annual volume', '88,000 pcs'],
                ['Quality req', 'ISO 9001:2015'],
                ['Issued', '2026-04-15'],
                ['Deadline', '2026-05-22'],
                ['Owner', 'Sara Kim'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs text-muted-foreground">{k}</div>
                  <div className="font-medium">{v}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
