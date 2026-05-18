import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import type { Product } from '../types';
import { productCategoryKey } from '../types/product.types';

export type StockFilter = 'all' | 'in' | 'out';
export type SortKey =
  | 'default'
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'stock-first';

export type CategoryChoice = { value: string; label: string };
export type CategoryFilterOption = { value: string; label: string };
export type StockFilterOption = { value: StockFilter; label: string };
export type SortKeyOption = { value: SortKey; label: string };

export const STOCK_FILTER_OPTIONS: StockFilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 'in', label: 'In Stock' },
  { value: 'out', label: 'Out of Stock' },
];

export const SORT_KEY_OPTIONS: SortKeyOption[] = [
  { value: 'default', label: 'Sort by: Default' },
  { value: 'name-asc', label: 'Name A → Z' },
  { value: 'name-desc', label: 'Name Z → A' },
  { value: 'price-asc', label: 'Price Low → High' },
  { value: 'price-desc', label: 'Price High → Low' },
  { value: 'stock-first', label: 'In Stock First' },
];

function applyFilters(
  list: Product[],
  search: string,
  category: string,
  stock: StockFilter,
): Product[] {
  const q = search.trim().toLowerCase();
  return list.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q)) {
      return false;
    }
    if (category !== 'All' && productCategoryKey(p) !== category) {
      return false;
    }
    if (stock === 'in' && !p.inStock) {
      return false;
    }
    if (stock === 'out' && p.inStock) {
      return false;
    }
    return true;
  });
}

function applySort(list: Product[], sortKey: SortKey): Product[] {
  const next = [...list];
  switch (sortKey) {
    case 'name-asc':
      return next.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    case 'name-desc':
      return next.sort((a, b) => b.name.localeCompare(a.name, undefined, { sensitivity: 'base' }));
    case 'price-asc':
      return next.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return next.sort((a, b) => b.price - a.price);
    case 'stock-first':
      return next.sort((a, b) => {
        if (a.inStock === b.inStock) {
          return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        }
        return a.inStock ? -1 : 1;
      });
    default:
      return next;
  }
}

export type ProductFilterState = {
  filtered: Product[];
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  stock: StockFilter;
  setStock: Dispatch<SetStateAction<StockFilter>>;
  sort: SortKey;
  setSort: Dispatch<SetStateAction<SortKey>>;
  clearFilters: () => void;
  categoryFilterOptions: CategoryFilterOption[];
};

export function useProductFilters(
  rows: Product[],
  categoryChoices: ReadonlyArray<CategoryChoice>,
): ProductFilterState {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [stock, setStock] = useState<StockFilter>('all');
  const [sort, setSort] = useState<SortKey>('default');

  const categoryFilterOptions = useMemo((): CategoryFilterOption[] => {
    return [{ value: 'All', label: 'All' }, ...categoryChoices.map((c) => ({ value: c.value, label: c.label }))];
  }, [categoryChoices]);

  const preFiltered = useMemo(
    () => applyFilters(rows, search, category, stock),
    [rows, search, category, stock],
  );

  const filtered = useMemo(() => applySort(preFiltered, sort), [preFiltered, sort]);

  const clearFilters = (): void => {
    setSearch('');
    setCategory('All');
    setStock('all');
    setSort('default');
  };

  return {
    filtered,
    search,
    setSearch,
    category,
    setCategory,
    stock,
    setStock,
    sort,
    setSort,
    clearFilters,
    categoryFilterOptions,
  };
}
