import type { Metadata } from 'next';
import { Instrument_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/app-providers';

const instrumentSans = Instrument_Sans({
  variable: '--font-instrument-sans',
  subsets: ['latin'],
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aldenn-sites.vercel.app'),
  title: { default: 'Belleland Closet', template: '%s | Belleland Closet' },
  description:
    'Conheça a proposta da Belleland Closet e explore nossa vitrine de moda feminina em demonstração.',
  applicationName: 'Belleland Closet',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'Belleland Closet',
    title: 'Belleland Closet',
    description:
      'Moda feminina com personalidade. Explore a vitrine demonstrativa da Belleland Closet.',
    images: [
      {
        url: '/brand/belleland-share.jpg',
        width: 1280,
        height: 672,
        alt: 'Belleland Closet, moda feminina e looks com personalidade',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Belleland Closet',
    description:
      'Moda feminina com personalidade. Explore a vitrine demonstrativa da Belleland Closet.',
    images: ['/brand/belleland-share.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${instrumentSans.variable} ${playfairDisplay.variable}`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
