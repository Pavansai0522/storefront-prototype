import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { AddToCartButton } from './AddToCartButton';
import { ProductWhatsAppActions } from './ProductWhatsAppActions';
import { optimizeImageUrl } from '../utils/optimizeImageUrl';
import type { ID } from '../types/utils.types';

interface ProductCardProps {
  productId: ID;
  priceInr: number;
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
  productId,
  priceInr,
  image,
  brand,
  name,
  price,
  emi,
  type,
  layout = 'carousel',
  priority = false,
}: ProductCardProps): JSX.Element {
  const titleId = useId();
  const [imageFailed, setImageFailed] = useState(false);
  const isWatch = type === 'watch';
  const isGrid = layout === 'grid';
  const imageSrc = optimizeImageUrl(image, priority ? 640 : 400);
  const showImage = imageSrc.trim().length > 0 && !imageFailed;

  return (
    <article
      aria-labelledby={titleId}
      className={
        isGrid
          ? 'flex w-full min-w-0 max-w-none flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-card transition-colors duration-200 hover:border-brand-purple/30 md:hover:shadow-lg md:hover:shadow-brand-purple/10'
          : 'flex w-[min(78vw,280px)] min-w-[240px] max-w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-card transition-colors duration-200 hover:border-brand-purple/30 sm:w-[min(72vw,300px)] sm:max-w-[300px] md:w-full md:min-w-0 md:max-w-none md:shrink'
      }
    >
      <Link to={`/product/${productId}`} className="flex w-full flex-1 flex-col text-left">
        <div className="group relative flex aspect-square items-center justify-center overflow-hidden bg-brand-surface p-6">
          {showImage ? (
            <img
              src={imageSrc}
              alt=""
              width={400}
              height={400}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
              onError={() => setImageFailed(true)}
              className="h-full w-full object-contain md:transition-transform md:duration-500 md:group-hover:scale-105"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-brand-border/60 bg-brand-bg/40"
              aria-hidden
            />
          )}
          <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[calc(100%-2rem)] rounded-full border border-brand-border bg-brand-bg/90 px-3 py-1 backdrop-blur-sm">
            <span className="block truncate text-xs font-bold uppercase tracking-wider text-brand-text">
              {brand}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 pb-0">
          <h3
            id={titleId}
            className="mb-2 line-clamp-2 min-h-[1.75rem] text-lg font-semibold leading-snug text-brand-text"
            title={name}
          >
            {name}
          </h3>

          <div className="mb-5">
            <p className="font-bebas text-2xl tracking-wide text-brand-purple">{price}</p>
            <p className="mt-1 text-xs text-brand-text">
              {isWatch ? (
                <>
                  EMI from <span className="font-semibold text-brand-purple">{emi}/mo</span>
                </>
              ) : (
                <span className="inline-block rounded-md border border-brand-purple/30 bg-brand-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-purple">
                  {emi}
                </span>
              )}
            </p>
          </div>
        </div>
      </Link>
      <div className="mt-auto space-y-2 p-6 pt-0">
        <AddToCartButton
          productId={productId}
          name={name}
          brand={brand}
          priceInr={priceInr}
          priceLabel={price}
          image={image}
        />
        <ProductWhatsAppActions productName={name} priceLabel={price} variant="card" />
      </div>
    </article>
  );
}
