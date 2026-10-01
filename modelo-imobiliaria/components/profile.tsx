"use client";
import { useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, LogOut, Plus, UserRound } from "lucide-react";
import { properties as examples } from "@/data/properties";
import { asset, money } from "@/lib/format";
import { propertyHref } from "@/lib/local-properties";
import type { Property, PropertyImage } from "@/lib/property";
import { Modal } from "./modal";
import { useLocalCatalog } from "./local-catalog";

export function Profile() {
  const { staff, login, logout, local, remove } = useLocalCatalog();
  const [open, setOpen] = useState(false), [editing, setEditing] = useState<Property | null | undefined>(undefined), [deleting, setDeleting] = useState<string | null>(null), [error, setError] = useState("");
  return <>
    <button className="icon-button profile-button" aria-label={staff ? "Meu perfil" : "Entrar / perfil"} onClick={() => { setEditing(undefined); setDeleting(null); setError(""); setOpen(true); }}><UserRound size={19} /><span className="profile-dot" hidden={!staff} /></button>
    {open && createPortal(<Modal title={staff ? "Área da equipe" : "Entrar no perfil"} className={staff ? "staff-modal" : "profile-modal"} onClose={() => setOpen(false)}>
      {!staff ? <><span className="eyebrow">ALDENN IMÓVEIS</span><h2>Seu espaço por aqui.</h2><p>Acesse a área da equipe para cadastrar e organizar imóveis.</p><form className="contact-form" onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); login(); }}><label>E-mail<input type="email" name="email" autoComplete="off" defaultValue="equipe@aldenn.com.br" required maxLength={100} /></label><label>Senha<input name="password" type="password" autoComplete="off" placeholder="Uma senha de exemplo" required minLength={4} maxLength={100} /></label><button className="button button-gold">Entrar <ArrowUpRight size={17} /></button><small className="profile-hint">Use dados de exemplo. Credenciais não são enviadas nem salvas.</small></form><button className="profile-preview" onClick={login}>Conhecer a área da equipe <ArrowUpRight size={14} /></button></>
      : editing !== undefined ? <><button className="back-link" onClick={() => setEditing(undefined)}><ArrowLeft size={15} /> Meus imóveis</button><span className="eyebrow">ÁREA DA EQUIPE</span><h2>{editing ? "Ajuste os detalhes." : "Um novo endereço."}</h2><p>{editing ? "Atualize a apresentação deste imóvel." : "Preencha os detalhes para adicionar o imóvel à seleção."}</p><PropertyForm key={editing?.reference || "new"} property={editing} onSaved={() => setEditing(undefined)} /></>
      : <><span className="eyebrow">ÁREA DA EQUIPE</span><div className="staff-heading"><div><h2>Olá, equipe.</h2><p>Novos endereços começam aqui.</p></div><button className="profile-signout" onClick={() => { logout(); setEditing(undefined); }}><LogOut size={15} /> Sair</button></div><div className="staff-toolbar"><h3>Meus imóveis <span>{local.length}</span></h3><button className="button button-gold" onClick={() => setEditing(null)}><Plus size={17} /> Cadastrar imóvel</button></div>{local.length === 0 ? <div className="staff-empty"><UserRound size={28} strokeWidth={1} /><h3>Sua seleção começa aqui.</h3><p>Adicione o primeiro imóvel e veja como ele aparece no site.</p></div> : <div className="staff-list">{local.map((item) => <article key={item.reference}><Image src={asset(item.images[0].path)} alt="" width={88} height={76} /><div><strong>{item.title}</strong><small>{item.neighborhood} · {item.city}</small><span>{money(item.price)}{item.purpose === "locacao" && " / mês"}</span><div className="staff-actions"><Link href={propertyHref(item)} onClick={() => setOpen(false)}>Ver anúncio</Link><button onClick={() => setEditing(item)}>Editar</button><button onClick={() => setDeleting(item.reference)}>Excluir</button></div>{deleting === item.reference && <div className="delete-confirm"><span>Excluir este cadastro?</span><button onClick={() => { try { remove(item.reference); setDeleting(null); } catch (reason) { setError((reason as Error).message); } }}>Confirmar exclusão</button><button onClick={() => setDeleting(null)}>Cancelar</button></div>}</div></article>)}</div>}{error && <p role="alert" className="ai-error">{error}</p>}<p className="profile-hint">Seus cadastros ficam neste navegador. Os imóveis da seleção original são preservados.</p></>}
    </Modal>, document.body)}
  </>;
}

