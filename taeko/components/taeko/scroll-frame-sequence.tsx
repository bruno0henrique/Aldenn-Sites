"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { SequenceSource } from "@/lib/hero-media";

const source: SequenceSource = {
  poster: "/demonstracao-taeko/media/bride-sequence/frame-0001.webp",
  framePattern: "/demonstracao-taeko/media/bride-sequence/frame-{frame}.webp",
  frameCount: 240,
  focalPoint: [0.5, 0.5],
};

export function ScrollFrameSequence() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const media = mediaRef.current;
    const gradient = gradientRef.current;
    const copy = copyRef.current;
    const canvas = canvasRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;

    if (!root || !stage || !media || !gradient || !copy || !canvas) return;
    if (reducedMotion || connection?.saveData) {
      root.classList.add("is-static");
      return () => root.classList.remove("is-static");
    }

    let cancelled = false;
    let dispose: (() => void) | undefined;

    async function setup() {
      const [{ gsap }, { ScrollTrigger }, { createSequencePlayer }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("@/lib/sequence-player"),
      ]);

      if (cancelled || !root || !media || !gradient || !copy || !canvas) return;
      gsap.registerPlugin(ScrollTrigger);

      const player = createSequencePlayer(canvas, source);
      const ready = await player.ready;

      if (!ready || cancelled) {
        if (!cancelled) root.classList.add("is-static");
        player.destroy();
        return;
      }

      const headerHeight = document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 92;
      gsap.set(gradient, { opacity: 0, xPercent: 18 });
      gsap.set(copy, { autoAlpha: 0, x: 54 });

      const pinTrigger = ScrollTrigger.create({
        trigger: root,
        start: () => `top top+=${headerHeight}`,
        end: "bottom bottom",
        pin: stage,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 92%",
          end: "bottom 8%",
          scrub: 1.15,
          invalidateOnRefresh: true,
          onUpdate: (self) => player.seek(self.progress),
          onRefresh: (self) => player.seek(self.progress),
        },
      });
      timeline
        .to(media, { xPercent: -12, scale: 1.04, duration: 1, ease: "none" }, 0)
        .to(gradient, { opacity: 1, xPercent: 0, duration: 0.54, ease: "power2.out" }, 0.2)
        .to(copy, { autoAlpha: 1, x: 0, duration: 0.34, ease: "power2.out" }, 0.48);

      ScrollTrigger.refresh();
      dispose = () => {
        pinTrigger.kill();
        timeline.scrollTrigger?.kill();
        timeline.kill();
        player.destroy();
      };
    }

    void setup().catch(() => {
      root.classList.add("is-static");
      canvas.style.opacity = "0";
    });
    return () => {
      cancelled = true;
      root.classList.remove("is-static");
      dispose?.();
    };
  }, []);

  return (
    <div className="atelier-story" ref={rootRef}>
      <div className="atelier-story-stage" ref={stageRef}>
        <div className="atelier-story-media" ref={mediaRef}>
          <Image
            src={source.poster}
            alt="Noiva exibindo o movimento e o caimento de um vestido de renda"
            fill
            sizes="100vw"
            loading="lazy"
          />
          <canvas ref={canvasRef} aria-hidden="true" />
        </div>
        <div className="atelier-story-gradient" ref={gradientRef} aria-hidden="true" />
        <div className="atelier-story-copy" ref={copyRef}>
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
