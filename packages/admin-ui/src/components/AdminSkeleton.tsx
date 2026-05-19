import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const base = '#1a1a2e';
const highlight = 'rgba(255,255,255,0.08)';

type SkeletonTableProps = {
  rows?: number;
};

export function SkeletonTable({ rows = 5 }: SkeletonTableProps): JSX.Element {
  return (
    <div className="admin-table-shell">
      <div className="py-2" aria-busy="true" aria-label="Loading">
        <SkeletonTheme baseColor={base} highlightColor={highlight}>
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="flex flex-wrap items-center gap-4 px-4 py-3">
              <Skeleton height={16} width={128} />
              <Skeleton height={16} width={96} />
              <Skeleton height={16} width={64} />
              <Skeleton height={16} width={80} />
            </div>
          ))}
        </SkeletonTheme>
      </div>
    </div>
  );
}

export function SkeletonCard(): JSX.Element {
  return (
    <div className="admin-card p-5">
      <SkeletonTheme baseColor={base} highlightColor={highlight}>
        <Skeleton height={12} width={80} />
        <Skeleton height={24} width={48} className="mt-3" />
      </SkeletonTheme>
    </div>
  );
}
