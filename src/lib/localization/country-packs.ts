/**
 * Country packs - jurisdiction-specific data for accounting, payroll, and tax.
 *
 * Each pack ships sensible defaults for the chart of accounts, tax codes,
 * payroll rules, and statutory filing schedules. Tenants pick a country pack
 * at onboarding; the pack pre-seeds the relevant configuration.
 */

export interface TaxCode {
  code: string;
  name: string;
  rate: number;
  jurisdiction: string;
  category?: string;
}

export interface PayrollComponent {
  code: string;
  name: string;
  type: 'earning' | 'deduction' | 'statutory' | 'employer_contribution';
  calculationType: 'fixed' | 'percentage' | 'formula';
  defaultValue?: number;
  formula?: string;
  taxable?: boolean;
}

export interface CountryPack {
  code: string;
  name: string;
  currency: string;
  language: string;
  fiscalYearStartMonth: number;
  dateFormat: string;
  decimalSeparator: '.' | ',';
  thousandsSeparator: ',' | '.' | ' ' | '\'';
  taxCodes: TaxCode[];
  payrollComponents: PayrollComponent[];
  chartOfAccountsTemplate: string;
  statutoryFilings: Array<{ name: string; frequency: string; description: string }>;
}

export const countryPacks: Record<string, CountryPack> = {
  US: {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    language: 'en',
    fiscalYearStartMonth: 1,
    dateFormat: 'MM/DD/YYYY',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    taxCodes: [
      { code: 'NO_TAX', name: 'No Tax', rate: 0, jurisdiction: 'US' },
      { code: 'CA_SALES', name: 'California Sales Tax', rate: 7.25, jurisdiction: 'US-CA' },
      { code: 'NY_SALES', name: 'New York Sales Tax', rate: 8.875, jurisdiction: 'US-NY' },
      { code: 'TX_SALES', name: 'Texas Sales Tax', rate: 6.25, jurisdiction: 'US-TX' },
    ],
    payrollComponents: [
      { code: 'BASE', name: 'Base Salary', type: 'earning', calculationType: 'fixed', taxable: true },
      { code: 'OT', name: 'Overtime', type: 'earning', calculationType: 'fixed', taxable: true },
      { code: 'BONUS', name: 'Bonus', type: 'earning', calculationType: 'fixed', taxable: true },
      { code: 'FED_TAX', name: 'Federal Income Tax', type: 'statutory', calculationType: 'formula', formula: 'progressive_us_federal' },
      { code: 'FICA_SS', name: 'Social Security', type: 'statutory', calculationType: 'percentage', defaultValue: 6.2 },
      { code: 'FICA_MED', name: 'Medicare', type: 'statutory', calculationType: 'percentage', defaultValue: 1.45 },
      { code: 'STATE_TAX', name: 'State Income Tax', type: 'statutory', calculationType: 'formula', formula: 'state_progressive' },
      { code: '401K', name: '401(k) Contribution', type: 'deduction', calculationType: 'percentage' },
    ],
    chartOfAccountsTemplate: 'us-gaap',
    statutoryFilings: [
      { name: 'Form 941 (Quarterly Federal Tax Return)', frequency: 'quarterly', description: 'IRS quarterly payroll tax filing' },
      { name: 'Form 940 (FUTA Annual)', frequency: 'annual', description: 'Federal unemployment tax' },
      { name: 'W-2 (Annual Wage Statement)', frequency: 'annual', description: 'Employee wage statements' },
      { name: '1099-NEC', frequency: 'annual', description: 'Nonemployee compensation' },
      { name: 'State Sales Tax Return', frequency: 'monthly', description: 'State sales tax (varies by state)' },
    ],
  },

  UK: {
    code: 'UK',
    name: 'United Kingdom',
    currency: 'GBP',
    language: 'en',
    fiscalYearStartMonth: 4,
    dateFormat: 'DD/MM/YYYY',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    taxCodes: [
      { code: 'VAT_STD', name: 'Standard VAT', rate: 20, jurisdiction: 'UK' },
      { code: 'VAT_REDUCED', name: 'Reduced VAT', rate: 5, jurisdiction: 'UK' },
      { code: 'VAT_ZERO', name: 'Zero VAT', rate: 0, jurisdiction: 'UK' },
      { code: 'VAT_EXEMPT', name: 'VAT Exempt', rate: 0, jurisdiction: 'UK' },
    ],
    payrollComponents: [
      { code: 'BASE', name: 'Base Salary', type: 'earning', calculationType: 'fixed', taxable: true },
      { code: 'OT', name: 'Overtime', type: 'earning', calculationType: 'fixed', taxable: true },
      { code: 'PAYE', name: 'PAYE Income Tax', type: 'statutory', calculationType: 'formula', formula: 'uk_paye' },
      { code: 'NI_EE', name: 'National Insurance (Employee)', type: 'statutory', calculationType: 'formula', formula: 'uk_ni_employee' },
      { code: 'NI_ER', name: 'National Insurance (Employer)', type: 'employer_contribution', calculationType: 'formula', formula: 'uk_ni_employer' },
      { code: 'PENSION', name: 'Workplace Pension', type: 'deduction', calculationType: 'percentage', defaultValue: 5 },
      { code: 'STUDENT_LOAN', name: 'Student Loan Deduction', type: 'statutory', calculationType: 'formula', formula: 'uk_student_loan' },
    ],
    chartOfAccountsTemplate: 'uk-frs',
    statutoryFilings: [
      { name: 'RTI Submission (FPS)', frequency: 'monthly', description: 'Real Time Information to HMRC' },
      { name: 'EPS (Employer Payment Summary)', frequency: 'monthly', description: 'Employer payment summary' },
      { name: 'P60 (Annual Statement)', frequency: 'annual', description: 'Employee end-of-year certificate' },
      { name: 'VAT Return (MTD)', frequency: 'quarterly', description: 'Making Tax Digital VAT submission' },
      { name: 'Corporation Tax (CT600)', frequency: 'annual', description: 'Corporate income tax' },
    ],
  },

  IN: {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    language: 'en',
    fiscalYearStartMonth: 4,
    dateFormat: 'DD/MM/YYYY',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    taxCodes: [
      { code: 'GST_28', name: 'GST 28%', rate: 28, jurisdiction: 'IN', category: 'CGST+SGST/IGST' },
      { code: 'GST_18', name: 'GST 18%', rate: 18, jurisdiction: 'IN', category: 'CGST+SGST/IGST' },
      { code: 'GST_12', name: 'GST 12%', rate: 12, jurisdiction: 'IN', category: 'CGST+SGST/IGST' },
      { code: 'GST_5', name: 'GST 5%', rate: 5, jurisdiction: 'IN', category: 'CGST+SGST/IGST' },
      { code: 'GST_0', name: 'GST 0% (Nil Rated)', rate: 0, jurisdiction: 'IN' },
      { code: 'GST_EX', name: 'GST Exempt', rate: 0, jurisdiction: 'IN' },
      { code: 'TDS_10', name: 'TDS 10%', rate: 10, jurisdiction: 'IN', category: 'Withholding' },
      { code: 'TDS_2', name: 'TDS 2%', rate: 2, jurisdiction: 'IN', category: 'Withholding' },
    ],
    payrollComponents: [
      { code: 'BASIC', name: 'Basic Pay', type: 'earning', calculationType: 'fixed', taxable: true },
      { code: 'HRA', name: 'House Rent Allowance', type: 'earning', calculationType: 'percentage', defaultValue: 40 },
      { code: 'SPECIAL', name: 'Special Allowance', type: 'earning', calculationType: 'fixed', taxable: true },
      { code: 'CONVEYANCE', name: 'Conveyance Allowance', type: 'earning', calculationType: 'fixed', taxable: true },
      { code: 'LTA', name: 'Leave Travel Allowance', type: 'earning', calculationType: 'fixed', taxable: false },
      { code: 'TDS', name: 'TDS (Income Tax)', type: 'statutory', calculationType: 'formula', formula: 'india_tds' },
      { code: 'EPF_EE', name: 'EPF Employee (12%)', type: 'statutory', calculationType: 'percentage', defaultValue: 12 },
      { code: 'EPF_ER', name: 'EPF Employer (12%)', type: 'employer_contribution', calculationType: 'percentage', defaultValue: 12 },
      { code: 'ESI_EE', name: 'ESI Employee (0.75%)', type: 'statutory', calculationType: 'percentage', defaultValue: 0.75 },
      { code: 'ESI_ER', name: 'ESI Employer (3.25%)', type: 'employer_contribution', calculationType: 'percentage', defaultValue: 3.25 },
      { code: 'PT', name: 'Professional Tax', type: 'statutory', calculationType: 'formula', formula: 'india_pt' },
    ],
    chartOfAccountsTemplate: 'india-ind-as',
    statutoryFilings: [
      { name: 'GSTR-1 (Outward Supplies)', frequency: 'monthly', description: 'Monthly outward supply return' },
      { name: 'GSTR-3B (Summary)', frequency: 'monthly', description: 'Summary return with tax payment' },
      { name: 'GSTR-9 (Annual)', frequency: 'annual', description: 'Annual GST return' },
      { name: 'TDS Quarterly Return (Form 24Q)', frequency: 'quarterly', description: 'Quarterly TDS on salaries' },
      { name: 'PF Monthly Return', frequency: 'monthly', description: 'Provident Fund return' },
      { name: 'ESI Return', frequency: 'monthly', description: 'Employee State Insurance' },
    ],
  },

  AE: {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    language: 'en',
    fiscalYearStartMonth: 1,
    dateFormat: 'DD/MM/YYYY',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    taxCodes: [
      { code: 'VAT_5', name: 'VAT 5%', rate: 5, jurisdiction: 'AE' },
      { code: 'VAT_0', name: 'VAT 0% (Zero-rated)', rate: 0, jurisdiction: 'AE' },
      { code: 'VAT_EX', name: 'VAT Exempt', rate: 0, jurisdiction: 'AE' },
    ],
    payrollComponents: [
      { code: 'BASIC', name: 'Basic Salary', type: 'earning', calculationType: 'fixed', taxable: false },
      { code: 'HOUSING', name: 'Housing Allowance', type: 'earning', calculationType: 'fixed', taxable: false },
      { code: 'TRANSPORT', name: 'Transport Allowance', type: 'earning', calculationType: 'fixed', taxable: false },
      { code: 'GRATUITY_ACCRUAL', name: 'End of Service Gratuity (accrual)', type: 'employer_contribution', calculationType: 'formula', formula: 'uae_gratuity' },
    ],
    chartOfAccountsTemplate: 'uae-vat',
    statutoryFilings: [
      { name: 'VAT Return (Form 201)', frequency: 'quarterly', description: 'Quarterly VAT return to FTA' },
      { name: 'WPS Salary Transfer', frequency: 'monthly', description: 'Wage Protection System payroll submission' },
      { name: 'Corporate Tax Return', frequency: 'annual', description: 'New federal corporate tax (effective 2023)' },
    ],
  },

  DE: {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    language: 'de',
    fiscalYearStartMonth: 1,
    dateFormat: 'DD.MM.YYYY',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    taxCodes: [
      { code: 'VAT_19', name: 'Mehrwertsteuer 19%', rate: 19, jurisdiction: 'DE' },
      { code: 'VAT_7', name: 'Mehrwertsteuer 7% (reduziert)', rate: 7, jurisdiction: 'DE' },
      { code: 'VAT_0', name: 'Steuerfrei', rate: 0, jurisdiction: 'DE' },
    ],
    payrollComponents: [
      { code: 'BRUTTO', name: 'Bruttogehalt', type: 'earning', calculationType: 'fixed', taxable: true },
      { code: 'LOHNST', name: 'Lohnsteuer', type: 'statutory', calculationType: 'formula', formula: 'germany_lohnsteuer' },
      { code: 'SOLI', name: 'Solidaritätszuschlag', type: 'statutory', calculationType: 'percentage', defaultValue: 5.5 },
      { code: 'KIRCH', name: 'Kirchensteuer', type: 'statutory', calculationType: 'percentage', defaultValue: 9 },
      { code: 'RV_EE', name: 'Rentenversicherung (AN)', type: 'statutory', calculationType: 'percentage', defaultValue: 9.3 },
      { code: 'AV_EE', name: 'Arbeitslosenversicherung (AN)', type: 'statutory', calculationType: 'percentage', defaultValue: 1.3 },
      { code: 'KV_EE', name: 'Krankenversicherung (AN)', type: 'statutory', calculationType: 'percentage', defaultValue: 7.3 },
      { code: 'PV_EE', name: 'Pflegeversicherung (AN)', type: 'statutory', calculationType: 'percentage', defaultValue: 1.525 },
    ],
    chartOfAccountsTemplate: 'germany-skr03',
    statutoryFilings: [
      { name: 'Umsatzsteuer-Voranmeldung', frequency: 'monthly', description: 'Monthly VAT advance return' },
      { name: 'Lohnsteueranmeldung', frequency: 'monthly', description: 'Wage tax declaration' },
      { name: 'Gewerbesteuererklärung', frequency: 'annual', description: 'Trade tax declaration' },
      { name: 'Körperschaftsteuererklärung', frequency: 'annual', description: 'Corporate income tax' },
    ],
  },
};

export const supportedCountries = Object.keys(countryPacks);

export function getCountryPack(code: string): CountryPack | undefined {
  return countryPacks[code];
}
