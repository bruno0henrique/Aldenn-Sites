export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  category: string | null;
  price_cents: number;
  sale_price_cents: number | null;
  instagram_url: string | null;
  primary_image_url: string;
  images?: string[];
};
export type CatalogCategory = {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
};
export type HomeBanner = {
  id: number;
  product_id: number | null;
  media_position: number;
  sort_order: number;
  is_active: boolean;
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  cta_label: string | null;
  cta_url: string | null;
  image_url: string;
  storage_path?: string | null;
  product: Product | null;
};
export type HomeFeaturedProduct = {
  id: number;
  product_id: number;
  sort_order: number;
  is_active: boolean;
};
export type CaptureMedia = {
  id: number;
  public_url: string;
  storage_path?: string;
  decision: 'pending' | 'primary' | 'secondary' | 'discarded';
  source_position: number;
};
export type Capture = {
  id: number;
  instagram_shortcode: string;
  source_url: string;
  proposed_name: string | null;
  proposed_description: string | null;
  proposed_category: string | null;
  price_cents: number | null;
  proposed_sale_price_cents: number | null;
  status: string;
  capture_media: CaptureMedia[];
};
