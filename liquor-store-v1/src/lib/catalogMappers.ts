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

/** US liquor catalog stores shelf prices as cents in `price_inr`. */
function priceFromDbRow(row: DbProduct): number {
  if (row.price_inr >= 100) {
    return row.price_inr / 100;
  }
  return row.price_inr;
}

export function mapDbProductToCatalog(row: DbProduct): Product {
  const category = toLiquorCategory(row.subcategory ?? row.category ?? 'Other');
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category,
    price: priceFromDbRow(row),
    image: row.image_url ?? '',
    inStock: row.in_stock,
  };
}
