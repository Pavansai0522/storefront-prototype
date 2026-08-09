import React from 'react';

type DietBadgeProps = {
  isVeg: boolean;
};

/** Standard Indian menu diet marker (veg / non-veg). */
export function DietBadge({ isVeg }: DietBadgeProps): JSX.Element {
  const label = isVeg ? 'Vegetarian' : 'Non-vegetarian';

  return (
    <span
      className={`mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center border ${
        isVeg ? 'border-green-600 bg-green-600' : 'border-red-700 bg-red-700'
      }`}
      title={label}
      aria-label={label}
    >
      <span
        className={`h-2 w-2 rounded-full ${isVeg ? 'bg-green-200' : 'bg-red-200'}`}
        aria-hidden
      />
    </span>
  );
}

/** Paneer / pure veg dishes and most beverages without meat in the name. */
export function isVegetarianDish(name: string, category: string): boolean {
  const lower = name.toLowerCase();
  if (lower.includes('paneer') || lower.includes('veg ') || lower.startsWith('veg ')) {
    return true;
  }
  if (category === 'Beverages') {
    return !/\b(chicken|mutton|prawn|fish|egg|meat)\b/i.test(name);
  }
  return false;
}
