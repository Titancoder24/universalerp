/**
 * ISO 4217 currencies supported across the platform.
 */

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
  flag?: string;
}

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2, flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2, flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2, flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 0, flag: '🇯🇵' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', decimals: 2, flag: '🇨🇳' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimals: 2, flag: '🇮🇳' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', decimals: 2, flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimals: 2, flag: '🇦🇺' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', decimals: 2, flag: '🇳🇿' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', decimals: 2, flag: '🇨🇭' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', decimals: 2, flag: '🇸🇬' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', decimals: 2, flag: '🇭🇰' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', decimals: 2, flag: '🇸🇪' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', decimals: 2, flag: '🇳🇴' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', decimals: 2, flag: '🇩🇰' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', decimals: 2, flag: '🇦🇪' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', decimals: 2, flag: '🇸🇦' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', decimals: 2, flag: '🇪🇬' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', decimals: 2, flag: '🇿🇦' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', decimals: 2, flag: '🇧🇷' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', decimals: 2, flag: '🇲🇽' },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso', decimals: 2, flag: '🇦🇷' },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso', decimals: 0, flag: '🇨🇱' },
  { code: 'COP', symbol: '$', name: 'Colombian Peso', decimals: 0, flag: '🇨🇴' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', decimals: 0, flag: '🇰🇷' },
  { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar', decimals: 2, flag: '🇹🇼' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', decimals: 2, flag: '🇹🇭' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', decimals: 0, flag: '🇮🇩' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', decimals: 2, flag: '🇵🇭' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', decimals: 2, flag: '🇲🇾' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', decimals: 0, flag: '🇻🇳' },
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', decimals: 2, flag: '🇵🇰' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', decimals: 2, flag: '🇧🇩' },
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', decimals: 2, flag: '🇱🇰' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', decimals: 2, flag: '🇹🇷' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', decimals: 2, flag: '🇵🇱' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', decimals: 2, flag: '🇨🇿' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', decimals: 0, flag: '🇭🇺' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu', decimals: 2, flag: '🇷🇴' },
  { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', decimals: 2, flag: '🇧🇬' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', decimals: 2, flag: '🇷🇺' },
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', decimals: 2, flag: '🇺🇦' },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', decimals: 2, flag: '🇮🇱' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', decimals: 2, flag: '🇳🇬' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', decimals: 2, flag: '🇰🇪' },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', decimals: 2, flag: '🇬🇭' },
];

export const currenciesByCode = Object.fromEntries(currencies.map((c) => [c.code, c]));

export function getCurrency(code: string): Currency | undefined {
  return currenciesByCode[code];
}
