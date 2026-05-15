import Link from 'next/link';
import { Boxes, Check } from 'lucide-react';
import { SignupForm } from './signup-form';

const benefits = [
  'All 100+ modules unlocked on day one',
  '25 visual themes - re-skin with one click',
  'Customer and vendor portals included',
  'Self-host or stay on the cloud',
];

export default function SignupPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:flex relative bg-gradient-to-br from-primary/10 via-card to-card overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-30" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Boxes className="size-6" />
            </div>
            <span className="font-display text-xl font-semibold">Universal ERP</span>
          </Link>

          <div className="space-y-6">
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Start a new workspace.
            </h2>
            <p className="text-muted-foreground max-w-md">
              Sign up in two minutes. Your sample data is pre-loaded so you can explore every module immediately.
            </p>
            <ul className="space-y-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-success" /> {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>No credit card required.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-semibold tracking-tight">Create your workspace</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              We'll provision your tenant in a few seconds.
            </p>
          </div>

          <SignupForm />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
