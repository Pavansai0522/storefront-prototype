import { API_ENDPOINTS } from '../constants';
import { apiFetch } from './api';

export const authService = {
  login: (email: string, password: string) =>
    apiFetch<{ token: string; user: { role: string; clientId?: string } }>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};
