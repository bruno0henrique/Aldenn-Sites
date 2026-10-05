"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
type DressScene = ReturnType<typeof import("@/lib/dress-scene").createDressScene>;
export function DressShowroom() {
 const host = useRef<HTMLDivElement>(null);
 const scene = useRef<DressScene | null>(null);
 const drag = useRef<{ x: number; id: number } | null>(null);
 const [ready, setReady] = useState(false);
 useEffect(() => {
  const element = host.current;
  if (!element) return;
  let cancelled = false, loading = false, visible = false;
  const observer = new IntersectionObserver(async ([entry]) => {
   visible = entry.isIntersecting; scene.current?.setVisible(visible);
   if (!visible || loading) return;
   loading = true;
   try {
    const { createDressScene } = await import("@/lib/dress-scene");
    if (cancelled) return;
    scene.current = createDressScene(element); scene.current.setVisible(visible); setReady(true);
   } catch { /* The illustrated poster remains usable without WebGL. */ }
  }, { rootMargin: "100px" });
  observer.observe(element);
  return () => { cancelled = true; observer.disconnect(); scene.current?.dispose(); scene.current = null; };
 }, []);
 return <div className={`dress-showroom ${ready ? "is-ready" : ""}`}>
  <div className="showroom-halo" aria-hidden="true" />
  <div ref={host} className="dress-scene" role="img" aria-label={ready ? "Vestido de cetim ilustrativo em três dimensões. Arraste para girar ou use as setas do teclado." : "Silhueta ilustrativa de um vestido de cetim"} tabIndex={ready ? 0 : -1}
   onKeyDown={event => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); scene.current?.rotate(event.key === "ArrowLeft" ? -.2 : .2); } }}
   onPointerDown={event => { if (!ready) return; event.currentTarget.setPointerCapture(event.pointerId); drag.current = { x: event.clientX, id: event.pointerId }; }}
   onPointerMove={event => { if (!drag.current || event.pointerId !== drag.current.id) return; scene.current?.rotate((event.clientX - drag.current.x) * .012); drag.current.x = event.clientX; }}
   onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
   <svg className="dress-poster" viewBox="0 0 400 500" aria-hidden="true"><defs><linearGradient id="gown-satin" x1="0" x2="1"><stop stopColor="#e4ceba" /><stop offset=".3" stopColor="#fff9ed" /><stop offset=".6" stopColor="#e8d7c1" /><stop offset="1" stopColor="#fff7e9" /></linearGradient></defs><ellipse cx="200" cy="444" rx="145" ry="20" fill="#d6b3bf" /><path d="M170 100Q165 50 180 63L186 121M230 100Q235 50 220 63L214 121" fill="none" stroke="#f4e6d6" strokeWidth="8" /><path d="M163 99Q181 85 200 106Q219 85 237 99L224 174Q244 226 334 425Q200 460 66 425Q156 226 176 174Z" fill="url(#gown-satin)" /><path d="M176 174L130 432M190 174L179 443M210 174L228 442M224 174L288 434" stroke="#bfa487" strokeOpacity=".22" fill="none" strokeWidth="3" /></svg>
  </div>
  <div className="showroom-controls">{ready ? <><button type="button" aria-label="Girar vestido para a esquerda" onClick={() => scene.current?.rotate(-.3)}><ArrowLeft size={17} /></button><span>Arraste para girar</span><button type="button" aria-label="Girar vestido para a direita" onClick={() => scene.current?.rotate(.3)}><ArrowRight size={17} /></button></> : <span>Silhueta ilustrativa</span>}</div>
  <span className="showroom-note">ESTUDO DE SILHUETA · ILUSTRATIVO</span>
 </div>;
}
