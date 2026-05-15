'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Check,
  ChevronLeft,
  ChevronsUpDown,
  GripVertical,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { customers } from '../../_data';
import { formatCurrency, initials } from '@/lib/utils';

interface LineItem {
  id: string;
  product: string;
  description: string;
  qty: number;
  unit: string;
  price: number;
  discount: number;
  tax: number;
}

const productCatalog = [
  { sku: 'PROD-001', name: 'Enterprise License (annual)', price: 12000, unit: 'license' },
  { sku: 'PROD-002', name: 'Professional Services - Implementation', price: 250, unit: 'hour' },
  { sku: 'PROD-003', name: 'Premium Support Tier', price: 4800, unit: 'year' },
  { sku: 'PROD-004', name: 'Analytics Add-on Module', price: 3200, unit: 'license' },
  { sku: 'PROD-005', name: 'Training - On-site (per day)', price: 1800, unit: 'day' },
  { sku: 'PROD-006', name: 'Custom Integration Development', price: 180, unit: 'hour' },
  { sku: 'PROD-007', name: 'Data Migration Service', price: 8500, unit: 'project' },
];

const defaultItems: LineItem[] = [
  {
    id: '1',
    product: 'PROD-001',
    description: 'Enterprise License (annual)',
    qty: 25,
    unit: 'license',
    price: 12000,
    discount: 10,
    tax: 8.25,
  },
  {
    id: '2',
    product: 'PROD-003',
    description: 'Premium Support Tier',
    qty: 1,
    unit: 'year',
    price: 4800,
    discount: 0,
    tax: 8.25,
  },
  {
    id: '3',
    product: 'PROD-002',
    description: 'Professional Services - Implementation',
    qty: 80,
    unit: 'hour',
    price: 250,
    discount: 0,
    tax: 0,
  },
];

function calculateLine(item: LineItem) {
  const subtotal = item.qty * item.price;
  const discount = subtotal * (item.discount / 100);
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * (item.tax / 100);
  return { subtotal, discount, tax, total: afterDiscount + tax };
}

