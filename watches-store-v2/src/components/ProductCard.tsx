import React from 'react';
import { ProductWhatsAppActions } from './ProductWhatsAppActions';
import { optimizeImageUrl } from '../utils/optimizeImageUrl';

interface ProductCardProps {
  image: string;
  brand: string;
  name: string;
  price: string;
  emi: string;
  type: 'watch' | 'toy' | 'accessory';
  /** carousel = horizontal rail card; grid = full-width in desktop grid */
  layout?: 'carousel' | 'grid';
  /** First visible card in a rail — loads image sooner */
  priority?: boolean;
}

export function ProductCard({
  image,
  brand,
  name,
  price,
  emi,
  type,
  layout = 'carousel',
  priority = false,
}: ProductCardProps): JSX.Element {
  const isWatch = type === 'watch';
  const isGrid = layout === 'grid';
  const imageSrc = optimizeImageUrl(image, priority ? 640 : 400);

  return (
    <article
      className={
        isGrid
          ? 'flex w-full min-w-0 max-w-none flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-card transition-colors duration-200 hover:border-brand-purple/30 md:hover:shadow-lg md:hover:shadow-brand-purple/10'
          : 'flex w-[min(78vw,280px)] min-w-[240px] max-w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-card transition-colors duration-200 hover:border-brand-purple/30 sm:w-[min(72vw,300px)] sm:max-w-[300px] md:w-full md:min-w-0 md:max-w-none md:shrink'
      }
    >
      <div className="group relative flex aspect-square items-center justify-center overflow-hidden bg-brand-surface p-6">
        <img
          src={imageSrc}
          alt={name}
          width={400}
          height={400}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          className="h-full w-full object-contain md:transition-transform md:duration-500 md:group-hover:scale-105"
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
    </article>
  );
}

