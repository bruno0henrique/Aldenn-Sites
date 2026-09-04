import type { Metadata } from 'next';
import { Heart, MessageCircle, Sparkles } from 'lucide-react';
import { BrandHeader } from '@/components/brand-header';
import { SiteFooter } from '@/components/site-footer';
import { whatsappUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Conheça a Belleland Closet e a forma de escolher sua peça.',
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <BrandHeader />
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-copy">
          <p className="section-kicker">Sobre a Belleland</p>
          <h1 id="about-title">Seu estilo, do seu jeito.</h1>
          <p>
            A Belleland Closet é uma curadoria de moda feminina feita para
            aproximar você de peças com personalidade, conforto e estilo.
          </p>
        </div>
        <div className="about-note">
          <Sparkles aria-hidden="true" />
          <p>
            Novidades e seleções pensadas para acompanhar diferentes momentos e
            destacar a sua essência.
          </p>
        </div>
      </section>
      <section className="about-details" aria-label="Como funciona">
        <article>
          <Heart aria-hidden="true" />
          <h2>Escolha com calma</h2>
          <p>
            Explore o catálogo, use os filtros e abra cada peça para conferir
            fotos, preço e detalhes.
          </p>
        </article>
        <article>
          <MessageCircle aria-hidden="true" />
          <h2>Fale com a gente</h2>
          <p>
            Encontrou sua favorita? A consulta e a reserva são combinadas
            diretamente com a Belleland pelo WhatsApp.
          </p>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer">
            Conversar no WhatsApp
          </a>
        </article>
      </section>
      <SiteFooter />
    </main>
  );
}
