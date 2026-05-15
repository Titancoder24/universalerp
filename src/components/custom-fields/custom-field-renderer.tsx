'use client';

import * as React from 'react';
import type { CustomFieldDefinition } from '@/lib/custom-fields/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CustomFieldRendererProps {
  definition: CustomFieldDefinition;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

export function CustomFieldRenderer({ definition, value, onChange, error, disabled }: CustomFieldRendererProps) {
  const id = `cf-${definition.key}`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {definition.label}
        {definition.required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>

      {definition.type === 'text' && (
        <Input id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
      )}

      {definition.type === 'long_text' && (
        <Textarea id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={3} disabled={disabled} />
      )}

      {definition.type === 'rich_text' && (
        <Textarea id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={5} disabled={disabled} />
      )}

      {(definition.type === 'number' || definition.type === 'currency' || definition.type === 'percent') && (
        <Input
          id={id}
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          step={definition.type === 'percent' ? '0.01' : '1'}
        />
      )}

      {definition.type === 'date' && (
        <DatePicker
          value={value ? new Date(value) : undefined}
          onChange={(d) => onChange(d?.toISOString().split('T')[0] ?? null)}
          disabled={disabled}
        />
      )}

      {definition.type === 'datetime' && (
        <Input
          id={id}
          type="datetime-local"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      )}

      {definition.type === 'boolean' && (
        <Switch checked={!!value} onCheckedChange={onChange} disabled={disabled} />
      )}

      {definition.type === 'select' && (
        <Select value={value ?? ''} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger id={id}>
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {(definition.options ?? []).map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {definition.type === 'multi_select' && (
        <div className="flex flex-wrap gap-1.5">
          {(value ?? []).map((v: string) => {
            const opt = definition.options?.find((o) => o.value === v);
            return (
              <Badge key={v} variant="soft" className="gap-1">
                {opt?.label ?? v}
                <button
                  type="button"
                  onClick={() => onChange((value ?? []).filter((x: string) => x !== v))}
                  disabled={disabled}
                >
                  <X className="size-2.5" />
                </button>
              </Badge>
            );
          })}
          <Select
            value=""
            onValueChange={(v) => {
              if (!(value ?? []).includes(v)) {
                onChange([...(value ?? []), v]);
              }
            }}
            disabled={disabled}
          >
            <SelectTrigger className="h-7 w-32 text-xs">
              <SelectValue placeholder="Add…" />
            </SelectTrigger>
            <SelectContent>
              {(definition.options ?? [])
                .filter((o) => !(value ?? []).includes(o.value))
                .map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {definition.type === 'tag' && (
        <div className="flex flex-wrap gap-1.5">
          {(value ?? []).map((t: string, i: number) => (
            <Badge key={i} variant="outline" className="gap-1">
              {t}
              <button
                type="button"
                onClick={() => onChange((value ?? []).filter((_: string, idx: number) => idx !== i))}
                disabled={disabled}
              >
                <X className="size-2.5" />
              </button>
            </Badge>
          ))}
          <Input
            placeholder="Add tag and press Enter"
            className="h-7 w-32 text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const newTag = (e.currentTarget as HTMLInputElement).value.trim();
                if (newTag) {
                  onChange([...(value ?? []), newTag]);
                  (e.currentTarget as HTMLInputElement).value = '';
                }
              }
            }}
            disabled={disabled}
          />
        </div>
      )}

      {(definition.type === 'url' || definition.type === 'email' || definition.type === 'phone') && (
        <Input
          id={id}
          type={definition.type === 'email' ? 'email' : definition.type === 'phone' ? 'tel' : 'url'}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      )}

      {definition.description && !error && (
        <p className="text-xs text-muted-foreground">{definition.description}</p>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
