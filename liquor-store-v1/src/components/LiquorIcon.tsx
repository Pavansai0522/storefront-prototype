import React from 'react';
import { Wine, type LucideProps } from 'lucide-react';

/** Store brand / product placeholder icon (wine glass). */
export function LiquorIcon({ className, ...props }: LucideProps): JSX.Element {
  return <Wine className={className} aria-hidden {...props} />;
}
