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
  navbar: 'h-16 w-auto object-contain object-left sm:h-[4.5rem]',
  footer: 'h-14 w-auto sm:h-16',
  hero: 'h-28 w-auto sm:h-36 md:h-44',
  'mark-only': 'h-11 w-auto',
};

export function StoreLogo({
  variant = 'navbar',
  linked = true,
  className = '',
}: StoreLogoProps): JSX.Element {
  const glowClass =
    variant === 'hero'
      ? 'drop-shadow-[0_0_32px_rgba(252,221,130,0.35)]'
      : 'drop-shadow-[0_0_18px_rgba(203,168,96,0.28)]';

  const content = (
    <img
      src="/prlogo2.png"
      alt={STORE_LOGO_ALT}
      className={`${LOGO_HEIGHT[variant]} max-w-full ${glowClass} ${className}`}
    />
  );

  if (!linked) {
    return content;
  }

  return (
    <Link
      to="/"
      className="inline-flex min-w-0 shrink rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
      aria-label={STORE_LOGO_ALT}
    >
      {content}
    </Link>
  );
}
