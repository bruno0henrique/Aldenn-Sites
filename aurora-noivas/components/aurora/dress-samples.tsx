"use client";
import { useId, useRef, useState } from "react";
import { Carousel } from "@/components/ui/carousel";
import { categories, dresses, referenceEvent, type Category } from "@/lib/catalog";
export function DressSamples() {
 const [category, setCategory] = useState<Category>("Noivas");
 const tabs = useRef<(HTMLButtonElement | null)[]>([]);
 const id = useId();
 return <section className="dress-samples" id="vestidos" aria-labelledby="samples-title">
  <div className="section-heading section-pad samples-heading" data-reveal><div><p className="eyebrow">UM ENCONTRO COM O SEU ESTILO</p><h2 id="samples-title">Qual vestido conta<br /><em>a sua história?</em></h2></div><p className="heading-summary">Explore formas, cores e detalhes. Guarde o que faz seus olhos brilharem para começar a conversa.</p></div>
  <div className="dress-tabs" role="tablist" aria-label="Categorias de vestidos">
   {categories.map((item, index) => <button key={item} ref={(el) => { tabs.current[index] = el; }} role="tab" type="button" id={`${id}-tab-${index}`} aria-selected={category === item} aria-controls={`${id}-panel`} tabIndex={category === item ? 0 : -1}
    onClick={() => setCategory(item)} onKeyDown={(event) => {
     let target = index;
     if (event.key === "ArrowRight") target = (index + 1) % categories.length;
     else if (event.key === "ArrowLeft") target = (index + categories.length - 1) % categories.length;
     else if (event.key === "Home") target = 0;
     else if (event.key === "End") target = categories.length - 1;
     else return;
     event.preventDefault(); setCategory(categories[target]); tabs.current[target]?.focus();
    }}>{item}</button>)}
  </div>
  <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${categories.indexOf(category)}`}>
   <Carousel key={category} label={`Vestidos de ${category}`} slides={dresses.filter((dress) => dress.category === category).map((dress) => ({ ...dress, button: "Usar como referência" }))}
    onAction={(slide) => {
     window.dispatchEvent(new CustomEvent(referenceEvent, { detail: slide.id }));
     const planner = document.getElementById("planejador");
     history.pushState(null, "", "#planejador");
     const navigation = new CustomEvent("aurora:navigate", { detail: "planejador", cancelable: true });
     if (window.dispatchEvent(navigation)) planner?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
     planner?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    }} />
  </div>
  <p className="sample-disclaimer">Vestidos e fotografias ilustrativos, criados para esta demonstração.</p>
 </section>;
}
