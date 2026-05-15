import Link from 'next/link';
import {
  Bell,
  Building2,
  CreditCard,
  Globe,
  HelpCircle,
  Key,
  Layers,
  Mail,
  Palette,
  Plug,
  Shield,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';

const sections = [
  {
    title: 'Workspace',
    items: [
      { icon: Building2, name: 'Company', description: 'Name, address, tax IDs', href: '/app/settings/company' },
      { icon: Layers, name: 'Modules', description: 'Enable or disable modules', href: '/app/settings/modules' },
      { icon: Globe, name: 'Localization', description: 'Currency, timezone, language, fiscal year', href: '/app/settings/localization' },
      { icon: CreditCard, name: 'Billing & Plan', description: 'Subscription and invoices', href: '/app/settings/billing' },
    ],
  },
  {
    title: 'Appearance',
    items: [
      { icon: Palette, name: 'Theme Studio', description: '25 presets, fonts, icons, density', href: '/app/settings/appearance' },
    ],
  },
  {
    title: 'People',
    items: [
      { icon: Users, name: 'Users & Permissions', description: 'Invite users and assign module access', href: '/app/settings/users' },
      { icon: Shield, name: 'Roles', description: 'Customize role templates', href: '/app/settings/roles' },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { icon: Bell, name: 'Notification rules', description: 'Per-event delivery preferences', href: '/app/settings/notifications' },
      { icon: Mail, name: 'Email templates', description: 'Customize transactional emails', href: '/app/settings/email-templates' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { icon: Plug, name: 'Connections', description: 'Connect Slack, GitHub, Zapier, more', href: '/app/integrations' },
      { icon: Key, name: 'API Keys', description: 'Personal access tokens and webhooks', href: '/app/settings/api-keys' },
    ],
  },
  {
    title: 'Security',
    items: [
      { icon: Shield, name: 'Security policy', description: 'Password rules, MFA, IP allowlisting', href: '/app/settings/security' },
      { icon: Key, name: 'Audit log', description: 'Immutable record of all actions', href: '/app/audit-log' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Settings" description="Configure your workspace, appearance, users, and integrations." />

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <Link key={item.name} href={item.href as any}>
                  <Card className="group p-4 transition-all hover:shadow-md hover:border-primary/30 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <item.icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium group-hover:text-primary">{item.name}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">{item.description}</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
