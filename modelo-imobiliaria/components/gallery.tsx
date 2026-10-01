"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Expand } from "lucide-react";
import { asset } from "@/lib/format";
import type { PropertyImage } from "@/lib/property";
import { Modal } from "./modal";

export function Gallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const move = (direction: number) => setActive((current) => (current + direction + images.length) % images.length);
  function photo(index: number, priority = false) { const image = images[index]; return <Image src={asset(image.path)} alt={`${title}, imagem ilustrativa ${index + 1}`} fill sizes={expanded ? "100vw" : index === 0 ? "(max-width: 700px) 100vw, 66vw" : "33vw"} priority={priority} />; }
  return <>
    <div className={`gallery-mosaic${images.length === 1 ? " is-single" : ""}`}><button className="gallery-main" onClick={() => { setActive(0); setExpanded(true); }} aria-label={`Ampliar foto 1 de ${title}`}>{photo(0, true)}<span className="photo-cta"><Expand size={16} /> Ver todas as {images.length} fotos</span></button><div className="gallery-side">{[1, 2].filter((index) => index < images.length).map((index) => <button key={index} onClick={() => { setActive(index); setExpanded(true); }} aria-label={`Ampliar foto ${index + 1} de ${title}`}>{photo(index)}</button>)}</div></div>
    {expanded && <Modal title={`Galeria de ${title}`} className="gallery-modal" onClose={() => setExpanded(false)}>
      <div className="gallery-viewer" onKeyDown={(event) => { if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } if (event.key === "ArrowRight") { event.preventDefault(); move(1); } }}>
        <p className="gallery-caption">{title} · Galeria<span aria-live="polite">{active + 1} / {images.length}</span></p>
        <div className="expanded-photo">{photo(active)}<button className="gallery-arrow previous" aria-label="Foto anterior" onClick={() => move(-1)}><ArrowLeft /></button><button className="gallery-arrow next" aria-label="Próxima foto" onClick={() => move(1)}><ArrowRight /></button></div>
        <p className="gallery-credit">{images[active].sourcePage ? <>Fotografia por <a href={images[active].sourcePage} target="_blank" rel="noreferrer">{images[active].author} / Unsplash</a>.</> : "Foto cadastrada pela equipe."}</p><div className="gallery-thumbnails">{images.map((image, index) => <button key={image.path} onClick={() => setActive(index)} aria-label={`Ver foto ${index + 1}`} aria-pressed={index === active}><Image src={asset(image.thumbnail)} alt="" width={96} height={64} /></button>)}</div>
      </div>
    </Modal>}
  </>;
}
