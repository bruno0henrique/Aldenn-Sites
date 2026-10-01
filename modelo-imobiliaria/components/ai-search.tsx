"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, LoaderCircle, Sparkles, X } from "lucide-react";
import { useLocalCatalog } from "./local-catalog";
import { filterProperties, type Filters } from "@/lib/property";
import { searchHref, validateSearch, type SearchEvent } from "@/lib/ai-search";
import { propertyHref } from "@/lib/local-properties";
import { usePromotions } from "./promotion-provider";
import { prioritizePromotions } from "@/lib/promotions";
import { asset, money } from "@/lib/format";

export function AiSearch({ onClose, onManual, onResults }: { onClose: () => void; onManual: () => void; onResults: (filters: Filters) => void }) {
  const { properties } = useLocalCatalog();
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [filters, setFilters] = useState<Filters | null>(null);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);
  const { campaigns } = usePromotions();
  const { results: matches } = prioritizePromotions(filters ? filterProperties(properties, filters) : [], campaigns);
  async function search(event: React.FormEvent) {
    event.preventDefault();
    if (busy || query.trim().length < 3) return;
    abort.current?.abort(); const controller = new AbortController(); abort.current = controller;
    setBusy(true); setError(""); setMessage(""); setFilters(null);
    try {
      const response = await fetch("/api/imobiliaria/busca", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: query.trim() }), signal: AbortSignal.any([controller.signal, AbortSignal.timeout(30000)]) });
      if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.message || "A busca está indisponível. Use a pesquisa completa."); }
      if (!response.body) throw new Error("Não recebi uma resposta. Tente novamente.");
      const reader = response.body.getReader(), decoder = new TextDecoder(); let buffer = "", complete = false;
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let boundary: number;
        while ((boundary = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 1); if (!line) continue;
          const item = JSON.parse(line) as SearchEvent;
          if (item.type === "delta") setMessage((current) => current + item.text);
          if (item.type === "error") throw new Error(item.message);
          if (item.type === "complete") { const result = validateSearch(item); setMessage(result.message); setFilters(result.filters); complete = true; }
        }
      }
      if (!complete) throw new Error("A resposta foi interrompida. Tente novamente.");
    } catch (reason) {
      if (!controller.signal.aborted) { setMessage(""); setFilters(null); setError(reason instanceof Error ? reason.message : "Não consegui concluir a busca."); }
    } finally { if (abort.current === controller) setBusy(false); }
  }
  return <section className="ai-search" aria-labelledby="ai-search-title">
    <div className="ai-heading"><div><span className="eyebrow"><Sparkles size={15} /> BUSCA COM IA</span><h3 id="ai-search-title">Conte como é o seu lugar.</h3></div><button className="ai-close" aria-label="Fechar busca com IA" onClick={onClose}><X size={18} /></button></div>
    <p className="ai-intro">Diga o que procura. Eu organizo os critérios e encontro as opções desta seleção.</p>
    <form onSubmit={search} className="ai-composer"><label className="sr-only" htmlFor="ai-query">O que você procura?</label><textarea id="ai-query" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.nativeEvent.keyCode !== 229) { event.preventDefault(); if (!busy) event.currentTarget.form?.requestSubmit(); } }} placeholder="Um apartamento para alugar no Aquarius, com pelo menos duas suítes…" rows={3} minLength={3} maxLength={600} required disabled={busy} /><div className="ai-composer-bottom"><small>Localização, preço, cor e detalhes. Enter envia; Shift+Enter quebra linha.</small>{busy ? <button type="button" className="ai-submit" aria-label="Cancelar busca" onClick={() => { abort.current?.abort(); setBusy(false); setMessage(""); }}><X size={19} /></button> : <button className="ai-submit" aria-label="Buscar com IA" disabled={query.trim().length < 3}><ArrowUp size={19} /></button>}</div></form>
    <div className="ai-examples" aria-label="Exemplos de busca">{["Casa em Urbanova até R$ 3 milhões", "Alugar no Aquarius", "Apartamento com 3 dormitórios"].map((example) => <button key={example} disabled={busy} onClick={() => setQuery(example)}>{example} <ArrowUpRight size={12} /></button>)}</div>
    <small className="ai-privacy">Seu texto é enviado à OpenAI para interpretar a busca. Evite informar dados pessoais.</small>
    {busy && !message && <p className="ai-working" role="status"><LoaderCircle size={16} /> Organizando sua busca…</p>}
    {message && <div className={`ai-response ${busy ? "is-streaming" : ""}`}><Sparkles size={17} /><p>{message}<span className="ai-caret" aria-hidden="true" /></p></div>}
    {!busy && filters && <div className="ai-matches"><p className="ai-count" role="status">{matches.length ? `${matches.length} ${matches.length === 1 ? "opção nesta seleção" : "opções nesta seleção"}` : "Ainda não temos um imóvel com esses critérios."}</p>{matches.slice(0, 3).map((property) => <Link href={propertyHref(property)} className="ai-match" key={property.reference}><Image src={asset(property.images[0].thumbnail)} alt="" width={120} height={90} /><div><strong>{property.title}</strong><small>{property.neighborhood} · {property.bedrooms} dormitórios · {property.builtArea} m²</small><span>{money(property.price)}{property.purpose === "locacao" && " / mês"}</span></div><ArrowUpRight size={18} /></Link>)}<a className="button button-dark ai-view-all" href={searchHref(filters)} onClick={(event) => { if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); onResults(filters); }}>Ver tudo <span>{matches.length}</span><ArrowUpRight size={16} /></a></div>}
    {error && <p className="ai-error" role="alert">{error}</p>}
    {(error || (filters && !matches.length)) && <button className="complete-search-link" onClick={onManual}>Ajustar na pesquisa completa <ArrowUpRight size={16} /></button>}
  </section>;
}
