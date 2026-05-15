import Link from 'next/link';
import { Boxes } from 'lucide-react';
import { PortalLoginForm } from './portal-login-form';

export default function PortalLoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center px-12 bg-gradient-to-br from-primary/10 via-card to-card relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-30" />
        <div className="relative z-10">
          <Link href="#" className="flex items-center gap-2 mb-12">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Boxes className="size-6" />
            </div>
            <span className="font-display text-xl font-semibold">Acme Corp</span>
          </Link>
          <h2 className="font-display text-3xl font-semibold tracking-tight">Welcome to your portal</h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            View invoices, sign quotes, track orders, and message your account team — all in one place.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link href="#" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Boxes className="size-5" />
              </div>
              <span className="font-display text-lg font-semibold">Acme Corp</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-2xl font-semibold tracking-tight">Sign in to the portal</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Use the magic link sent by your account manager, or sign in below.
            </p>
          </div>

          <PortalLoginForm />

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Need help? Contact us at{' '}
            <a href="mailto:support@acme.com" className="text-primary hover:underline">
              support@acme.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
