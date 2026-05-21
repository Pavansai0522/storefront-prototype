import React from 'react';
import type { SVGProps } from 'react';

type LiquorIconProps = SVGProps<SVGSVGElement>;

/** Premium stemmed-glass mark (replaces generic Lucide wine icon). */
export function LiquorIcon({ className, ...props }: LiquorIconProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <circle cx="20" cy="20" r="17.5" stroke="currentColor" strokeWidth="1.75" opacity="0.4" />
      <path
        d="M20 8.5c3.2 0 5.8 2.4 5.8 5.4 0 2.1-.9 3.9-2.3 5.1l-.5 9.2a1.2 1.2 0 0 1-1.2 1.1h-3.6a1.2 1.2 0 0 1-1.2-1.1l-.5-9.2c-1.4-1.2-2.3-3-2.3-5.1 0-3 2.6-5.4 5.8-5.4Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14.2 13.8h11.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.9"
      />
      <ellipse
        cx="20"
        cy="13.6"
        rx="5.8"
        ry="2.1"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.45"
      />
      <path d="M16.8 30.2h6.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="31.8" r="1.1" fill="currentColor" />
    </svg>
  );
}
