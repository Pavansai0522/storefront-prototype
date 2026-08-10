export type FeaturedGroupSeed = 'watch' | 'toy' | 'accessory' | 'deal' | 'trending';

export type ProductSeedItem = {
  name: string;
  brand: string;
  priceInr: number;
  emiPriceInr?: number;
  imageUrl: string;
  inStock?: boolean;
  category: string;
  subcategory?: string | null;
  isAccessory: boolean;
  featuredGroup?: FeaturedGroupSeed | null;
  featuredSort?: number | null;
  dietType?: 'veg' | 'non-veg' | null;
};

export type DbProductInsert = {
  client_id: string;
  name: string;
  brand: string;
  price_inr: number;
  emi_price_inr: number | null;
  image_url: string;
  in_stock: boolean;
  category: string;
  subcategory: string | null;
  is_accessory: boolean;
  featured_group: FeaturedGroupSeed | null;
  featured_sort: number | null;
  sort_order: number;
  diet_type: 'veg' | 'non-veg' | null;
};

export function toDbProductRows(clientId: string, items: ProductSeedItem[]): DbProductInsert[] {
  return items.map((item, index) => ({
    client_id: clientId,
    name: item.name,
    brand: item.brand,
    price_inr: item.priceInr,
    emi_price_inr:
      item.emiPriceInr ?? (item.isAccessory ? null : Math.max(1, Math.round(item.priceInr / 12))),
    image_url: item.imageUrl,
    in_stock: item.inStock ?? true,
    category: item.category,
    subcategory: item.subcategory ?? null,
    is_accessory: item.isAccessory,
    featured_group: item.featuredGroup ?? null,
    featured_sort: item.featuredSort ?? null,
    sort_order: index,
    diet_type: item.dietType ?? null,
  }));
}