function PropertyForm({ property, onSaved }: { property: Property | null; onSaved: () => void }) {
  const { save } = useLocalCatalog();
  const [photos, setPhotos] = useState<PropertyImage[]>(property?.images || examplePhotos(examples[0]));
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError(""); setBusy(true);
    try {
      if (files.length > 6) throw new Error("Escolha até seis fotos.");
      const next: PropertyImage[] = [];
      for (const file of Array.from(files)) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error("Use JPG, PNG ou WebP de até 5 MB por foto.");
        const bitmap = await createImageBitmap(file);
        try { const scale = Math.min(1, 1024 / Math.max(bitmap.width, bitmap.height)); const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale)); canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height); const path = canvas.toDataURL("image/webp", 0.72); if (path.length > 700000) throw new Error("Esta foto ainda ficou grande. Escolha uma imagem menor."); next.push({ path, thumbnail: path, width: canvas.width, height: canvas.height, sourceUrl: "", sha256: "", author: "Foto cadastrada pela equipe" }); } finally { bitmap.close(); }
      }
      setPhotos(next);
    } catch (reason) { setError((reason as Error).message); } finally { setBusy(false); }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (busy) return;
    const data = new FormData(event.currentTarget), text = (key: string) => String(data.get(key) || "").trim(), numeric = (key: string, optional = false) => optional && !text(key) ? null : Number(text(key));
    const color = text("color");
    const item: Property = { reference: property?.reference || `LOCAL-${crypto.randomUUID()}`, slug: "cadastrado", title: text("title"), subtitle: text("subtitle") || "Um lugar para viver novas histórias.", purpose: text("purpose") as Property["purpose"], type: text("type") as Property["type"], city: text("city"), neighborhood: text("neighborhood"), development: text("development"), price: numeric("price")!, condominium: numeric("condominium", true), iptu: numeric("iptu", true), builtArea: numeric("builtArea"), landArea: numeric("landArea", true), bedrooms: numeric("bedrooms")!, suites: numeric("suites")!, bathrooms: numeric("bathrooms", true), parking: numeric("parking")!, description: [text("description")], features: text("features").split(",").map((item) => item.trim()).filter(Boolean), amenities: [], colors: color ? [color] : [], images: photos, sourceUrl: "", consultedAt: property?.consultedAt || new Date().toISOString() };
    try { save(item); onSaved(); } catch (reason) { setError((reason as Error).message); }
  }
  return <form className="property-form" onSubmit={submit}>
    <fieldset><legend>Apresentação</legend><div className="staff-fields"><label className="full-field">Título<input name="title" defaultValue={property?.title} required maxLength={120} placeholder="Ex.: Casa com piscina no Urbanova" /></label><label>Finalidade<select aria-label="Finalidade" name="purpose" defaultValue={property?.purpose || "venda"}><option value="venda">Venda</option><option value="locacao">Locação</option></select></label><label>Tipo<select aria-label="Tipo" name="type" defaultValue={property?.type || "Casa"}><option>Casa</option><option>Apartamento</option></select></label><label>Cidade<input name="city" defaultValue={property?.city} required maxLength={120} /></label><label>Bairro<input name="neighborhood" defaultValue={property?.neighborhood} required maxLength={120} /></label><label className="full-field">Condomínio / empreendimento<input name="development" defaultValue={property?.development} maxLength={120} placeholder="Opcional" /></label><label className="full-field">Frase de destaque<input name="subtitle" defaultValue={property?.subtitle} maxLength={120} placeholder="Ex.: Luz natural e espaço para receber." /></label><label className="full-field">Descrição<textarea name="description" defaultValue={property?.description.join("\n\n")} rows={4} required maxLength={2000} /></label></div></fieldset>
    <fieldset><legend>Valores e características</legend><div className="staff-fields">{([["price", "Preço de venda / aluguel mensal (R$)", true, 1, 1e9], ["condominium", "Condomínio mensal (R$)", false, 0, 1e7], ["iptu", "IPTU mensal (R$)", false, 0, 1e7], ["builtArea", "Área construída (m²)", true, 1, 1e6], ["landArea", "Terreno (m²)", false, 0, 1e6], ["bedrooms", "Dormitórios", true, 0, 30], ["suites", "Suítes", true, 0, 30], ["bathrooms", "Banheiros", false, 0, 30], ["parking", "Vagas", true, 0, 30]] as const).map(([key, label, required, min, max]) => <label key={key}>{label}<input name={key} type="number" inputMode="decimal" step={max === 30 ? "1" : "0.01"} min={min} max={max} required={required} defaultValue={property?.[key] ?? (max === 30 && required ? 0 : "")} placeholder={required ? "" : "Não informado"} /></label>)}<label>Cor / tom<select aria-label="Cor / tom" name="color" defaultValue={property?.colors?.[0] || ""}><option value="">Não informado</option>{["branca", "bege", "cinza", "preta", "marrom", "azul", "verde", "vermelha"].map((color) => <option key={color} value={color}>{color}</option>)}</select></label><label className="full-field">Diferenciais<input name="features" defaultValue={property?.features.join(", ")} maxLength={1000} placeholder="Piscina, varanda, escritório… separados por vírgula" /></label></div></fieldset>
    <fieldset><legend>Fotografias</legend><label className="photo-preset">Começar com uma galeria<select aria-label="Galeria inicial" defaultValue="" onChange={(event) => { const item = examples.find((item) => item.reference === event.target.value); if (item) setPhotos(examplePhotos(item)); }}><option value="">Escolha uma galeria da seleção</option>{examples.map((item) => <option key={item.reference} value={item.reference}>{item.title} · {item.reference}</option>)}</select></label><label className="photo-upload">Ou adicionar suas fotos<input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={(event) => { void upload(event.target.files); event.target.value = ""; }} /><small>Até 6 fotos de 5 MB. A primeira será a capa.</small></label><div className="staff-photo-strip">{photos.map((image, index) => <Image key={index} src={asset(image.path)} alt={`Foto ${index + 1}${index === 0 ? ", capa" : ""}`} width={100} height={75} />)}</div></fieldset>
    {error && <p className="ai-error" role="alert">{error}</p>}<p className="profile-hint">O cadastro aparece na seleção deste navegador, sem envio de arquivos ou dados.</p><button className="button button-gold" disabled={busy} type="submit">{busy ? "Preparando fotos…" : property ? "Salvar alterações" : "Publicar imóvel"}<ArrowUpRight size={17} /></button>
  </form>;
}
function examplePhotos(property: Property) { return property.images.slice(0, 6).map((image) => ({ ...image, thumbnail: image.path })); }
