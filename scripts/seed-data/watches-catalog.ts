import type { ProductSeedItem } from './types';

const WATCH =
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop';
const WATCH_2 =
  'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400&h=400&fit=crop';
const TOY =
  'https://images.unsplash.com/photo-1558060370-d644ea0e23dd?w=400&h=400&fit=crop';
const GADGET =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
const CABLE =
  'https://images.unsplash.com/photo-1583863785174-4f6a2c0c0b0b?w=400&h=400&fit=crop';

type WatchesSubcategory =
  | 'smart-watches'
  | 'dial-watches'
  | 'kids-watches'
  | 'mobiles'
  | 'rc-toys'
  | 'soft-toys'
  | 'education-toys'
  | 'cables'
  | 'headphones'
  | 'phone-accessories'
  | 'gadgets';

function watchItem(
  subcategory: WatchesSubcategory,
  name: string,
  brand: string,
  priceInr: number,
  imageUrl: string,
  featured?: { group: 'watch' | 'toy' | 'accessory'; sort: number },
): ProductSeedItem {
  return {
    name,
    brand,
    priceInr,
    imageUrl,
    category: subcategory,
    subcategory,
    isAccessory: false,
    featuredGroup: featured?.group ?? null,
    featuredSort: featured?.sort ?? null,
  };
}

/** Sample catalog for watches-store-v2 — one row per subcategory page. */
export function watchesCatalogItems(): ProductSeedItem[] {
  return [
    watchItem('smart-watches', 'Galaxy Watch 6', 'Samsung', 24999, WATCH, {
      group: 'watch',
      sort: 0,
    }),
    watchItem('smart-watches', 'Apple Watch SE', 'Apple', 29900, WATCH_2),
    watchItem('smart-watches', 'Noise ColorFit Pro 5', 'Noise', 4999, WATCH),
    watchItem('dial-watches', 'Titan Octane', 'Titan', 8999, WATCH_2, { group: 'watch', sort: 1 }),
    watchItem('dial-watches', 'Fastrack Reflex', 'Fastrack', 3499, WATCH),
    watchItem('dial-watches', 'Casio Enticer', 'Casio', 5999, WATCH_2),
    watchItem('kids-watches', 'Zoop Disney', 'Zoop', 1299, WATCH),
    watchItem('kids-watches', 'Timex Kids Digital', 'Timex', 1999, WATCH_2),
    watchItem('mobiles', 'Redmi Note 13', 'Xiaomi', 14999, WATCH_2),
    watchItem('mobiles', 'Samsung Galaxy M14', 'Samsung', 13499, WATCH),
    watchItem('mobiles', 'iPhone 13', 'Apple', 49900, WATCH_2),
    watchItem('rc-toys', 'Remote Control Car', 'Hot Wheels', 2499, TOY, { group: 'toy', sort: 0 }),
    watchItem('rc-toys', 'RC Drone Mini', 'Sky Rider', 3999, TOY),
    watchItem('rc-toys', 'RC Monster Truck', 'Maisto', 3499, TOY, { group: 'toy', sort: 1 }),
    watchItem('soft-toys', 'Teddy Bear Large', 'Softoys', 899, TOY),
    watchItem('soft-toys', 'Unicorn Plush', 'Cuddles', 699, TOY),
    watchItem('education-toys', 'STEM Robotics Kit', 'SmartKids', 1999, TOY),
    watchItem('education-toys', 'Alphabet Learning Pad', 'LeapStart', 1499, TOY),
    watchItem('cables', 'USB-C to Lightning 1m', 'Anker', 499, CABLE, {
      group: 'accessory',
      sort: 0,
    }),
    watchItem('cables', 'Braided Type-C Cable 2m', 'boAt', 399, CABLE),
    watchItem('headphones', 'AirPods Pro Style TWS', 'boAt', 2999, GADGET, {
      group: 'accessory',
      sort: 1,
    }),
    watchItem('headphones', 'Over-Ear Wireless', 'Sony', 4999, GADGET),
    watchItem('phone-accessories', 'Tempered Glass Pack', 'Spigen', 299, GADGET),
    watchItem('phone-accessories', 'Silicone Back Cover', 'Ringke', 599, GADGET),
    watchItem('gadgets', 'Mini Bluetooth Speaker', 'JBL', 2499, GADGET, {
      group: 'accessory',
      sort: 2,
    }),
    watchItem('gadgets', 'Power Bank 20000mAh', 'Mi', 1999, GADGET),
  ];
}
