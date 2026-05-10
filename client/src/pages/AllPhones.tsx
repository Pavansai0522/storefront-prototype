import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  SearchX } from
'lucide-react';
import { Navbar } from '../components/Navbar.tsx';
import { Footer } from '../components/Footer.tsx';
import { WhatsAppFAB } from '../components/WhatsAppFAB.tsx';
import { PhoneCard } from '../components/PhoneCard.tsx';
import { PHONES, BRANDS } from '../data/phones.ts';
import { clientSelectStyles } from '../config/clientSelectStyles.ts';

type SortOption = { value: string; label: string };
const PRICE_RANGES = [
{
  label: 'Under ₹20,000',
  min: 0,
  max: 20000
},
{
  label: '₹20,000 – ₹40,000',
  min: 20000,
  max: 40000
},
{
  label: '₹40,000 – ₹70,000',
  min: 40000,
  max: 70000
},
{
  label: '₹70,000 – ₹1,00,000',
  min: 70000,
  max: 100000
},
{
  label: 'Above ₹1,00,000',
  min: 100000,
  max: Infinity
}];

const SORT_OPTIONS: SortOption[] = [
{
  value: 'featured',
  label: 'Featured'
},
{
  value: 'price-asc',
  label: 'Price: Low to High'
},
{
  value: 'price-desc',
  label: 'Price: High to Low'
},
{
  value: 'name',
  label: 'Name A–Z'
}];

