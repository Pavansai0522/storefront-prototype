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
    /** WhatsApp number only, country code without + (e.g. 919393115555) */
    whatsappE164: '919393115555',
    phoneDisplay: '+91 93931 15555',
    email: '',
  },
  location: {
    /** Rendered with line breaks between entries */
    addressLines: [
      'Bala Kumar — Sri Srinivasa Communications · Bala Digital Xpress',
      '9-7-255/13, Beside Malabar Gold Shop',
      'Main Road, Old Gajuwaka',
      'Visakhapatnam, Near Srikanya Theater',
      'PIN: 530026'
    ],
    /** Single line for compact mobile footer (no pincode) */
    footerCompactAddress: 'Main Road, Old Gajuwaka, Visakhapatnam',
    mapCardTitle: 'Bala Digital Xpress',
    mapCardSubtitle: 'Old Gajuwaka, Visakhapatnam',
    mapsUrl: 'https://maps.app.goo.gl/5NT6NKrx3KnzMBvh9',
    /** Storefront photos in `public/store/` — override via admin public_config.storeCarouselImages */
    storeCarouselImages: [
      '/store/b1.jpeg',
      '/store/b2.jpeg',
      '/store/b3.jpeg',
      '/store/b4.jpeg',
      '/store/b5.jpeg',
      '/store/b6.jpeg',
      '/store/b7.jpeg',
      '/store/b8.jpeg',
    ],
  },
  social: {
    instagram: 'https://www.instagram.com/bala_digital_xpress?igsh=cGRvNm50MHJiMHA4',
    instagramHandle: '@bala_digital_xpress',
    youtube: 'https://youtube.com/user/vsvbalakumar',
    facebook: 'https://www.facebook.com/bala.kumar.712161',
    whatsappChannel: 'https://whatsapp.com/channel/0029VaA45vC1t90XGjoulr3Q',
    telegram: 'https://t.me/bala2233',
  },
  /** Display-only follower counts — update when marketing numbers change. */
  socialStats: {
    facebook: { value: '186K', label: 'Facebook Followers' },
    instagram: { value: '65K+', label: 'Instagram Followers' },
    youtube: { value: '5K', label: 'YouTube Subscribers' },
  },
  theme: {
    colors: {
      bg: '#FFFFFF',
      card: '#F8FAFC',
      /** Red — primary CTAs (logo “X” / buy actions) */
      accent: '#E31E24',
      accentHover: '#C81A1F',
      /** Blue — links, headings, icons (logo “BD” gradient) */
      accentBlue: '#1D4ED8',
      accentBlueHover: '#1E40AF',
      text: '#0F172A',
      muted: '#64748B',
      border: '#E2E8F0',
      surface: '#F1F5F9'
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
