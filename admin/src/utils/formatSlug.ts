export const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const toLiveUrl = (storeName: string): string => `https://${toSlug(storeName)}.vercel.app`;

/** Preserves legacy onboarding slug rules (Create client live URLs). */
export function slugFromStoreName(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || 'store'
  );
}
