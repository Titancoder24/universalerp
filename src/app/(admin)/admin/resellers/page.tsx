import { Handshake, Plus, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { initials, colorFromString, formatCurrency } from '@/lib/utils';

const resellers = [
  { name: 'Apex Consulting', tenants: 47, mrr: 14200, commission: 30, country: 'US', since: '2024-08-12', status: 'active' },
  { name: 'NorthStar Systems', tenants: 32, mrr: 9800, commission: 25, country: 'CA', since: '2024-11-04', status: 'active' },
  { name: 'EuroTech Partners', tenants: 24, mrr: 8400, commission: 30, country: 'DE', since: '2025-01-15', status: 'active' },
  { name: 'Pacific Reseller Co.', tenants: 18, mrr: 5200, commission: 25, country: 'AU', since: '2025-03-22', status: 'active' },
  { name: 'Mumbai Tech Group', tenants: 56, mrr: 12400, commission: 30, country: 'IN', since: '2025-02-08', status: 'active' },
  { name: 'Atlas Solutions', tenants: 8, mrr: 2400, commission: 20, country: 'BR', since: '2026-04-15', status: 'trial' },
];

export default function AdminResellersPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Resellers"
        description="Distribution partners who white-label and sell the platform to their own customers."
        actions={<Button><Plus className="size-4" /> Invite reseller</Button>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold">{resellers.length}</div>
            <div className="text-xs text-muted-foreground">Active resellers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold">{resellers.reduce((s, r) => s + r.tenants, 0)}</div>
            <div className="text-xs text-muted-foreground">Tenants via resellers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold">{formatCurrency(resellers.reduce((s, r) => s + r.mrr, 0))}</div>
            <div className="text-xs text-muted-foreground">Reseller MRR</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold flex items-center gap-1">
              28% <TrendingUp className="size-4 text-success" />
            </div>
            <div className="text-xs text-muted-foreground">YoY growth</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Reseller</th>
                <th>Country</th>
                <th className="text-center">Tenants</th>
                <th className="text-right">MRR</th>
                <th className="text-right">Commission</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {resellers.map((r) => (
                <tr key={r.name}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm">
                        <AvatarFallback style={{ backgroundColor: colorFromString(r.name) }} className="text-white text-xs">
                          {initials(r.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{r.name}</div>
                    </div>
                  </td>
                  <td className="font-mono text-xs">{r.country}</td>
                  <td className="text-center">{r.tenants}</td>
                  <td className="text-right font-mono">{formatCurrency(r.mrr)}</td>
                  <td className="text-right font-mono">{r.commission}%</td>
                  <td className="text-xs text-muted-foreground">{r.since}</td>
                  <td>
                    <Badge variant={r.status === 'active' ? 'success' : 'warning'}>{r.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
