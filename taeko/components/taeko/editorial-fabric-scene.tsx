export function EditorialFabricScene() {
  return (
    <div className="atelier-story" data-editorial-scene>
      <div className="atelier-story-stage">
        <picture className="atelier-story-media" data-editorial-media>
          <source
            media="(max-width: 760px)"
            type="image/avif"
            srcSet="/demonstracao-taeko/media/editorial-fabric-mobile.avif"
          />
          <source
            media="(max-width: 760px)"
            type="image/webp"
            srcSet="/demonstracao-taeko/media/editorial-fabric-mobile.webp"
          />
          <source type="image/avif" srcSet="/demonstracao-taeko/media/editorial-fabric-desktop.avif" />
          <img
            src="/demonstracao-taeko/media/editorial-fabric-desktop.webp"
            alt="Detalhes de renda e bordado em um vestido de noiva"
            width={1672}
            height={941}
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="atelier-story-gradient" aria-hidden="true" />
        <div className="atelier-story-copy" data-editorial-copy>
          <p className="eyebrow">AJUSTES SOB MEDIDA</p>
          <h3>
            O caimento certo muda <em>tudo.</em>
          </h3>
          <p>
            Cada ajuste aproxima o vestido do seu corpo, preserva o movimento e deixa você à vontade para viver o seu dia.
          </p>
        </div>
      </div>
    </div>
  );
}
