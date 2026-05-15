import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Code2,
  HelpCircle,
  Lightbulb,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Sparkles,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const categories = [
  { icon: Lightbulb, name: 'Getting Started', count: 24, color: 'bg-primary/10 text-primary' },
  { icon: BookOpen, name: 'Modules Guide', count: 142, color: 'bg-info/10 text-info' },
  { icon: Code2, name: 'API & Webhooks', count: 38, color: 'bg-success/10 text-success' },
  { icon: Sparkles, name: 'AI Features', count: 18, color: 'bg-purple-500/10 text-purple-500' },
  { icon: Video, name: 'Video Tutorials', count: 56, color: 'bg-warning/10 text-warning' },
  { icon: HelpCircle, name: 'Troubleshooting', count: 47, color: 'bg-destructive/10 text-destructive' },
];

const popularArticles = [
  { title: 'How to invite your first team members', category: 'Getting Started', views: '12.4K' },
  { title: 'Setting up your chart of accounts', category: 'Accounting', views: '8.2K' },
  { title: 'Customizing your theme and brand', category: 'Settings', views: '6.8K' },
  { title: 'Creating your first invoice', category: 'Sales', views: '14.1K' },
  { title: 'Configuring OpenRouter for AI features', category: 'AI', views: '4.2K' },
  { title: 'Setting up multi-warehouse inventory', category: 'Inventory', views: '5.6K' },
];

const supportChannels = [
  { icon: MessageSquare, name: 'Live Chat', description: 'Reply within 5 min, 9am-9pm UTC', cta: 'Start chat' },
  { icon: Mail, name: 'Email Support', description: 'support@universalerp.app · 24hr response', cta: 'Send email' },
  { icon: Phone, name: 'Schedule Call', description: 'For Enterprise customers', cta: 'Book call' },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="size-5" />
            </div>
            <span className="font-display text-lg font-semibold">Universal ERP</span>
            <span className="ml-2 text-sm text-muted-foreground">Help Center</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/app">Back to app</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16">
        <div className="container text-center">
          <h1 className="font-display text-4xl font-semibold tracking-tight">How can we help?</h1>
          <p className="mt-3 text-muted-foreground">Browse guides, watch tutorials, or get in touch.</p>

          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                placeholder="Search for guides, tutorials, FAQs…"
                className="h-14 pl-12 text-base shadow-lg"
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-muted-foreground">Popular:</span>
              {['invoicing', 'inventory setup', 'permissions', 'integrations'].map((t) => (
                <button key={t} className="rounded-full border border-border bg-card px-2.5 py-1 hover:bg-muted">
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-12">
        <h2 className="mb-6 font-display text-2xl font-semibold">Browse by category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Card key={cat.name} className="group cursor-pointer transition-all hover:shadow-md">
              <CardContent className="p-5">
                <div className={`mb-3 grid h-10 w-10 place-items-center rounded-lg ${cat.color}`}>
                  <cat.icon className="size-5" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold group-hover:text-primary">{cat.name}</h3>
                  <Badge variant="outline" className="text-2xs">{cat.count}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Articles and tutorials covering {cat.name.toLowerCase()}.
                </p>
                <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                  Explore <ArrowRight className="size-3.5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular articles */}
      <section className="container py-8">
        <h2 className="mb-6 font-display text-2xl font-semibold">Popular articles</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {popularArticles.map((a, i) => (
                <Link key={i} href="#" className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-sm font-medium">{a.title}</div>
                      <div className="text-xs text-muted-foreground">{a.category} · {a.views} views</div>
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Support channels */}
      <section className="container py-12">
        <h2 className="mb-6 font-display text-2xl font-semibold">Still need help?</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {supportChannels.map((c) => (
            <Card key={c.name}>
              <CardContent className="p-6">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <c.icon className="size-6" />
                </div>
                <h3 className="mt-4 font-semibold">{c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                <Button className="mt-4" variant="outline">
                  {c.cta} <ArrowRight className="size-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
