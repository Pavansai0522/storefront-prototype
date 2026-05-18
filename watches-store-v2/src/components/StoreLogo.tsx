import React from 'react';
import { Link } from 'react-router-dom';
import { STORE_LOGO_PRIMARY, STORE_LOGO_SECONDARY } from '../config/storeBranding';
import { StoreLogoMark } from './StoreLogoMark';

type StoreLogoProps = {
  variant?: 'navbar' | 'footer' | 'hero' | 'mark-only';
  linked?: boolean;
  className?: string;
};

export function StoreLogo({
  variant = 'navbar',
  linked = true,
  className = '',
}: StoreLogoProps): JSX.Element {
  const content =
    variant === 'hero' ? (
      <div className={`flex flex-col items-center gap-2 px-2 text-center sm:gap-3 ${className}`}>
        <StoreLogoMark size={48} className="drop-shadow-[0_0_28px_rgba(108,63,232,0.55)]" />
        <div className="max-w-[min(100%,280px)]">
          <p className="bg-gradient-to-r from-white via-violet-200 to-brand-purple bg-clip-text font-bebas text-4xl leading-none tracking-[0.1em] text-transparent sm:text-5xl md:text-6xl">
            {STORE_LOGO_PRIMARY}
          </p>
          <p className="mt-1 font-bebas text-base tracking-[0.3em] text-brand-purple sm:text-xl md:text-2xl">
            WATCHES
          </p>
          <p className="font-bebas text-[10px] tracking-[0.4em] text-brand-muted sm:text-sm">
            & MOBILES
          </p>
        </div>
      </div>
    ) : variant === 'mark-only' ? (
      <StoreLogoMark size={44} className={className} />
    ) : (
      <div className={`group flex min-w-0 items-center gap-2 sm:gap-3 ${className}`}>
        <StoreLogoMark size={36} className="shrink-0 sm:hidden" />
        <StoreLogoMark
          size={variant === 'footer' ? 48 : 44}
          className="hidden shrink-0 sm:block"
        />
        <div className="flex min-w-0 flex-col leading-none">
          <span className="bg-gradient-to-r from-white to-violet-300 bg-clip-text font-bebas text-2xl tracking-[0.06em] text-transparent sm:text-[1.85rem]">
            {STORE_LOGO_PRIMARY}
          </span>
          <span className="mt-0.5 hidden truncate font-bebas text-[0.62rem] tracking-[0.28em] text-brand-purple sm:block sm:text-xs sm:tracking-[0.32em]">
            {STORE_LOGO_SECONDARY}
          </span>
        </div>
      </div>
    );

  if (!linked) {
    return content;
  }

  return (
    <Link
      to="/"
      className="min-w-0 shrink rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
      aria-label="PR Watches and Mobiles — Home"
    >
      {content}
    </Link>
  );
}
