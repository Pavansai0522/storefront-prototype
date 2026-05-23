import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getVisiblePageNumbers } from '../utils/pagination';

export interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: PaginationControlsProps): JSX.Element | null {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePageNumbers(page, totalPages);

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-brand-text shadow-sm transition-colors hover:border-brand-blue disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </button>

      {visiblePages.map((p, index) => {
        const prev = visiblePages[index - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <React.Fragment key={p}>
            {showEllipsis ? (
              <span className="px-1 text-sm text-brand-muted" aria-hidden>
                …
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => onPageChange(p)}
              className={`h-11 min-h-[44px] min-w-[44px] rounded-xl px-2 text-sm font-bold transition-all ${p === page ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(29,78,216,0.35)]' : 'border-2 border-slate-200 bg-white text-brand-muted shadow-sm hover:border-brand-blue'}`}
              aria-label={`Page ${p}`}
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
        className="flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-brand-text shadow-sm transition-colors hover:border-brand-blue disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
