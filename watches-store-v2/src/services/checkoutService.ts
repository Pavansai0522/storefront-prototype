import type {
  CheckoutCustomer,
  CreateRazorpayOrderResponse,
  PaymentStatusResponse,
  VerifyRazorpayPaymentResponse,
} from '../types/cart.types';
import type { ID } from '../types/utils.types';

type CreateOrderPayload = {
  clientId: ID;
  deliveryInr: number;
  items: { productId: ID; qty: number }[];
  customer: CheckoutCustomer;
};

type VerifyPaymentPayload = {
  orderId: ID;
  razorpayOrderId: ID;
  razorpayPaymentId: ID;
  razorpaySignature: string;
};

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : 'Request failed');
  }
  return data;
}

export async function createRazorpayOrder(
  payload: CreateOrderPayload,
): Promise<CreateRazorpayOrderResponse> {
  return postJson<CreateRazorpayOrderResponse>('/api/create-razorpay-order', payload);
}

export async function verifyRazorpayPayment(
  payload: VerifyPaymentPayload,
): Promise<VerifyRazorpayPaymentResponse> {
  return postJson<VerifyRazorpayPaymentResponse>('/api/verify-razorpay-payment', payload);
}

export async function fetchPaymentStatus(): Promise<PaymentStatusResponse> {
  const res = await fetch('/api/payment-status');
  const data = (await res.json()) as PaymentStatusResponse & { error?: string };
  if (!res.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : 'Could not load payment status');
  }
  return data;
}

export function paymentsEnabled(): boolean {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;
  return Boolean(keyId && keyId.trim().length > 0);
}
