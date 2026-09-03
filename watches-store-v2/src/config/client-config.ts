import { buildWhatsAppUrl } from '../utils/whatsapp';
import { brandColors } from './brandColors';
import {
  STORE_LOGO_PRIMARY,
  STORE_LOGO_SECONDARY,
  STORE_NAME,
} from './storeBranding';

/**
 * White-label source for PR Watches & Mobiles.
 * Phase 2: override via VITE_* env at build time (admin → deploy pipeline).
 */
const env = import.meta.env;

export const clientConfig = {
  /** Matches admin mock `client-watches-1`; used when Phase 2 API scopes catalog fetches */
  clientId: (env.VITE_CLIENT_ID as string | undefined) ?? 'client-watches-1',
  brand: {
    chatName: STORE_NAME,
    legalName: STORE_NAME,
    wordmark: {
      beforeAccent: `${STORE_LOGO_PRIMARY} `,
      accent: STORE_LOGO_SECONDARY,
    },
    /** Local trust line — optional Telugu subtitle on hero */
    teluguTagline: 'చిలకలూరుపేటలో మీ విశ్వసనీయ వాచ్ & టాయ్ షాప్',
    trustedSince: '2015',
  },
  contact: {
    whatsappE164: (env.VITE_WHATSAPP_E164 as string | undefined) ?? '919391958315',
    phoneDisplay: (env.VITE_PHONE_DISPLAY as string | undefined) ?? '+91 93919 58315',
    email: (env.VITE_STORE_EMAIL as string | undefined) ?? 'hello@prwatchesgadgets.in',
  },
  location: {
    addressLines: [
      STORE_NAME,
      'Main Road, Near Bus Stand,',
      'Chilakaluripet, Andhra Pradesh 522616',
    ],
    footerCompactAddress: 'Main Road, Chilakaluripet',
    mapCardTitle: STORE_NAME,
    mapCardSubtitle: 'Chilakaluripet, Andhra Pradesh',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=PR+Watches+Mobiles+Chilakaluripet+522616',
    storeCarouselImages: [
      '/store/pr1.jpeg',
      '/store/pr2.jpeg',
      '/store/pr3.jpeg',
      '/store/pr4.jpeg',
    ],
  },
  hours: {
    summary: 'Mon–Sun 9:30–22:00',
    weekdays: 'Mon–Sun: 9:30 AM – 10:00 PM',
    sunday: 'Sunday: 9:30 AM – 10:00 PM',
  },
  social: {
    instagramHandle: '@pr_watch_mobiles',
    instagramUrl: 'https://www.instagram.com/pr_watch_mobiles?igsh=NjF1dTJtc3pnMnc4&utm_source=qr',
    youtubeUrl: 'https://youtube.com/@prwatchmobiles?si=3rzvzNyNM7R4q_uL',
    facebookUrl: 'https://www.facebook.com/share/1DAPY1s12S/?mibextid=wwXIfr',
  },
  seo: {
    title: 'PR Watches & Mobiles | Watches, Toys & Mobiles in Chilakaluripet',
    description:
      'Watches, toys & mobiles in Chilakaluripet. Genuine products, EMI available, same-day pickup. Visit PR Watches & Mobiles or WhatsApp us.',
    ogImage: '/store/pr1.jpeg',
  },
  offers: {
    banner: 'Festival season — offers on watches, toys & accessories. Walk in or WhatsApp for best price.',
  },
  checkout: {
    deliveryChargeInr: 60,
    currency: 'INR',
  },
  theme: {
    colors: {
      bg: brandColors.bg,
      card: brandColors.card,
      accent: brandColors.gold,
      text: brandColors.text,
      accentHover: brandColors.goldDim,
    },
    fonts: {
      display: ['"Bebas Neue"', 'sans-serif'],
      sans: ['Inter', 'sans-serif'],
    },
    googleFontsImportUrl:
      'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap',
  },
} as const;

export function whatsappHref(message?: string): string {
  return buildWhatsAppUrl(clientConfig.contact.whatsappE164, message);
}

export function buyProductMessage(productName: string, price: string, color?: string): string {
  const colorBit = color ? ` (${color})` : '';
  return `Hi ${clientConfig.brand.chatName}! I want to buy ${productName}${colorBit} (${price}). Please share availability and EMI options.`;
}

export function enquireProductMessage(productName: string): string {
  return `Hi ${clientConfig.brand.chatName}! I want to enquire about ${productName}.`;
}
