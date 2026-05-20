export function hasProductImage(url: string | null | undefined): boolean {
  return typeof url === 'string' && url.trim().length > 0;
}
