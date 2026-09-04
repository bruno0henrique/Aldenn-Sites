'use client';

import { Search, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { type SyntheticEvent, Suspense, useMemo } from 'react';
import { BrandHeader } from '@/components/brand-header';
import { AccountToast } from '@/components/account-toast';
import { MotionScene } from '@/components/motion-scene';
import { HeroCarousel } from '@/components/hero-carousel';
import { ProductCarousel } from '@/components/product-carousel';
import { ProductGrid } from '@/components/product-grid';
import { SiteFooter } from '@/components/site-footer';
import {
  getCatalogCategories,
  getHomeBanners,
  getPublishedProducts,
} from '@/lib/catalog';
import type { Product } from '@/lib/types';

const EMPTY_PRODUCTS: Product[] = [];

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
  const isCatalogView = searchParams.has('categoria');
  const isSearchView = searchParams.has('busca');
  const searchTerm = searchParams.get('busca')?.trim() || '';
  const isLandingView = !isCatalogView && !isSearchView;
  const { data: catalogData, isLoading } = useQuery({
    queryKey: ['home-catalog'],
    queryFn: async () => {
      const publishedProducts = await getPublishedProducts();
      const shuffledNews = [...publishedProducts];

      for (let index = shuffledNews.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffledNews[index], shuffledNews[randomIndex]] = [
          shuffledNews[randomIndex],
          shuffledNews[index],
        ];
      }

      return {
        products: publishedProducts,
        news: shuffledNews.slice(0, 10),
      };
    },
  });
  const products = catalogData?.products || EMPTY_PRODUCTS;
  const newsProducts = catalogData?.news || EMPTY_PRODUCTS;
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
    if (isSearchView) {
      const term = normalize(searchTerm);
      if (!term) return products;
      return products.filter((product) =>
        normalize(
          [product.name, product.category, product.description]
            .filter(Boolean)
            .join(' '),
        ).includes(term),
      );
    }
    if (!selectedCategory) return products;
    return products.filter(
      (product) =>
        normalize(product.category) === normalize(selectedCategory.name),
    );
  }, [isSearchView, products, searchTerm, selectedCategory]);
  function chooseCategory(value: string) {
    router.replace(`/?categoria=${value}#colecao`, { scroll: false });
    window.setTimeout(
      () =>
        document
          .getElementById('colecao')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      0,
    );
  }

  function submitSearch(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchValue = formData.get('busca');
    const term = typeof searchValue === 'string' ? searchValue.trim() : '';
    router.replace(`/?busca=${encodeURIComponent(term)}#colecao`, {
      scroll: false,
    });
  }

  const collectionTitle = isSearchView
    ? searchTerm
      ? `Resultados para “${searchTerm}”`
      : 'Todos os produtos'
    : selectedCategory?.name || 'First Drop';

  return (
    <main className="min-h-screen overflow-hidden bg-cream text-cocoa">
      <BrandHeader />
      <AccountToast visible={searchParams.get('conta') === 'conectada'} />
      <MotionScene>
        {isLandingView && <HeroCarousel banners={banners} />}
        {isSearchView && (
          <section className="search-stage" aria-labelledby="search-title">
            <div className="search-stage-copy">
              <span className="search-stage-icon" aria-hidden="true">
                <Search />
              </span>
              <p>Pesquisa Belleland</p>
              <h1 id="search-title">Encontre seu próximo favorito</h1>
              <form className="search-form" onSubmit={submitSearch}>
                <Search aria-hidden="true" />
                <input
                  key={searchTerm}
                  type="search"
                  name="busca"
                  defaultValue={searchTerm}
                  placeholder="Busque por nome ou categoria"
                  aria-label="Buscar produtos"
                />
                <button type="submit">Buscar</button>
              </form>
              <a className="search-close" href="/">
                <X aria-hidden="true" /> Voltar ao início
              </a>
            </div>
          </section>
        )}
        <section className="collection" aria-labelledby="collection-title">
          {isLandingView && (
            <div id="novidades">
              <ProductCarousel
                title="Novidades"
                products={newsProducts}
                isLoading={isLoading}
              />
            </div>
          )}

          <div className="collection-toolbar" id="colecao" data-reveal>
            <div>
              <p className="section-kicker">
                {isSearchView ? 'Pesquisa' : 'seleção especial'}
              </p>
              <h2 id="collection-title">{collectionTitle}</h2>
            </div>
            {!isSearchView && (
              <label className="catalog-filter" htmlFor="catalog-category">
                <span>Filtrar produtos</span>
                <select
                  id="catalog-category"
                  value={selectedCategory ? selectedSlug : 'todos'}
                  onChange={(event) => chooseCategory(event.target.value)}
                >
                  <option value="todos">Todos</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <div className="collection-grid">
            <ProductGrid
              products={selectedProducts}
              isLoading={isLoading}
              emptySearchTerm={isSearchView ? searchTerm : undefined}
              emptyCategory={isSearchView ? undefined : selectedCategory?.name}
            />
          </div>
        </section>
      </MotionScene>
      <SiteFooter />
    </main>
  );
}
