import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
import { VenueDetail } from './VenueDetail';
import { VenueTabs } from './VenueTabs';
import { VENUES, type VenueTabId } from '../config/venues';

export function AlsoHereSection(): JSX.Element {
  const [activeTab, setActiveTab] = useState<VenueTabId>('function-hall');
  const activeVenue = VENUES[activeTab];

  return (
    <section className="border-y border-gold/15 bg-maroon py-16 md:py-20">
      <div className="container mx-auto">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Also at this address</p>
          <h2 className="mt-3 font-display text-3xl text-foreground md:text-4xl">More than dining</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            Most guests come for the food. We also host celebrations and offer rooms for out-of-town
            family — all under one roof.
          </p>
        </div>

        <VenueTabs active={activeTab} mode="button" onSelect={setActiveTab} className="mb-8" />

        <VenueDetail venueId={activeTab} showPlaceholder={false} />

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to={activeVenue.path}
            className="text-sm font-semibold uppercase tracking-wider text-gold hover:text-gold-hover"
          >
            Full {activeVenue.label} details →
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted transition hover:text-gold"
          >
            <UtensilsCrossed className="h-4 w-4" aria-hidden />
            Food menu
          </Link>
        </div>
      </div>
    </section>
  );
}
