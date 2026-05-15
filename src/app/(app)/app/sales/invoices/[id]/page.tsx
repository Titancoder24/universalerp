import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  Download,
  Edit,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Printer,
  Send,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { customers, invoices } from '../../_data';
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

const invoiceItems = [
  { name: 'Enterprise License (annual)', sku: 'PROD-001', qty: 25, unit: 'license', price: 12000, total: 270000 },
  { name: 'Premium Support Tier', sku: 'PROD-003', qty: 1, unit: 'year', price: 4800, total: 4800 },
  { name: 'Professional Services - Implementation', sku: 'PROD-002', qty: 80, unit: 'hour', price: 250, total: 20000 },
  { name: 'Analytics Add-on Module', sku: 'PROD-004', qty: 25, unit: 'license', price: 3200, total: 76000 },
];

const paymentsReceived = [
  { id: 'PAY-1042', amount: 12000, method: 'ACH', date: '2026-05-12T10:30:00', reference: 'TXN-8829141' },
  { id: 'PAY-1037', amount: 8400, method: 'Wire', date: '2026-04-28T14:15:00', reference: 'WIRE-44291' },
];

const activity = [
  { type: 'sent', icon: Send, text: 'Invoice sent to customer', time: '2026-05-12T14:30:00', by: 'Sarah Chen' },
  { type: 'viewed', icon: FileText, text: 'Customer viewed the invoice', time: '2026-05-12T16:42:00', by: 'Daniel Wong' },
  { type: 'payment', icon: CreditCard, text: 'Partial payment received ($12,000 ACH)', time: '2026-05-12T10:30:00', by: 'System' },
  { type: 'reminder', icon: Bell, text: 'Reminder email sent', time: '2026-05-10T09:00:00', by: 'System' },
  { type: 'created', icon: FileText, text: 'Invoice created from SO-3401', time: '2026-05-08T11:00:00', by: 'Sarah Chen' },
];

const comments = [
  { author: 'Sarah Chen', text: 'Daniel confirmed payment will come through by end of week.', time: '2026-05-14T13:20:00' },
  { author: 'Marcus Reid', text: 'Reminder sent. Will follow up tomorrow.', time: '2026-05-13T17:45:00' },
];

