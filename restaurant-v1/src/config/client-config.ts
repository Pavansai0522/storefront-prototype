import { brandColors } from './brandColors';

export type Nullable<T> = T | null;

export interface RestaurantStoreConfig {
  clientId: string;
  storeName: string;
  tagline: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappE164: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  proprietor: string;
  timings: {
    daily: string;
  };
  social: {
    instagram: Nullable<string>;
    facebook: Nullable<string>;
  };
  colors: typeof brandColors;
  logo: Nullable<string>;
}

function readEnv(key: string): string | undefined {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key as keyof ImportMetaEnv] as string | undefined;
  }
  return process.env[key];
}

export const clientConfig: RestaurantStoreConfig = {
  clientId: readEnv('VITE_CLIENT_ID') ?? 'client-restaurant-1',
  storeName: "Aruna's Eagle",
  tagline: 'Family restaurant · Non-veg specialties · Chilakaluripeta',
  phonePrimary: readEnv('VITE_PHONE_PRIMARY') ?? '93938 41841',
  phoneSecondary: readEnv('VITE_PHONE_SECONDARY') ?? '98662 56141',
  whatsappE164: readEnv('VITE_WHATSAPP_E164') ?? '919393841841',
  email: readEnv('VITE_STORE_EMAIL') ?? 'arunaseagle@gmail.com',
  address: 'Vijaya Bank Center, Main Road',
  city: 'Chilakaluripeta',
  state: 'Andhra Pradesh',
  pincode: '522616',
  proprietor: 'Naidu Srinivas Rao',
  timings: {
    daily: 'Open daily · 11 AM – 11 PM',
  },
  social: {
    instagram: null,
    facebook: null,
  },
  colors: brandColors,
  logo: '/brand/arunas-eagle-logo.png',
};
