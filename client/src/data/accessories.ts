import type { Accessory, AccessoryCategoryId } from '../types';

export type { Accessory, AccessoryCategoryId };

/** @deprecated Use `Accessory` from `../types` */
export type AccessoryProduct = Accessory;

export interface AccessoryCategoryMeta {
  id: AccessoryCategoryId;
  title: string;
  description: string;
  priceFromLabel: string;
}

export const ACCESSORY_CATEGORIES: AccessoryCategoryMeta[] = [
  {
    id: 'audio',
    title: 'Audio & buds',
    description:
      'TWS, neckbands, and studio cans — tap a category to browse with filters.',
    priceFromLabel: '₹899',
  },
  {
    id: 'cables',
    title: 'Cables & hubs',
    description: 'Fast charge Type‑C, braided cables, and travel adapters.',
    priceFromLabel: '₹299',
  },
  {
    id: 'wearables',
    title: 'Wearables',
    description: 'Smartwatches and bands that pair perfectly with new phones.',
    priceFromLabel: '₹1,999',
  },
  {
    id: 'power',
    title: 'Power & protection',
    description: 'Power banks, wireless pads, tempered glass, and rugged cases.',
    priceFromLabel: '₹499',
  },
];

export function isAccessoryCategoryId(value: string): value is AccessoryCategoryId {
  return (
    value === 'audio' ||
    value === 'cables' ||
    value === 'wearables' ||
    value === 'power'
  );
}

export function getAccessoryCategoryMeta(
  id: AccessoryCategoryId,
): AccessoryCategoryMeta | undefined {
  return ACCESSORY_CATEGORIES.find((c) => c.id === id);
}

export const ACCESSORY_PRICE_RANGES: { label: string; min: number; max: number }[] = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,500', min: 500, max: 1500 },
  { label: '₹1,500 – ₹3,500', min: 1500, max: 3500 },
  { label: '₹3,500 – ₹8,000', min: 3500, max: 8000 },
  { label: 'Above ₹8,000', min: 8000, max: Infinity },
];
