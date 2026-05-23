import React from 'react';
import { Link } from 'react-router-dom';
import { STORE_LOGO_ALT, STORE_LOGO_SRC } from '../config/storeBranding';

type StoreLogoProps = {
  variant?: 'navbar' | 'footer' | 'hero';
  linked?: boolean;
  className?: string;
};

const LOGO_HEIGHT: Record<NonNullable<StoreLogoProps['variant']>, string> = {
  navbar: 'h-14 w-auto max-w-[min(100%,14rem)] object-contain object-left sm:h-16',
  footer: 'h-12 w-auto max-w-[min(100%,12rem)] object-contain object-left sm:h-14',
  hero: 'h-24 w-auto max-w-full object-contain sm:h-32 md:h-40',
};

export function StoreLogo({
  variant = 'navbar',
  linked = true,
  className = '',
}: StoreLogoProps): JSX.Element {
  const mark = (
    <img
      src={STORE_LOGO_SRC}
      alt={STORE_LOGO_ALT}
      className={`${LOGO_HEIGHT[variant]} bg-transparent ${className}`}
    />
  );

  if (!linked) {
    return <span className="inline-flex min-w-0 shrink">{mark}</span>;
  }

  return (
    <Link
      to="/"
      className="inline-flex min-w-0 shrink rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
      aria-label={STORE_LOGO_ALT}
    >
      {mark}
    </Link>
  );
}
