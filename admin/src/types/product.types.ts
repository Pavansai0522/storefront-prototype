import type { ID, Nullable } from './utils.types';

export type ProductCategory =
  | 'Phone'
  | 'Tablet'
  | 'Laptop'
  | 'Other'
  | 'Case'
  | 'Charger'
  | 'Earphone'
  | 'Cable';

export interface Product {
  id: ID;
  clientId: ID;
  name: string;
  brand: string;
  price: number;
  emiPrice: number;
  image: Nullable<string>;
  inStock: boolean;
  category: ProductCategory;
  isAccessory: boolean;
}
