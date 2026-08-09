import React from 'react';
import { useStoreData } from '../context/StoreDataContext';
import { StoreLogoMark } from './StoreLogoMark';

type StoreBrandLogoProps = {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  /** Shorter label in tight headers (navbar). */
  compact?: boolean;
};

const ICON_SIZE: Record<'default' | 'compact', number> = {
  default: 40,
  compact: 32,
};

export function StoreBrandLogo({
  className = '',
  iconClassName = '',
  textClassName = 'text-xl md:text-2xl font-display font-bold tracking-wider',
  compact = false,
}: StoreBrandLogoProps): JSX.Element {
  const { clientConfig } = useStoreData();
  const words = clientConfig.storeName.trim().split(/\s+/);
  const highlight = words.length > 1 ? words.pop() : clientConfig.storeName;
  const prefix = words.length > 0 ? `${words.join(' ')} ` : '';
  const markSize = ICON_SIZE[compact ? 'compact' : 'default'];

  return (
    <span className={`flex min-w-0 items-center gap-1.5 sm:gap-2 ${className}`.trim()}>
      <StoreLogoMark
        size={markSize}
        className={`shrink-0 drop-shadow-[0_0_14px_rgba(201,168,76,0.35)] ${iconClassName}`}
      />
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
