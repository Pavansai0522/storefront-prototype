/** Catalog grid page size (matches subcategory product grids). */
export const CATALOG_PAGE_SIZE = 16;

/** Portal target for desktop catalog sort beside page titles. */
export const CATALOG_SORT_SLOT_ID = 'catalog-sort-slot';

export const CATALOG_PRICE_RANGES: { label: string; min: number; max: number }[] = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,500', min: 500, max: 1500 },
  { label: '₹1,500 – ₹3,500', min: 1500, max: 3500 },
  { label: '₹3,500 – ₹10,000', min: 3500, max: 10000 },
  { label: 'Above ₹10,000', min: 10000, max: Infinity },
];
