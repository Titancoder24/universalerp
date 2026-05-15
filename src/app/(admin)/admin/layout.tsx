import Link from 'next/link';
import {
  Bell,
  Boxes,
  Building2,
  Database,
  Handshake,
  History,
  Layers,
  Palette,
  Shield,
  Sparkles,
  Tag,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { name: 'Platform Overview', href: '/admin', icon: Boxes },
  { name: 'Tenants', href: '/admin/tenants', icon: Building2 },
  { name: 'Plans', href: '/admin/plans', icon: Tag },
  { name: 'Resellers', href: '/admin/resellers', icon: Handshake },
  { name: 'Theme Library', href: '/admin/themes', icon: Palette },
  { name: 'Modules', href: '/admin/modules', icon: Layers },
  { name: 'AI Configuration', href: '/admin/ai', icon: Sparkles },
  { name: 'Security', href: '/admin/security', icon: Shield },
  { name: 'Backups', href: '/admin/backups', icon: Database },
  { name: 'Audit', href: '/admin/audit', icon: History },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex items-center gap-2 px-4 py-4">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-destructive text-destructive-foreground">
            <Shield className="size-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">Platform Admin</div>
            <div className="text-2xs text-muted-foreground">Super Admin Console</div>
          </div>
        </div>

        <nav className="flex-1 space-y-px px-2 py-2">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href as any} className="sidebar-item">
              <item.icon className="size-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <Link href="/app" className="flex items-center gap-2 rounded-md p-2 hover:bg-sidebar-accent transition-colors">
            <Avatar size="sm">
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">Super Admin</div>
              <div className="truncate text-2xs text-muted-foreground">↩ Back to app</div>
            </div>
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
          <Badge variant="destructive" className="gap-1">
            <Shield className="size-3" /> Super Admin Mode
          </Badge>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon-sm"><Bell className="size-4" /></Button>
            <Button variant="ghost" size="icon-sm"><User className="size-4" /></Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
