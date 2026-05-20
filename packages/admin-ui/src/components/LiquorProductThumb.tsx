import React, { useEffect, useState } from 'react';
import { Wine } from 'lucide-react';

type LiquorProductThumbProps = {
  src: string | null | undefined;
  alt: string;
};

function hasImage(url: string | null | undefined): boolean {
  return typeof url === 'string' && url.trim().length > 0;
}

export function LiquorProductThumb({ src, alt }: LiquorProductThumbProps): JSX.Element {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [src]);

  if (!hasImage(src) || broken) {
    return (
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5"
        aria-hidden
      >
        <Wine className="h-5 w-5 text-brand-saffron/60" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-10 w-10 shrink-0 rounded-lg border border-white/10 object-cover"
      onError={() => setBroken(true)}
    />
  );
}
