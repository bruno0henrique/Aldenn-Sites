"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ArrowDown, ArrowUpRight, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { properties } from "@/data/properties";
import { defaultFilters, filterProperties, type Filters } from "@/lib/property";
import { asset } from "@/lib/format";
import { PropertyCard } from "./property-card";
import { BrandIntro } from "./brand-intro";

function fromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(Object.keys(defaultFilters).map((key) => [key, params.get(key) ?? defaultFilters[key as keyof Filters]])) as Filters;
}

export function Catalog() {
  const grid = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [location, setLocation] = useState("");
  const [purpose, setPurpose] = useState("venda");
  const [extra, setExtra] = useState(false);
  useEffect(() => {
    const sync = () => { const current = fromUrl(); setFilters(current); setLocation(current.location); setPurpose(current.purpose || "venda"); };
    sync(); window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  function update(patch: Partial<Filters>) {
    const next = { ...filters, ...patch };
    setFilters(next);
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => { if (value && value !== defaultFilters[key as keyof Filters]) params.set(key, value); });
    window.history.pushState(null, "", `${window.location.pathname}${params.size ? `?${params}` : ""}#imoveis`);
  }
  const results = filterProperties(properties, filters);
  const signature = results.map((item) => item.reference).join(",");
  useEffect(() => {
    if (!grid.current || !grid.current.children.length) return;
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.fromTo(grid.current!.children, { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.055, duration: 0.55, ease: "power2.out", clearProps: "all", scrollTrigger: { trigger: grid.current, start: "top 94%", once: true } });
      }, grid);
      return () => context.revert();
    }, grid);
    return () => media.revert();
  }, [signature]);
  const active = Object.entries(filters).some(([key, value]) => key !== "sort" && value !== "");
  return <>
    <section className="hero hero-premium" aria-labelledby="hero-title"><BrandIntro />
      <div className="container hero-stage"><div className="hero-art"><div className="hero-photo"><Image className="hero-image" src={asset(properties[2].images[0].path)} alt="Fachada contemporânea da casa no Alphaville II" fill sizes="(max-width: 700px) 100vw, 55vw" priority /><div className="hero-photo-shade" /></div><span className="hero-art-label">ARQUITETURA PARA VIVER</span><Link className="hero-featured" href={`/imovel/${properties[2].slug}`}><span>EM DESTAQUE</span><strong>Casa no Alphaville II</strong><small>280 m² construídos · 3 suítes <ArrowUpRight size={19} /></small></Link></div>
      <div className="hero-content"><span className="eyebrow hero-eyebrow"><span /> UMA SELEÇÃO EXTRAORDINÁRIA</span><h1 id="hero-title"><span className="hero-line"><span>Há lugares.</span></span><span className="hero-line"><span>E há <em>o seu lugar.</em></span></span></h1><p>O encontro entre uma arquitetura que inspira<br className="desktop-break" /> e a vida que você quer viver.</p>
        <form className="hero-search" onSubmit={(event) => { event.preventDefault(); update({ purpose, location }); const target = document.getElementById("imoveis"); if (target) { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) target.scrollIntoView(); else gsap.to(window, { scrollTo: { y: target, offsetY: 110, autoKill: true }, duration: 0.8, ease: "power2.inOut", overwrite: "auto" }); } }}>
          <div className="search-tabs" role="group" aria-label="Finalidade da busca"><button type="button" aria-pressed={purpose === "venda"} onClick={() => setPurpose("venda")}>Comprar</button><button type="button" aria-pressed={purpose === "locacao"} onClick={() => setPurpose("locacao")}>Alugar</button></div>
          <div className="search-body"><label><MapPin size={19} /><span><small>ONDE VOCÊ QUER MORAR?</small><input aria-label="Localização da busca" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Cidade, bairro ou condomínio" maxLength={100} /></span></label><button className="button button-gold" type="submit"><Search size={18} /> Encontrar imóvel</button></div>
        </form>
      </div></div><div className="container hero-bottom"><span>São José dos Campos <i /> Jacareí</span><a href="#imoveis">Conheça a seleção <span className="explore-circle"><ArrowDown size={16} /></span></a></div>
    </section>
    <main id="imoveis" className="catalog container"><div className="section-heading"><div><span className="eyebrow">SEU PRÓXIMO ENDEREÇO</span><h2>Escolhas que fazem<br /><em>você se sentir em casa.</em></h2></div><p>Espaços para morar, receber<br />e viver do seu jeito.</p></div>
      <div className="catalog-toolbar"><div className="catalog-tabs" role="group" aria-label="Filtrar por finalidade">{[["", "Todos os imóveis"], ["venda", "Comprar"], ["locacao", "Alugar"]].map(([value, label]) => <button key={value} aria-pressed={filters.purpose === value} onClick={() => { update({ purpose: value, minPrice: "", maxPrice: "" }); setPurpose(value || "venda"); }}>{label}</button>)}</div><button className="filter-toggle" aria-expanded={extra} aria-controls="extra-filters" onClick={() => setExtra(!extra)}><SlidersHorizontal size={16} /> Filtros {extra && <X size={15} />}</button></div>
      <div className="filters-primary"><label>Localização<input type="search" value={filters.location} onChange={(event) => { update({ location: event.target.value }); setLocation(event.target.value); }} placeholder="Cidade, bairro ou condomínio" maxLength={100} /></label><label>Tipo de imóvel<select aria-label="Tipo de imóvel" value={filters.type} onChange={(event) => update({ type: event.target.value })}><option value="">Todos os tipos</option><option>Casa</option><option>Apartamento</option></select></label><label>Dormitórios<select value={filters.bedrooms} onChange={(event) => update({ bedrooms: event.target.value })}><option value="">Qualquer quantidade</option><option value="2">2 ou mais</option><option value="3">3 ou mais</option><option value="4">4 ou mais</option><option value="5">5 ou mais</option></select></label></div>
      {extra && <div className="filters-extra" id="extra-filters"><label>Preço mínimo (R$){filters.purpose === "locacao" && <small> por mês</small>}<input type="number" inputMode="numeric" min="0" value={filters.minPrice} onChange={(event) => update({ minPrice: event.target.value })} placeholder="Sem mínimo" /></label><label>Preço máximo (R$){filters.purpose === "locacao" && <small> por mês</small>}<input type="number" inputMode="numeric" min="0" value={filters.maxPrice} onChange={(event) => update({ maxPrice: event.target.value })} placeholder="Sem máximo" /></label><p className="microcopy">Preços de venda e aluguel são filtrados conforme a finalidade escolhida.</p></div>}
      <div className="catalog-results-line"><div><span aria-live="polite">{results.length} {results.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}</span>{active && <button className="clear-filters" onClick={() => { update(defaultFilters); setLocation(""); setPurpose("venda"); }}>Limpar filtros <X size={12} /></button>}</div><label className="sort-label">Ordenar por<select aria-label="Ordenar imóveis" value={filters.sort} onChange={(event) => update({ sort: event.target.value })}><option value="selection">Nossa seleção</option><option value="lowest">Menor preço</option><option value="highest">Maior preço</option></select></label></div>
      {results.length ? <div className="property-grid" ref={grid}>{results.map((property) => <PropertyCard key={property.reference} property={property} />)}</div> : <div className="empty-state"><Search size={30} strokeWidth={1} /><h3>Vamos encontrar outro caminho?</h3><p>Nenhum imóvel desta seleção corresponde aos filtros.</p><button className="button button-dark" onClick={() => { update(defaultFilters); setLocation(""); setPurpose("venda"); }}>Ver todos os imóveis <ArrowUpRight size={17} /></button></div>}
      <div className="catalog-note"><span className="note-line" /><p>Seleção demonstrativa. Explore as fotos, os detalhes e a experiência de atendimento.</p></div>
    </main>
  </>;
}
