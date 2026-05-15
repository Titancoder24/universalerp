'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Calendar,
  FileText,
  KanbanSquare,
  Plus,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '@/components/ui/command';
import { modules, modulesByCode } from '@/lib/modules/registry';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  const go = React.useCallback(
    (path: string) => {
      onOpenChange(false);
      router.push(path);
    },
    [onOpenChange, router],
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search or run a command…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => go('/app/sales/invoices/new')}>
            <Plus className="size-4" />
            Create invoice
            <CommandShortcut>I</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go('/app/sales/quotations/new')}>
            <FileText className="size-4" />
            Create quote
            <CommandShortcut>Q</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go('/app/sales/customers/new')}>
            <Users className="size-4" />
            Add customer
            <CommandShortcut>C</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go('/app/crm/opportunities/new')}>
            <KanbanSquare className="size-4" />
            Add opportunity
            <CommandShortcut>O</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Sparkles className="size-4" />
            Ask AI…
            <CommandShortcut>⌘J</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigate">
          {modules.slice(0, 30).map((m) => (
            <CommandItem
              key={m.code}
              value={`${m.name} ${m.description}`}
              onSelect={() => go(m.path)}
            >
              <m.icon className="size-4" />
              {m.name}
              <ArrowRight className="ml-auto size-3 opacity-50" />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Tools">
          <CommandItem onSelect={() => go('/app/calendar')}>
            <Calendar className="size-4" />
            Calendar
          </CommandItem>
          <CommandItem onSelect={() => go('/app/settings/appearance')}>
            <Settings className="size-4" />
            Theme Studio
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
