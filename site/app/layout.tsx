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
  title: { default: 'Belleland Closet', template: '%s | Belleland Closet' },
  description: 'Peças escolhidas para realçar sua essência. Consulte e reserve pelo WhatsApp.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${instrumentSans.variable} ${playfairDisplay.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
