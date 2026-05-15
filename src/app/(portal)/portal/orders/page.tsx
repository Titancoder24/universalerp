'use client';

import * as React from 'react';
import { Download, MapPin, Package, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatCurrency, formatDate } from '@/lib/utils';

const orders = [
  { id: 'SO-2143', name: '500x Widget Bundle', date: '2026-05-08', eta: '2026-05-18', amount: 24500, status: 'shipped' as const, tracking: 'FDX-128937472', progress: 75 },
  { id: 'SO-2148', name: 'Custom assembly Q2 batch', date: '2026-05-05', eta: '2026-05-25', amount: 67200, status: 'in_production' as const, progress: 45 },
  { id: 'SO-2151', name: 'Software License renewal', date: '2026-05-12', eta: '2026-05-15', amount: 12000, status: 'invoiced' as const, progress: 100 },
  { id: 'SO-2132', name: 'Spare parts inventory', date: '2026-04-22', eta: '2026-05-02', amount: 8900, status: 'delivered' as const, progress: 100 },
];

const stages = ['Confirmed', 'In Production', 'Packed', 'Shipped', 'Delivered'];

export default function PortalOrdersPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Orders</h1>
        <p className="text-muted-foreground">Track your orders from confirmation to delivery</p>
      </div>

      <div className="space-y-3">
        {orders.map((o) => (
          <Card key={o.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-primary">{o.id}</span>
                    <StatusBadge status={o.status} />
                  </div>
                  <h3 className="mt-1 text-lg font-semibold">{o.name}</h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Ordered: {formatDate(o.date)}</span>
                    <span>·</span>
                    <span>ETA: {formatDate(o.eta)}</span>
                    {o.tracking && (
                      <>
                        <span>·</span>
                        <span className="font-mono">{o.tracking}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xl font-semibold">{formatCurrency(o.amount)}</div>
                  <div className="mt-2 flex gap-1">
                    <Button variant="outline" size="sm">
                      <Download className="size-3" /> PDF
                    </Button>
                    {o.tracking && (
                      <Button size="sm">
                        <MapPin className="size-3" /> Track
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress stages */}
              <div className="flex items-center gap-1">
                {stages.map((stage, i) => {
                  const reached = (o.progress / 100) * stages.length >= i;
                  return (
                    <React.Fragment key={stage}>
                      <div className="flex flex-col items-center gap-1 min-w-[80px]">
                        <div
                          className={`grid h-7 w-7 place-items-center rounded-full ${
                            reached ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {reached ? <Package className="size-3.5" /> : <span className="text-2xs">{i + 1}</span>}
                        </div>
                        <span className={`text-2xs ${reached ? 'text-foreground' : 'text-muted-foreground'}`}>{stage}</span>
                      </div>
                      {i < stages.length - 1 && (
                        <div className={`h-px flex-1 ${reached ? 'bg-success' : 'bg-border'}`} style={{ marginTop: '-12px' }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
