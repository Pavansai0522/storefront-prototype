/**
 * Display labels for catalog `category` values — keep values in sync with admin `LIQUOR_CATEGORIES`.
 */
export const LIQUOR_CATEGORY_LABELS: Record<string, string> = {
  All: 'All',
  Whisky: 'Whisky & Bourbon',
  Scotch: 'Scotch',
  'Rare Bottles': 'Rare Bottles',
  Wine: 'Wine & Champagne',
  Vodka: 'Vodka & Gin',
  Beer: 'Beer & Craft',
  Tequila: 'Tequila & Mezcal',
  Rum: 'Rum & Brandy',
  Other: 'Other Spirits',
};

export function liquorCategoryLabel(value: string): string {
  return LIQUOR_CATEGORY_LABELS[value] ?? value;
}
