"use client";

import { Check, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { contact } from "@/lib/taeko";

const moments = ["Casamento", "Debutante", "Madrinha", "Outro momento"];
const preferences = [
  "Renda delicada",
  "Clássico e romântico",
  "Leve e minimalista",
  "Ainda estou descobrindo",
];

function ChoiceGroup({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="choice-group">
      <legend>{legend}</legend>
      <div className="choice-list">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={value === option ? "choice is-selected" : "choice"}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {value === option && <Check size={16} aria-hidden="true" />}
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function VisitPlanner() {
  const [moment, setMoment] = useState("");
  const [preference, setPreference] = useState("");

  useEffect(() => {
    const receivePreference = (event: Event) => {
      const selected = (event as CustomEvent<{ preference?: string }>).detail
        ?.preference;
      if (selected && preferences.includes(selected)) setPreference(selected);
    };
    window.addEventListener("taeko:preference", receivePreference);
    return () => window.removeEventListener("taeko:preference", receivePreference);
  }, []);

  const completed = Boolean(moment && preference);
  const whatsappUrl = useMemo(() => {
    if (!completed) return contact.whatsapp;
    const message = [
      "Olá, Taeko! Vi a demonstração do site e gostaria de conversar.",
      `Meu momento: ${moment}.`,
      `Minha direção preferida: ${preference}.`,
      "Podem me orientar sobre as possibilidades?",
    ].join("\n");
    return `${contact.whatsapp}?text=${encodeURIComponent(message)}`;
  }, [completed, moment, preference]);

  return (
    <div className="planner-card" data-reveal>
      <ChoiceGroup
        legend="Qual é o seu momento?"
        options={moments}
        value={moment}
        onChange={setMoment}
      />
      <ChoiceGroup
        legend="Qual direção mais combina com você?"
        options={preferences}
        value={preference}
        onChange={setPreference}
      />

      <div className="planner-result" aria-live="polite">
        <div>
          <MessageCircle size={24} strokeWidth={1.4} />
          <div>
            <strong>
              {completed
                ? "Sua mensagem está pronta"
                : "Faça duas escolhas"}
            </strong>
            <p>
              {completed
                ? "Você poderá revisar o texto antes de enviar pelo WhatsApp."
                : "As escolhas só servem para preparar a conversa e não ficam salvas."}
            </p>
          </div>
        </div>
        <a
          className={completed ? "button" : "button is-disabled"}
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!completed}
          onClick={(event) => {
            if (!completed) event.preventDefault();
          }}
        >
          Abrir conversa pronta
        </a>
      </div>
    </div>
  );
}
