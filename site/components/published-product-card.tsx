'use client';

import { BadgePercent, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { digitsToCents, formatPrice } from '@/lib/format';
import type { Product } from '@/lib/types';

export function PublishedProductCard({
  initial,
  busy,
  onSave,
  onDelete,
}: {
  initial: Product;
  busy: boolean;
  onSave: (product: Product) => void;
  onDelete: (id: number) => void;
}) {
  const [product, setProduct] = useState(initial);
  const [promotion, setPromotion] = useState(
    Boolean(initial.sale_price_cents),
  );

  const valid = Boolean(
    product.name.trim() &&
      product.price_cents > 0 &&
      (!promotion ||
        (product.sale_price_cents &&
          product.sale_price_cents > 0 &&
          product.sale_price_cents < product.price_cents)),
  );

  function save() {
    onSave({
      ...product,
      sale_price_cents: promotion ? product.sale_price_cents : null,
    });
  }

  function remove() {
    if (
      window.confirm(
        'Retirar este produto do site? A captura original irá para Ignorados.',
      )
    )
      onDelete(product.id);
  }

  return (
    <article className="published-product-card">
      <img src={product.primary_image_url} alt={product.name} />
      <div className="published-product-fields">
        <div className="published-product-heading">
          <div>
            <span>Produto publicado</span>
            <h2>{product.name}</h2>
          </div>
          <a href={`/produto/${product.slug}`} target="_blank">
            Ver no site
          </a>
        </div>
        <div className="published-product-grid">
          <div className="field">
            <label htmlFor={`published-name-${product.id}`}>Nome</label>
            <input
              id={`published-name-${product.id}`}
              maxLength={120}
              value={product.name}
              onChange={(event) =>
                setProduct({ ...product, name: event.target.value })
              }
            />
          </div>
          <div className="field">
            <label htmlFor={`published-category-${product.id}`}>
              Categoria
            </label>
            <input
              id={`published-category-${product.id}`}
              maxLength={80}
              value={product.category || ''}
              onChange={(event) =>
                setProduct({ ...product, category: event.target.value })
              }
            />
          </div>
          <div className="field">
            <label htmlFor={`published-price-${product.id}`}>Preço</label>
            <input
              id={`published-price-${product.id}`}
              inputMode="numeric"
              value={formatPrice(product.price_cents)}
              onChange={(event) =>
                setProduct({
                  ...product,
                  price_cents: digitsToCents(event.target.value),
                })
              }
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor={`published-description-${product.id}`}>
            Descrição
          </label>
          <textarea
            id={`published-description-${product.id}`}
            rows={3}
            maxLength={800}
            value={product.description || ''}
            onChange={(event) =>
              setProduct({ ...product, description: event.target.value })
            }
          />
        </div>
        <section className="published-promotion">
          <label className="promotion-toggle">
            <input
              type="checkbox"
              checked={promotion}
              onChange={(event) => {
                setPromotion(event.target.checked);
                if (!event.target.checked)
                  setProduct({ ...product, sale_price_cents: null });
              }}
            />
            <BadgePercent size={18} /> Aplicar promoção
          </label>
          {promotion && (
            <div className="field">
              <label htmlFor={`published-sale-${product.id}`}>
                Preço promocional
              </label>
              <input
                id={`published-sale-${product.id}`}
                inputMode="numeric"
                value={formatPrice(product.sale_price_cents || 0)}
                onChange={(event) =>
                  setProduct({
                    ...product,
                    sale_price_cents: digitsToCents(event.target.value),
                  })
                }
              />
              <small>Deve ser menor que o preço normal.</small>
            </div>
          )}
        </section>
        <div className="published-product-actions">
          <button
            className="button-pop danger-button"
            onClick={remove}
            disabled={busy}
          >
            <Trash2 size={17} /> Excluir do site
          </button>
          <button
            className="button-pop button-primary"
            onClick={save}
            disabled={busy || !valid}
          >
            <Save size={17} /> {busy ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </article>
  );
}
