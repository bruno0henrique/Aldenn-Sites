'use client';

import { ArrowLeft, Camera, MessageCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getProduct } from '@/lib/catalog';
import { formatPrice } from '@/lib/format';
import { whatsappUrl } from '@/lib/whatsapp';

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', params.slug],
    queryFn: () => getProduct(params.slug),
  });
  const [selected, setSelected] = useState(0);
  if (isLoading)
    return (
      <main className="surface-page">
        <div className="product-detail">Carregando peça…</div>
      </main>
    );
  if (!product)
    return (
      <main className="surface-page">
        <nav className="simple-nav">
          <a className="back-link" href="/">
            <ArrowLeft size={18} /> Voltar
          </a>
          <img src="/brand/belleland-logo.svg" alt="Belleland Closet" />
        </nav>
        <div
          className="catalog-empty"
          style={{ margin: '50px auto', maxWidth: 600 }}
        >
          <h1>Peça não encontrada</h1>
          <p>Ela pode ter saído da coleção ou ainda não estar disponível.</p>
          <a href="/">Voltar para o início</a>
        </div>
      </main>
    );
  const images = product.images?.length
    ? product.images
    : [product.primary_image_url];
  const reserve = whatsappUrl({
    name: product.name,
    price: formatPrice(product.price_cents),
    url: typeof window === 'undefined' ? '' : window.location.href,
  });
  return (
    <main className="surface-page">
      <nav className="simple-nav">
        <a className="back-link" href="/">
          <ArrowLeft size={18} /> Voltar
        </a>
        <img src="/brand/belleland-logo.svg" alt="Belleland Closet" />
      </nav>
      <article className="product-detail">
        <div className="product-detail-grid">
          <div>
            <img
              className="product-gallery-main"
              src={images[selected]}
              alt={`${product.name} — foto ${selected + 1}`}
            />
            {images.length > 1 && (
              <div className="thumb-row">
                {images.map((image, index) => (
                  <button
                    className={index === selected ? 'active' : ''}
                    onClick={() => setSelected(index)}
                    aria-label={`Ver foto ${index + 1}`}
                    key={image}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="product-info">
            <span className="eyebrow">
              {product.category || 'Belleland Closet'}
            </span>
            <h1>{product.name}</h1>
            <p className="product-price">{formatPrice(product.price_cents)}</p>
            {product.description && (
              <p className="product-description">{product.description}</p>
            )}
            <p className="product-note">
              A reserva é combinada diretamente com a Belleland pelo WhatsApp.
              Este site não processa pagamentos.
            </p>
            <a
              className="button-pop button-primary full"
              href={reserve}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={19} /> Reservar no WhatsApp
            </a>
            {product.instagram_url && (
              <a
                className="back-link"
                style={{ marginTop: 18 }}
                href={product.instagram_url}
                target="_blank"
                rel="noreferrer"
              >
                <Camera size={17} /> Ver publicação original
              </a>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
