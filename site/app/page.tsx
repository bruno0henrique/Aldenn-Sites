'use client';

import {
  ArrowRight,
  Camera,
  Heart,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { BrandHeader } from '@/components/brand-header';
import { MotionScene } from '@/components/motion-scene';
import { ProductGrid } from '@/components/product-grid';
import { getPublishedProducts } from '@/lib/catalog';
import { whatsappUrl } from '@/lib/whatsapp';

export default function Home() {
  const searchParams = useSearchParams();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['published-products'],
    queryFn: getPublishedProducts,
  });
  return (
    <main className="min-h-screen overflow-hidden bg-cream text-cocoa">
      <BrandHeader />
      {searchParams.get('conta') === 'conectada' && (
        <output className="account-notice">Conta conectada com sucesso.</output>
      )}
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
        {products.length > 0 && (
          <nav className="category-strip" aria-label="Categorias" data-reveal>
            {['Tops', 'Básicos', 'Conjuntos', 'Novidades'].map(
              (category, index) => (
                <a key={category} href="#colecao">
                  <span>{['♟', '♥', '✦', '✿'][index]}</span>
                  {category}
                </a>
              ),
            )}
          </nav>
        )}
        <section
          className="collection"
          id="colecao"
          aria-labelledby="collection-title"
        >
          <p className="section-kicker" data-reveal>
            seleção especial
          </p>
          <h2 id="collection-title" data-reveal>
            First Drop
          </h2>
          <ProductGrid products={products} isLoading={isLoading} />
        </section>
        <section className="made-with-love" data-reveal>
          <div className="love-title">
            <Sparkles size={20} />
            <strong>Made</strong>
            <span>with love ♡</span>
          </div>
          <div className="love-copy">
            <p>
              Belleland Closet nasceu do desejo de criar peças que unem
              conforto, estilo e personalidade.
            </p>
            <p>
              Cada detalhe é pensado com carinho para você se sentir linda,
              confiante e autêntica todos os dias.
            </p>
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
        <a href="/admin/login">Entrar ou criar conta</a>
      </footer>
    </main>
  );
}
