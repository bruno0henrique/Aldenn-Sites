"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, MessageCircle, Send } from "lucide-react";
import { Modal } from "./modal";

export function Contact({ property = "a seleção de imóveis", reference, variant = "buttons" }: { property?: string; reference?: string; variant?: "buttons" | "header" | "footer" }) {
  const [mode, setMode] = useState<"form" | "whatsapp" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  function open(value: "form" | "whatsapp") { setSubmitted(false); setMode(value); }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmitted(true); }
  const message = `Olá! Tenho interesse em ${property}${reference ? ` (ref. ${reference})` : ""} e gostaria de saber mais.`;
  return <>
    {variant === "buttons" ? <div className="contact-buttons">
      <button className="button button-gold" onClick={() => open("form")}>Solicitar contato <ArrowUpRight size={18} /></button>
      <button className="button button-outline" onClick={() => open("whatsapp")}><MessageCircle size={18} /> Conversar pelo WhatsApp</button>
      <p className="microcopy">Atendimento demonstrativo. Nenhuma mensagem é enviada.</p>
    </div> : <button className={variant === "header" ? "header-contact" : "text-link"} onClick={() => open("form")}>{variant === "header" ? "Contato" : "Experimentar o atendimento"}<ArrowUpRight size={16} /></button>}
    {mode && <Modal title={mode === "form" ? "Solicitar contato" : "Prévia do WhatsApp"} onClose={() => setMode(null)}>
      <span className="eyebrow">ALDENN IMÓVEIS · DEMONSTRAÇÃO</span>
      {mode === "whatsapp" ? <>
        <h2>Uma conversa começa aqui.</h2>
        <p>Prévia do contato sobre este imóvel.</p>
        <div className="chat-preview"><div className="chat-heading"><MessageCircle size={20} /><strong>Aldenn Imóveis</strong><span>Prévia</span></div><div className="chat-message">{message}<span>Mensagem demonstrativa <Check size={14} /></span></div></div>
        <p className="notice">Esta conversa é uma simulação. Não há envio ao WhatsApp nem atendimento real.</p>
        <button className="button button-dark" onClick={() => open("form")}>Experimentar solicitação <ArrowUpRight size={18} /></button>
      </> : submitted ? <div className="contact-success" role="status"><span className="success-icon"><Check /></span><h2>Simulação concluída.</h2><p>Em uma imobiliária real, a equipe receberia seu interesse em <strong>{property}</strong>.</p><p className="notice">Nenhuma mensagem foi enviada. Seus dados não foram armazenados.</p><button className="button button-dark" onClick={() => setMode(null)}>Voltar aos imóveis</button></div> : <>
        <h2>Vamos falar sobre seu próximo endereço?</h2>
        <p>{reference ? `${property} · Ref. ${reference}` : "Experimente como seria solicitar um atendimento."}</p>
        <form className="contact-form" onSubmit={submit}>
          <label>Seu nome<input name="name" autoComplete="off" placeholder="Como podemos chamar você?" required minLength={2} maxLength={100} pattern=".*\S.*" /></label>
          <label>Telefone / WhatsApp<input name="phone" type="tel" inputMode="tel" autoComplete="off" placeholder="(11) 99999-9999" required maxLength={20} pattern="(?:\+?55\s?)?(?:\(?[1-9][0-9]\)?\s?)[0-9]{4,5}[\s-]?[0-9]{4}" title="Informe um telefone brasileiro com DDD e 10 ou 11 dígitos." /></label>
          <label>Mensagem<textarea name="message" required minLength={5} maxLength={1000} defaultValue={message} rows={3} /></label>
          <p className="notice">Formulário demonstrativo. Use dados fictícios para testar. Nada é enviado ou salvo.</p>
          <button className="button button-gold" type="submit">Simular solicitação <Send size={17} /></button>
        </form>
      </>}
    </Modal>}
  </>;
}
