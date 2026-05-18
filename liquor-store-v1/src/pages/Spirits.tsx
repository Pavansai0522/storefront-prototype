import React from 'react';
import { ProductCatalog } from '../components/ProductCatalog';
import { allProducts } from '../data/products';
export function Spirits() {
  const spiritCategoryValues: readonly string[] = [
    'Whisky',
    'Scotch',
    'Rare Bottles',
    'Vodka',
    'Tequila',
    'Rum',
    'Other',
  ];
  const spiritsProducts = allProducts.filter((p) => spiritCategoryValues.includes(p.category));
  return (
    <ProductCatalog
      title="Spirits"
      description="Premium whiskies, single malts and Scotch, tequila, vodka, rum—and our locked-case rare bottles for collectors."
      products={spiritsProducts} />);


}