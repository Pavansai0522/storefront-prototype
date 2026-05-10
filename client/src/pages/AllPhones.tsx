import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { ArrowLeft, ChevronLeft, ChevronRight, SlidersHorizontal, X, SearchX } from 'lucide-react';
import { Navbar } from '../components/Navbar.tsx';
import { Footer } from '../components/Footer.tsx';
import { WhatsAppFAB } from '../components/WhatsAppFAB.tsx';
import { PhoneCard } from '../components/PhoneCard.tsx';
import { PHONES } from '../data/phones.ts';
import { clientSelectStyles } from '../config/clientSelectStyles.ts';
import { usePhones, type SortOption } from '../hooks/usePhones';

export function AllPhones() {
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
  } = usePhones(PHONES);

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl uppercase tracking-wide text-white">Brand</h3>
          {selectedBrands.length > 0 ? (
            <button
              type="button"
              onClick={() => setSelectedBrands([])}
              className="text-xs text-gray-400 hover:text-brand-saffron"
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
                className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-all ${active ? 'border-brand-saffron bg-brand-saffron text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'border-white/10 bg-transparent text-gray-300 hover:border-white/30'}`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl uppercase tracking-wide text-white">Price</h3>
          {selectedPriceIndex !== null ? (
            <button
              type="button"
              onClick={() => setSelectedPriceIndex(null)}
              className="text-xs text-gray-400 hover:text-brand-saffron"
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
                className={`min-h-[44px] w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${active ? 'border-brand-saffron/50 bg-brand-saffron/10 text-brand-saffron' : 'border-white/10 bg-transparent text-gray-300 hover:border-white/30'}`}
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
          className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Clear All Filters
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-bg text-brand-text selection:bg-brand-saffron selection:text-white">
      <Navbar />

      <main className="pb-20 pt-28">
        <div className="mx-auto max-w-screen-2xl px-6 py-8 lg:px-12">
          <section className="mb-10">
            <Link
              to="/"
              className="mb-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-brand-saffron"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              Back to Home
            </Link>

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="min-w-0">
                <h1 className="mb-3 break-words font-display text-2xl uppercase tracking-tight text-white md:text-4xl">
                  All <span className="text-brand-saffron">Smartphones</span>
                </h1>
                <p className="break-words text-base text-gray-400 md:text-lg">
                  Sabse bada collection. Filter, browse and enquire on WhatsApp instantly.
                </p>
              </div>

              <div className="flex w-full flex-wrap items-center gap-3 md:w-auto md:justify-end">
                <label className="hidden text-sm text-gray-400 sm:block" htmlFor="phones-sort">
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
                  className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/10 bg-brand-card px-4 py-3 text-sm font-medium text-white md:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-saffron text-xs font-bold text-white">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </button>
              </div>
            </div>
          </section>

          <div className="flex items-start gap-8">
            <aside className="sticky top-24 hidden w-64 flex-shrink-0 md:block">
              <div className="rounded-3xl border border-white/5 bg-brand-card/50 p-6">
                <FilterPanel />
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Showing <span className="font-semibold text-white">{paginatedPhones.length}</span> of{' '}
                  <span className="font-semibold text-white">{filteredPhones.length}</span> phones
                </p>
              </div>

              {paginatedPhones.length === 0 ? (
                <div className="rounded-3xl border border-white/5 bg-brand-card/50 p-16 text-center">
                  <SearchX className="mx-auto mb-4 h-12 w-12 text-gray-500" />
                  <h3 className="mb-2 text-2xl font-bold text-white">No phones found</h3>
                  <p className="mb-6 text-gray-400">Try adjusting your filters to see more results.</p>
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

              {totalPages > 1 ? (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-xl border border-white/10 bg-brand-card text-white transition-colors hover:border-brand-saffron disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`h-11 min-h-[44px] w-11 min-w-[44px] rounded-xl text-sm font-bold transition-all ${p === page ? 'bg-brand-saffron text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'border border-white/10 bg-brand-card text-gray-300 hover:border-brand-saffron'}`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    className="flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-xl border border-white/10 bg-brand-card text-white transition-colors hover:border-brand-saffron disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
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
              className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-sm overflow-y-auto border-l border-white/10 bg-brand-bg md:hidden"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-brand-bg p-6">
                <h2 className="font-display text-2xl uppercase tracking-wide text-white">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gray-400 transition hover:text-white"
                  aria-label="Close filters"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 pb-32">
                <FilterPanel />
              </div>
              <div className="fixed bottom-0 left-0 right-0 ml-auto max-w-sm border-t border-white/10 bg-brand-bg p-4">
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
