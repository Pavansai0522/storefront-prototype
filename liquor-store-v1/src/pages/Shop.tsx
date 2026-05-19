import React from 'react';
import { ProductCatalog } from '../components/ProductCatalog';
import { useStoreProducts } from '../context/StoreDataContext';

export function Shop(): JSX.Element {
  const products = useStoreProducts();
  return (
    <ProductCatalog
      title="Shop All"
      description="Browse our full selection of spirits, wine, and beer."
      products={products}
    />
  );
}
