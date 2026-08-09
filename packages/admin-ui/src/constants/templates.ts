export const TEMPLATES = [
  { value: 'mobile-store-v1', label: 'Mobile Store V1' },
  { value: 'mobile-store-v2', label: 'Mobile Store V2' },
  { value: 'liquor-store-v1', label: 'Liquor Store V1' },
  { value: 'watches-store-v2', label: 'PR Watches & Mobiles (v2)' },
  { value: 'salon-v1', label: 'Salon V1' },
  { value: 'restaurant-v1', label: 'Restaurant V1' },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]['value'];

export function isMobileStoreTemplate(template: string | undefined | null): boolean {
  return Boolean(template && template.startsWith('mobile-store'));
}

export function isLiquorStoreTemplate(template: string | undefined | null): boolean {
  return Boolean(template && template.startsWith('liquor-store'));
}

export function isWatchesStoreTemplate(template: string | undefined | null): boolean {
  return template === 'watches-store-v2';
}

export function isRestaurantStoreTemplate(template: string | undefined | null): boolean {
  return template === 'restaurant-v1';
}
