import React from 'react';
import { Spinner } from './Spinner';
import { SubcategoryProductCatalog } from './SubcategoryProductCatalog';
import { useStoreData } from '../context/StoreDataContext';
import type { SubcategoryCatalogKey } from '../types/catalogTile.types';

type SubcategoryCatalogPageProps = {
  catalogKey: SubcategoryCatalogKey;
};

export function SubcategoryCatalogPage({ catalogKey }: SubcategoryCatalogPageProps): JSX.Element {
  const { getSubcategoryCatalog, catalogLoading, catalogError, reloadCatalog } = useStoreData();
  const items = getSubcategoryCatalog(catalogKey);

  if (catalogLoading) {
    return (
      <div className="container mx-auto flex justify-center px-4 py-16">
        <Spinner size="lg" label="Loading catalog…" />
      </div>
    );
  }

  if (catalogError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-300">{catalogError}</p>
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
      <p className="container mx-auto px-4 py-12 text-center text-white/60">
        No products in this category yet. Check back soon or WhatsApp us for availability.
      </p>
    );
  }

  return <SubcategoryProductCatalog items={items} />;
}
