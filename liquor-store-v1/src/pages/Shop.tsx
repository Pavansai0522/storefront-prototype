import React from 'react';
import { ProductCatalog } from '../components/ProductCatalog';
import { STORE_PHONE_TEL } from '../config/store';
import { useStoreProducts } from '../context/StoreDataContext';

export function Shop(): JSX.Element {
  const products = useStoreProducts();
  const isEmpty = products.length === 0;

  return (
    <ProductCatalog
      title="Shop All"
      description="Browse our full selection of spirits, wine, and beer."
      products={products}
      emptyTitle={isEmpty ? 'Catalog coming soon' : undefined}
      emptyDescription={
        isEmpty
          ? 'We are updating our inventory. Call the store or check back soon.'
          : undefined
      }
      emptyActionLabel={isEmpty ? 'Call the store' : undefined}
      emptyActionHref={isEmpty ? STORE_PHONE_TEL : undefined}
    />
  );
}
