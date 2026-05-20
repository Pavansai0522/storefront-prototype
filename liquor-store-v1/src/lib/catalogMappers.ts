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
function centsToDollars(cents: number): number {
  const truncated = Math.trunc(cents);
  const sign = truncated < 0 ? -1 : 1;
  const abs = Math.abs(truncated);
  return sign * (Math.floor(abs / 100) + (abs % 100) / 100);
}

function priceFromDbRow(row: DbProduct): number {
  if (row.price_inr >= 100) {
    return centsToDollars(row.price_inr);
  }
  return row.price_inr;
}

export function mapDbProductToCatalog(row: DbProduct): Product {
  const category = toLiquorCategory(row.subcategory ?? row.category ?? 'Other');
  const isDeal = row.featured_group === 'deal';
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category,
    price: priceFromDbRow(row),
    image: row.image_url ?? '',
    inStock: row.in_stock,
    badge: isDeal ? 'DEAL' : undefined,
  };
}

export function dealProductsFromRows(rows: DbProduct[]): Product[] {
  return rows
    .filter((row) => row.featured_group === 'deal')
    .sort((a, b) => (a.featured_sort ?? 0) - (b.featured_sort ?? 0))
    .map(mapDbProductToCatalog);
}
