import React from 'react';
import { LiquorIcon } from './LiquorIcon';

type StoreBrandLogoProps = {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
};

export function StoreBrandLogo({
  className = '',
  iconClassName = 'w-6 h-6 text-gold',
  textClassName = 'text-xl md:text-2xl font-display font-bold tracking-wider',
}: StoreBrandLogoProps): JSX.Element {
  return (
    <span className={`flex min-w-0 items-center gap-1.5 sm:gap-2 ${className}`.trim()}>
      <LiquorIcon className={`shrink-0 ${iconClassName}`} />
      <span className={`min-w-0 leading-tight ${textClassName}`}>
        UNITED <span className="text-gold">LIQUORS</span>
      </span>
    </span>
  );
}
