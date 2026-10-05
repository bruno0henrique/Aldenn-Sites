import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import type { Metadata } from "next";
import "./globals.css";
const title = "Aurora Noivas | Um vestido com a sua essência";
const description = "Explore inspirações para noivas, madrinhas, debutantes e gala. Uma experiência editorial fictícia criada pela Aldenn.";
const route = "/demonstracao-aurora-noivas/";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.aldenn.com.br"), title, description,
  alternates: { canonical: route },
  openGraph: { type: "website", locale: "pt_BR", url: route, siteName: "Aurora Noivas", title, description, images: [{ url: `${route}media/aurora-compartilhamento.jpg`, width: 1200, height: 630, alt: "Fotografia editorial ilustrativa da Aurora Noivas" }] },
  twitter: { card: "summary_large_image", title, description, images: [`${route}media/aurora-compartilhamento.jpg`] },
  icons: { icon: `${route}favicon.svg` }, robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
