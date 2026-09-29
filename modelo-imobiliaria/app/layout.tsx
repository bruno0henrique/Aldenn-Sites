import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Motion } from "@/components/motion";
import { basePath } from "@/lib/format";
import "./globals.css";
import "./entrance.css";
import "./search.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aldenn.com.br"),
  title: { default: "Aldenn Imóveis | Seu próximo endereço", template: "%s | Aldenn Imóveis" },
  description: "Explore a demonstração de uma imobiliária de alto padrão criada pela Aldenn, com casas, apartamentos e simulação de financiamento.",
  icons: { icon: `${basePath}/favicon.png` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><Motion><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header />{children}<Footer /></Motion></body></html>;
}
