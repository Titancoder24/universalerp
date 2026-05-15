import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Lora } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/toast';
import './globals.css';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans-default',
  display: 'swap',
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-default',
  display: 'swap',
});

const fontSerif = Lora({
  subsets: ['latin'],
  variable: '--font-serif-default',
  display: 'swap',
});

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Universal ERP';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: APP_NAME,
    template: `%s · ${APP_NAME}`,
  },
  description:
    'A complete business management platform: CRM, accounting, HR, inventory, manufacturing, and more — in one app.',
  applicationName: APP_NAME,
  authors: [{ name: 'Universal ERP' }],
  formatDetection: { telephone: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable} ${fontSerif.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
