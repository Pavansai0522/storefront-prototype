import { buildWhatsAppUrl } from '../utils/whatsapp';

/**
 * Single place to white-label the site for a new client.
 * Swap this file (or branch values) + replace catalog data in src/data/*.
 *
 * Keep `theme.googleFontsImportUrl` in sync with the @import at the top of src/index.css.
 */
export const clientConfig = {
  brand: {
    /** Used in sentences: "Hi {chatName}!" and headings */
    chatName: 'Bala Mobiles',
    /** Short legal / footer entity name */
    legalName: 'Bala Mobiles',
    /** Split logo wordmark: [before accent][accent in brand color] */
    wordmark: {
      beforeAccent: 'BALA ',
      accent: 'MOBILES'
    }
  },
  contact: {
    /** WhatsApp number only, country code without + (e.g. 919876543210) */
    whatsappE164: '919876543210',
    phoneDisplay: '+91 98765 43210',
    email: 'hello@balamobiles.in'
  },
  location: {
    /** Rendered with line breaks between entries */
    addressLines: [
      'Shop No. 42, Tech Market Building,',
      'MG Road, Near Metro Pillar 104,',
      'New Delhi, 110001'
    ],
    /** Single line for compact mobile footer (no pincode) */
    footerCompactAddress: 'Shop No. 42, Tech Market, MG Road',
    mapCardTitle: 'Bala Mobiles',
    mapCardSubtitle: 'Tech Market, MG Road',
    /** Store photo carousel (replace with real storefront images when available) */
    storeCarouselImages: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
      'https://images.unsplash.com/photo-1601598851547-4302969d0614?w=800'
    ]
  },
  theme: {
    colors: {
      bg: '#0A0A0A',
      card: '#1A1A2E',
      accent: '#FF6B00',
      text: '#FFFFFF',
      accentHover: '#ff8533'
    },
    fonts: {
      display: ['"Bebas Neue"', 'sans-serif'],
      sans: ['Inter', 'sans-serif']
    },
    googleFontsImportUrl:
      'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap'
  }
} as const;

export function whatsappHref(message?: string): string {
  return buildWhatsAppUrl(clientConfig.contact.whatsappE164, message);
}
