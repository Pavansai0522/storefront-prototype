import React from 'react';
import { VENUES, type VenueTabId } from '../config/venues';

type VenueGalleryProps = {
  venueId: VenueTabId;
};

export function VenueGallery({ venueId }: VenueGalleryProps): JSX.Element {
  const venue = VENUES[venueId];

  return (
    <div className="mt-10 border-t border-gold/15 pt-8">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Gallery</p>
          <h3 className="mt-2 font-display text-xl text-foreground md:text-2xl">
            {venue.label} photos
          </h3>
        </div>
        <p className="text-xs text-muted">Photos from our Chilakaluripeta location.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
        {venue.galleryImages.map((image, index) => (
          <figure
            key={image.src}
            className="group overflow-hidden border border-gold/20 bg-maroon-deep/40 transition hover:border-gold/40"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={image.src}
                alt={image.alt}
                loading={index === 0 ? 'eager' : 'lazy'}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <figcaption className="border-t border-gold/10 px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted">
              {image.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
