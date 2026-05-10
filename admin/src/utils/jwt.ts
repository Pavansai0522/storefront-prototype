export type JwtRole = 'superadmin' | 'admin';

export type JwtPayload = {
  role: JwtRole;
  email?: string;
  clientId?: string;
  iat?: number;
  /** When true, store admin must change password before using the panel. */
  firstLogin?: boolean;
};

const STORAGE_KEY = 'admin_jwt';

export function getStoredToken(): string | null {
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

export function decodeJwtPayload(token: string): JwtPayload | null {
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

export function getJwtPayloadFromStorage(): JwtPayload | null {
  const token = getStoredToken();
  if (!token) {
    return null;
  }
  return decodeJwtPayload(token);
}
