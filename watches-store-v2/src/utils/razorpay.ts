import type { CheckoutCustomer } from '../types/cart.types';
import type { ID } from '../types/utils.types';

type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme?: { color: string };
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: string, handler: () => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const SCRIPT_ID = 'razorpay-checkout-js';
const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

let scriptPromise: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Razorpay is only available in the browser'));
  }
  if (window.Razorpay) {
    return Promise.resolve();
  }
  if (scriptPromise) {
    return scriptPromise;
  }
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay')), {
        once: true,
      });
      return;
    }
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
  return scriptPromise;
}

type OpenCheckoutInput = {
  keyId: string;
  amountPaise: number;
  currency: string;
  orderId: ID;
  razorpayOrderId: ID;
  storeName: string;
  customer: CheckoutCustomer;
  onSuccess: (response: RazorpayHandlerResponse) => void;
  onDismiss?: () => void;
};

export async function openRazorpayCheckout(input: OpenCheckoutInput): Promise<void> {
  await loadRazorpayScript();
  if (!window.Razorpay) {
    throw new Error('Razorpay failed to initialize');
  }
  const instance = new window.Razorpay({
    key: input.keyId,
    amount: input.amountPaise,
    currency: input.currency,
    name: input.storeName,
    description: 'Store order',
    order_id: input.razorpayOrderId,
    prefill: {
      name: input.customer.name,
      email: input.customer.email,
      contact: input.customer.phone,
    },
    notes: {
      order_id: input.orderId,
    },
    theme: { color: '#BC2422' },
    handler: input.onSuccess,
    modal: {
      ondismiss: input.onDismiss,
    },
  });
  instance.open();
}

export type { RazorpayHandlerResponse };
