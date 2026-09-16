import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
 metadataBase: new URL("https://www.aldenn.com.br"),
 title: "Taeko Noivas | Vestidos sob medida em Jacareí",
 description: "Há 40 anos, criamos vestidos sob medida para noivas, debutantes e madrinhas de Jacareí e região, com cuidado em cada detalhe.",
 alternates: { canonical: "/demonstracao-taeko/" },
 openGraph: {
  type: "website",
  locale: "pt_BR",
  url: "/demonstracao-taeko/",
  siteName: "Taeko Noivas",
  title: "Taeko Noivas | Vestidos sob medida em Jacareí",
  description: "Há 40 anos, criamos vestidos sob medida para noivas, debutantes e madrinhas de Jacareí e região, com cuidado em cada detalhe.",
  images: [{
   url: "/demonstracao-taeko/media/taeko-noivas-compartilhamento.jpg",
   width: 1200,
   height: 630,
   alt: "Vestido de noiva sob medida em renda no ateliê Taeko Noivas",
  }],
 },
 twitter: {
  card: "summary_large_image",
  title: "Taeko Noivas | Vestidos sob medida em Jacareí",
  description: "Há 40 anos, criamos vestidos sob medida para noivas, debutantes e madrinhas de Jacareí e região, com cuidado em cada detalhe.",
  images: ["/demonstracao-taeko/media/taeko-noivas-compartilhamento.jpg"],
 },
 icons: { icon: "/demonstracao-taeko/favicon.svg" },
 robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="pt-BR"><body>{children}</body></html>;
}

