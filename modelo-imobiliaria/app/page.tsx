import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import { Neighborhoods } from "@/components/neighborhoods";
import { basePath } from "@/lib/format";

export const metadata: Metadata = { alternates: { canonical: `${basePath}/` } };
export default function Home() { return <div id="conteudo"><Catalog /><Neighborhoods /></div>; }
