'use client';

import { Menu, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { whatsappUrl } from '@/lib/whatsapp';

export function BrandHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="brand-header">
      <button
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
      {open && (
        <nav className="menu-panel">
          <a href="#colecao" onClick={() => setOpen(false)}>
            First Drop
          </a>
          <a
            href="https://instagram.com/bellelandcloset"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
