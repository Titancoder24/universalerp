'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Edit,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Package,
  Printer,
  Receipt,
  Truck,
  User,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatDate, formatRelativeTime, initials, colorFromString } from '@/lib/utils';

const order = {
  id: 'SO-2143',
  customer: {
    name: 'Acme Industries Inc.',
    code: 'CUST-001',
    email: 'orders@acme.com',
    contact: 'Sarah Mitchell',
  },
  status: 'shipped',
  orderDate: '2026-05-08',
  deliveryDate: '2026-05-18',
  shippedDate: '2026-05-14',
  totalAmount: 24500,
  paidAmount: 0,
  shipping: {
    address: '1500 Industrial Blvd, Suite 100, San Francisco, CA 94105',
    carrier: 'FedEx Priority Overnight',
    tracking: 'FDX-128937472',
    eta: '2026-05-18 10:30',
  },
  lines: [
    { id: 1, item: 'WGT-A-500', description: '500x Widget Bundle - Premium grade', qty: 500, unit: 'each', price: 35, total: 17500, delivered: 500 },
    { id: 2, item: 'BLT-M8-100', description: 'M8x40 Industrial Bolts (100 pack)', qty: 12, unit: 'pack', price: 250, total: 3000, delivered: 12 },
    { id: 3, item: 'PLT-A36-PCB', description: 'A36 Steel Plates - Custom cut', qty: 8, unit: 'sheet', price: 500, total: 4000, delivered: 8 },
  ],
  activity: [
    { id: 1, type: 'created', title: 'Order created', user: 'Sarah Chen', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
    { id: 2, type: 'confirmed', title: 'Order confirmed', user: 'System', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 5) },
    { id: 3, type: 'production', title: 'Production started (MO-1245)', user: 'Jake Thompson', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) },
    { id: 4, type: 'production', title: 'Production completed', user: 'Jake Thompson', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
    { id: 5, type: 'shipped', title: 'Shipped via FedEx', user: 'Marcus Rodriguez', at: new Date(Date.now() - 1000 * 60 * 60 * 12) },
  ],
};

const stages = ['Confirmed', 'In Production', 'Packed', 'Shipped', 'Delivered', 'Invoiced'];

