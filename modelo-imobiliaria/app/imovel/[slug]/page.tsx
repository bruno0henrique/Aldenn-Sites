import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Bath, BedDouble, CarFront, Check, MapPin, Ruler } from "lucide-react";
import { properties } from "@/data/properties";
import { basePath, money, number, preciseMoney } from "@/lib/format";
import { Gallery } from "@/components/gallery";
import { Contact } from "@/components/contact";
import { Financing } from "@/components/financing";
import { PropertyCard } from "@/components/property-card";
import { PropertyVideo } from "@/components/property-video";

export const dynamicParams = false;
export function generateStaticParams() { return properties.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = properties.find((item) => item.slug === slug);
  return property ? { title: property.title, description: `${property.title} em ${property.city}. ${property.bedrooms} dormitórios, ${property.builtArea} m². Imóvel de referência em uma demonstração da Aldenn.`, alternates: { canonical: `${basePath}/imovel/${slug}/` } } : {};
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = properties.find((item) => item.slug === slug);
  if (!property) notFound();
  const rentalTotal = property.price + (property.condominium ?? 0) + (property.iptu ?? 0);
  const similar = properties.filter((item) => item.purpose === property.purpose && item.reference !== property.reference).slice(0, 3);
  return <main id="conteudo"><div className="container detail-top"><Link href={`/?purpose=${property.purpose}#imoveis`} className="back-link"><ArrowLeft size={15} /> Voltar aos imóveis</Link><span className="detail-reference">REF. {property.reference}</span></div>
    <div className="container"><Gallery images={property.images} title={property.title} /></div>
    <div className="container detail-layout"><div className="detail-content"><div className="detail-title"><span className="eyebrow">{property.purpose === "venda" ? "À VENDA" : "PARA ALUGAR"} · {property.type.toUpperCase()}</span><h1>{property.title}</h1><p className="detail-location"><MapPin size={16} />{property.neighborhood} · {property.city}, SP</p></div>
      <div className="detail-facts"><div><Ruler size={23} strokeWidth={1.3} /><strong>{property.builtArea === null ? "Não informada" : `${number(property.builtArea)} m²`}</strong><span>Área construída</span></div><div><BedDouble size={24} strokeWidth={1.3} /><strong>{property.bedrooms} dormitórios</strong><span>{property.suites} {property.suites === 1 ? "suíte" : "suítes"}</span></div><div><CarFront size={25} strokeWidth={1.3} /><strong>{property.parking} vagas</strong><span>Garagem</span></div><div><Bath size={24} strokeWidth={1.3} /><strong>{property.bathrooms ?? "Não informado"}</strong><span>Total de banheiros</span></div></div>
      <section className="detail-section"><span className="eyebrow">UM OLHAR MAIS DE PERTO</span><h2>{property.subtitle}</h2>{property.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<dl className="area-details"><div><dt>Área construída</dt><dd>{property.builtArea === null ? "Não informado" : `${number(property.builtArea)} m²`}</dd></div><div><dt>Área do terreno</dt><dd>{property.landArea === null ? "Não informado" : `${number(property.landArea)} m²`}</dd></div></dl></section>
      <section className="detail-section"><h2>O que faz parte deste lugar.</h2><ul className="feature-list">{property.features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul></section>
      {property.amenities.length > 0 && <section className="detail-section"><h2>No condomínio.</h2><ul className="feature-list">{property.amenities.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul></section>}
      <PropertyVideo video={property.video3d} cover={property.images[0]} title={property.title} />
      {property.purpose === "venda" && <Financing price={property.price} />}
      <div className="source-note"><span className="eyebrow">SOBRE ESTE EXEMPLO</span><p>Imóvel de referência para demonstrar a experiência. Dados e fotografias consultados na França Imobiliária em {new Date(property.consultedAt).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}. A Aldenn não comercializa este imóvel. Valores e disponibilidade não são atualizados automaticamente.</p><a className="text-link" href={property.sourceUrl} target="_blank" rel="noreferrer">Consultar anúncio de referência <ArrowUpRight size={15} /></a></div>
    </div><aside className="detail-aside"><div className="price-panel"><span className="eyebrow">{property.purpose === "venda" ? "VALOR DE VENDA" : "ALUGUEL MENSAL"}</span><strong className="detail-price">{money(property.price)}{property.purpose === "locacao" && <small>/mês</small>}</strong><dl className="cost-list"><div><dt>Condomínio / mês</dt><dd>{property.condominium === null ? "Não informado" : preciseMoney(property.condominium)}</dd></div><div><dt>IPTU / mês</dt><dd>{property.iptu === null ? "Não informado" : preciseMoney(property.iptu)}</dd></div>{property.purpose === "locacao" && <div className="rental-total"><dt>Total mensal informado</dt><dd>{preciseMoney(rentalTotal)}</dd></div>}</dl>{property.purpose === "venda" && <a className="finance-link" href="#financiamento">Simular financiamento <ArrowUpRight size={16} /></a>}<Contact property={property.title} reference={property.reference} /><span className="panel-ref">Imóvel de referência · {property.reference}</span></div></aside></div>
    {similar.length > 0 && <section className="container similar-section"><div className="section-heading"><div><span className="eyebrow">CONTINUE EXPLORANDO</span><h2>Outros lugares,<br /><em>novas possibilidades.</em></h2></div><Link className="text-link" href={`/?purpose=${property.purpose}#imoveis`}>Ver a seleção <ArrowUpRight size={17} /></Link></div><div className="property-grid">{similar.map((item) => <PropertyCard key={item.reference} property={item} />)}</div></section>}
  </main>;
}
