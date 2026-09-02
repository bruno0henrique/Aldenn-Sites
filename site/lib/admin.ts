import { requireSupabase } from '@/lib/supabase';
import { getPublishedProducts } from '@/lib/catalog';
import type {
  Capture,
  CatalogCategory,
  HomeBanner,
  Product,
} from '@/lib/types';

export type InstagramSyncResult = {
  created: number;
  skipped: number;
  scanned: number;
};

export type ProductImageAnalysis = {
  name: string;
  category: string;
  color: string;
  size: string;
  price_cents: number;
  description: string;
  visible_text: string;
  confidence: number;
  warnings: string[];
};

export async function analyzeProductImage(
  image: File,
): Promise<ProductImageAnalysis> {
  const formData = new FormData();
  formData.append('image', image);
  const response = await fetch('/api/admin/analyze-product-image', {
    method: 'POST',
    body: formData,
    credentials: 'same-origin',
  });
  const body = (await response.json()) as {
    analysis?: ProductImageAnalysis;
    error?: string;
  };
  if (!response.ok || !body.analysis) {
    throw new Error(body.error || 'Não foi possível analisar a imagem.');
  }
  return body.analysis;
}

export async function syncInstagramPosts(): Promise<InstagramSyncResult> {
  const supabase = requireSupabase();
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error('Sessão expirada.');
  const response = await fetch('/api/instagram_sync', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${data.session.access_token}`,
    },
  });
  const body = (await response.json()) as InstagramSyncResult & {
    error?: string;
  };
  if (!response.ok)
    throw new Error(body.error || 'Não foi possível sincronizar o Instagram.');
  return body;
}

export async function assertStaff() {
  const supabase = requireSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Sessão expirada.');
  const { data, error } = await supabase
    .from('staff_members')
    .select('role')
    .eq('user_id', auth.user.id)
    .maybeSingle();
  if (error || !['owner', 'admin'].includes(data?.role || ''))
    throw new Error('Esta conta não tem acesso às aprovações.');
  return auth.user;
}
export async function listCaptures(status: string): Promise<Capture[]> {
  await assertStaff();
  const { data, error } = await requireSupabase()
    .from('instagram_captures')
    .select(
      'id,instagram_shortcode,source_url,proposed_name,proposed_description,proposed_category,price_cents,proposed_sale_price_cents,status,capture_media(id,public_url,storage_path,decision,source_position)',
    )
    .eq('status', status)
    .order('captured_at');
  if (error) throw error;
  return (data || []) as Capture[];
}
export async function saveCapture(capture: Capture) {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from('instagram_captures')
    .update({
      proposed_name: capture.proposed_name,
      proposed_description: capture.proposed_description,
      proposed_category: capture.proposed_category,
      price_cents: capture.price_cents,
      proposed_sale_price_cents: capture.proposed_sale_price_cents,
      status: 'in_review',
    })
    .eq('id', capture.id);
  if (error) throw error;
  const primary = capture.capture_media.find(
    (media) => media.decision === 'primary',
  );
  const { error: demoteError } = await supabase
    .from('capture_media')
    .update({ decision: 'secondary' })
    .eq('capture_id', capture.id)
    .eq('decision', 'primary');
  if (demoteError) throw demoteError;
  for (const media of capture.capture_media.filter(
    (item) => item.id !== primary?.id,
  )) {
    const { error: mediaError } = await supabase
      .from('capture_media')
      .update({ decision: media.decision })
      .eq('id', media.id)
      .eq('capture_id', capture.id);
    if (mediaError) throw mediaError;
  }
  if (primary) {
    const { error: primaryError } = await supabase
      .from('capture_media')
      .update({ decision: 'primary' })
      .eq('id', primary.id)
      .eq('capture_id', capture.id);
    if (primaryError) throw primaryError;
  }
}
export async function publishCapture(capture: Capture) {
  await saveCapture(capture);
  const { data, error } = await requireSupabase().rpc('publish_capture', {
    target_capture_id: capture.id,
  });
  if (error) throw error;
  return data as number;
}
export async function setCaptureStatus(
  id: number,
  status: 'pending_review' | 'ignored',
) {
  await assertStaff();
  const { error } = await requireSupabase()
    .from('instagram_captures')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function createManualCapture({
  name,
  description,
  category,
  priceCents,
  salePriceCents,
  image,
}: {
  name: string;
  description: string;
  category: string;
  priceCents: number;
  salePriceCents: number;
  image: File;
}) {
  const user = await assertStaff();
  const allowedImageTypes: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  const extension = allowedImageTypes[image.type];
  if (!extension) throw new Error('Selecione uma imagem válida.');
  if (image.size > 10 * 1024 * 1024)
    throw new Error('A imagem deve ter no máximo 10 MB.');
  if (priceCents <= 0) throw new Error('Informe um preço válido.');
  if (salePriceCents > 0 && salePriceCents >= priceCents)
    throw new Error('O preço promocional deve ser menor que o preço normal.');

  const supabase = requireSupabase();
  const manualId = crypto.randomUUID();
  const { data: capture, error: captureError } = await supabase
    .from('instagram_captures')
    .insert({
      instagram_shortcode: `manual-${manualId}`,
      source_url: '',
      captured_at: new Date().toISOString(),
      status: 'pending_review',
      proposed_name: name.trim(),
      proposed_description: description.trim() || null,
      proposed_category: category.trim() || null,
      price_cents: priceCents || null,
      proposed_sale_price_cents: salePriceCents || null,
    })
    .select('id')
    .single();
  if (captureError) throw captureError;

  const storagePath = `manual/${user.id}/${manualId}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from('product-media')
    .upload(storagePath, image, { contentType: image.type, upsert: false });
  if (uploadError) {
    await supabase.from('instagram_captures').delete().eq('id', capture.id);
    throw uploadError;
  }

  const { data: publicImage } = supabase.storage
    .from('product-media')
    .getPublicUrl(storagePath);
  const { error: mediaError } = await supabase.from('capture_media').insert({
    capture_id: capture.id,
    source_position: 0,
    source_url: publicImage.publicUrl,
    storage_path: storagePath,
    public_url: publicImage.publicUrl,
    mime_type: image.type,
    decision: 'primary',
  });
  if (mediaError) {
    await supabase.storage.from('product-media').remove([storagePath]);
    await supabase.from('instagram_captures').delete().eq('id', capture.id);
    throw mediaError;
  }
  return capture.id as number;
}

export async function deleteCapture(capture: Capture) {
  await assertStaff();
  const supabase = requireSupabase();
  const paths = capture.capture_media
    .map((media) => media.storage_path)
    .filter((path): path is string => Boolean(path));
  const { error } = await supabase
    .from('instagram_captures')
    .delete()
    .eq('id', capture.id);
  if (error) throw error;
  if (paths.length) await supabase.storage.from('product-media').remove(paths);
}

export async function listPublishedProductsAdmin(): Promise<Product[]> {
  await assertStaff();
  return getPublishedProducts();
}

export async function listCatalogCategoriesAdmin(): Promise<CatalogCategory[]> {
  await assertStaff();
  const { data, error } = await requireSupabase()
    .from('catalog_categories')
    .select('id,name,slug,sort_order,is_active')
    .order('sort_order')
    .order('name');
  if (error) throw error;
  return (data || []) as CatalogCategory[];
}

function categorySlug(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function createCatalogCategory(name: string) {
  await assertStaff();
  const cleanedName = name.trim();
  const slug = categorySlug(cleanedName);
  if (cleanedName.length < 2 || !slug)
    throw new Error('Informe um nome de categoria válido.');
  const supabase = requireSupabase();
  const { data: last } = await supabase
    .from('catalog_categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  const { error } = await supabase.from('catalog_categories').insert({
    name: cleanedName,
    slug,
    sort_order: (last?.sort_order || 0) + 10,
  });
  if (error) throw error;
}

export async function updateCatalogCategory(
  id: number,
  updates: Partial<Pick<CatalogCategory, 'name' | 'is_active' | 'sort_order'>>,
) {
  await assertStaff();
  const payload = { ...updates } as Record<string, string | number | boolean>;
  if (typeof updates.name === 'string') {
    const name = updates.name.trim();
    const slug = categorySlug(name);
    if (name.length < 2 || !slug)
      throw new Error('Informe um nome de categoria válido.');
    payload.name = name;
    payload.slug = slug;
  }
  const { error } = await requireSupabase()
    .from('catalog_categories')
    .update(payload)
    .eq('id', id);
  if (error) throw error;
}

export async function reorderCatalogCategories(categories: CatalogCategory[]) {
  await assertStaff();
  const supabase = requireSupabase();
  const results = await Promise.all(
    categories.map((category, index) =>
      supabase
        .from('catalog_categories')
        .update({ sort_order: (index + 1) * 10 })
        .eq('id', category.id),
    ),
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;
}

export type HomeBannerRow = Omit<HomeBanner, 'image_url' | 'product'>;

export async function listHomeBannersAdmin(): Promise<HomeBannerRow[]> {
  await assertStaff();
  const { data, error } = await requireSupabase()
    .from('home_banners')
    .select('id,product_id,media_position,sort_order,is_active')
    .order('sort_order')
    .order('id');
  if (error) throw error;
  return (data || []) as HomeBannerRow[];
}

export async function createHomeBanner({
  productId,
  mediaPosition,
}: {
  productId: number;
  mediaPosition: number;
}) {
  await assertStaff();
  const supabase = requireSupabase();
  const { data: last } = await supabase
    .from('home_banners')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  const { error } = await supabase.from('home_banners').insert({
    product_id: productId,
    media_position: mediaPosition,
    sort_order: (last?.sort_order || 0) + 10,
  });
  if (error) throw error;
}

export async function updateHomeBanner(
  id: number,
  updates: Partial<
    Pick<
      HomeBannerRow,
      'product_id' | 'media_position' | 'sort_order' | 'is_active'
    >
  >,
) {
  await assertStaff();
  const { error } = await requireSupabase()
    .from('home_banners')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

export async function reorderHomeBanners(banners: HomeBannerRow[]) {
  await assertStaff();
  const supabase = requireSupabase();
  const results = await Promise.all(
    banners.map((banner, index) =>
      supabase
        .from('home_banners')
        .update({ sort_order: (index + 1) * 10 })
        .eq('id', banner.id),
    ),
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;
}

export async function deleteHomeBanner(id: number) {
  await assertStaff();
  const { error } = await requireSupabase()
    .from('home_banners')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function updatePublishedProduct(product: Product) {
  await assertStaff();
  const { error } = await requireSupabase().rpc('update_published_product', {
    target_product_id: product.id,
    new_name: product.name.trim(),
    new_description: product.description || '',
    new_category: product.category || '',
    new_price_cents: product.price_cents,
    new_sale_price_cents: product.sale_price_cents || null,
  });
  if (error) throw error;
}

export async function removePublishedProduct(id: number) {
  await assertStaff();
  const { error } = await requireSupabase().rpc('remove_published_product', {
    target_product_id: id,
  });
  if (error) throw error;
}
