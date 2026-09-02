'use client';

import { MessageCircle, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { HomeBanner } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { whatsappUrl } from '@/lib/whatsapp';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

export function HeroCarousel({ banners }: { banners: HomeBanner[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    update();
    api.on('select', update);
    return () => {
      api.off('select', update);
    };
  }, [api]);

  useEffect(() => {
    if (!api || paused || banners.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => api.scrollNext(), 5000);
    return () => window.clearInterval(interval);
  }, [api, banners.length, paused]);

  if (!banners.length) return <DefaultHero />;

  return (
    <section className="hero-carousel-shell" aria-label="Produtos em destaque">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: 'start' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        <CarouselContent className="hero-carousel-content">
          {banners.map((banner) => {
            const price =
              banner.product.sale_price_cents || banner.product.price_cents;
            return (
              <CarouselItem className="hero-banner-item" key={banner.id}>
                <article className="hero-product-banner">
                  <img src={banner.image_url} alt={banner.product.name} />
                  <div className="hero-product-overlay">
                    <span>
                      <Sparkles /> Destaque Belleland
                    </span>
                    <h1>{banner.product.name}</h1>
                    {banner.product.category && (
                      <p>{banner.product.category}</p>
                    )}
                    <strong>{formatPrice(price)}</strong>
                    <a href={`/produto/${banner.product.slug}`}>Ver peça</a>
                  </div>
                </article>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      {banners.length > 1 && (
        <div className="hero-dots" aria-label="Escolher destaque">
          {banners.map((banner, index) => (
            <button
              type="button"
              className={selected === index ? 'active' : ''}
              aria-label={`Mostrar destaque ${index + 1}`}
              aria-current={selected === index}
              key={banner.id}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function DefaultHero() {
  return (
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
          Peças escolhidas para realçar sua essência e te acompanhar em todos os
          momentos.
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
  );
}
