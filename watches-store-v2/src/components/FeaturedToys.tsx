import React from 'react';
import { ProductCard } from './ProductCard';
import { FeaturedProductRail } from './FeaturedProductRail';
import { useStoreData } from '../context/StoreDataContext';

export function FeaturedToys(): JSX.Element {
  const { featuredToys } = useStoreData();

  return (
    <FeaturedProductRail
      id="toys"
      title="FUN TOYS FOR EVERYONE"
      accentClassName="bg-gradient-to-r from-brand-accent to-brand-purple"
    >
      {featuredToys.map((toy, index) => (
        <div
          key={`${toy.id}-${toy.name}`}
          className="shrink-0 snap-center md:snap-none md:shrink md:w-full"
        >
          <ProductCard
            layout="grid"
            type="toy"
            brand={toy.brand}
            name={toy.name}
            price={toy.price}
            emi={toy.emi}
            image={toy.image}
            priority={index < 2}
          />
        </div>
      ))}
    </FeaturedProductRail>
  );
}

