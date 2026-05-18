import React from 'react';
import { ProductCard } from './ProductCard';
import { FeaturedProductRail } from './FeaturedProductRail';
import { useStoreData } from '../context/StoreDataContext';

export function FeaturedWatches(): JSX.Element {
  const { featuredWatches } = useStoreData();

  return (
    <FeaturedProductRail
      id="watches"
      title="Featured watches"
      accentClassName="bg-gradient-to-r from-brand-purple to-brand-accent"
    >
      {featuredWatches.map((watch, index) => (
        <div
          key={`${watch.id}-${watch.name}`}
          className="shrink-0 snap-center md:snap-none md:shrink md:w-full"
        >
          <ProductCard
            layout="grid"
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

