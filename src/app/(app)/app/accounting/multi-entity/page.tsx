import { Building2, Plus, RefreshCw, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency, initials, colorFromString } from '@/lib/utils';

const entities = [
  { id: 1, name: 'Acme Industries Inc.', country: 'US', currency: 'USD', revenue: 4500000, expenses: 3200000, profit: 1300000, employees: 142, primary: true },
  { id: 2, name: 'Acme Europe GmbH', country: 'DE', currency: 'EUR', revenue: 2100000, expenses: 1500000, profit: 600000, employees: 38 },
  { id: 3, name: 'Acme Asia Pte Ltd', country: 'SG', currency: 'SGD', revenue: 1800000, expenses: 1300000, profit: 500000, employees: 28 },
  { id: 4, name: 'Acme UK Ltd', country: 'GB', currency: 'GBP', revenue: 1200000, expenses: 950000, profit: 250000, employees: 22 },
];

const intercompany = [
  { date: '2026-05-12', from: 'Acme Industries Inc.', to: 'Acme Europe GmbH', desc: 'Q2 licensing fees', amount: 84000 },
  { date: '2026-05-10', from: 'Acme Industries Inc.', to: 'Acme Asia Pte Ltd', desc: 'Engineering services', amount: 42000 },
  { date: '2026-05-08', from: 'Acme Europe GmbH', to: 'Acme Industries Inc.', desc: 'Custom development', amount: 28000 },
  { date: '2026-05-01', from: 'Acme UK Ltd', to: 'Acme Industries Inc.', desc: 'Royalty payment', amount: 18000 },
];

export default function MultiEntityPage() {
  const totalRevenue = entities.reduce((s, e) => s + e.revenue, 0);
  const totalProfit = entities.reduce((s, e) => s + e.profit, 0);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Multi-Entity"
        description="Separate ledgers per legal entity with intercompany reconciliation and consolidated reporting."
        actions={
          <>
            <Button variant="outline"><RefreshCw className="size-4" /> Run consolidation</Button>
            <Button><Plus className="size-4" /> New entity</Button>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Consolidated view (USD)</CardTitle>
          <CardDescription>All entities translated to base currency at month-end rates</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Total revenue</div>
            <div className="text-2xl font-semibold">{formatCurrency(totalRevenue)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total profit</div>
            <div className="text-2xl font-semibold text-success">{formatCurrency(totalProfit)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Profit margin</div>
            <div className="text-2xl font-semibold">{((totalProfit / totalRevenue) * 100).toFixed(1)}%</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Legal entities</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Entity</th>
                <th>Country</th>
                <th>Currency</th>
                <th className="text-right">Revenue</th>
                <th className="text-right">Expenses</th>
                <th className="text-right">Profit</th>
                <th className="text-center">Employees</th>
              </tr>
            </thead>
            <tbody>
              {entities.map((e) => (
                <tr key={e.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback style={{ backgroundColor: colorFromString(e.name) }} className="text-xs text-white">
                          {initials(e.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{e.name}</div>
                        {e.primary && <Badge variant="success" className="text-2xs">Primary</Badge>}
                      </div>
                    </div>
                  </td>
                  <td><span className="font-mono text-xs">{e.country}</span></td>
                  <td><Badge variant="outline">{e.currency}</Badge></td>
                  <td className="text-right font-mono">{formatCurrency(e.revenue, e.currency)}</td>
                  <td className="text-right font-mono">{formatCurrency(e.expenses, e.currency)}</td>
                  <td className="text-right font-mono font-semibold text-success">{formatCurrency(e.profit, e.currency)}</td>
                  <td className="text-center">{e.employees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Intercompany transactions (current period)</CardTitle>
          <CardDescription>Transactions between entities. Auto-matched on both sides.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>From entity</th>
                <th>To entity</th>
                <th>Description</th>
                <th className="text-right">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {intercompany.map((tx, i) => (
                <tr key={i}>
                  <td className="text-sm">{tx.date}</td>
                  <td className="text-sm">{tx.from}</td>
                  <td className="text-sm">{tx.to}</td>
                  <td className="text-sm">{tx.desc}</td>
                  <td className="text-right font-mono">{formatCurrency(tx.amount)}</td>
                  <td><Badge variant="success">Matched</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
