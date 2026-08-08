import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { CATALOG_PAGE_SIZE, CATALOG_PRICE_RANGES } from '../constants/ui';
import type { CatalogTileItem } from '../types/catalogTile.types';

export type CatalogSortKey = 'featured' | 'name-asc' | 'price-asc' | 'price-desc';

export type CatalogSortOption = { value: CatalogSortKey; label: string };

export const CATALOG_SORT_OPTIONS: CatalogSortOption[] = [
  { value: 'featured', label: 'Featured order' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export function useCatalogFilters(
  items: CatalogTileItem[],
  initialQuery = '',
): {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  selectedBrands: string[];
  setSelectedBrands: Dispatch<SetStateAction<string[]>>;
  toggleBrand: (brand: string) => void;
  selectedPriceIndex: number | null;
  setSelectedPriceIndex: Dispatch<SetStateAction<number | null>>;
  sortKey: CatalogSortKey;
  setSortKey: Dispatch<SetStateAction<CatalogSortKey>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>;
  clearFilters: () => void;
  activeFilterCount: number;
  brandList: string[];
  priceRanges: typeof CATALOG_PRICE_RANGES;
  sortOptions: typeof CATALOG_SORT_OPTIONS;
  filteredItems: CatalogTileItem[];
  sortedItems: CatalogTileItem[];
  pageItems: CatalogTileItem[];
  totalPages: number;
  safePage: number;
  showingFrom: number;
  showingTo: number;
  goToPage: (p: number) => void;
  visiblePageNumbers: number[];
} {
  const [query, setQuery] = useState(initialQuery);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceIndex, setSelectedPriceIndex] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<CatalogSortKey>('featured');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const brandList = useMemo(() => {
    const uniq = new Set<string>();
    items.forEach((item) => uniq.add(item.brand));
    return Array.from(uniq).sort((a, b) => a.localeCompare(b));
  }, [items]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setPage(1);
  }, [query, selectedBrands, selectedPriceIndex, sortKey, items]);

  const toggleBrand = (brand: string): void => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const clearFilters = (): void => {
    setQuery('');
    setSelectedBrands([]);
    setSelectedPriceIndex(null);
    setSortKey('featured');
  };

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(item.brand);
      let priceMatch = true;
      if (selectedPriceIndex !== null) {
        const range = CATALOG_PRICE_RANGES[selectedPriceIndex];
        priceMatch = item.priceInr >= range.min && item.priceInr < range.max;
      }
      const matchQuery =
        q.length === 0 ||
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q);
      return brandMatch && priceMatch && matchQuery;
    });
  }, [items, query, selectedBrands, selectedPriceIndex]);

  const sortedItems = useMemo(() => {
    const arr = [...filteredItems];
    switch (sortKey) {
      case 'name-asc':
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        arr.sort((a, b) => a.priceInr - b.priceInr);
        break;
      case 'price-desc':
        arr.sort((a, b) => b.priceInr - a.priceInr);
        break;
      default:
        break;
    }
    return arr;
  }, [filteredItems, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / CATALOG_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const maxNumericButtons = 9;
  const visiblePageNumbers = useMemo(() => {
    if (totalPages <= maxNumericButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const half = Math.floor(maxNumericButtons / 2);
    let start = Math.max(1, safePage - half);
    const end = Math.min(totalPages, start + maxNumericButtons - 1);
    start = Math.max(1, end - maxNumericButtons + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [totalPages, safePage]);

  const startIdx = (safePage - 1) * CATALOG_PAGE_SIZE;
  const pageItems = sortedItems.slice(startIdx, startIdx + CATALOG_PAGE_SIZE);
  const showingFrom = sortedItems.length === 0 ? 0 : startIdx + 1;
  const showingTo = Math.min(startIdx + CATALOG_PAGE_SIZE, sortedItems.length);

  const activeFilterCount =
    selectedBrands.length +
    (selectedPriceIndex !== null ? 1 : 0) +
    (query.trim().length > 0 ? 1 : 0);

  const goToPage = (p: number): void => {
    setPage(Math.max(1, Math.min(totalPages, p)));
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return {
    query,
    setQuery,
    selectedBrands,
    setSelectedBrands,
    toggleBrand,
    selectedPriceIndex,
    setSelectedPriceIndex,
    sortKey,
    setSortKey,
    page,
    setPage,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    clearFilters,
    activeFilterCount,
    brandList,
    priceRanges: CATALOG_PRICE_RANGES,
    sortOptions: CATALOG_SORT_OPTIONS,
    filteredItems,
    sortedItems,
    pageItems,
    totalPages,
    safePage,
    showingFrom,
    showingTo,
    goToPage,
    visiblePageNumbers,
  };
}
