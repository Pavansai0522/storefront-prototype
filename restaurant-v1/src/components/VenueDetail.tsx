import React from 'react';
import { Check } from 'lucide-react';
import { btnSecondary } from '../constants/buttonStyles';
import { WhatsAppIcon } from './WhatsAppIcon';
import { VENUES, type VenueTabId } from '../config/venues';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { VenueGallery } from './VenueGallery';

type VenueDetailProps = {
  venueId: VenueTabId;
  showPlaceholder?: boolean;
};

function VenuePhoto({ venueId }: { venueId: VenueTabId }): JSX.Element {
  const image = VENUES[venueId].galleryImages[0];

  return (
    <div className="relative min-h-[14rem] w-full overflow-hidden border border-gold/25 md:min-h-[18rem]">
      <img
        src={image.src}
        alt={image.alt}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export function VenueDetail({ venueId, showPlaceholder = true }: VenueDetailProps): JSX.Element {
  const venue = VENUES[venueId];

  return (
    <article
      role="tabpanel"
      aria-labelledby={`venue-tab-${venueId}`}
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{venue.tagline}</p>
          <h2 className="mt-3 font-display text-3xl text-foreground md:text-4xl">{venue.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">{venue.description}</p>
          <ul className="mt-6 space-y-3">
            {venue.highlights.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">{venue.note}</p>
        <a
          href={buildWhatsAppUrl(venue.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-6 ${btnSecondary}`}
        >
          <WhatsAppIcon className="h-4 w-4" />
          Enquire on WhatsApp
        </a>
        </div>
        {showPlaceholder ? <VenuePhoto venueId={venueId} /> : null}
      </div>

      <VenueGallery venueId={venueId} />
    </article>
  );
}