export default async function InvoiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const invoice = invoices.find((i) => i.id === id) ?? invoices[0];
  const customer = customers.find((c) => c.id === invoice.customerId) ?? customers[0];

  const subtotal = invoiceItems.reduce((acc, i) => acc + i.total, 0);
  const tax = subtotal * 0.0825;
  const grandTotal = subtotal + tax;
  const balance = grandTotal - invoice.paid;
  const paidPct = grandTotal > 0 ? (invoice.paid / grandTotal) * 100 : 0;

  return (
    <div className="flex flex-col">
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <span className="font-mono">{invoice.number}</span>
            <StatusBadge status={invoice.status} />
          </div>
        }
        description={`${customer.name} · ${formatCurrency(grandTotal)} · due ${formatDate(invoice.dueAt)}`}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/sales/invoices">
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
        }
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Sales', href: '/app/sales' },
          { label: 'Invoices', href: '/app/sales/invoices' },
          { label: invoice.number },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Printer className="size-4" /> Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="size-4" /> Share
            </Button>
            <Button size="sm">
              <Send className="size-4" /> Send
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-sm">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Bell className="size-4" /> Send reminder
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CheckCircle2 className="size-4" /> Mark as paid
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="size-4" /> Edit invoice
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Create credit note</DropdownMenuItem>
                <DropdownMenuItem destructive>Void invoice</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-[1fr_340px]">
        <Card className="overflow-hidden bg-white text-slate-900 shadow-md dark:bg-slate-50">
          <div className="border-b-4 border-primary p-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <FileText className="size-5" />
                  </div>
                  <span className="text-xl font-bold">Universal ERP</span>
                </div>
                <p className="mt-3 text-xs text-slate-600">
                  450 Market Street, Suite 1200
                  <br />
                  San Francisco, CA 94105
                  <br />
                  hello@universalerp.com · +1 (415) 555-0100
                  <br />
                  Tax ID: 94-1234567
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold uppercase tracking-tight text-slate-900">
                  Invoice
                </h2>
                <p className="mt-1 font-mono text-sm text-slate-600">{invoice.number}</p>
                <div
                  className={`mt-4 inline-block rounded-md px-3 py-1.5 text-sm font-medium ${
                    invoice.status === 'paid'
                      ? 'bg-success/10 text-success'
                      : invoice.status === 'overdue'
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-primary/10 text-primary'
                  }`}
                >
                  {invoice.status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 border-b border-slate-200 p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Bill to
              </p>
              <p className="mt-2 text-base font-semibold">{customer.name}</p>
              <p className="text-sm text-slate-600">
                Attn: Accounts Payable
                <br />
                450 Market Street, Suite 1200
                <br />
                San Francisco, CA 94105
                <br />
                United States
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {customer.email}
                <br />
                Tax ID: {customer.taxId}
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Invoice #</span>
                <span className="font-mono font-medium">{invoice.number}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Issued</span>
                <span className="font-medium">{formatDate(invoice.issuedAt)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Due date</span>
                <span className="font-medium">{formatDate(invoice.dueAt)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Reference</span>
                <span className="font-mono font-medium">{invoice.reference}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Payment terms</span>
                <span className="font-medium">{customer.paymentTerms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Currency</span>
                <span className="font-medium">USD</span>
              </div>
            </div>
          </div>

          <div className="p-10">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-300 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <th className="pb-3">Description</th>
                  <th className="pb-3 text-right">Qty</th>
                  <th className="pb-3 text-right">Unit price</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((item, i) => (
                  <tr key={i} className="border-b border-slate-200">
                    <td className="py-3">
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="font-mono text-xs text-slate-500">
                        {item.sku} · per {item.unit}
                      </p>
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums text-slate-700">
                      {item.qty}
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums text-slate-700">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums font-medium">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 flex justify-end">
              <div className="w-72 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-mono tabular-nums">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax (8.25%)</span>
                  <span className="font-mono tabular-nums">{formatCurrency(tax)}</span>
                </div>
                <div className="flex items-baseline justify-between border-t-2 border-slate-300 pt-2">
                  <span className="text-base font-semibold">Total due</span>
                  <span className="font-mono text-2xl font-bold tabular-nums">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
                {invoice.paid > 0 && (
                  <>
                    <div className="flex justify-between pt-1 text-success">
                      <span>Paid to date</span>
                      <span className="font-mono tabular-nums">
                        -{formatCurrency(invoice.paid)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between border-t border-slate-300 pt-2">
                      <span className="text-base font-semibold">Balance due</span>
                      <span className="font-mono text-xl font-bold tabular-nums">
                        {formatCurrency(balance)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 p-10">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
              Payment instructions
            </h3>
            <p className="text-sm text-slate-600">
              Please remit payment by the due date via ACH or wire to the account below. Reference
              invoice number {invoice.number} with all payments. For questions, contact
              billing@universalerp.com.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 rounded-md border border-slate-200 bg-white p-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Bank details
                </p>
                <p className="mt-1 font-mono text-xs text-slate-700">
                  Bank: First National Bank
                  <br />
                  Routing: 121000358
                  <br />
                  Account: 4458 9921 0034
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Online payment
                </p>
                <p className="mt-1 text-xs text-slate-700">
                  Pay online via the secure link:
                  <br />
                  <span className="font-mono text-primary">pay.universalerp.com/{invoice.number}</span>
                </p>
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-slate-500">
              Thank you for your business. We appreciate the partnership.
            </p>
          </div>
        </Card>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="font-mono font-medium tabular-nums">
                    {formatCurrency(invoice.paid)} / {formatCurrency(grandTotal)}
                  </span>
                </div>
                <Progress
                  value={paidPct}
                  indicatorClassName={
                    invoice.status === 'overdue' ? 'bg-destructive' : 'bg-success'
                  }
                />
                <p className="text-xs text-muted-foreground">{paidPct.toFixed(1)}% paid</p>
              </div>
              <Separator />
              <Button className="w-full">
                <CreditCard className="size-4" /> Record payment
              </Button>
              <Button variant="outline" className="w-full">
                <Bell className="size-4" /> Send reminder
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/app/sales/customers/${customer.id}`}
                className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/40"
              >
                <Avatar size="lg">
                  <AvatarFallback name={customer.name}>{initials(customer.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">{customer.email}</p>
                </div>
                <ArrowRight className="ml-auto size-4 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>

          {paymentsReceived.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payments received</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {paymentsReceived.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-md border border-border p-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-xs font-medium">{p.id}</p>
                        <Badge variant="outline" size="sm">
                          {p.method}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDateTime(p.date)}
                      </p>
                    </div>
                    <p className="font-mono text-sm font-medium tabular-nums text-success">
                      {formatCurrency(p.amount)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-3 before:absolute before:left-3 before:top-0 before:h-full before:w-px before:bg-border">
                {activity.map((a, i) => (
                  <div key={i} className="relative flex items-start gap-3">
                    <div className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                      <a.icon className="size-3" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{a.text}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.by} · {formatRelativeTime(a.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {comments.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Avatar size="sm">
                    <AvatarFallback name={c.author}>{initials(c.author)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium">{c.author}</p>
                      <p className="text-2xs text-muted-foreground">
                        {formatRelativeTime(c.time)}
                      </p>
                    </div>
                    <p className="mt-0.5 text-sm">{c.text}</p>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <Textarea placeholder="Add a comment for internal notes…" minRows={2} />
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="icon-sm">
                    <Paperclip className="size-4" />
                  </Button>
                  <Button size="sm">
                    <MessageSquare className="size-4" /> Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
