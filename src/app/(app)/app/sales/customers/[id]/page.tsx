import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Building2,
  ChevronLeft,
  CreditCard,
  Download,
  Edit,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Phone,
  Plus,
  Send,
  ShoppingCart,
  Sparkles,
  User,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { customers, invoices, orders, quotations } from '../../_data';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  initials,
} from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

const contacts = [
  { name: 'Daniel Wong', role: 'CFO', email: 'daniel.wong@example.com', phone: '+1 (415) 555-0142', primary: true },
  { name: 'Lisa Martinez', role: 'Procurement Manager', email: 'lisa.martinez@example.com', phone: '+1 (415) 555-0188', primary: false },
  { name: 'Adrian Patel', role: 'AP Specialist', email: 'adrian.patel@example.com', phone: '+1 (415) 555-0177', primary: false },
];

const addresses = [
  {
    type: 'Billing',
    street: '450 Market Street, Suite 1200',
    city: 'San Francisco',
    state: 'CA',
    postal: '94105',
    country: 'United States',
    primary: true,
  },
  {
    type: 'Shipping',
    street: '2125 Industrial Parkway',
    city: 'Hayward',
    state: 'CA',
    postal: '94545',
    country: 'United States',
    primary: false,
  },
];

const activities = [
  { type: 'invoice', icon: FileText, text: 'Invoice INV-2189 sent', time: '2026-05-12T14:30:00', by: 'Sarah Chen' },
  { type: 'payment', icon: CreditCard, text: 'Payment of $12,400 received', time: '2026-05-10T09:15:00', by: 'System' },
  { type: 'order', icon: ShoppingCart, text: 'Order SO-3401 confirmed', time: '2026-05-08T11:00:00', by: 'Sarah Chen' },
  { type: 'email', icon: Mail, text: 'Quote follow-up email sent', time: '2026-05-06T15:45:00', by: 'Sarah Chen' },
  { type: 'call', icon: Phone, text: 'Discovery call with Daniel Wong (45m)', time: '2026-05-04T10:00:00', by: 'Sarah Chen' },
  { type: 'meeting', icon: User, text: 'On-site visit scheduled', time: '2026-05-02T08:00:00', by: 'Sarah Chen' },
];

const communications = [
  { from: 'daniel.wong@acmeindustries.com', subject: 'Re: Q2 Order Confirmation', preview: 'Thanks for the quick turnaround. Approved on our end, please proceed with…', time: '2 hours ago', unread: true },
  { from: 'lisa.martinez@acmeindustries.com', subject: 'Quote Q-1098 review', preview: "We've reviewed the quote and have a few questions about the volume…", time: 'Yesterday', unread: false },
  { from: 'Sarah Chen', subject: 'Re: Updated proposal', preview: 'Hi Daniel — attaching the revised proposal with the discount structure…', time: '2 days ago', unread: false },
  { from: 'adrian.patel@acmeindustries.com', subject: 'Statement request', preview: "Could you send over the latest statement of account for our records?…", time: '3 days ago', unread: false },
];

const documents = [
  { name: 'MSA-Acme-2025-signed.pdf', size: '2.4 MB', uploaded: '2025-09-12', type: 'Contract' },
  { name: 'Acme-Procurement-Policy.pdf', size: '1.1 MB', uploaded: '2025-08-04', type: 'Policy' },
  { name: 'W9-Form-Acme.pdf', size: '142 KB', uploaded: '2025-01-22', type: 'Tax' },
  { name: 'Insurance-Cert-2026.pdf', size: '380 KB', uploaded: '2026-01-15', type: 'Insurance' },
  { name: 'Vendor-Setup-Acme.xlsx', size: '54 KB', uploaded: '2024-06-30', type: 'Onboarding' },
];

