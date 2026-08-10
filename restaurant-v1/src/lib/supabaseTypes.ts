export type DbClientPublic = {
  id: string;
  slug: string;
  store_name: string;
  store_phone: string;
  address: string;
  timings: string;
  instagram: string;
  facebook: string;
  site_active: boolean;
  age_verification_enabled: boolean;
  delivery_available: boolean;
  delivery_radius_miles: number;
  minimum_order_amount_usd: number;
  public_config: Record<string, unknown>;
};

export type DbProduct = {
  id: string;
  client_id: string;
  name: string;
  brand: string;
  price_inr: number;
  image_url: string | null;
  in_stock: boolean;
  category: string;
  subcategory: string | null;
  sort_order: number;
  featured_group: 'watch' | 'toy' | 'accessory' | 'deal' | null;
  featured_sort: number | null;
  diet_type: 'veg' | 'non-veg' | null;
};
