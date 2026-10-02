"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import { useLocalCatalog } from "@/components/local-catalog";
import { PropertyCard } from "@/components/property-card";
import { Contact } from "@/components/contact";
import { usePromotions } from "@/components/promotion-provider";
import { prioritizePromotions } from "@/lib/promotions";
import { neighborhoodGroups, neighborhoodSearch } from "@/lib/neighborhoods";
import { normalize } from "@/lib/property";
import { asset, money } from "@/lib/format";
function NeighborhoodPage() {
  const params = useSearchParams(); const { properties, ready } = useLocalCatalog(); const { campaigns } = usePromotions();
  const group = neighborhoodGroups(properties).find((item) => normalize(item.city) === normalize(params.get("city") ?? "") && normalize(item.name) === normalize(params.get("neighborhood") ?? ""));
  if (!ready) return <main id="conteudo" className="container neighborhood-detail"><p>Preparando a seleção…</p></main>;
  if (!group) return <main id="conteudo" className="container neighborhood-detail"><h1>Vamos explorar outro endereço?</h1><p>Este bairro ainda não faz parte da seleção.</p><Link className="button button-gold" href="/#bairros">Conhecer os bairros <ArrowUpRight size={16} /></Link></main>;
  const { results, promoted } = prioritizePromotions(group.properties, campaigns);
  const sales = group.properties.filter((item) => item.purpose !== "locacao"); const rentals = group.properties.filter((item) => item.purpose !== "venda");
  const minSale = sales.length ? Math.min(...sales.map((item) => item.price)) : null; const minRent = rentals.length ? Math.min(...rentals.map((item) => item.rentPrice ?? item.price)) : null;
  return <main id="conteudo" className="container neighborhood-detail"><Link href="/#bairros" className="back-link"><ArrowLeft size={15} /> Todos os bairros</Link><div className="neighborhood-overview"><div className="neighborhood-cover"><Image src={asset(group.properties[0].images[0].path)} alt={`Imóvel da seleção em ${group.name}`} fill sizes="(max-width: 700px) 100vw, 60vw" /></div><div className="neighborhood-summary"><span className="eyebrow"><MapPin size={14} /> {group.city}</span><h1>{group.name}</h1><p>Conheça os endereços disponíveis nesta região e escolha os detalhes que combinam com você.</p><dl><div><dt>Na seleção</dt><dd>{group.properties.length} {group.properties.length === 1 ? "imóvel" : "imóveis"}</dd></div><div><dt>À venda</dt><dd>{group.sales}{minSale !== null && <small>A partir de {money(minSale)}</small>}</dd></div><div><dt>Para alugar</dt><dd>{group.rentals}{minRent !== null && <small>A partir de {money(minRent)}/mês</small>}</dd></div></dl><div className="neighborhood-actions"><Link className="button button-gold" href={neighborhoodSearch(group)}>Ver todos os imóveis <ArrowUpRight size={16} /></Link>{group.sales > 0 && <Link className="text-link" href={neighborhoodSearch(group, "venda")}>Comprar nesta região <ArrowUpRight size={14} /></Link>}{group.rentals > 0 && <Link className="text-link" href={neighborhoodSearch(group, "locacao")}>Alugar nesta região <ArrowUpRight size={14} /></Link>}</div><Contact property={`Imóveis em ${group.name}, ${group.city}`} reference={`Bairro: ${group.name}`} /></div></div><section className="neighborhood-list" aria-labelledby="neighborhood-list-title"><span className="eyebrow">EXPLORE ESTA REGIÃO</span><h2 id="neighborhood-list-title">Lugares para uma nova história.</h2><div className="property-grid">{results.map((property) => <PropertyCard key={property.reference} property={property} promoted={promoted.has(property.reference)} />)}</div></section></main>;
}
export default function Page() { return <Suspense fallback={<main className="container neighborhood-detail">Preparando a região…</main>}><NeighborhoodPage /></Suspense>; }