export default function NewQuotePage() {
  const [items, setItems] = React.useState<LineItem[]>(defaultItems);
  const [customer, setCustomer] = React.useState(customers[0]);
  const [customerOpen, setCustomerOpen] = React.useState(false);
  const [customerSearch, setCustomerSearch] = React.useState('');
  const [issueDate, setIssueDate] = React.useState('2026-05-15');
  const [validUntil, setValidUntil] = React.useState('2026-06-15');
  const [shippingFee, setShippingFee] = React.useState(450);

  const totals = items.reduce(
    (acc, item) => {
      const c = calculateLine(item);
      acc.subtotal += c.subtotal;
      acc.discount += c.discount;
      acc.tax += c.tax;
      acc.total += c.total;
      return acc;
    },
    { subtotal: 0, discount: 0, tax: 0, total: 0 },
  );

  const grandTotal = totals.total + shippingFee;

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        product: '',
        description: '',
        qty: 1,
        unit: 'each',
        price: 0,
        discount: 0,
        tax: 8.25,
      },
    ]);
  };

  const addFromProduct = (sku: string) => {
    const p = productCatalog.find((p) => p.sku === sku);
    if (!p) return;
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        product: p.sku,
        description: p.name,
        qty: 1,
        unit: p.unit,
        price: p.price,
        discount: 0,
        tax: 8.25,
      },
    ]);
  };

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()),
  );

  return (
    <div className="flex flex-col">
      <PageHeader
        title="New Quotation"
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Sales', href: '/app/sales' },
          { label: 'Quotations', href: '/app/sales/quotations' },
          { label: 'New' },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/sales/quotations">
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              <Sparkles className="size-4" /> AI Draft
            </Button>
            <Button variant="outline" size="sm">
              Save as draft
            </Button>
            <Button variant="outline" size="sm">
              Preview
            </Button>
            <Button size="sm">
              <Send className="size-4" /> Save & send
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quote details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label required>Customer</Label>
                  <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm shadow-xs hover:bg-accent/30"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <Avatar size="xs">
                            <AvatarFallback name={customer.name}>
                              {initials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate font-medium">{customer.name}</span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {customer.code}
                          </span>
                        </div>
                        <ChevronsUpDown className="size-4 opacity-60" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[420px] p-0">
                      <div className="border-b border-border p-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                          <Input
                            value={customerSearch}
                            onChange={(e) => setCustomerSearch(e.target.value)}
                            placeholder="Search customers…"
                            className="h-8 pl-8"
                          />
                        </div>
                      </div>
                      <div className="max-h-72 overflow-y-auto p-1">
                        {filteredCustomers.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setCustomer(c);
                              setCustomerOpen(false);
                              setCustomerSearch('');
                            }}
                            className="flex w-full items-center justify-between gap-2 rounded-md p-2 text-left text-sm transition-colors hover:bg-accent"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <Avatar size="xs">
                                <AvatarFallback name={c.name}>{initials(c.name)}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="truncate font-medium">{c.name}</p>
                                <p className="font-mono text-xs text-muted-foreground">{c.code}</p>
                              </div>
                            </div>
                            {customer.id === c.id && (
                              <Check className="size-4 shrink-0 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1.5">
                  <Label>Quote number</Label>
                  <Input value="Q-1099" readOnly className="font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label required>Issue date</Label>
                  <Input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label required>Valid until</Label>
                  <Input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Payment terms</Label>
                  <Select defaultValue={customer.paymentTerms}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 45">Net 45</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                      <SelectItem value="Due on receipt">Due on receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Line items</CardTitle>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="size-4" /> From catalog
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-[380px] p-0">
                    <div className="border-b border-border p-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                        <Input placeholder="Search products…" className="h-8 pl-8" />
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto p-1">
                      {productCatalog.map((p) => (
                        <button
                          key={p.sku}
                          onClick={() => addFromProduct(p.sku)}
                          className="flex w-full items-center justify-between gap-2 rounded-md p-2 text-left text-sm transition-colors hover:bg-accent"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium">{p.name}</p>
                            <p className="font-mono text-xs text-muted-foreground">{p.sku}</p>
                          </div>
                          <span className="shrink-0 font-mono text-xs">
                            {formatCurrency(p.price)} / {p.unit}
                          </span>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button variant="outline" size="sm" onClick={addItem}>
                  <Plus className="size-4" /> Blank row
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/20">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground w-8" />
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Item / Description
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground w-20">
                        Qty
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground w-24">
                        Unit
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground w-28">
                        Price
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground w-20">
                        Disc %
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground w-20">
                        Tax %
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground w-28">
                        Total
                      </th>
                      <th className="px-3 py-2 w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => {
                      const calc = calculateLine(item);
                      return (
                        <tr key={item.id} className="border-b border-border/60">
                          <td className="px-3 py-2">
                            <button className="cursor-grab text-muted-foreground/60 hover:text-muted-foreground">
                              <GripVertical className="size-4" />
                            </button>
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={item.description}
                              onChange={(e) =>
                                updateItem(item.id, { description: e.target.value })
                              }
                              placeholder="Search items or type to add…"
                              className="h-8 border-transparent bg-transparent hover:border-input"
                            />
                            {item.product && (
                              <p className="ml-3 mt-0.5 font-mono text-2xs text-muted-foreground">
                                {item.product}
                              </p>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              value={item.qty}
                              onChange={(e) =>
                                updateItem(item.id, { qty: Number(e.target.value) || 0 })
                              }
                              className="h-8 text-right tabular-nums"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={item.unit}
                              onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                              className="h-8"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) =>
                                updateItem(item.id, { price: Number(e.target.value) || 0 })
                              }
                              className="h-8 text-right tabular-nums"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              value={item.discount}
                              onChange={(e) =>
                                updateItem(item.id, { discount: Number(e.target.value) || 0 })
                              }
                              className="h-8 text-right tabular-nums"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              step="0.01"
                              value={item.tax}
                              onChange={(e) =>
                                updateItem(item.id, { tax: Number(e.target.value) || 0 })
                              }
                              className="h-8 text-right tabular-nums"
                            />
                          </td>
                          <td className="px-3 py-2 text-right font-mono tabular-nums">
                            {formatCurrency(calc.total)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-4">
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={addItem}>
                  <Plus className="size-4" /> Add line item
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Internal notes or notes for the customer…"
                  defaultValue="Pricing valid for 30 days. Volume discounts applied automatically. Installation included with 50+ licenses."
                  minRows={4}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Terms & conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Payment terms, delivery details, cancellation policy…"
                  defaultValue="Net 30 payment terms. All work subject to standard MSA. Cancellation requires 14-day written notice."
                  minRows={4}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono tabular-nums">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-mono tabular-nums text-warning">
                    -{formatCurrency(totals.discount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-mono tabular-nums">{formatCurrency(totals.tax)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <Input
                    type="number"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(Number(e.target.value) || 0)}
                    className="h-7 w-24 text-right tabular-nums"
                  />
                </div>
              </div>
              <Separator />
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">Grand total</span>
                <span className="font-mono text-2xl font-semibold tabular-nums">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
              <div className="rounded-md border border-info/30 bg-info/5 p-3 text-xs">
                <p className="font-medium text-info">Margin estimate</p>
                <p className="mt-1 text-muted-foreground">
                  <span className="font-medium text-foreground">42.8%</span> · projected based on
                  product COGS. Hover items for line-level margin.
                </p>
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Quote owner
                </p>
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback name="Sarah Chen">SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Sarah Chen</p>
                    <p className="text-xs text-muted-foreground">Senior AE</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/[0.03]">
            <CardContent className="space-y-2 pt-6">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <p className="text-sm font-medium text-primary">AI suggestions</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Based on this customer&apos;s history, consider bundling{' '}
                <span className="font-medium text-foreground">Premium Support</span> for a 12%
                higher close rate.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Apply suggestion
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
