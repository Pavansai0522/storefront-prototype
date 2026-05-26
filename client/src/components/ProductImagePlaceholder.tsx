import React from 'react';
import { Smartphone } from 'lucide-react';

export interface ProductImagePlaceholderProps {
  label: string;
  className?: string;
}

export function ProductImagePlaceholder({
  label,
  className = '',
}: ProductImagePlaceholderProps): JSX.Element {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 ${className}`}
      aria-hidden
    >
      <Smartphone className="h-10 w-10 text-brand-blue/50 md:h-12 md:w-12" />
      <span className="max-w-[90%] truncate px-2 text-center text-[10px] font-medium uppercase tracking-wide text-brand-muted">
        {label}
      </span>
    </div>
  );
}
