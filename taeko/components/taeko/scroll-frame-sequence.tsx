"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { SequenceSource } from "@/lib/hero-media";

const source: SequenceSource = {
  poster: "/demonstracao-taeko/media/bride-sequence/frame-0001.webp",
  framePattern: "/demonstracao-taeko/media/bride-sequence/frame-{frame}.webp",
  frameCount: 120,
  focalPoint: [0.5, 0.5],
};

export function ScrollFrameSequence() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;

    if (!root || !canvas || reducedMotion || connection?.saveData) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    async function setup() {
      const [{ gsap }, { ScrollTrigger }, { createSequencePlayer }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("@/lib/sequence-player"),
      ]);

      if (cancelled || !root || !canvas) return;
      gsap.registerPlugin(ScrollTrigger);

      const player = createSequencePlayer(canvas, source);
      const ready = await player.ready;

      if (!ready || cancelled) {
        player.destroy();
        return;
      }

      const playhead = { progress: 0 };
      const tween = gsap.to(playhead, {
        progress: 1,
        ease: "none",
        onUpdate: () => player.seek(playhead.progress),
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          end: "bottom 12%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
      dispose = () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
        player.destroy();
      };
    }

    void setup().catch(() => {
      canvas.style.opacity = "0";
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <div className="inspiration-photo scroll-sequence" ref={rootRef}>
      <Image
        src={source.poster}
        alt="Noiva exibindo os detalhes e o caimento de um vestido de renda"
        fill
        sizes="(max-width: 760px) 88vw, 42vw"
        loading="lazy"
      />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
