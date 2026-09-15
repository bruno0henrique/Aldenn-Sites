"use client";

import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { contact } from "@/lib/taeko";

const moments = ["Casamento", "Debutante", "Madrinha", "Outro momento"];
const preferences = [
  "Renda delicada",
  "Clássico e romântico",
  "Leve e minimalista",
  "Estruturado e marcante",
  "Ainda estou descobrindo",
];
const stages = ["Estou começando a pesquisar", "Já reuni algumas referências", "Gostaria de provar modelos"];

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

  useEffect(() => {
    const selectMoment = (event: Event) => {
      const moment = (event as CustomEvent<string>).detail;
      if (moments.includes(moment)) setMoment(moment);
    };
    window.addEventListener("taeko:select-moment", selectMoment);
    return () => window.removeEventListener("taeko:select-moment", selectMoment);
  }, []);

  const completed = Boolean(moment && preference && stage);
  const whatsappUrl = useMemo(() => {
    if (!completed) return contact.whatsapp;
    const message = [
      "Olá! Conheci o trabalho da Taeko pelo site e gostaria de conversar sobre um vestido.",
      `A ocasião é: ${moment}.`,
      `O estilo que mais combina comigo é: ${preference}.`,
      `Neste momento, ${stage.toLowerCase()}.`,
      "Vocês poderiam me orientar sobre as possibilidades?",
    ].join("\n");
    return `${contact.whatsapp}?text=${encodeURIComponent(message)}`;
  }, [completed, moment, preference, stage]);

  return (
    <div className="planner-card" data-reveal>
      <ChoiceGroup
        legend="Qual é o seu momento?"
        options={moments}
        value={moment}
        onChange={setMoment}
      />
      <ChoiceGroup
        legend="Que estilo mais combina com você?"
        options={preferences}
        value={preference}
        onChange={setPreference}
      />
      <ChoiceGroup
        legend="Em que etapa da escolha você está?"
        options={stages}
        value={stage}
        onChange={setStage}
      />

      <div className="planner-result" aria-live="polite">
        <div>
          <strong>{completed ? "Sua mensagem está pronta." : "Só faltam algumas escolhas."}</strong>
          <p>
            {completed
              ? "Quando quiser, abra o WhatsApp e confira o texto antes de enviar."
              : "Escolha uma opção em cada etapa para prepararmos a mensagem."}
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
