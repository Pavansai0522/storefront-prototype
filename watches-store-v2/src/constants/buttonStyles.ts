/** Shared storefront button classes — keep CTAs consistent site-wide */

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg';

export const btnShop = [
  'inline-flex min-h-[48px] items-center justify-center gap-2',
  'rounded-xl bg-brand-purple px-8 py-3.5',
  'text-base font-bold tracking-wide text-white',
  'shadow-glow-purple',
  'transition-all duration-200',
  'hover:bg-brand-purple-dim hover:shadow-[0_0_36px_rgba(188,36,34,0.35)]',
  'active:scale-[0.98]',
  focusRing,
  'focus-visible:ring-brand-purple',
].join(' ');

export const btnWhatsApp = [
  'inline-flex min-h-[48px] items-center justify-center gap-2',
  'rounded-xl bg-[#128C7E] px-6 py-3.5',
  'text-base font-bold text-white',
  'shadow-[0_4px_20px_rgba(18,140,126,0.32)]',
  'transition-all duration-200',
  'hover:bg-[#075E54] hover:shadow-[0_6px_24px_rgba(7,94,84,0.4)]',
  'active:scale-[0.98]',
  focusRing,
  'focus-visible:ring-[#128C7E]',
].join(' ');

export const btnWhatsAppCompact = [
  'inline-flex min-h-[42px] w-full items-center justify-center gap-1.5',
  'rounded-lg bg-[#128C7E] px-3 py-2.5',
  'text-sm font-semibold text-white',
  'shadow-[0_2px_12px_rgba(18,140,126,0.28)]',
  'transition-all duration-200',
  'hover:bg-[#075E54]',
  'active:scale-[0.98]',
  focusRing,
  'focus-visible:ring-[#128C7E]',
].join(' ');

export const btnWhatsAppNav = [
  'inline-flex min-h-[40px] items-center justify-center gap-1.5',
  'rounded-lg bg-[#128C7E] px-4 py-2',
  'text-sm font-semibold text-white',
  'shadow-[0_2px_10px_rgba(18,140,126,0.26)]',
  'transition-all duration-200',
  'hover:bg-[#075E54]',
  'active:scale-[0.98]',
  focusRing,
  'focus-visible:ring-[#128C7E]',
].join(' ');

export const btnEnquireLink = [
  'inline-flex min-h-[36px] w-full items-center justify-center',
  'text-sm font-medium text-brand-text',
  'underline-offset-4 transition-colors duration-200',
  'hover:text-brand-purple hover:underline',
  focusRing,
  'focus-visible:ring-brand-purple rounded-md',
].join(' ');
