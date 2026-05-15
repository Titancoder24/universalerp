'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Sparkles,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'basic', label: 'Basic info', icon: Building2 },
  { id: 'contact', label: 'Contacts', icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'financial', label: 'Financial', icon: CreditCard },
  { id: 'tax', label: 'Tax', icon: FileText },
  { id: 'custom', label: 'Custom fields', icon: Sparkles },
];

interface Contact {
  id: string;
  type: 'email' | 'phone';
  value: string;
  label: string;
  primary?: boolean;
}

export default function NewCustomerPage() {
  const [step, setStep] = React.useState(0);
  const [contacts, setContacts] = React.useState<Contact[]>([
    { id: '1', type: 'email', value: 'billing@acme.com', label: 'Billing', primary: true },
    { id: '2', type: 'phone', value: '+1 415 555 0119', label: 'Main' },
  ]);
  const [sameAsBilling, setSameAsBilling] = React.useState(true);
  const [billing, setBilling] = React.useState({
    line1: '525 Mission Street',
    line2: 'Suite 400',
    city: 'San Francisco',
    state: 'CA',
    postal: '94105',
    country: 'United States',
  });
  const [shipping, setShipping] = React.useState(billing);

  const copyBilling = () => {
    setShipping(billing);
    setSameAsBilling(true);
  };

  const addContact = (type: 'email' | 'phone') =>
    setContacts((p) => [...p, { id: String(Date.now()), type, value: '', label: '' }]);

  const removeContact = (id: string) => setContacts((p) => p.filter((c) => c.id !== id));

  return (
    <div className="flex flex-col">
      <PageHeader
        title="New customer"
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Sales', href: '/app/sales' },
          { label: 'Customers', href: '/app/sales/customers' },
          { label: 'New' },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/sales/customers">
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 p-6 pb-28 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-1">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = idx === step;
            const isDone = idx < step;
            return (
              <button
                key={s.id}
                onClick={() => setStep(idx)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                  isActive && 'bg-primary/10 text-primary',
                  !isActive && 'hover:bg-accent',
                )}
              >
                <span
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full border text-xs',
                    isActive && 'border-primary bg-primary text-primary-foreground',
                    isDone && 'border-success bg-success/10 text-success',
                    !isActive && !isDone && 'border-border text-muted-foreground',
                  )}
                >
                  {isDone ? <Check className="size-3.5" /> : <Icon className="size-3.5" />}
                </span>
                <span className={cn('font-medium', !isActive && !isDone && 'text-muted-foreground')}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </aside>

        <div>
          {step === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5 md:col-span-2">
                  <Label required>Customer name</Label>
                  <Input defaultValue="Northwind Trading Corp" placeholder="Legal entity name" />
                </div>
                <div className="space-y-1.5">
                  <Label required>Customer code</Label>
                  <Input defaultValue="CUST-1042" className="font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label>Display name</Label>
                  <Input placeholder="Northwind" defaultValue="Northwind" />
                </div>
                <div className="space-y-1.5">
                  <Label required>Customer type</Label>
                  <Select defaultValue="business">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="nonprofit">Non-profit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Industry</Label>
                  <Select defaultValue="manufacturing">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail & E-commerce</SelectItem>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="finance">Financial Services</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Brief description, segment notes, notes for the team…" minRows={3} />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 1 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Contact methods</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => addContact('email')}>
                    <Mail className="size-4" /> Email
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addContact('phone')}>
                    <Phone className="size-4" /> Phone
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {contacts.map((c) => (
                  <div key={c.id} className="grid grid-cols-[40px_120px_1fr_120px_40px] gap-2 items-center">
                    {c.type === 'email' ? <Mail className="size-4 text-muted-foreground mx-auto" /> : <Phone className="size-4 text-muted-foreground mx-auto" />}
                    <Input defaultValue={c.label} placeholder="Label" />
                    <Input defaultValue={c.value} placeholder={c.type === 'email' ? 'email@company.com' : '+1 555 000 0000'} />
                    {c.primary ? <span className="text-xs font-medium text-success text-center">Primary</span> : <Button variant="ghost" size="sm" className="text-xs">Set primary</Button>}
                    <Button variant="ghost" size="icon-sm" onClick={() => removeContact(c.id)}><Trash2 className="size-3.5" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle>Billing address</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-1.5 md:col-span-2"><Label>Address line 1</Label><Input value={billing.line1} onChange={(e) => setBilling({ ...billing, line1: e.target.value })} /></div>
                  <div className="space-y-1.5 md:col-span-2"><Label>Address line 2</Label><Input value={billing.line2} onChange={(e) => setBilling({ ...billing, line2: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>City</Label><Input value={billing.city} /></div>
                  <div className="space-y-1.5"><Label>State / Region</Label><Input value={billing.state} /></div>
                  <div className="space-y-1.5"><Label>Postal code</Label><Input value={billing.postal} /></div>
                  <div className="space-y-1.5"><Label>Country</Label><Input value={billing.country} /></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Shipping address</CardTitle>
                  <Button variant="outline" size="sm" onClick={copyBilling}><Copy className="size-4" /> Copy from billing</Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-1.5 md:col-span-2"><Label>Address line 1</Label><Input value={shipping.line1} onChange={(e) => setShipping({ ...shipping, line1: e.target.value })} /></div>
                  <div className="space-y-1.5 md:col-span-2"><Label>Address line 2</Label><Input value={shipping.line2} /></div>
                  <div className="space-y-1.5"><Label>City</Label><Input value={shipping.city} /></div>
                  <div className="space-y-1.5"><Label>State / Region</Label><Input value={shipping.state} /></div>
                  <div className="space-y-1.5"><Label>Postal code</Label><Input value={shipping.postal} /></div>
                  <div className="space-y-1.5"><Label>Country</Label><Input value={shipping.country} /></div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 3 && (
            <Card>
              <CardHeader><CardTitle>Financial settings</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5"><Label required>Currency</Label><Select defaultValue="USD"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="USD">USD - US Dollar</SelectItem><SelectItem value="EUR">EUR - Euro</SelectItem><SelectItem value="GBP">GBP - British Pound</SelectItem><SelectItem value="JPY">JPY - Japanese Yen</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Payment terms</Label><Select defaultValue="net30"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="receipt">Due on receipt</SelectItem><SelectItem value="net15">Net 15</SelectItem><SelectItem value="net30">Net 30</SelectItem><SelectItem value="net45">Net 45</SelectItem><SelectItem value="net60">Net 60</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Credit limit</Label><Input type="number" defaultValue={50000} className="font-mono" /></div>
                <div className="space-y-1.5"><Label>Discount %</Label><Input type="number" defaultValue={5} /></div>
                <div className="space-y-1.5"><Label>Price list</Label><Select defaultValue="standard"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="standard">Standard</SelectItem><SelectItem value="wholesale">Wholesale tier</SelectItem><SelectItem value="enterprise">Enterprise tier</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Collection method</Label><Select defaultValue="manual"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="manual">Manual invoicing</SelectItem><SelectItem value="auto">Auto-charge card on file</SelectItem><SelectItem value="ach">ACH debit</SelectItem></SelectContent></Select></div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardHeader><CardTitle>Tax information</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5"><Label>Tax ID / EIN</Label><Input defaultValue="87-1234567" className="font-mono" /></div>
                <div className="space-y-1.5"><Label>VAT number</Label><Input placeholder="GB123456789" className="font-mono" /></div>
                <div className="space-y-1.5"><Label>Default tax code</Label><Select defaultValue="us-ca-825"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="us-ca-825">US-CA Sales Tax 8.25%</SelectItem><SelectItem value="us-ny-885">US-NY Sales Tax 8.875%</SelectItem><SelectItem value="exempt">Tax exempt</SelectItem><SelectItem value="reverse">Reverse charge</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Tax exemption certificate</Label><Input placeholder="Exemption # / file ref" /></div>
                <div className="space-y-1.5 md:col-span-2"><Label>Tax notes</Label><Textarea placeholder="Notes for tax/AR team" minRows={3} /></div>
              </CardContent>
            </Card>
          )}

          {step === 5 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Custom fields</CardTitle>
                <Button variant="outline" size="sm"><Plus className="size-4" /> Add field</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-1.5"><Label>Account manager</Label><Input defaultValue="Sarah Chen" /></div>
                  <div className="space-y-1.5"><Label>Salesforce ID</Label><Input placeholder="0015800001abc" className="font-mono" /></div>
                  <div className="space-y-1.5"><Label>Customer since</Label><Input type="date" defaultValue="2023-08-12" /></div>
                  <div className="space-y-1.5"><Label>Renewal date</Label><Input type="date" defaultValue="2026-08-12" /></div>
                  <div className="space-y-1.5 md:col-span-2"><Label>Tags</Label><Input placeholder="Comma-separated" defaultValue="enterprise, manufacturing, west-region" /></div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Step {step + 1}</span> of {steps.length} - {steps[step].label}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild><Link href="/app/sales/customers"><X className="size-4" /> Cancel</Link></Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="outline" size="sm" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}><ChevronLeft className="size-4" /> Back</Button>
            {step < steps.length - 1 ? (
              <Button size="sm" onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>Next <ChevronRight className="size-4" /></Button>
            ) : (
              <Button size="sm"><Save className="size-4" /> Create customer</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
