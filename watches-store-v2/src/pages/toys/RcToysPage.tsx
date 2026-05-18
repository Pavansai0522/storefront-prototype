import React from 'react';
import { SubcategoryCatalogPage } from '../../components/SubcategoryCatalogPage';
import { ToySubcategoryLayout } from '../../components/ToySubcategoryLayout';

export function RcToysPage(): JSX.Element {
  return (
    <ToySubcategoryLayout
      title="RC toys"
      description="Remote-control cars, drones, and action toys."
    >
      <SubcategoryCatalogPage catalogKey="rc-toys" />
    </ToySubcategoryLayout>
  );
}
