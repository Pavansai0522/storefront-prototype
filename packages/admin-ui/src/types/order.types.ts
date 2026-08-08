import type { ID, ISODateString } from './utils.types';

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export type OrderLineItem = {
  id: ID;
  productId: ID;
  name: string;
  brand: string;
  unitPriceInr: number;
  qty: number;
};

export type Order = {
  id: ID;
  clientId: ID;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine: string;
  landmark: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  notes: string;
  subtotalInr: number;
  deliveryInr: number;
  totalInr: number;
  status: OrderStatus;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: ISODateString;
  items: OrderLineItem[];
};
