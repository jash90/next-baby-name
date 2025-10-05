import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { BottomNav } from '@/components/bottom-nav';
import { Toaster } from '@/components/ui/sonner';
import { AppInitializer } from '@/components/app-initializer';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemeColor } from '@/components/theme-color';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Brajanusz - Odkryj Idealne Imię',
  description: 'Odkryj piękne imiona dla dzieci wraz z ich znaczeniami, pochodzeniem i trendami',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Brajanusz',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Brajanusz',
    title: 'Brajanusz - Odkryj Idealne Imię',
    description: 'Odkryj piękne imiona dla dzieci wraz z ich znaczeniami, pochodzeniem i trendami',
  },
  twitter: {
    card: 'summary',
    title: 'Brajanusz - Odkryj Idealne Imię',
    description: 'Odkryj piękne imiona dla dzieci wraz z ich znaczeniami, pochodzeniem i trendami',
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} h-full overflow-auto`}>
        <Providers>
          <ThemeColor />
          <ThemeToggle />
          <AppInitializer>
            <div className="relative min-h-full pb-16">
              <main className="relative">
                {children}
              </main>
            </div>
            <BottomNav />
            <Toaster />
          </AppInitializer>
        </Providers>
      </body>
    </html>
  );
}
