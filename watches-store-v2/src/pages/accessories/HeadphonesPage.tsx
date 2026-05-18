import React from 'react';
import { SubcategoryCatalogPage } from '../../components/SubcategoryCatalogPage';
import { AccessorySubcategoryLayout } from '../../components/AccessorySubcategoryLayout';

export function HeadphonesPage(): JSX.Element {
  return (
    <AccessorySubcategoryLayout
      title="Headphones"
      description="Wired and wireless audio accessories."
    >
      <SubcategoryCatalogPage catalogKey="headphones" />
    </AccessorySubcategoryLayout>
  );
}
