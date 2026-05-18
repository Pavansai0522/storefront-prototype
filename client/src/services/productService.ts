import { API_ENDPOINTS } from '../constants';
import type { Accessory, Phone } from '../types';
import { ACCESSORY_ITEMS } from '../data/accessories';
import { PHONES } from '../data/phones';
import { apiFetch } from './api';

export const productService = {
  /** Local catalog fallback; swap to `apiFetch` when API is wired. */
  getAllPhones: (): Promise<Phone[]> => Promise.resolve(PHONES),

  getAllAccessories: (): Promise<Accessory[]> => Promise.resolve(ACCESSORY_ITEMS),

  getAll: async (): Promise<{ phones: Phone[]; accessories: Accessory[] }> => {
    const [phones, accessories] = await Promise.all([
      productService.getAllPhones(),
      productService.getAllAccessories(),
    ]);
    return { phones, accessories };
  },

  fetchPhonesFromApi: () => apiFetch<Phone[]>(API_ENDPOINTS.PRODUCTS),

  fetchAccessoriesFromApi: () => apiFetch<Accessory[]>(API_ENDPOINTS.ACCESSORIES),
};
