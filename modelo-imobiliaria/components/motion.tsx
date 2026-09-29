"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function Motion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const root = scope.current!;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const hero = root.querySelectorAll(".hero-eyebrow, .hero-content > p, .hero-search, .hero-bottom, .hero-featured");
        const entranceDelay = window.location.search || window.location.hash ? 0 : 0.8;
        const title = root.querySelector(".detail-title");
        if (hero.length) {
          gsap.from(hero, { y: 16, autoAlpha: 0, duration: 0.8, delay: entranceDelay, stagger: 0.08, ease: "power2.out", clearProps: "all" });
          gsap.from(root.querySelectorAll(".hero-line > span"), { yPercent: 110, duration: 1, delay: entranceDelay, stagger: 0.12, ease: "power3.out", clearProps: "all" });
          gsap.from(root.querySelector(".hero-image"), { scale: 1.06, duration: 1.8, delay: entranceDelay, ease: "power2.out", clearProps: "transform" });
        }
        if (title) gsap.from(title, { y: 15, autoAlpha: 0, duration: 0.65, ease: "power2.out", clearProps: "all" });
        ScrollTrigger.batch(root.querySelectorAll(".section-heading, .detail-section, .financing"), {
          start: "top 94%", once: true,
          onEnter: (elements) => { gsap.fromTo(elements, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.65, ease: "power2.out", clearProps: "all" }); },
        });
      }, root);
      const onClick = (event: MouseEvent) => {
        const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
        if (!anchor || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const id = anchor.getAttribute("href")?.slice(1);
        const target = id ? document.getElementById(id) : null;
        if (!target) return;
        event.preventDefault();
        history.replaceState(null, "", `#${id}`);
        gsap.to(window, { scrollTo: { y: target, offsetY: 110, autoKill: true }, duration: 0.8, ease: "power2.inOut", overwrite: "auto" });
        if (anchor.classList.contains("skip-link")) { target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); }
      };
      root.addEventListener("click", onClick);
      return () => { root.removeEventListener("click", onClick); gsap.killTweensOf(window); context.revert(); };
    }, scope);
    return () => media.revert();
  }, [pathname]);
  return <div ref={scope}>{children}</div>;
}
