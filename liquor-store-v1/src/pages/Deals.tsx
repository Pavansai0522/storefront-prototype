import React from 'react';
import { ProductCatalog } from '../components/ProductCatalog';
import { useStoreData } from '../context/StoreDataContext';

export function Deals(): JSX.Element {
  const { dealProducts } = useStoreData();

  return (
    <ProductCatalog
      title="Weekly Specials"
      description="Limited-time offers on select wines, spirits, and beer. Call the store to confirm availability and pricing."
      products={dealProducts}
      emptyTitle="No weekly specials right now"
      emptyDescription="Check back soon or browse our full catalog."
      emptyActionLabel="Browse shop"
      emptyActionHref="/shop"
    />
  );
}
