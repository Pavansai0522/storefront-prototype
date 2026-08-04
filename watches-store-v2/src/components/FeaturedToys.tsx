import React from 'react';
import { ProductCard } from './ProductCard';
import { FeaturedProductRail } from './FeaturedProductRail';
import { useStoreData } from '../context/StoreDataContext';

export function FeaturedToys(): JSX.Element | null {
  const { featuredToys } = useStoreData();

  if (featuredToys.length === 0) {
    return null;
  }

  return (
    <FeaturedProductRail
      id="toys"
      title="FUN TOYS FOR EVERYONE"
      accentClassName="bg-gradient-to-r from-brand-accent to-brand-purple"
    >
      {featuredToys.map((toy, index) => (
        <div
          key={`${toy.productId}-${toy.name}`}
          className="shrink-0 snap-start md:w-full md:snap-none md:shrink"
        >
          <ProductCard
            productId={toy.productId}
            priceInr={toy.priceInr}
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

