import React from 'react';
import { useStoreData } from '../context/StoreDataContext';
import { LiquorIcon } from './LiquorIcon';

type StoreBrandLogoProps = {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  /** Shorter label in tight headers (navbar). */
  compact?: boolean;
};

export function StoreBrandLogo({
  className = '',
  iconClassName = 'w-6 h-6 text-gold',
  textClassName = 'text-xl md:text-2xl font-display font-bold tracking-wider',
  compact = false,
}: StoreBrandLogoProps): JSX.Element {
  const { clientConfig } = useStoreData();
  const words = clientConfig.storeName.trim().split(/\s+/);
  const highlight = words.length > 1 ? words.pop() : clientConfig.storeName;
  const prefix = words.length > 0 ? `${words.join(' ')} ` : '';

  return (
    <span className={`flex min-w-0 items-center gap-1.5 sm:gap-2 ${className}`.trim()}>
      <LiquorIcon className={`shrink-0 ${iconClassName}`} />
      <span className={`block min-w-0 leading-tight ${textClassName}`}>
        {compact ? (
          <span className="truncate">
            {prefix}
            <span className="text-gold">{highlight}</span>
          </span>
        ) : (
          <>
            {prefix}
            <span className="text-gold">{highlight}</span>
          </>
        )}
      </span>
    </span>
  );
}
