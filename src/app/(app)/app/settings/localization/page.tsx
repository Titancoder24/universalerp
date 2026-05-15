import { Save } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { locales } from '@/lib/localization/locales';
import { currencies } from '@/lib/localization/currencies';
import { countryPacks, supportedCountries } from '@/lib/localization/country-packs';

export default function LocalizationPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Localization"
        description="Languages, currencies, timezones, and country-specific tax/payroll packs."
        actions={<Button><Save className="size-4" /> Save changes</Button>}
      />

      <Card>
        <CardHeader>
          <CardTitle>Language & region</CardTitle>
          <CardDescription>Defaults for new users. Each user can override their own preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Default language</Label>
              <Select defaultValue="en">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {locales.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Default timezone</Label>
              <Select defaultValue="America/Los_Angeles">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (US)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (US)</SelectItem>
                  <SelectItem value="Europe/London">London (UK)</SelectItem>
                  <SelectItem value="Europe/Berlin">Central European Time</SelectItem>
                  <SelectItem value="Asia/Dubai">UAE Standard Time</SelectItem>
                  <SelectItem value="Asia/Kolkata">India Standard Time</SelectItem>
                  <SelectItem value="Asia/Singapore">Singapore Standard Time</SelectItem>
                  <SelectItem value="Asia/Tokyo">Japan Standard Time</SelectItem>
                  <SelectItem value="Australia/Sydney">Australian Eastern Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Currencies</CardTitle>
          <CardDescription>Base currency, plus any additional currencies you transact in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Base currency</Label>
            <Select defaultValue="USD">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.flag} {c.code} — {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">All reports roll up to this currency.</p>
          </div>

          <div className="space-y-1.5">
            <Label>Additional currencies</Label>
            <p className="text-xs text-muted-foreground">
              Customers, vendors, and bank accounts can transact in these currencies. Exchange rates auto-update from ECB.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['EUR', 'GBP', 'JPY'].map((c) => (
                <Badge key={c} variant="soft">{c}</Badge>
              ))}
              <Button variant="outline" size="xs">+ Add currency</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Country pack</CardTitle>
          <CardDescription>
            Pre-configured chart of accounts, tax codes, payroll components, and statutory filings for your jurisdiction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {supportedCountries.map((c) => {
            const pack = countryPacks[c];
            return (
              <div key={c} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{pack.name}</span>
                      <Badge variant="outline" className="text-2xs font-mono">{pack.currency}</Badge>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-2xs">
                        {pack.taxCodes.length} tax codes
                      </Badge>
                      <Badge variant="outline" className="text-2xs">
                        {pack.payrollComponents.length} payroll components
                      </Badge>
                      <Badge variant="outline" className="text-2xs">
                        {pack.statutoryFilings.length} statutory filings
                      </Badge>
                    </div>
                  </div>
                  <Button variant={c === 'US' ? 'default' : 'outline'} size="sm">
                    {c === 'US' ? 'Active' : 'Activate'}
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
