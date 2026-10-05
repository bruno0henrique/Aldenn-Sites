"use client";
import { useEffect, useRef } from "react";
export function MotionProvider({ children }: { children: React.ReactNode }) {
 const wrapper = useRef<HTMLDivElement>(null);
 useEffect(() => {
  let dispose: (() => void) | undefined;
  let cancelled = false;
  async function setup() {
   const [{ gsap }, { ScrollTrigger }, { ScrollSmoother }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/ScrollSmoother")]);
   if (cancelled || !wrapper.current) return;
   gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
   const mm = gsap.matchMedia();
   mm.add({ desktop: "(min-width: 1001px) and (pointer: fine)", motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
    if (!context.conditions?.motion) return;
    const smoother = context.conditions.desktop ? ScrollSmoother.create({ wrapper: wrapper.current!, content: wrapper.current!.firstElementChild as HTMLElement, smooth: 1, smoothTouch: 0, effects: false, onFocusIn: () => false }) : null;
    gsap.from(".hero-reveal", { y: 22, opacity: 0, stagger: 0.09, duration: 0.85, ease: "power2.out", clearProps: "all" });
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
     gsap.from(element, { y: 25, opacity: 0, duration: 0.8, ease: "power2.out", clearProps: "all", scrollTrigger: { trigger: element, start: "top 93%", once: true } });
    });
    const scrollToTarget = (target: HTMLElement, smooth = true) => {
     if (!smoother) return;
     smoother.scrollTo(target, smooth, "top 144px");
    };
    const navigate = (event: MouseEvent) => {
     if (!smoother || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
     const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
     if (!anchor?.hash) return;
     const target = document.getElementById(decodeURIComponent(anchor.hash.slice(1)));
     if (!target) return;
     event.preventDefault();
     history.pushState(null, "", anchor.hash);
     scrollToTarget(target);
     const previousTabIndex = target.getAttribute("tabindex");
     target.tabIndex = -1;
     target.focus({ preventScroll: true });
     if (previousTabIndex === null) target.removeAttribute("tabindex");
     else target.setAttribute("tabindex", previousTabIndex);
    };
    const navigateSection = (event: Event) => {
     if (!smoother) return;
     const id = (event as CustomEvent<unknown>).detail;
     if (typeof id !== "string") return;
     const target = document.getElementById(id);
     if (!target) return;
     event.preventDefault();
     scrollToTarget(target);
    };
    document.addEventListener("click", navigate);
    window.addEventListener("aurora:navigate", navigateSection);
    if (smoother && location.hash) {
     const initialTarget = document.getElementById(decodeURIComponent(location.hash.slice(1)));
     if (initialTarget) requestAnimationFrame(() => scrollToTarget(initialTarget, false));
    }
    return () => { document.removeEventListener("click", navigate); window.removeEventListener("aurora:navigate", navigateSection); smoother?.kill(); };
   });
   document.fonts.ready.then(() => { if (!cancelled) ScrollTrigger.refresh(); });
   dispose = () => mm.revert();
  }
  setup().catch(() => { /* Native page remains usable without motion. */ });
  return () => { cancelled = true; dispose?.(); };
 }, []);
 return <div ref={wrapper} id="smooth-wrapper"><div id="smooth-content">{children}</div></div>;
}
