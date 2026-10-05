"use client";
import { useEffect, useRef } from "react";
export function MotionProvider({ children }: { children: React.ReactNode }) {
 const wrapper = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches) return;
  const animations: Animation[] = [];
  const animate = (element: HTMLElement, delay = 0) => {
   animations.push(element.animate([{ opacity: 0, transform: "translateY(22px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 650, delay, easing: "cubic-bezier(.2,.7,.3,1)", fill: "backwards" }));
  };
  wrapper.current?.querySelectorAll<HTMLElement>(".hero-reveal").forEach((element, index) => animate(element, index * 70));
  const observer = new IntersectionObserver(entries => {
   for (const entry of entries) if (entry.isIntersecting) { animate(entry.target as HTMLElement); observer.unobserve(entry.target); }
  }, { rootMargin: "0px 0px -7% 0px" });
  wrapper.current?.querySelectorAll<HTMLElement>("[data-reveal]").forEach(element => observer.observe(element));
  const stop = () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); };
  const preferenceChanged = () => { if (preference.matches) stop(); };
  preference.addEventListener("change", preferenceChanged);
  return () => { preference.removeEventListener("change", preferenceChanged); stop(); };
 }, []);
 return <div ref={wrapper} id="smooth-wrapper"><div id="smooth-content">{children}</div></div>;
}
