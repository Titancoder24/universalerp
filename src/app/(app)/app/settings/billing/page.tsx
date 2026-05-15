import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Download,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatDate } from '@/lib/utils';

const invoiceHistory = [
  { id: 'INV-AC-2089', date: '2026-05-01', amount: 399, status: 'paid' },
  { id: 'INV-AC-2076', date: '2026-04-01', amount: 399, status: 'paid' },
  { id: 'INV-AC-2065', date: '2026-03-01', amount: 399, status: 'paid' },
  { id: 'INV-AC-2052', date: '2026-02-01', amount: 399, status: 'paid' },
];

export default function BillingPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Billing & Plan" description="Manage your subscription, payment methods, and invoices." />

      {/* Current plan */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
                <Sparkles className="size-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl font-semibold">Pro Plan</h2>
                  <Badge variant="success">Active</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  All 100+ modules · Up to 50 users · 100 GB storage · Renews June 1, 2026
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-3xl font-semibold">$399</div>
              <div className="text-xs text-muted-foreground">/month</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button>Upgrade to Enterprise</Button>
            <Button variant="outline">Change billing cycle</Button>
            <Button variant="ghost" className="text-destructive">Cancel subscription</Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Users</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-semibold">28</span>
              <span className="text-sm text-muted-foreground">of 50</span>
            </div>
            <Progress value={56} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Storage</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-semibold">12.4 GB</span>
              <span className="text-sm text-muted-foreground">of 100 GB</span>
            </div>
            <Progress value={12.4} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">AI Budget</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-semibold">$24.50</span>
              <span className="text-sm text-muted-foreground">of $100</span>
            </div>
            <Progress value={24.5} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Payment method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment method</CardTitle>
          <CardDescription>Charged on the 1st of each month.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-14 place-items-center rounded-lg bg-gradient-to-br from-primary to-info text-primary-foreground font-mono text-xs font-bold">
                VISA
              </div>
              <div>
                <div className="font-medium">•••• •••• •••• 4242</div>
                <div className="text-xs text-muted-foreground">Expires 12/2028 · Jane Doe</div>
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice history */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice history</CardTitle>
          <CardDescription>Your recent payments and downloadable receipts.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
                <th>Status</th>
                <th className="text-right"></th>
              </tr>
            </thead>
            <tbody>
              {invoiceHistory.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-mono text-xs font-medium text-primary">{inv.id}</td>
                  <td className="text-sm">{formatDate(inv.date)}</td>
                  <td className="text-right font-mono">{formatCurrency(inv.amount)}</td>
                  <td>
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="size-3" /> Paid
                    </Badge>
                  </td>
                  <td className="text-right">
                    <Button variant="ghost" size="xs"><Download className="size-3" /> PDF</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
