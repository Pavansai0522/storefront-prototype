import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CreditCard, MapPin, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStoreConfig } from '../context/StoreDataContext';
import { clientConfig, whatsappHref } from '../config/client-config';
import { btnShop } from '../constants/buttonStyles';
import { createRazorpayOrder, fetchPaymentStatus, paymentsEnabled, verifyRazorpayPayment } from '../services/checkoutService';
import type { CheckoutCustomer } from '../types/cart.types';
import { formatInr } from '../utils/formatCurrency';
import { openRazorpayCheckout } from '../utils/razorpay';

const emptyCustomer = (): CheckoutCustomer => ({
  name: '',
  email: '',
  phone: '',
  addressLine: '',
  landmark: '',
  postalCode: '',
  city: '',
  state: '',
  country: 'India',
  notes: '',
});

export function CheckoutPage(): JSX.Element {
  const navigate = useNavigate();
  const { items, subtotalInr, clearCart } = useCart();
  const storeConfig = useStoreConfig();
  const deliveryInr = clientConfig.checkout.deliveryChargeInr;
  const grandTotal = subtotalInr + deliveryInr;
  const [customer, setCustomer] = useState<CheckoutCustomer>(emptyCustomer);
  const [paying, setPaying] = useState(false);
  const [canPayOnline, setCanPayOnline] = useState(false);
  const [paymentsReady, setPaymentsReady] = useState(false);

  useEffect(() => {
    void fetchPaymentStatus()
      .then((status) => setCanPayOnline(status.configured))
      .catch(() => setCanPayOnline(paymentsEnabled()))
      .finally(() => setPaymentsReady(true));
  }, []);

  if (items.length === 0) {
    return (
      <div className="bg-brand-bg pb-16 pt-28 md:pb-24 md:pt-32">
        <div className="storefront-shell max-w-3xl text-center">
          <p className="mb-6 text-brand-text">Your cart is empty.</p>
          <Link to="/cart" className={btnShop}>
            Back to cart
          </Link>
        </div>
      </div>
    );
  }

  const updateField = (field: keyof CheckoutCustomer, value: string): void => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const validateCustomer = (): boolean => {
    if (!customer.name.trim()) {
      toast.error('Enter your name');
      return false;
    }
    if (customer.phone.replace(/\D/g, '').length < 10) {
      toast.error('Enter a valid mobile number');
      return false;
    }
    if (!customer.addressLine.trim() || !customer.postalCode.trim() || !customer.city.trim() || !customer.state.trim()) {
      toast.error('Complete your shipping address');
      return false;
    }
    return true;
  };

  const handlePay = async (): Promise<void> => {
    if (!validateCustomer()) {
      return;
    }
    if (!canPayOnline) {
      toast.error('Online payments are not configured yet');
      return;
    }

    setPaying(true);
    try {
      const created = await createRazorpayOrder({
        clientId: storeConfig.clientId,
        deliveryInr,
        items: items.map((item) => ({ productId: item.productId, qty: item.qty })),
        customer,
      });

      await openRazorpayCheckout({
        keyId: created.keyId,
        amountPaise: created.amount,
        currency: created.currency,
        orderId: created.orderId,
        razorpayOrderId: created.razorpayOrderId,
        storeName: storeConfig.brand.chatName,
        customer,
        onDismiss: () => setPaying(false),
        onSuccess: async (response) => {
          try {
            await verifyRazorpayPayment({
              orderId: created.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            clearCart();
            navigate(`/order-success?orderId=${encodeURIComponent(created.orderId)}`);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Payment verification failed');
          } finally {
            setPaying(false);
          }
        },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not start payment');
      setPaying(false);
    }
  };

  return (
    <div className="bg-brand-bg pb-16 pt-28 md:pb-24 md:pt-32">
      <div className="storefront-shell">
        <nav className="mb-6 text-sm text-brand-muted">
          <Link to="/" className="hover:text-brand-purple">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/cart" className="hover:text-brand-purple">
            Cart
          </Link>
          <span className="mx-2">/</span>
          <span className="text-brand-text">Checkout</span>
        </nav>

        <h1 className="mb-8 font-bebas text-4xl tracking-wide text-black md:text-5xl">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-brand-border bg-brand-card p-6">
              <div className="mb-5 flex items-center gap-2">
                <User className="h-5 w-5 text-brand-purple" aria-hidden />
                <h2 className="text-lg font-semibold text-brand-text">Personal information</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium text-brand-text">Name</span>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-brand-border bg-brand-bg px-3 py-2 text-brand-text outline-none focus:border-brand-purple"
                    autoComplete="name"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-brand-text">Email</span>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-brand-border bg-brand-bg px-3 py-2 text-brand-text outline-none focus:border-brand-purple"
                    autoComplete="email"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-brand-text">Mobile</span>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-brand-border bg-brand-bg px-3 py-2 text-brand-text outline-none focus:border-brand-purple"
                    autoComplete="tel"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-brand-border bg-brand-card p-6">
              <div className="mb-5 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-purple" aria-hidden />
                <h2 className="text-lg font-semibold text-brand-text">Shipping address</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium text-brand-text">Address</span>
                  <input
                    type="text"
                    value={customer.addressLine}
                    onChange={(e) => updateField('addressLine', e.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-brand-border bg-brand-bg px-3 py-2 text-brand-text outline-none focus:border-brand-purple"
                    autoComplete="street-address"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-brand-text">Landmark</span>
                  <input
                    type="text"
                    value={customer.landmark}
                    onChange={(e) => updateField('landmark', e.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-brand-border bg-brand-bg px-3 py-2 text-brand-text outline-none focus:border-brand-purple"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-brand-text">Postal code</span>
                  <input
                    type="text"
                    value={customer.postalCode}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-brand-border bg-brand-bg px-3 py-2 text-brand-text outline-none focus:border-brand-purple"
                    autoComplete="postal-code"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-brand-text">City</span>
                  <input
                    type="text"
                    value={customer.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="e.g. Chilakaluripet"
                    className="min-h-[44px] w-full rounded-xl border border-brand-border bg-brand-bg px-3 py-2 text-brand-text outline-none focus:border-brand-purple"
                    autoComplete="address-level2"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-brand-text">State</span>
                  <input
                    type="text"
                    value={customer.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    placeholder="e.g. Andhra Pradesh"
                    className="min-h-[44px] w-full rounded-xl border border-brand-border bg-brand-bg px-3 py-2 text-brand-text outline-none focus:border-brand-purple"
                    autoComplete="address-level1"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium text-brand-text">Country</span>
                  <input
                    type="text"
                    value={customer.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-brand-border bg-brand-bg px-3 py-2 text-brand-text outline-none focus:border-brand-purple"
                    autoComplete="country-name"
                  />
                </label>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-brand-border bg-brand-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-brand-text">Summary</h2>
              <ul className="mb-4 space-y-2 border-b border-brand-border pb-4 text-sm">
                {items.map((item) => (
                  <li key={`${item.productId}-${item.color ?? 'default'}`} className="flex justify-between gap-3">
                    <span className="text-brand-text">
                      {item.name}
                      {item.color ? ` (${item.color})` : ''} × {item.qty}
                    </span>
                    <span className="shrink-0 font-medium">{formatInr(item.priceInr * item.qty)}</span>
                  </li>
                ))}
              </ul>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-brand-muted">Subtotal</dt>
                  <dd>{formatInr(subtotalInr)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-brand-muted">Delivery charge</dt>
                  <dd>{formatInr(deliveryInr)}</dd>
                </div>
                <div className="flex justify-between border-t border-brand-border pt-3 text-base font-semibold">
                  <dt>Grand total</dt>
                  <dd className="font-bebas text-2xl text-brand-purple">{formatInr(grandTotal)}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-brand-border bg-brand-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-brand-text">Choose payment method</h2>
              <div className="mb-4 rounded-xl border border-brand-border bg-brand-bg px-4 py-3">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-brand-purple" aria-hidden />
                  <span className="text-sm font-medium text-brand-text">Credit or debit card / UPI</span>
                </div>
              </div>
              {!paymentsReady ? (
                <p className="mb-4 text-sm text-brand-muted">Checking payment options…</p>
              ) : !canPayOnline ? (
                <p className="mb-4 text-sm text-brand-muted">
                  Online payments coming soon — WhatsApp us to place your order.
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => void handlePay()}
                disabled={!paymentsReady || !canPayOnline || paying}
                className={`${btnShop} w-full disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {paying ? 'Processing…' : 'Proceed to Pay'}
              </button>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center text-sm font-medium text-brand-purple hover:underline"
              >
                Or order on WhatsApp
              </a>
            </section>

            <label className="block rounded-2xl border border-brand-border bg-brand-card p-6">
              <span className="mb-2 block text-sm font-medium text-brand-text">Order notes (optional)</span>
              <textarea
                value={customer.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-brand-border bg-brand-bg px-3 py-2 text-brand-text outline-none focus:border-brand-purple"
                placeholder="Any delivery instructions…"
              />
            </label>
          </aside>
        </div>
      </div>
    </div>
  );
}
