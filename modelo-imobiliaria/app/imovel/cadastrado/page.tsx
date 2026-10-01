"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocalCatalog } from "@/components/local-catalog";
import { PropertyDetail } from "@/components/property-detail";
export default function RegisteredProperty() { return <Suspense fallback={<main id="conteudo" className="container empty-state"><p>Carregando imóvel…</p></main>}><RegisteredDetail /></Suspense>; }
function RegisteredDetail() {
  const { properties, ready } = useLocalCatalog();
  const params = useSearchParams();
  const reference = params.get("ref") || "";
  const property = properties.find((item) => item.reference === reference && reference.startsWith("LOCAL-"));
  if (!ready) return <main id="conteudo" className="container empty-state"><p role="status">Carregando imóvel…</p></main>;
  if (!property) return <main id="conteudo" className="container empty-state"><h1>Imóvel não encontrado.</h1><p>Este cadastro está disponível apenas no navegador em que foi criado.</p><Link className="button button-dark" href="/">Voltar aos imóveis</Link></main>;
  return <PropertyDetail property={property} allProperties={properties} />;
}
