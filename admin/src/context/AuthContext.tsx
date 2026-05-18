import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { isLocalDevMode } from '../lib/devMode';
import { isConfiguredSuperadminEmail, isMockSuperadminEmail } from '../lib/superadminEmail';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { DbProfile, ProfileRole } from '../lib/supabaseTypes';
import type { ID, JwtPayload, Nullable } from '../types';
import {
  clearStoredToken,
  createMockJwt,
  decodeJwtPayload,
  getJwtPayloadFromStorage,
  setStoredToken,
} from '../utils/jwt';

const IMPERSONATE_KEY = 'admin_impersonate_client_id';

export type AuthProfile = {
  id: string;
  email: string;
  role: ProfileRole;
  clientId: Nullable<ID>;
  mustChangePassword: boolean;
};

type AuthContextValue = {
  session: Nullable<Session>;
  profile: Nullable<AuthProfile>;
  effectiveClientId: Nullable<ID>;
  isLoggedIn: boolean;
  isSuperadmin: boolean;
  isAdmin: boolean;
  isImpersonating: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  startImpersonation: (clientId: ID) => void;
  stopImpersonation: () => void;
};

const AuthContext = createContext<Nullable<AuthContextValue>>(null);

function finalizeProfile(profile: AuthProfile): AuthProfile {
  if (profile.role === 'superadmin' || isConfiguredSuperadminEmail(profile.email)) {
    return {
      ...profile,
      role: 'superadmin',
      clientId: null,
    };
  }
  return profile;
}

function mapProfile(row: DbProfile): AuthProfile {
  return finalizeProfile({
    id: row.id,
    email: row.email,
    role: row.role,
    clientId: row.client_id,
    mustChangePassword: row.must_change_password,
  });
}

function mapJwtToProfile(payload: JwtPayload): AuthProfile {
  return finalizeProfile({
    id: payload.userId ?? `mock-${payload.role}`,
    email: payload.email ?? '',
    role: payload.role,
    clientId: payload.clientId ?? null,
    mustChangePassword: payload.firstLogin === true,
  });
}

function resolveMockClientId(email: string): ID {
  const normalized = email.trim().toLowerCase();
  if (normalized === 'owner@prwatches.example') {
    return 'client-watches-1';
  }
  return 'client-1';
}

async function mockLoginRequest(email: string, password: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 300));
  if (!email.trim() || !password) {
    throw new Error('Email and password are required.');
  }
  const normalized = email.trim().toLowerCase();
  const isSuperadmin = isMockSuperadminEmail(email);
  const payload: JwtPayload = isSuperadmin
    ? { role: 'superadmin', email: email.trim(), iat: Date.now() }
    : {
        role: 'admin',
        clientId: resolveMockClientId(email),
        email: email.trim(),
        iat: Date.now(),
        firstLogin: normalized.includes('firstlogin'),
      };
  return createMockJwt(payload);
}

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [session, setSession] = useState<Nullable<Session>>(null);
  const [profile, setProfile] = useState<Nullable<AuthProfile>>(null);
  const [loading, setLoading] = useState(true);
  const [impersonateClientId, setImpersonateClientId] = useState<Nullable<ID>>(() =>
    localStorage.getItem(IMPERSONATE_KEY),
  );

  const clearImpersonation = useCallback((): void => {
    localStorage.removeItem(IMPERSONATE_KEY);
    setImpersonateClientId(null);
  }, []);

  const loadProfile = useCallback(async (userId: string): Promise<void> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) {
      throw new Error(error.message);
    }
    setProfile(mapProfile(data as DbProfile));
  }, []);

  const loadMockProfileFromStorage = useCallback((): void => {
    const payload = getJwtPayloadFromStorage();
    if (!payload) {
      setProfile(null);
      return;
    }
    setProfile(mapJwtToProfile(payload));
  }, []);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (isLocalDevMode) {
      loadMockProfileFromStorage();
      return;
    }
    if (!session?.user.id) {
      return;
    }
    await loadProfile(session.user.id);
  }, [isLocalDevMode, loadMockProfileFromStorage, loadProfile, session?.user.id]);

  useEffect(() => {
    if (isLocalDevMode) {
      loadMockProfileFromStorage();
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return;
      }
      setSession(data.session);
      if (data.session?.user.id) {
        loadProfile(data.session.user.id)
          .catch(() => setProfile(null))
          .finally(() => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user.id) {
        loadProfile(nextSession.user.id).catch(() => setProfile(null));
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [isLocalDevMode, loadMockProfileFromStorage, loadProfile]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    clearImpersonation();
    clearStoredToken();

    if (isLocalDevMode) {
      const token = await mockLoginRequest(email, password);
      setStoredToken(token);
      const payload = decodeJwtPayload(token);
      if (payload) {
        setProfile(mapJwtToProfile(payload));
      }
      return;
    }
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured.');
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
  }, [clearImpersonation]);

  const logout = useCallback(async (): Promise<void> => {
    clearImpersonation();
    if (isLocalDevMode) {
      clearStoredToken();
      setProfile(null);
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  }, [clearImpersonation]);

  const startImpersonation = useCallback((clientId: ID): void => {
    localStorage.setItem(IMPERSONATE_KEY, clientId);
    setImpersonateClientId(clientId);
  }, []);

  const stopImpersonation = useCallback((): void => {
    localStorage.removeItem(IMPERSONATE_KEY);
    setImpersonateClientId(null);
  }, []);

  const effectiveClientId = useMemo((): Nullable<ID> => {
    if (profile?.role === 'superadmin' && impersonateClientId) {
      return impersonateClientId;
    }
    return profile?.clientId ?? null;
  }, [profile, impersonateClientId]);

  const isLoggedIn = isLocalDevMode ? Boolean(profile) : Boolean(session && profile);

  const value = useMemo(
    (): AuthContextValue => ({
      session,
      profile,
      effectiveClientId,
      isLoggedIn,
      isSuperadmin: profile?.role === 'superadmin',
      isAdmin: profile?.role === 'admin',
      isImpersonating: profile?.role === 'superadmin' && Boolean(impersonateClientId),
      loading,
      login,
      logout,
      refreshProfile,
      startImpersonation,
      stopImpersonation,
    }),
    [
      session,
      profile,
      effectiveClientId,
      isLoggedIn,
      loading,
      login,
      logout,
      refreshProfile,
      startImpersonation,
      stopImpersonation,
      impersonateClientId,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
}
