export interface Phone {
  id: string | number;
  brand: string;
  name: string;
  price: string;
  priceValue: number;
  emi: string;
  img: string;
  /** Homepage hero spotlight — set via admin category "Trending". */
  isHeroTrending?: boolean;
}

/** Liquor template catalog values — aligned with admin `LIQUOR_CATEGORIES` and liquor-store-v1. */
export type LiquorCategory =
  | 'Whisky'
  | 'Scotch'
  | 'Rare Bottles'
  | 'Wine'
  | 'Vodka'
  | 'Beer'
  | 'Tequila'
  | 'Rum'
  | 'Other';

export type AccessoryCategoryId = 'audio' | 'cables' | 'wearables' | 'power';

export interface Accessory {
  id: number;
  itemCode: string;
  categoryId: AccessoryCategoryId;
  name: string;
  detail: string;
  priceDisplay: string;
  priceValue: number;
  tags: string[];
  img: string;
}
