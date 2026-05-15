'use client';

import { Bell, Mail, MessageSquare, Save, Smartphone } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const eventGroups = [
  {
    label: 'Sales',
    events: [
      'New customer created',
      'Quote sent',
      'Quote accepted',
      'Quote rejected',
      'Order confirmed',
      'Invoice paid',
      'Invoice overdue',
    ],
  },
  {
    label: 'CRM',
    events: [
      'Lead assigned to me',
      'Lead converted',
      'Opportunity stage changed',
      'Opportunity won',
      'Activity due soon',
    ],
  },
  {
    label: 'HR',
    events: [
      'Leave request submitted',
      'Leave approved/rejected',
      'New hire onboarding',
      'Performance review due',
      'Payroll run completed',
    ],
  },
  {
    label: 'Inventory',
    events: [
      'Stock below reorder point',
      'Item expiring within 30 days',
      'Stock movement',
      'PO received',
      'Stock count variance',
    ],
  },
  {
    label: 'Communication',
    events: [
      'Direct message',
      'Mention in channel',
      'Thread reply',
      'Channel announcement',
      'Call invitation',
    ],
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Notifications"
        description="Choose which events to be notified about and how."
        actions={<Button><Save className="size-4" /> Save preferences</Button>}
      />

      <Card>
        <CardHeader>
          <CardTitle>Quiet hours</CardTitle>
          <CardDescription>Notifications outside these hours won't sound or vibrate.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-sm">
            <Switch defaultChecked /> Enable quiet hours
            <span className="text-muted-foreground">from</span>
            <input type="time" defaultValue="18:00" className="input-base h-8 w-24" />
            <span className="text-muted-foreground">to</span>
            <input type="time" defaultValue="08:00" className="input-base h-8 w-24" />
          </div>
        </CardContent>
      </Card>

      {eventGroups.map((group) => (
        <Card key={group.label}>
          <CardHeader>
            <CardTitle>{group.label}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th className="w-20 text-center">
                    <Bell className="mx-auto size-3.5" /> In-app
                  </th>
                  <th className="w-20 text-center">
                    <Smartphone className="mx-auto size-3.5" /> Push
                  </th>
                  <th className="w-20 text-center">
                    <Mail className="mx-auto size-3.5" /> Email
                  </th>
                  <th className="w-20 text-center">
                    <MessageSquare className="mx-auto size-3.5" /> Slack
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.events.map((event) => (
                  <tr key={event}>
                    <td className="font-medium">{event}</td>
                    <td className="text-center"><Switch defaultChecked /></td>
                    <td className="text-center"><Switch defaultChecked /></td>
                    <td className="text-center"><Switch /></td>
                    <td className="text-center"><Switch /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
