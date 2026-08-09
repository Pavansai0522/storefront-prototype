import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
import { VenueDetail } from '../components/VenueDetail';
import { VenueTabs } from '../components/VenueTabs';
import { VENUES, type VenueTabId } from '../config/venues';

type VenuePageProps = {
  venueId: VenueTabId;
};

export function VenuePage({ venueId }: VenuePageProps): JSX.Element {
  return (
    <main className="bg-maroon-deep py-12 md:py-16">
      <div className="container mx-auto">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Also at this address</p>
          <h1 className="mt-3 font-display text-3xl text-foreground md:text-4xl">Hall &amp; Residence</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            Beyond the dining room — host celebrations and stay overnight at the same campus.
          </p>
        </div>

        <VenueTabs mode="link" className="mb-10" />

        <VenueDetail venueId={venueId} />

        <div className="mt-12 flex flex-wrap gap-4 border-t border-gold/15 pt-8">
          <Link
            to="/"
            className="text-sm font-semibold uppercase tracking-wider text-muted transition hover:text-gold"
          >
            ← Back to home
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold hover:text-gold-hover"
          >
            <UtensilsCrossed className="h-4 w-4" aria-hidden />
            View menu
          </Link>
          {venueId === 'function-hall' ? (
            <Link
              to={VENUES.residence.path}
              className="text-sm font-semibold uppercase tracking-wider text-muted transition hover:text-gold"
            >
              Need rooms? See Residence →
            </Link>
          ) : (
            <Link
              to={VENUES['function-hall'].path}
              className="text-sm font-semibold uppercase tracking-wider text-muted transition hover:text-gold"
            >
              Planning an event? See Function Hall →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
