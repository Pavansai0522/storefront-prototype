export type SectionPageSlice<T> = {
  page: number;
  totalPages: number;
  pageStart: number;
  pageEnd: number;
  showsPagination: boolean;
  items: T[];
};

export function getSectionPageCount(itemCount: number, pageSize: number): number {
  if (pageSize < 1) {
    throw new Error('pageSize must be at least 1');
  }
  return Math.max(1, Math.ceil(itemCount / pageSize));
}

export function clampSectionPage(page: number, totalPages: number): number {
  return Math.max(1, Math.min(totalPages, page));
}

export function sliceSectionPage<T>(
  items: T[],
  page: number,
  pageSize: number,
): SectionPageSlice<T> {
  const totalPages = getSectionPageCount(items.length, pageSize);
  const clampedPage = clampSectionPage(page, totalPages);
  const pageStart = (clampedPage - 1) * pageSize;
  const pageItems = items.slice(pageStart, pageStart + pageSize);
  const pageEnd = pageStart + pageItems.length;

  return {
    page: clampedPage,
    totalPages,
    pageStart,
    pageEnd,
    showsPagination: totalPages > 1,
    items: pageItems,
  };
}
