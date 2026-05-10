export const TEMPLATES = [
  { value: 'mobile-store-v1', label: 'Mobile Store V1' },
  { value: 'mobile-store-v2', label: 'Mobile Store V2' },
  { value: 'salon-v1', label: 'Salon V1' },
  { value: 'restaurant-v1', label: 'Restaurant V1' },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]['value'];
