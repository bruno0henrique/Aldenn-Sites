import { getSupabase } from '@/lib/supabase';
import type {
  CatalogCategory,
  HomeBanner,
  HomeFeaturedProduct,
  Product,
} from '@/lib/types';

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
    .select(
      'id,product_id,media_position,sort_order,is_active,image_url,storage_path,eyebrow,title,description,cta_label,cta_url',
    )
    .eq('is_active', true)
    .order('sort_order')
    .order('id');
  if (error) throw error;
  if (!rows?.length) return [];
  const productIds = [
    ...new Set(
      rows
        .map((row) => row.product_id)
        .filter((id): id is number => typeof id === 'number'),
    ),
  ];
  const productResult = productIds.length
    ? await supabase
        .from('products')
        .select(
          'id,slug,name,description,category,price_cents,sale_price_cents,instagram_url,product_media(public_url,role,position)',
        )
        .eq('status', 'published')
        .in('id', productIds)
    : { data: [], error: null };
  if (productResult.error) throw productResult.error;
  const productsById = new Map(
    ((productResult.data || []) as ProductRow[]).map((row) => {
      const product = mapProduct(row);
      return [product.id, product] as const;
    }),
  );
  return rows.flatMap((row) => {
    const product = row.product_id
      ? productsById.get(row.product_id) || null
      : null;
    if (row.product_id && !product) return [];
    const imageUrl =
      row.image_url ||
      product?.images?.[row.media_position] ||
      product?.primary_image_url;
    if (!imageUrl) return [];
    return [
      {
        ...row,
        product,
        image_url: imageUrl,
      } as HomeBanner,
    ];
  });
}

export async function getHomeFeaturedProducts(): Promise<{
  configured: boolean;
  products: Product[];
}> {
  const supabase = getSupabase();
  if (!supabase) return { configured: false, products: [] };
  const { data: rows, error } = await supabase
    .from('home_featured_products')
    .select('id,product_id,sort_order,is_active')
    .order('sort_order')
    .order('id');
  if (error) {
    if (error.code === '42P01') return { configured: false, products: [] };
    throw error;
  }
  const items = (rows || []) as HomeFeaturedProduct[];
  if (!items.length) return { configured: false, products: [] };
  const activeIds = items
    .filter((item) => item.is_active)
    .map((item) => item.product_id);
  if (!activeIds.length) return { configured: true, products: [] };
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(
      'id,slug,name,description,category,price_cents,sale_price_cents,instagram_url,product_media(public_url,role,position)',
    )
    .eq('status', 'published')
    .in('id', activeIds);
  if (productsError) throw productsError;
  const productsById = new Map(
    ((products || []) as ProductRow[]).map((row) => {
      const product = mapProduct(row);
      return [product.id, product] as const;
    }),
  );
  return {
    configured: true,
    products: activeIds.flatMap((id) => {
      const product = productsById.get(id);
      return product ? [product] : [];
    }),
  };
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
