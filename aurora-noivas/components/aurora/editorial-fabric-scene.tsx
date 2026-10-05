import { basePath } from "@/lib/catalog";
export function EditorialFabricScene() {
  return <div className="atelier-story" data-editorial-scene><picture className="atelier-story-media" data-editorial-media>
    <source media="(max-width: 760px)" type="image/avif" srcSet={`${basePath}/media/editorial-fabric-mobile.avif`} />
    <source media="(max-width: 760px)" type="image/webp" srcSet={`${basePath}/media/editorial-fabric-mobile.webp`} />
    <source type="image/avif" srcSet={`${basePath}/media/editorial-fabric-desktop.avif`} />
    <img src={`${basePath}/media/editorial-fabric-desktop.webp`} alt="Detalhes ilustrativos de renda floral e bordados de um vestido de noiva" width={1672} height={941} loading="lazy" decoding="async" />
  </picture><div className="atelier-story-copy" data-editorial-copy><p className="eyebrow">TEXTURAS, FORMAS E SENTIMENTOS</p><h3>Delicadeza em<br /><em>cada encontro.</em></h3><p>Uma renda que encanta, um tecido que flui. Deixe os detalhes conduzirem o seu olhar.</p></div></div>;
}
