/** Emails that should always resolve to superadmin (comma-separated in admin/.env). */
export function configuredSuperadminEmails(): string[] {
  const raw = import.meta.env.VITE_SUPERADMIN_EMAIL as string | undefined;
  if (!raw?.trim()) {
    return [];
  }
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isConfiguredSuperadminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return configuredSuperadminEmails().includes(normalized);
}

/** Local mock sign-in when Supabase env is not set. */
export function isMockSuperadminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (normalized.startsWith('superadmin') || normalized === 'super@agency.com') {
    return true;
  }
  return isConfiguredSuperadminEmail(email);
}
