import type { Capture, CatalogCategory, HomeBanner, Product } from '@/lib/types';

const photo = (id: number) => `/demo/${id}.jpg`;

const samples = [
  { id: 5885840, name: 'Vestido marrom', category: 'Vestidos', price: 14990 },
  { id: 1958701, name: 'Cropped casual', category: 'Cropped', price: 7990 },
  { id: 11506072, name: 'Look com blazer', category: 'Conjuntos', price: 21990 },
  { id: 13064308, name: 'Blazer branco', category: 'Básicos', price: 18990 },
  { id: 2733702, name: 'Cropped floral', category: 'Cropped', price: 8990 },
  { id: 12453975, name: 'Blusa branca', category: 'Básicos', price: 9990 },
  { id: 13200072, name: 'Shorts preto', category: 'Shorts', price: 11990 },
  { id: 8325371, name: 'Saia floral', category: 'Saias', price: 12990 },
  { id: 15240408, name: 'Saia xadrez', category: 'Saias', price: 13990 },
  { id: 14622813, name: 'Look rosa', category: 'Conjuntos', price: 19990 },
] as const;

export const demoProducts: Product[] = samples.map((sample, index) => ({
  id: -100 - index,
  slug: `amostra-${index + 1}`,
  name: sample.name,
  description: 'Peça ilustrativa criada somente para testar a apresentação da loja.',
  category: sample.category,
  price_cents: sample.price,
  sale_price_cents: index === 0 || index === 9 ? sample.price - 2000 : null,
  instagram_url: null,
  primary_image_url: photo(sample.id),
  images: [photo(sample.id)],
}));

export const demoCategories: CatalogCategory[] = [
  'Vestidos',
  'Cropped',
  'Conjuntos',
  'Básicos',
  'Saias',
  'Shorts',
].map((name, index) => ({
  id: -index - 1,
  name,
  slug: name.toLowerCase(),
  sort_order: index,
  is_active: true,
}));

export const demoBanners: HomeBanner[] = [demoProducts[0], demoProducts[9]].map(
  (product, index) => ({
    id: product.id,
    product_id: product.id,
    media_position: 0,
    sort_order: index,
    is_active: true,
    eyebrow: 'Vitrine de demonstração',
    title: product.name,
    description: 'Composição ilustrativa para testar o carrossel.',
    cta_label: 'Ver amostra',
    cta_url: `/demo/produto/${product.slug}`,
    image_url: product.primary_image_url,
    product,
  }),
);

export const demoPublishedCaptures: Capture[] = demoProducts.map((product) => ({
  id: product.id,
  instagram_shortcode: product.slug,
  source_url: '',
  proposed_name: product.name,
  proposed_description: product.description,
  proposed_category: product.category,
  price_cents: product.price_cents,
  proposed_sale_price_cents: product.sale_price_cents,
  status: 'published',
  capture_media: [
    {
      id: product.id,
      public_url: product.primary_image_url,
      decision: 'primary',
      source_position: 0,
    },
  ],
}));
