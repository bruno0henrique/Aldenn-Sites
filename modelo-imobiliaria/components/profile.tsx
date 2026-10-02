"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, LogOut, Plus, UserRound } from "lucide-react";
import { asset, money } from "@/lib/format";
import { propertyHref } from "@/lib/local-properties";
import { Modal } from "./modal";
import { useLocalCatalog } from "./local-catalog";

export function Profile() {
  const { staff, login, logout, local, remove } = useLocalCatalog();
  const [open, setOpen] = useState(false), [deleting, setDeleting] = useState<string | null>(null), [error, setError] = useState("");
  useEffect(() => { const show = () => setOpen(true); window.addEventListener("aldenn:profile", show); return () => window.removeEventListener("aldenn:profile", show); }, []);
  return <>
    <button className="icon-button profile-button" aria-label={staff ? "Meu perfil" : "Entrar / perfil"} onClick={() => { setDeleting(null); setError(""); setOpen(true); }}><UserRound size={19} /><span className="profile-dot" hidden={!staff} /></button>
    {open && createPortal(<Modal title={staff ? "Área da equipe" : "Entrar no perfil"} className={staff ? "staff-modal" : "profile-modal"} onClose={() => setOpen(false)}>
      {!staff ? <><span className="eyebrow">ALDENN IMÓVEIS</span><h2>Seu espaço por aqui.</h2><p>Acesse a área da equipe para cadastrar e organizar imóveis.</p><form className="contact-form" onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); login(); }}><label>E-mail<input type="email" name="email" autoComplete="off" defaultValue="equipe@aldenn.com.br" required maxLength={100} /></label><label>Senha<input name="password" type="password" autoComplete="off" placeholder="Uma senha de exemplo" required minLength={4} maxLength={100} /></label><button className="button button-gold">Entrar <ArrowUpRight size={17} /></button><small className="profile-hint">Use dados de exemplo. Credenciais não são enviadas nem salvas.</small></form><button className="profile-preview" onClick={login}>Conhecer a área da equipe <ArrowUpRight size={14} /></button></>
      : <><span className="eyebrow">ÁREA DA EQUIPE</span><div className="staff-heading"><div><h2>Olá, equipe.</h2><p>Novos endereços começam aqui.</p></div><button className="profile-signout" onClick={() => { logout(); }}><LogOut size={15} /> Sair</button></div><div className="staff-toolbar"><h3>Meus imóveis <span>{local.length}</span></h3><Link className="button button-gold" href="/equipe/cadastro/" onClick={() => setOpen(false)}><Plus size={17} /> Cadastrar imóvel</Link></div>{local.length === 0 ? <div className="staff-empty"><UserRound size={28} strokeWidth={1} /><h3>Sua seleção começa aqui.</h3><p>Adicione o primeiro imóvel e veja como ele aparece no site.</p></div> : <div className="staff-list">{local.map((item) => <article key={item.reference}><Image src={asset(item.images[0].path)} alt="" width={88} height={76} /><div><strong>{item.title}</strong><small>{item.neighborhood} · {item.city}</small><span>{money(item.price)}{item.purpose === "locacao" && " / mês"}</span><div className="staff-actions"><Link href={propertyHref(item)} onClick={() => setOpen(false)}>Ver anúncio</Link><Link href={`/equipe/cadastro/?ref=${encodeURIComponent(item.reference)}`} onClick={() => setOpen(false)}>Editar</Link><button onClick={() => setDeleting(item.reference)}>Excluir</button></div>{deleting === item.reference && <div className="delete-confirm"><span>Excluir este cadastro?</span><button onClick={() => { try { remove(item.reference); setDeleting(null); } catch (reason) { setError((reason as Error).message); } }}>Confirmar exclusão</button><button onClick={() => setDeleting(null)}>Cancelar</button></div>}</div></article>)}</div>}{error && <p role="alert" className="ai-error">{error}</p>}<p className="profile-hint">Seus cadastros ficam neste navegador. Os imóveis da seleção original são preservados.</p></>}
    </Modal>, document.body)}
  </>;
}
