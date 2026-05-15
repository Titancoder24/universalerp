import Link from 'next/link';
import {
  Bell,
  Boxes,
  Calendar,
  FileText,
  Folder,
  HelpCircle,
  Home,
  MessageSquare,
  Receipt,
  ShoppingBag,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { initials } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/portal', icon: Home },
  { name: 'Invoices', href: '/portal/invoices', icon: Receipt },
  { name: 'Quotes', href: '/portal/quotes', icon: FileText },
  { name: 'Orders', href: '/portal/orders', icon: ShoppingBag },
  { name: 'Projects', href: '/portal/projects', icon: Calendar },
  { name: 'Documents', href: '/portal/documents', icon: Folder },
  { name: 'Support', href: '/portal/support', icon: HelpCircle },
  { name: 'Messages', href: '/portal/messages', icon: MessageSquare },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden w-64 flex-col border-r border-border bg-sidebar lg:flex">
        <Link href="/portal" className="flex items-center gap-2 px-4 py-4">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Boxes className="size-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">Acme Corp</div>
            <div className="text-2xs text-muted-foreground">Customer Portal</div>
          </div>
        </Link>

        <nav className="flex-1 space-y-px px-2 py-2">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href as any} className="sidebar-item">
              <item.icon className="size-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback>{initials('John Buyer')}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">John Buyer</div>
              <div className="truncate text-2xs text-muted-foreground">john@bigcorp.com</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
          <div className="lg:hidden flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="size-4" />
            </div>
            <span className="text-sm font-semibold">Acme Portal</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" title="Notifications">
              <Bell className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" title="Profile">
              <User className="size-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
