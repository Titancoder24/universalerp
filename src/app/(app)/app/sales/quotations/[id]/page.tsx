import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Copy,
  Download,
  Edit,
  Eye,
  FileText,
  History,
  MoreHorizontal,
  Printer,
  Send,
  Share2,
  ShoppingCart,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
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
import { customers, quotations } from '../../_data';
import { formatCurrency, formatDate, formatRelativeTime, initials } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

const previewItems = [
  { name: 'Enterprise License (annual)', sku: 'PROD-001', qty: 25, unit: 'license', price: 12000, discount: 10, tax: 8.25 },
  { name: 'Premium Support Tier', sku: 'PROD-003', qty: 1, unit: 'year', price: 4800, discount: 0, tax: 8.25 },
  { name: 'Professional Services - Implementation', sku: 'PROD-002', qty: 80, unit: 'hour', price: 250, discount: 0, tax: 0 },
  { name: 'Analytics Add-on Module', sku: 'PROD-004', qty: 25, unit: 'license', price: 3200, discount: 5, tax: 8.25 },
  { name: 'Training - On-site (2 days)', sku: 'PROD-005', qty: 2, unit: 'day', price: 1800, discount: 0, tax: 0 },
];

const timeline = [
  { type: 'created', icon: FileText, text: 'Quote created', time: '2026-05-14T09:15:00', by: 'Sarah Chen' },
  { type: 'sent', icon: Send, text: 'Quote sent to customer', time: '2026-05-14T10:30:00', by: 'Sarah Chen' },
  { type: 'viewed', icon: Eye, text: 'Customer viewed the quote', time: '2026-05-14T14:22:00', by: 'Daniel Wong' },
  { type: 'viewed', icon: Eye, text: 'Customer viewed the quote (2nd time)', time: '2026-05-15T08:45:00', by: 'Daniel Wong' },
];

