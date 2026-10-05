"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { nextSlide } from "@/lib/carousel";
import { cn } from "@/lib/utils";
export interface SlideData { id: string; title: string; button: string; src: string; alt: string; description?: string }
interface SlideProps { slide: SlideData; index: number; current: number; count: number; handleSlideClick: (index: number) => void; onAction?: (slide: SlideData) => void }
function Slide({ slide, index, current, count, handleSlideClick, onAction }: SlideProps) {
 const slideRef = useRef<HTMLLIElement>(null);
 const frameRef = useRef<number | null>(null);
 const point = useRef({ x: 0, y: 0 });
 const active = current === index;
 const distance = index - current;
 const offset = count > 2 ? (distance > count / 2 ? distance - count : distance < -count / 2 ? distance + count : distance) : distance;
 const reset = () => {
  if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  frameRef.current = null;
  slideRef.current?.style.setProperty("--x", "0px");
  slideRef.current?.style.setProperty("--y", "0px");
 };
 useEffect(() => () => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); }, []);
 const handleMove = (event: PointerEvent<HTMLLIElement>) => {
  if (!active || event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = event.currentTarget.getBoundingClientRect();
  point.current = { x: event.clientX - rect.left - rect.width / 2, y: event.clientY - rect.top - rect.height / 2 };
  if (frameRef.current !== null) return;
  frameRef.current = requestAnimationFrame(() => {
   slideRef.current?.style.setProperty("--x", `${point.current.x}px`);
   slideRef.current?.style.setProperty("--y", `${point.current.y}px`);
   frameRef.current = null;
  });
 };
 return <li ref={slideRef} className={`dress-slide relative ${active ? "is-current" : ""}`} style={{ "--offset": offset, "--entry-order": Math.abs(offset) } as CSSProperties}
  onClick={() => handleSlideClick(index)} onPointerMove={handleMove} onPointerLeave={reset}>
  <button type="button" className="dress-slide-image" tabIndex={active ? 0 : -1} aria-label={active ? `Usar ${slide.title} como referência` : `Ver vestido ${slide.title}`} onClick={(event) => { event.stopPropagation(); if (active) onAction?.(slide); else handleSlideClick(index); }}>
   {/* Already optimized locally; preserve the portrait and the whole dress. */}
   {/* eslint-disable-next-line @next/next/no-img-element */}
   <img src={slide.src} alt={slide.alt} width={1024} height={1536} loading={index === 0 ? "eager" : "lazy"} decoding="async" draggable={false} />
  </button>
  <article className="dress-slide-copy" aria-hidden={!active}><span className="dress-model-label">MODELO ILUSTRATIVO</span><h3>{slide.title}</h3>
   <button type="button" className="button dress-reference-button" tabIndex={active ? 0 : -1} disabled={!active}
    onClick={(event) => { event.stopPropagation(); onAction?.(slide); }}>{slide.button}<IconArrowNarrowRight size={19} aria-hidden="true" /></button>
  </article>
 </li>;
}
export interface CarouselProps { slides: SlideData[]; label: string; className?: string; onAction?: (slide: SlideData) => void }
export function Carousel({ slides, label, className, onAction }: CarouselProps) {
 const [current, setCurrent] = useState(0);
 const id = useId();
 const swiped = useRef(false);
 const touch = useRef<{ x: number; y: number } | null>(null);
 const safeCurrent = Math.min(current, Math.max(0, slides.length - 1));
 const go = (direction: number) => setCurrent(nextSlide(safeCurrent, direction, slides.length));
 if (!slides.length) return <p role="status" className="empty-samples">Novas inspirações chegam em breve.</p>;
 return <div className={cn("dress-carousel", className)} role="region" aria-roledescription="carrossel" aria-label={label}>
  <div className="dress-carousel-viewport" tabIndex={slides.length > 1 ? 0 : -1} aria-label="Vestidos. Use as setas esquerda e direita para navegar."
   onKeyDown={(event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); go(event.key === "ArrowLeft" ? -1 : 1); }
    if (event.key === "Home") { event.preventDefault(); setCurrent(0); }
    if (event.key === "End") { event.preventDefault(); setCurrent(slides.length - 1); }
   }}
   onClickCapture={(event) => { if (swiped.current && event.detail > 0) { event.preventDefault(); event.stopPropagation(); swiped.current = false; } }}
   onPointerDown={(event) => { swiped.current = false; if (event.pointerType !== "mouse") touch.current = { x: event.clientX, y: event.clientY }; }}
   onPointerUp={(event) => {
    if (!touch.current) return;
    const x = event.clientX - touch.current.x, y = event.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(x) > 45 && Math.abs(x) > Math.abs(y) * 1.3) { swiped.current = true; go(x < 0 ? 1 : -1); }
   }} onPointerCancel={() => { touch.current = null; }}>
   <ul className="dress-carousel-track" id={`dress-slides-${id}`}>
    {slides.map((slide, index) => <Slide key={slide.id} slide={slide} index={index} current={safeCurrent} count={slides.length} handleSlideClick={setCurrent} onAction={onAction} />)}
   </ul>
  <div className="dress-carousel-controls">
   {slides.length > 1 && <button type="button" aria-label="Vestido anterior" aria-controls={`dress-slides-${id}`} onClick={() => go(-1)}><IconArrowNarrowRight className="rotate-180" size={23} aria-hidden="true" /></button>}
   <span className="sr-only" aria-live="polite" aria-atomic="true">{slides[safeCurrent].title}</span>
   {slides.length > 1 && <button type="button" aria-label="Próximo vestido" aria-controls={`dress-slides-${id}`} onClick={() => go(1)}><IconArrowNarrowRight size={23} aria-hidden="true" /></button>}
  </div>
  </div>
 </div>;
}