export default function OrderDetailPage() {
  const currentStage = 4; // Shipped

  return (
    <div className="space-y-6 p-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2">
          <Link href="/app/sales/orders"><ArrowLeft className="size-4" /> Back to orders</Link>
        </Button>
        <PageHeader
          title={
            <div className="flex items-center gap-3">
              <span>{order.id}</span>
              <StatusBadge status={order.status} />
            </div>
          }
          description={`${order.customer.name} · Ordered ${formatDate(order.orderDate)}`}
          actions={
            <>
              <Button variant="outline" size="sm"><Edit className="size-4" /> Edit</Button>
              <Button variant="outline" size="sm"><Printer className="size-4" /> Print</Button>
              <Button variant="outline" size="sm"><Download className="size-4" /> PDF</Button>
              <Button size="sm"><Receipt className="size-4" /> Invoice</Button>
            </>
          }
        />
      </div>

      {/* Progress pipeline */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            {stages.map((stage, i) => {
              const reached = i <= currentStage;
              return (
                <React.Fragment key={stage}>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className={`grid h-10 w-10 place-items-center rounded-full ${
                        reached ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {reached ? <CheckCircle2 className="size-5" /> : <Clock className="size-4" />}
                    </div>
                    <span className={`text-xs ${reached ? 'font-semibold' : 'text-muted-foreground'}`}>{stage}</span>
                  </div>
                  {i < stages.length - 1 && (
                    <div className={`h-px flex-1 ${i < currentStage ? 'bg-success' : 'bg-border'}`} style={{ marginTop: '-22px' }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <Progress value={((currentStage + 1) / stages.length) * 100} className="mt-4" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="line-items">Line Items</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <div className="text-xs text-muted-foreground">Order Number</div>
                    <div className="font-mono text-sm font-medium">{order.id}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Customer</div>
                    <div className="text-sm font-medium">{order.customer.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Order Date</div>
                    <div className="text-sm">{formatDate(order.orderDate)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Expected Delivery</div>
                    <div className="text-sm">{formatDate(order.deliveryDate)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Contact</div>
                    <div className="text-sm">{order.customer.contact}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Total Amount</div>
                    <div className="font-mono text-base font-semibold">{formatCurrency(order.totalAmount)}</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="line-items">
              <Card>
                <CardContent className="p-0">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Description</th>
                        <th className="text-right">Qty</th>
                        <th className="text-right">Delivered</th>
                        <th className="text-right">Unit Price</th>
                        <th className="text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.lines.map((line) => (
                        <tr key={line.id}>
                          <td className="font-mono text-xs">{line.item}</td>
                          <td>{line.description}</td>
                          <td className="text-right">{line.qty} {line.unit}</td>
                          <td className="text-right">
                            <Badge variant={line.delivered === line.qty ? 'success' : 'warning'}>
                              {line.delivered} / {line.qty}
                            </Badge>
                          </td>
                          <td className="text-right font-mono">{formatCurrency(line.price)}</td>
                          <td className="text-right font-mono font-semibold">{formatCurrency(line.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={5} className="text-right font-semibold pt-3">Subtotal</td>
                        <td className="text-right font-mono font-semibold pt-3">{formatCurrency(24500)}</td>
                      </tr>
                      <tr>
                        <td colSpan={5} className="text-right text-muted-foreground">Tax (8.875%)</td>
                        <td className="text-right font-mono">{formatCurrency(2174)}</td>
                      </tr>
                      <tr>
                        <td colSpan={5} className="text-right text-muted-foreground">Shipping</td>
                        <td className="text-right font-mono">{formatCurrency(125)}</td>
                      </tr>
                      <tr className="border-t-2 border-border">
                        <td colSpan={5} className="text-right font-bold pt-2">Grand Total</td>
                        <td className="text-right font-mono text-lg font-bold pt-2">{formatCurrency(26799)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {order.activity.map((a, i) => (
                      <div key={a.id} className="flex gap-3">
                        <div className="relative flex flex-col items-center">
                          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary ring-4 ring-background">
                            <CheckCircle2 className="size-4" />
                          </div>
                          {i < order.activity.length - 1 && (
                            <div className="absolute top-8 h-full w-px bg-border" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{a.title}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {a.user} · {formatRelativeTime(a.at)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices"><Card><CardContent className="p-8 text-center text-muted-foreground">No invoices yet for this order.</CardContent></Card></TabsContent>
            <TabsContent value="documents"><Card><CardContent className="p-8 text-center text-muted-foreground">No documents attached.</CardContent></Card></TabsContent>
          </Tabs>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <Avatar size="md">
                  <AvatarFallback style={{ backgroundColor: colorFromString(order.customer.name) }} className="text-white">
                    {initials(order.customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{order.customer.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{order.customer.code}</div>
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="size-3.5" /> {order.customer.contact}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-3.5" /> {order.customer.email}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{order.shipping.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="size-3.5 text-muted-foreground shrink-0" />
                <span>{order.shipping.carrier}</span>
              </div>
              <div className="rounded-md bg-muted/40 p-2">
                <div className="text-2xs text-muted-foreground">Tracking</div>
                <div className="font-mono text-xs font-medium">{order.shipping.tracking}</div>
                <div className="mt-1 text-2xs text-muted-foreground">ETA: {order.shipping.eta}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { icon: Receipt, label: 'Create invoice' },
                { icon: Truck, label: 'Update shipment' },
                { icon: MessageSquare, label: 'Send update' },
                { icon: FileText, label: 'View source quote' },
              ].map((a) => (
                <button
                  key={a.label}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-muted/40 transition-colors"
                >
                  <a.icon className="size-4 text-primary" />
                  {a.label}
                  <ChevronRight className="ml-auto size-3 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