const PAGE_SIZE = 9;
export function AllPhones() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceIndex, setSelectedPriceIndex] = useState<number | null>(
    null
  );
  const [sortBy, setSortBy] = useState<string>('featured');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  // Reset to page 1 whenever filters or sort change
  useEffect(() => {
    setPage(1);
  }, [selectedBrands, selectedPriceIndex, sortBy]);
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
    prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };
  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedPriceIndex(null);
    setSortBy('featured');
  };
  const filteredPhones = useMemo(() => {
    let list = PHONES.filter((phone) => {
      const brandMatch =
      selectedBrands.length === 0 || selectedBrands.includes(phone.brand);
      let priceMatch = true;
      if (selectedPriceIndex !== null) {
        const range = PRICE_RANGES[selectedPriceIndex];
        priceMatch =
        phone.priceValue >= range.min && phone.priceValue < range.max;
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
  }, [selectedBrands, selectedPriceIndex, sortBy]);
  const totalPages = Math.max(1, Math.ceil(filteredPhones.length / PAGE_SIZE));
  const paginatedPhones = filteredPhones.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const activeFilterCount =
  selectedBrands.length + (selectedPriceIndex !== null ? 1 : 0);
  const goToPage = (p: number) => {
    setPage(Math.max(1, Math.min(totalPages, p)));
    window.scrollTo({
      top: 200,
      behavior: 'smooth'
    });
  };
  const FilterPanel = () =>
  <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-2xl text-white tracking-wide uppercase">
            Brand
          </h3>
          {selectedBrands.length > 0 &&
        <button
          onClick={() => setSelectedBrands([])}
          className="text-xs text-gray-400 hover:text-brand-saffron">
          
              Clear
            </button>
        }
        </div>
        <div className="flex flex-wrap gap-2">
          {BRANDS.map((brand) => {
          const active = selectedBrands.includes(brand);
          return (
            <button
              key={brand}
              onClick={() => toggleBrand(brand)}
              className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-all ${active ? 'border-brand-saffron bg-brand-saffron text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'border-white/10 bg-transparent text-gray-300 hover:border-white/30'}`}>
              
                {brand}
              </button>);

        })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-2xl text-white tracking-wide uppercase">
            Price
          </h3>
          {selectedPriceIndex !== null &&
        <button
          onClick={() => setSelectedPriceIndex(null)}
          className="text-xs text-gray-400 hover:text-brand-saffron">
          
              Clear
            </button>
        }
        </div>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, idx) => {
          const active = selectedPriceIndex === idx;
          return (
            <button
              key={range.label}
              onClick={() => setSelectedPriceIndex(active ? null : idx)}
              className={`min-h-[44px] w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${active ? 'border-brand-saffron/50 bg-brand-saffron/10 text-brand-saffron' : 'border-white/10 bg-transparent text-gray-300 hover:border-white/30'}`}>
              
                {range.label}
              </button>);

        })}
        </div>
      </div>

      {activeFilterCount > 0 &&
    <button
      onClick={clearFilters}
      className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-white/5 text-white hover:bg-white/10 transition-colors">
      
          Clear All Filters
        </button>
    }
    </div>;

  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-bg text-brand-text selection:bg-brand-saffron selection:text-white">
      <Navbar />

      <main className="pb-20 pt-28">
        <div className="mx-auto max-w-screen-2xl px-6 py-8 lg:px-12">
        {/* Page Header */}
        <section className="mb-10">
          <Link
            to="/"
            className="mb-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-brand-saffron">
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
                  options={SORT_OPTIONS}
                  value={SORT_OPTIONS.find((o) => o.value === sortBy) ?? null}
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
                className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/10 bg-brand-card px-4 py-3 text-sm font-medium text-white md:hidden">
                
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 &&
                <span className="bg-brand-saffron text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                }
              </button>
            </div>
          </div>
        </section>

          <div className="flex gap-8 items-start">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0 sticky top-24">
              <div className="bg-brand-card/50 border border-white/5 rounded-3xl p-6">
                <FilterPanel />
              </div>
            </aside>

            {/* Phone Grid */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-400 text-sm">
                  Showing{' '}
                  <span className="text-white font-semibold">
                    {paginatedPhones.length}
                  </span>{' '}
                  of{' '}
                  <span className="text-white font-semibold">
                    {filteredPhones.length}
                  </span>{' '}
                  phones
                </p>
              </div>

              {paginatedPhones.length === 0 ?
              <div className="bg-brand-card/50 border border-white/5 rounded-3xl p-16 text-center">
                  <SearchX className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    No phones found
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your filters to see more results.
                  </p>
                  <button
                  onClick={clearFilters}
                  className="bg-brand-saffron text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-saffronHover transition-colors">
                  
                    Clear Filters
                  </button>
                </div> :

              <motion.div
                layout
                className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                
                  {paginatedPhones.map((phone, index) =>
                <PhoneCard key={phone.id} {...phone} index={index} />
                )}
                </motion.div>
              }

              {/* Pagination */}
              {totalPages > 1 &&
              <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-xl border border-white/10 bg-brand-card text-white transition-colors hover:border-brand-saffron disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Previous page">
                  
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from(
                  {
                    length: totalPages
                  },
                  (_, i) => i + 1
                ).map((p) =>
                <button
                  type="button"
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`h-11 min-h-[44px] w-11 min-w-[44px] rounded-xl text-sm font-bold transition-all ${p === page ? 'bg-brand-saffron text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'border border-white/10 bg-brand-card text-gray-300 hover:border-brand-saffron'}`}>
                  
                      {p}
                    </button>
                )}

                  <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-xl border border-white/10 bg-brand-card text-white transition-colors hover:border-brand-saffron disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Next page">
                  
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen &&
        <>
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden" />
          
            <motion.div
            initial={{
              x: '100%'
            }}
            animate={{
              x: 0
            }}
            exit={{
              x: '100%'
            }}
            transition={{
              type: 'tween',
              duration: 0.3
            }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-brand-bg border-l border-white/10 z-50 overflow-y-auto md:hidden">
            
              <div className="sticky top-0 bg-brand-bg border-b border-white/10 p-6 flex items-center justify-between z-10">
                <h2 className="font-display text-2xl text-white tracking-wide uppercase">
                  Filters
                </h2>
                <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gray-400 transition hover:text-white"
                aria-label="Close filters">
                
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 pb-32">
                <FilterPanel />
              </div>
              <div className="fixed bottom-0 left-0 right-0 max-w-sm ml-auto p-4 bg-brand-bg border-t border-white/10">
                <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-brand-saffron text-white py-4 rounded-xl font-bold hover:bg-brand-saffronHover transition-colors">
                
                  Show {filteredPhones.length} Result
                  {filteredPhones.length === 1 ? '' : 's'}
                </button>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>

      <Footer />
      <WhatsAppFAB />
    </div>);

}