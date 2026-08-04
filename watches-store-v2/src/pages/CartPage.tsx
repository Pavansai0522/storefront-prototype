import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { clientConfig } from '../config/client-config';
import { btnShop } from '../constants/buttonStyles';
import { formatInr } from '../utils/formatCurrency';
import { optimizeImageUrl } from '../utils/optimizeImageUrl';

export function CartPage(): JSX.Element {
  const { items, subtotalInr, setQty, removeItem } = useCart();
  const deliveryInr = clientConfig.checkout.deliveryChargeInr;
  const grandTotal = subtotalInr + (items.length > 0 ? deliveryInr : 0);

  if (items.length === 0) {
    return (
      <div className="bg-brand-bg pb-16 pt-28 md:pb-24 md:pt-32">
        <div className="storefront-shell max-w-3xl text-center">
          <h1 className="mb-4 font-bebas text-4xl tracking-wide text-black md:text-5xl">Your cart</h1>
          <p className="mb-8 text-brand-text">Your cart is empty. Browse our catalog and add items to checkout.</p>
          <Link to="/watches" className={btnShop}>
            Shop watches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg pb-16 pt-28 md:pb-24 md:pt-32">
      <div className="storefront-shell">
        <h1 className="mb-8 font-bebas text-4xl tracking-wide text-black md:text-5xl">Your cart</h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex gap-4 rounded-2xl border border-brand-border bg-brand-card p-4 sm:gap-6 sm:p-5"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-surface sm:h-28 sm:w-28">
                  {item.image ? (
                    <img
                      src={optimizeImageUrl(item.image, 200)}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full bg-brand-bg/40" aria-hidden />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-muted">{item.brand}</p>
                  <h2 className="mb-2 text-lg font-semibold text-brand-text">{item.name}</h2>
                  <p className="font-bebas text-2xl text-brand-purple">{item.priceLabel}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-lg border border-brand-border">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(item.productId, item.qty - 1)}
                        className="flex h-10 w-10 items-center justify-center text-brand-text hover:text-brand-purple"
                      >
                        <Minus className="h-4 w-4" aria-hidden />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-semibold">{item.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQty(item.productId, item.qty + 1)}
                        className="flex h-10 w-10 items-center justify-center text-brand-text hover:text-brand-purple"
                      >
                        <Plus className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-brand-muted hover:text-brand-purple"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      Remove
                    </button>
                  </div>
                </div>
                <p className="shrink-0 font-bebas text-xl text-brand-text">
                  {formatInr(item.priceInr * item.qty)}
                </p>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-brand-border bg-brand-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-brand-text">Summary</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-brand-muted">Subtotal</dt>
                <dd className="font-semibold text-brand-text">{formatInr(subtotalInr)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-muted">Delivery charge</dt>
                <dd className="font-semibold text-brand-text">{formatInr(deliveryInr)}</dd>
              </div>
              <div className="border-t border-brand-border pt-3 flex justify-between text-base">
                <dt className="font-semibold text-brand-text">Grand total</dt>
                <dd className="font-bebas text-2xl text-brand-purple">{formatInr(grandTotal)}</dd>
              </div>
            </dl>
            <Link to="/checkout" className={`${btnShop} mt-6 w-full`}>
              Proceed to checkout
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
