/**
 * PII redaction before AI payloads leave the platform.
 *
 * Strips emails, phone numbers, SSN, credit card numbers, bank IBANs,
 * IP addresses, and a few other patterns. The original payload never
 * leaves the platform; AI responses are de-redacted on return.
 */

interface RedactionRule {
  name: string;
  pattern: RegExp;
  replacement: string;
}

const RULES: RedactionRule[] = [
  // Emails
  {
    name: 'EMAIL',
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    replacement: '[EMAIL]',
  },
  // Phone numbers (international)
  {
    name: 'PHONE',
    pattern: /\+?\d{1,4}?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
    replacement: '[PHONE]',
  },
  // US Social Security Number (XXX-XX-XXXX)
  {
    name: 'SSN',
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    replacement: '[SSN]',
  },
  // Credit card numbers
  {
    name: 'CREDIT_CARD',
    pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    replacement: '[CARD]',
  },
  // IBAN (very rough)
  {
    name: 'IBAN',
    pattern: /\b[A-Z]{2}\d{2}[A-Z0-9]{4,32}\b/g,
    replacement: '[IBAN]',
  },
  // IPv4 addresses
  {
    name: 'IPV4',
    pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    replacement: '[IP]',
  },
  // Aadhaar (India - 12 digits)
  {
    name: 'AADHAAR',
    pattern: /\b\d{4}\s?\d{4}\s?\d{4}\b/g,
    replacement: '[AADHAAR]',
  },
  // PAN (India - 5 letters, 4 digits, 1 letter)
  {
    name: 'PAN',
    pattern: /\b[A-Z]{5}\d{4}[A-Z]\b/g,
    replacement: '[PAN]',
  },
];

export function redactPII(text: string): string {
  if (!text) return text;
  let result = text;
  for (const rule of RULES) {
    result = result.replace(rule.pattern, rule.replacement);
  }
  return result;
}

export function findPII(text: string): Array<{ type: string; match: string }> {
  if (!text) return [];
  const found: Array<{ type: string; match: string }> = [];
  for (const rule of RULES) {
    const matches = text.matchAll(rule.pattern);
    for (const m of matches) {
      found.push({ type: rule.name, match: m[0] });
    }
  }
  return found;
}
