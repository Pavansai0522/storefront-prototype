import React from 'react';
import { ProductWhatsAppActions } from './ProductWhatsAppActions';
import type { CatalogTileItem } from '../types/catalogTile.types';
import { optimizeImageUrl } from '../utils/optimizeImageUrl';

type CatalogProductTileProps = {
  item: CatalogTileItem;
};

export function CatalogProductTile({ item }: CatalogProductTileProps): JSX.Element {
  return (
    <article className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-brand-border bg-brand-card transition-all duration-300 hover:border-brand-purple/40 hover:shadow-lg hover:shadow-brand-purple/10">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-brand-surface">
        <img
          src={optimizeImageUrl(item.image, 360)}
          alt={`${item.name} — ${item.brand}`}
          width={400}
          height={400}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <span className="absolute left-2 top-2 z-10 max-w-[calc(100%-1rem)] truncate rounded-full border border-brand-border bg-brand-bg/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-text">
          {item.brand}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-semibold leading-snug text-brand-text">
          {item.name}
        </h3>
        <p className="font-bebas text-xl tracking-wide text-brand-text">{item.priceLabel}</p>
        <div className="mt-auto pt-1">
          <ProductWhatsAppActions
            productName={item.name}
            priceLabel={item.priceLabel}
            variant="compact"
          />
        </div>
      </div>
    </article>
  );
}
