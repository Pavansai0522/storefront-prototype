import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { clientConfig, whatsappHref } from '../config/client-config';

import { STORE_TILE_HOVER, STORE_TILE_SURFACE } from '../constants/ui';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';

interface PhoneCardProps {
  brand: string;
  name: string;
  price: string;
  emi: string;
  img: string;
  index: number;
  layout?: 'default' | 'featured';
}

const cardBase = `group flex flex-col rounded-3xl p-3 ${STORE_TILE_SURFACE} ${STORE_TILE_HOVER} md:hover:-translate-y-2`;

export function PhoneCard({
  brand,
  name,
  price,
  emi,
  img,
  index,
  layout = 'default',
}: PhoneCardProps) {
  const buyMessage = `Hi ${clientConfig.brand.chatName}! I want to buy the ${name} (₹${price}). Please share availability and offers.`;
  const enquireMessage = `Hi ${clientConfig.brand.chatName}! I want to enquire about the ${name}.`;

  const handleWhatsappClick = (): void => {
    toast.success('Opening WhatsApp...');
  };

  const widthClass =
    layout === 'featured'
      ? 'w-[288px] min-w-[288px] sm:w-[320px] sm:min-w-[320px] md:w-full md:min-w-0'
      : 'min-w-0 w-full';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
      className={`${cardBase} ${widthClass}`}
    >
      <div className="relative mb-4 aspect-[5/4] w-full overflow-hidden rounded-2xl bg-brand-surface">
        {img.trim() ? (
          <img
            src={img}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover object-center md:transition-transform md:duration-500 md:group-hover:scale-105"
          />
        ) : (
          <ProductImagePlaceholder label={brand} />
        )}

        <div className="absolute left-3 top-3 rounded-full border border-brand-border bg-black/60 px-3 py-1 backdrop-blur-md">
          <span className="text-xs font-bold uppercase tracking-wider text-white">{brand}</span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="mb-2 truncate text-sm font-bold text-brand-text md:text-base">{name}</h3>

        <div className="mb-1 flex items-end gap-2">
          <span className="font-display text-lg tracking-wide text-brand-blue md:text-xl">
            ₹{price}
          </span>
        </div>

        <p className="mb-3 text-xs text-brand-muted">
          EMI from <span className="font-semibold text-brand-text">₹{emi}/mo</span>
        </p>

        <div className="mt-auto flex w-full flex-col gap-2 pt-2 sm:flex-row">
          <a
            href={whatsappHref(buyMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsappClick}
            className="flex min-h-[44px] w-full flex-1 items-center justify-center gap-2 rounded-lg bg-brand-saffron px-3 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-saffronHover"
          >
            <ShoppingBag className="shrink-0" size={15} aria-hidden />
            Buy Now
          </a>
          <a
            href={whatsappHref(enquireMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsappClick}
            className="flex min-h-[44px] w-full flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm font-semibold text-slate-600 transition-colors duration-200 hover:border-brand-blue hover:text-brand-blue"
          >
            <MessageCircle className="shrink-0" size={15} aria-hidden />
            Enquire
          </a>
        </div>
      </div>
    </motion.div>
  );
}
