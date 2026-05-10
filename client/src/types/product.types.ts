export interface Phone {
  id: number;
  brand: string;
  name: string;
  price: string;
  priceValue: number;
  emi: string;
  img: string;
}

export type AccessoryCategoryId = 'audio' | 'cables' | 'wearables' | 'power';

export interface Accessory {
  id: number;
  itemCode: string;
  categoryId: AccessoryCategoryId;
  name: string;
  detail: string;
  priceDisplay: string;
  priceValue: number;
  tags: string[];
  img: string;
}
