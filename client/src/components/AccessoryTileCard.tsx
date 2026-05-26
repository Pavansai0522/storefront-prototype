import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import type { Accessory } from '../types';
import { clientConfig, whatsappHref } from '../config/client-config';
import { STORE_TILE_HOVER, STORE_TILE_SURFACE } from '../constants/ui';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';

function buildWhatsappHref(product: Accessory): string {
  const text =
    `Hi ${clientConfig.brand.chatName}! I'm asking about ${product.itemCode} — ${product.name}. ` +
    `${product.detail} ` +
    `Is it available at your store today, and what's your best price? Thanks!`;
  return whatsappHref(text);
}

export interface AccessoryTileCardProps {
  product: Accessory;
  index: number;
}

export function AccessoryTileCard({
  product,
  index
}: AccessoryTileCardProps): JSX.Element {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.04, 0.32)
      }}
      className={`group flex min-w-0 flex-col overflow-hidden rounded-2xl ${STORE_TILE_SURFACE} ${STORE_TILE_HOVER}`}>
      <div className="relative aspect-square w-full overflow-hidden bg-black/40">
        {product.img.trim() ? (
          <img
            src={product.img}
            alt={product.name}
            className="h-full w-full object-contain object-center md:transition-transform md:duration-500 md:group-hover:scale-105"
          />
        ) : (
          <ProductImagePlaceholder label={product.itemCode} />
        )}
        <div className="absolute left-2 right-2 top-2 flex flex-col gap-1.5">
          <span className="self-start rounded-lg border border-slate-300 bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-muted backdrop-blur-sm">
            Ask with this ref
          </span>
          <span className="self-start rounded-lg bg-brand-saffron/95 px-2.5 py-1 font-mono text-xs font-bold tracking-wide text-white shadow-lg">
            {product.itemCode}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <h3 className="truncate text-sm font-bold leading-snug text-brand-text">{product.name}</h3>
        <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-brand-muted">{product.detail}</p>
        <div className="flex items-baseline justify-between gap-2 border-t border-brand-border pt-1">
          <span className="font-display text-base tracking-wide text-brand-blue md:text-lg">
            ₹{product.priceDisplay}
          </span>
        </div>
        <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row">
          <a
            href={buildWhatsappHref(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] w-full flex-1 items-center justify-center gap-2 rounded-lg border border-brand-blue/40 bg-brand-blue/10 px-3 py-2 text-xs font-bold text-brand-blue transition-colors duration-200 hover:bg-brand-blue hover:text-white sm:text-sm">
            <MessageCircle className="shrink-0" size={15} aria-hidden />
            WhatsApp this item
          </a>
        </div>
      </div>
    </motion.article>
  );
}
