import type { FeaturedProduct } from '../data/featured';
import type { CatalogTileItem, SubcategoryCatalogKey } from '../types/catalogTile.types';
import type { DbProduct } from './supabaseTypes';

export function formatInrLabel(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatEmiLabel(emi: number | null, priceInr: number): string {
  if (emi != null && emi > 0) {
    return formatInrLabel(emi);
  }
  const fallback = Math.max(1, Math.round(priceInr / 12));
  return formatInrLabel(fallback);
}

export function dbProductToCatalogTile(row: DbProduct): CatalogTileItem {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    priceInr: row.price_inr,
    priceLabel: formatInrLabel(row.price_inr),
    image: row.image_url ?? '',
  };
}

export function dbProductToFeatured(
  row: DbProduct,
  type: FeaturedProduct['type'],
): FeaturedProduct {
  return {
    id: row.featured_sort ?? 0,
    brand: row.brand.toUpperCase(),
    name: row.name,
    price: formatInrLabel(row.price_inr),
    emi: formatEmiLabel(row.emi_price_inr, row.price_inr),
    image: row.image_url ?? '',
    type,
  };
}

export function groupProductsBySubcategory(
  products: DbProduct[],
): Record<SubcategoryCatalogKey, CatalogTileItem[]> {
  const keys: SubcategoryCatalogKey[] = [
    'smart-watches',
    'dial-watches',
    'kids-watches',
    'rc-toys',
    'soft-toys',
    'education-toys',
    'cables',
    'headphones',
    'phone-accessories',
    'gadgets',
  ];
  const map = Object.fromEntries(keys.map((k) => [k, [] as CatalogTileItem[]])) as Record<
    SubcategoryCatalogKey,
    CatalogTileItem[]
  >;
  for (const row of products) {
    const key = row.subcategory as SubcategoryCatalogKey | null;
    if (!key || !(key in map)) {
      continue;
    }
    map[key].push(dbProductToCatalogTile(row));
  }
  return map;
}

export function featuredFromProducts(products: DbProduct[]): {
  watches: FeaturedProduct[];
  toys: FeaturedProduct[];
  accessories: FeaturedProduct[];
} {
  const watches: FeaturedProduct[] = [];
  const toys: FeaturedProduct[] = [];
  const accessories: FeaturedProduct[] = [];

  const featured = products
    .filter((p) => p.featured_group != null)
    .sort((a, b) => (a.featured_sort ?? 0) - (b.featured_sort ?? 0));

  for (const row of featured) {
    if (row.featured_group === 'watch') {
      watches.push(dbProductToFeatured(row, 'watch'));
    } else if (row.featured_group === 'toy') {
      toys.push(dbProductToFeatured(row, 'toy'));
    } else if (row.featured_group === 'accessory') {
      accessories.push(dbProductToFeatured(row, 'accessory'));
    }
  }

  return { watches, toys, accessories };
}
