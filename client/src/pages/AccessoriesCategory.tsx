import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Navigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import {
  ArrowLeft,
  SlidersHorizontal,
  X,
  SearchX
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
import { AccessoryTileCard } from '../components/AccessoryTileCard';
import {
  ACCESSORY_PRICE_RANGES,
  getAccessoryCategoryMeta,
  isAccessoryCategoryId,
  type AccessoryCategoryId,
} from '../data/accessories';
import { useStoreAccessories, useStoreData } from '../context/StoreDataContext';
import { CatalogSectionLoading } from '../components/CatalogSectionLoading';
import { PaginationControls } from '../components/PaginationControls';
import { clientSelectStyles } from '../config/clientSelectStyles';
import type { Nullable } from '../types';
import { STORE_PANEL_SURFACE } from '../constants/ui';

type SortOption = { value: string; label: string };

const SORT_OPTIONS: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A–Z' }
];

const PAGE_SIZE = 16;

interface AccessoriesCategoryInnerProps {
  categoryId: AccessoryCategoryId;
}

function AccessoriesCategoryInner({
  categoryId
}: AccessoriesCategoryInnerProps): JSX.Element {
  const { catalogLoading } = useStoreData();
  const allAccessories = useStoreAccessories();
  const categoryMeta = getAccessoryCategoryMeta(categoryId);
  const categoryItems = useMemo(
    () => allAccessories.filter((p) => p.categoryId === categoryId),
    [allAccessories, categoryId],
  );
  const categoryTags = useMemo(() => {
    const set = new Set<string>();
    categoryItems.forEach((p) => {
      p.tags.forEach((t) => set.add(t));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [categoryItems]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPriceIndex, setSelectedPriceIndex] = useState<Nullable<number>>(null);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setSelectedTags([]);
    setSelectedPriceIndex(null);
    setSortBy('featured');
    setPage(1);
  }, [categoryId]);

  useEffect(() => {
    setPage(1);
  }, [selectedTags, selectedPriceIndex, sortBy]);

  const toggleTag = (tag: string): void => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = (): void => {
    setSelectedTags([]);
    setSelectedPriceIndex(null);
    setSortBy('featured');
  };

  const filteredItems = useMemo(() => {
    let list = categoryItems;

    if (selectedTags.length > 0) {
      list = list.filter((p) =>
        selectedTags.some((t) => p.tags.includes(t))
      );
    }

    if (selectedPriceIndex !== null) {
      const range = ACCESSORY_PRICE_RANGES[selectedPriceIndex];
      list = list.filter(
        (p) => p.priceValue >= range.min && p.priceValue < range.max
      );
    }

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
  }, [categoryItems, selectedTags, selectedPriceIndex, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const paginatedItems = filteredItems.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const activeFilterCount =
    selectedTags.length + (selectedPriceIndex !== null ? 1 : 0);

  const goToPage = (p: number): void => {
    setPage(Math.max(1, Math.min(totalPages, p)));
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const FilterPanel = (): JSX.Element => (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-2xl text-brand-text tracking-wide uppercase">
            Type
          </h3>
          {selectedTags.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedTags([])}
              className="text-xs text-brand-muted hover:text-brand-blue">
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-all ${active ? 'border-brand-blue bg-brand-blue text-white shadow-[0_0_15px_rgba(29,78,216,0.35)]' : 'border-brand-border bg-transparent text-brand-muted hover:border-slate-400'}`}>
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-2xl text-brand-text tracking-wide uppercase">
            Price
          </h3>
          {selectedPriceIndex !== null && (
            <button
              type="button"
              onClick={() => setSelectedPriceIndex(null)}
              className="text-xs text-brand-muted hover:text-brand-blue">
              Clear
            </button>
          )}
        </div>
        <div className="space-y-2">
          {ACCESSORY_PRICE_RANGES.map((range, idx) => {
            const active = selectedPriceIndex === idx;
            return (
              <button
                type="button"
                key={range.label}
                onClick={() => setSelectedPriceIndex(active ? null : idx)}
                className={`min-h-[44px] w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${active ? 'border-brand-blue/50 bg-brand-blue/10 text-brand-blue' : 'border-brand-border bg-transparent text-brand-muted hover:border-slate-400'}`}>
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearFilters}
          className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-brand-surface text-brand-text hover:bg-brand-surface transition-colors">
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 text-brand-text selection:bg-brand-blue selection:text-white">
      <Navbar />

      <main className="pb-20 pt-28">
        <div className="storefront-shell py-8">
        <section className="mb-10">
          <Link
            to="/accessories"
            className="mb-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-blue">
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            All accessory categories
          </Link>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="min-w-0">
              <h1 className="mb-3 break-words font-display text-2xl uppercase tracking-tight text-brand-text md:text-4xl">
                {categoryMeta?.title ?? 'Accessories'}
              </h1>
              <p className="max-w-2xl break-words text-base text-brand-muted md:text-lg">
                {categoryMeta?.description ?? ''} Each tile shows an{' '}
                <span className="font-semibold text-brand-text">item ref</span> — mention it on WhatsApp so
                staff can help you instantly.
              </p>
            </div>

            <div className="flex w-full flex-wrap items-center gap-3 shrink-0 lg:w-auto lg:justify-end">
              <label className="hidden text-sm text-brand-muted sm:block" htmlFor="accessories-sort">
                Sort by
              </label>
              <div className="min-w-0 flex-1 sm:w-56 sm:flex-none">
                <Select<SortOption, false>
                  instanceId="accessories-sort"
                  inputId="accessories-sort"
                  options={SORT_OPTIONS}
                  value={SORT_OPTIONS.find((o) => o.value === sortBy) ?? null}
                  onChange={(opt) => {
                    if (opt) {
                      setSortBy(opt.value);
                    }
                  }}
                  styles={clientSelectStyles}
                  isSearchable={false}
                  aria-label="Sort accessories"
                />
              </div>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-brand-text shadow-sm md:hidden">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-brand-blue text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>

          <div className="flex gap-8 items-start">
            <aside className="hidden md:block w-64 flex-shrink-0 sticky top-24">
              <div className={`${STORE_PANEL_SURFACE} p-6`}>
                <FilterPanel />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {catalogLoading ? (
                <CatalogSectionLoading message="Loading accessories…" />
              ) : (
                <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-brand-muted text-sm">
                  Showing{' '}
                  <span className="text-brand-text font-semibold">
                    {paginatedItems.length}
                  </span>{' '}
                  of{' '}
                  <span className="text-brand-text font-semibold">
                    {filteredItems.length}
                  </span>{' '}
                  items
                </p>
              </div>

              {paginatedItems.length === 0 ? (
                <div className={`${STORE_PANEL_SURFACE} p-16 text-center`}>
                  <SearchX className="w-12 h-12 text-brand-muted mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-brand-text mb-2">
                    No items match
                  </h3>
                  <p className="text-brand-muted mb-6">
                    Try clearing type or price filters.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="bg-brand-saffron text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-saffronHover transition-colors">
                    Clear filters
                  </button>
                </div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                  {paginatedItems.map((product, index) => (
                    <AccessoryTileCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </motion.div>
              )}

              <PaginationControls page={page} totalPages={totalPages} onPageChange={goToPage} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-brand-bg border-l border-brand-border z-50 overflow-y-auto md:hidden">
              <div className="sticky top-0 bg-brand-bg border-b border-brand-border p-6 flex items-center justify-between z-10">
                <h2 className="font-display text-2xl text-brand-text tracking-wide uppercase">
                  Filters
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-brand-muted transition hover:text-brand-text"
                  aria-label="Close filters">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 pb-32">
                <FilterPanel />
              </div>
              <div className="fixed bottom-0 left-0 right-0 max-w-sm ml-auto p-4 bg-brand-bg border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-brand-saffron text-white py-4 rounded-xl font-bold hover:bg-brand-saffronHover transition-colors">
                  Show {filteredItems.length} Result
                  {filteredItems.length === 1 ? '' : 's'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

export function AccessoriesCategory(): JSX.Element {
  const { categoryId: categoryIdParam } = useParams<{ categoryId: string }>();

  if (!categoryIdParam || !isAccessoryCategoryId(categoryIdParam)) {
    return <Navigate to="/accessories" replace />;
  }

  return <AccessoriesCategoryInner categoryId={categoryIdParam} />;
}
