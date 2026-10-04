"use client";
import { useState } from "react";
import { ArrowUpRight, Calculator, X } from "lucide-react";
import { Modal } from "./modal";
import { Financing } from "./financing";
export function FinancingOpportunity() {
  const [open, setOpen] = useState(false), [value, setValue] = useState("850000");
  return <section className="financing-opportunity" aria-labelledby="finance-opportunity-title"><div className="container financing-opportunity-inner"><div className="financing-opportunity-mark" aria-hidden="true"><Calculator size={40} strokeWidth={1} /></div><div><span className="eyebrow">UM NOVO ENDEREÇO, UM PLANO POSSÍVEL</span><h2 id="finance-opportunity-title">Seu próximo capítulo<br /><em>pode começar com uma simulação.</em></h2><p>Explore entrada, prazo e parcelas para planejar a compra do seu imóvel com mais clareza.</p></div><button className="button button-gold" onClick={() => setOpen(true)}>Explorar financiamento <ArrowUpRight size={17} /></button></div>{open && <Modal title="Planejar financiamento" className="opportunity-modal" onClose={() => setOpen(false)}><span className="eyebrow">PLANEJAMENTO</span><h2>Comece pelo valor do imóvel.</h2><label className="opportunity-price">Valor do imóvel (R$)<input aria-label="Valor do imóvel para simular" type="number" min="1" max="1000000000" value={value} onChange={(event) => setValue(event.target.value)} /></label>{Number(value) > 0 && Number(value) <= 1e9 ? <Financing key={value} price={Number(value)} /> : <p role="alert">Informe um valor entre R$ 1 e R$ 1 bilhão para simular.</p>}<button className="text-link" onClick={() => setOpen(false)}>Fechar simulação <X size={14} /></button></Modal>}</section>;
}
