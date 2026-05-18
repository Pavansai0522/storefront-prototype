import React from 'react';
import { motion } from 'framer-motion';
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
        <motion.div
          key={`${toy.id}-${toy.name}`}
          className="shrink-0 snap-center md:snap-none md:shrink md:w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
        >
          <ProductCard
            layout="grid"
            type="toy"
            brand={toy.brand}
            name={toy.name}
            price={toy.price}
            emi={toy.emi}
            image={toy.image}
          />
        </motion.div>
      ))}
    </FeaturedProductRail>
  );
}
