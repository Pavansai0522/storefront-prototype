import React from 'react';
import { MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  buyProductMessage,
  whatsappHref,
} from '../config/client-config';
import { btnWhatsApp, btnWhatsAppCompact } from '../constants/buttonStyles';

type ProductWhatsAppActionsProps = {
  productName: string;
  priceLabel: string;
  /** Featured cards: stacked primary + text link. Grid tiles: single compact button. */
  variant?: 'card' | 'compact';
  color?: string;
};

export function ProductWhatsAppActions({
  productName,
  priceLabel,
  variant = 'card',
  color,
}: ProductWhatsAppActionsProps): JSX.Element {
  const handleClick = (): void => {
    toast.success('Opening WhatsApp...');
  };

  if (variant === 'compact') {
    return (
      <a
        href={whatsappHref(buyProductMessage(productName, priceLabel, color))}
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
    <a
      href={whatsappHref(buyProductMessage(productName, priceLabel, color))}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`w-full ${btnWhatsApp} text-sm`}
    >
      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
      Order on WhatsApp
    </a>
  );
}
