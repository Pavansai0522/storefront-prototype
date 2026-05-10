import { API_ENDPOINTS } from '../constants';
import type { Client, ID } from '../types';
import { apiFetch } from './api';

export const clientService = {
  getAll: () => apiFetch<Client[]>(API_ENDPOINTS.CLIENTS),

  getById: (id: ID) => apiFetch<Client>(`${API_ENDPOINTS.CLIENTS}/${id}`),

  create: (data: Partial<Client>) =>
    apiFetch<Client>(API_ENDPOINTS.CLIENTS, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: ID, data: Partial<Client>) =>
    apiFetch<Client>(`${API_ENDPOINTS.CLIENTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: ID) =>
    apiFetch<void>(`${API_ENDPOINTS.CLIENTS}/${id}`, {
      method: 'DELETE',
    }),

  markPaid: (id: ID) =>
    apiFetch<Client>(`${API_ENDPOINTS.CLIENTS}/${id}/mark-paid`, {
      method: 'POST',
    }),
};
