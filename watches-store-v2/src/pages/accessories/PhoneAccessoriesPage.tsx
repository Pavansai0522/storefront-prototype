import React from 'react';
import { SubcategoryCatalogPage } from '../../components/SubcategoryCatalogPage';
import { AccessorySubcategoryLayout } from '../../components/AccessorySubcategoryLayout';

export function PhoneAccessoriesPage(): JSX.Element {
  return (
    <AccessorySubcategoryLayout
      title="Phone accessories"
      description="Cases, covers, and mobile essentials."
    >
      <SubcategoryCatalogPage catalogKey="phone-accessories" />
    </AccessorySubcategoryLayout>
  );
}
