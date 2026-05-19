import type { Product } from '../components/ProductCatalog';
import type { LiquorCategory } from '../types/product.types';
import type { DbProduct } from './supabaseTypes';

const LIQUOR_CATEGORIES: readonly LiquorCategory[] = [
  'Whisky',
  'Scotch',
  'Rare Bottles',
  'Wine',
  'Vodka',
  'Beer',
  'Tequila',
  'Rum',
  'Other',
];

function toLiquorCategory(value: string): LiquorCategory {
  if (LIQUOR_CATEGORIES.includes(value as LiquorCategory)) {
    return value as LiquorCategory;
  }
  return 'Other';
}

export function mapDbProductToCatalog(row: DbProduct): Product {
  const category = toLiquorCategory(row.subcategory ?? row.category ?? 'Other');
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category,
    price: row.price_inr,
    image: row.image_url ?? '',
    inStock: row.in_stock,
  };
}
