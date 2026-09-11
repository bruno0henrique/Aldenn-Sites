"use client";

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
  const chooseOccasion = (moment: string) => {
    window.dispatchEvent(new CustomEvent("taeko:select-moment", { detail: moment }));
    history.pushState(null, "", "#planejador");
    document.getElementById("planejador")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="occasions section-pad" id="ocasioes" aria-labelledby="occasions-title">
      <div className="section-heading" data-reveal>
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
      </div>

      <div className="occasion-list">
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
    </section>
  );
}
