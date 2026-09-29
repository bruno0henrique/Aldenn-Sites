"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { asset } from "@/lib/format";

/** Abertura decorativa: não aguarda downloads, não bloqueia ações e não salva dados. */
export function BrandIntro() {
  const intro = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.location.search || window.location.hash || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.set(intro.current, { visibility: "visible" });
        gsap.timeline().from(".intro-mark", { y: 12, opacity: 0, duration: 0.45, ease: "power2.out" })
          .from(".intro-rule", { scaleX: 0, duration: 0.5, ease: "power2.inOut" }, 0.1)
          .to(intro.current, { yPercent: -100, duration: 0.65, ease: "power3.inOut" }, 0.8)
          .set(intro.current, { visibility: "hidden" });
      }, intro);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);
  return <div ref={intro} className="brand-intro" aria-hidden="true"><div className="intro-mark"><Image src={asset("/brand/aldenn-wordmark.svg")} alt="" width={260} height={60} priority /><span>IMÓVEIS</span></div><div className="intro-rule" /></div>;
}
