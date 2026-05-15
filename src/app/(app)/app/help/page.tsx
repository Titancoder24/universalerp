import {
  ArrowRight,
  BookOpen,
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
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function InAppHelpPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Help & Support" description="Find guides, watch tutorials, or contact support" />

      <Card className="bg-gradient-to-br from-primary/5 via-card to-card">
        <CardContent className="p-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-display text-2xl font-semibold mb-3">How can we help?</h2>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                placeholder="Search for guides, tutorials, FAQs…"
                className="h-12 pl-10 text-base shadow-lg"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-muted-foreground">Popular:</span>
              {['invoicing', 'permissions', 'theme studio', 'integrations', 'API keys'].map((t) => (
                <Button key={t} variant="outline" size="xs">{t}</Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: Lightbulb, name: 'Getting Started', count: 24, description: 'Quick tutorials and onboarding guides' },
          { icon: BookOpen, name: 'Module Guides', count: 142, description: 'Detailed walkthroughs for every module' },
          { icon: Code2, name: 'API & Webhooks', count: 38, description: 'Developer docs and reference' },
          { icon: Sparkles, name: 'AI Features', count: 18, description: 'OpenRouter setup and use cases' },
          { icon: Video, name: 'Video Tutorials', count: 56, description: 'Watch and learn' },
          { icon: HelpCircle, name: 'Troubleshooting', count: 47, description: 'Common issues and fixes' },
        ].map((cat) => (
          <Card key={cat.name} className="group cursor-pointer transition-all hover:shadow-md">
            <CardContent className="p-5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary mb-3">
                <cat.icon className="size-5" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold group-hover:text-primary">{cat.name}</h3>
                <Badge variant="outline" className="text-2xs">{cat.count}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
              <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                Explore <ArrowRight className="size-3.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Still need help?</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button variant="outline" className="h-auto flex-col items-start p-4 gap-1">
              <MessageSquare className="size-5 text-primary" />
              <div className="text-sm font-medium">Live Chat</div>
              <div className="text-xs text-muted-foreground">Reply within 5 min</div>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-start p-4 gap-1">
              <Mail className="size-5 text-primary" />
              <div className="text-sm font-medium">Email</div>
              <div className="text-xs text-muted-foreground">24hr response</div>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-start p-4 gap-1">
              <Phone className="size-5 text-primary" />
              <div className="text-sm font-medium">Schedule Call</div>
              <div className="text-xs text-muted-foreground">Enterprise only</div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
