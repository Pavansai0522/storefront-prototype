export type RestaurantCategory =
  | 'Starters'
  | 'Biryani'
  | 'Curries'
  | 'Tandoor'
  | 'Thali'
  | 'Beverages'
  | 'Other';

export type RestaurantDietType = 'veg' | 'non-veg';

export interface Product {
  id: string | number;
  name: string;
  brand: string;
  category: RestaurantCategory;
  price: number;
  badge?: string;
  image: string;
  /** Defaults to true when omitted (catalog from API may omit). */
  inStock?: boolean;
  dietType?: RestaurantDietType;
}
