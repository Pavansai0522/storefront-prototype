import type { ID, Nullable } from './utils.types';

export type ProductCategory =
  | 'Phone'
  | 'Tablet'
  | 'Laptop'
  | 'Other'
  | 'Trending'
  | 'Whisky'
  | 'Scotch'
  | 'Rare Bottles'
  | 'Wine'
  | 'Vodka'
  | 'Beer'
  | 'Tequila'
  | 'Rum'
  | 'Case'
  | 'Charger'
  | 'Earphone'
  | 'Cable';

export type FeaturedGroup = 'watch' | 'toy' | 'accessory' | 'deal' | 'trending';

export type RestaurantDietType = 'veg' | 'non-veg';

export interface Product {
  id: ID;
  clientId: ID;
  name: string;
  brand: string;
  price: number;
  emiPrice: number;
  image: Nullable<string>;
  inStock: boolean;
  category: ProductCategory;
  isAccessory: boolean;
  /** Restaurant template: veg or non-veg kitchen marker. */
  dietType?: Nullable<RestaurantDietType>;
  /** Watches storefront: up to 5 hex colors customers can select. */
  colors?: string[];
  /** Watches storefront: copy shown on the product detail page. */
  description?: string;
  /** Watches storefront: up to 5 photos. First is the catalog thumbnail. */
  images?: string[];
  /** Watches-store-v2 subcategory key (smart-watches, rc-toys, …). */
  subcategory?: Nullable<string>;
  featuredGroup?: Nullable<FeaturedGroup>;
  featuredSort?: Nullable<number>;
}

export function productCategoryKey(product: Product): string {
  return product.subcategory ?? product.category;
}
