import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
 title: "Taeko Noivas | O seu sonho, feito sob medida · Jacareí",
 description: "Vestidos sob medida para noivas, debutantes e madrinhas em Jacareí, com atenção ao caimento, aos detalhes e ao momento de cada mulher.",
 icons: { icon: "/demonstracao-taeko/favicon.svg" },
 robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="pt-BR"><body>{children}</body></html>;
}

