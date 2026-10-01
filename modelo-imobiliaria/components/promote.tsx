"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Check, TrendingUp } from "lucide-react";
import { useLocalCatalog } from "./local-catalog";
import { asset, money } from "@/lib/format";
import { boostPlans, type BoostPlan } from "@/lib/promotions";
import { Modal } from "./modal";
import { usePromotions } from "./promotion-provider";

const date = (timestamp: number) => new Date(timestamp).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
export function Promote({ onOpen }: { onOpen?: () => void }) {
  const { properties } = useLocalCatalog();
  const pathname = usePathname();
  const { campaigns, promote, stop } = usePromotions();
  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState(properties[0].reference);
  const [plan, setPlan] = useState<BoostPlan>("week");
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [previewAt, setPreviewAt] = useState(0);
  const [saved, setSaved] = useState(true);
  const property = properties.find((item) => item.reference === reference)!;
  const selected = boostPlans.find((item) => item.id === plan)!;
  const existing = campaigns.find((item) => item.reference === reference);
  return <>
    <button className="nav-promote" onClick={() => { setReference(properties.find((item) => item.reference.startsWith("LOCAL-") ? item.reference === new URLSearchParams(window.location.search).get("ref") : pathname.includes(item.slug))?.reference || properties[0].reference); setConfirmed(null); setPreviewAt(Date.now()); setOpen(true); onOpen?.(); }}><TrendingUp size={15} /> Promover</button>
    {open && createPortal(<Modal title="Promover imóvel" className="promotion-modal" onClose={() => setOpen(false)}>
      <span className="eyebrow"><TrendingUp size={15} /> MAIS VISIBILIDADE</span>
      <h2>Seu imóvel, em destaque.</h2>
      <p>Experimente um boost e veja seu anúncio ganhar espaço na seleção.</p>
      <form className="promotion-form" onSubmit={(event) => { event.preventDefault(); setSaved(promote(reference, plan)); setConfirmed(reference); }}>
        <label className="promotion-property-label">Qual imóvel você quer promover?<select aria-label="Imóvel para promover" value={reference} onChange={(event) => { setReference(event.target.value); setConfirmed(null); }}>
          {properties.map((item) => <option key={item.reference} value={item.reference}>{item.title} · {item.purpose === "venda" ? "Venda" : "Aluguel"} · {item.reference}</option>)}
        </select></label>
        <div className="promotion-preview"><Image src={asset(property.images[0].thumbnail)} alt="" width={112} height={84} /><div><strong>{property.title}</strong><span>{property.neighborhood} · {property.city}</span><small>Ref. {property.reference} · {money(property.price)}{property.purpose === "locacao" ? " / mês" : ""}</small></div></div>
        <fieldset className="boost-plans"><legend>Escolha o tempo do boost</legend>{boostPlans.map((item) => <label key={item.id} className={plan === item.id ? "boost-plan is-selected" : "boost-plan"}><input type="radio" name="boost-plan" value={item.id} checked={plan === item.id} onChange={() => { setPlan(item.id); setConfirmed(null); }} /><span className="boost-choice"><strong>{item.id === "until-sold" && property.purpose === "locacao" ? "Até alugar" : item.label}</strong><span>{money(item.price)}<small>valor total</small></span></span><small>{item.description}</small>{item.id === "until-sold" && <span className="boost-recommendation">MELHOR OPÇÃO</span>}</label>)}</fieldset>
        <div className="boost-summary"><div><span>Investimento simulado</span><strong>{money(selected.price)}</strong></div><p>{selected.days === null ? "Ativo até você encerrar a promoção. Sem renovação ou mensalidade." : `${selected.days} dias a partir da ativação, até ${date(previewAt + selected.days * 86400000)}. Encerra automaticamente.`}</p>{existing && <p>Este imóvel já tem boost. Ao confirmar, o novo prazo substitui o anterior.</p>}</div>
        <p className="boost-policy">Até três anúncios promovidos aparecem primeiro, somente quando atendem à localização e a todos os filtros da busca. Se houver mais, os três ativados mais recentemente têm prioridade.</p>
        <p className="notice">Demonstração: preços fictícios, sem cobrança ou pagamento. A promoção vale apenas neste navegador e não altera o site para outras pessoas.</p>
        {confirmed === reference ? <div className="boost-success" role="status"><Check size={19} /><div><strong>Promoção ativada.</strong><p>{saved ? "O boost continua ativo após recarregar esta demonstração." : "Seu navegador não permite salvar: o boost vale enquanto esta página estiver aberta."}</p></div></div> : <button className="button button-gold" type="submit">{existing ? "Atualizar boost simulado" : "Simular promoção"}<ArrowUpRight size={17} /></button>}
        {confirmed === reference && <button className="button button-dark" type="button" onClick={() => { setOpen(false); if (pathname !== "/") window.location.assign(asset("/#imoveis")); else document.getElementById("imoveis")?.scrollIntoView({ behavior: "instant" }); }}>Ver os destaques <ArrowUpRight size={17} /></button>}
      </form>
      {campaigns.length > 0 && <section className="active-boosts" aria-label="Promoções ativas"><h3>Seus boosts ativos <span>{campaigns.length}</span></h3>{campaigns.filter((campaign) => properties.some((item) => item.reference === campaign.reference)).map((campaign) => { const item = properties.find((item) => item.reference === campaign.reference)!; return <div key={campaign.reference}><div><strong>{item.title}</strong><small>{campaign.expiresAt === null ? "Até encerrar a promoção" : `Até ${date(campaign.expiresAt)}`} · Ref. {item.reference}</small></div><button type="button" aria-label={`Encerrar boost ${item.reference}`} onClick={() => { stop(item.reference); if (confirmed === item.reference) setConfirmed(null); }}>Encerrar</button></div>; })}</section>}
    </Modal>, document.body)}
  </>;
}
