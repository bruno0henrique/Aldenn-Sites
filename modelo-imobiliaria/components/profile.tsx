"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, LogOut, UserRound } from "lucide-react";
import { Modal } from "./modal";
import { useLocalCatalog } from "./local-catalog";

export function Profile() {
  const { staff, login, logout } = useLocalCatalog();
  const [open, setOpen] = useState(false);
  useEffect(() => { const show = () => setOpen(true); window.addEventListener("aldenn:profile", show); return () => window.removeEventListener("aldenn:profile", show); }, []);
  return <>
    <button className="icon-button profile-button" aria-label={staff ? "Meu perfil" : "Entrar / perfil"} onClick={() => setOpen(true)}><UserRound size={19} /><span className="profile-dot" hidden={!staff} /></button>
    {open && createPortal(<Modal title={staff ? "Meu perfil" : "Entrar no perfil"} className="profile-modal" onClose={() => setOpen(false)}>
      <span className="eyebrow">ALDENN IMÓVEIS</span>
      {staff ? <><h2>Meu perfil</h2><p>Você está conectado neste navegador.</p><button className="button button-outline profile-signout" onClick={logout}><LogOut size={16} /> Sair</button></> : <><h2>Entrar</h2><p>Acesse seu perfil.</p><form className="contact-form" onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); login(); }}><label>E-mail<input type="email" name="email" autoComplete="off" defaultValue="equipe@aldenn.com.br" required maxLength={100} /></label><label>Senha<input name="password" type="password" autoComplete="off" placeholder="Uma senha de exemplo" required minLength={4} maxLength={100} /></label><button className="button button-gold">Entrar <ArrowUpRight size={17} /></button><small className="profile-hint">Use dados de exemplo. Credenciais não são enviadas nem salvas.</small></form></>}
    </Modal>, document.body)}
  </>;
}
