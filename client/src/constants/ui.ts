/** Phones grid page size (must match previous AllPhones behavior). */
export const PHONES_PAGE_SIZE = 9;

/** Alternating home-page section backgrounds (white ↔ light gray). */
export const STORE_SECTION_BASE = 'bg-brand-bg';
export const STORE_SECTION_SURFACE = 'bg-brand-surface';

/** Shared storefront tile surface — white card on slate page backgrounds. */
export const STORE_TILE_SURFACE =
  'border-2 border-slate-200 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.08)]';

export const STORE_TILE_HOVER =
  'transition-all duration-300 md:hover:border-brand-blue/45 md:hover:shadow-[0_8px_24px_rgba(15,23,42,0.12)]';

export const STORE_PANEL_SURFACE =
  'rounded-3xl border-2 border-slate-200 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.06)]';

/** WhatsApp FAB spring animation (seconds). */
export const WHATSAPP_FAB_ANIMATION_DELAY_S = 1;

export const WHATSAPP_FAB_SPRING = {
  stiffness: 260,
  damping: 20,
} as const;
