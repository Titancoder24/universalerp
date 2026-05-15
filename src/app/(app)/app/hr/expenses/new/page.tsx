'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  Image as ImageIcon,
  Loader2,
  Plus,
  Receipt,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/ui/page-header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/utils';

interface LineItem {
  id: string;
  date: string;
  category: string;
  merchant: string;
  description: string;
  amount: number;
  receipt: boolean;
  ocr?: boolean;
}

const categories = [
  'Travel · Flights',
  'Travel · Hotels',
  'Travel · Ground transport',
  'Meals · Client',
  'Meals · Team',
  'Software & subscriptions',
  'Equipment',
  'Training & conferences',
  'Office supplies',
  'Other',
];

export default function NewExpensePage() {
  const [items, setItems] = React.useState<LineItem[]>([
    { id: '1', date: '2026-05-12', category: 'Travel · Flights', merchant: 'United Airlines', description: 'SFO → BOS · re:Invent', amount: 642.18, receipt: true, ocr: true },
    { id: '2', date: '2026-05-13', category: 'Travel · Hotels', merchant: 'Boston Marriott', description: '3 nights, May 13–15', amount: 1280.00, receipt: true, ocr: true },
    { id: '3', date: '2026-05-13', category: 'Travel · Ground transport', merchant: 'Lyft', description: 'BOS Airport → Hotel', amount: 48.72, receipt: true },
    { id: '4', date: '2026-05-14', category: 'Meals · Team', merchant: 'Legal Sea Foods', description: 'Team dinner (4 people)', amount: 218.40, receipt: true },
    { id: '5', date: '2026-05-15', category: 'Travel · Ground transport', merchant: 'Lyft', description: 'Hotel → BOS Airport', amount: 52.14, receipt: false },
  ]);

  const total = items.reduce((s, i) => s + i.amount, 0);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        date: new Date().toISOString().slice(0, 10),
        category: 'Other',
        merchant: '',
        description: '',
        amount: 0,
        receipt: false,
      },
    ]);
  };
  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="New expense report"
        description="Group related expenses into a single approval bundle"
        breadcrumbs={[
          { label: 'People', href: '/app/hr' },
          { label: 'Expenses', href: '/app/hr/expenses' },
          { label: 'New report' },
        ]}
        back={
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/app/hr/expenses"><ChevronLeft className="size-4" /></Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline">Save draft</Button>
            <Button>Submit for approval</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Report details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" defaultValue="AWS re:Invent 2026 · Boston" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="purpose">Business purpose</Label>
                <Select defaultValue="conference">
                  <SelectTrigger id="purpose" className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conference">Conference attendance</SelectItem>
                    <SelectItem value="client">Client visit</SelectItem>
                    <SelectItem value="internal">Internal meeting</SelectItem>
                    <SelectItem value="recruiting">Recruiting</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="project">Project / cost center</Label>
                <Select defaultValue="eng-platform">
                  <SelectTrigger id="project" className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eng-platform">Engineering · Platform</SelectItem>
                    <SelectItem value="eng-ai">Engineering · AI Canvas</SelectItem>
                    <SelectItem value="sales-amer">Sales · AMER</SelectItem>
                    <SelectItem value="cs-emea">Customer Success · EMEA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes for approver (optional)</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  className="mt-1.5"
                  placeholder="Anything your approver should know..."
                  defaultValue="Attended re:Invent for the AI canvas roadmap session. Met with 3 enterprise prospects."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Line items</CardTitle>
                <CardDescription>{items.length} expenses · {formatCurrency(total)}</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="size-4" /> Add expense
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Merchant</th>
                    <th>Description</th>
                    <th className="text-right">Amount</th>
                    <th>Receipt</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td className="text-sm font-mono">{it.date}</td>
                      <td><Badge variant="outline" size="sm">{it.category}</Badge></td>
                      <td className="text-sm">{it.merchant || '—'}</td>
                      <td className="max-w-[240px] truncate text-sm text-muted-foreground">{it.description}</td>
                      <td className="text-right font-mono">{formatCurrency(it.amount)}</td>
                      <td>
                        {it.receipt ? (
                          <span className="inline-flex items-center gap-1 text-xs">
                            <ImageIcon className="size-3.5" />
                            {it.ocr && <Badge variant="soft" size="sm" className="gap-1">
                              <Sparkles className="size-2.5" /> OCR
                            </Badge>}
                          </span>
                        ) : (
                          <Badge variant="warning" size="sm">Missing</Badge>
                        )}
                      </td>
                      <td>
                        <Button variant="ghost" size="icon-sm" onClick={() => removeItem(it.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border bg-muted/30 font-semibold">
                    <td colSpan={4} className="px-3 py-2">Total</td>
                    <td className="text-right font-mono">{formatCurrency(total)}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="size-4 text-primary" /> AI OCR
                  <Badge variant="soft" size="sm">Beta</Badge>
                </CardTitle>
                <CardDescription>Drop receipts and we'll parse them into line items</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="size-4" /> Upload receipts
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border-2 border-dashed border-input bg-gradient-to-br from-primary/5 to-transparent p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Receipt className="size-6" />
                </div>
                <div className="mt-3 text-base font-medium">Drag & drop receipts here</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Auto-extract date, merchant, amount, category, and tax · supports PDF, JPG, PNG, HEIC
                </div>
                <Button className="mt-4">
                  <Plus className="size-4" /> Browse files
                </Button>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'united-flight.pdf', size: '142 KB', status: 'parsed' as const },
                  { name: 'marriott-bill.pdf', size: '418 KB', status: 'parsed' as const },
                  { name: 'lyft-receipt.png', size: '72 KB', status: 'parsing' as const },
                ].map((f) => (
                  <div key={f.name} className="flex items-center gap-2 rounded-lg border border-border/60 bg-background p-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                      <ImageIcon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{f.name}</div>
                      <div className="text-xs text-muted-foreground">{f.size}</div>
                    </div>
                    {f.status === 'parsed' ? (
                      <CheckCircle2 className="size-4 text-success" />
                    ) : (
                      <Loader2 className="size-4 animate-spin text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-lg border border-border bg-primary/5 p-4">
                <div className="text-xs text-muted-foreground">Total to reimburse</div>
                <div className="text-3xl font-semibold tabular-nums">{formatCurrency(total)}</div>
                <div className="text-xs text-muted-foreground">{items.length} line items · USD</div>
              </div>
              <div className="space-y-2 border-t border-border pt-3">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{formatCurrency(total * 0.92)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="font-mono">{formatCurrency(total * 0.08)}</span></div>
                <div className="flex justify-between border-t border-border pt-2 font-medium"><span>Total</span><span className="font-mono">{formatCurrency(total)}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-primary/40 bg-primary/5 p-3">
                <input type="radio" name="method" defaultChecked className="size-4 accent-primary" />
                <CreditCard className="size-4 text-primary" />
                <div className="flex-1">
                  <div className="font-medium">Direct deposit</div>
                  <div className="text-xs text-muted-foreground">Chase ••••2842 · 2-3 business days</div>
                </div>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3">
                <input type="radio" name="method" className="size-4 accent-primary" />
                <CreditCard className="size-4" />
                <div className="flex-1">
                  <div className="font-medium">Reimburse on payroll</div>
                  <div className="text-xs text-muted-foreground">Added to next paycheck</div>
                </div>
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Approver</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Aisha Khan · Engineering Director
              <div className="mt-1 flex items-center gap-1 text-xs">
                <Badge variant="soft" size="sm">Step 1 of 2</Badge>
                <span>then CFO for $1k+</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
