'use client';

import {
  ArrowRight,
  Camera,
  Heart,
  MessageCircle,
  Phone,
  Sparkles,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { BrandHeader } from '@/components/brand-header';
import { AccountFooterLink } from '@/components/account-footer-link';
import { AccountToast } from '@/components/account-toast';
import { MotionScene } from '@/components/motion-scene';
import { ProductGrid } from '@/components/product-grid';
import { getPublishedProducts } from '@/lib/catalog';
import { whatsappUrl } from '@/lib/whatsapp';

const categories = [
  { label: 'Tops', icon: '♟', values: ['top', 'tops'] },
  { label: 'Básicos', icon: '♥', values: ['basico', 'basicos'] },
  { label: 'Conjuntos', icon: '✦', values: ['conjunto', 'conjuntos'] },
  { label: 'Novidades', icon: '✿', values: ['novidade', 'novidades'] },
];

function normalizeCategory(value: string | null) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

export default function Home() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-cream" />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['published-products'],
    queryFn: getPublishedProducts,
  });
  const filteredProducts = useMemo(() => {
    if (!activeCategory) return products;
    const selected = categories.find(
      (category) => category.label === activeCategory,
    );
    if (!selected) return products;
    return products.filter((product) =>
      selected.values.includes(normalizeCategory(product.category)),
    );
  }, [activeCategory, products]);
  return (
    <main className="min-h-screen overflow-hidden bg-cream text-cocoa">
      <BrandHeader />
      <AccountToast visible={searchParams.get('conta') === 'conectada'} />
      <MotionScene>
        <section className="hero-shell" aria-labelledby="hero-title">
          <div className="hero-copy" data-reveal>
            <span className="eyebrow">
              <Sparkles size={14} /> First drop
            </span>
            <h1 id="hero-title">
              Your new
              <br />
              <em>favorite</em>
              <br />
              closet.
            </h1>
            <p>
              Peças escolhidas para realçar sua essência e te acompanhar em
              todos os momentos.
            </p>
            <div className="hero-actions">
              <a className="button-pop button-primary" href="#colecao">
                Ver o First Drop <Sparkles size={17} />
              </a>
              <a
                className="button-pop button-outline"
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={18} /> Pedir pelo WhatsApp
              </a>
            </div>
          </div>
          <div className="hero-art" data-reveal>
            <img src="/brand/hero-abstract.png" alt="" aria-hidden="true" />
          </div>
        </section>
        <nav className="category-strip" aria-label="Filtrar por categoria" data-reveal>
          {categories.map((category) => {
            const active = activeCategory === category.label;
            return (
              <button
                key={category.label}
                type="button"
                className={active ? 'active' : ''}
                aria-pressed={active}
                aria-label={`Filtrar por ${category.label}`}
                onClick={() => {
                  setActiveCategory(active ? null : category.label);
                  document
                    .getElementById('colecao')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            );
          })}
        </nav>
        <section
          className="collection"
          id="colecao"
          aria-labelledby="collection-title"
        >
          <p className="section-kicker" data-reveal>
            seleção especial
          </p>
          <h2 id="collection-title" data-reveal>
            {activeCategory || 'First Drop'}
          </h2>
          <ProductGrid
            products={filteredProducts}
            isLoading={isLoading}
            emptyCategory={activeCategory}
          />
        </section>
        <section
          className="contact-card"
          aria-labelledby="contact-title"
          data-reveal
        >
          <div className="contact-heading">
            <span>Fale com a gente</span>
            <h2 id="contact-title">Belleland mais perto de você</h2>
            <p>Escolha o canal que preferir para conversar com a gente.</p>
          </div>
          <div className="contact-links">
            <a
              href="https://instagram.com/bellelandcloset"
              target="_blank"
              rel="noreferrer"
            >
              <Camera aria-hidden="true" />
              <span>
                <small>Instagram</small>
                <strong>@bellelandcloset</strong>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href={whatsappUrl()} target="_blank" rel="noreferrer">
              <Phone aria-hidden="true" />
              <span>
                <small>WhatsApp</small>
                <strong>(12) 98107-3663</strong>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>
        <section className="whatsapp-banner" data-reveal>
          <MessageCircle className="whatsapp-mark" aria-hidden="true" />
          <div>
            <h2>
              Encontrou seu
              <br />
              novo favorito?
            </h2>
            <p>Fale com a gente e garanta o seu!</p>
          </div>
          <a
            className="button-pop button-light"
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
          >
            Pedir pelo WhatsApp <ArrowRight size={17} />
          </a>
        </section>
      </MotionScene>
      <footer>
        <Heart size={22} aria-hidden="true" />
        <a
          href="https://instagram.com/bellelandcloset"
          target="_blank"
          rel="noreferrer"
        >
          <Camera size={17} /> @bellelandcloset
        </a>
        <AccountFooterLink />
      </footer>
    </main>
  );
}
