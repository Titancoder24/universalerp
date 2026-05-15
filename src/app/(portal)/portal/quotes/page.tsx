'use client';

import * as React from 'react';
import { Check, Download, Eye, FileSignature, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatCurrency, formatDate } from '@/lib/utils';

const quotes = [
  { id: 'QT-456', name: 'Q3 Hardware Expansion', date: '2026-05-10', expires: '2026-05-30', amount: 45000, status: 'sent' as const, version: 1 },
  { id: 'QT-461', name: 'Support Renewal 2026-27', date: '2026-05-08', expires: '2026-06-15', amount: 12000, status: 'sent' as const, version: 2 },
  { id: 'QT-432', name: 'Implementation Services', date: '2026-04-20', expires: '2026-05-04', amount: 32500, status: 'accepted' as const, version: 1, signedAt: '2026-04-25' },
  { id: 'QT-411', name: 'Custom feature request', date: '2026-03-15', expires: '2026-04-01', amount: 8200, status: 'expired' as const, version: 1 },
];

export default function PortalQuotesPage() {
  const [signingQuote, setSigningQuote] = React.useState<string | null>(null);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Quotations</h1>
        <p className="text-muted-foreground">Review and sign quotes from Acme Corp</p>
      </div>

      <div className="space-y-3">
        {quotes.map((q) => (
          <Card key={q.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-primary">{q.id}</span>
                    {q.version > 1 && <Badge variant="outline" className="text-2xs">v{q.version}</Badge>}
                    <StatusBadge status={q.status} />
                  </div>
                  <h3 className="mt-1 text-lg font-semibold">{q.name}</h3>
                  <div className="mt-2 grid gap-y-1 text-xs text-muted-foreground sm:grid-cols-3">
                    <div>Issued: <span className="text-foreground">{formatDate(q.date)}</span></div>
                    <div>Valid until: <span className="text-foreground">{formatDate(q.expires)}</span></div>
                    {q.signedAt && <div>Signed: <span className="text-foreground">{formatDate(q.signedAt)}</span></div>}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-2xl font-semibold">{formatCurrency(q.amount)}</div>
                  <div className="mt-3 flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="size-3.5" /> View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="size-3.5" /> PDF
                    </Button>
                    {q.status === 'sent' && (
                      <Button size="sm" onClick={() => setSigningQuote(q.id)}>
                        <FileSignature className="size-3.5" /> Sign
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!signingQuote} onOpenChange={() => setSigningQuote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign quotation {signingQuote}</DialogTitle>
            <DialogDescription>
              By signing, you accept the terms of this quotation. We'll convert it to an order and you'll receive a confirmation.
            </DialogDescription>
          </DialogHeader>
          <SignatureCanvas />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSigningQuote(null)}>Cancel</Button>
            <Button onClick={() => setSigningQuote(null)}>
              <Check className="size-4" /> Accept & Sign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SignatureCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const drawing = React.useRef(false);
  const lastPoint = React.useRef<{ x: number; y: number } | null>(null);

  const handleDown = (e: React.PointerEvent) => {
    drawing.current = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    lastPoint.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const handleMove = (e: React.PointerEvent) => {
    if (!drawing.current || !canvasRef.current || !lastPoint.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = 'currentColor';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPoint.current = { x, y };
  };
  const handleUp = () => {
    drawing.current = false;
    lastPoint.current = null;
  };
  const handleClear = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">Sign in the box below using your mouse, finger, or stylus.</div>
      <div className="rounded-lg border-2 border-dashed border-border bg-muted/30">
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          className="w-full cursor-crosshair touch-none"
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
          onPointerLeave={handleUp}
        />
      </div>
      <div className="flex justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
          <X className="size-3.5" /> Clear
        </Button>
      </div>
    </div>
  );
}
