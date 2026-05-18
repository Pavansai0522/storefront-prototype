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

export function currencyForCountry(country: CountryCode): CurrencyCode {
  return COUNTRY_TO_CURRENCY[country];
}

export function localeForCurrency(currency: CurrencyCode): string {
  return CURRENCY_LOCALE[currency];
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

export function currencySymbol(currency: CurrencyCode): string {
  const parts = new Intl.NumberFormat(localeForCurrency(currency), {
    style: 'currency',
    currency,
  }).formatToParts(0);
  return parts.find((p) => p.type === 'currency')?.value ?? currency;
}
