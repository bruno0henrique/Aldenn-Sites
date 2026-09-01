'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP);

export function MotionScene({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from('[data-reveal]', { opacity: 0, y: 22, duration: .72, stagger: .09, ease: 'power3.out' });
    gsap.to('.spark', { rotate: 25, scale: 1.18, repeat: -1, yoyo: true, duration: 1.8, ease: 'sine.inOut', stagger: .35 });
  }, { scope });
  return <div ref={scope}>{children}</div>;
}
