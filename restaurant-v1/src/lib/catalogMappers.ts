import type { Product } from '../types/product.types';
import type { RestaurantCategory } from '../types/product.types';
import type { DbProduct } from './supabaseTypes';

const RESTAURANT_CATEGORIES: readonly RestaurantCategory[] = [
  'Starters',
  'Biryani',
  'Curries',
  'Tandoor',
  'Thali',
  'Beverages',
  'Other',
];

function toRestaurantCategory(value: string): RestaurantCategory {
  if (RESTAURANT_CATEGORIES.includes(value as RestaurantCategory)) {
    return value as RestaurantCategory;
  }
  return 'Other';
}

export function mapDbProductToCatalog(row: DbProduct): Product {
  const category = toRestaurantCategory(row.subcategory ?? row.category ?? 'Other');
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category,
    price: row.price_inr,
    image: row.image_url ?? '',
    inStock: row.in_stock,
    badge: row.featured_group === 'featured' ? 'Popular' : undefined,
  };
}

export function featuredProductsFromRows(rows: DbProduct[]): Product[] {
  return rows
    .filter((row) => row.featured_group === 'featured')
    .sort((a, b) => (a.featured_sort ?? 0) - (b.featured_sort ?? 0))
    .map(mapDbProductToCatalog);
}

/** @deprecated use featuredProductsFromRows */
export function dealProductsFromRows(rows: DbProduct[]): Product[] {
  return featuredProductsFromRows(rows);
}
