import type { Accessory, AccessoryCategoryId, Phone } from '../types';
import type { DbProduct } from './supabaseTypes';

const ACCESSORY_CATEGORY_IDS: readonly AccessoryCategoryId[] = [
  'audio',
  'cables',
  'wearables',
  'power',
];

function isAccessoryCategoryId(value: string): value is AccessoryCategoryId {
  return (ACCESSORY_CATEGORY_IDS as readonly string[]).includes(value);
}

function parseAccessoryCategoryId(row: DbProduct): AccessoryCategoryId {
  if (row.subcategory && isAccessoryCategoryId(row.subcategory)) {
    return row.subcategory;
  }
  const cat = row.category.toLowerCase();
  if (cat.includes('ear') || cat.includes('audio')) {
    return 'audio';
  }
  if (cat.includes('cable')) {
    return 'cables';
  }
  if (cat.includes('wear') || cat.includes('watch') || cat.includes('band')) {
    return 'wearables';
  }
  return 'power';
}

function formatInr(value: number): string {
  return value.toLocaleString('en-IN');
}

export function mapDbProductToPhone(row: DbProduct): Phone {
  const emi = row.emi_price_inr ?? Math.max(1, Math.round(row.price_inr / 12));
  return {
    id: row.id,
    brand: row.brand,
    name: row.name,
    price: formatInr(row.price_inr),
    priceValue: row.price_inr,
    emi: formatInr(emi),
    img: row.image_url ?? '',
  };
}

export function mapDbProductToAccessory(row: DbProduct): Accessory {
  const categoryId = parseAccessoryCategoryId(row);
  return {
    id: row.id,
    itemCode: row.brand,
    categoryId,
    name: row.name,
    detail: row.name,
    priceDisplay: `₹${formatInr(row.price_inr)}`,
    priceValue: row.price_inr,
    tags: [],
    img: row.image_url ?? '',
  };
}
