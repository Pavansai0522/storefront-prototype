export type DbClientPublic = {
  id: string;
  slug: string;
  store_name: string;
  whatsapp_number: string;
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
  subcategory: string | null;
  featured_group: 'watch' | 'toy' | 'accessory' | null;
  featured_sort: number | null;
  sort_order: number;
};
