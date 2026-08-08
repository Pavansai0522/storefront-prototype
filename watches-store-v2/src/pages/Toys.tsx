import React from 'react';
import { MergedCatalogPage } from '../components/MergedCatalogPage';
import { CatalogSortSlot } from '../components/CatalogSortSlot';
import { TOY_SUBCATEGORY_KEYS } from '../types/catalogTile.types';

export function Toys(): JSX.Element {
  return (
    <div className="bg-brand-bg pb-12 pt-24 md:pt-28">
      <div className="storefront-shell mb-6">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0">
            <h1 className="font-bebas text-4xl tracking-wide text-brand-text md:text-5xl">Toys</h1>
            <p className="mt-2 text-brand-text/80">All toys in one place — RC, soft toys, and more.</p>
          </div>
          <CatalogSortSlot />
        </div>
      </div>
      <MergedCatalogPage catalogKeys={[...TOY_SUBCATEGORY_KEYS]} />
    </div>
  );
}
