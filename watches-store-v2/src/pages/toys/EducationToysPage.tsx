import React from 'react';
import { SubcategoryCatalogPage } from '../../components/SubcategoryCatalogPage';
import { ToySubcategoryLayout } from '../../components/ToySubcategoryLayout';

export function EducationToysPage(): JSX.Element {
  return (
    <ToySubcategoryLayout
      title="Education toys"
      description="STEM kits and learning toys."
    >
      <SubcategoryCatalogPage catalogKey="education-toys" />
    </ToySubcategoryLayout>
  );
}
