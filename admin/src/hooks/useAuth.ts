import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { JwtPayload, Nullable } from '../types';
import {
  clearStoredToken,
  createMockJwt,
  decodeJwtPayload,
  getJwtPayloadFromStorage,
  getStoredToken,
  ORIGINAL_ADMIN_JWT_KEY,
  setStoredToken,
} from '../utils/jwt';

async function mockLoginRequest(email: string, password: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 450));
  if (!email.trim() || !password) {
    throw new Error('Email and password are required.');
  }
  const normalized = email.trim().toLowerCase();
  const isSuperadmin = normalized.startsWith('superadmin') || normalized === 'super@agency.com';
  const payload: JwtPayload = isSuperadmin
    ? { role: 'superadmin', email: email.trim(), iat: Date.now() }
    : {
        role: 'admin',
        clientId: 'client-1',
        email: email.trim(),
        iat: Date.now(),
        firstLogin: normalized.includes('firstlogin'),
      };
  return createMockJwt(payload);
}

export type UseAuthResult = {
  payload: Nullable<JwtPayload>;
  isLoggedIn: boolean;
  isSuperadmin: boolean;
  isAdmin: boolean;
  isImpersonating: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export function useAuth(): UseAuthResult {
  const navigate = useNavigate();

  const token = getStoredToken();
  const payload = getJwtPayloadFromStorage();

  const isLoggedIn = Boolean(token && payload);
  const isSuperadmin = payload?.role === 'superadmin';
  const isAdmin = payload?.role === 'admin';
  const isImpersonating = payload?.isImpersonating === true;

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const newToken = await mockLoginRequest(email, password);
      setStoredToken(newToken);
      const decoded = decodeJwtPayload(newToken);
      if (decoded?.role === 'admin' && decoded.firstLogin === true) {
        navigate('/change-password', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    },
    [navigate],
  );

  const logout = useCallback((): void => {
    localStorage.removeItem(ORIGINAL_ADMIN_JWT_KEY);
    clearStoredToken();
    navigate('/', { replace: true });
  }, [navigate]);

  return {
    payload,
    isLoggedIn,
    isSuperadmin,
    isAdmin,
    isImpersonating,
    login,
    logout,
  };
}
