"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, MessageCircle, Send } from "lucide-react";
import { Modal } from "./modal";

export function Contact({ property = "a seleção de imóveis", reference, variant = "buttons" }: { property?: string; reference?: string; variant?: "buttons" | "header" | "footer" | "floating" }) {
  const [mode, setMode] = useState<"form" | "whatsapp" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  function open(value: "form" | "whatsapp") { setSubmitted(false); setMode(value); }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmitted(true); }
  const message = `Olá! Tenho interesse em ${property}${reference ? ` (ref. ${reference})` : ""} e gostaria de saber mais.`;
  return <>
    {variant === "floating" ? <button className="whatsapp-floating" aria-label="Conversar pelo WhatsApp, atendimento demonstrativo" onClick={() => open("whatsapp")}><svg viewBox="0 0 32 32" width="25" height="25" aria-hidden="true"><path fill="currentColor" d="M16 .8A15.1 15.1 0 0 0 2.9 23.4L.8 31.2l8-2.1A15.2 15.2 0 1 0 16 .8Zm0 27.7a12.5 12.5 0 0 1-6.4-1.8l-.5-.3-4.8 1.3 1.3-4.7-.3-.5A12.6 12.6 0 1 1 16 28.5Zm7-9.4c-.4-.2-2.2-1.1-2.6-1.2-.3-.1-.6-.2-.8.2-.3.4-1 1.2-1.2 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8l.6-.7.4-.6c.1-.2 0-.5 0-.7l-1.2-2.8c-.3-.7-.6-.6-.8-.6h-.7c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.5 1.5 3.7c.2.3 2.6 4 6.3 5.6.9.4 1.6.6 2.1.7.9.3 1.8.2 2.5.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.3-.8-.5Z" /></svg></button> : variant === "buttons" ? <div className="contact-buttons">
      <button className="button button-gold" onClick={() => open("whatsapp")}><MessageCircle size={18} /> Conversar pelo WhatsApp</button>
      <button className="button button-outline" onClick={() => open("form")}>Solicitar contato <ArrowUpRight size={18} /></button>
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
          <label>Seu nome<input name="name" autoComplete="off" placeholder="Seu nome completo" required minLength={2} maxLength={100} pattern=".*\S.*" /></label>
          <label>Telefone / WhatsApp<input name="phone" type="tel" inputMode="tel" autoComplete="off" placeholder="(11) 99999-9999" required maxLength={20} pattern="(?:\+?55\s?)?(?:\(?[1-9][0-9]\)?\s?)[0-9]{4,5}[\s-]?[0-9]{4}" title="Informe um telefone brasileiro com DDD e 10 ou 11 dígitos." /></label>
          <label>Mensagem<textarea name="message" required minLength={5} maxLength={1000} defaultValue={message} rows={3} /></label>
          <p className="notice">Formulário demonstrativo. Use dados fictícios para testar. Nada é enviado ou salvo.</p>
          <button className="button button-gold" type="submit">Simular solicitação <Send size={17} /></button>
        </form>
      </>}
    </Modal>}
  </>;
}
