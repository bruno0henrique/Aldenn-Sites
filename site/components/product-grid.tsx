import { ArrowRight, Sparkles } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';

export function ProductGrid({ products, isLoading }: { products: Product[]; isLoading: boolean }) {
  if (isLoading) return <div className="product-grid" aria-label="Carregando produtos">{[1, 2, 3, 4].map(i => <div className="product-skeleton" key={i} />)}</div>;
  if (!products.length) return <div className="catalog-empty" data-reveal><span><Sparkles /></span><h3>Em breve, novos produtos</h3><p>A primeira seleção Belleland está sendo preparada com carinho.</p><a href="https://instagram.com/bellelandcloset" target="_blank" rel="noreferrer">Acompanhar no Instagram <ArrowRight size={16} /></a></div>;
  return <div className="product-grid">{products.map(product => <a className="product-card" href={`/produto/${product.slug}`} key={product.id} data-reveal><div className="product-image"><img src={product.primary_image_url} alt={product.name} /><span>New</span></div><div><h3>{product.name}</h3><p>{formatPrice(product.price_cents)}</p></div></a>)}</div>;
}
