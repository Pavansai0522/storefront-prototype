import { STORE_WHATSAPP_E164 } from '../config/store';

export function buildWhatsAppUrl(message: string): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${STORE_WHATSAPP_E164}?text=${text}`;
}

export function whatsappOrderMessage(itemName: string): string {
  return `Hi, I'd like to order: ${itemName}. Please confirm availability.`;
}
