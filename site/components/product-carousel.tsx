'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export function ProductCarousel({
  title,
  products,
  isLoading = false,
  emptyCategory,
}: {
  title: string;
  products: Product[];
  isLoading?: boolean;
  emptyCategory?: string;
}) {
  const isNews = title === 'Novidades';

  if (isLoading) {
    return (
      <section className="product-rail" aria-label={`Carregando ${title}`}>
        <div className="rail-heading">
          <h2>{title}</h2>
        </div>
        <div className="product-rail-loading">
          {[1, 2, 3].map((item) => (
            <div className="product-skeleton" key={item} />
          ))}
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="product-rail">
        <div className="rail-heading">
          <h2>{title}</h2>
        </div>
        <div className="catalog-empty compact">
          <span>
            <Sparkles />
          </span>
          <h3>
            {emptyCategory
              ? `Sem opções de ${emptyCategory} no momento`
              : 'Em breve, novos produtos'}
          </h3>
          <p>Em breve teremos novidades nessa categoria.</p>
          <a
            href="https://instagram.com/bellelandcloset"
            target="_blank"
            rel="noreferrer"
          >
            Acompanhar no Instagram <ArrowRight size={16} />
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="product-rail" aria-labelledby={`rail-${title}`}>
      <div className="rail-heading">
        <div>
          <span>Seleção Belleland</span>
          <h2 id={`rail-${title}`}>{title}</h2>
        </div>
        <a href="#fale-com-a-gente">Precisa de ajuda?</a>
      </div>
      <Carousel
        className="product-carousel"
        opts={{
          align: 'start',
          containScroll: 'trimSnaps',
          loop: isNews,
        }}
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              className={`product-carousel-item${isNews ? ' product-carousel-item--news' : ''}`}
              key={product.id}
            >
              <a
                className={`product-card${isNews ? ' product-card--news' : ''}`}
                href={`/produto/${product.slug}`}
              >
                <div className="product-image">
                  <img
                    src={product.primary_image_url}
                    alt={product.name}
                    loading="lazy"
                  />
                  {isNews && (
                    <div className="news-card-caption">
                      <NewsPrice
                        cents={product.sale_price_cents || product.price_cents}
                      />
                    </div>
                  )}
                </div>
                {!isNews && (
                  <div>
                    <h3>{product.name}</h3>
                    {product.sale_price_cents ? (
                      <div className="product-card-prices">
                        <del>{formatPrice(product.price_cents)}</del>
                        <p>{formatPrice(product.sale_price_cents)}</p>
                      </div>
                    ) : (
                      <p>{formatPrice(product.price_cents)}</p>
                    )}
                    <small>
                      Ver peça <ArrowRight />
                    </small>
                  </div>
                )}
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="rail-arrow rail-arrow-prev" />
        <CarouselNext className="rail-arrow rail-arrow-next" />
      </Carousel>
    </section>
  );
}

function NewsPrice({ cents }: { cents: number }) {
  const reais = Math.floor(cents / 100).toLocaleString('pt-BR');
  const centavos = String(cents % 100).padStart(2, '0');

  return (
    <p className="news-card-price" aria-label={formatPrice(cents)}>
      <span className="news-card-currency">R$</span>
      <span className="news-card-major">{reais}</span>
      <sup>,{centavos}</sup>
    </p>
  );
}
