"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useLocalCatalog } from "./local-catalog";
import { asset } from "@/lib/format";
import { neighborhoodGroups, neighborhoodHref } from "@/lib/neighborhoods";
export function Neighborhoods() {
  const { properties } = useLocalCatalog(); const groups = neighborhoodGroups(properties);
  return <section className="neighborhoods" id="bairros" aria-labelledby="neighborhoods-title"><div className="container"><div className="section-heading"><div><span className="eyebrow"><MapPin size={14} /> CADA REGIÃO, UM NOVO OLHAR</span><h2 id="neighborhoods-title">O endereço também<br /><em>faz parte da escolha.</em></h2></div><p>Explore os bairros da seleção<br />e encontre os imóveis de cada região.</p></div><div className="neighborhood-grid">{groups.map((group, index) => <Link className="neighborhood-card" href={neighborhoodHref(group)} key={`${group.city}|${group.name}`} aria-label={`Conhecer ${group.name}, ${group.city}`}><Image src={asset(group.properties[0].images[0].path)} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" /><div><span className="neighborhood-number">{String(index + 1).padStart(2, "0")}</span><span className="neighborhood-city">{group.city}</span><h3>{group.name}</h3><p>{group.properties.length} {group.properties.length === 1 ? "imóvel na seleção" : "imóveis na seleção"}</p><span className="neighborhood-open"><ArrowUpRight size={20} strokeWidth={1.4} /></span></div></Link>)}</div></div></section>;
}
