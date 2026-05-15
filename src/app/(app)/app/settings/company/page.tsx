import { Save, Upload } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supportedCountries } from '@/lib/localization/country-packs';
import { currencies } from '@/lib/localization/currencies';

export default function SettingsCompanyPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Company" description="Your legal entity, tax IDs, and contact information." />

      <Card>
        <CardHeader>
          <CardTitle>Company information</CardTitle>
          <CardDescription>Appears on invoices, quotes, and customer-facing documents.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Legal name</Label>
            <Input defaultValue="Acme Industries Inc." />
          </div>
          <div className="space-y-1.5">
            <Label>Display name</Label>
            <Input defaultValue="Acme" />
            <p className="text-xs text-muted-foreground">Used in headers and emails. Can be shorter than legal name.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tax ID / EIN</Label>
              <Input defaultValue="12-3456789" />
            </div>
            <div className="space-y-1.5">
              <Label>VAT / GST number</Label>
              <Input placeholder="Optional" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Industry</Label>
              <Select defaultValue="manufacturing">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="distribution">Distribution</SelectItem>
                  <SelectItem value="hospitality">Hospitality</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Company size</Label>
              <Select defaultValue="50-200">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="50-200">50-200 employees</SelectItem>
                  <SelectItem value="200-1000">200-1000 employees</SelectItem>
                  <SelectItem value="1000+">1000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Street address</Label>
            <Input defaultValue="123 Main Street, Suite 400" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input defaultValue="San Francisco" />
            </div>
            <div className="space-y-1.5">
              <Label>State/Province</Label>
              <Input defaultValue="California" />
            </div>
            <div className="space-y-1.5">
              <Label>Postal code</Label>
              <Input defaultValue="94105" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Country</Label>
            <Select defaultValue="US">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {supportedCountries.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial defaults</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Default currency</Label>
              <Select defaultValue="USD">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {currencies.slice(0, 20).map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.flag} {c.code} — {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Fiscal year starts</Label>
              <Select defaultValue="1">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                    <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button><Save className="size-4" /> Save changes</Button>
      </div>
    </div>
  );
}
