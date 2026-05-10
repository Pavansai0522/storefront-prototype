export type CatalogItem = {
  id: string;
  clientId: string;
  name: string;
  brand: string;
  price: number;
  emiPrice: number;
  imageUrl: string;
  inStock: boolean;
  category: string;
};

export const MOCK_PRODUCTS: CatalogItem[] = [
  {
    id: 'p-1',
    clientId: 'client-1',
    name: 'Galaxy A55',
    brand: 'Samsung',
    price: 32999,
    emiPrice: 2750,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop',
    inStock: true,
    category: 'Phone',
  },
  {
    id: 'p-2',
    clientId: 'client-1',
    name: 'iPhone 15',
    brand: 'Apple',
    price: 79900,
    emiPrice: 6658,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&h=200&fit=crop',
    inStock: false,
    category: 'Phone',
  },
  {
    id: 'p-3',
    clientId: 'client-2',
    name: 'Pixel 8',
    brand: 'Google',
    price: 75999,
    emiPrice: 6333,
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=200&h=200&fit=crop',
    inStock: true,
    category: 'Phone',
  },
];

export const MOCK_ACCESSORIES: CatalogItem[] = [
  {
    id: 'a-1',
    clientId: 'client-1',
    name: 'USB-C Fast Charger 25W',
    brand: 'Anker',
    price: 1999,
    emiPrice: 167,
    imageUrl: 'https://images.unsplash.com/photo-1583863785174-4f6a2c0c0b0b?w=200&h=200&fit=crop',
    inStock: true,
    category: 'Charger',
  },
  {
    id: 'a-2',
    clientId: 'client-1',
    name: 'Silicone Case — Navy',
    brand: 'Ringke',
    price: 899,
    emiPrice: 75,
    imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200&h=200&fit=crop',
    inStock: true,
    category: 'Case',
  },
  {
    id: 'a-3',
    clientId: 'client-2',
    name: 'TWS Earbuds Pro',
    brand: 'Boat',
    price: 3499,
    emiPrice: 292,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop',
    inStock: false,
    category: 'Earphone',
  },
];
