import { Download, History } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils';

const events = [
  { id: 1, tenant: 'Acme Industries', user: 'sarah.chen@acme.com', action: 'tenant.theme.changed', details: 'Switched theme to Bloomberg Dense', at: new Date(Date.now() - 1000 * 60 * 5), severity: 'info' },
  { id: 2, tenant: 'TechCorp Solutions', user: 'admin@techcorp.com', action: 'plan.upgraded', details: 'Pro → Enterprise plan', at: new Date(Date.now() - 1000 * 60 * 30), severity: 'success' },
  { id: 3, tenant: 'StartupCo', user: 'founder@startupco.com', action: 'tenant.created', details: 'New tenant signed up', at: new Date(Date.now() - 1000 * 60 * 90), severity: 'info' },
  { id: 4, tenant: 'Quantum Dynamics', user: 'system', action: 'tenant.suspended', details: 'Payment failure (3rd attempt)', at: new Date(Date.now() - 1000 * 60 * 60 * 4), severity: 'warning' },
  { id: 5, tenant: 'Platform', user: 'super.admin@universalerp.app', action: 'plan.created', details: 'New plan: Startup Plus', at: new Date(Date.now() - 1000 * 60 * 60 * 8), severity: 'info' },
  { id: 6, tenant: 'Global Manufacturing', user: 'security@global-mfg.com', action: 'security.policy.updated', details: 'MFA required for all users', at: new Date(Date.now() - 1000 * 60 * 60 * 12), severity: 'info' },
];

export default function AdminAuditPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Platform Audit"
        description="Cross-tenant audit trail of significant events. Tamper-proof and exportable."
        actions={
          <Button variant="outline">
            <Download className="size-4" /> Export CSV
          </Button>
        }
      />

      <Card>
        <CardContent className="p-4 space-y-2">
          {events.map((e) => (
            <div
              key={e.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 hover:bg-muted/30 transition-colors"
            >
              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                e.severity === 'success' ? 'bg-success/10 text-success' :
                e.severity === 'warning' ? 'bg-warning/10 text-warning' :
                'bg-primary/10 text-primary'
              }`}>
                <History className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-medium text-primary">{e.action}</span>
                  <Badge variant="outline" className="text-2xs">{e.tenant}</Badge>
                </div>
                <div className="mt-1 text-sm">{e.details}</div>
                <div className="mt-1 flex items-center gap-2 text-2xs text-muted-foreground">
                  <span>{e.user}</span>
                  <span>·</span>
                  <span>{formatRelativeTime(e.at)}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
