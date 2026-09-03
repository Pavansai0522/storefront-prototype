const MAX_PRODUCT_IMAGES = 5;

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
    if (out.length === MAX_PRODUCT_IMAGES) {
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