export default async function QuoteDetailPage({ params }: PageProps) {
  const { id } = await params;
  const quote = quotations.find((q) => q.id === id) ?? quotations[0];
  const customer = customers.find((c) => c.id === quote.customerId) ?? customers[0];

  const subtotal = previewItems.reduce((acc, i) => acc + i.qty * i.price, 0);
  const discount = previewItems.reduce(
    (acc, i) => acc + i.qty * i.price * (i.discount / 100),
    0,
  );
  const afterDiscount = subtotal - discount;
  const tax = previewItems.reduce(
    (acc, i) => acc + (i.qty * i.price - i.qty * i.price * (i.discount / 100)) * (i.tax / 100),
    0,
  );
  const shipping = 450;
  const grandTotal = afterDiscount + tax + shipping;

  return (
    <div className="flex flex-col">
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <span className="font-mono">{quote.number}</span>
            <StatusBadge status={quote.status} />
            {quote.version > 1 && (
              <Badge variant="outline" size="sm">
                <History className="mr-1 size-3" /> v{quote.version}
              </Badge>
            )}
          </div>
        }
        description={`${customer.name} · ${formatCurrency(quote.amount)} · valid until ${formatDate(quote.validUntil)}`}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/sales/quotations">
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
        }
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Sales', href: '/app/sales' },
          { label: 'Quotations', href: '/app/sales/quotations' },
          { label: quote.number },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Eye className="size-4" /> Customer view
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="size-4" /> Share link
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Download
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
                  <Printer className="size-4" /> Print
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="size-4" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="size-4" /> New revision
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive>Cancel quote</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-[1fr_320px]">
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
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold uppercase tracking-tight text-slate-900">
                  Quotation
                </h2>
                <p className="mt-1 font-mono text-sm text-slate-600">
                  {quote.number} · v{quote.version}
                </p>
                <div className="mt-4 inline-block rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                  {quote.status.toUpperCase()}
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
                Attn: Daniel Wong, CFO
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
                {customer.phone}
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Quote number</span>
                <span className="font-mono font-medium">{quote.number}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Issued</span>
                <span className="font-medium">{formatDate(quote.issuedAt)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Valid until</span>
                <span className="font-medium">{formatDate(quote.validUntil)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Payment terms</span>
                <span className="font-medium">{customer.paymentTerms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quote owner</span>
                <span className="font-medium">{quote.owner}</span>
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
                  <th className="pb-3 text-right">Discount</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {previewItems.map((item, i) => {
                  const lineSubtotal = item.qty * item.price;
                  const lineDiscount = lineSubtotal * (item.discount / 100);
                  const lineTotal = lineSubtotal - lineDiscount;
                  return (
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
                      <td className="py-3 text-right font-mono tabular-nums text-slate-700">
                        {item.discount > 0 ? `${item.discount}%` : '—'}
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums font-medium">
                        {formatCurrency(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-6 flex justify-end">
              <div className="w-72 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-mono tabular-nums">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Discount</span>
                  <span className="font-mono tabular-nums">-{formatCurrency(discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax (8.25%)</span>
                  <span className="font-mono tabular-nums">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-mono tabular-nums">{formatCurrency(shipping)}</span>
                </div>
                <div className="flex items-baseline justify-between border-t-2 border-slate-300 pt-2">
                  <span className="text-base font-semibold">Grand total</span>
                  <span className="font-mono text-2xl font-bold tabular-nums">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 p-10">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
              Notes
            </h3>
            <p className="mb-6 text-sm text-slate-600">
              Pricing valid for 30 days from issue date. Volume discounts have been applied
              automatically. Installation is included with orders of 50+ licenses. All amounts in
              USD.
            </p>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
              Terms & conditions
            </h3>
            <p className="text-sm text-slate-600">
              This quotation is subject to our standard Master Services Agreement. Net 30 payment
              terms apply unless otherwise specified. Cancellation requires 14-day written notice.
              For questions, contact {quote.owner.toLowerCase().replace(/\s+/g, '.')}@universalerp.com.
            </p>

            {quote.status === 'accepted' && (
              <div className="mt-8 rounded-lg border-2 border-success/30 bg-success/5 p-6">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="size-5" />
                  <span className="font-semibold">Accepted & Signed</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Signed electronically by{' '}
                  <span className="font-medium text-slate-900">Daniel Wong</span> on{' '}
                  {formatDate(quote.validUntil)}.
                </p>
                <div className="mt-3 inline-block rounded-md border border-slate-300 bg-white px-4 py-2">
                  <p className="font-serif text-2xl italic text-slate-900">Daniel Wong</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start">
                <Send className="size-4" /> Send to customer
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Copy className="size-4" /> Duplicate quote
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ShoppingCart className="size-4" /> Convert to order
              </Button>
              <Button variant="success" className="w-full justify-start">
                <CheckCircle2 className="size-4" /> Mark as accepted
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Edit className="size-4" /> Create revision
              </Button>
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
                <XCircle className="size-4" /> Mark as rejected
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
                  <p className="text-xs text-muted-foreground">{customer.industry}</p>
                </div>
                <ArrowRight className="ml-auto size-4 text-muted-foreground" />
              </Link>
              <Separator className="my-3" />
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lifetime revenue</span>
                  <span className="font-mono tabular-nums">
                    {formatCurrency(customer.revenue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Outstanding</span>
                  <span className="font-mono tabular-nums">
                    {formatCurrency(customer.outstanding)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment terms</span>
                  <span>{customer.paymentTerms}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-3 before:absolute before:left-3 before:top-0 before:h-full before:w-px before:bg-border">
                {timeline.map((t, i) => (
                  <div key={i} className="relative flex items-start gap-3">
                    <div className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                      <t.icon className="size-3" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{t.text}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.by} · {formatRelativeTime(t.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/[0.03]">
            <CardContent className="space-y-2 pt-6">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <p className="text-sm font-medium text-primary">AI follow-up</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Customer viewed twice but hasn&apos;t responded. Suggested email and a 5%
                accelerator discount could improve close rate.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Draft follow-up email
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
