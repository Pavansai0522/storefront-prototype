import { buildWhatsAppUrl } from '../utils/whatsapp';
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
    whatsappE164: (env.VITE_WHATSAPP_E164 as string | undefined) ?? '917416958315',
    phoneDisplay: (env.VITE_PHONE_DISPLAY as string | undefined) ?? '+91 74169 58315',
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
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1000',
    ],
  },
  hours: {
    summary: 'Mon–Sat 10:00–21:00 · Sun 11:00–20:00',
    weekdays: 'Mon–Sat: 10:00 AM – 9:00 PM',
    sunday: 'Sunday: 11:00 AM – 8:00 PM',
  },
  social: {
    instagramHandle: '@prwatchesgadgets',
    instagramUrl: 'https://www.instagram.com/prwatchesgadgets',
    youtubeUrl: 'https://www.youtube.com/@prwatchesgadgets',
    facebookUrl: 'https://www.facebook.com/prwatchesgadgets',
  },
  seo: {
    title: 'PR Watches & Mobiles | Watches, Toys & Mobiles in Chilakaluripet',
    description:
      'Watches, toys & mobiles in Chilakaluripet. Genuine products, EMI available, same-day pickup. Visit PR Watches & Mobiles or WhatsApp us.',
    ogImage:
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1200',
  },
  offers: {
    banner: 'Festival season — EMI on watches, toys & accessories. Walk in or WhatsApp for best price.',
  },
  theme: {
    colors: {
      bg: '#07070D',
      card: '#13131F',
      accent: '#8B5CF6',
      text: '#FFFFFF',
      accentHover: '#5a32c4',
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

export function buyProductMessage(productName: string, price: string): string {
  return `Hi ${clientConfig.brand.chatName}! I want to buy ${productName} (${price}). Please share availability and EMI options.`;
}

export function enquireProductMessage(productName: string): string {
  return `Hi ${clientConfig.brand.chatName}! I want to enquire about ${productName}.`;
}
