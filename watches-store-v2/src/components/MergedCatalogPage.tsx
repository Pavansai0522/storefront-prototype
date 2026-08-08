import React, { useMemo } from 'react';
import { Spinner } from './Spinner';
import { SubcategoryProductCatalog } from './SubcategoryProductCatalog';
import { useStoreData } from '../context/StoreDataContext';
import type { SubcategoryCatalogKey } from '../types/catalogTile.types';

type MergedCatalogPageProps = {
  catalogKeys: SubcategoryCatalogKey[];
  initialQuery?: string;
};

export function MergedCatalogPage({
  catalogKeys,
  initialQuery,
}: MergedCatalogPageProps): JSX.Element {
  const { getSubcategoryCatalog, catalogLoading, catalogError, reloadCatalog } = useStoreData();
  const items = useMemo(
    () => catalogKeys.flatMap((key) => getSubcategoryCatalog(key)),
    [catalogKeys, getSubcategoryCatalog],
  );

  if (catalogLoading) {
    return (
      <div className="storefront-shell flex justify-center py-16">
        <Spinner size="lg" label="Loading catalog…" />
      </div>
    );
  }

  if (catalogError) {
    return (
      <div className="storefront-shell py-12 text-center">
        <p className="text-brand-purple">{catalogError}</p>
        <button
          type="button"
          onClick={() => void reloadCatalog()}
          className="mt-4 rounded-lg bg-brand-purple px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="storefront-shell py-12 text-center text-brand-text">
        No products in this category yet. Check back soon or WhatsApp us for availability.
      </p>
    );
  }

  return <SubcategoryProductCatalog items={items} initialQuery={initialQuery} />;
}
