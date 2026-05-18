import React from 'react';
import { SubcategoryCatalogPage } from '../../components/SubcategoryCatalogPage';
import { WatchSubcategoryLayout } from '../../components/WatchSubcategoryLayout';

export function SmartWatchesPage(): JSX.Element {
  return (
    <WatchSubcategoryLayout
      title="Smart watches"
      description="Browse connected watches with health tracking, notifications, and app support."
    >
      <SubcategoryCatalogPage catalogKey="smart-watches" />
    </WatchSubcategoryLayout>
  );
}
