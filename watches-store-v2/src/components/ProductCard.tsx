import React from 'react';
import { motion } from 'framer-motion';
import { ProductWhatsAppActions } from './ProductWhatsAppActions';

interface ProductCardProps {
  image: string;
  brand: string;
  name: string;
  price: string;
  emi: string;
  type: 'watch' | 'toy' | 'accessory';
  /** carousel = horizontal rail card; grid = full-width in desktop grid */
  layout?: 'carousel' | 'grid';
}

export function ProductCard({
  image,
  brand,
  name,
  price,
  emi,
  type,
  layout = 'carousel',
}: ProductCardProps): JSX.Element {
  const isWatch = type === 'watch';
  const isGrid = layout === 'grid';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={
        isGrid
          ? 'flex w-full min-w-0 max-w-none flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-card transition-all duration-300 hover:border-brand-purple/30 hover:shadow-lg hover:shadow-brand-purple/10'
          : 'flex w-[min(85vw,320px)] min-w-[260px] max-w-[320px] flex-shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-card transition-all duration-300 hover:border-brand-purple/30 hover:shadow-lg hover:shadow-brand-purple/10 sm:min-w-[280px]'
      }
    >
      <div className="group relative flex aspect-square items-center justify-center overflow-hidden bg-brand-surface p-6">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute left-4 top-4 rounded-full border border-brand-border bg-brand-bg/90 px-3 py-1 backdrop-blur-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-text">
            {brand}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-brand-text" title={name}>
          {name}
        </h3>

        <div className="mb-5">
          <p
            className={`font-bebas text-2xl tracking-wide ${isWatch ? 'text-brand-text' : 'text-brand-purple'}`}
          >
            {price}
          </p>
          <p className="mt-1 text-xs text-brand-muted">
            {isWatch ? (
              <>EMI from <span className="font-semibold text-brand-text">{emi}/mo</span></>
            ) : (
              <span className="inline-block rounded-md border border-brand-border bg-brand-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-muted">
                {emi}
              </span>
            )}
          </p>
        </div>

        <div className="mt-auto">
          <ProductWhatsAppActions productName={name} priceLabel={price} variant="card" />
        </div>
      </div>
    </motion.div>
  );
}
