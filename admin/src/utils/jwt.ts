import type { ID, JwtPayload, Nullable, UserRole } from '../types';

export type JwtRole = UserRole;

const STORAGE_KEY = 'admin_jwt';

export const ORIGINAL_ADMIN_JWT_KEY = 'original_admin_jwt';

export function getStoredToken(): Nullable<string> {
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function createMockJwt(payload: JwtPayload): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.mock-signature`;
}

export function decodeJwtPayload(token: string): Nullable<JwtPayload> {
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }
    const json = atob(parts[1]);
    const parsed = JSON.parse(json) as JwtPayload;
    if (parsed.role !== 'superadmin' && parsed.role !== 'admin') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function getJwtPayloadFromStorage(): Nullable<JwtPayload> {
  const token = getStoredToken();
  if (!token) {
    return null;
  }
  return decodeJwtPayload(token);
}

export function startImpersonation(clientId: ID, storeName: string): void {
  const original = getStoredToken();
  if (original == null) {
    return;
  }
  localStorage.setItem(ORIGINAL_ADMIN_JWT_KEY, original);
  const slug = storeName.toLowerCase().replace(/\s+/g, '');
  const fakeToken = createMockJwt({
    role: 'admin',
    clientId,
    email: `owner@${slug}.com`,
    isImpersonating: true,
    storeName,
    iat: Date.now(),
  });
  setStoredToken(fakeToken);
}

export function stopImpersonation(): void {
  const original = localStorage.getItem(ORIGINAL_ADMIN_JWT_KEY);
  if (original != null) {
    setStoredToken(original);
  }
  localStorage.removeItem(ORIGINAL_ADMIN_JWT_KEY);
}

export function isImpersonating(): boolean {
  const payload = getJwtPayloadFromStorage();
  return payload?.isImpersonating === true;
}
