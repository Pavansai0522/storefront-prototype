import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PhoneCard } from './PhoneCard';
import { CatalogSectionLoading } from './CatalogSectionLoading';
import { useStoreData, useStorePhones } from '../context/StoreDataContext';
import { STORE_SECTION_SURFACE } from '../constants/ui';

export function FeaturedPhones(): JSX.Element | null {
  const { catalogLoading } = useStoreData();
  const phones = useStorePhones();
  const featured = phones.filter((phone) => !phone.isHeroTrending).slice(0, 6);

  if (catalogLoading) {
    return (
      <section id="phones" className={`relative ${STORE_SECTION_SURFACE} py-24`}>
        <CatalogSectionLoading message="Loading phones…" />
      </section>
    );
  }

  if (featured.length === 0) {
    return (
      <section id="phones" className={`relative ${STORE_SECTION_SURFACE} py-24`}>
        <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
          <h2 className="mb-2 font-display text-2xl uppercase tracking-tight text-brand-text md:text-4xl">
            Trending <span className="text-brand-blue">Smartphones</span>
          </h2>
          <p className="mb-6 text-brand-muted">Our catalog is updating. Visit the store or WhatsApp us for today&apos;s stock.</p>
          <Link
            to="/phones"
            className="inline-flex min-h-[44px] items-center font-semibold text-brand-blue hover:text-brand-blueHover">
            Browse all phones &rarr;
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section id="phones" className={`relative ${STORE_SECTION_SURFACE} py-24`}>
      <div className="mx-auto mb-12 max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="min-w-0">
            <h2 className="mb-2 break-words font-display text-2xl uppercase tracking-tight text-brand-text md:text-4xl">
              Trending <span className="text-brand-blue">Smartphones</span>
            </h2>
            <p className="text-base text-brand-muted sm:text-lg">
              Bharosa with Best Price. Grab them before they&apos;re gone!
            </p>
          </div>
          <Link
            to="/phones"
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 self-start font-semibold text-brand-blue transition-colors hover:text-brand-blueHover md:self-auto"
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
