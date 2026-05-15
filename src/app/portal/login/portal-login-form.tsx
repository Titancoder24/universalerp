'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export function PortalLoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [magicLinkMode, setMagicLinkMode] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [magicSent, setMagicSent] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (magicLinkMode) {
        setMagicSent(true);
      } else {
        router.push('/portal');
      }
      setLoading(false);
    }, 800);
  };

  if (magicSent) {
    return (
      <Alert variant="success">
        <Mail className="size-4" />
        <AlertDescription>
          Check your inbox at <strong>{email}</strong> for a sign-in link.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          placeholder="you@yourcompany.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {!magicLinkMode && (
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : magicLinkMode ? <Mail className="size-4" /> : <LogIn className="size-4" />}
        {magicLinkMode ? 'Send magic link' : 'Sign in'}
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => setMagicLinkMode((m) => !m)}
      >
        {magicLinkMode ? 'Sign in with password' : 'Sign in with magic link'}
      </Button>
    </form>
  );
}
