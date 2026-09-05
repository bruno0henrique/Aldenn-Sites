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
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

export function HeroCarousel({ banners }: { banners: HomeBanner[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const slideCount = banners.length + 1;
  const repeatPair = banners.length === 1;

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
    if (!api || paused || slideCount < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => api.scrollNext(), 5000);
    return () => window.clearInterval(interval);
  }, [api, paused, slideCount]);

  if (!banners.length) return <DefaultHero />;

  return (
    <section className="hero-carousel-shell" aria-label="Produtos em destaque">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: 'center', containScroll: false }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        <CarouselContent className="hero-carousel-content">
          <CarouselItem
            className={`hero-banner-item ${selected === 0 ? 'is-active' : ''}`}
            aria-hidden={selected !== 0}
            inert={selected !== 0}
          >
            <DefaultHero />
          </CarouselItem>
          {banners.map((banner, bannerIndex) => {
            const slideIndex = bannerIndex + 1;
            return (
              <CarouselItem
                className={`hero-banner-item ${selected === slideIndex ? 'is-active' : ''}`}
                aria-hidden={selected !== slideIndex}
                inert={selected !== slideIndex}
                key={banner.id}
              >
                <BannerHero banner={banner} />
              </CarouselItem>
            );
          })}
          {repeatPair && (
            <>
              <CarouselItem
                className={`hero-banner-item ${selected === 2 ? 'is-active' : ''}`}
                aria-hidden={selected !== 2}
                inert={selected !== 2}
              >
                <DefaultHero titleId="hero-title-repeat" />
              </CarouselItem>
              <CarouselItem
                className={`hero-banner-item ${selected === 3 ? 'is-active' : ''}`}
                aria-hidden={selected !== 3}
                inert={selected !== 3}
              >
                <BannerHero banner={banners[0]} />
              </CarouselItem>
            </>
          )}
        </CarouselContent>
        {slideCount > 1 && (
          <>
            <CarouselPrevious className="hero-carousel-arrow hero-carousel-arrow--previous" />
            <CarouselNext className="hero-carousel-arrow hero-carousel-arrow--next" />
          </>
        )}
      </Carousel>
      {slideCount > 1 && (
        <div className="hero-dots" aria-label="Escolher destaque">
          {Array.from({ length: slideCount }, (_, index) => (
            <button
              type="button"
              className={selected % slideCount === index ? 'active' : ''}
              aria-label={`Mostrar destaque ${index + 1}`}
              aria-current={selected === index}
              key={index}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function BannerHero({ banner }: { banner: HomeBanner }) {
  const price = banner.product
    ? banner.product.sale_price_cents || banner.product.price_cents
    : null;
  const title = banner.title || banner.product?.name || '';
  const eyebrow = banner.eyebrow || 'Destaque Belleland';
  const ctaLabel = banner.cta_label || 'Ver peça';
  const ctaUrl =
    banner.cta_url ||
    (banner.product ? `/produto/${banner.product.slug}` : '/#colecao');
  return (
    <article className="hero-product-banner">
      <img src={banner.image_url} alt={title} />
      <div className="hero-product-overlay">
        <span>
          <Sparkles /> {eyebrow}
        </span>
        <h1>{title}</h1>
        {(banner.description || banner.product?.category) && (
          <p>{banner.description || banner.product?.category}</p>
        )}
        {price !== null && <strong>{formatPrice(price)}</strong>}
        <a href={ctaUrl}>{ctaLabel}</a>
      </div>
    </article>
  );
}

function DefaultHero({ titleId = 'hero-title' }: { titleId?: string }) {
  return (
    <section className="hero-shell" aria-labelledby="hero-title">
      <div className="hero-copy" data-reveal>
        <span className="eyebrow">
          <Sparkles size={14} /> First drop
        </span>
        <h1 id={titleId}>
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
