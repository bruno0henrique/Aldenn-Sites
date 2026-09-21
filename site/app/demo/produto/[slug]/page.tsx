'use client';

import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { demoProducts } from '@/lib/demo-catalog';
import { formatPrice } from '@/lib/format';

export default function DemoProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = demoProducts.find((item) => item.slug === slug);

  return (
    <main className="surface-page demo-product-page">
      <nav className="simple-nav">
        <a className="back-link" href="/demo#colecao">
          <ArrowLeft size={18} /> Voltar à demonstração
        </a>
        <img src="/brand/belleland-logo.svg" alt="Belleland Closet" />
      </nav>
      <div className="demo-notice" role="note">
        <strong>Demonstração</strong>
        <span>Foto e preço ilustrativos. Esta peça não está à venda.</span>
        <a href="/">Ver loja real</a>
      </div>
      {product ? (
        <article className="product-detail">
          <div className="product-detail-grid">
            <img
              className="product-gallery-main"
              src={product.primary_image_url}
              alt={`Foto ilustrativa de ${product.name}`}
            />
            <div className="product-info">
              <span className="eyebrow">{product.category}</span>
              <h1>{product.name}</h1>
              {product.sale_price_cents ? (
                <div className="product-detail-prices">
                  <del>{formatPrice(product.price_cents)}</del>
                  <p className="product-price">
                    {formatPrice(product.sale_price_cents)}
                  </p>
                  <span>Preço de teste</span>
                </div>
              ) : (
                <p className="product-price">{formatPrice(product.price_cents)}</p>
              )}
              <p className="product-description">{product.description}</p>
              <p className="product-note">
                Amostra visual. Para ver peças disponíveis, acesse a loja real.
              </p>
              <a className="button-pop button-primary full" href="/">
                Ver loja real
              </a>
            </div>
          </div>
        </article>
      ) : (
        <div className="catalog-empty demo-not-found">
          <h1>Peça de teste não encontrada</h1>
          <a href="/demo">Voltar à demonstração</a>
        </div>
      )}
    </main>
  );
}
