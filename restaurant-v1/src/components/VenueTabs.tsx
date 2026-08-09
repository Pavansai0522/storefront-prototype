import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { btnTabActive, btnTabInactive } from '../constants/buttonStyles';
import { VENUE_TABS, VENUES, type VenueTabId } from '../config/venues';

type VenueTabsProps = {
  /** Active tab when using button mode (e.g. home section). */
  active?: VenueTabId;
  onSelect?: (id: VenueTabId) => void;
  /** `link` navigates to venue pages; `button` switches inline content. */
  mode?: 'link' | 'button';
  className?: string;
};

export function VenueTabs({
  active,
  onSelect,
  mode = 'link',
  className = '',
}: VenueTabsProps): JSX.Element {
  const location = useLocation();
  const activeFromRoute = VENUE_TABS.find((id) => location.pathname === VENUES[id].path);

  return (
    <div
      className={`inline-flex w-full max-w-lg flex-wrap gap-1 border border-gold/30 bg-maroon-deep/90 p-1.5 shadow-[inset_0_1px_0_rgba(204,159,63,0.08)] sm:w-auto ${className}`.trim()}
      role="tablist"
      aria-label="Venue options"
    >
      {VENUE_TABS.map((id) => {
        const venue = VENUES[id];
        const isActive = mode === 'link' ? activeFromRoute === id : active === id;
        const tabClass = isActive ? btnTabActive : btnTabInactive;

        if (mode === 'button') {
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={tabClass}
              onClick={() => onSelect?.(id)}
            >
              {venue.label}
            </button>
          );
        }

        return (
          <Link
            key={id}
            to={venue.path}
            role="tab"
            aria-selected={isActive}
            className={tabClass}
          >
            {venue.label}
          </Link>
        );
      })}
    </div>
  );
}
