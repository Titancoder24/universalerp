import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  Edit,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/ui/stat-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { cn, formatCurrency, formatDate, initials } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

const contacts = [
  { name: 'Heinrich Mueller', title: 'Account Manager', email: 'h.mueller@apexindustrial.com', phone: '+1 312 555 0142', primary: true },
  { name: 'Sandra Pak', title: 'Customer Service', email: 's.pak@apexindustrial.com', phone: '+1 312 555 0143', primary: false },
  { name: 'David Cho', title: 'Logistics Manager', email: 'd.cho@apexindustrial.com', phone: '+1 312 555 0145', primary: false },
];

const recentPOs = [
  { id: 'PO-1204', date: '2026-05-14', items: 12, value: 24800, status: 'sent' },
  { id: 'PO-1201', date: '2026-05-12', items: 38, value: 142000, status: 'partial' },
  { id: 'PO-1198', date: '2026-05-08', items: 18, value: 38400, status: 'completed' },
  { id: 'PO-1184', date: '2026-05-02', items: 24, value: 52800, status: 'completed' },
  { id: 'PO-1172', date: '2026-04-22', items: 8, value: 18200, status: 'completed' },
];

const bills = [
  { id: 'VB-2098', date: '2026-05-09', amount: 38400, due: '2026-06-08', status: 'pending' },
  { id: 'VB-2087', date: '2026-04-28', amount: 52800, due: '2026-05-28', status: 'paid' },
  { id: 'VB-2082', date: '2026-04-15', amount: 18200, due: '2026-05-15', status: 'paid' },
];

const rfqs = [
  { id: 'RFQ-2026-018', date: '2026-05-10', subject: 'M8 bolt restock Q3', items: 4, status: 'open', deadline: '2026-05-22' },
  { id: 'RFQ-2026-014', date: '2026-04-22', subject: 'Annual fastener contract', items: 12, status: 'awarded', deadline: '2026-05-04' },
];

const documents = [
  { name: 'KYC_Certificate.pdf', type: 'KYC', size: '420 KB', validity: '2027-03-15' },
  { name: 'W9_Tax_Form.pdf', type: 'Tax', size: '120 KB', validity: '2026-12-31' },
  { name: 'ISO_9001_Cert.pdf', type: 'Quality', size: '880 KB', validity: '2027-08-20' },
  { name: 'Insurance_GL_$2M.pdf', type: 'Insurance', size: '240 KB', validity: '2026-09-12' },
  { name: 'Supplier_Code_Conduct.pdf', type: 'Compliance', size: '180 KB', validity: '2026-12-31' },
];

const scoreMetrics = [
  { label: 'On-time delivery', value: 96, target: 95, weight: 30 },
  { label: 'Quality acceptance', value: 99.4, target: 99, weight: 25 },
  { label: 'Price competitiveness', value: 87, target: 85, weight: 20 },
  { label: 'Responsiveness', value: 92, target: 90, weight: 15 },
  { label: 'Documentation', value: 94, target: 90, weight: 10 },
];

