import { isWatchesAccessorySubcategory } from '../constants/categories';
import { isLiquorStoreTemplate, isRestaurantStoreTemplate, isWatchesStoreTemplate } from '../constants/templates';
import type { Product } from '../types';
import { productCategoryKey } from '../types/product.types';

export function supportsAccessoriesCatalog(template: string | null | undefined): boolean {
  return (
    !isLiquorStoreTemplate(template) &&
    !isRestaurantStoreTemplate(template)
  );
}

/** Whether a SKU belongs in the accessories catalog for this store template. */
export function isCatalogAccessory(
  product: Product,
  template: string | null | undefined,
): boolean {
  if (isLiquorStoreTemplate(template)) {
    return false;
  }
  if (isWatchesStoreTemplate(template)) {
    return isWatchesAccessorySubcategory(productCategoryKey(product));
  }
  return product.isAccessory;
}

export function allCatalogItems(products: Product[], accessories: Product[]): Product[] {
  const byId = new Map<string, Product>();
  for (const item of products) {
    byId.set(item.id, item);
  }
  for (const item of accessories) {
    byId.set(item.id, item);
  }
  return [...byId.values()];
}

export function catalogItemsForClient(
  products: Product[],
  accessories: Product[],
  clientId: string,
): Product[] {
  return allCatalogItems(products, accessories).filter((item) => item.clientId === clientId);
}

export function countAccessoriesForClient(
  products: Product[],
  accessories: Product[],
  clientId: string,
  template: string | null | undefined,
): number {
  if (!supportsAccessoriesCatalog(template)) {
    return 0;
  }
  return catalogItemsForClient(products, accessories, clientId).filter((item) =>
    isCatalogAccessory(item, template),
  ).length;
}

export function countProductsForClient(
  products: Product[],
  accessories: Product[],
  clientId: string,
  template: string | null | undefined,
): number {
  return catalogItemsForClient(products, accessories, clientId).filter(
    (item) => !isCatalogAccessory(item, template),
  ).length;
}
