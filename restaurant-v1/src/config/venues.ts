export type VenueTabId = 'function-hall' | 'residence';

export type VenueGalleryImage = {
  src: string;
  alt: string;
  caption: string;
};

export type VenueInfo = {
  id: VenueTabId;
  label: string;
  title: string;
  tagline: string;
  description: string;
  highlights: readonly string[];
  note: string;
  whatsappMessage: string;
  path: string;
  galleryImages: readonly VenueGalleryImage[];
};

export const VENUE_TABS: readonly VenueTabId[] = ['function-hall', 'residence'] as const;

export const VENUES: Record<VenueTabId, VenueInfo> = {
  'function-hall': {
    id: 'function-hall',
    label: 'Function Hall',
    title: 'Atithi Function Hall',
    tagline: 'Celebrate under one roof',
    description:
      'A spacious hall for weddings, receptions, birthday parties, and corporate gatherings — with in-house catering from our kitchen so your guests enjoy the same Aruna\'s Eagle flavours.',
    highlights: [
      'Weddings, receptions & family functions',
      'In-house non-veg catering from our kitchen',
      'Flexible seating for medium to large gatherings',
      'Same address as the restaurant — easy for out-of-town guests',
    ],
    note: 'Dates fill quickly on weekends. Share your event date and guest count on WhatsApp.',
    whatsappMessage:
      "Hi, I'd like to enquire about Atithi Function Hall for an event. Please share availability and pricing.",
    path: '/function-hall',
    galleryImages: [
      {
        src: '/store/photo-2.jpg',
        alt: 'Restaurant dining area suitable for family gatherings',
        caption: 'Dining space',
      },
      {
        src: '/store/photo-3.jpg',
        alt: 'Seating area at Eagle Family Restaurant',
        caption: 'Group seating',
      },
      {
        src: '/store/photo-4.jpg',
        alt: 'Guests dining at Aruna\'s Eagle',
        caption: 'Celebrations & meals',
      },
    ],
  },
  residence: {
    id: 'residence',
    label: 'Residence',
    title: 'Atithi Residence',
    tagline: 'Stay close to the celebration',
    description:
      'Clean, comfortable rooms for families visiting Chilakaluripeta — especially convenient when you are in town for a function at our hall or a meal at the restaurant.',
    highlights: [
      'Cozy rooms for short stays',
      'Ideal for wedding & function guests',
      'Same campus as the restaurant and function hall',
      'Easy check-in — enquire on WhatsApp',
    ],
    note: 'Tell us your dates and number of rooms needed — we will confirm availability.',
    whatsappMessage:
      "Hi, I'd like to check room availability at Atithi Residence. Please share details.",
    path: '/residence',
    galleryImages: [
      {
        src: '/store/photo-3.jpg',
        alt: 'Comfortable seating at the restaurant campus',
        caption: 'Campus dining',
      },
      {
        src: '/store/photo-2.jpg',
        alt: 'Indoor seating at Eagle Family Restaurant',
        caption: 'Indoor seating',
      },
      {
        src: '/store/photo-1.jpg',
        alt: 'Eagle Family Restaurant building on NH 16',
        caption: 'Same address',
      },
    ],
  },
};

export function venueByPath(pathname: string): VenueTabId | null {
  if (pathname === VENUES['function-hall'].path) {
    return 'function-hall';
  }
  if (pathname === VENUES.residence.path) {
    return 'residence';
  }
  return null;
}
