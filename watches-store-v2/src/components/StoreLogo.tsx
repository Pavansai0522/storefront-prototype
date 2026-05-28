import React from 'react';
import { Link } from 'react-router-dom';
import { STORE_LOGO_ALT } from '../config/storeBranding';

type StoreLogoProps = {
  variant?: 'navbar' | 'footer' | 'hero' | 'mark-only';
  linked?: boolean;
  className?: string;
};

const LOGO_HEIGHT: Record<NonNullable<StoreLogoProps['variant']>, string> = {
  /** Fills nav row (`h-16` / `sm:h-20`) without growing the bar */
  navbar: 'h-12 w-auto max-w-[min(100%,11rem)] object-contain object-left sm:h-16 sm:max-w-none md:h-[4.5rem]',
  footer: 'h-14 w-auto sm:h-16',
  hero: 'h-28 w-auto sm:h-36 md:h-44',
  'mark-only': 'h-11 w-auto',
};

export function StoreLogo({
  variant = 'navbar',
  linked = true,
  className = '',
}: StoreLogoProps): JSX.Element {
  const content = (
    <img
      src="/prlogo3.png"
      alt={STORE_LOGO_ALT}
      className={`${LOGO_HEIGHT[variant]} max-w-full ${className}`}
    />
  );

  if (!linked) {
    return content;
  }

  return (
    <Link
      to="/"
      className="inline-flex min-w-0 shrink"
      aria-label={STORE_LOGO_ALT}
    >
      {content}
    </Link>
  );
}
