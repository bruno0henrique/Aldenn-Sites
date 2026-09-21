'use client';

import { useMemo, useState } from 'react';
import { HeroCarousel } from '@/components/hero-carousel';
import { ProductCarousel } from '@/components/product-carousel';
import { ProductGrid } from '@/components/product-grid';
import { demoBanners, demoCategories, demoProducts } from '@/lib/demo-catalog';
import type { Product } from '@/lib/types';

const demoHref = (product: Product) => `/demo/produto/${product.slug}`;

export default function DemoPage() {
  const [category, setCategory] = useState('todos');
  const selectedCategory = demoCategories.find((item) => item.slug === category);
  const selectedProducts = useMemo(
    () =>
      selectedCategory
        ? demoProducts.filter((item) => item.category === selectedCategory.name)
        : demoProducts,
    [selectedCategory],
  );

  return (
    <main className="min-h-screen overflow-hidden bg-cream text-cocoa demo-storefront">
      <header className="brand-header demo-storefront-header">
        <a href="/demo" aria-label="Vitrine de demonstração, início">
          <img src="/brand/belleland-logo.svg" alt="Belleland Closet" />
        </a>
        <a className="demo-real-link" href="/">Ver loja real</a>
      </header>
      <div className="demo-notice" role="note">
        <strong>Demonstração</strong>
        <span>
          Dez peças e preços fictícios com fotos ilustrativas. Nada aqui está à venda
          ou publicado no catálogo real.
        </span>
        <a href="/admin?preview=1">Painel de teste</a>
      </div>
      <HeroCarousel banners={demoBanners} demo />
      <section className="collection" aria-labelledby="demo-collection-title">
        <div id="novidades">
          <ProductCarousel
            title="Novidades"
            products={demoProducts}
            productHref={demoHref}
            helpHref={null}
          />
        </div>
        <div className="collection-toolbar" id="colecao">
          <div>
            <p className="section-kicker">seleção de demonstração</p>
            <h2 id="demo-collection-title">
              {selectedCategory?.name || 'First Drop'}
            </h2>
          </div>
          <label className="catalog-filter" htmlFor="demo-category">
            <span>Filtrar produtos</span>
            <select
              id="demo-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="todos">Todos</option>
              {demoCategories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="collection-grid">
          <ProductGrid
            products={selectedProducts}
            isLoading={false}
            emptyCategory={selectedCategory?.name}
            productHref={demoHref}
          />
        </div>
      </section>
      <footer className="demo-footer">
        <span>Belleland Closet · prévia com conteúdo ilustrativo</span>
        <a href="/">Voltar à loja real</a>
      </footer>
    </main>
  );
}
