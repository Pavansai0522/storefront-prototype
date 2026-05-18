import React from 'react';
import { SubcategoryCatalogPage } from '../../components/SubcategoryCatalogPage';
import { ToySubcategoryLayout } from '../../components/ToySubcategoryLayout';

export function SoftToysPage(): JSX.Element {
  return (
    <ToySubcategoryLayout
      title="Soft toys"
      description="Plush toys and cuddly gifts for all ages."
    >
      <SubcategoryCatalogPage catalogKey="soft-toys" />
    </ToySubcategoryLayout>
  );
}
