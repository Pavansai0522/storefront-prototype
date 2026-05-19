import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { PHONES_PAGE_SIZE } from '../constants';
import type { Nullable, Phone } from '../types';

export type SortOption = { value: string; label: string };

export const PRICE_RANGES: { label: string; min: number; max: number }[] = [
  { label: 'Under ₹20,000', min: 0, max: 20000 },
  { label: '₹20,000 – ₹40,000', min: 20000, max: 40000 },
  { label: '₹40,000 – ₹70,000', min: 40000, max: 70000 },
  { label: '₹70,000 – ₹1,00,000', min: 70000, max: 100000 },
  { label: 'Above ₹1,00,000', min: 100000, max: Infinity },
];

export const SORT_OPTIONS: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A–Z' },
];

export function usePhones(phones: Phone[]): {
  filteredPhones: Phone[];
  paginatedPhones: Phone[];
  totalPages: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  selectedBrands: string[];
  setSelectedBrands: Dispatch<SetStateAction<string[]>>;
  toggleBrand: (brand: string) => void;
  selectedPriceIndex: Nullable<number>;
  setSelectedPriceIndex: Dispatch<SetStateAction<Nullable<number>>>;
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>;
  clearFilters: () => void;
  activeFilterCount: number;
  goToPage: (p: number) => void;
  brandList: typeof BRANDS;
  priceRanges: typeof PRICE_RANGES;
  sortOptions: typeof SORT_OPTIONS;
  pageSize: number;
} {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceIndex, setSelectedPriceIndex] = useState<Nullable<number>>(null);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [selectedBrands, selectedPriceIndex, sortBy]);

  const toggleBrand = (brand: string): void => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const clearFilters = (): void => {
    setSelectedBrands([]);
    setSelectedPriceIndex(null);
    setSortBy('featured');
  };

  const brandList = useMemo(() => {
    const uniq = new Set<string>();
    phones.forEach((phone) => uniq.add(phone.brand));
    return Array.from(uniq).sort((a, b) => a.localeCompare(b));
  }, [phones]);

  const filteredPhones = useMemo(() => {
    let list = phones.filter((phone) => {
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(phone.brand);
      let priceMatch = true;
      if (selectedPriceIndex !== null) {
        const range = PRICE_RANGES[selectedPriceIndex];
        priceMatch = phone.priceValue >= range.min && phone.priceValue < range.max;
      }
      return brandMatch && priceMatch;
    });
    switch (sortBy) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.priceValue - b.priceValue);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.priceValue - a.priceValue);
        break;
      case 'name':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return list;
  }, [phones, selectedBrands, selectedPriceIndex, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredPhones.length / PHONES_PAGE_SIZE));
  const paginatedPhones = filteredPhones.slice((page - 1) * PHONES_PAGE_SIZE, page * PHONES_PAGE_SIZE);
  const activeFilterCount = selectedBrands.length + (selectedPriceIndex !== null ? 1 : 0);

  const goToPage = (p: number): void => {
    setPage(Math.max(1, Math.min(totalPages, p)));
    window.scrollTo({
      top: 200,
      behavior: 'smooth',
    });
  };

  return {
    filteredPhones,
    paginatedPhones,
    totalPages,
    page,
    setPage,
    selectedBrands,
    setSelectedBrands,
    toggleBrand,
    selectedPriceIndex,
    setSelectedPriceIndex,
    sortBy,
    setSortBy,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    clearFilters,
    activeFilterCount,
    goToPage,
    brandList,
    priceRanges: PRICE_RANGES,
    sortOptions: SORT_OPTIONS,
    pageSize: PHONES_PAGE_SIZE,
  };
}
