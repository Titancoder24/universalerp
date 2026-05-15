/**
 * Branded PDF-style invoice rendering.
 *
 * This produces an HTML layout that's print-perfect. The "Download PDF" button
 * uses the browser's print-to-PDF feature, or a server-side renderer like
 * Puppeteer if configured.
 */

import { formatCurrency, formatDate } from '@/lib/utils';

interface InvoicePDFProps {
  tenant: {
    name: string;
    legal_name?: string | null;
    logo_url?: string | null;
    primary_address?: any;
    tax_id?: string | null;
    email?: string | null;
    phone?: string | null;
  };
  customer: {
    display_name: string;
    legal_name?: string | null;
    primary_address?: any;
    tax_id?: string | null;
  };
  invoice: {
    number: string;
    issue_date: string;
    due_date?: string | null;
    currency: string;
    subtotal_cents: number;
    discount_cents: number;
    tax_cents: number;
    shipping_cents: number;
    total_cents: number;
    notes?: string | null;
    payment_terms?: string | null;
    bank_details?: string | null;
  };
  lines: Array<{
    description: string;
    quantity: number;
    unit?: string;
    unit_price_cents: number;
    tax_rate_pct?: number;
    total_cents: number;
  }>;
}

export function InvoicePDF({ tenant, customer, invoice, lines }: InvoicePDFProps) {
  return (
    <div className="bg-white text-black mx-auto" style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          {tenant.logo_url ? (
            <img src={tenant.logo_url} alt={tenant.name} className="h-12 mb-3" />
          ) : (
            <div className="text-2xl font-bold mb-3" style={{ color: 'hsl(var(--primary))' }}>{tenant.name}</div>
          )}
          {tenant.legal_name && <div className="text-sm text-gray-600">{tenant.legal_name}</div>}
          {tenant.primary_address && (
            <div className="text-xs text-gray-600 mt-1 whitespace-pre-line">
              {[tenant.primary_address.line1, tenant.primary_address.line2, tenant.primary_address.city, tenant.primary_address.state, tenant.primary_address.postal_code, tenant.primary_address.country].filter(Boolean).join(', ')}
            </div>
          )}
          {tenant.tax_id && <div className="text-xs text-gray-600">Tax ID: {tenant.tax_id}</div>}
        </div>

        <div className="text-right">
          <div className="text-4xl font-light tracking-wide mb-3">INVOICE</div>
          <table className="text-sm">
            <tbody>
              <tr>
                <td className="text-gray-600 pr-4">Number</td>
                <td className="font-mono font-medium">{invoice.number}</td>
              </tr>
              <tr>
                <td className="text-gray-600 pr-4">Issued</td>
                <td>{formatDate(invoice.issue_date)}</td>
              </tr>
              {invoice.due_date && (
                <tr>
                  <td className="text-gray-600 pr-4">Due</td>
                  <td>{formatDate(invoice.due_date)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill to */}
      <div className="mb-8">
        <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Bill To</div>
        <div className="font-medium text-base">{customer.display_name}</div>
        {customer.legal_name && customer.legal_name !== customer.display_name && (
          <div className="text-sm text-gray-700">{customer.legal_name}</div>
        )}
        {customer.primary_address && (
          <div className="text-sm text-gray-600 whitespace-pre-line">
            {[customer.primary_address.line1, customer.primary_address.city, customer.primary_address.state, customer.primary_address.postal_code, customer.primary_address.country].filter(Boolean).join(', ')}
          </div>
        )}
        {customer.tax_id && <div className="text-sm text-gray-600">Tax ID: {customer.tax_id}</div>}
      </div>

      {/* Line items */}
      <table className="w-full text-sm mb-8">
        <thead>
          <tr style={{ borderBottom: '2px solid hsl(var(--primary))' }}>
            <th className="text-left py-2 pr-2 text-xs uppercase tracking-wider text-gray-500">Description</th>
            <th className="text-right py-2 px-2 text-xs uppercase tracking-wider text-gray-500">Qty</th>
            <th className="text-right py-2 px-2 text-xs uppercase tracking-wider text-gray-500">Unit Price</th>
            <th className="text-right py-2 px-2 text-xs uppercase tracking-wider text-gray-500">Tax</th>
            <th className="text-right py-2 pl-2 text-xs uppercase tracking-wider text-gray-500">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, i) => (
            <tr key={i} className="border-b border-gray-200">
              <td className="py-3 pr-2">{line.description}</td>
              <td className="py-3 px-2 text-right">{line.quantity.toFixed(2)} {line.unit ?? ''}</td>
              <td className="py-3 px-2 text-right font-mono">{formatCurrency(line.unit_price_cents / 100, invoice.currency)}</td>
              <td className="py-3 px-2 text-right">{(line.tax_rate_pct ?? 0).toFixed(1)}%</td>
              <td className="py-3 pl-2 text-right font-mono">{formatCurrency(line.total_cents / 100, invoice.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <table className="text-sm" style={{ width: '300px' }}>
          <tbody>
            <tr>
              <td className="py-1 text-gray-600">Subtotal</td>
              <td className="py-1 text-right font-mono">{formatCurrency(invoice.subtotal_cents / 100, invoice.currency)}</td>
            </tr>
            {invoice.discount_cents > 0 && (
              <tr>
                <td className="py-1 text-gray-600">Discount</td>
                <td className="py-1 text-right font-mono text-red-700">-{formatCurrency(invoice.discount_cents / 100, invoice.currency)}</td>
              </tr>
            )}
            <tr>
              <td className="py-1 text-gray-600">Tax</td>
              <td className="py-1 text-right font-mono">{formatCurrency(invoice.tax_cents / 100, invoice.currency)}</td>
            </tr>
            {invoice.shipping_cents > 0 && (
              <tr>
                <td className="py-1 text-gray-600">Shipping</td>
                <td className="py-1 text-right font-mono">{formatCurrency(invoice.shipping_cents / 100, invoice.currency)}</td>
              </tr>
            )}
            <tr className="border-t-2 border-gray-300">
              <td className="py-2 font-semibold">Total Due</td>
              <td className="py-2 text-right font-mono text-lg font-bold">
                {formatCurrency(invoice.total_cents / 100, invoice.currency)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Notes & terms */}
      <div className="space-y-4 text-xs text-gray-700">
        {invoice.notes && (
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Notes</div>
            <div className="whitespace-pre-line">{invoice.notes}</div>
          </div>
        )}
        {invoice.payment_terms && (
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Payment Terms</div>
            <div className="whitespace-pre-line">{invoice.payment_terms}</div>
          </div>
        )}
        {invoice.bank_details && (
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Payment Details</div>
            <div className="whitespace-pre-line font-mono">{invoice.bank_details}</div>
          </div>
        )}
      </div>

      <div className="mt-12 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
        Thank you for your business · {tenant.name}
        {tenant.email && ` · ${tenant.email}`}
      </div>
    </div>
  );
}
