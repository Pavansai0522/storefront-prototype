import React from 'react';
import { MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  buyProductMessage,
  enquireProductMessage,
  whatsappHref,
} from '../config/client-config';
import { btnEnquireLink, btnWhatsApp, btnWhatsAppCompact } from '../constants/buttonStyles';

type ProductWhatsAppActionsProps = {
  productName: string;
  priceLabel: string;
  /** Featured cards: stacked primary + text link. Grid tiles: single compact button. */
  variant?: 'card' | 'compact';
};

export function ProductWhatsAppActions({
  productName,
  priceLabel,
  variant = 'card',
}: ProductWhatsAppActionsProps): JSX.Element {
  const handleClick = (): void => {
    toast.success('Opening WhatsApp...');
  };

  if (variant === 'compact') {
    return (
      <a
        href={whatsappHref(buyProductMessage(productName, priceLabel))}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={btnWhatsAppCompact}
      >
        <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
        WhatsApp
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <a
        href={whatsappHref(buyProductMessage(productName, priceLabel))}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`w-full ${btnWhatsApp} text-sm`}
      >
        <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
        Order on WhatsApp
      </a>
      <a
        href={whatsappHref(enquireProductMessage(productName))}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={btnEnquireLink}
      >
        Ask about this product
      </a>
    </div>
  );
}
