import React from 'react';
import { SubcategoryCatalogPage } from '../../components/SubcategoryCatalogPage';
import { WatchSubcategoryLayout } from '../../components/WatchSubcategoryLayout';

export function DialWatchesPage(): JSX.Element {
  return (
    <WatchSubcategoryLayout
      title="Dial watches"
      description="Analog and designer dial watches for everyday and occasion wear."
    >
      <SubcategoryCatalogPage catalogKey="dial-watches" />
    </WatchSubcategoryLayout>
  );
}
