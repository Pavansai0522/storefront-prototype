import React from 'react';
import { motion } from 'framer-motion';
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
        <motion.div
          key={`${watch.id}-${watch.name}`}
          className="shrink-0 snap-center md:snap-none md:shrink md:w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
        >
          <ProductCard
            layout="grid"
            type="watch"
            brand={watch.brand}
            name={watch.name}
            price={watch.price}
            emi={watch.emi}
            image={watch.image}
          />
        </motion.div>
      ))}
    </FeaturedProductRail>
  );
}
