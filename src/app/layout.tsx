import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google';

import { MotionProvider } from '@/components/motion/MotionProvider';
import { site } from '@/data/site';
import { baseOpenGraph } from '@/lib/metadata';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  weight: ['500', '600', '700'],
  display: 'swap',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: baseOpenGraph,
  twitter: { card: 'summary_large_image', title: site.title, description: site.description },
  // Indexable is the default; only Vercel previews opt out (lib/site-env.ts).
  ...(site.indexable ? {} : { robots: { index: false, follow: false } }),
  formatDetection: { telephone: false },
  ...(site.googleSiteVerification ? { verification: { google: site.googleSiteVerification } } : {}),
};

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body>
        <noscript>
          {/* Without JavaScript, scroll reveals would never fire — show everything instead. */}
          <style>{'[data-reveal]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
