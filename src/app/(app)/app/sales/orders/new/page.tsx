'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Plus, Save, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';

interface OrderLine {
  id: string;
  item: string;
  description: string;
  qty: number;
  unit: string;
  price: number;
  discount: number;
  taxRate: number;
}

export default function NewSalesOrderPage() {
  const [lines, setLines] = React.useState<OrderLine[]>([
    { id: '1', item: '', description: '', qty: 1, unit: 'each', price: 0, discount: 0, taxRate: 8.875 },
  ]);

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      { id: String(Date.now()), item: '', description: '', qty: 1, unit: 'each', price: 0, discount: 0, taxRate: 8.875 },
    ]);
  };

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLine = (id: string, updates: Partial<OrderLine>) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const subtotal = lines.reduce((s, l) => s + l.qty * l.price * (1 - l.discount / 100), 0);
  const tax = lines.reduce((s, l) => s + l.qty * l.price * (1 - l.discount / 100) * (l.taxRate / 100), 0);
  const shipping = 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="space-y-6 p-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/app/sales/orders"><ArrowLeft className="size-4" /> Back to orders</Link>
      </Button>

      <PageHeader
        title="New Sales Order"
        description="Create a customer order. We'll auto-reserve inventory and trigger fulfillment."
        actions={
          <>
            <Button variant="outline">Save as draft</Button>
            <Button><Save className="size-4" /> Confirm order</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Customer & dates</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Customer</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select customer…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Acme Industries Inc.</SelectItem>
                    <SelectItem value="2">TechCorp Solutions</SelectItem>
                    <SelectItem value="3">Global Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Contact</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select contact…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Sarah Mitchell</SelectItem>
                    <SelectItem value="2">John Buyer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Order date</Label>
                <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="space-y-1.5">
                <Label>Expected delivery</Label>
                <Input type="date" />
              </div>
              <div className="space-y-1.5">
                <Label>Payment terms</Label>
                <Select defaultValue="net30">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="due">Due on receipt</SelectItem>
                    <SelectItem value="net15">Net 15</SelectItem>
                    <SelectItem value="net30">Net 30</SelectItem>
                    <SelectItem value="net45">Net 45</SelectItem>
                    <SelectItem value="net60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Currency</Label>
                <Select defaultValue="USD">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Line items</CardTitle>
                <Button variant="outline" size="sm" onClick={addLine}>
                  <Plus className="size-3.5" /> Add line
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto -mx-6 px-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-1 text-xs uppercase tracking-wider text-muted-foreground">Item</th>
                      <th className="text-left py-2 px-1 text-xs uppercase tracking-wider text-muted-foreground">Description</th>
                      <th className="text-right py-2 px-1 text-xs uppercase tracking-wider text-muted-foreground">Qty</th>
                      <th className="text-right py-2 px-1 text-xs uppercase tracking-wider text-muted-foreground">Price</th>
                      <th className="text-right py-2 px-1 text-xs uppercase tracking-wider text-muted-foreground">Disc%</th>
                      <th className="text-right py-2 px-1 text-xs uppercase tracking-wider text-muted-foreground">Tax%</th>
                      <th className="text-right py-2 px-1 text-xs uppercase tracking-wider text-muted-foreground">Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line) => {
                      const lineTotal = line.qty * line.price * (1 - line.discount / 100) * (1 + line.taxRate / 100);
                      return (
                        <tr key={line.id} className="border-b border-border/60">
                          <td className="py-2 px-1">
                            <Input
                              className="h-8 font-mono text-xs w-24"
                              placeholder="SKU"
                              value={line.item}
                              onChange={(e) => updateLine(line.id, { item: e.target.value })}
                            />
                          </td>
                          <td className="py-2 px-1">
                            <Input
                              className="h-8 text-xs"
                              placeholder="Description"
                              value={line.description}
                              onChange={(e) => updateLine(line.id, { description: e.target.value })}
                            />
                          </td>
                          <td className="py-2 px-1">
                            <Input
                              type="number"
                              className="h-8 text-xs text-right w-16"
                              value={line.qty}
                              onChange={(e) => updateLine(line.id, { qty: parseFloat(e.target.value) || 0 })}
                            />
                          </td>
                          <td className="py-2 px-1">
                            <Input
                              type="number"
                              className="h-8 text-xs text-right w-24"
                              value={line.price}
                              onChange={(e) => updateLine(line.id, { price: parseFloat(e.target.value) || 0 })}
                            />
                          </td>
                          <td className="py-2 px-1">
                            <Input
                              type="number"
                              className="h-8 text-xs text-right w-16"
                              value={line.discount}
                              onChange={(e) => updateLine(line.id, { discount: parseFloat(e.target.value) || 0 })}
                            />
                          </td>
                          <td className="py-2 px-1">
                            <Input
                              type="number"
                              className="h-8 text-xs text-right w-16"
                              value={line.taxRate}
                              onChange={(e) => updateLine(line.id, { taxRate: parseFloat(e.target.value) || 0 })}
                            />
                          </td>
                          <td className="py-2 px-1 text-right font-mono font-semibold">
                            {formatCurrency(lineTotal)}
                          </td>
                          <td>
                            <Button variant="ghost" size="icon-xs" onClick={() => removeLine(line.id)}>
                              <Trash2 className="size-3 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Notes & terms</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Customer-facing notes</Label>
                <Textarea rows={3} placeholder="Thank you for your business. Estimated delivery is 7-10 business days." />
              </div>
              <div className="space-y-1.5">
                <Label>Internal notes (not visible to customer)</Label>
                <Textarea rows={2} placeholder="Priority customer — expedite shipping." />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-mono">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-mono">{formatCurrency(shipping)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-mono text-lg font-bold">{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
