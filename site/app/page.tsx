'use client';

import { ArrowRight, Camera, Heart, MessageCircle, Phone } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { BrandHeader } from '@/components/brand-header';
import { AccountFooterLink } from '@/components/account-footer-link';
import { AccountToast } from '@/components/account-toast';
import { MotionScene } from '@/components/motion-scene';
import { HeroCarousel } from '@/components/hero-carousel';
import { ProductCarousel } from '@/components/product-carousel';
import {
  getCatalogCategories,
  getHomeBanners,
  getPublishedProducts,
} from '@/lib/catalog';
import { whatsappUrl } from '@/lib/whatsapp';

function normalize(value: string | null) {
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSlug = searchParams.get('categoria') || 'todos';
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['published-products'],
    queryFn: getPublishedProducts,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ['catalog-categories'],
    queryFn: getCatalogCategories,
  });
  const { data: banners = [] } = useQuery({
    queryKey: ['home-banners'],
    queryFn: getHomeBanners,
  });
  const selectedCategory = categories.find(
    (category) => category.slug === selectedSlug,
  );
  const selectedProducts = useMemo(() => {
    if (selectedSlug === 'novidades') return products.slice(0, 10);
    if (!selectedCategory) return products;
    return products.filter(
      (product) =>
        normalize(product.category) === normalize(selectedCategory.name),
    );
  }, [products, selectedCategory, selectedSlug]);
  const categoryRails = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          products: products.filter(
            (product) =>
              normalize(product.category) === normalize(category.name),
          ),
        }))
        .filter((rail) => rail.products.length > 0),
    [categories, products],
  );

  function chooseCategory(value: string) {
    const query = value === 'todos' ? '' : `?categoria=${value}`;
    router.replace(`/${query}#colecao`, { scroll: false });
    window.setTimeout(
      () =>
        document
          .getElementById('colecao')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      0,
    );
  }

  const singleRailTitle =
    selectedSlug === 'novidades'
      ? 'Novidades'
      : selectedCategory?.name || 'First Drop';

  return (
    <main className="min-h-screen overflow-hidden bg-cream text-cocoa">
      <BrandHeader />
      <AccountToast visible={searchParams.get('conta') === 'conectada'} />
      <MotionScene>
        <HeroCarousel banners={banners} />
        <section
          className="collection"
          id="colecao"
          aria-labelledby="collection-title"
        >
          <div className="collection-toolbar" data-reveal>
            <div>
              <p className="section-kicker">seleção especial</p>
              <h2 id="collection-title">First Drop</h2>
            </div>
            <label className="catalog-filter" htmlFor="catalog-category">
              <span>Filtrar produtos</span>
              <select
                id="catalog-category"
                value={
                  selectedCategory
                    ? selectedSlug
                    : selectedSlug === 'novidades'
                      ? 'novidades'
                      : 'todos'
                }
                onChange={(event) => chooseCategory(event.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="novidades">Novidades</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {selectedSlug !== 'todos' ? (
            <ProductCarousel
              title={singleRailTitle}
              products={selectedProducts}
              isLoading={isLoading}
              emptyCategory={singleRailTitle}
            />
          ) : (
            <div className="catalog-rails">
              <ProductCarousel
                title="Novidades"
                products={products.slice(0, 10)}
                isLoading={isLoading}
              />
              {!isLoading &&
                categoryRails.map(({ category, products: railProducts }) => (
                  <ProductCarousel
                    key={category.id}
                    title={category.name}
                    products={railProducts}
                  />
                ))}
            </div>
          )}
        </section>
        <section
          className="contact-card"
          id="fale-com-a-gente"
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
