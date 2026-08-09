import type { Product } from '../types/product.types';

/** Placeholder menu until Supabase catalog is seeded for this client. */
export const SAMPLE_MENU_PRODUCTS: Product[] = [
  {
    id: 'sample-biryani',
    name: "Aruna's Signature Chicken Biryani",
    brand: 'Slow-cooked · Dum style',
    category: 'Biryani',
    price: 320,
    image: '',
    inStock: true,
  },
  {
    id: 'sample-curry',
    name: 'Andhra Chicken Curry',
    brand: 'Fiery · House spice blend',
    category: 'Curries',
    price: 260,
    image: '',
    inStock: true,
  },
  {
    id: 'sample-tandoori',
    name: 'Tandoori Chicken (Full)',
    brand: 'Charcoal grilled',
    category: 'Tandoor',
    price: 380,
    image: '',
    inStock: true,
  },
  {
    id: 'sample-mutton',
    name: 'Mutton Rogan Josh',
    brand: 'Slow braised',
    category: 'Curries',
    price: 420,
    image: '',
    inStock: true,
  },
  {
    id: 'sample-prawns',
    name: 'Chilli Garlic Prawns',
    brand: 'Coastal special',
    category: 'Starters',
    price: 340,
    image: '',
    inStock: true,
  },
  {
    id: 'sample-thali',
    name: "Eagle's Family Thali",
    brand: "Serves 4 · Chef's selection",
    category: 'Thali',
    price: 1150,
    image: '',
    inStock: true,
  },
];
