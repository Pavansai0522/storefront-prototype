import React from 'react';

type StoreLogoMarkProps = {
  size?: number;
  className?: string;
};

/** Custom PR monogram inside a watch-dial mark — not a stock icon */
export function StoreLogoMark({ size = 44, className = '' }: StoreLogoMarkProps): JSX.Element {
  const id = React.useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-ring`} x1="4" y1="44" x2="44" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="0.5" stopColor="#C4B5FD" />
          <stop offset="1" stopColor="#6C3FE8" />
        </linearGradient>
        <linearGradient id={`${id}-fill`} x1="12" y1="14" x2="36" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Bezel */}
      <circle cx="24" cy="24" r="21" fill="#07070D" stroke={`url(#${id}-ring)`} strokeWidth="2.5" />
      <circle cx="24" cy="24" r="17.5" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* Hour markers */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 24 + Math.sin(rad) * 15.5;
        const y1 = 24 - Math.cos(rad) * 15.5;
        const isCardinal = deg % 90 === 0;
        return (
          <circle
            key={deg}
            cx={x1}
            cy={y1}
            r={isCardinal ? 1.1 : 0.55}
            fill={isCardinal ? '#8B5CF6' : 'rgba(255,255,255,0.35)'}
          />
        );
      })}

      {/* Crown at 12 */}
      <path
        d="M24 7.5 L25.8 10.2 L28.5 9.5 L27.2 12.2 L29.5 14 L26.5 14.2 L24 16.5 L21.5 14.2 L18.5 14 L20.8 12.2 L19.5 9.5 L22.2 10.2 Z"
        fill="#8B5CF6"
        opacity="0.9"
      />

      {/* PR monogram */}
      <g filter={`url(#${id}-glow)`}>
        <text
          x="24"
          y="29"
          textAnchor="middle"
          fill={`url(#${id}-fill)`}
          fontFamily="'Bebas Neue', Impact, sans-serif"
          fontSize="15"
          fontWeight="700"
          letterSpacing="-0.5"
        >
          PR
        </text>
      </g>

      {/* Hands */}
      <line
        x1="24"
        y1="24"
        x2="24"
        y2="15"
        stroke="#8B5CF6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="24"
        y1="24"
        x2="30"
        y2="26"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="1.6" fill="#8B5CF6" />
    </svg>
  );
}
