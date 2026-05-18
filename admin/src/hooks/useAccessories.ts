import { ACCESSORY_CATEGORIES } from '../constants';
import type { Product } from '../types';
import { useProductFilters, type ProductFilterState } from './useProductFilters';

export function useAccessories(rows: Product[]): ProductFilterState {
  return useProductFilters(rows, [...ACCESSORY_CATEGORIES]);
}
