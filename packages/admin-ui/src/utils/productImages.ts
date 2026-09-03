export const PRODUCT_IMAGE_SLOT_COUNT = 5;

export type ProductImageSlots = [string, string, string, string, string];

export type ProductImageFileSlots = [
  File | null,
  File | null,
  File | null,
  File | null,
  File | null,
];

export const PRODUCT_IMAGE_SLOT_INDEXES = [0, 1, 2, 3, 4] as const;

export function emptyImageSlots(): ProductImageSlots {
  return ['', '', '', '', ''];
}

export function emptyImageFiles(): ProductImageFileSlots {
  return [null, null, null, null, null];
}

function isImageUrl(value: string): boolean {
  const trimmed = value.trim();
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('/')
  );
}

export function normalizeProductImages(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== 'string') {
      continue;
    }
    const url = item.trim();
    if (!isImageUrl(url) || out.includes(url)) {
      continue;
    }
    out.push(url);
    if (out.length === PRODUCT_IMAGE_SLOT_COUNT) {
      break;
    }
  }
  return out;
}

export function mergeProductImages(
  primary: string | null | undefined,
  extra: unknown,
): string[] {
  const fromColumn = normalizeProductImages(extra);
  if (fromColumn.length > 0) {
    return fromColumn;
  }
  return normalizeProductImages(primary ? [primary] : []);
}

export function imageSlotValues(images: readonly string[] | undefined): ProductImageSlots {
  const normalized = normalizeProductImages(images ?? []);
  return [
    normalized[0] ?? '',
    normalized[1] ?? '',
    normalized[2] ?? '',
    normalized[3] ?? '',
    normalized[4] ?? '',
  ];
}

export function copyImageSlots(images: readonly string[] | undefined): ProductImageSlots {
  const src = images ?? [];
  return [
    src[0] ?? '',
    src[1] ?? '',
    src[2] ?? '',
    src[3] ?? '',
    src[4] ?? '',
  ];
}

export function copyImageFiles(files: readonly (File | null)[] | undefined): ProductImageFileSlots {
  const src = files ?? [];
  return [
    src[0] ?? null,
    src[1] ?? null,
    src[2] ?? null,
    src[3] ?? null,
    src[4] ?? null,
  ];
}

export function productImageUploadKey(productId: string, slotIndex: number): string {
  return slotIndex === 0 ? productId : `${productId}-${slotIndex}`;
}
