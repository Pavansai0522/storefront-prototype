import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { CatalogTileItem } from '../types/catalogTile.types';
import { CatalogProductTile } from './CatalogProductTile';

const PAGE_SIZE = 16;

type SortKey = 'featured' | 'name-asc' | 'price-asc' | 'price-desc';

type SubcategoryProductCatalogProps = {
  items: CatalogTileItem[];
};

export function SubcategoryProductCatalog({ items }: SubcategoryProductCatalogProps): JSX.Element {
  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('featured');
  const [page, setPage] = useState(1);

  const brandOptions = useMemo(() => {
    const uniq = new Set<string>();
    items.forEach((p) => uniq.add(p.brand));
    return ['all', ...Array.from(uniq).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((p) => {
      const matchBrand = brand === 'all' || p.brand === brand;
      const matchQ =
        q.length === 0 ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q);
      return matchBrand && matchQ;
    });
  }, [items, query, brand]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
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
  }, [filtered, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [query, brand, sortKey, items]);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const safePage = Math.min(page, totalPages);

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

  const startIdx = (safePage - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(startIdx, startIdx + PAGE_SIZE);
  const showingFrom = sorted.length === 0 ? 0 : startIdx + 1;
  const showingTo = Math.min(startIdx + PAGE_SIZE, sorted.length);

  const selectClass =
    'min-h-[44px] w-full rounded-xl border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text outline-none transition focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/40 sm:min-w-[140px] sm:w-auto';

  return (
    <div className="border-t border-brand-border pt-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
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
            className="min-h-[44px] w-full rounded-xl border border-brand-border bg-brand-bg py-2.5 pl-10 pr-3 text-sm text-brand-text outline-none transition placeholder:text-brand-muted focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/40"
            aria-label="Search catalog"
          />
        </div>
        <div className="grid w-full grid-cols-1 gap-3 sm:flex sm:w-auto sm:flex-wrap sm:items-end lg:flex-shrink-0">
          <label className="flex w-full flex-col gap-1.5 sm:w-auto">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Brand</span>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className={selectClass}
              aria-label="Filter by brand"
            >
              {brandOptions.map((b) => (
                <option key={b} value={b}>
                  {b === 'all' ? 'All brands' : b}
                </option>
              ))}
            </select>
          </label>
          <label className="flex w-full flex-col gap-1.5 sm:w-auto">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Sort</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className={`${selectClass} sm:min-w-[180px]`}
              aria-label="Sort results"
            >
              <option value="featured">Featured order</option>
              <option value="name-asc">Name A–Z</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="rounded-xl border border-brand-border bg-brand-card py-16 text-center text-brand-muted">
          No products match your search or filters.
        </p>
      ) : (
        <>
          <ul className="grid grid-cols-2 auto-rows-[1fr] gap-3 sm:gap-4 md:grid-cols-4">
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
              <span className="text-brand-text">{sorted.length}</span>
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
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                    onClick={() => setPage(n)}
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
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
  );
}
