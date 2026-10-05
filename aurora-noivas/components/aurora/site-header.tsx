"use client";

import { useEffect, useRef, useState } from "react";

export function Wordmark() {
  return (
    <span className="wordmark">
      aurora<span>NOIVAS</span>
    </span>
  );
}

export function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = Math.max(0, window.scrollY);

    const updateHeader = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      const distance = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 24) {
        setHidden(false);
      } else if (distance > 8 && currentScrollY > 96) {
        setHidden(true);
      } else if (distance < -8) {
        setHidden(false);
      }

      if (Math.abs(distance) > 8 || currentScrollY <= 24) {
        lastScrollY.current = currentScrollY;
      }

      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateHeader);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`site-header${hidden ? " site-header--hidden" : ""}`}
      onFocusCapture={() => setHidden(false)}
    >
      <a href="#inicio" aria-label="Aurora Noivas, início">
        <Wordmark />
      </a>
      <nav aria-label="Navegação principal">
        <a href="#vestidos">Vestidos</a>
        <a href="#processo">Como funciona</a>
        <a href="#contato">Contato</a>
      </nav>
      <a className="header-contact" href="#planejador">
        Meu momento
      </a>
    </header>
  );
}
