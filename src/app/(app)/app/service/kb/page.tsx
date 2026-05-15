'use client';

import * as React from 'react';
import {
  BookOpen,
  CreditCard,
  Cog,
  FileText,
  Headphones,
  Plus,
  Search,
  Star,
  Truck,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, initials } from '@/lib/utils';

const categories = [
  { id: 'all', name: 'All articles', icon: BookOpen, count: 142 },
  { id: 'product', name: 'Product Guides', icon: Cog, count: 48 },
  { id: 'troubleshooting', name: 'Troubleshooting', icon: Wrench, count: 36 },
  { id: 'installation', name: 'Installation', icon: FileText, count: 22 },
  { id: 'billing', name: 'Billing & Account', icon: CreditCard, count: 14 },
  { id: 'shipping', name: 'Shipping & Returns', icon: Truck, count: 12 },
  { id: 'service', name: 'Service Procedures', icon: Headphones, count: 10 },
];

const articles = [
  { id: 'KB-0214', title: 'PMP-310 Series Installation Guide', category: 'installation', summary: 'Complete installation procedure for the PMP-310-X centrifugal pump including foundation prep, alignment, and commissioning.', author: 'Adrian Reyes', updated: '2 days ago', views: 1240, rating: 4.8, tags: ['pump','install','PMP-310'] },
  { id: 'KB-0312', title: 'Centrifugal Pump Vibration Troubleshooting', category: 'troubleshooting', summary: 'Step-by-step diagnostic for vibration issues. Covers imbalance, misalignment, bearing wear, and cavitation.', author: 'Marcus Stark', updated: '1 week ago', views: 892, rating: 4.9, tags: ['pump','vibration','diagnostics'] },
  { id: 'KB-0156', title: 'Warranty Claim Process - Field Service', category: 'service', summary: 'How to submit a warranty claim including required documentation, photos, and field test data.', author: 'Sofia Lee', updated: '3 weeks ago', views: 2104, rating: 4.6, tags: ['warranty','field','process'] },
  { id: 'KB-0418', title: 'Foundation Preparation for Heavy Pumps', category: 'installation', summary: 'Concrete specifications, anchor placement, and isolation pads for installations > 500kg.', author: 'Adrian Reyes', updated: '1 month ago', views: 612, rating: 4.7, tags: ['foundation','install'] },
  { id: 'KB-0089', title: 'GBX-450 Series Operating Manual', category: 'product', summary: 'Complete operating manual for the 450 series gearbox including spec, maintenance schedule, and troubleshooting flowchart.', author: 'Marcus Stark', updated: '2 weeks ago', views: 3204, rating: 4.9, tags: ['gearbox','manual','GBX-450'] },
  { id: 'KB-0247', title: '2.2kW Induction Motor Specifications', category: 'product', summary: 'Full electrical and mechanical spec for MTR-2.2KW including efficiency curves and starting characteristics.', author: 'Adrian Reyes', updated: '5 days ago', views: 1582, rating: 4.5, tags: ['motor','spec','MTR-2.2KW'] },
  { id: 'KB-0521', title: 'Understanding Your Invoice', category: 'billing', summary: 'Walkthrough of invoice line items including tax, freight, surcharges, and payment terms.', author: 'Sofia Lee', updated: '1 month ago', views: 728, rating: 4.4, tags: ['billing','invoice'] },
  { id: 'KB-0623', title: 'Return Authorization (RMA) Procedure', category: 'shipping', summary: 'How to request an RMA, packaging requirements, and shipment of returns.', author: 'Priya Krishnan', updated: '3 days ago', views: 1820, rating: 4.7, tags: ['rma','returns'] },
  { id: 'KB-0712', title: 'Hydraulic Valve VLV-104 Setup', category: 'installation', summary: 'Installation orientation, pressure tap connections, and electrical wiring for the VLV-104-B valve.', author: 'Devon Thompson', updated: '6 days ago', views: 524, rating: 4.6, tags: ['valve','install','VLV-104'] },
  { id: 'KB-0834', title: 'CNC Machine Daily Pre-shift Checks', category: 'service', summary: 'Operator daily checklist for CNC machines covering coolant, way oil, air pressure, and emergency stops.', author: 'Carlos Mendez', updated: '4 weeks ago', views: 1402, rating: 4.8, tags: ['cnc','daily','checklist'] },
  { id: 'KB-0921', title: 'PCBA Cleaning & Handling Best Practices', category: 'service', summary: 'ESD handling, IPC-A-610 acceptance criteria, and cleaning solvents for control PCBAs.', author: 'Maya Jensen', updated: '2 weeks ago', views: 412, rating: 4.5, tags: ['pcba','ipc','esd'] },
  { id: 'KB-0145', title: 'Chain Conveyor Tension Adjustment', category: 'troubleshooting', summary: 'Step-by-step procedure for adjusting chain tension on CHN-CV-32 conveyors. Includes tension tool spec.', author: 'Marcus Stark', updated: '1 week ago', views: 380, rating: 4.6, tags: ['conveyor','tension','CHN-CV'] },
];

const categoryColor: Record<string, string> = {
  product: 'hsl(var(--chart-1))',
  troubleshooting: 'hsl(var(--chart-2))',
  installation: 'hsl(var(--chart-3))',
  billing: 'hsl(var(--chart-4))',
  shipping: 'hsl(var(--chart-5))',
  service: 'hsl(var(--chart-6))',
};

export default function KbPage() {
  const [search, setSearch] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('all');

  const filtered = articles.filter((a) => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase()) || a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === 'all' || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Knowledge Base"
        description="Customer-facing articles, internal procedures and troubleshooting guides."
        breadcrumbs={[
          { label: 'Service', href: '/app/service' },
          { label: 'Knowledge base' },
        ]}
        actions={
          <Button><Plus className="size-4" /> New article</Button>
        }
      />

      <Card>
        <CardContent className="p-6">
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles by title, content or tag..."
              className="h-12 pl-10 text-base"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[16rem_1fr]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 p-2">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    activeCategory === c.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-accent text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className="size-4" />
                  <span className="flex-1">{c.name}</span>
                  <span className="font-mono text-2xs tabular-nums">{c.count}</span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filtered.length}</span> articles
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Sort by:</span>
              <Button variant="ghost" size="xs">Recently updated</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filtered.map((a) => (
              <Card key={a.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full" style={{ background: categoryColor[a.category] }} />
                      <span className="font-mono text-2xs text-primary">{a.id}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs">
                      <Star className="size-3 fill-warning text-warning" />
                      <span className="font-mono tabular-nums">{a.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-base font-semibold leading-tight">{a.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{a.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {a.tags.map((t) => (<Badge key={t} variant="outline" size="sm">{t}</Badge>))}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <div className="flex items-center gap-1.5">
                      <Avatar size="xs"><AvatarFallback>{initials(a.author)}</AvatarFallback></Avatar>
                      <span className="text-2xs text-muted-foreground">{a.author}</span>
                    </div>
                    <div className="flex items-center gap-3 text-2xs text-muted-foreground">
                      <span>{a.updated}</span>
                      <span className="font-mono">{a.views} views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
