import { isLiquorStoreTemplate } from './templates';

/** ISO 3166-1 alpha-2 */
export type CountryCode = 'IN' | 'US' | 'GB' | 'AE';

export type CurrencyCode = 'INR' | 'USD' | 'GBP' | 'AED';

export type CountryOption = {
  value: CountryCode;
  label: string;
  currency: CurrencyCode;
};

export const COUNTRY_OPTIONS: readonly CountryOption[] = [
  { value: 'IN', label: 'India', currency: 'INR' },
  { value: 'US', label: 'United States', currency: 'USD' },
  { value: 'GB', label: 'United Kingdom', currency: 'GBP' },
  { value: 'AE', label: 'United Arab Emirates', currency: 'AED' },
] as const;

const COUNTRY_TO_CURRENCY: Record<CountryCode, CurrencyCode> = {
  IN: 'INR',
  US: 'USD',
  GB: 'GBP',
  AE: 'AED',
};

const CURRENCY_LOCALE: Record<CurrencyCode, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  GBP: 'en-GB',
  AED: 'en-AE',
};

const COUNTRY_CODES: readonly CountryCode[] = ['IN', 'US', 'GB', 'AE'];
const CURRENCY_CODES: readonly CurrencyCode[] = ['INR', 'USD', 'GBP', 'AED'];

export function isCountryCode(value: unknown): value is CountryCode {
  return typeof value === 'string' && (COUNTRY_CODES as readonly string[]).includes(value);
}

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === 'string' && (CURRENCY_CODES as readonly string[]).includes(value);
}

export function currencyForCountry(
  country: CountryCode | null | undefined,
  fallbackTemplate?: string | null,
): CurrencyCode {
  // Template wins for regional storefronts (liquor = USD shelf prices in cents).
  if (fallbackTemplate && isLiquorStoreTemplate(fallbackTemplate)) {
    return 'USD';
  }
  if (isCountryCode(country)) {
    return COUNTRY_TO_CURRENCY[country];
  }
  if (fallbackTemplate) {
    return COUNTRY_TO_CURRENCY[defaultCountryForTemplate(fallbackTemplate)];
  }
  return 'INR';
}

export function localeForCurrency(currency: CurrencyCode): string {
  return CURRENCY_LOCALE[currency] ?? CURRENCY_LOCALE.INR;
}

export function normalizeCurrencyCode(currency: CurrencyCode | null | undefined): CurrencyCode {
  return isCurrencyCode(currency) ? currency : 'INR';
}

export function defaultCountryForTemplate(template: string): CountryCode {
  if (isLiquorStoreTemplate(template)) {
    return 'US';
  }
  return 'IN';
}

/** EMI pricing is used for INR mobile / watches catalogs. */
export function usesEmiPricing(currency: CurrencyCode): boolean {
  return currency === 'INR';
}

/** US-style shelf prices with cents. */
export function usesRetailDecimals(currency: CurrencyCode): boolean {
  return currency === 'USD';
}

/** Integer cents ↔ dollars without float drift (e.g. 26.99 → 2699, not 2698). */
export function dollarsToCents(dollars: number): number {
  if (!Number.isFinite(dollars)) {
    return 0;
  }
  const sign = dollars < 0 ? -1 : 1;
  const abs = Math.abs(dollars);
  const [wholePart, fracPart = ''] = abs.toFixed(2).split('.');
  const whole = Number.parseInt(wholePart, 10);
  const frac = Number.parseInt(fracPart.padEnd(2, '0').slice(0, 2), 10);
  return sign * (whole * 100 + frac);
}

export function centsToDollars(cents: number): number {
  if (!Number.isFinite(cents)) {
    return 0;
  }
  const truncated = Math.trunc(cents);
  const sign = truncated < 0 ? -1 : 1;
  const abs = Math.abs(truncated);
  return sign * (Math.floor(abs / 100) + (abs % 100) / 100);
}

/** DB `price_inr` → admin / form amount (USD catalog stores cents). */
export function catalogPriceFromDb(amount: number, currency: CurrencyCode): number {
  if (usesRetailDecimals(currency)) {
    return centsToDollars(amount);
  }
  return amount;
}

/** Form amount → DB `price_inr` (USD catalog stores cents). */
export function catalogPriceToDb(amount: number, currency: CurrencyCode): number {
  if (usesRetailDecimals(currency)) {
    return dollarsToCents(amount);
  }
  return Math.round(amount);
}

/** Display string for USD price inputs (avoids browser number float). */
export function formatDollarInput(dollars: number): string {
  const cents = dollarsToCents(dollars);
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
}

/** Parse typed shelf price (e.g. "29.99") without float cents drift. */
export function parseDollarInput(input: string): number {
  const trimmed = input.trim().replace(/^\$/, '');
  if (!trimmed) {
    return 0;
  }
  const negative = trimmed.startsWith('-');
  const digits = trimmed.replace(/[^0-9.]/g, '');
  const dot = digits.indexOf('.');
  const whole = dot === -1 ? digits : digits.slice(0, dot);
  const frac = dot === -1 ? '' : digits.slice(dot + 1);
  const cents =
    (Number.parseInt(whole || '0', 10) || 0) * 100 +
    Number.parseInt(frac.padEnd(2, '0').slice(0, 2), 10);
  return centsToDollars(negative ? -cents : cents);
}

/** Stabilize a dollar amount after number inputs / API reads. */
export function normalizeRetailDollar(dollars: number): number {
  return centsToDollars(dollarsToCents(dollars));
}

export function currencySymbol(currency: CurrencyCode | null | undefined): string {
  const code = normalizeCurrencyCode(currency);
  const parts = new Intl.NumberFormat(localeForCurrency(code), {
    style: 'currency',
    currency: code,
  }).formatToParts(0);
  return parts.find((p) => p.type === 'currency')?.value ?? code;
}
