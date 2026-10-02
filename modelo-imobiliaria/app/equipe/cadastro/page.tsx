"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocalCatalog } from "@/components/local-catalog";
import { PropertyEditor } from "@/components/property-editor";
function Screen() {
  const reference = useSearchParams().get("ref") ?? "new";
  const { local, ready, staff, login } = useLocalCatalog();
  if (!ready) return <main id="conteudo" className="container editor-page"><p>Preparando seu espaço…</p></main>;
  if (!staff) return <main id="conteudo" className="container editor-page"><span className="eyebrow">ÁREA DA EQUIPE</span><h1>Seu próximo cadastro.</h1><p>Acesse seu perfil para organizar os imóveis.</p><button className="button button-gold" onClick={() => window.dispatchEvent(new Event("aldenn:profile"))}>Entrar no perfil</button><button className="profile-preview" onClick={login}>Conhecer a área da equipe</button></main>;
  const property = local.find((item) => item.reference === reference);
  if (reference !== "new" && !property) return <main id="conteudo" className="container editor-page"><h1>Cadastro não encontrado.</h1><Link href="/equipe/cadastro/">Cadastrar um imóvel</Link></main>;
  return <PropertyEditor key={reference} property={property} />;
}
export default function Page() { return <Suspense fallback={<main className="container editor-page">Preparando cadastro…</main>}><Screen /></Suspense>; }
