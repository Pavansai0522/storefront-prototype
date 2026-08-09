/**
 * Display order and copy for menu sections — keep in sync with admin categories.
 */
export const MENU_CATEGORY_ORDER: readonly string[] = [
  'Starters',
  'Tandoor',
  'Biryani',
  'Curries',
  'Thali',
  'Beverages',
  'Other',
] as const;

export const RESTAURANT_CATEGORY_LABELS: Record<string, string> = {
  All: 'All',
  Starters: 'Starters & Appetizers',
  Biryani: 'Biryani & Rice',
  Curries: 'Curries & Gravies',
  Tandoor: 'Tandoor & Grill',
  Thali: 'Thali & Family Combos',
  Beverages: 'Beverages',
  Other: 'Chef\'s Specials',
};

export const MENU_SECTION_BLURB: Record<string, string> = {
  Starters: 'Crisp, spicy beginnings from our tawa and fryer.',
  Tandoor: 'Charcoal-kissed classics from the clay oven.',
  Biryani: 'Dum-style rice — fragrant, slow-cooked, generous.',
  Curries: 'Bold Andhra gravies and homestyle masalas.',
  Thali: 'Share a full spread with family and friends.',
  Beverages: 'Coolers and refreshments.',
  Other: 'Seasonal favourites from the kitchen.',
};

export function restaurantCategoryLabel(value: string): string {
  return RESTAURANT_CATEGORY_LABELS[value] ?? value;
}

export function menuSectionId(category: string): string {
  return `menu-${category.toLowerCase().replace(/\s+/g, '-')}`;
}

export function sortMenuCategories(categories: string[]): string[] {
  const order = new Map(MENU_CATEGORY_ORDER.map((cat, index) => [cat, index]));
  return [...categories].sort((a, b) => {
    const ai = order.get(a) ?? 99;
    const bi = order.get(b) ?? 99;
    if (ai !== bi) {
      return ai - bi;
    }
    return a.localeCompare(b);
  });
}
