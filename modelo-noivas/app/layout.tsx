import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
 metadataBase: new URL("https://www.aldenn.com.br"),
 title: "Maison Amora | Modelo para lojas de noivas",
 description: "Modelo editorial fictício para lojas de noivas, com apresentação de estilos, planejador e contato direto.",
 alternates: { canonical: "/demonstracao-noiva/" },
 openGraph: {
  type: "website",
  locale: "pt_BR",
  url: "/demonstracao-noiva/",
  siteName: "Maison Amora",
  title: "Maison Amora | Modelo para lojas de noivas",
  description: "Uma experiência editorial fictícia para apresentar vestidos, ocasiões e atendimento.",
  images: [{
   url: "/demonstracao-noiva/media/maison-amora-compartilhamento.jpg",
   width: 1200,
   height: 630,
   alt: "Vestido de noiva em renda apresentado no modelo Maison Amora",
  }],
 },
 twitter: {
  card: "summary_large_image",
  title: "Maison Amora | Modelo para lojas de noivas",
  description: "Uma experiência editorial fictícia para apresentar vestidos, ocasiões e atendimento.",
  images: ["/demonstracao-noiva/media/maison-amora-compartilhamento.jpg"],
 },
 icons: { icon: "/demonstracao-noiva/favicon.svg" },
 robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="pt-BR"><body>{children}</body></html>;
}
