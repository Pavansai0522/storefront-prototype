import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { AddToCartButton } from './AddToCartButton';
import { ProductWhatsAppActions } from './ProductWhatsAppActions';
import type { CatalogTileItem } from '../types/catalogTile.types';
import { optimizeImageUrl } from '../utils/optimizeImageUrl';

type CatalogProductTileProps = {
  item: CatalogTileItem;
};

export function CatalogProductTile({ item }: CatalogProductTileProps): JSX.Element {
  const titleId = useId();
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = optimizeImageUrl(item.image, 360);
  const showImage = imageSrc.trim().length > 0 && !imageFailed;

  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-brand-purple/20 bg-brand-card transition-all duration-300 hover:border-brand-purple/40 hover:shadow-lg hover:shadow-brand-purple/10"
    >
      <Link to={`/product/${item.id}`} className="flex min-h-0 w-full flex-1 flex-col text-left">
        <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-brand-surface">
          {showImage ? (
            <img
              src={imageSrc}
              alt=""
              width={400}
              height={400}
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            <div
              className="absolute inset-0 bg-brand-bg/40"
              aria-hidden
            />
          )}
          <span className="pointer-events-none absolute left-2 top-2 z-10 max-w-[calc(100%-1rem)] truncate rounded-full border border-brand-border bg-brand-bg/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-text">
            {item.brand}
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-2 p-3 pb-0">
          <h3
            id={titleId}
            className="line-clamp-2 min-h-[2.75rem] text-sm font-semibold leading-snug text-brand-text"
          >
            {item.name}
          </h3>
          <p className="font-bebas text-xl tracking-wide text-brand-text">{item.priceLabel}</p>
        </div>
      </Link>
      <div className="mt-auto space-y-2 p-3 pt-2">
        <AddToCartButton
          productId={item.id}
          name={item.name}
          brand={item.brand}
          priceInr={item.priceInr}
          priceLabel={item.priceLabel}
          image={item.image}
          compact
        />
        <ProductWhatsAppActions
          productName={item.name}
          priceLabel={item.priceLabel}
          variant="compact"
        />
      </div>
    </article>
  );
}
