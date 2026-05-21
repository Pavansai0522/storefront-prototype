/**
 * Single white-label source for the liquor storefront (mirrors mobile `client-config` pattern).
 * Wire to API later; `store.ts` exposes phone/address/hours used by layout components.
 */
export type Nullable<T> = T | null;

export interface LiquorStoreConfig {
  clientId: string;
  storeName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  timings: {
    weekdays: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  delivery: {
    available: boolean;
    radiusMiles: number;
    minimumOrder: number;
  };
  social: {
    instagram: Nullable<string>;
    facebook: Nullable<string>;
    twitter: Nullable<string>;
  };
  colors: {
    primary: string;
    accent: string;
    bg: string;
    card: string;
  };
  logo: Nullable<string>;
  ageGate: boolean;
}

export const clientConfig: LiquorStoreConfig = {
  clientId: 'client-liquor-1',
  storeName: 'United Liquors',
  tagline: 'Spirits, wine, and beer in New Lenox, IL',
  phone: '(815) 463-9490',
  email: 'info@unitedliquors.com',
  address: '148 W Illinois Hwy',
  city: 'New Lenox',
  state: 'IL',
  zipCode: '60451',
  timings: {
    weekdays: '10 AM – 10 PM',
    friday: '10 AM – 10 PM',
    saturday: '10 AM – 10 PM',
    sunday: '10 AM – 9 PM',
  },
  delivery: {
    available: true,
    radiusMiles: 10,
    minimumOrder: 50,
  },
  social: {
    instagram: '@unitedliquors',
    facebook: 'unitedliquors',
    twitter: null,
  },
  colors: {
    primary: '#C9A84C',
    accent: '#D4B568',
    bg: '#0A0A0A',
    card: '#1A1A1A',
  },
  logo: null,
  ageGate: true,
};
