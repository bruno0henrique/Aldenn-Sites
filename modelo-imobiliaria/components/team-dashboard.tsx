"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Building2, KeyRound, Plus, Search } from "lucide-react";
import { readExtras } from "@/lib/registrations";
import { PropertyInternalDetails } from "./property-internal-details";
import { useLocalCatalog } from "./local-catalog";
import { asset, money } from "@/lib/format";
import { normalize, purposeLabel, type Property } from "@/lib/property";
import { propertyHref } from "@/lib/local-properties";
import { emptyRecord, keyStatuses, propertyStatuses, restoreTeam, seedTeam, teamKey, type Development, type PropertyRecord, type TeamData } from "@/lib/team";

export function TeamDashboard() {
  const { properties, ready, staff, login, remove } = useLocalCatalog();
  const reference = useSearchParams().get("ref");
  const [data, setData] = useState<TeamData | null>(null), [tab, setTab] = useState("properties"), [query, setQuery] = useState(""), [error, setError] = useState("");
  const [development, setDevelopment] = useState<Development | null>(null);
  const [deleting, setDeleting] = useState(false);
  const entered = useRef(false);
  useEffect(() => { if (!ready || entered.current) return; entered.current = true; if (!staff) login(); }, [ready, staff, login]);
  useEffect(() => {
    if (!ready) return;
    const fallback = seedTeam(properties);
    queueMicrotask(() => { try { setData(restoreTeam(JSON.parse(localStorage.getItem(teamKey) || "null"), fallback)); } catch { setData(fallback); } });
    // Restore once per visit; subsequent catalog edits keep internal records intact.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
  function save(next: TeamData) {
    try { localStorage.setItem(teamKey, JSON.stringify(next)); setData(next); setError(""); return true; }
    catch { setError("Não foi possível salvar. Libere espaço no navegador e tente novamente."); return false; }
  }
  if (!ready || !data) return <main id="conteudo" className="container team-page"><p>Preparando a área da equipe…</p></main>;
  const selected = properties.find((item) => item.reference === reference);
  const visible = properties.filter((item) => normalize(`${item.reference} ${item.title} ${item.city} ${item.neighborhood} ${item.development}`).includes(normalize(query)));
  const extra = selected ? readExtras(selected.reference) : {};
  const record = selected ? data.records[selected.reference] ?? { ...emptyRecord(), responsible: extra.broker || "", keyAgency: extra.keyAgency || "", keyLocation: extra.keyLocation || "", keyCount: extra.keyId || "" } : null;
  return <main id="conteudo" className={`container team-page${selected ? " team-detail" : ""}`}>
    <Link className="back-link" href="/"> <ArrowLeft size={15} /> Voltar ao site</Link>
    <header className="team-heading"><div><span className="eyebrow">ÁREA DA EQUIPE</span><h1>{selected ? "Ficha do imóvel" : "Área da equipe"}</h1>{!selected && <p>Consulte os imóveis e organize os próximos atendimentos.</p>}</div><div className="team-actions"><Link className="text-link" href="/equipe/cadastros/">Todos os cadastros <ArrowUpRight size={15} /></Link><Link className="button button-gold" href="/equipe/cadastro/"><Plus size={17} /> Cadastrar imóvel</Link></div></header>
    {!selected && <div className="team-summary"><div><strong>{properties.length}</strong><span>Imóveis na seleção</span></div><div><strong>{data.developments.length}</strong><span>Empreendimentos</span></div><div><strong>{Object.values(data.records).filter((item) => item.keyStatus === "Retirada para visita").length}</strong><span>Chaves em visita</span></div></div>}
    {error && <p className="ai-error" role="alert">{error}</p>}
    {reference && !selected ? <section className="team-panel"><h2>Imóvel não encontrado.</h2><Link href="/equipe/">Voltar aos imóveis</Link></section> : selected && record ? <>
      <Link className="back-link" href="/equipe/"><ArrowLeft size={15} /> Todos os imóveis</Link>
      <div className="team-property-overview"><Image src={asset(selected.images[0].path)} width={520} height={340} alt={selected.title} /><div><span className="eyebrow">REF. {selected.reference}</span><h2>{selected.title}</h2><p>{selected.neighborhood} · {selected.city}</p><strong>{money(selected.price)}{selected.purpose === "locacao" && " / mês"}</strong><div className="team-actions"><Link className="button button-dark" href={`/equipe/cadastro/?ref=${encodeURIComponent(selected.reference)}`}>Editar dados <ArrowUpRight size={16} /></Link><Link className="text-link" href={propertyHref(selected)}>Ver anúncio <ArrowUpRight size={15} /></Link></div></div></div>
      <PropertyFacts property={selected} /><PropertyInternalDetails reference={selected.reference} />
      {selected.reference.startsWith("LOCAL-") && <div className="team-delete">{deleting ? <><span>Excluir este cadastro?</span><button className="text-link" onClick={() => { try { remove(selected.reference); window.location.assign(asset("/equipe/")); } catch (reason) { setError((reason as Error).message); } }}>Confirmar exclusão</button><button className="text-link" onClick={() => setDeleting(false)}>Cancelar</button></> : <button className="text-link" onClick={() => setDeleting(true)}>Excluir imóvel</button>}</div>}
      <RecordEditor key={selected.reference} property={selected} record={record} onSave={(next) => save({ ...data, records: { ...data.records, [selected.reference]: next } })} />
    </> : <>
      <div className="team-tabs" role="group" aria-label="Organização da equipe"><button aria-pressed={tab === "properties"} onClick={() => setTab("properties")}>Imóveis</button><button aria-pressed={tab === "developments"} onClick={() => setTab("developments")}>Empreendimentos</button></div>
      {tab === "properties" ? <><label className="team-search"><Search size={18} /><span className="sr-only">Buscar na equipe</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Código, imóvel, bairro ou empreendimento" /></label><div className="team-list">{visible.map((property) => <Link className="team-item" href={`/equipe/?ref=${encodeURIComponent(property.reference)}`} key={property.reference}><Image src={asset(property.images[0].thumbnail)} alt="" width={110} height={90} /><div><small>REF. {property.reference} · {purposeLabel(property.purpose)}</small><h2>{property.title}</h2><p>{property.neighborhood} · {property.city}</p><span>{money(property.price)}</span></div><div className="team-item-meta"><span>{data.records[property.reference]?.status ?? "Disponível"}</span><small><KeyRound size={14} /> {data.records[property.reference]?.keyStatus ?? "Chave não informada"}</small><ArrowUpRight size={18} /></div></Link>)}</div>{visible.length === 0 && <p>Nenhum imóvel encontrado. Tente outro código ou nome.</p>}</> : <section className="team-panel"><div className="team-panel-heading"><h2>Empreendimentos</h2><button className="button button-outline" onClick={() => setDevelopment({ id: crypto.randomUUID(), name: "", matchName: "", city: "", neighborhood: "", address: "", stage: "Não informado", description: "" })}><Plus size={16} /> Novo empreendimento</button></div>{development && <DevelopmentEditor key={development.id} value={development} onCancel={() => setDevelopment(null)} onSave={(next) => { if (data.developments.some((item) => item.id !== next.id && normalize(item.name) === normalize(next.name))) { setError("Já existe um empreendimento com esse nome."); return; } if (save({ ...data, developments: [...data.developments.filter((item) => item.id !== next.id), next] })) setDevelopment(null); }} />}
      <div className="team-development-list">{data.developments.map((item) => <article key={item.id}><Building2 size={25} strokeWidth={1.3} /><div><h3>{item.name}</h3><p>{item.neighborhood ? `${item.neighborhood} · ` : ""}{item.city}</p><small>{item.stage} · {properties.filter((property) => property.development === item.matchName || property.development === item.name).length} imóveis vinculados</small>{item.address && <p>{item.address}</p>}{item.description && <p>{item.description}</p>}<button className="text-link" onClick={() => setDevelopment(item)}>Editar empreendimento <ArrowUpRight size={14} /></button></div></article>)}</div></section>}
    </>}
    <p className="team-cache">Informações da equipe salvas neste navegador.</p>
  </main>;
}

function PropertyFacts({ property: p }: { property: Property }) {
  const groups: { title: string; facts: [string, string | number][] }[] = [
    { title: "Localização", facts: [
      ["Cidade / UF", [p.city, p.state].filter(Boolean).join(" / ")],
      ["Bairro", p.neighborhood || "Não informado"],
      ["Condomínio / empreendimento", p.development || "Não informado"],
      ["Rua e número", [p.street, p.addressNumber].filter(Boolean).join(", ") || "Não informado"],
      ["CEP", p.cep || "Não informado"],
    ] },
    { title: "Características", facts: [
      ["Tipo", p.type], ["Área construída", p.builtArea === null ? "Não informada" : `${p.builtArea} m²`],
      ["Área do terreno", p.landArea === null ? "Não informada" : `${p.landArea} m²`],
      ["Dormitórios", p.bedrooms], ["Suítes", p.suites], ["Banheiros", p.bathrooms ?? "Não informado"], ["Vagas", p.parking],
    ] },
    { title: "Valores", facts: [
      ["Finalidade", purposeLabel(p.purpose)],
      [p.purpose === "locacao" ? "Aluguel mensal" : "Preço de venda", money(p.price)],
      ...(p.purpose === "ambos" ? [["Aluguel mensal", p.rentPrice === undefined ? "Não informado" : money(p.rentPrice)] as [string, string]] : []),
      ["Condomínio mensal", p.condominium === null ? "Não informado" : money(p.condominium)],
      ["IPTU mensal", p.iptu === null ? "Não informado" : money(p.iptu)],
    ] },
  ];
  return <section className="team-property-data" aria-label="Dados do imóvel">
    {groups.map((group) => <div className="team-data-section" key={group.title}><h2>{group.title}</h2><dl className="team-facts">{group.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>)}
    <div className="team-data-section"><h2>Apresentação</h2><div className="team-description">{p.description.map((text, index) => <p key={index}>{text}</p>)}<div className="feature-tags">{p.features.map((feature) => <span key={feature}>{feature}</span>)}</div></div></div>
  </section>;
}

function RecordEditor({ property, record, onSave }: { property: Property; record: PropertyRecord; onSave: (value: PropertyRecord) => boolean }) {
  const [value, setValue] = useState(record), [note, setNote] = useState(""), [message, setMessage] = useState("");
  const patch = (key: keyof PropertyRecord, next: string) => { setValue((current) => ({ ...current, [key]: next })); setMessage(""); };
  return <><section className="team-panel"><h2>Organização e chaves</h2><form onSubmit={(event) => { event.preventDefault(); if (onSave(value)) setMessage("Informações salvas."); }}><div className="team-fields"><label>Situação interna<select aria-label="Situação interna" value={value.status} onChange={(event) => patch("status", event.target.value)}>{propertyStatuses.map((status) => <option key={status}>{status}</option>)}</select></label><label>Responsável pelo imóvel<input maxLength={120} value={value.responsible} onChange={(event) => patch("responsible", event.target.value)} placeholder="Nome da pessoa ou equipe" /></label><label>Situação da chave<select aria-label="Situação da chave" value={value.keyStatus} onChange={(event) => patch("keyStatus", event.target.value)}>{keyStatuses.map((status) => <option key={status}>{status}</option>)}</select></label><label>Imobiliária com a chave<input maxLength={120} value={value.keyAgency} onChange={(event) => patch("keyAgency", event.target.value)} placeholder="Nome da imobiliária" /></label><label>Local / responsável pela chave<input maxLength={120} value={value.keyLocation} onChange={(event) => patch("keyLocation", event.target.value)} placeholder="Recepção, chaveiro ou pessoa que retirou" /></label><label>Identificação / cópias da chave<input maxLength={120} value={value.keyCount} onChange={(event) => patch("keyCount", event.target.value)} placeholder="Ex.: chave 12 · duas cópias" /></label></div><button className="button button-dark">Salvar informações</button><p role="status">{message}</p></form></section>
  <section className="team-panel"><h2>Anotações internas</h2><form onSubmit={(event) => { event.preventDefault(); if (!note.trim()) return; const next = { ...value, notes: [...value.notes, { id: crypto.randomUUID(), text: note.trim(), at: new Date().toISOString() }].slice(-30) }; if (onSave(next)) { setValue(next); setNote(""); setMessage("Anotação salva."); } }}><label className="team-note-label">Nova anotação<textarea maxLength={2000} rows={3} required value={note} onChange={(event) => setNote(event.target.value)} placeholder="Detalhes da visita, pendências ou orientações para a equipe" /></label><button className="button button-outline" disabled={!note.trim()}>Adicionar anotação</button></form><div className="team-notes">{value.notes.length ? [...value.notes].reverse().map((item) => <article key={item.id}><time dateTime={item.at}>{new Date(item.at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" })}</time><p>{item.text}</p><button onClick={() => { const next = { ...value, notes: value.notes.filter((note) => note.id !== item.id) }; if (onSave(next)) setValue(next); }} aria-label={`Excluir anotação de ${property.reference}`}>Excluir anotação</button></article>) : <p>Nenhuma anotação por enquanto.</p>}</div></section></>;
}

function DevelopmentEditor({ value, onSave, onCancel }: { value: Development; onSave: (value: Development) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState(value);
  function submit(event: FormEvent) { event.preventDefault(); onSave({ ...draft, name: draft.name.trim(), city: draft.city.trim(), matchName: draft.matchName || draft.name.trim() }); }
  return <form className="team-development-form" onSubmit={submit}><h3>{value.name ? "Editar empreendimento" : "Novo empreendimento"}</h3><div className="team-fields">{([["name", "Nome do empreendimento"], ["city", "Cidade do empreendimento"], ["neighborhood", "Bairro do empreendimento"], ["address", "Endereço do empreendimento"]] as const).map(([key, label]) => <label key={key}>{label}<input required={key === "name" || key === "city"} maxLength={120} value={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} /></label>)}<label>Estágio<select value={draft.stage} onChange={(event) => setDraft({ ...draft, stage: event.target.value })}>{["Não informado", "Lançamento", "Em obras", "Pronto"].map((stage) => <option key={stage}>{stage}</option>)}</select></label></div><label className="team-note-label">Sobre o empreendimento<textarea rows={3} maxLength={2000} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label><div className="team-actions"><button className="button button-gold">Salvar empreendimento</button><button type="button" className="text-link" onClick={onCancel}>Cancelar</button></div></form>;
}
