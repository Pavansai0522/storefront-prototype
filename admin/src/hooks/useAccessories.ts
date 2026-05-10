import { ACCESSORY_CATEGORIES } from '../constants';
import type { Product } from '../types';
import { useProductFilters, type ProductFilterState } from './useProductFilters';

const CATEGORY_VALUES = ACCESSORY_CATEGORIES.map((c) => c.value) as string[];

export function useAccessories(rows: Product[]): ProductFilterState {
  return useProductFilters(rows, CATEGORY_VALUES);
}