const payments = [
  { id: 'PAY-1042', invoice: 'INV-2185', amount: 18200, method: 'ACH', date: '2026-05-12' },
  { id: 'PAY-1037', invoice: 'INV-2180', amount: 12400, method: 'Wire', date: '2026-05-10' },
  { id: 'PAY-1029', invoice: 'INV-2167', amount: 24800, method: 'ACH', date: '2026-05-02' },
  { id: 'PAY-1022', invoice: 'INV-2152', amount: 18900, method: 'Check', date: '2026-04-25' },
  { id: 'PAY-1015', invoice: 'INV-2140', amount: 42100, method: 'Wire', date: '2026-04-18' },
];

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const customer = customers.find((c) => c.id === id) ?? customers[0];

  if (!customer) {
    notFound();
  }

  const customerQuotes = quotations.filter((q) => q.customerId === customer.id);
  const customerOrders = orders.filter((o) => o.customerId === customer.id);
  const customerInvoices = invoices.filter((i) => i.customerId === customer.id);

  const stats = [
    { label: 'Lifetime revenue', value: customer.revenue, format: 'currency' as const },
    { label: 'Outstanding', value: customer.outstanding, format: 'currency' as const, tone: 'warning' as const },
    { label: 'Open orders', value: customerOrders.filter((o) => !['delivered', 'invoiced', 'cancelled'].includes(o.status)).length, format: 'number' as const },
    { label: 'Credit limit', value: customer.creditLimit, format: 'currency' as const },
  ];

  return (
    <div className="flex flex-col">
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Avatar size="xl">
              <AvatarFallback name={customer.name}>{initials(customer.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span>{customer.name}</span>
                <StatusBadge status={customer.status} />
              </div>
              <p className="font-mono text-xs font-normal text-muted-foreground">
                {customer.code} · since {formatDate(customer.joinedAt)}
              </p>
            </div>
          </div>
        }
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/sales/customers">
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
        }
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Sales', href: '/app/sales' },
          { label: 'Customers', href: '/app/sales/customers' },
          { label: customer.name },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <MessageSquare className="size-4" /> Message
            </Button>
            <Button variant="outline" size="sm">
              <Send className="size-4" /> Send statement
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="size-4" /> Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <Plus className="size-4" /> New
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <FileText className="size-4" /> New quote
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShoppingCart className="size-4" /> New order
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="size-4" /> New invoice
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="size-4" /> Record payment
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserPlus className="size-4" /> Add contact
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-sm">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Convert to prospect</DropdownMenuItem>
                <DropdownMenuItem>Merge customer</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive>Archive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="p-4">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <p
                className={`mt-1.5 text-2xl font-semibold tabular-nums ${
                  s.tone === 'warning' && s.value > 0 ? 'text-warning' : ''
                }`}
              >
                {s.format === 'currency' ? formatCurrency(s.value) : s.value.toLocaleString()}
              </p>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview">
          <TabsList variant="underline">
            <TabsTrigger value="overview" variant="underline">
              Overview
            </TabsTrigger>
            <TabsTrigger value="quotes" variant="underline">
              Quotes
              <Badge variant="soft" size="sm" className="ml-1">
                {customerQuotes.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="orders" variant="underline">
              Orders
              <Badge variant="soft" size="sm" className="ml-1">
                {customerOrders.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="invoices" variant="underline">
              Invoices
              <Badge variant="soft" size="sm" className="ml-1">
                {customerInvoices.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="payments" variant="underline">
              Payments
            </TabsTrigger>
            <TabsTrigger value="communications" variant="underline">
              Communications
            </TabsTrigger>
            <TabsTrigger value="activities" variant="underline">
              Activities
            </TabsTrigger>
            <TabsTrigger value="documents" variant="underline">
              Documents
              <Badge variant="soft" size="sm" className="ml-1">
                {documents.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Contact information</CardTitle>
                  <Button variant="ghost" size="sm">
                    <UserPlus className="size-4" /> Add contact
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="size-4 text-muted-foreground" />
                      <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                        {customer.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="size-4 text-muted-foreground" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="size-4 text-muted-foreground" />
                      <a href={`https://${customer.website}`} className="text-primary hover:underline">
                        {customer.website}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="size-4 text-muted-foreground" />
                      <span>{customer.industry}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Contacts
                    </p>
                    {contacts.map((c) => (
                      <div
                        key={c.email}
                        className="flex items-center justify-between rounded-md border border-border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar size="md">
                            <AvatarFallback name={c.name}>{initials(c.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{c.name}</span>
                              {c.primary && (
                                <Badge variant="soft" size="sm">
                                  Primary
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {c.role} · {c.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon-sm">
                            <Mail className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm">
                            <Phone className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Sales rep</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <Avatar size="xs">
                          <AvatarFallback name={customer.salesRep}>
                            {initials(customer.salesRep)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{customer.salesRep}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Payment terms</p>
                      <p className="mt-1 font-medium">{customer.paymentTerms}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Credit limit</p>
                      <p className="mt-1 font-mono font-medium">
                        {formatCurrency(customer.creditLimit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tax ID</p>
                      <p className="mt-1 font-mono text-xs">{customer.taxId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Addresses</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Plus className="size-4" /> Add address
                  </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {addresses.map((a) => (
                    <div key={a.type} className="rounded-md border border-border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{a.type}</span>
                          {a.primary && (
                            <Badge variant="soft" size="sm">
                              Default
                            </Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="icon-sm">
                          <Edit className="size-3" />
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>{a.street}</p>
                        <p>
                          {a.city}, {a.state} {a.postal}
                        </p>
                        <p>{a.country}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" /> AI insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="rounded-md border border-success/30 bg-success/5 p-3">
                    <p className="font-medium text-success">High-growth account</p>
                    <p className="mt-1 text-muted-foreground">
                      Revenue up 24% YoY. Consider proposing the Premium Support tier.
                    </p>
                  </div>
                  <div className="rounded-md border border-info/30 bg-info/5 p-3">
                    <p className="font-medium text-info">Renewal in 60 days</p>
                    <p className="mt-1 text-muted-foreground">
                      MSA expires Jul 14. Schedule a check-in this week.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quotes">
            <Card className="overflow-hidden">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Created</th>
                    <th>Valid until</th>
                    <th>Owner</th>
                    <th className="text-right">Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customerQuotes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        No quotes yet.
                      </td>
                    </tr>
                  ) : (
                    customerQuotes.map((q) => (
                      <tr key={q.id}>
                        <td>
                          <Link
                            href={`/app/sales/quotations/${q.id}`}
                            className="font-mono text-xs font-medium text-primary hover:underline"
                          >
                            {q.number}
                          </Link>
                        </td>
                        <td className="text-sm text-muted-foreground">{formatDate(q.issuedAt)}</td>
                        <td className="text-sm text-muted-foreground">{formatDate(q.validUntil)}</td>
                        <td>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Avatar size="xs">
                              <AvatarFallback name={q.owner}>{initials(q.owner)}</AvatarFallback>
                            </Avatar>
                            <span>{q.owner}</span>
                          </div>
                        </td>
                        <td className="text-right font-mono tabular-nums">
                          {formatCurrency(q.amount)}
                        </td>
                        <td>
                          <StatusBadge status={q.status} size="sm" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="overflow-hidden">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Ordered</th>
                    <th>Ship by</th>
                    <th>Items</th>
                    <th className="text-right">Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customerOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        No orders yet.
                      </td>
                    </tr>
                  ) : (
                    customerOrders.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <span className="font-mono text-xs font-medium text-primary">
                            {o.number}
                          </span>
                        </td>
                        <td className="text-sm text-muted-foreground">{formatDate(o.orderedAt)}</td>
                        <td className="text-sm text-muted-foreground">{formatDate(o.shipBy)}</td>
                        <td className="text-sm text-muted-foreground">{o.items}</td>
                        <td className="text-right font-mono tabular-nums">
                          {formatCurrency(o.amount)}
                        </td>
                        <td>
                          <StatusBadge status={o.status} size="sm" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card className="overflow-hidden">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Issued</th>
                    <th>Due</th>
                    <th>Reference</th>
                    <th className="text-right">Amount</th>
                    <th className="text-right">Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customerInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        No invoices yet.
                      </td>
                    </tr>
                  ) : (
                    customerInvoices.map((i) => (
                      <tr key={i.id}>
                        <td>
                          <Link
                            href={`/app/sales/invoices/${i.id}`}
                            className="font-mono text-xs font-medium text-primary hover:underline"
                          >
                            {i.number}
                          </Link>
                        </td>
                        <td className="text-sm text-muted-foreground">{formatDate(i.issuedAt)}</td>
                        <td className="text-sm text-muted-foreground">{formatDate(i.dueAt)}</td>
                        <td className="font-mono text-xs text-muted-foreground">{i.reference}</td>
                        <td className="text-right font-mono tabular-nums">
                          {formatCurrency(i.amount)}
                        </td>
                        <td className="text-right font-mono tabular-nums">
                          {i.paid >= i.amount ? (
                            <span className="text-muted-foreground">—</span>
                          ) : (
                            formatCurrency(i.amount - i.paid)
                          )}
                        </td>
                        <td>
                          <StatusBadge status={i.status} size="sm" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="overflow-hidden">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Receipt</th>
                    <th>Invoice</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="font-mono text-xs font-medium text-primary">{p.id}</td>
                      <td className="font-mono text-xs">{p.invoice}</td>
                      <td className="text-sm text-muted-foreground">{formatDate(p.date)}</td>
                      <td>
                        <Badge variant="outline" size="sm">
                          {p.method}
                        </Badge>
                      </td>
                      <td className="text-right font-mono tabular-nums text-success">
                        {formatCurrency(p.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </TabsContent>

          <TabsContent value="communications">
            <Card>
              <CardContent className="space-y-2 p-2">
                {communications.map((c, i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer items-start gap-3 rounded-md p-3 transition-colors hover:bg-muted/40"
                  >
                    <Avatar size="md">
                      <AvatarFallback name={c.from}>{initials(c.from)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{c.from}</p>
                        <div className="flex shrink-0 items-center gap-2">
                          {c.unread && <span className="size-1.5 rounded-full bg-primary" />}
                          <span className="text-xs text-muted-foreground">{c.time}</span>
                        </div>
                      </div>
                      <p className="truncate text-sm">{c.subject}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.preview}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="relative space-y-4 before:absolute before:left-3 before:top-0 before:h-full before:w-px before:bg-border">
                  {activities.map((a, i) => (
                    <div key={i} className="relative flex items-start gap-3">
                      <div className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                        <a.icon className="size-3" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">{a.text}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {a.by} · {formatRelativeTime(a.time)} · {formatDateTime(a.time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardContent className="space-y-2 p-2">
                {documents.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center gap-3 rounded-md border border-border p-3 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <FileText className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{d.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.type} · {d.size} · uploaded {formatDate(d.uploaded)}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon-sm">
                      <Download className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <ExternalLink className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Paperclip className="size-4" /> Upload document
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
