'use client';

import { useGSAP } from '@gsap/react';
import { useQuery } from '@tanstack/react-query';
import {
  Camera,
  ClipboardCheck,
  LogIn,
  Menu,
  MessageCircle,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import gsap from 'gsap';
import { useRef, useState } from 'react';
import { getAccountSnapshot, isStaff } from '@/lib/account';
import { whatsappUrl } from '@/lib/whatsapp';

export function BrandHeader() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { data: account } = useQuery({
    queryKey: ['current-account'],
    queryFn: getAccountSnapshot,
  });

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      gsap.to(panelRef.current, {
        autoAlpha: open ? 1 : 0,
        y: open ? 0 : -14,
        scale: open ? 1 : 0.98,
        duration: reducedMotion ? 0 : open ? 0.32 : 0.2,
        ease: open ? 'power3.out' : 'power2.in',
        pointerEvents: open ? 'auto' : 'none',
      });
      gsap.to(toggleRef.current, {
        rotate: open ? 90 : 0,
        duration: reducedMotion ? 0 : 0.25,
        ease: 'power2.out',
      });
    },
    { dependencies: [open] },
  );

  return (
    <header className="brand-header">
      <button
        ref={toggleRef}
        className="icon-button"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
      >
        {open ? <X /> : <Menu />}
      </button>
      <a href="/" aria-label="Belleland Closet, início">
        <img src="/brand/belleland-logo.svg" alt="Belleland Closet" />
      </a>
      <a
        className="icon-button"
        href={whatsappUrl()}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar pelo WhatsApp"
      >
        <MessageCircle />
      </a>
      <nav
        ref={panelRef}
        className="menu-panel"
        aria-hidden={!open}
        inert={!open}
        aria-label="Menu principal"
      >
        <a href="/#colecao" onClick={() => setOpen(false)}>
          <Sparkles size={18} /> First Drop
        </a>
        {account?.user ? (
          <a href="/conta" onClick={() => setOpen(false)}>
            <UserRound size={18} /> Minha conta
          </a>
        ) : (
          <a href="/admin/login" onClick={() => setOpen(false)}>
            <LogIn size={18} /> Entrar ou criar conta
          </a>
        )}
        {isStaff(account?.role || null) && (
          <a href="/admin" onClick={() => setOpen(false)}>
            <ClipboardCheck size={18} /> Aprovações
          </a>
        )}
        <a
          href="https://instagram.com/bellelandcloset"
          target="_blank"
          rel="noreferrer"
          onClick={() => setOpen(false)}
        >
          <Camera size={18} /> Instagram
        </a>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noreferrer"
          onClick={() => setOpen(false)}
        >
          <MessageCircle size={18} /> WhatsApp
        </a>
      </nav>
    </header>
  );
}
