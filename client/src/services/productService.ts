import { API_ENDPOINTS } from '../constants';
import type { Accessory, Phone } from '../types';
import { apiFetch } from './api';

export const productService = {
  fetchPhonesFromApi: (): Promise<Phone[]> => apiFetch<Phone[]>(API_ENDPOINTS.PRODUCTS),

  fetchAccessoriesFromApi: (): Promise<Accessory[]> =>
    apiFetch<Accessory[]>(API_ENDPOINTS.ACCESSORIES),
};
