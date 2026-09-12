"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

const occasions = [
  {
    label: "Noivas",
    moment: "Casamento",
    image: "noiva",
    copy: "Renda, caimento e acabamento para um vestido que tenha a sua presença.",
  },
  {
    label: "Debutantes",
    moment: "Debutante",
    image: "debutante",
    copy: "Volume, movimento e personalidade para celebrar um momento só seu.",
  },
  {
    label: "Madrinhas",
    moment: "Madrinha",
    image: "madrinha",
    copy: "Elegância e conforto para acompanhar de perto uma história especial.",
  },
];

export function OccasionShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const chooseOccasion = (moment: string) => {
    window.dispatchEvent(new CustomEvent("taeko:select-moment", { detail: moment }));
    history.pushState(null, "", "#planejador");
    document.getElementById("planejador")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToOccasion = (index: number) => {
    const safeIndex = (index + occasions.length) % occasions.length;
    const card = trackRef.current?.children.item(safeIndex) as HTMLElement | null;

    if (card && trackRef.current) {
      trackRef.current.scrollTo({ left: card.offsetLeft - trackRef.current.offsetLeft, behavior: "smooth" });
    }
    setActiveIndex(safeIndex);
  };

  const updateActiveOccasion = () => {
    const track = trackRef.current;
    if (!track) return;

    const trackLeft = track.getBoundingClientRect().left;
    const distances = Array.from(track.children).map((card) =>
      Math.abs((card as HTMLElement).getBoundingClientRect().left - trackLeft),
    );
    setActiveIndex(distances.indexOf(Math.min(...distances)));
  };

  return (
    <section className="occasions section-pad" id="ocasioes" aria-labelledby="occasions-title">
      <div className="section-heading occasions-heading" data-reveal>
        <div>
          <p className="eyebrow">PARA CADA MOMENTO</p>
          <h2 id="occasions-title">
            Um vestido que combina
            <br />
            <em>com a ocasião.</em>
          </h2>
        </div>
        <p className="heading-summary">
          Conheça as principais possibilidades e comece o atendimento pela direção que mais se aproxima de você.
        </p>
        <div className="occasion-controls" aria-label="Navegar pelas ocasiões">
          <button type="button" onClick={() => goToOccasion(activeIndex - 1)} aria-label="Ocasião anterior">
            <ChevronLeft size={19} strokeWidth={1.4} />
          </button>
          <span aria-live="polite">{String(activeIndex + 1).padStart(2, "0")} / {String(occasions.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => goToOccasion(activeIndex + 1)} aria-label="Próxima ocasião">
            <ChevronRight size={19} strokeWidth={1.4} />
          </button>
        </div>
      </div>

      <div className="occasion-list" ref={trackRef} onScroll={updateActiveOccasion}>
        {occasions.map((occasion) => (
          <article className="occasion-card" key={occasion.label} data-reveal>
            <picture>
              <source type="image/avif" srcSet={`/demonstracao-taeko/media/occasion-${occasion.image}.avif`} />
              <img
                src={`/demonstracao-taeko/media/occasion-${occasion.image}.webp`}
                alt={`Vestido para ${occasion.label.toLowerCase()}`}
                width={512}
                height={820}
                loading="lazy"
                decoding="async"
              />
            </picture>
            <div className="occasion-card-copy">
              <h3>{occasion.label}</h3>
              <p>{occasion.copy}</p>
              <button type="button" onClick={() => chooseOccasion(occasion.moment)}>
                Quero conhecer
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="occasion-pagination" aria-label="Escolher ocasião">
        {occasions.map((occasion, index) => (
          <button
            type="button"
            key={occasion.label}
            className={index === activeIndex ? "is-active" : ""}
            aria-label={`Ver ${occasion.label}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => goToOccasion(index)}
          />
        ))}
      </div>
    </section>
  );
}
