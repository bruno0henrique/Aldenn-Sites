"use client";
import { Check, X, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { momentForCategory, referenceEvent } from "@/lib/catalog";
import { createWhatsAppUrl, moments, preferences, referenceForMoment, selectedReference, stages } from "@/lib/planner";
function ChoiceGroup({ legend, options, value, onChange }: { legend: string; options: string[]; value: string; onChange: (value: string) => void }) {
 return <fieldset className="choice-group"><legend>{legend}</legend><div className="choice-list">{options.map((option) => <button key={option} type="button" className={`choice ${value === option ? "is-selected" : ""}`} aria-pressed={value === option} onClick={() => onChange(option)}>{value === option && <Check size={15} aria-hidden="true" />}{option}</button>)}</div></fieldset>;
}
export function VisitPlanner() {
 const [moment, setMoment] = useState("");
 const [preference, setPreference] = useState("");
 const [stage, setStage] = useState("");
 const [eventDate, setEventDate] = useState("");
 const [referenceId, setReferenceId] = useState("");
 useEffect(() => {
  const select = (event: Event) => {
   const id = (event as CustomEvent<unknown>).detail;
   if (typeof id !== "string") return;
   const dress = selectedReference(id);
   if (!dress) return;
   setMoment(momentForCategory[dress.category]); setReferenceId(dress.id);
  };
  window.addEventListener(referenceEvent, select);
  return () => window.removeEventListener(referenceEvent, select);
 }, []);
 const reference = referenceForMoment(referenceId, moment);
 const whatsapp = createWhatsAppUrl({ moment, preference, stage, eventDate, referenceId });
 return <div className="planner-card" data-reveal>
  <ChoiceGroup legend="Qual é o seu momento?" options={moments} value={moment} onChange={(value) => { if (value !== moment) setReferenceId(""); setMoment(value); }} />
  <div className="planner-reference" aria-live="polite">{reference && <><span>Referência escolhida: <strong>{reference.title}</strong> · {reference.category}</span><button type="button" aria-label="Remover referência" onClick={() => setReferenceId("")}><X size={16} aria-hidden="true" /></button></>}</div>
  <ChoiceGroup legend="Que estilo mais combina com você?" options={preferences} value={preference} onChange={setPreference} />
  <ChoiceGroup legend="Em que etapa da escolha você está?" options={stages} value={stage} onChange={setStage} />
  <div className="planner-date"><label htmlFor="event-date">Quando será o evento? <span>Opcional</span></label><input id="event-date" type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} /></div>
  <div className="planner-result" aria-live="polite"><div><strong>{whatsapp ? "Suas escolhas estão prontas." : "Vamos reunir suas escolhas?"}</strong><p>{whatsapp ? "Confira a mensagem no WhatsApp antes de enviar para a Aldenn." : "Escolha uma opção em cada etapa para preparar a mensagem."}</p></div>
   <a className={`button ${whatsapp ? "" : "is-disabled"}`} href={whatsapp ?? "#planejador"} aria-disabled={!whatsapp} target={whatsapp ? "_blank" : undefined} rel="noreferrer" onClick={(event) => { if (!whatsapp) event.preventDefault(); }}>Conversar com a Aldenn<ArrowUpRight size={18} aria-hidden="true" /></a>
  </div><p className="planner-privacy">Demonstração sem armazenamento de dados. Nada é enviado automaticamente.</p>
 </div>;
}
