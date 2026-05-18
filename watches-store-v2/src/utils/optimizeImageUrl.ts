/** Smaller Unsplash URLs for mobile catalog (reduces bytes over slow networks). */
export function optimizeImageUrl(url: string, width = 480): string {
  if (!url || !url.includes('images.unsplash.com')) {
    return url;
  }
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('w', String(width));
    parsed.searchParams.set('q', '75');
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('fit', 'crop');
    return parsed.toString();
  } catch {
    return url;
  }
}
