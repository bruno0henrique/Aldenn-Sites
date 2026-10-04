"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, LoaderCircle, MapPin, Search, X } from "lucide-react";
import { useLocalCatalog } from "./local-catalog";
import { addressSuggestion, localSuggestions, postalDigits, type LocationSuggestion, type PostalAddress } from "@/lib/location";

export function PropertySearch({ value, purpose, onChange, onPurpose, onSearch }: { value: string; purpose: string; onChange: (value: string) => void; onPurpose: (value: string) => void; onSearch: (location: string, reference?: string) => void }) {
  const { properties } = useLocalCatalog();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [remote, setRemote] = useState<LocationSuggestion[]>([]);
  const [selected, setSelected] = useState<LocationSuggestion | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const chosen = selected?.label === value ? selected : null;
  const locals = localSuggestions(properties, value);
  const suggestions = chosen ? [] : [...remote, ...locals].slice(0, 6);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setRemote([]); setMessage(""); setActive(-1);
      if (chosen || code) { setBusy(false); return; }
      const cep = postalDigits(value);
      if (/^[\d\s-]+$/.test(value) && !cep) { setMessage("Digite os 8 números do CEP."); return; }
      const street = value.trim();
      if (!cep && (street.length < 3 || localSuggestions(properties, street).length)) return;
      setBusy(true);
      const timeout = setTimeout(() => { setBusy(false); setMessage("A consulta demorou. Tente novamente ou busque pelo nome da região."); controller.abort(); }, 6500);
      try {
        const urls = cep ? [`https://viacep.com.br/ws/${cep}/json/`] : [...new Set(properties.map((property) => JSON.stringify([property.state || "SP", property.city])))].map((region) => { const [state, city] = JSON.parse(region); return `https://viacep.com.br/ws/${encodeURIComponent(state)}/${encodeURIComponent(city)}/${encodeURIComponent(street)}/json/`; });
        const results = await Promise.all(urls.map(async (url) => {
          const response = await fetch(url, { signal: controller.signal, credentials: "omit", referrerPolicy: "no-referrer" });
          if (!response.ok) throw new Error("Consulta indisponível");
          const data: PostalAddress | PostalAddress[] = await response.json();
          return (Array.isArray(data) ? data : [data]).map(addressSuggestion).filter((entry): entry is LocationSuggestion => entry !== null);
        }));
        if (controller.signal.aborted) return;
        const entries = [...new Map(results.flat().map((entry) => [entry.id, entry])).values()].slice(0, 6);
        setRemote(entries);
        setMessage(entries.length ? "" : cep ? "CEP não encontrado. Confira os números ou busque por cidade ou bairro." : "Nenhuma sugestão nesta região. Você pode buscar pelo nome digitado.");
      } catch {
        if (!controller.signal.aborted) setMessage("Consulta de endereços indisponível. Busque por cidade, bairro ou condomínio.");
      } finally { clearTimeout(timeout); if (!controller.signal.aborted) setBusy(false); }
    }, 450);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [value, chosen, properties, code]);
  function choose(suggestion: LocationSuggestion) { setSelected(suggestion); setRemote([]); onChange(suggestion.label); setOpen(false); setBusy(false); setMessage(""); input.current?.focus(); }
  function search() {
    if (code) { onSearch("", value.trim()); setOpen(false); return; }
    const cep = postalDigits(value);
    if (chosen) { onSearch(chosen.location); setOpen(false); return; }
    if (cep) { if (remote[0]) { choose(remote[0]); onSearch(remote[0].location); } else { setOpen(true); setMessage(busy ? "Consultando o CEP. Aguarde a sugestão de endereço." : "Selecione o endereço encontrado ou confira o CEP."); } return; }
    if (/^[\d\s-]+$/.test(value) && value.trim()) { setOpen(true); setMessage("Digite os 8 números do CEP."); return; }
    if (busy && !locals.length) { setOpen(true); setMessage("Consultando o endereço. Aguarde as sugestões."); return; }
    if (remote.length === 1) { choose(remote[0]); onSearch(remote[0].location); return; }
    if (remote.length > 1) { setOpen(true); setMessage("Selecione uma das ruas encontradas para buscar naquela região."); return; }
    onSearch(value); setOpen(false);
  }
  return <form className="hero-search location-search" onSubmit={(event) => { event.preventDefault(); search(); }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <div className="search-topline"><div className="search-tabs" role="group" aria-label="Finalidade da busca"><button type="button" aria-pressed={!code && purpose === "venda"} onClick={() => { if (code) onChange(""); setCode(false); onPurpose("venda"); }}>Comprar</button><button type="button" aria-pressed={!code && purpose === "locacao"} onClick={() => { if (code) onChange(""); setCode(false); onPurpose("locacao"); }}>Alugar</button><button type="button" aria-pressed={code} onClick={() => { setCode(true); onChange(""); setSelected(null); input.current?.focus(); }}>Código</button></div></div>
    <div className="search-body"><div className="location-field"><MapPin size={20} strokeWidth={1.5} /><div className="location-input-wrap"><label htmlFor={id}>{code ? "QUAL É O CÓDIGO DO IMÓVEL?" : "ONDE VOCÊ QUER MORAR?"}</label><input ref={input} id={id} role={code ? "searchbox" : "combobox"} aria-label={code ? "Código do imóvel na busca" : "Localização da busca"} aria-autocomplete="list" aria-expanded={!code && open && !chosen} aria-controls={`${id}-options`} aria-activedescendant={open && active >= 0 && suggestions[active] ? `${id}-option-${active}` : undefined} aria-describedby={`${id}-hint`} autoComplete="off" spellCheck={false} value={value} placeholder={code ? "Ex.: 24060" : "Digite uma localização"} maxLength={100} onFocus={() => setOpen(true)} onChange={(event) => { setSelected(null); setRemote([]); setBusy(false); setMessage(""); setActive(-1); onChange(event.target.value); setOpen(true); }} onKeyDown={(event) => {
      if (event.key === "Escape") { setOpen(false); setActive(-1); }
      if (!code && (event.key === "ArrowDown" || event.key === "ArrowUp")) { event.preventDefault(); setOpen(true); setActive((index) => suggestions.length ? index < 0 ? event.key === "ArrowDown" ? 0 : suggestions.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + suggestions.length) % suggestions.length : -1); }
      if (!code && event.key === "Enter" && open && active >= 0 && suggestions[active]) { event.preventDefault(); choose(suggestions[active]); }
    }} /></div>{value && <button type="button" className="location-clear icon-button" aria-label="Limpar localização da busca" onClick={() => { setSelected(null); setRemote([]); onChange(""); setBusy(false); setMessage(""); input.current?.focus(); }}><X size={16} /></button>}</div><button className="button button-gold" type="submit"><Search size={18} /> Encontrar imóvel <ArrowUpRight size={17} /></button></div>
    {chosen && <p className="selected-address">{chosen.detail}{chosen.kind === "Endereço" && <span>Busca por imóveis no bairro ou cidade deste endereço.</span>}</p>}
    <p id={`${id}-hint`} className="search-hint">{code ? "Digite a referência do anúncio para encontrá-lo diretamente." : "Busque por cidade, bairro, rua, condomínio ou CEP."}</p>
    {!code && open && !chosen && <div className="location-suggestions"><div className="suggestion-heading">{busy ? <><LoaderCircle size={14} className="search-spinner" /> Consultando endereço</> : remote.length ? "ENDEREÇOS ENCONTRADOS" : value.trim() ? "SUGESTÕES DA SELEÇÃO" : "EXPLORE ESTAS REGIÕES"}</div><div id={`${id}-options`} role="listbox" aria-label="Sugestões de localização">{suggestions.map((suggestion, index) => <button type="button" role="option" aria-selected={active === index} id={`${id}-option-${index}`} key={suggestion.id} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(suggestion)}><MapPin size={16} strokeWidth={1.5} /><span><strong>{suggestion.label}</strong><small>{suggestion.kind} · {suggestion.detail}</small></span><ArrowUpRight size={15} /></button>)}</div><p className="suggestion-message" role="status">{message || (remote.length ? "A seleção mostra imóveis na região, sem informar endereço exato." : "")}</p></div>}
  </form>;
}


