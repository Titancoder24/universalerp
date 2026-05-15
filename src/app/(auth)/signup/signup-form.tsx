'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from '@/components/ui/toast';
import { slug as slugify } from '@/lib/utils';

export function SignupForm() {
  const router = useRouter();
  const [companyName, setCompanyName] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [agree, setAgree] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      setError('Please accept the terms of service to continue.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, company_name: companyName, slug: slugify(companyName) },
        },
      });
      if (signUpError) throw signUpError;

      toast.success('Workspace created', { description: 'Loading your dashboard…' });
      router.push('/welcome');
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? 'Could not create workspace. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="company">Company name</Label>
        <Input
          id="company"
          placeholder="Acme Corp"
          required
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">Your name</Label>
        <Input
          id="name"
          placeholder="Jane Doe"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Work email</Label>
        <Input
          id="email"
          type="email"
          placeholder="jane@acme.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          minLength={8}
          placeholder="Min. 8 characters"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Use 8+ characters with a mix of letters, numbers, and symbols.
        </p>
      </div>

      <label className="flex items-start gap-2 text-sm">
        <Checkbox
          checked={agree}
          onCheckedChange={(v) => setAgree(v === true)}
          className="mt-0.5"
        />
        <span className="text-muted-foreground">
          I agree to the <a href="/terms" className="text-primary hover:underline">terms of service</a> and{' '}
          <a href="/privacy" className="text-primary hover:underline">privacy policy</a>.
        </span>
      </label>

      <Button type="submit" className="w-full" size="lg" disabled={loading || !agree}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        Create workspace
      </Button>
    </form>
  );
}
