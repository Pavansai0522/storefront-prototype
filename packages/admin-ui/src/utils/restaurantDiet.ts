import type { Nullable, RestaurantDietType } from '../types';

export function inferRestaurantDietType(name: string, category: string): RestaurantDietType {
  const lower = name.toLowerCase();
  if (lower.includes('paneer') || lower.includes('veg ') || lower.startsWith('veg ')) {
    return 'veg';
  }
  if (category === 'Beverages') {
    return /\b(chicken|mutton|prawn|fish|egg|meat)\b/i.test(name) ? 'non-veg' : 'veg';
  }
  return 'non-veg';
}

export function resolveRestaurantDietType(
  name: string,
  category: string,
  stored: Nullable<RestaurantDietType> | undefined,
): RestaurantDietType {
  if (stored === 'veg' || stored === 'non-veg') {
    return stored;
  }
  return inferRestaurantDietType(name, category);
}

export function restaurantDietLabel(dietType: RestaurantDietType): string {
  return dietType === 'veg' ? 'Veg' : 'Non-veg';
}
