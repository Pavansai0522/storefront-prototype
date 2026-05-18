export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE}/api/products`,
  ACCESSORIES: `${API_BASE}/api/accessories`,
  STORE: `${API_BASE}/api/store`,
} as const;
