import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { ArrowLeft, SlidersHorizontal, X, SearchX } from 'lucide-react';
import { Navbar } from '../components/Navbar.tsx';
import { Footer } from '../components/Footer.tsx';
import { WhatsAppFAB } from '../components/WhatsAppFAB.tsx';
import { PhoneCard } from '../components/PhoneCard.tsx';
import { clientSelectStyles } from '../config/clientSelectStyles.ts';
import { usePhones, type SortOption } from '../hooks/usePhones';
import { useStoreData, useStorePhones } from '../context/StoreDataContext';
import { CatalogSectionLoading } from '../components/CatalogSectionLoading';
import { PaginationControls } from '../components/PaginationControls';
import { STORE_PANEL_SURFACE } from '../constants/ui';

export function AllPhones() {
  const { catalogLoading } = useStoreData();
  const phones = useStorePhones();
  const {
    filteredPhones,
    paginatedPhones,
    totalPages,
    page,
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
    priceRanges,
    sortOptions,
  } = usePhones(phones);

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl uppercase tracking-wide text-brand-text">Brand</h3>
          {selectedBrands.length > 0 ? (
            <button
              type="button"
              onClick={() => setSelectedBrands([])}
              className="text-xs text-brand-muted hover:text-brand-blue"
            >
              Clear
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {brandList.map((brand) => {
            const active = selectedBrands.includes(brand);
            return (
              <button
                key={brand}
                type="button"
                onClick={() => toggleBrand(brand)}
                className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-all ${active ? 'border-brand-blue bg-brand-blue text-white shadow-[0_0_15px_rgba(29,78,216,0.35)]' : 'border-brand-border bg-transparent text-brand-muted hover:border-slate-400'}`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl uppercase tracking-wide text-brand-text">Price</h3>
          {selectedPriceIndex !== null ? (
            <button
              type="button"
              onClick={() => setSelectedPriceIndex(null)}
              className="text-xs text-brand-muted hover:text-brand-blue"
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
                className={`min-h-[44px] w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${active ? 'border-brand-blue/50 bg-brand-blue/10 text-brand-blue' : 'border-brand-border bg-transparent text-brand-muted hover:border-slate-400'}`}
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
          className="w-full rounded-xl bg-brand-surface px-4 py-3 text-sm font-semibold text-brand-text transition-colors hover:bg-brand-surface"
        >
          Clear All Filters
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 text-brand-text selection:bg-brand-blue selection:text-white">
      <Navbar />

      <main className="pb-20 pt-28">
        <div className="mx-auto max-w-screen-2xl px-6 py-8 lg:px-12">
          <section className="mb-10">
            <Link
              to="/"
              className="mb-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-blue"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              Back to Home
            </Link>

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="min-w-0">
                <h1 className="mb-3 break-words font-display text-2xl uppercase tracking-tight text-brand-text md:text-4xl">
                  All <span className="text-brand-blue">Smartphones</span>
                </h1>
                <p className="break-words text-base text-brand-muted md:text-lg">
                  Sabse bada collection. Filter, browse and enquire on WhatsApp instantly.
                </p>
              </div>

              <div className="flex w-full flex-wrap items-center gap-3 md:w-auto md:justify-end">
                <label className="hidden text-sm text-brand-muted sm:block" htmlFor="phones-sort">
                  Sort by
                </label>
                <div className="min-w-0 flex-1 sm:w-56 sm:flex-none">
                  <Select<SortOption, false>
                    instanceId="phones-sort"
                    inputId="phones-sort"
                    options={sortOptions}
                    value={sortOptions.find((o) => o.value === sortBy) ?? null}
                    onChange={(opt) => {
                      if (opt) {
                        setSortBy(opt.value);
                      }
                    }}
                    styles={clientSelectStyles}
                    isSearchable={false}
                    aria-label="Sort phones"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className={`flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-brand-text shadow-sm md:hidden`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </button>
              </div>
            </div>
          </section>

          <div className="flex items-start gap-8">
            <aside className="sticky top-24 hidden w-64 flex-shrink-0 md:block">
              <div className={`${STORE_PANEL_SURFACE} p-6`}>
                <FilterPanel />
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              {catalogLoading ? (
                <CatalogSectionLoading message="Loading phones…" />
              ) : (
                <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-brand-muted">
                  Showing <span className="font-semibold text-brand-text">{paginatedPhones.length}</span> of{' '}
                  <span className="font-semibold text-brand-text">{filteredPhones.length}</span> phones
                </p>
              </div>

              {paginatedPhones.length === 0 ? (
                <div className={`${STORE_PANEL_SURFACE} p-16 text-center`}>
                  <SearchX className="mx-auto mb-4 h-12 w-12 text-brand-muted" />
                  <h3 className="mb-2 text-2xl font-bold text-brand-text">No phones found</h3>
                  <p className="mb-6 text-brand-muted">Try adjusting your filters to see more results.</p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-xl bg-brand-saffron px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-saffronHover"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <motion.div layout className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {paginatedPhones.map((phone, index) => (
                    <PhoneCard key={phone.id} {...phone} index={index} />
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
        {mobileFiltersOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-sm overflow-y-auto border-l border-brand-border bg-brand-bg md:hidden"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-border bg-brand-bg p-6">
                <h2 className="font-display text-2xl uppercase tracking-wide text-brand-text">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-brand-muted transition hover:text-brand-text"
                  aria-label="Close filters"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 pb-32">
                <FilterPanel />
              </div>
              <div className="fixed bottom-0 left-0 right-0 ml-auto max-w-sm border-t border-brand-border bg-brand-bg p-4">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full rounded-xl bg-brand-saffron py-4 font-bold text-white transition-colors hover:bg-brand-saffronHover"
                >
                  Show {filteredPhones.length} Result{filteredPhones.length === 1 ? '' : 's'}
                </button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
