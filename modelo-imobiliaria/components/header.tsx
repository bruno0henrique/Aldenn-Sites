"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronDown, Menu, X } from "lucide-react";
import { asset } from "@/lib/format";
import { Profile } from "./profile";
import { Promote } from "./promote";
import { Contact } from "./contact";

export function Header() {
  const [open, setOpen] = useState(false);
  const directories = useRef<HTMLDetailsElement>(null);
  useEffect(() => { const close = (event: PointerEvent) => { if (directories.current && !directories.current.contains(event.target as Node)) directories.current.removeAttribute("open"); }; document.addEventListener("pointerdown", close); return () => document.removeEventListener("pointerdown", close); }, []);
  const home = usePathname() === "/";
  return <>
    <div className="demo-bar"><span>Uma experiência demonstrativa da Aldenn</span><a href="https://www.aldenn.com.br"><ArrowLeft size={12} /> Voltar à Aldenn</a></div>
    <header className={home ? "header header-home" : "header"}><div className="header-inner">
      <Link className="brand" href="/" aria-label="Aldenn Imóveis, início" onClick={() => setOpen(false)}><Image src={asset("/brand/aldenn-wordmark.svg")} alt="Aldenn" width={138} height={32} priority /><span>IMÓVEIS</span></Link>
      <nav className={open ? "navigation is-open" : "navigation"} aria-label="Navegação principal">
        <a href={asset("/?purpose=venda#imoveis")} onClick={() => setOpen(false)}>Comprar</a>
        <a href={asset("/?purpose=locacao#imoveis")} onClick={() => setOpen(false)}>Alugar</a>
        <Promote onOpen={() => setOpen(false)} />
        <details className="header-registrations" ref={directories} onKeyDown={(event) => { if (event.key === "Escape") directories.current?.removeAttribute("open"); }}><summary>Cadastros <ChevronDown size={14} /></summary><div>{[["/equipe/cadastros/", "Todos os cadastros"], ["/equipe/cadastro/", "Imóveis"], ["/equipe/proprietarios/", "Proprietários"], ["/equipe/inquilinos/", "Inquilinos"]].map(([href, label]) => <Link href={href} key={href} onClick={() => { directories.current?.removeAttribute("open"); setOpen(false); }}>{label}</Link>)}</div></details>
        <Contact variant="header" />
      </nav>
      <div className="header-tools"><Link className="header-team" href="/equipe/" onClick={() => setOpen(false)}>Equipe</Link><Profile />
      <button className="icon-button menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>{open ? <X /> : <Menu />}</button></div>
    </div></header>
  </>;
}
