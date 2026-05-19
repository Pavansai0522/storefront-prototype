import React from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { FeaturedProductRail } from './FeaturedProductRail';
import { useStoreData } from '../context/StoreDataContext';

export function FeaturedAccessories(): JSX.Element | null {
  const { featuredAccessories } = useStoreData();

  if (featuredAccessories.length === 0) {
    return null;
  }

  return (
    <FeaturedProductRail
      title="ESSENTIAL ACCESSORIES"
      accentClassName="bg-brand-purple"
    >
      {featuredAccessories.map((item, index) => (
        <motion.div
          key={item.id}
          className="shrink-0 snap-start md:w-full md:snap-none md:shrink"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
        >
          <ProductCard
            type="accessory"
            brand={item.brand}
            name={item.name}
            price={item.price}
            emi={item.emi}
            image={item.image}
          />
        </motion.div>
      ))}
    </FeaturedProductRail>
  );
}
