import { PRODUCT_CATEGORIES } from '../constants';
import type { Product } from '../types';
import { useProductFilters, type ProductFilterState } from './useProductFilters';

const CATEGORY_VALUES = PRODUCT_CATEGORIES.map((c) => c.value) as string[];

export function useProducts(rows: Product[]): ProductFilterState {
  return useProductFilters(rows, CATEGORY_VALUES);
}
