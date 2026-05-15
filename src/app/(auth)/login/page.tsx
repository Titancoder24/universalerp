import Link from 'next/link';
import { Boxes } from 'lucide-react';
import { LoginForm } from './login-form';

export default function LoginPage() {
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

          <div className="space-y-4">
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              The ERP that replaces ten subscriptions.
            </h2>
            <p className="text-muted-foreground max-w-md">
              CRM, accounting, HR, inventory, manufacturing, projects, chat — and ninety-something more — in one app.
            </p>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Universal ERP.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Boxes className="size-5" />
              </div>
              <span className="font-display text-lg font-semibold">Universal ERP</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to continue to your workspace.
            </p>
          </div>

          <LoginForm />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Start a workspace
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
