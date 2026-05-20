import type { ID, Nullable } from './utils.types';

export type ProductCategory =
  | 'Phone'
  | 'Tablet'
  | 'Laptop'
  | 'Other'
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

export type FeaturedGroup = 'watch' | 'toy' | 'accessory' | 'deal';

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
  /** Watches-store-v2 subcategory key (smart-watches, rc-toys, …). */
  subcategory?: Nullable<string>;
  featuredGroup?: Nullable<FeaturedGroup>;
  featuredSort?: Nullable<number>;
}

export function productCategoryKey(product: Product): string {
  return product.subcategory ?? product.category;
}
