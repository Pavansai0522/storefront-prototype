import { useAuthContext } from '../context/AuthContext';
import type { Nullable } from '../types';
import type { ProfileRole } from '../lib/supabaseTypes';

export type UseProfileResult = {
  profileId: Nullable<string>;
  email: Nullable<string>;
  role: Nullable<ProfileRole>;
  clientId: Nullable<string>;
  effectiveClientId: Nullable<string>;
  mustChangePassword: boolean;
  isSuperadmin: boolean;
  isAdmin: boolean;
  isImpersonating: boolean;
};

export function useProfile(): UseProfileResult {
  const { profile, effectiveClientId, isSuperadmin, isAdmin, isImpersonating } = useAuthContext();
  return {
    profileId: profile?.id ?? null,
    email: profile?.email ?? null,
    role: profile?.role ?? null,
    clientId: profile?.clientId ?? null,
    effectiveClientId,
    mustChangePassword: profile?.mustChangePassword ?? false,
    isSuperadmin,
    isAdmin,
    isImpersonating,
  };
}
