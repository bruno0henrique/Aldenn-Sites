"use client";

import { useState } from "react";
import { ArrowDown, MapPin, Ruler, SlidersHorizontal } from "lucide-react";
import { useLocalCatalog } from "./local-catalog";
import { defaultFilters, normalize, propertyTypes, type Filters } from "@/lib/property";

export function AdvancedSearch({ filters, onChange, count, onResults }: {
  filters: Filters; onChange: (patch: Partial<Filters>) => void; count: number; onResults: () => void;
}) {
  const [code, setCode] = useState(Boolean(filters.reference));
  const { properties } = useLocalCatalog();
  const cities = [...new Set(properties.map((property) => property.city))].sort();
  const region = properties.filter((property) => !filters.city || property.city === filters.city);
  const neighborhoods = [...new Set(region.map((property) => property.neighborhood))].sort();
  const developments = [...new Set(region.filter((property) => !filters.neighborhood || property.neighborhood === filters.neighborhood).map((property) => property.development))].sort();
  const maxOptions = (amount: number, noun: string) => Array.from({ length: amount }, (_, index) => <option key={index + 1} value={index + 1}>Até {index + 1} {index === 0 ? noun.slice(0, -1) : noun}</option>);
  const invalidPrice = Boolean(filters.minPrice && filters.maxPrice && Number(filters.minPrice) > Number(filters.maxPrice));
  const invalidArea = Boolean(filters.minArea && filters.maxArea && Number(filters.minArea) > Number(filters.maxArea));
  return <section className="advanced-search" id="extra-filters" aria-labelledby="advanced-title">
    <h3 id="advanced-title" className="sr-only">Encontre seu imóvel</h3>
    <div className="simple-search-tabs" role="group" aria-label="Forma de pesquisa"><button aria-pressed={!code} onClick={() => { setCode(false); onChange({ reference: "" }); }}>Busca</button><button aria-pressed={code} onClick={() => { setCode(true); onChange({ ...defaultFilters, reference: filters.reference }); }}>Código</button></div>
    {code ? <label className="simple-code">Código do imóvel<input type="search" aria-label="Código do imóvel" value={filters.reference} onChange={(event) => onChange({ reference: event.target.value })} onKeyDown={(event) => { if (event.key === "Enter") onResults(); }} placeholder="Ex.: 24060" maxLength={20} /></label> : <div className="simple-search-fields">
      <label>Transação<select aria-label="Transação" value={filters.purpose} onChange={(event) => onChange({ purpose: event.target.value, minPrice: "", maxPrice: "" })}><option value="">Comprar ou alugar</option><option value="venda">Comprar</option><option value="locacao">Alugar</option></select></label>
      <label>Tipo de imóvel<select aria-label="Tipo de imóvel" value={filters.type} onChange={(event) => onChange({ type: event.target.value })}><option value="">Todos os tipos</option>{propertyTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
      <label>Cidade<select aria-label="Cidade" value={filters.city} onChange={(event) => onChange({ city: event.target.value, neighborhood: "", development: "", location: "" })}><option value="">Todas as cidades</option>{cities.map((city) => <option key={city}>{city}</option>)}</select></label>
      <label>Bairro<select aria-label="Bairro" value={filters.neighborhood} onChange={(event) => onChange({ neighborhood: event.target.value, development: "" })}><option value="">Todos os bairros</option>{neighborhoods.map((neighborhood) => <option key={neighborhood}>{neighborhood}</option>)}</select></label>
      <fieldset className="simple-bedrooms"><legend>Quartos</legend><div>{[1,2,3,4].map((amount) => <button key={amount} aria-pressed={filters.minBedrooms === String(amount)} onClick={() => onChange({ minBedrooms: filters.minBedrooms === String(amount) ? "" : String(amount), bedrooms: "" })}>{amount}+</button>)}</div></fieldset>
      <div className="simple-price"><span>{filters.purpose === "locacao" ? "Aluguel mensal" : filters.purpose === "venda" ? "Valor de venda" : "Faixa de preço"}</span><div><span aria-hidden="true">R$</span><div><input aria-label="Preço mínimo (R$)" type="number" min="0" inputMode="numeric" placeholder="Mínimo" value={filters.minPrice} aria-invalid={invalidPrice} onChange={(event) => onChange({ minPrice: event.target.value })} /><input aria-label="Preço máximo (R$)" type="number" min="0" inputMode="numeric" placeholder="Máximo" value={filters.maxPrice} aria-invalid={invalidPrice} onChange={(event) => onChange({ maxPrice: event.target.value })} /></div></div></div>
    </div>}
    <details className="more-search-filters"><summary>Mais filtros</summary>
      <label>Localização<input type="search" value={filters.location} onChange={(event) => onChange({ location: event.target.value })} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); onResults(); } }} placeholder="Cidade, bairro ou condomínio" /></label>
    <fieldset><legend><MapPin size={16} /> Localização</legend><div className="advanced-fields">
      <label>Condomínio / empreendimento<select aria-label="Condomínio / empreendimento" value={filters.development} onChange={(event) => onChange({ development: event.target.value })}><option value="">Todos os condomínios</option>{developments.map((development) => <option key={development}>{development}</option>)}</select></label>
    </div></fieldset>
    <fieldset><legend><SlidersHorizontal size={16} /> Características</legend><div className="advanced-fields">
      <label>Suítes<select aria-label="Suítes" value={filters.suites} onChange={(event) => onChange({ suites: event.target.value })}><option value="">Qualquer quantidade</option>{maxOptions(5, "suítes")}</select></label>
      <label>Banheiros<select aria-label="Banheiros" value={filters.bathrooms} onChange={(event) => onChange({ bathrooms: event.target.value })}><option value="">Qualquer quantidade</option>{maxOptions(7, "banheiros")}</select></label>
      <label>Vagas de garagem<select aria-label="Vagas de garagem" value={filters.parking} onChange={(event) => onChange({ parking: event.target.value })}><option value="">Qualquer quantidade</option>{maxOptions(8, "vagas")}</select></label>
      <label>Diferencial<select aria-label="Diferencial" value={filters.feature} onChange={(event) => onChange({ feature: event.target.value })}><option value="">Todos os diferenciais</option>{filters.feature && !["piscina", "gourmet", "elevador", "escritório", "academia", "closet"].includes(filters.feature) && <option value={filters.feature}>{filters.feature.split("|").join(", ")}</option>}<option value="piscina">Piscina</option><option value="gourmet">Espaço gourmet</option><option value="elevador">Elevador</option><option value="escritório">Escritório</option><option value="academia">Academia</option><option value="closet">Closet</option></select></label>
      {([["minBedrooms", "Mínimo de dormitórios"], ["minSuites", "Mínimo de suítes"], ["minBathrooms", "Mínimo de banheiros"], ["minParking", "Mínimo de vagas"]] as const).map(([key, label]) => <label key={key}>{label}<input aria-label={label} type="number" min="0" max="20" step="1" inputMode="numeric" value={filters[key]} onChange={(event) => onChange({ [key]: event.target.value })} placeholder="Sem mínimo" /></label>)}
      {filters.feature.includes("|") && <p className="advanced-combined">Diferenciais combinados: {filters.feature.split("|").join(", ")}. Escolha um diferencial acima para substituir.</p>}
      <label>Cor / tom<select aria-label="Cor / tom" value={filters.color} onChange={(event) => onChange({ color: event.target.value })}><option value="">Todas as cores</option>{[...new Set(["branca", "bege", "cinza", "preta", "marrom", "azul", "verde", "vermelha", ...properties.flatMap((item) => item.colors ?? []), ...(filters.color ? [filters.color] : [])].map(normalize))].map((color) => <option key={color} value={color}>{color[0].toUpperCase() + color.slice(1)}</option>)}</select><small>Tons das fotos desta demonstração.</small></label>
    </div></fieldset>
    <fieldset><legend><Ruler size={16} /> Valores e metragem</legend><div className="advanced-fields">
      <label>Área considerada<select aria-label="Área considerada" value={filters.areaType} onChange={(event) => onChange({ areaType: event.target.value })}><option value="built">Área construída</option><option value="land">Área do terreno</option></select></label>
      <label>Área mínima (m²)<input type="number" inputMode="decimal" min="0" value={filters.minArea} onChange={(event) => onChange({ minArea: event.target.value })} placeholder="Sem mínimo" aria-invalid={invalidArea} /></label>
      <label>Área máxima (m²)<input type="number" inputMode="decimal" min="0" value={filters.maxArea} onChange={(event) => onChange({ maxArea: event.target.value })} placeholder="Sem máximo" aria-invalid={invalidArea} /></label>
    </div></fieldset>
    </details>
    {(invalidPrice || invalidArea) && <p className="advanced-error" role="alert">O valor mínimo deve ser menor ou igual ao máximo. Revise {invalidPrice && invalidArea ? "preços e áreas" : invalidPrice ? "os preços" : "as áreas"}.</p>}
    <div className="advanced-bottom"><p>Critérios com dados não informados deixam o imóvel fora daquele filtro.</p><button className="button button-dark" disabled={invalidPrice || invalidArea} onClick={onResults}>Buscar · {count} {count === 1 ? "imóvel" : "imóveis"} <ArrowDown size={16} /></button></div>
  </section>;
}
