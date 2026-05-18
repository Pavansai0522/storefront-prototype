export type WatchesCatalogItem = {
  id: number;
  brand: string;
  name: string;
  price: string;
  emi: string;
  image: string;
};

/** Demo catalog aligned with `pr-watches` FeaturedWatches (superadmin preview). */
export const WATCHES_CATALOG: WatchesCatalogItem[] = [
  {
    id: 1,
    brand: 'CASIO',
    name: 'G-Shock GA-2100',
    price: '₹8,999',
    emi: '₹750',
    image: 'https://images.unsplash.com/photo-1584302360444-1453c11c9c8f?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 2,
    brand: 'TITAN',
    name: 'Edge Ceramic',
    price: '₹12,499',
    emi: '₹1,042',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 3,
    brand: 'FOSSIL',
    name: 'Gen 6 Smartwatch',
    price: '₹24,999',
    emi: '₹2,083',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 4,
    brand: 'APPLE',
    name: 'Watch SE',
    price: '₹29,999',
    emi: '₹2,500',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 5,
    brand: 'SAMSUNG',
    name: 'Galaxy Watch 6',
    price: '₹27,999',
    emi: '₹2,333',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 6,
    brand: 'NOISE',
    name: 'ColorFit Pro',
    price: '₹3,499',
    emi: '₹292',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600',
  },
];
