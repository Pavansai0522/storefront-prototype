import React from 'react';
import { ProductCard } from './ProductCard';
import { FeaturedProductRail } from './FeaturedProductRail';
import { useStoreData } from '../context/StoreDataContext';

export function FeaturedWatches(): JSX.Element | null {
  const { featuredWatches } = useStoreData();

  if (featuredWatches.length === 0) {
    return null;
  }

  return (
    <FeaturedProductRail
      id="watches"
      title="Featured watches"
      accentClassName="bg-gradient-to-r from-brand-purple to-brand-accent"
    >
      {featuredWatches.map((watch, index) => (
        <div
          key={`${watch.productId}-${watch.name}`}
          className="shrink-0 snap-start md:w-full md:snap-none md:shrink"
        >
          <ProductCard
            productId={watch.productId}
            priceInr={watch.priceInr}
            type="watch"
            brand={watch.brand}
            name={watch.name}
            price={watch.price}
            emi={watch.emi}
            image={watch.image}
            priority={index < 2}
          />
        </div>
      ))}
    </FeaturedProductRail>
  );
}

