import type { Metadata } from "next";
import { FinancingOpportunity } from "@/components/financing-opportunity";
import { Catalog } from "@/components/catalog";
import { Neighborhoods } from "@/components/neighborhoods";
import { basePath } from "@/lib/format";

export const metadata: Metadata = { alternates: { canonical: `${basePath}/` } };
export default function Home() { return <div id="conteudo"><Catalog /><FinancingOpportunity /><Neighborhoods /></div>; }
