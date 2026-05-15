import Link from 'next/link';
import { ArrowLeft, Save, Trophy, Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export default function LoyaltyProgramDetailPage() {
  return (
    <div className="space-y-6 p-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/app/marketing/loyalty"><ArrowLeft className="size-4" /> Back to loyalty</Link>
      </Button>

      <PageHeader title="Acme Rewards" description="Points-based loyalty program with 4 tiers" actions={<Button><Save className="size-4" /> Save</Button>} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Earning rules</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Points per dollar</Label><Input defaultValue="1" type="number" /></div>
                <div className="space-y-1.5"><Label>Welcome bonus</Label><Input defaultValue="500" type="number" /></div>
                <div className="space-y-1.5"><Label>Birthday bonus</Label><Input defaultValue="200" type="number" /></div>
                <div className="space-y-1.5"><Label>Referral bonus</Label><Input defaultValue="1000" type="number" /></div>
              </div>
              <div className="space-y-3">
                {[
                  'Double points on bonus categories',
                  'Triple points on first order',
                  'Earn points on returned items (refund equivalent)',
                  'Cap maximum points per transaction',
                ].map((opt) => (
                  <div key={opt} className="flex items-center justify-between">
                    <span className="text-sm">{opt}</span>
                    <Switch defaultChecked={opt.includes('Triple')} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Tier structure</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Bronze', min: 0, color: 'bg-orange-500/15 text-orange-600 border-orange-500/30', benefits: ['1x points'] },
                { name: 'Silver', min: 1000, color: 'bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30', benefits: ['1.25x points', 'Free shipping'] },
                { name: 'Gold', min: 5000, color: 'bg-warning/15 text-warning border-warning/30', benefits: ['1.5x points', 'Free shipping', 'Priority support'] },
                { name: 'Platinum', min: 25000, color: 'bg-purple-500/15 text-purple-600 border-purple-500/30', benefits: ['2x points', 'Free shipping', 'Priority support', 'Dedicated account manager'] },
              ].map((tier) => (
                <div key={tier.name} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge className={tier.color}>{tier.name}</Badge>
                      <div className="text-sm mt-2">Unlocks at {tier.min.toLocaleString()} lifetime points</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {tier.benefits.map((b) => (
                          <Badge key={b} variant="outline" className="text-2xs">{b}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Redemption</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Points to $1 redemption</Label><Input defaultValue="100" type="number" /></div>
                <div className="space-y-1.5"><Label>Minimum redemption</Label><Input defaultValue="500" type="number" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Performance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><div className="text-2xl font-semibold">12,847</div><div className="text-xs text-muted-foreground">enrolled members</div></div>
              <div><div className="text-2xl font-semibold">2.4M</div><div className="text-xs text-muted-foreground">points earned (YTD)</div></div>
              <div><div className="text-2xl font-semibold">$48K</div><div className="text-xs text-muted-foreground">redemptions (YTD)</div></div>
              <div><div className="text-2xl font-semibold">+22%</div><div className="text-xs text-success">repeat purchase lift</div></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Member distribution</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { tier: 'Bronze', count: 8420, pct: 65.5 },
                { tier: 'Silver', count: 3120, pct: 24.3 },
                { tier: 'Gold', count: 1080, pct: 8.4 },
                { tier: 'Platinum', count: 227, pct: 1.8 },
              ].map((d) => (
                <div key={d.tier}>
                  <div className="flex items-center justify-between text-xs">
                    <span>{d.tier}</span>
                    <span>{d.count.toLocaleString()} ({d.pct}%)</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
