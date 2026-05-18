import React from 'react';
import { SubcategoryCatalogPage } from '../../components/SubcategoryCatalogPage';
import { AccessorySubcategoryLayout } from '../../components/AccessorySubcategoryLayout';

export function GadgetsPage(): JSX.Element {
  return (
    <AccessorySubcategoryLayout
      title="Gadgets"
      description="Smart gadgets and everyday tech picks."
    >
      <SubcategoryCatalogPage catalogKey="gadgets" />
    </AccessorySubcategoryLayout>
  );
}
