import type { Product } from '../types';
import { useProductFilters, type CategoryChoice, type ProductFilterState } from './useProductFilters';

export function useProducts(
  rows: Product[],
  categoryChoices: ReadonlyArray<CategoryChoice>,
): ProductFilterState {
  return useProductFilters(rows, categoryChoices);
}
