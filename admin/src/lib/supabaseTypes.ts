export type ProfileRole = 'superadmin' | 'admin';

export type DbProfile = {
  id: string;
  email: string;
  role: ProfileRole;
  client_id: string | null;
  must_change_password: boolean;
};

export type DbClient = {
  id: string;
  slug: string;
  country: string;
  template: string;
  store_name: string;
  status: 'active' | 'suspended' | 'trial';
  monthly_fee: number;
  live_url: string;
  whatsapp_number: string;
  store_phone: string;
  address: string;
  primary_color: string;
  logo_url: string;
  admin_email: string;
  admin_temp_password: string;
  admin_last_login_at: string | null;
  products_count: number;
  products_last_updated_at: string | null;
  accessories_last_updated_at: string | null;
  site_active: boolean;
  billing: Record<string, unknown>;
  instagram: string;
  facebook: string;
  timings: string;
  age_verification_enabled: boolean;
  delivery_available: boolean;
  delivery_radius_miles: number;
  minimum_order_amount_usd: number;
  notes: unknown[];
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
  featured_group: 'watch' | 'toy' | 'accessory' | null;
  featured_sort: number | null;
  sort_order: number;
};

export type ProductInsert = Omit<DbProduct, 'id'> & { id?: string };
export type ProductUpdate = Partial<Omit<DbProduct, 'id' | 'client_id'>>;
