'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Bell,
  ChevronDown,
  Command as CommandIcon,
  HelpCircle,
  LogOut,
  MessageSquare,
  Menu,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  User as UserIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Kbd } from '@/components/ui/kbd';
import { useTenant } from '@/components/providers/tenant-provider';
import { CommandPalette } from '@/components/app-shell/command-palette';
import { initials } from '@/lib/utils';

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, tenant } = useTenant();
  const { theme, setTheme } = useTheme();
  const [paletteOpen, setPaletteOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Button variant="ghost" size="icon-sm" onClick={onMenuClick} className="lg:hidden">
        <Menu className="size-4" />
      </Button>

      {/* Command palette trigger */}
      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        className="group flex h-9 w-full max-w-sm items-center gap-2 rounded-lg border border-input bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <Search className="size-4" />
        <span className="hidden flex-1 text-left sm:inline">
          Search anything, navigate, run actions…
        </span>
        <span className="hidden sm:inline">
          <Kbd>⌘K</Kbd>
        </span>
      </button>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      <div className="ml-auto flex items-center gap-1">
        <Button asChild variant="ghost" size="icon-sm" title="New record">
          <Link href="#"><Plus className="size-4" /></Link>
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        <Button asChild variant="ghost" size="icon-sm" title="Chat">
          <Link href="/app/chat">
            <MessageSquare className="size-4" />
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" title="Notifications" className="relative">
              <Bell className="size-4" />
              <span className="absolute right-1 top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-destructive text-2xs font-medium text-destructive-foreground">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[1, 2, 3].map((i) => (
              <DropdownMenuItem key={i} className="flex flex-col items-start gap-0.5">
                <span className="text-sm">New invoice INV-{1000 + i} paid</span>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/app/inbox" className="text-center text-xs">View all</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-2 h-9 gap-2 px-2">
              <Avatar size="sm">
                {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user.full_name ?? ''} />}
                <AvatarFallback>{initials(user?.full_name ?? user?.email)}</AvatarFallback>
              </Avatar>
              <ChevronDown className="size-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span className="text-sm font-medium">{user?.full_name ?? 'User'}</span>
              <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push('/app/profile')}>
              <UserIcon className="size-4" /> Profile <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push('/app/settings')}>
              <Settings className="size-4" /> Settings <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push('/help')}>
              <HelpCircle className="size-4" /> Help & docs
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push('/logout')} className="text-destructive">
              <LogOut className="size-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
