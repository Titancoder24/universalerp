import Link from 'next/link';
import { ArrowLeft, Boxes } from 'lucide-react';
import { ForgotPasswordForm } from './forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Boxes className="size-5" />
          </div>
          <span className="font-display text-lg font-semibold">Universal ERP</span>
        </Link>

        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Forgot your password?</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Enter your email and we'll send you a link to reset it.
          </p>
        </div>

        <ForgotPasswordForm />

        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
