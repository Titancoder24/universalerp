import { Check, Plus, X } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const plans = [
  {
    code: 'starter',
    name: 'Starter',
    description: 'For small teams getting started',
    monthly: 99,
    annual: 990,
    tenants: 156,
    features: [
      { label: 'Up to 10 users', included: true },
      { label: 'Sales, CRM, Inventory, Accounting', included: true },
      { label: '10 GB storage', included: true },
      { label: 'Customer portal', included: true },
      { label: 'Manufacturing modules', included: false },
      { label: 'Custom roles', included: false },
      { label: 'SSO / SAML', included: false },
      { label: 'Priority support', included: false },
    ],
  },
  {
    code: 'pro',
    name: 'Pro',
    description: 'For growing businesses',
    monthly: 399,
    annual: 3990,
    tenants: 612,
    popular: true,
    features: [
      { label: 'Up to 50 users', included: true },
      { label: 'All 100+ modules', included: true },
      { label: '100 GB storage', included: true },
      { label: 'Customer + vendor portals', included: true },
      { label: 'Chat, calls, AI assistant', included: true },
      { label: 'Custom roles & workflows', included: true },
      { label: 'SSO / SAML', included: false },
      { label: 'Priority support', included: false },
    ],
  },
  {
    code: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    monthly: 1999,
    annual: 19990,
    tenants: 87,
    features: [
      { label: 'Unlimited users', included: true },
      { label: 'All modules + add-ons', included: true },
      { label: 'Unlimited storage', included: true },
      { label: 'Multi-entity, multi-currency', included: true },
      { label: 'White-label / reseller mode', included: true },
      { label: 'Custom roles & workflows', included: true },
      { label: 'SSO / SAML / Active Directory', included: true },
      { label: 'Dedicated support + SLA', included: true },
    ],
  },
];

export default function AdminPlansPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Pricing Plans"
        description="Manage subscription tiers, feature limits, and per-plan module access."
        actions={<Button><Plus className="size-4" /> New plan</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.code} className={plan.popular ? 'border-primary ring-2 ring-primary/20' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                {plan.popular && <Badge variant="default">Most popular</Badge>}
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-semibold">${plan.monthly}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">or ${plan.annual}/year (save 20%)</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 rounded-md bg-muted/40 px-3 py-2 text-center">
                <div className="text-2xl font-semibold">{plan.tenants}</div>
                <div className="text-xs text-muted-foreground">active tenants on this plan</div>
              </div>

              <ul className="space-y-2 text-sm">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {f.included ? (
                      <Check className="size-4 text-success shrink-0" />
                    ) : (
                      <X className="size-4 text-muted-foreground/40 shrink-0" />
                    )}
                    <span className={f.included ? '' : 'text-muted-foreground/60'}>{f.label}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex gap-2">
                <Button variant="outline" className="flex-1">Edit</Button>
                <Button variant="ghost" className="flex-1">View Tenants</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
