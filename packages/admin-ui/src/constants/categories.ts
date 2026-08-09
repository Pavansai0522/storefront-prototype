export const PRODUCT_CATEGORIES = [
  { value: 'Phone', label: 'Phone' },
  { value: 'Tablet', label: 'Tablet' },
  { value: 'Laptop', label: 'Laptop' },
  { value: 'Other', label: 'Other' },
  { value: 'Trending', label: 'Trending — Homepage hero' },
] as const;

/** Stored `Product.category` values — must match liquor-store-v1 catalog / `Product.category`. */
export const LIQUOR_CATEGORIES = [
  { value: 'Whisky', label: 'Whisky & Bourbon' },
  { value: 'Scotch', label: 'Scotch' },
  { value: 'Rare Bottles', label: 'Rare Bottles' },
  { value: 'Wine', label: 'Wine & Champagne' },
  { value: 'Vodka', label: 'Vodka & Gin' },
  { value: 'Beer', label: 'Beer & Craft' },
  { value: 'Tequila', label: 'Tequila & Mezcal' },
  { value: 'Rum', label: 'Rum & Brandy' },
  { value: 'Other', label: 'Other Spirits' },
] as const;

export type LiquorCategory = (typeof LIQUOR_CATEGORIES)[number]['value'];

/** Where a liquor product appears on the storefront (category still controls Spirits / Wine / Beer). */
export const LIQUOR_LISTING_OPTIONS = [
  { value: 'catalog', label: 'Catalog only (Shop, Spirits, Wine, Beer)' },
  { value: 'deals', label: 'Weekly specials — Deals page' },
] as const;

export type LiquorListingOption = (typeof LIQUOR_LISTING_OPTIONS)[number]['value'];

export const ACCESSORY_CATEGORIES = [
  { value: 'Case', label: 'Case' },
  { value: 'Charger', label: 'Charger' },
  { value: 'Earphone', label: 'Earphone' },
  { value: 'Cable', label: 'Cable' },
  { value: 'Other', label: 'Other' },
] as const;

export const RESTAURANT_CATEGORIES = [
  { value: 'Starters', label: 'Starters & Appetizers' },
  { value: 'Tandoor', label: 'Tandoor & Grill' },
  { value: 'Biryani', label: 'Biryani & Rice' },
  { value: 'Curries', label: 'Curries & Gravies' },
  { value: 'Thali', label: 'Thali & Family Combos' },
  { value: 'Beverages', label: 'Beverages' },
  { value: 'Other', label: "Chef's Specials" },
] as const;

export type RestaurantCategory = (typeof RESTAURANT_CATEGORIES)[number]['value'];

/** Matches watches-store-v2 `/accessories/*` catalog keys. */
export const WATCHES_ACCESSORY_SUBCATEGORY_KEYS = [
  'cables',
  'headphones',
  'phone-accessories',
  'gadgets',
] as const;

export type WatchesAccessorySubcategory = (typeof WATCHES_ACCESSORY_SUBCATEGORY_KEYS)[number];

export function isWatchesAccessorySubcategory(key: string | null | undefined): boolean {
  return Boolean(
    key &&
      (WATCHES_ACCESSORY_SUBCATEGORY_KEYS as readonly string[]).includes(key),
  );
}

/** Matches watches-store-v2 SubcategoryCatalogKey values. */
export const WATCHES_SUBCATEGORIES = [
  { value: 'smart-watches', label: 'Smart watches' },
  { value: 'dial-watches', label: 'Dial watches' },
  { value: 'kids-watches', label: 'Kids watches' },
  { value: 'mobiles', label: 'Mobiles' },
  { value: 'rc-toys', label: 'RC toys' },
  { value: 'soft-toys', label: 'Soft toys' },
  { value: 'education-toys', label: 'Education toys' },
  { value: 'cables', label: 'Cables' },
  { value: 'headphones', label: 'Headphones' },
  { value: 'phone-accessories', label: 'Phone accessories' },
  { value: 'gadgets', label: 'Gadgets' },
] as const;
