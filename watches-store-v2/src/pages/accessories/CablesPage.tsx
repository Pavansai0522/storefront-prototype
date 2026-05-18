import React from 'react';
import { SubcategoryCatalogPage } from '../../components/SubcategoryCatalogPage';
import { AccessorySubcategoryLayout } from '../../components/AccessorySubcategoryLayout';

export function CablesPage(): JSX.Element {
  return (
    <AccessorySubcategoryLayout
      title="Cables"
      description="Charging and data cables for phones and gadgets."
    >
      <SubcategoryCatalogPage catalogKey="cables" />
    </AccessorySubcategoryLayout>
  );
}
