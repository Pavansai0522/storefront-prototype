import React from 'react';
import { ProductCatalog } from '../components/ProductCatalog';
import { useStoreProducts } from '../context/StoreDataContext';

export function Beer(): JSX.Element {
  const products = useStoreProducts();
  const beerProducts = products.filter((p) => p.category === 'Beer');
  return (
    <ProductCatalog
      title="Beer"
      description="Craft brews, imports, and local favorites."
      products={beerProducts}
    />
  );
}
