import React from 'react';
import { ProductCatalog } from '../components/ProductCatalog';
import { useStoreProducts } from '../context/StoreDataContext';

export function Wine(): JSX.Element {
  const products = useStoreProducts();
  const wineProducts = products.filter((p) => p.category === 'Wine');
  return (
    <ProductCatalog
      title="Wine"
      description="Red, white, rosé, and sparkling wines from renowned vineyards."
      products={wineProducts}
    />
  );
}
