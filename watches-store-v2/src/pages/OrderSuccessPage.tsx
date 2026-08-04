import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { btnShop } from '../constants/buttonStyles';

export function OrderSuccessPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="bg-brand-bg pb-16 pt-28 md:pb-24 md:pt-32">
      <div className="storefront-shell max-w-2xl text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-[#128C7E]" aria-hidden />
        <h1 className="mb-3 font-bebas text-4xl tracking-wide text-black md:text-5xl">
          Order placed successfully
        </h1>
        <p className="mb-2 text-brand-text">
          Thank you for your purchase. We&apos;ll contact you shortly about delivery.
        </p>
        {orderId ? (
          <p className="mb-8 text-sm text-brand-muted">
            Order ID: <span className="font-mono text-brand-text">{orderId}</span>
          </p>
        ) : (
          <p className="mb-8 text-sm text-brand-muted">Your payment was received.</p>
        )}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/" className={btnShop}>
            Continue shopping
          </Link>
          <Link
            to="/watches"
            className="text-sm font-semibold text-brand-purple hover:underline"
          >
            Browse watches
          </Link>
        </div>
      </div>
    </div>
  );
}
