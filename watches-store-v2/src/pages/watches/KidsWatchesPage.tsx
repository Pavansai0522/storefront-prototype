import React from 'react';
import { SubcategoryCatalogPage } from '../../components/SubcategoryCatalogPage';
import { WatchSubcategoryLayout } from '../../components/WatchSubcategoryLayout';

export function KidsWatchesPage(): JSX.Element {
  return (
    <WatchSubcategoryLayout
      title="Kids watches"
      description="Fun, durable watches sized for children."
    >
      <SubcategoryCatalogPage catalogKey="kids-watches" />
    </WatchSubcategoryLayout>
  );
}
