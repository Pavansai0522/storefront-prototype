import React, { type Dispatch, type SetStateAction } from 'react';
import Select from 'react-select';
import { clientSelectStyles, clientSelectTheme } from '../config/clientSelectStyles';
import { CATALOG_SORT_OPTIONS, type CatalogSortKey } from '../hooks/useCatalogFilters';

type SelectOption = { value: CatalogSortKey; label: string };

type CatalogSortControlProps = {
  sortKey: CatalogSortKey;
  setSortKey: Dispatch<SetStateAction<CatalogSortKey>>;
  instanceId: string;
  inputId: string;
  showLabel?: boolean;
  className?: string;
};

export function CatalogSortControl({
  sortKey,
  setSortKey,
  instanceId,
  inputId,
  showLabel = true,
  className = '',
}: CatalogSortControlProps): JSX.Element {
  const selectedSortOption =
    CATALOG_SORT_OPTIONS.find((option) => option.value === sortKey) ??
    CATALOG_SORT_OPTIONS[0] ??
    null;

  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`.trim()}>
      {showLabel ? (
        <label className="hidden shrink-0 text-sm leading-none text-brand-muted sm:block" htmlFor={inputId}>
          Sort by
        </label>
      ) : null}
      <div className="min-w-0 w-full flex-1 sm:w-56">
        <Select<SelectOption, false>
          instanceId={instanceId}
          inputId={inputId}
          options={CATALOG_SORT_OPTIONS}
          value={selectedSortOption}
          onChange={(option) => {
            if (option) {
              setSortKey(option.value);
            }
          }}
          styles={clientSelectStyles}
          theme={clientSelectTheme}
          isSearchable={false}
          aria-label="Sort results"
        />
      </div>
    </div>
  );
}
