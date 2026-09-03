const HEX_COLOR = /^#([0-9A-Fa-f]{6})$/;

export const PRODUCT_COLOR_SLOT_COUNT = 5;

export type ProductColorSlots = [string, string, string, string, string];

export const PRODUCT_COLOR_SLOT_INDEXES = [0, 1, 2, 3, 4] as const;

export function emptyColorSlots(): ProductColorSlots {
  return ['', '', '', '', ''];
}

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
    if (out.length === PRODUCT_COLOR_SLOT_COUNT) {
      break;
    }
  }
  return out;
}

export function colorSlotValues(colors: readonly string[] | undefined): ProductColorSlots {
  const normalized = normalizeProductColors(colors ?? []);
  return [
    normalized[0] ?? '',
    normalized[1] ?? '',
    normalized[2] ?? '',
    normalized[3] ?? '',
    normalized[4] ?? '',
  ];
}

export function copyColorSlots(colors: readonly string[] | undefined): ProductColorSlots {
  const src = colors ?? [];
  return [
    src[0] ?? '',
    src[1] ?? '',
    src[2] ?? '',
    src[3] ?? '',
    src[4] ?? '',
  ];
}
