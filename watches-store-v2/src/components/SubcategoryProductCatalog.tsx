import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, SearchX, SlidersHorizontal, X } from 'lucide-react';
import Select from 'react-select';
import { clientSelectStyles } from '../config/clientSelectStyles';
import {
  CATALOG_SORT_OPTIONS,
  useCatalogFilters,
  type CatalogSortKey,
} from '../hooks/useCatalogFilters';
import type { CatalogTileItem } from '../types/catalogTile.types';
import { CatalogProductTile } from './CatalogProductTile';

type SelectOption<T extends string> = { value: T; label: string };

type SubcategoryProductCatalogProps = {
  items: CatalogTileItem[];
};

export function SubcategoryProductCatalog({ items }: SubcategoryProductCatalogProps): JSX.Element {
  const {
    query,
    setQuery,
    selectedBrands,
    setSelectedBrands,
    toggleBrand,
    selectedPriceIndex,
    setSelectedPriceIndex,
    sortKey,
    setSortKey,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    clearFilters,
    activeFilterCount,
    brandList,
    priceRanges,
    sortedItems,
    pageItems,
    totalPages,
    safePage,
    showingFrom,
    showingTo,
    goToPage,
    visiblePageNumbers,
  } = useCatalogFilters(items);

  const selectedSortOption =
    CATALOG_SORT_OPTIONS.find((o) => o.value === sortKey) ?? CATALOG_SORT_OPTIONS[0] ?? null;

  const FilterPanel = (): JSX.Element => (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bebas text-2xl tracking-wide text-brand-text">Brand</h3>
          {selectedBrands.length > 0 ? (
            <button
              type="button"
              onClick={() => setSelectedBrands([])}
              className="text-xs text-brand-muted transition-colors hover:text-brand-purple"
            >
              Clear
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {brandList.map((brandName) => {
            const active = selectedBrands.includes(brandName);
            return (
              <button
                key={brandName}
                type="button"
                onClick={() => toggleBrand(brandName)}
                className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-all ${active ? 'border-brand-purple bg-brand-purple text-white shadow-glow-purple' : 'border-brand-border bg-transparent text-brand-muted hover:border-brand-purple/50'}`}
              >
                {brandName}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bebas text-2xl tracking-wide text-brand-text">Price</h3>
          {selectedPriceIndex !== null ? (
            <button
              type="button"
              onClick={() => setSelectedPriceIndex(null)}
              className="text-xs text-brand-muted transition-colors hover:text-brand-purple"
            >
              Clear
            </button>
          ) : null}
        </div>
        <div className="space-y-2">
          {priceRanges.map((range, idx) => {
            const active = selectedPriceIndex === idx;
            return (
              <button
                key={range.label}
                type="button"
                onClick={() => setSelectedPriceIndex(active ? null : idx)}
                className={`min-h-[44px] w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${active ? 'border-brand-purple/50 bg-brand-purple/10 text-brand-purple' : 'border-brand-border bg-transparent text-brand-muted hover:border-brand-purple/30'}`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeFilterCount > 0 ? (
        <button
          type="button"
          onClick={clearFilters}
          className="w-full rounded-xl bg-brand-surface px-4 py-3 text-sm font-semibold text-brand-text transition-colors hover:bg-brand-card"
        >
          Clear all filters
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="border-t border-brand-border pt-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        <div className="relative w-full min-w-[min(100%,280px)] flex-[2] lg:max-w-2xl">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or brand…"
            autoComplete="off"
            className="min-h-[44px] w-full rounded-xl border border-brand-border bg-brand-bg py-2.5 pl-10 pr-3 text-base text-brand-text outline-none transition placeholder:text-brand-muted focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/40 md:text-sm"
            aria-label="Search catalog"
          />
        </div>

        <div className="flex w-full flex-wrap items-end gap-3 lg:w-auto lg:justify-end">
          <label className="hidden text-sm text-brand-muted sm:block" htmlFor="catalog-sort">
            Sort by
          </label>
          <div className="min-w-0 flex-1 sm:w-56 sm:flex-none">
            <Select<SelectOption<CatalogSortKey>, false>
              instanceId="catalog-sort"
              inputId="catalog-sort"
              options={CATALOG_SORT_OPTIONS}
              value={selectedSortOption}
              onChange={(opt) => {
                if (opt) {
                  setSortKey(opt.value);
                }
              }}
              styles={clientSelectStyles}
              isSearchable={false}
              aria-label="Sort results"
            />
          </div>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex min-h-[44px] items-center gap-2 rounded-xl border border-brand-border bg-brand-card px-4 py-3 text-sm font-medium text-brand-text lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filters
            {activeFilterCount > 0 ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-purple text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div className="flex items-start gap-8">
        <aside className="sticky top-24 hidden w-64 shrink-0 lg:block">
          <div className="rounded-3xl border border-brand-border bg-brand-card/50 p-6">
            <FilterPanel />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-brand-muted">
              Showing <span className="font-semibold text-brand-text">{pageItems.length}</span> of{' '}
              <span className="font-semibold text-brand-text">{sortedItems.length}</span> products
            </p>
          </div>

          {sortedItems.length === 0 ? (
            <div className="rounded-xl border border-brand-border bg-brand-card py-16 text-center">
              <SearchX className="mx-auto mb-4 h-12 w-12 text-brand-muted" aria-hidden />
              <h3 className="mb-2 text-xl font-semibold text-brand-text">No products found</h3>
              <p className="mb-6 text-brand-muted">Try adjusting your search or filters.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl bg-brand-purple px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-purple-dim"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <ul className="grid auto-rows-[1fr] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {pageItems.map((item) => (
                  <li key={item.id} className="flex h-full min-h-0 min-w-0">
                    <CatalogProductTile item={item} />
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col items-center gap-3 border-t border-brand-border pt-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-6">
                <p className="w-full text-center text-sm text-brand-muted sm:w-auto sm:text-left">
                  Showing <span className="text-brand-text">{showingFrom}</span>–
                  <span className="text-brand-text">{showingTo}</span> of{' '}
                  <span className="text-brand-text">{sortedItems.length}</span>
                  {totalPages > 1 ? (
                    <>
                      {' '}
                      · Page <span className="text-brand-text">{safePage}</span> of{' '}
                      <span className="text-brand-text">{totalPages}</span>
                    </>
                  ) : null}
                </p>
                {totalPages > 1 ? (
                  <div className="flex w-full max-w-full justify-center overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:w-auto sm:justify-end sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
                    <div className="inline-flex shrink-0 flex-nowrap items-center justify-center gap-1 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => goToPage(safePage - 1)}
                        disabled={safePage <= 1}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-border text-brand-text transition hover:border-brand-purple/50 disabled:pointer-events-none disabled:opacity-40 sm:h-11 sm:w-11 sm:rounded-xl"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                      </button>
                      {visiblePageNumbers.map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => goToPage(n)}
                          className={[
                            'inline-flex h-9 min-w-[2.25rem] shrink-0 items-center justify-center rounded-lg border px-1.5 text-xs font-semibold transition sm:h-11 sm:min-w-[2.75rem] sm:rounded-xl sm:px-2 sm:text-sm',
                            n === safePage
                              ? 'border-brand-purple bg-brand-purple text-white'
                              : 'border-brand-border text-brand-text hover:border-brand-purple/50',
                          ].join(' ')}
                          aria-label={`Page ${n}`}
                          aria-current={n === safePage ? 'page' : undefined}
                        >
                          {n}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => goToPage(safePage + 1)}
                        disabled={safePage >= totalPages}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-border text-brand-text transition hover:border-brand-purple/50 disabled:pointer-events-none disabled:opacity-40 sm:h-11 sm:w-11 sm:rounded-xl"
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-sm overflow-y-auto border-l border-brand-border bg-brand-bg lg:hidden"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-border bg-brand-bg p-6">
                <h2 className="font-bebas text-2xl tracking-wide text-brand-text">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-brand-muted transition hover:text-brand-text"
                  aria-label="Close filters"
                >
                  <X className="h-6 w-6" aria-hidden />
                </button>
              </div>
              <div className="p-6 pb-32">
                <FilterPanel />
              </div>
              <div className="fixed bottom-0 left-0 right-0 ml-auto max-w-sm border-t border-brand-border bg-brand-bg p-4">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full rounded-xl bg-brand-purple py-4 font-bold text-white transition-colors hover:bg-brand-purple-dim"
                >
                  Show {sortedItems.length} result{sortedItems.length === 1 ? '' : 's'}
                </button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
