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
  title: { default: 'Veloura Closet', template: '%s | Veloura Closet' },
  description:
    'Conheça a proposta da Veloura Closet e explore nossa vitrine de moda feminina em demonstração.',
  applicationName: 'Veloura Closet',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'Veloura Closet',
    title: 'Veloura Closet',
    description:
      'Moda feminina com personalidade. Explore a vitrine demonstrativa da Veloura Closet.',
    images: [
      {
        url: '/brand/veloura-share.png',
        width: 1731,
        height: 909,
        alt: 'Veloura Closet, moda feminina e looks com personalidade',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veloura Closet',
    description:
      'Moda feminina com personalidade. Explore a vitrine demonstrativa da Veloura Closet.',
    images: ['/brand/veloura-share.png'],
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
