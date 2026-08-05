import type { ID } from './utils.types';

export type CartLineItem = {
  productId: ID;
  name: string;
  brand: string;
  priceInr: number;
  priceLabel: string;
  image: string;
  qty: number;
};

export type CheckoutCustomer = {
  name: string;
  email: string;
  phone: string;
  addressLine: string;
  landmark: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  notes: string;
};

export type CreateRazorpayOrderResponse = {
  orderId: ID;
  razorpayOrderId: ID;
  amount: number;
  currency: string;
  keyId: string;
};

export type VerifyRazorpayPaymentResponse = {
  orderId: ID;
  status: 'paid';
};

export type PaymentStatusResponse = {
  configured: boolean;
  keyId: string | null;
};
