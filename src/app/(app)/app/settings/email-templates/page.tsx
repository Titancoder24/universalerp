'use client';

import * as React from 'react';
import { Mail, Plus, Search, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const templates = [
  { id: 1, name: 'Invoice Sent', category: 'Sales', subject: 'Invoice {{number}} from {{tenant_name}}', preview: 'Dear {{customer_name}}, please find attached invoice {{number}} for {{amount}}...', last_used: '2 days ago', usage: 247 },
  { id: 2, name: 'Quote Follow-up', category: 'Sales', subject: 'Following up on quote {{quote_number}}', preview: 'Hi {{customer_name}}, I wanted to follow up on the quote we sent...', last_used: '1 week ago', usage: 89 },
  { id: 3, name: 'Payment Receipt', category: 'Sales', subject: 'Payment received - Invoice {{number}}', preview: 'Thank you for your payment of {{amount}} for invoice {{number}}...', last_used: '1 day ago', usage: 312 },
  { id: 4, name: 'Welcome New Customer', category: 'CRM', subject: 'Welcome to {{tenant_name}}!', preview: 'Welcome to {{tenant_name}}. We\'re excited to have you as a customer...', last_used: '3 days ago', usage: 56 },
  { id: 5, name: 'Onboarding - Day 1', category: 'HR', subject: 'Welcome to the team, {{employee_first_name}}!', preview: 'Hi {{employee_first_name}}, welcome to {{tenant_name}}...', last_used: '5 days ago', usage: 23 },
  { id: 6, name: 'Payslip Available', category: 'HR', subject: 'Your payslip for {{period}} is ready', preview: 'Hi {{employee_first_name}}, your payslip for the period {{period}} is now available...', last_used: '12 days ago', usage: 156 },
  { id: 7, name: 'Leave Approved', category: 'HR', subject: 'Leave request approved', preview: 'Your leave request from {{from_date}} to {{to_date}} has been approved...', last_used: '1 week ago', usage: 89 },
  { id: 8, name: 'PO Sent', category: 'Procurement', subject: 'Purchase Order {{po_number}}', preview: 'Dear {{vendor_name}}, please find attached PO {{po_number}}...', last_used: '4 days ago', usage: 123 },
  { id: 9, name: 'Support Ticket Reply', category: 'Support', subject: 'Re: {{ticket_subject}}', preview: 'Hi {{customer_name}}, regarding your ticket {{ticket_number}}...', last_used: '6 hours ago', usage: 542 },
  { id: 10, name: 'Password Reset', category: 'System', subject: 'Reset your {{tenant_name}} password', preview: 'You requested to reset your password. Click the link below...', last_used: '2 days ago', usage: 67 },
];

const categories = ['All', 'Sales', 'CRM', 'HR', 'Procurement', 'Support', 'System'];

export default function EmailTemplatesPage() {
  const [search, setSearch] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('All');

  const filtered = templates.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Email Templates"
        description="Reusable templates for transactional emails. Personalize with variables and brand styling."
        actions={
          <>
            <Button variant="outline"><Sparkles className="size-4" /> AI Draft</Button>
            <Button><Plus className="size-4" /> New template</Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
          <Input
            placeholder="Search templates…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {categories.map((c) => (
            <Button
              key={c}
              variant={activeCategory === c ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((t) => (
          <Card key={t.id} className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <Badge variant="outline" className="text-2xs mt-0.5">{t.category}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xs text-muted-foreground">Used {t.usage} times</div>
                  <div className="text-2xs text-muted-foreground">Last: {t.last_used}</div>
                </div>
              </div>
              <div className="mt-3 rounded-md bg-muted/40 p-3 text-sm">
                <div className="font-medium text-xs mb-1 text-muted-foreground">Subject:</div>
                <div className="font-mono text-xs">{t.subject}</div>
                <div className="font-medium text-xs mb-1 mt-2 text-muted-foreground">Preview:</div>
                <div className="text-xs text-muted-foreground line-clamp-2">{t.preview}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
