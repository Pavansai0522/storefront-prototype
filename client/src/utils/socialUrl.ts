/** Normalize admin/DB values (@handle or bare URL) to a full https link. */
export function normalizeSocialUrl(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    return fallback;
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('@')) {
    return `https://www.instagram.com/${trimmed.slice(1)}`;
  }
  if (trimmed.includes('instagram.com')) {
    return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
  }
  if (trimmed.includes('facebook.com')) {
    return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
  }
  return trimmed;
}

export function readPublicConfigUrl(
  pub: Record<string, unknown>,
  key: string,
  fallback: string,
): string {
  const value = pub[key];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}
