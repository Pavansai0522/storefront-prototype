import React, { useEffect, useState } from 'react';

type PageTransitionProps = {
  children: React.ReactNode;
};

/** Fade + slight slide-up on mount (main content only — not layout chrome). */
export function PageTransition({ children }: PageTransitionProps): JSX.Element {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 10);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 200ms ease-out, transform 200ms ease-out',
      }}
    >
      {children}
    </div>
  );
}
