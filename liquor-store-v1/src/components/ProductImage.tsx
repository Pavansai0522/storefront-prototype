import React, { useEffect, useState } from 'react';
import { LiquorIcon } from './LiquorIcon';
import { hasProductImage } from '../utils/productImage';

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  iconClassName?: string;
};

export function ProductImage({
  src,
  alt,
  className = 'h-full object-contain mix-blend-screen opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500',
  iconClassName = 'w-20 h-20 text-gold/50',
}: ProductImageProps): JSX.Element {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [src]);

  if (!hasProductImage(src) || broken) {
    return (
      <div className="flex h-full w-full items-center justify-center" role="img" aria-label={alt}>
        <LiquorIcon className={iconClassName} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setBroken(true)}
    />
  );
}
