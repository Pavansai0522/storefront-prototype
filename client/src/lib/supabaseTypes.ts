export type DbClientPublic = {
  id: string;
  slug: string;
  store_name: string;
  whatsapp_number: string;
  store_phone: string;
  address: string;
  timings: string;
  instagram: string;
  facebook: string;
  site_active: boolean;
  public_config: Record<string, unknown>;
};

export type DbProduct = {
  id: string;
  client_id: string;
  name: string;
  brand: string;
  price_inr: number;
  emi_price_inr: number | null;
  image_url: string | null;
  in_stock: boolean;
  category: string;
  subcategory: string | null;
  is_accessory: boolean;
  featured_group: 'watch' | 'toy' | 'accessory' | 'deal' | 'trending' | null;
  featured_sort: number | null;
  sort_order: number;
};
