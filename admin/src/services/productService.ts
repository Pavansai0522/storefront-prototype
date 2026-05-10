import { API_ENDPOINTS } from '../constants';
import type { ID, Product } from '../types';
import { apiFetch } from './api';

export const productService = {
  getAll: (clientId?: ID) =>
    apiFetch<Product[]>(`${API_ENDPOINTS.PRODUCTS}${clientId ? `?clientId=${clientId}` : ''}`),

  create: (data: Omit<Product, 'id'>) =>
    apiFetch<Product>(API_ENDPOINTS.PRODUCTS, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: ID, data: Partial<Product>) =>
    apiFetch<Product>(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: ID) =>
    apiFetch<void>(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'DELETE',
    }),
};
