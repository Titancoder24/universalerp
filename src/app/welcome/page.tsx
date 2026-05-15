'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Boxes,
  Check,
  ChevronRight,
  Factory,
  Heart,
  Plane,
  ShoppingBag,
  Store,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const industries = [
  { id: 'manufacturing', name: 'Manufacturing', icon: Factory, modules: ['Inventory', 'Manufacturing', 'Quality', 'Procurement'] },
  { id: 'retail', name: 'Retail', icon: Store, modules: ['POS', 'Inventory', 'Loyalty', 'Marketing'] },
  { id: 'services', name: 'Services / Agencies', icon: Wrench, modules: ['Projects', 'Time tracking', 'Invoicing', 'CRM'] },
  { id: 'distribution', name: 'Distribution', icon: ShoppingBag, modules: ['Inventory', 'Logistics', 'Procurement', 'Sales'] },
  { id: 'hospitality', name: 'Hospitality', icon: Heart, modules: ['POS', 'Reservations', 'HR', 'Inventory'] },
  { id: 'logistics', name: 'Logistics', icon: Plane, modules: ['Fleet', 'Routes', 'Dock', 'Procurement'] },
];

const steps = ['Industry', 'Branding', 'First Team', 'Done'];

export default function WelcomePage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [industry, setIndustry] = React.useState<string | null>(null);
  const [companyName, setCompanyName] = React.useState('');

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col px-6 py-12 lg:px-16">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Boxes className="size-5" />
          </div>
          <span className="font-display text-lg font-semibold">Universal ERP</span>
        </Link>

        <div className="flex-1">
          {/* Progress */}
          <div className="mb-8 flex items-center gap-3">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'grid h-7 w-7 place-items-center rounded-full text-xs font-semibold transition-colors',
                      i < step ? 'bg-success text-success-foreground'
                        : i === step ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {i < step ? <Check className="size-3.5" /> : i + 1}
                  </div>
                  <span className={cn('text-sm', i === step ? 'font-medium' : 'text-muted-foreground')}>{s}</span>
                </div>
                {i < steps.length - 1 && <div className="h-px flex-1 bg-border" />}
              </React.Fragment>
            ))}
          </div>

          {/* Steps */}
          {step === 0 && (
            <div className="max-w-3xl">
              <h1 className="font-display text-3xl font-semibold tracking-tight">What does your business do?</h1>
              <p className="mt-2 text-muted-foreground">
                We'll tailor the modules, sample data, and default workflows for your industry. You can change everything later.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {industries.map((i) => {
                  const Icon = i.icon;
                  const active = industry === i.id;
                  return (
                    <button
                      key={i.id}
                      type="button"
                      onClick={() => setIndustry(i.id)}
                      className={cn(
                        'group flex flex-col items-start gap-3 rounded-lg border p-5 text-left transition-all',
                        active
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border bg-card hover:shadow-md hover:border-foreground/30',
                      )}
                    >
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                        <Icon className="size-5" />
                      </div>
                      <div className="font-medium">{i.name}</div>
                      <div className="flex flex-wrap gap-1">
                        {i.modules.map((m) => (
                          <span key={m} className="rounded-full bg-muted px-2 py-0.5 text-2xs text-muted-foreground">
                            {m}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <Button onClick={next} disabled={!industry}>
                  Continue <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="max-w-xl">
              <h1 className="font-display text-3xl font-semibold tracking-tight">Make it yours</h1>
              <p className="mt-2 text-muted-foreground">
                Set your company name and pick a starting theme. You can fine-tune everything in the Theme Studio later.
              </p>

              <div className="mt-8 space-y-4">
                <div className="space-y-1.5">
                  <Label>Company name</Label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Corp" />
                </div>
                <div className="space-y-1.5">
                  <Label>Theme</Label>
                  <p className="text-xs text-muted-foreground">
                    Choose later — we picked a sensible default for your industry.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={prev}>Back</Button>
                <Button onClick={next}>Continue <ArrowRight className="size-4" /></Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-xl">
              <h1 className="font-display text-3xl font-semibold tracking-tight">Invite your team</h1>
              <p className="mt-2 text-muted-foreground">
                Add the people you work with. We'll generate magic links you can share through your preferred channel.
              </p>

              <div className="mt-8 space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="grid grid-cols-[1fr_1fr_120px] gap-2">
                    <Input placeholder="Name" />
                    <Input placeholder="email@company.com" type="email" />
                    <Input placeholder="Role" defaultValue="Employee" />
                  </div>
                ))}
              </div>

              <div className="mt-2">
                <Button variant="ghost" size="sm">+ Add another</Button>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={prev}>Back</Button>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={next}>Skip for now</Button>
                  <Button onClick={next}>Send invites <ArrowRight className="size-4" /></Button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-xl">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-success/15 text-success">
                <Check className="size-8" />
              </div>
              <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">You're all set!</h1>
              <p className="mt-2 text-muted-foreground">
                Your workspace is ready. We've loaded sample data so you can explore every module immediately.
              </p>

              <div className="mt-6 space-y-2">
                {[
                  '✓ 100+ modules enabled',
                  '✓ Sample customers, items, employees, and invoices loaded',
                  '✓ Default workflows activated',
                  '✓ Industry-specific dashboards configured',
                ].map((line) => (
                  <div key={line} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
                    {line}
                  </div>
                ))}
              </div>

              <Button className="mt-8" size="lg" onClick={() => router.push('/app')}>
                Open my workspace <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <aside className="hidden lg:flex relative bg-gradient-to-br from-primary/5 via-card to-card overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-30" />
        <div className="relative z-10 flex flex-col justify-center p-12">
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="text-2xs uppercase tracking-wider text-muted-foreground">Coming next</div>
              <h3 className="font-display text-2xl font-semibold">Explore your new workspace</h3>
            </div>
            <ul className="space-y-3">
              {[
                'Customize your sidebar with the modules you use',
                'Try the Theme Studio — 25 presets to choose from',
                'Invite teammates with one-click magic links',
                'Connect integrations (Slack, Stripe, GitHub)',
                'Set up your chart of accounts',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <ChevronRight className="mt-0.5 size-4 shrink-0 text-primary" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