export default async function VendorDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Apex Industrial Supply"
        description="Strategic supplier · Tier 1 · $842K YTD spend"
        breadcrumbs={[
          { label: 'Procurement', href: '/app/procurement' },
          { label: 'Vendors', href: '/app/procurement/vendors' },
          { label: id },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/procurement/vendors"><ArrowLeft className="size-4" /></Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline"><MessageSquare className="size-4" /> Message</Button>
            <Button variant="outline"><FileText className="size-4" /> New RFQ</Button>
            <Button><Edit className="size-4" /> Edit</Button>
          </>
        }
      />

      <Card>
        <CardContent className="grid gap-6 p-6 md:grid-cols-[1fr_auto]">
          <div className="flex gap-4">
            <Avatar size="xl"><AvatarFallback name="Apex Industrial Supply">AI</AvatarFallback></Avatar>
            <div className="space-y-2">
              <div>
                <div className="font-mono text-xs text-primary">APX-001</div>
                <h2 className="text-xl font-semibold">Apex Industrial Supply</h2>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5"><MapPin className="size-4" /> Chicago, IL, USA</div>
                <div className="flex items-center gap-1.5"><Globe className="size-4" /> www.apexindustrial.com</div>
                <div className="flex items-center gap-1.5"><Phone className="size-4" /> +1 312 555 0142</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="soft">Strategic supplier</Badge>
                <Badge variant="outline">Raw materials</Badge>
                <Badge variant="success">KYC approved</Badge>
                <Badge variant="outline">Net 30</Badge>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:w-[420px]">
            <StatCard label="YTD spend" value={842000} format="currency" delta={12.4} />
            <StatCard label="POs YTD" value={38} format="number" delta={8.2} />
            <StatCard label="On-time delivery" value={96} format="percent" delta={2.4} />
            <StatCard label="Performance" value={94} delta={1.2} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="pos">POs</TabsTrigger>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="rfqs">RFQs</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Business profile</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                ['Tax ID', '36-1234567'],
                ['DUNS', '04-123-4567'],
                ['Registered name', 'Apex Industrial Supply Co'],
                ['Type', 'C-Corporation'],
                ['Year established', '1987'],
                ['Annual revenue', '~$120M'],
                ['Employees', '480'],
                ['Bank', 'JPMorgan Chase'],
                ['Currency', 'USD'],
                ['Lead time avg', '14 days'],
              ].map(([k, v]) => (
                <div key={k}><div className="text-xs text-muted-foreground">{k}</div><div className="font-medium">{v}</div></div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Items supplied</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {['BOLT-M8-40', 'BEAR-6204', 'GASKET-12', 'WELD-ROD-6013', 'CABLE-CAT6-305', 'PIPE-PVC-110'].map((sku) => (
                <div key={sku} className="flex items-center justify-between rounded-md border border-border p-2">
                  <span className="font-mono text-xs text-primary">{sku}</span>
                  <Badge variant="outline" size="sm">Preferred</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((c) => (
              <Card key={c.email}>
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start gap-3">
                    <Avatar size="md"><AvatarFallback name={c.name}>{initials(c.name)}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{c.name}</span>
                        {c.primary && <Badge variant="soft" size="sm">Primary</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">{c.title}</div>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><Mail className="size-3.5" /><span>{c.email}</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Phone className="size-3.5" /><span className="font-mono text-xs">{c.phone}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="border-dashed">
              <CardContent className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                <Plus className="size-8 text-muted-foreground" />
                <Button variant="outline" size="sm">Add contact</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pos">
          <Card className="p-0">
            <table className="erp-table">
              <thead><tr><th>PO #</th><th>Date</th><th className="text-right">Items</th><th className="text-right">Value</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {recentPOs.map((p) => (
                  <tr key={p.id}>
                    <td className="font-mono text-xs text-primary">{p.id}</td>
                    <td>{formatDate(p.date)}</td>
                    <td className="text-right font-mono">{p.items}</td>
                    <td className="text-right font-mono">{formatCurrency(p.value)}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td className="text-right"><Button variant="ghost" size="xs"><ExternalLink className="size-3" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="bills">
          <Card className="p-0">
            <table className="erp-table">
              <thead><tr><th>Bill #</th><th>Date</th><th className="text-right">Amount</th><th>Due</th><th>Status</th></tr></thead>
              <tbody>
                {bills.map((b) => (
                  <tr key={b.id}>
                    <td className="font-mono text-xs text-primary">{b.id}</td>
                    <td>{formatDate(b.date)}</td>
                    <td className="text-right font-mono">{formatCurrency(b.amount)}</td>
                    <td>{formatDate(b.due)}</td>
                    <td><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="rfqs">
          <Card className="p-0">
            <table className="erp-table">
              <thead><tr><th>RFQ #</th><th>Date</th><th>Subject</th><th className="text-right">Lines</th><th>Deadline</th><th>Status</th></tr></thead>
              <tbody>
                {rfqs.map((r) => (
                  <tr key={r.id}>
                    <td className="font-mono text-xs text-primary">{r.id}</td>
                    <td>{formatDate(r.date)}</td>
                    <td className="font-medium">{r.subject}</td>
                    <td className="text-right font-mono">{r.items}</td>
                    <td>{formatDate(r.deadline)}</td>
                    <td><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="grid gap-3 p-6 md:grid-cols-2">
              {documents.map((d) => (
                <div key={d.name} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary"><FileText className="size-5" /></div>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{d.name}</div>
                      <div className="text-xs text-muted-foreground">{d.type} · {d.size} · valid until {formatDate(d.validity)}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon-sm"><Download className="size-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Scorecard breakdown</CardTitle><CardDescription>Quarterly weighted metrics</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                {scoreMetrics.map((m) => (
                  <div key={m.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{m.label}</span>
                        <span className="text-xs text-muted-foreground">weight {m.weight}%</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className={cn(m.value >= m.target ? 'text-success' : 'text-warning')}>{m.value}%</span>
                        <span className="text-xs text-muted-foreground">target {m.target}%</span>
                      </div>
                    </div>
                    <Progress value={m.value} indicatorClassName={m.value >= m.target ? 'bg-success' : 'bg-warning'} />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Overall</CardTitle><CardDescription>Tier 1 supplier</CardDescription></CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                <div className="relative flex size-32 items-center justify-center">
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--success))" strokeWidth="8" strokeDasharray={`${94 * 2.64} 264`} strokeLinecap="round" />
                  </svg>
                  <div className="text-3xl font-bold tabular-nums">94<span className="text-sm font-normal text-muted-foreground">%</span></div>
                </div>
                <div className="flex items-center gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn('size-4', i < 5 ? 'fill-warning text-warning' : 'text-muted-foreground/30')} />)}</div>
                <Badge variant="success">Preferred</Badge>
                <div className="text-xs text-muted-foreground">Top 10% of suppliers</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
