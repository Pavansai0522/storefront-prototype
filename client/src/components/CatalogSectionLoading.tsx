import React from 'react';

export interface CatalogSectionLoadingProps {
  message?: string;
}

export function CatalogSectionLoading({
  message = 'Loading catalog…',
}: CatalogSectionLoadingProps): JSX.Element {
  return (
    <div className="flex justify-center px-4 py-16" role="status" aria-live="polite">
      <p className="text-sm text-brand-muted">{message}</p>
    </div>
  );
}
