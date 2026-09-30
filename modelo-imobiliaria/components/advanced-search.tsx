"use client";

import { ArrowDown, MapPin, Ruler, SlidersHorizontal } from "lucide-react";
import { properties } from "@/data/properties";
import type { Filters } from "@/lib/property";

export function AdvancedSearch({ filters, onChange, count, onResults }: {
  filters: Filters; onChange: (patch: Partial<Filters>) => void; count: number; onResults: () => void;
}) {
  const cities = [...new Set(properties.map((property) => property.city))].sort();
  const region = properties.filter((property) => !filters.city || property.city === filters.city);
  const neighborhoods = [...new Set(region.map((property) => property.neighborhood))].sort();
  const developments = [...new Set(region.filter((property) => !filters.neighborhood || property.neighborhood === filters.neighborhood).map((property) => property.development))].sort();
  const maxOptions = (amount: number, noun: string) => Array.from({ length: amount }, (_, index) => <option key={index + 1} value={index + 1}>Até {index + 1} {index === 0 ? noun.slice(0, -1) : noun}</option>);
  const invalidPrice = Boolean(filters.minPrice && filters.maxPrice && Number(filters.minPrice) > Number(filters.maxPrice));
  const invalidArea = Boolean(filters.minArea && filters.maxArea && Number(filters.minArea) > Number(filters.maxArea));
  return <section className="advanced-search" id="extra-filters" aria-labelledby="advanced-title">
    <div className="advanced-heading"><div><span className="eyebrow"><SlidersHorizontal size={15} /> PESQUISA COMPLETA</span><h3 id="advanced-title">Os detalhes do seu próximo lugar.</h3></div><p>Combine os critérios. A seleção se atualiza enquanto você escolhe.</p></div>
    <fieldset><legend><MapPin size={16} /> Localização</legend><div className="advanced-fields">
      <label>Cidade<select aria-label="Cidade" value={filters.city} onChange={(event) => onChange({ city: event.target.value, neighborhood: "", development: "" })}><option value="">Todas as cidades</option>{cities.map((city) => <option key={city}>{city}</option>)}</select></label>
      <label>Bairro<select aria-label="Bairro" value={filters.neighborhood} onChange={(event) => onChange({ neighborhood: event.target.value, development: "" })}><option value="">Todos os bairros</option>{neighborhoods.map((neighborhood) => <option key={neighborhood}>{neighborhood}</option>)}</select></label>
      <label>Condomínio / empreendimento<select aria-label="Condomínio / empreendimento" value={filters.development} onChange={(event) => onChange({ development: event.target.value })}><option value="">Todos os condomínios</option>{developments.map((development) => <option key={development}>{development}</option>)}</select></label>
    </div></fieldset>
    <fieldset><legend><SlidersHorizontal size={16} /> Características</legend><div className="advanced-fields">
      <label>Suítes<select aria-label="Suítes" value={filters.suites} onChange={(event) => onChange({ suites: event.target.value })}><option value="">Qualquer quantidade</option>{maxOptions(5, "suítes")}</select></label>
      <label>Banheiros<select aria-label="Banheiros" value={filters.bathrooms} onChange={(event) => onChange({ bathrooms: event.target.value })}><option value="">Qualquer quantidade</option>{maxOptions(7, "banheiros")}</select></label>
      <label>Vagas de garagem<select aria-label="Vagas de garagem" value={filters.parking} onChange={(event) => onChange({ parking: event.target.value })}><option value="">Qualquer quantidade</option>{maxOptions(8, "vagas")}</select></label>
      <label>Diferencial<select aria-label="Diferencial" value={filters.feature} onChange={(event) => onChange({ feature: event.target.value })}><option value="">Todos os diferenciais</option>{filters.feature && !["piscina", "gourmet", "elevador", "escritório", "academia", "closet"].includes(filters.feature) && <option value={filters.feature}>{filters.feature.split("|").join(", ")}</option>}<option value="piscina">Piscina</option><option value="gourmet">Espaço gourmet</option><option value="elevador">Elevador</option><option value="escritório">Escritório</option><option value="academia">Academia</option><option value="closet">Closet</option></select></label>
      {([["minBedrooms", "Mínimo de dormitórios"], ["minSuites", "Mínimo de suítes"], ["minBathrooms", "Mínimo de banheiros"], ["minParking", "Mínimo de vagas"]] as const).map(([key, label]) => <label key={key}>{label}<input aria-label={label} type="number" min="0" max="20" step="1" inputMode="numeric" value={filters[key]} onChange={(event) => onChange({ [key]: event.target.value })} placeholder="Sem mínimo" /></label>)}
      {filters.feature.includes("|") && <p className="advanced-combined">Diferenciais combinados: {filters.feature.split("|").join(", ")}. Escolha um diferencial acima para substituir.</p>}
      <label>Cor / tom<select aria-label="Cor / tom" value={filters.color} onChange={(event) => onChange({ color: event.target.value })}><option value="">Todas as cores</option>{["branca", "bege", "cinza", "preta", "marrom", "azul", "verde", "vermelha"].map((color) => <option key={color} value={color}>{color[0].toUpperCase() + color.slice(1)}</option>)}</select><small>Tons das fotos desta demonstração.</small></label>
      <label>Código do imóvel<input type="search" value={filters.reference} onChange={(event) => onChange({ reference: event.target.value })} placeholder="Ex.: 24060" maxLength={20} /></label>
    </div></fieldset>
    <fieldset><legend><Ruler size={16} /> Valores e metragem</legend><div className="advanced-fields">
      <label>Preço mínimo (R$){filters.purpose === "locacao" && <small> por mês</small>}<input type="number" inputMode="numeric" min="0" value={filters.minPrice} onChange={(event) => onChange({ minPrice: event.target.value })} placeholder="Sem mínimo" aria-invalid={invalidPrice} /></label>
      <label>Preço máximo (R$){filters.purpose === "locacao" && <small> por mês</small>}<input type="number" inputMode="numeric" min="0" value={filters.maxPrice} onChange={(event) => onChange({ maxPrice: event.target.value })} placeholder="Sem máximo" aria-invalid={invalidPrice} /></label>
      <label>Área considerada<select aria-label="Área considerada" value={filters.areaType} onChange={(event) => onChange({ areaType: event.target.value })}><option value="built">Área construída</option><option value="land">Área do terreno</option></select></label>
      <label>Área mínima (m²)<input type="number" inputMode="decimal" min="0" value={filters.minArea} onChange={(event) => onChange({ minArea: event.target.value })} placeholder="Sem mínimo" aria-invalid={invalidArea} /></label>
      <label>Área máxima (m²)<input type="number" inputMode="decimal" min="0" value={filters.maxArea} onChange={(event) => onChange({ maxArea: event.target.value })} placeholder="Sem máximo" aria-invalid={invalidArea} /></label>
    </div></fieldset>
    {(invalidPrice || invalidArea) && <p className="advanced-error" role="alert">O valor mínimo deve ser menor ou igual ao máximo. Revise {invalidPrice && invalidArea ? "preços e áreas" : invalidPrice ? "os preços" : "as áreas"}.</p>}
    <div className="advanced-bottom"><p>Critérios com dados não informados deixam o imóvel fora daquele filtro.</p><button className="button button-dark" onClick={onResults}>Ver {count} {count === 1 ? "imóvel" : "imóveis"} <ArrowDown size={16} /></button></div>
  </section>;
}
