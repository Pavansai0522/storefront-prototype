import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PhoneCard } from './PhoneCard';
import { useStorePhones } from '../context/StoreDataContext';

export function FeaturedPhones(): JSX.Element | null {
  const phones = useStorePhones();
  const featured = phones.slice(0, 6);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section id="phones" className="relative py-24">
      <div className="mx-auto mb-12 max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="min-w-0">
            <h2 className="mb-2 break-words font-display text-2xl uppercase tracking-tight text-white md:text-4xl">
              Trending <span className="text-brand-saffron">Smartphones</span>
            </h2>
            <p className="text-base text-gray-400 sm:text-lg">
              Bharosa with Best Price. Grab them before they&apos;re gone!
            </p>
          </div>
          <Link
            to="/phones"
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 self-start font-semibold text-brand-saffron transition-colors hover:text-white md:self-auto"
          >
            View All Models &rarr;
          </Link>
        </motion.div>
      </div>

      <div className="w-full overflow-x-auto overflow-y-visible overscroll-x-contain touch-pan-x hide-scrollbar pb-12 snap-x snap-mandatory md:overflow-visible md:snap-none">
        <div className="w-full md:mx-auto md:max-w-7xl md:px-8">
          <div className="flex w-max gap-4 pl-4 pr-4 sm:gap-6 sm:pl-8 sm:pr-8 md:w-full md:grid md:grid-cols-2 md:gap-6 md:pl-0 md:pr-0 lg:grid-cols-3">
            {featured.map((phone, index) => (
              <div key={phone.id} className="shrink-0 snap-center md:snap-none md:shrink">
                <PhoneCard {...phone} index={index} layout="featured" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
