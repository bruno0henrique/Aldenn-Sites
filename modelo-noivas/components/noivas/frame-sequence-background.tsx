"use client";
import { useEffect, useRef } from "react";
import type { HeroMedia } from "@/lib/hero-media";
export function FrameSequenceBackground({ config }: { config: HeroMedia }) {
 const canvasRef = useRef<HTMLCanvasElement>(null);
 useEffect(() => {
  if (config.mode !== "sequence") return;
  let cancelled = false;
  let dispose: (() => void) | undefined;
  async function setup() {
   const [{ gsap }, { ScrollTrigger }, { createSequencePlayer }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("@/lib/sequence-player")]);
   if (cancelled || !canvasRef.current) return;
   gsap.registerPlugin(ScrollTrigger);
   const mm = gsap.matchMedia();
   mm.add({ desktop: "(min-width: 641px)", motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!context.conditions?.motion || connection?.saveData) return;
    const source = context.conditions.desktop ? config.desktop : config.mobile;
    if (!source.framePattern || !source.frameCount || source.frameCount < 2) return;
    const canvas = canvasRef.current!;
    const section = canvas.closest("section")!;
    let active = true;
    let tween: gsap.core.Tween | undefined;
    const stopScene = () => { tween?.scrollTrigger?.kill(); tween?.kill(); ScrollTrigger.refresh(); };
    const player = createSequencePlayer(canvas, source, stopScene);
    player.ready.then((ready) => {
     if (!ready || !active) return;
     const playhead = { progress: 0 };
     tween = gsap.to(playhead, { progress: 1, ease: "none", onUpdate: () => player.seek(playhead.progress), scrollTrigger: {
      trigger: section, start: "top top", end: () => `+=${window.innerHeight * (context.conditions?.desktop ? config.scrollDistance : 0.7)}`,
      scrub: 0.25, pin: !!context.conditions?.desktop, invalidateOnRefresh: true,
     } });
     ScrollTrigger.refresh();
    });
    return () => { active = false; stopScene(); player.destroy(); };
   });
   dispose = () => mm.revert();
  }
  setup().catch(() => { /* Poster remains visible if enhancement fails. */ });
  return () => { cancelled = true; dispose?.(); };
 }, [config]);
 return <div className="frame-background" aria-hidden="true"><picture><source media="(max-width: 640px)" srcSet={config.mobile.poster}/><img src={config.desktop.poster} alt="" width="1536" height="1024" fetchPriority="high"/></picture><canvas ref={canvasRef}/></div>;
}
