import type { ProductSeedItem } from './types';

const PHONE_IMG =
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop';
const PHONE_IMG_2 =
  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop';
const PHONE_IMG_3 =
  'https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=400&h=400&fit=crop';
const ACC_IMG =
  'https://images.unsplash.com/photo-1583863785174-4f6a2c0c0b0b?w=400&h=400&fit=crop';
const ACC_IMG_2 =
  'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop';
const ACC_IMG_3 =
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop';

/** Sample phones + accessories for mobile-store-v1 / mobile-store-v2 storefronts. */
export function mobileCatalogItems(): ProductSeedItem[] {
  return [
    {
      name: 'Galaxy S24',
      brand: 'Samsung',
      priceInr: 74999,
      imageUrl: PHONE_IMG,
      category: 'Phone',
      isAccessory: false,
      featuredGroup: 'trending',
      featuredSort: 0,
    },
    {
      name: 'iPhone 15',
      brand: 'Apple',
      priceInr: 79900,
      imageUrl: PHONE_IMG_2,
      category: 'Phone',
      isAccessory: false,
      inStock: false,
    },
    {
      name: 'Pixel 8',
      brand: 'Google',
      priceInr: 75999,
      imageUrl: PHONE_IMG_3,
      category: 'Phone',
      isAccessory: false,
    },
    {
      name: 'Redmi Note 13 Pro',
      brand: 'Xiaomi',
      priceInr: 24999,
      imageUrl: PHONE_IMG,
      category: 'Phone',
      isAccessory: false,
    },
    {
      name: 'OnePlus Nord 4',
      brand: 'OnePlus',
      priceInr: 32999,
      imageUrl: PHONE_IMG_2,
      category: 'Phone',
      isAccessory: false,
    },
    {
      name: 'Galaxy Tab S9 FE',
      brand: 'Samsung',
      priceInr: 44999,
      imageUrl: PHONE_IMG_3,
      category: 'Tablet',
      isAccessory: false,
    },
    {
      name: 'USB-C Fast Charger 25W',
      brand: 'Anker',
      priceInr: 1999,
      imageUrl: ACC_IMG,
      category: 'Charger',
      subcategory: 'power',
      isAccessory: true,
    },
    {
      name: 'Silicone Case — Navy',
      brand: 'Ringke',
      priceInr: 899,
      imageUrl: ACC_IMG_2,
      category: 'Case',
      subcategory: 'cables',
      isAccessory: true,
    },
    {
      name: 'TWS Earbuds Pro',
      brand: 'boAt',
      priceInr: 3499,
      imageUrl: ACC_IMG_3,
      category: 'Earphone',
      subcategory: 'audio',
      isAccessory: true,
    },
    {
      name: '10000mAh Power Bank',
      brand: 'Mi',
      priceInr: 1499,
      imageUrl: ACC_IMG,
      category: 'Charger',
      subcategory: 'power',
      isAccessory: true,
    },
    {
      name: 'Smart Band 8',
      brand: 'Xiaomi',
      priceInr: 2799,
      imageUrl: ACC_IMG_2,
      category: 'Other',
      subcategory: 'wearables',
      isAccessory: true,
    },
  ];
}
