import Link from 'next/link';
import { Boxes } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="size-5" />
            </div>
            <span className="font-display font-semibold">Universal ERP</span>
          </Link>
        </div>
      </header>

      <article className="container max-w-3xl py-12">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-muted-foreground">Effective: January 1, 2026</p>

        <div className="prose prose-sm mt-8 space-y-6 text-foreground">
          <section>
            <h2 className="font-display text-xl font-semibold">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Universal ERP (the "Service"), you agree to be bound by these Terms.
              If you don't agree, please don't use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">2. Your Account</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all
              activities under your account. Notify us immediately of any unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">3. Acceptable Use</h2>
            <p>
              You agree not to: (a) violate any laws; (b) infringe intellectual property rights; (c) introduce
              malware or attempt to breach security; (d) use the Service to send spam or unsolicited messages;
              (e) reverse-engineer the Service except to the extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">4. Your Data</h2>
            <p>
              You own your data. We never sell it. We process it solely to provide the Service. You can export
              all your data at any time in machine-readable format. On account closure, we delete your data
              within 30 days unless legally required to retain it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">5. Subscriptions and Billing</h2>
            <p>
              Paid plans bill monthly or annually in advance. You can cancel anytime; cancellations take
              effect at the end of the current period. No refunds for partial periods unless legally required.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">6. Service Availability</h2>
            <p>
              We strive for 99.9% uptime but make no guarantee. The Service is provided "as is" without
              warranty of any kind. To the maximum extent permitted by law, we're not liable for indirect,
              incidental, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">7. AI Features</h2>
            <p>
              AI-powered features use third-party model providers via OpenRouter. AI outputs may contain
              inaccuracies; always verify before acting on AI advice. PII is redacted from prompts before
              transmission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">8. Changes to These Terms</h2>
            <p>
              We may update these Terms occasionally. Material changes will be notified by email or in-app
              notice 30 days before taking effect.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">9. Contact</h2>
            <p>
              Questions? Email <a href="mailto:legal@universalerp.app" className="text-primary hover:underline">legal@universalerp.app</a>.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
