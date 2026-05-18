import React from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<SpinnerSize, { outer: string; inner: string }> = {
  sm: { outer: 'h-5 w-5', inner: 'inset-[3px]' },
  md: { outer: 'h-10 w-10', inner: 'inset-[5px]' },
  lg: { outer: 'h-14 w-14', inner: 'inset-[6px]' },
};

type SpinnerProps = {
  size?: SpinnerSize;
  label?: string;
  className?: string;
};

export function Spinner({ size = 'md', label, className = '' }: SpinnerProps): JSX.Element {
  const { outer, inner } = SIZE_MAP[size];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`inline-flex flex-col items-center gap-3 ${className}`}
    >
      <div className={`relative ${outer}`}>
        <div className="absolute inset-0 rounded-full border-2 border-white/10" aria-hidden />
        <div
          className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand-saffron border-r-brand-saffronHover shadow-[0_0_18px_rgba(255,107,0,0.35)] motion-reduce:animate-none"
          aria-hidden
        />
        <div
          className={`absolute ${inner} rounded-full bg-gradient-to-br from-brand-saffron/40 to-brand-saffronHover/25`}
          aria-hidden
        />
      </div>
      {label ? <p className="text-sm text-gray-400">{label}</p> : null}
      <span className="sr-only">{label ?? 'Loading'}</span>
    </div>
  );
}
