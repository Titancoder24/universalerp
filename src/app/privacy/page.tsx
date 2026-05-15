import Link from 'next/link';
import { Boxes } from 'lucide-react';

export default function PrivacyPage() {
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
        <h1 className="font-display text-4xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-muted-foreground">Effective: January 1, 2026</p>

        <div className="prose prose-sm mt-8 space-y-6 text-foreground">
          <section>
            <h2 className="font-display text-xl font-semibold">Our promise</h2>
            <p>
              We respect your privacy. We collect only what's necessary to operate the Service, we never sell
              your data, and we let you export or delete it at any time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Data we collect</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Account info (name, email, phone, profile photo)</li>
              <li>Business data you enter (customers, invoices, employees, etc.)</li>
              <li>Usage telemetry (pages visited, features used) for product improvement</li>
              <li>Device info (browser, OS) for security and debugging</li>
              <li>IP address (for fraud detection and audit logs)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">How we use data</h2>
            <p>To provide the Service, secure your account, communicate updates, and improve the product. We
              never sell or share your business data. Aggregated, anonymized usage statistics may inform
              product decisions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Storage and security</h2>
            <p>
              Data is encrypted at rest (AES-256) and in transit (TLS 1.3). PostgreSQL Row-Level Security
              cryptographically isolates each tenant. We store data in the region you select (US, EU, APAC,
              or MENA) and replicate across availability zones.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Third-party processors</h2>
            <p>
              Subprocessors include hosting infrastructure (Supabase/AWS/GCP), email relay (SendGrid),
              optional AI (OpenRouter). Each has a DPA in place. PII is redacted before AI requests.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Your rights</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access your data anytime through the app</li>
              <li>Export all your data in JSON or CSV (GDPR Article 20)</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data (right to be forgotten)</li>
              <li>Restrict or object to specific processing</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Cookies</h2>
            <p>
              We use first-party cookies for authentication and preference storage. We don't use tracking
              cookies for advertising. Third-party analytics is anonymized.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Children's privacy</h2>
            <p>
              The Service isn't directed at children under 13. If we discover we've collected data from a
              child without parental consent, we'll delete it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Contact</h2>
            <p>
              For privacy questions or to exercise your rights, email{' '}
              <a href="mailto:privacy@universalerp.app" className="text-primary hover:underline">
                privacy@universalerp.app
              </a>.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
