'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Boxes,
  Building2,
  Calendar,
  FileText,
  MessageSquare,
  Receipt,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const allResults = [
  { type: 'customer', icon: Building2, title: 'Acme Industries Inc.', subtitle: 'CUST-001 · 142 invoices · $1.24M revenue', link: '/app/sales/customers/1' },
  { type: 'customer', icon: Building2, title: 'Acme Subsidiary LLC', subtitle: 'CUST-018 · 8 invoices · $124K revenue', link: '/app/sales/customers/18' },
  { type: 'invoice', icon: Receipt, title: 'INV-2089 - Acme Industries', subtitle: '$12,450 · Paid May 13', link: '/app/sales/invoices/INV-2089' },
  { type: 'invoice', icon: Receipt, title: 'INV-2087 - Acme Industries', subtitle: '$24,500 · Partial', link: '/app/sales/invoices/INV-2087' },
  { type: 'quote', icon: FileText, title: 'QT-456 - Acme Q3 Expansion', subtitle: '$45,000 · Sent', link: '/app/sales/quotations/QT-456' },
  { type: 'contact', icon: Users, title: 'Sarah Mitchell @ Acme', subtitle: 'VP Procurement · sarah@acme.com', link: '/app/crm/contacts/1' },
  { type: 'opportunity', icon: Sparkles, title: 'Acme Expansion Deal', subtitle: '$245K · Negotiation stage · Sarah Chen', link: '/app/crm/opportunities/1' },
  { type: 'message', icon: MessageSquare, title: 'Discussion: "Acme expansion timeline"', subtitle: '#sales · 12 messages', link: '/app/chat' },
  { type: 'item', icon: Boxes, title: 'WGT-A-500 - Premium Widget Bundle', subtitle: '247 units in stock · $35/each', link: '/app/inventory/items' },
  { type: 'event', icon: Calendar, title: 'Q3 Board Review · May 14', subtitle: '2:00 PM · 6 attendees', link: '/app/calendar' },
];

const typeColors: Record<string, string> = {
  customer: 'bg-primary/10 text-primary',
  invoice: 'bg-success/10 text-success',
  quote: 'bg-info/10 text-info',
  contact: 'bg-warning/10 text-warning',
  opportunity: 'bg-purple-500/10 text-purple-500',
  message: 'bg-pink-500/10 text-pink-500',
  item: 'bg-orange-500/10 text-orange-500',
  event: 'bg-blue-500/10 text-blue-500',
};

export default function SearchPage() {
  const params = useSearchParams();
  const initialQuery = params.get('q') ?? '';
  const [query, setQuery] = React.useState(initialQuery);

  const filtered = query
    ? allResults.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.subtitle.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const byType = filtered.reduce(
    (acc, r) => {
      (acc[r.type] ||= []).push(r);
      return acc;
    },
    {} as Record<string, typeof allResults>,
  );

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Search" description="Search across customers, invoices, quotes, contacts, opportunities, messages, items, and more." />

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              autoFocus
              placeholder="Search anything…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 pl-10 text-base"
            />
          </div>
        </CardContent>
      </Card>

      {!query && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Recent searches</h3>
              <div className="flex flex-wrap gap-2">
                {['Acme Industries', 'INV-2089', 'sarah.chen@acme.com', 'Q3 forecast', 'overdue invoices'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:bg-muted transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Saved filters</h3>
              <div className="space-y-2 text-sm">
                {[
                  'Overdue invoices > $5K',
                  'Customers without orders in 90d',
                  'Open opportunities expected this quarter',
                ].map((f) => (
                  <button
                    key={f}
                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted transition-colors text-left"
                  >
                    <span>{f}</span>
                    <Search className="size-3.5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {query && filtered.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="size-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="font-semibold">No results found for "{query}"</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search or check your spelling.</p>
          </CardContent>
        </Card>
      )}

      {query && filtered.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{filtered.length} results for "{query}"</p>
          {Object.entries(byType).map(([type, results]) => (
            <Card key={type}>
              <CardContent className="p-0">
                <div className="border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {type}s · {results.length}
                </div>
                <div className="divide-y divide-border">
                  {results.map((r, i) => (
                    <Link
                      key={i}
                      href={r.link as any}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${typeColors[r.type]}`}>
                        <r.icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">{r.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{r.subtitle}</div>
                      </div>
                      <Badge variant="outline" className="text-2xs uppercase">{r.type}</Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
