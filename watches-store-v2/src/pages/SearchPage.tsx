import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { MergedCatalogPage } from '../components/MergedCatalogPage';
import { CatalogSortSlot } from '../components/CatalogSortSlot';
import { ALL_CATALOG_KEYS } from '../lib/catalogMappers';

export function SearchPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';

  return (
    <div className="bg-brand-bg pb-12 pt-24 md:pt-28">
      <div className="storefront-shell mb-6">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0">
            <h1 className="font-bebas text-4xl tracking-wide text-brand-text md:text-5xl">Search</h1>
            {query ? (
              <p className="mt-2 text-brand-text/80">
                Results for &ldquo;{query}&rdquo;
              </p>
            ) : (
              <p className="mt-2 text-brand-text/80">Search by product name or brand.</p>
            )}
          </div>
          <CatalogSortSlot />
        </div>
      </div>
      <MergedCatalogPage catalogKeys={ALL_CATALOG_KEYS} initialQuery={query} />
    </div>
  );
}
