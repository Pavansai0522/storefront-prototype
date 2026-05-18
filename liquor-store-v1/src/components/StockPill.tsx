import React from 'react';

type StockPillProps = {
  inStock: boolean;
};

export function StockPill({ inStock }: StockPillProps): JSX.Element {
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide sm:text-xs ${
        inStock
          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
          : 'border-red-500/40 bg-red-500/15 text-red-300'
      }`}
      aria-label={inStock ? 'In stock' : 'Out of stock'}
    >
      {inStock ? 'In stock' : 'Out of stock'}
    </span>
  );
}
