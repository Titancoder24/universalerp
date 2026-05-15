import Link from 'next/link';
import { ArrowRight, BarChart3, Boxes, Calculator, MessageSquare, ShieldCheck, Sparkles, Users, Workflow, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const pillars = [
  { icon: Users, title: 'Sales & CRM', body: 'Leads → opportunities → quotes → orders → invoices. Pipeline kanban, forecasting, commission tracking.' },
  { icon: Calculator, title: 'Accounting', body: 'Double-entry GL with multi-currency, multi-entity, fixed assets, budgeting, and 13-week cash flow.' },
  { icon: Users, title: 'HR & Payroll', body: 'Employees, attendance, leave, country-specific payroll, expenses, performance, recruitment, learning.' },
  { icon: Boxes, title: 'Inventory & WMS', body: 'Items, multi-warehouse, batch/serial, expiry, receive → putaway → pick → pack → ship.' },
  { icon: Workflow, title: 'Manufacturing', body: 'BOMs, MRP, work orders, shop floor with Andon, OEE tracking, subcontracting.' },
  { icon: MessageSquare, title: 'Chat & Calls', body: 'Slack-grade chat woven through every record, with voice and video calls built in.' },
];

const features = [
  { icon: Sparkles, title: '25 visual themes', body: 'From Stripe Clean to Bloomberg Dense — re-skin the entire app with one click. Each theme is a complete personality.' },
  { icon: ShieldCheck, title: 'Cryptographic multi-tenancy', body: 'PostgreSQL row-level security enforces tenant isolation at the database, not the application.' },
  { icon: Zap, title: 'Real-time everywhere', body: 'Quote viewed, message arrived, inventory level changed — every connected client updates without a refresh.' },
  { icon: BarChart3, title: 'AI through OpenRouter', body: 'Resume scoring, invoice OCR, forecasting, smart drafts — all gated by per-tenant budget controls.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top nav */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="size-5" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">Universal ERP</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="#features" className="hover:text-foreground">Features</Link>
            <Link href="#modules" className="hover:text-foreground">Modules</Link>
            <Link href="#pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="#docs" className="hover:text-foreground">Docs</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Start free <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="soft" className="mb-6">
            <Sparkles className="size-3.5" /> Universal ERP · 100+ modules in one app
          </Badge>
          <h1 className="text-balance font-display text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            The ERP that{' '}
            <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              replaces ten subscriptions.
            </span>
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
            CRM, accounting, HR, inventory, manufacturing, projects, chat — and ninety-something more —
            built on one foundation with one login. Self-host on a $20 VPS or run as a SaaS.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Get started <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#demo">See it live</Link>
            </Button>
          </div>
        </div>

        {/* Mock dashboard */}
        <div className="mt-20 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-destructive/70" />
            <div className="h-3 w-3 rounded-full bg-warning/70" />
            <div className="h-3 w-3 rounded-full bg-success/70" />
            <div className="ml-3 text-xs text-muted-foreground">universal-erp.app</div>
          </div>
          <div className="grid grid-cols-12 gap-px bg-border">
            <aside className="col-span-2 bg-sidebar p-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-primary" />
                <span className="text-xs font-medium">Acme Corp</span>
              </div>
              {['Dashboard', 'Sales', 'CRM', 'HR', 'Inventory', 'Accounting', 'Reports', 'Chat'].map((n) => (
                <div key={n} className="rounded px-2 py-1.5 text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent">
                  {n}
                </div>
              ))}
            </aside>
            <main className="col-span-10 bg-background p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Dashboard</h2>
                <div className="flex gap-2">
                  <div className="h-7 w-20 rounded bg-muted" />
                  <div className="h-7 w-24 rounded bg-primary/10" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Revenue MTD', value: '$284,320', delta: '+12.4%' },
                  { label: 'Open invoices', value: '47', delta: '-3' },
                  { label: 'Pipeline', value: '$1.2M', delta: '+$240K' },
                  { label: 'Headcount', value: '142', delta: '+4' },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-card p-4">
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="mt-1 text-2xl font-semibold">{s.value}</div>
                    <div className="mt-1 text-xs text-success">{s.delta}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="col-span-2 h-48 rounded-lg border border-border bg-card p-4">
                  <div className="mb-3 text-sm font-medium">Revenue trend</div>
                  <div className="flex h-32 items-end gap-1">
                    {[40, 65, 50, 70, 80, 75, 90, 100, 85, 95, 100, 110].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-primary/30"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="h-48 rounded-lg border border-border bg-card p-4">
                  <div className="mb-3 text-sm font-medium">Recent activity</div>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5">
                      <div className="h-6 w-6 rounded-full bg-muted" />
                      <div className="h-2 flex-1 rounded bg-muted" />
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section id="modules" className="container py-16">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-3">Modules</Badge>
          <h2 className="font-display text-4xl font-semibold tracking-tight">Every business function. One app.</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            100+ modules across 14 pillars, woven together with one identity, one search, and one chat thread per record.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-16">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-3">What sets it apart</Badge>
          <h2 className="font-display text-4xl font-semibold tracking-tight">Familiar in shape. Better in depth.</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-6">
              <Icon className="size-7 text-primary" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-card to-card p-12 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Ready to consolidate ten tools into one?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Self-host on your own VPS, or sign up for the hosted plan. No credit card. No vendor lock-in. Forever exportable.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Start your tenant <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="https://github.com/titancoder24/universalerp" target="_blank" rel="noopener">
                Get the self-host bundle
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-3 py-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Universal ERP. Made with care.</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/security" className="hover:text-foreground">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
