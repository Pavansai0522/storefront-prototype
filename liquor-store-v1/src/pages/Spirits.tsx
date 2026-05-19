import React from 'react';
import { ProductCatalog } from '../components/ProductCatalog';
import { useStoreProducts } from '../context/StoreDataContext';

const spiritCategoryValues: readonly string[] = [
  'Whisky',
  'Scotch',
  'Rare Bottles',
  'Vodka',
  'Tequila',
  'Rum',
  'Other',
];

export function Spirits(): JSX.Element {
  const products = useStoreProducts();
  const spiritsProducts = products.filter((p) => spiritCategoryValues.includes(p.category));
  return (
    <ProductCatalog
      title="Spirits"
      description="Premium whiskies, single malts and Scotch, tequila, vodka, rum—and our locked-case rare bottles for collectors."
      products={spiritsProducts}
    />
  );
}
