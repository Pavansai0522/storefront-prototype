import React from 'react';
import { SubcategoryCatalogPage } from '../components/SubcategoryCatalogPage';
import { CatalogSortSlot } from '../components/CatalogSortSlot';

export function Mobiles(): JSX.Element {
  return (
    <div className="bg-brand-bg pb-12 pt-24 md:pt-28">
      <div className="storefront-shell mb-6">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0">
            <h1 className="font-bebas text-4xl tracking-wide text-brand-text md:text-5xl">Mobiles</h1>
            <p className="mt-2 text-brand-text/80">Phones and devices — browse our full range.</p>
          </div>
          <CatalogSortSlot />
        </div>
      </div>
      <SubcategoryCatalogPage catalogKey="mobiles" />
    </div>
  );
}
