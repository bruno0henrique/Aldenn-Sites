"use client";

import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import { contact } from "@/lib/taeko";

const moments = ["Casamento", "Debutante", "Madrinha", "Outro momento"];
const preferences = [
  "Renda delicada",
  "Clássico e romântico",
  "Leve e minimalista",
  "Estruturado e marcante",
  "Ainda estou descobrindo",
];
const stages = ["Primeira pesquisa", "Já tenho referências", "Quero provar modelos"];

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
  const [stage, setStage] = useState("");

  const completed = Boolean(moment && preference && stage);
  const whatsappUrl = useMemo(() => {
    if (!completed) return contact.whatsapp;
    const message = [
      "Olá, Taeko! Vi a demonstração do site e gostaria de conversar.",
      `Meu momento: ${moment}.`,
      `Minha direção preferida: ${preference}.`,
      `Estou nesta etapa: ${stage}.`,
      "Podem me orientar sobre as possibilidades?",
    ].join("\n");
    return `${contact.whatsapp}?text=${encodeURIComponent(message)}`;
  }, [completed, moment, preference, stage]);

  return (
    <div className="planner-card" data-reveal>
      <ChoiceGroup
        legend="Para qual ocasião?"
        options={moments}
        value={moment}
        onChange={setMoment}
      />
      <ChoiceGroup
        legend="Qual estilo chamou sua atenção?"
        options={preferences}
        value={preference}
        onChange={setPreference}
      />
      <ChoiceGroup
        legend="Em que etapa você está?"
        options={stages}
        value={stage}
        onChange={setStage}
      />

      <div className="planner-result" aria-live="polite">
        <div>
          <strong>{completed ? "Tudo certo." : "Falta pouco."}</strong>
          <p>
            {completed
              ? "O WhatsApp abrirá com sua mensagem pronta para revisão."
              : "Selecione uma opção em cada campo para continuar."}
          </p>
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
          Entrar em contato pelo WhatsApp
        </a>
      </div>
    </div>
  );
}
