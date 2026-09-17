export function EditorialFabricScene() {
  return (
    <div className="atelier-story" data-editorial-scene>
      <div className="atelier-story-stage">
        <picture className="atelier-story-media" data-editorial-media>
          <source
            media="(max-width: 760px)"
            type="image/avif"
            srcSet="/media/editorial-fabric-mobile.avif"
          />
          <source
            media="(max-width: 760px)"
            type="image/webp"
            srcSet="/media/editorial-fabric-mobile.webp"
          />
          <source type="image/avif" srcSet="/media/editorial-fabric-desktop.avif" />
          <img
            src="/media/editorial-fabric-desktop.webp"
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
            Em cada prova, o vestido vai encontrando o seu corpo. Ajustamos o caimento com delicadeza para que você se sinta bonita e à vontade.
          </p>
        </div>
      </div>
    </div>
  );
}
