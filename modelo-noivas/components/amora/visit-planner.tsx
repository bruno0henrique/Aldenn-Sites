"use client";

import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { contact } from "@/lib/amora";

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
  const [eventDate, setEventDate] = useState("");

  useEffect(() => {
    const selectMoment = (event: Event) => {
      const moment = (event as CustomEvent<string>).detail;
      if (moments.includes(moment)) setMoment(moment);
    };
    window.addEventListener("amora:select-moment", selectMoment);
    return () => window.removeEventListener("amora:select-moment", selectMoment);
  }, []);

  const completed = Boolean(moment && preference && stage);
  const whatsappUrl = useMemo(() => {
    if (!completed) return contact.whatsapp;
    const formattedDate = eventDate
      ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${eventDate}T12:00:00Z`))
      : "Ainda não definida";
    const message = [
      "Olá, Aldenn!",
      "",
      "Vi o modelo Maison Amora e gostaria de conversar sobre um site para minha loja de noivas.",
      "",
      "Estas são as minhas escolhas:",
      `• Ocasião: ${moment}`,
      `• Estilo: ${preference}`,
      `• Etapa da escolha: ${stage}`,
      `• Data do evento: ${formattedDate}`,
      "",
      "Quando puder, gostaria de saber os próximos passos.",
    ].join("\n");
    return `${contact.whatsapp}?text=${encodeURIComponent(message)}`;
  }, [completed, eventDate, moment, preference, stage]);

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

      <div className="planner-date">
        <label htmlFor="event-date">Quando será o evento?</label>
        <p>Se a data já estiver definida, você pode incluí-la na conversa.</p>
        <input
          id="event-date"
          type="date"
          value={eventDate}
          onChange={(event) => setEventDate(event.target.value)}
        />
      </div>

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
          Enviar minhas escolhas pelo WhatsApp
        </a>
      </div>
    </div>
  );
}
