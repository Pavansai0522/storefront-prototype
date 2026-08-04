import React from 'react';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import type { ID } from '../types/utils.types';

type AddToCartButtonProps = {
  productId: ID;
  name: string;
  brand: string;
  priceInr: number;
  priceLabel: string;
  image: string;
  compact?: boolean;
};

export function AddToCartButton({
  productId,
  name,
  brand,
  priceInr,
  priceLabel,
  image,
  compact = false,
}: AddToCartButtonProps): JSX.Element {
  const { addItem } = useCart();

  const handleClick = (): void => {
    addItem({ productId, name, brand, priceInr, priceLabel, image });
    toast.success('Added to cart');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        compact
          ? 'inline-flex min-h-[42px] w-full items-center justify-center gap-1.5 rounded-lg border border-brand-purple/40 bg-brand-bg px-3 py-2.5 text-sm font-semibold text-brand-purple transition hover:border-brand-purple hover:bg-brand-purple/5'
          : 'inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-brand-purple/40 bg-brand-bg px-4 py-3 text-sm font-bold text-brand-purple transition hover:border-brand-purple hover:bg-brand-purple/5'
      }
    >
      <ShoppingCart className="h-4 w-4 shrink-0" aria-hidden />
      Add to cart
    </button>
  );
}
