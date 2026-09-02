import { getSupabase } from '@/lib/supabase';
import type { CatalogCategory, HomeBanner, Product } from '@/lib/types';

type ProductRow = Omit<Product, 'primary_image_url' | 'images'> & {
  product_media: { public_url: string; role: string; position: number }[];
};
export function mapProduct(row: ProductRow): Product {
  const { product_media, ...product } = row;
  const media = [...(product_media || [])].sort(
    (a, b) => a.position - b.position,
  );
  return {
    ...product,
    primary_image_url:
      media.find((item) => item.role === 'primary')?.public_url ||
      media[0]?.public_url ||
      '',
    images: media.map((item) => item.public_url),
  };
}
export async function getCatalogCategories(): Promise<CatalogCategory[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('catalog_categories')
    .select('id,name,slug,sort_order,is_active')
    .eq('is_active', true)
    .order('sort_order')
    .order('name');
  if (error) throw error;
  return (data || []) as CatalogCategory[];
}

export async function getHomeBanners(): Promise<HomeBanner[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data: rows, error } = await supabase
    .from('home_banners')
    .select('id,product_id,media_position,sort_order,is_active')
    .eq('is_active', true)
    .order('sort_order')
    .order('id');
  if (error) throw error;
  if (!rows?.length) return [];
  const productIds = [...new Set(rows.map((row) => row.product_id))];
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(
      'id,slug,name,description,category,price_cents,sale_price_cents,instagram_url,product_media(public_url,role,position)',
    )
    .eq('status', 'published')
    .in('id', productIds);
  if (productsError) throw productsError;
  const productsById = new Map(
    ((products || []) as ProductRow[]).map((row) => {
      const product = mapProduct(row);
      return [product.id, product] as const;
    }),
  );
  return rows.flatMap((row) => {
    const product = productsById.get(row.product_id);
    if (!product) return [];
    return [
      {
        ...row,
        product,
        image_url:
          product.images?.[row.media_position] || product.primary_image_url,
      } as HomeBanner,
    ];
  });
}
export async function getPublishedProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('products')
    .select(
      'id,slug,name,description,category,price_cents,sale_price_cents,instagram_url,product_media(public_url,role,position)',
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (error) throw error;
  return (data as ProductRow[]).map(mapProduct);
}
export async function getProduct(slug: string): Promise<Product | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select(
      'id,slug,name,description,category,price_cents,sale_price_cents,instagram_url,product_media(public_url,role,position)',
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data as ProductRow) : null;
}
