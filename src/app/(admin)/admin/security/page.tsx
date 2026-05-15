import { Lock, Shield, Eye, KeyRound, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const securityChecks = [
  { name: 'TLS 1.3 enforced on all endpoints', status: 'pass' },
  { name: 'All passwords hashed with Argon2id', status: 'pass' },
  { name: 'Row-level security on every business table', status: 'pass' },
  { name: 'Field-level encryption for sensitive fields', status: 'pass' },
  { name: 'AI requests redact PII before sending', status: 'pass' },
  { name: 'CSP headers configured', status: 'pass' },
  { name: 'Annual penetration test', status: 'scheduled', date: '2026-06-15' },
];

export default function AdminSecurityPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Security" description="Platform-wide security policy and compliance posture." />

      {/* Security score */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-success/15 text-success">
                <Shield className="size-8" />
              </div>
              <div>
                <div className="text-2xl font-semibold">98 / 100</div>
                <div className="text-sm text-muted-foreground">Security score · last scan 2 hours ago</div>
              </div>
            </div>
            <Button variant="outline">Run scan now</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Password policy</CardTitle>
            <CardDescription>Applied to all users across all tenants.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Minimum length</Label>
              <Select defaultValue="8">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8 characters</SelectItem>
                  <SelectItem value="10">10 characters</SelectItem>
                  <SelectItem value="12">12 characters</SelectItem>
                  <SelectItem value="14">14 characters</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              {[
                'Require uppercase letters',
                'Require lowercase letters',
                'Require numbers',
                'Require special characters',
                'Block common passwords (HaveIBeenPwned)',
                'Block password reuse (last 10)',
              ].map((opt) => (
                <div key={opt} className="flex items-center justify-between">
                  <span className="text-sm">{opt}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <Label>Password expiry</Label>
              <Select defaultValue="never">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never (recommended)</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">365 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multi-factor authentication</CardTitle>
            <CardDescription>Configure MFA requirements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Enforcement</Label>
              <Select defaultValue="recommended">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Off</SelectItem>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="required-admins">Required for admins</SelectItem>
                  <SelectItem value="required-all">Required for all users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {[
              { label: 'TOTP (authenticator apps)', enabled: true },
              { label: 'WebAuthn / Passkeys', enabled: true },
              { label: 'SMS codes (not recommended)', enabled: false },
              { label: 'Email codes (fallback)', enabled: true },
              { label: 'Recovery codes', enabled: true },
            ].map((opt) => (
              <div key={opt.label} className="flex items-center justify-between">
                <span className="text-sm">{opt.label}</span>
                <Switch defaultChecked={opt.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Session lifetime</Label>
              <Select defaultValue="30d">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">1 day</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Idle timeout</Label>
              <Select defaultValue="2h">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="30m">30 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="2h">2 hours</SelectItem>
                  <SelectItem value="4h">4 hours</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {[
              { label: 'Allow concurrent sessions', enabled: true },
              { label: 'Show session list to users', enabled: true },
              { label: 'Sign out on browser close', enabled: false },
            ].map((opt) => (
              <div key={opt.label} className="flex items-center justify-between">
                <span className="text-sm">{opt.label}</span>
                <Switch defaultChecked={opt.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>IP allowlist for Super Admin</Label>
              <Input placeholder="203.45.123.0/24, 198.21.0.0/16" />
              <p className="text-xs text-muted-foreground">CIDR notation. Leave empty to allow all.</p>
            </div>
            {[
              { label: 'Geofencing', enabled: false },
              { label: 'Tor exit-node blocking', enabled: true },
              { label: 'Anonymous proxy blocking', enabled: true },
              { label: 'Rate limit by IP', enabled: true },
            ].map((opt) => (
              <div key={opt.label} className="flex items-center justify-between">
                <span className="text-sm">{opt.label}</span>
                <Switch defaultChecked={opt.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Compliance checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Security checklist</CardTitle>
          <CardDescription>Automated checks run continuously.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {securityChecks.map((c) => (
              <div key={c.name} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
                <div className="flex items-center gap-2">
                  {c.status === 'pass' ? (
                    <div className="grid h-6 w-6 place-items-center rounded-full bg-success/15 text-success">
                      <Shield className="size-3.5" />
                    </div>
                  ) : (
                    <div className="grid h-6 w-6 place-items-center rounded-full bg-warning/15 text-warning">
                      <AlertTriangle className="size-3.5" />
                    </div>
                  )}
                  <span className="text-sm">{c.name}</span>
                </div>
                <Badge variant={c.status === 'pass' ? 'success' : 'warning'}>
                  {c.status === 'pass' ? 'Pass' : c.date ? `Due ${c.date}` : 'Scheduled'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
