import React from 'react';
import { RestaurantMenu } from '../components/RestaurantMenu';
import { STORE_PHONE_PRIMARY_TEL } from '../config/store';
import { useStoreProducts } from '../context/StoreDataContext';

export function Menu(): JSX.Element {
  const products = useStoreProducts();

  return (
    <RestaurantMenu
      products={products}
      emptyTitle="Menu board updating"
      emptyDescription="Please call us — we'll share today's specials and what's cooking."
      emptyActionLabel="Call the restaurant"
      emptyActionHref={STORE_PHONE_PRIMARY_TEL}
    />
  );
}
