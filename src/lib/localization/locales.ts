/**
 * Supported UI locales.
 *
 * The platform ships with English baseline; additional locales activate as
 * translation files are added.
 */

export interface Locale {
  code: string;
  name: string;
  englishName: string;
  rtl: boolean;
  flag: string;
}

export const locales: Locale[] = [
  { code: 'en', name: 'English', englishName: 'English', rtl: false, flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', englishName: 'English (UK)', rtl: false, flag: '🇬🇧' },
  { code: 'es', name: 'Español', englishName: 'Spanish', rtl: false, flag: '🇪🇸' },
  { code: 'es-MX', name: 'Español (México)', englishName: 'Spanish (Mexico)', rtl: false, flag: '🇲🇽' },
  { code: 'fr', name: 'Français', englishName: 'French', rtl: false, flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', englishName: 'German', rtl: false, flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', englishName: 'Italian', rtl: false, flag: '🇮🇹' },
  { code: 'pt', name: 'Português', englishName: 'Portuguese', rtl: false, flag: '🇵🇹' },
  { code: 'pt-BR', name: 'Português (Brasil)', englishName: 'Portuguese (Brazil)', rtl: false, flag: '🇧🇷' },
  { code: 'nl', name: 'Nederlands', englishName: 'Dutch', rtl: false, flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', englishName: 'Polish', rtl: false, flag: '🇵🇱' },
  { code: 'sv', name: 'Svenska', englishName: 'Swedish', rtl: false, flag: '🇸🇪' },
  { code: 'da', name: 'Dansk', englishName: 'Danish', rtl: false, flag: '🇩🇰' },
  { code: 'fi', name: 'Suomi', englishName: 'Finnish', rtl: false, flag: '🇫🇮' },
  { code: 'no', name: 'Norsk', englishName: 'Norwegian', rtl: false, flag: '🇳🇴' },
  { code: 'ru', name: 'Русский', englishName: 'Russian', rtl: false, flag: '🇷🇺' },
  { code: 'uk', name: 'Українська', englishName: 'Ukrainian', rtl: false, flag: '🇺🇦' },
  { code: 'zh', name: '中文 (简体)', englishName: 'Chinese (Simplified)', rtl: false, flag: '🇨🇳' },
  { code: 'zh-TW', name: '中文 (繁體)', englishName: 'Chinese (Traditional)', rtl: false, flag: '🇹🇼' },
  { code: 'ja', name: '日本語', englishName: 'Japanese', rtl: false, flag: '🇯🇵' },
  { code: 'ko', name: '한국어', englishName: 'Korean', rtl: false, flag: '🇰🇷' },
  { code: 'hi', name: 'हिन्दी', englishName: 'Hindi', rtl: false, flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', englishName: 'Bengali', rtl: false, flag: '🇧🇩' },
  { code: 'ta', name: 'தமிழ்', englishName: 'Tamil', rtl: false, flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', englishName: 'Telugu', rtl: false, flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', englishName: 'Marathi', rtl: false, flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', englishName: 'Gujarati', rtl: false, flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', rtl: false, flag: '🇮🇳' },
  { code: 'ar', name: 'العربية', englishName: 'Arabic', rtl: true, flag: '🇸🇦' },
  { code: 'he', name: 'עברית', englishName: 'Hebrew', rtl: true, flag: '🇮🇱' },
  { code: 'tr', name: 'Türkçe', englishName: 'Turkish', rtl: false, flag: '🇹🇷' },
  { code: 'th', name: 'ไทย', englishName: 'Thai', rtl: false, flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', englishName: 'Vietnamese', rtl: false, flag: '🇻🇳' },
  { code: 'id', name: 'Bahasa Indonesia', englishName: 'Indonesian', rtl: false, flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', englishName: 'Malay', rtl: false, flag: '🇲🇾' },
  { code: 'fil', name: 'Filipino', englishName: 'Filipino', rtl: false, flag: '🇵🇭' },
];

export const defaultLocale = 'en';

export function getLocale(code: string): Locale | undefined {
  return locales.find((l) => l.code === code);
}
