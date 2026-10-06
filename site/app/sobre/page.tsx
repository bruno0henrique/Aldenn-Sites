import type { Metadata } from 'next';
import { BrandHeader } from '@/components/brand-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Conheça a Veloura Closet e a forma de escolher sua peça.',
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <BrandHeader />
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-copy">
          <p className="section-kicker">Sobre a Veloura</p>
          <h1 id="about-title">Seu estilo, do seu jeito.</h1>
          <p>
            A Veloura Closet é uma curadoria de moda feminina feita para
            aproximar você de peças com personalidade, conforto e estilo.
          </p>
        </div>
        <div className="about-story">
          <p className="section-kicker">A proposta</p>
          <h2>Encontrar uma peça bonita pode ser simples.</h2>
          <p>
            A ideia da Veloura é reunir roupas que tenham personalidade e
            apresentar tudo de um jeito leve, para você olhar com calma e
            escolher o que realmente combina com você.
          </p>
          <p>
            Este catálogo ainda é uma demonstração. Por enquanto, você pode
            conhecer a proposta e acompanhar como a experiência está sendo
            construída. Os canais de contato serão definidos antes do lançamento.
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
