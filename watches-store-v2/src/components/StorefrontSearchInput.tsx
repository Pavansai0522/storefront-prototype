import React from 'react';
import { Search, X } from 'lucide-react';

type StorefrontSearchInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  size?: 'sm' | 'md';
};

export function StorefrontSearchInput({
  id,
  value,
  onChange,
  placeholder,
  ariaLabel,
  size = 'md',
}: StorefrontSearchInputProps): JSX.Element {
  const sizeClasses =
    size === 'sm'
      ? 'h-10 rounded-lg pl-9 pr-9 text-sm'
      : 'min-h-[44px] rounded-xl py-2.5 pl-10 pr-10 text-base md:text-sm';

  return (
    <div className="relative w-full">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted"
        aria-hidden
      />
      <input
        id={id}
        type="text"
        inputMode="search"
        enterKeyHint="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        aria-label={ariaLabel}
        className={`w-full border border-brand-border bg-secondary text-brand-text outline-none transition placeholder:text-brand-muted focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 ${sizeClasses}`}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-1 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-brand-muted transition-colors hover:bg-brand-purple/10 hover:text-brand-purple"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
