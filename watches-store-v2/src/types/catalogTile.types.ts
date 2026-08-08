export type CatalogTileItem = {
  id: string;
  name: string;
  brand: string;
  /** Sorting / future filters */
  priceInr: number;
  /** Display price, e.g. ₹12,499 */
  priceLabel: string;
  image: string;
};

export type SubcategoryCatalogKey =
  | 'smart-watches'
  | 'dial-watches'
  | 'kids-watches'
  | 'mobiles'
  | 'rc-toys'
  | 'soft-toys'
  | 'education-toys'
  | 'cables'
  | 'headphones'
  | 'phone-accessories'
  | 'gadgets';

export const TOY_SUBCATEGORY_KEYS = ['rc-toys', 'soft-toys', 'education-toys'] as const satisfies readonly SubcategoryCatalogKey[];
