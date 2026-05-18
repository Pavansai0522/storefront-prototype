import React from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { FeaturedProductRail } from './FeaturedProductRail';
import { useStoreData } from '../context/StoreDataContext';
import type { FeaturedProduct } from '../data/featured';

const fallbackAccessories: FeaturedProduct[] = [
  {
    id: 1,
    brand: 'APPLE',
    name: '20W USB-C Adapter',
    price: '₹1,900',
    emi: 'Original',
    image:
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=600',
    type: 'accessory',
  },
  {
    id: 2,
    brand: 'SAMSUNG',
    name: '25W Travel Adapter',
    price: '₹1,299',
    emi: 'Fast Charge',
    image:
      'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&q=80&w=600',
    type: 'accessory',
  },
  {
    id: 3,
    brand: 'BOAT',
    name: 'Bassheads 100',
    price: '₹399',
    emi: 'Best Seller',
    image:
      'https://images.unsplash.com/photo-1553152531-fa88d0028203?auto=format&fit=crop&q=80&w=600',
    type: 'accessory',
  },
  {
    id: 4,
    brand: 'ONEPLUS',
    name: 'Type-C Cable',
    price: '₹849',
    emi: 'Durable',
    image:
      'https://images.unsplash.com/photo-1530296684705-59b3433e25b1?auto=format&fit=crop&q=80&w=600',
    type: 'accessory',
  },
  {
    id: 5,
    brand: 'SONY',
    name: 'MDR-ZX110A',
    price: '₹999',
    emi: 'Clear Audio',
    image:
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=600',
    type: 'accessory',
  },
  {
    id: 6,
    brand: 'SPIGEN',
    name: 'Tough Armor Case',
    price: '₹1,499',
    emi: 'Protection',
    image:
      'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&q=80&w=600',
    type: 'accessory',
  },
];

export function FeaturedAccessories(): JSX.Element {
  const { featuredAccessories } = useStoreData();
  const accessories = featuredAccessories.length > 0 ? featuredAccessories : fallbackAccessories;

  return (
    <FeaturedProductRail
      title="ESSENTIAL ACCESSORIES"
      accentClassName="bg-brand-purple"
    >
      {accessories.map((item, index) => (
        <motion.div
          key={item.id}
          className="shrink-0 snap-center md:snap-none md:shrink md:w-full"
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
