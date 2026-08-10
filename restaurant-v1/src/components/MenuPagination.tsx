import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getVisiblePageNumbers } from '../utils/pagination';

type MenuPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  ariaLabel?: string;
};

export function MenuPagination({
  page,
  totalPages,
  onPageChange,
  ariaLabel = 'Menu pages',
}: MenuPaginationProps): JSX.Element | null {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePageNumbers(page, totalPages);

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-gold/10 pt-6"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-gold/25 bg-maroon-deep/40 text-gold transition hover:border-gold/50 hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous menu page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </button>

      {visiblePages.map((p, index) => {
        const prev = visiblePages[index - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <React.Fragment key={p}>
            {showEllipsis ? (
              <span className="px-1 text-sm text-muted" aria-hidden>
                …
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => onPageChange(p)}
              className={`h-11 min-h-[44px] min-w-[44px] rounded-lg px-2 text-sm font-semibold transition ${
                p === page
                  ? 'bg-gold text-maroon-deep shadow-[0_0_12px_rgba(212,175,55,0.35)]'
                  : 'border border-gold/25 bg-maroon-deep/40 text-muted hover:border-gold/50 hover:text-gold'
              }`}
              aria-label={`Menu page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          </React.Fragment>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-gold/25 bg-maroon-deep/40 text-gold transition hover:border-gold/50 hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next menu page"
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </nav>
  );
}
