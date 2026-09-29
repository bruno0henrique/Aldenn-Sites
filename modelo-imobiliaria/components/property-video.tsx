import Image from "next/image";
import { Box } from "lucide-react";
import { asset } from "@/lib/format";
import type { PropertyImage, PropertyVideo3D } from "@/lib/property";

export function PropertyVideo({ video, cover, title }: { video?: PropertyVideo3D; cover: PropertyImage; title: string }) {
  return <section className={`property-video detail-section${video ? " is-ready" : ""}`} aria-labelledby="video-title">
    <div className="video-copy"><span className="eyebrow"><Box size={15} /> OUTRA PERSPECTIVA</span><h2 id="video-title">Conheça os espaços<br /><em>em uma nova dimensão.</em></h2>
      {!video && <><p>Uma visita em vídeo para descobrir os ambientes e imaginar seu próximo endereço.</p><span className="video-status">Vídeo 3D em preparação</span><p className="video-unavailable">O vídeo deste imóvel ainda não está disponível.</p></>}
    </div>
    {video ? <div className="video-player"><video controls playsInline preload="none" poster={asset(video.poster ?? cover.path)} aria-label={`Vídeo 3D de ${title}`}>
      <source src={asset(video.src)} />
      {video.captions && <track kind="captions" src={asset(video.captions)} srcLang="pt-BR" label="Português" default />}
      Seu navegador não suporta vídeos. <a href={asset(video.src)}>Abrir o vídeo 3D</a>
    </video><p>Visualização ilustrativa gerada a partir de fotografias. Não substitui uma visita ao imóvel.</p></div> : <div className="video-preview" aria-hidden="true"><Image src={asset(cover.thumbnail)} alt="" fill sizes="(max-width: 700px) 100vw, 280px" /><span className="video-preview-shade" /><Box size={46} strokeWidth={1} /><span>3D</span></div>}
  </section>;
}
