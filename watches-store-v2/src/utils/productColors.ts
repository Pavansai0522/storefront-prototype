const HEX_COLOR = /^#([0-9A-Fa-f]{6})$/;

const MAX_PRODUCT_COLORS = 5;

export function normalizeProductColors(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== 'string') {
      continue;
    }
    const hex = item.trim();
    if (!HEX_COLOR.test(hex)) {
      continue;
    }
    const normalized = `#${hex.slice(1).toUpperCase()}`;
    if (!out.includes(normalized)) {
      out.push(normalized);
    }
    if (out.length === MAX_PRODUCT_COLORS) {
      break;
    }
  }
  return out;
}
