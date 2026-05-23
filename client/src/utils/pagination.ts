/** Page numbers to show when total pages exceed mobile-friendly width. */
export function getVisiblePageNumbers(current: number, total: number): number[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current]);
  if (current > 1) {
    pages.add(current - 1);
  }
  if (current < total) {
    pages.add(current + 1);
  }
  if (current <= 3) {
    pages.add(2);
    pages.add(3);
  }
  if (current >= total - 2) {
    pages.add(total - 1);
    pages.add(total - 2);
  }

  return Array.from(pages).sort((a, b) => a - b);
}
