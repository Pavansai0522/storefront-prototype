import {
  localeForCurrency,
  normalizeCurrencyCode,
  type CurrencyCode,
} from '../constants/countryCurrency';

export function formatMoney(
  amount: number,
  currency: CurrencyCode | null | undefined,
  options?: { retail?: boolean },
): string {
  const code = normalizeCurrencyCode(currency);
  const locale = localeForCurrency(code);
  const retail = options?.retail === true;
  const minDigits = retail ? 2 : 0;
  const maxDigits = code === 'INR' ? 0 : retail ? 2 : 2;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  }).format(amount);
}

export const formatINR = (amount: number): string => formatMoney(amount, 'INR');

export const formatEMI = (emi: number, currency: CurrencyCode = 'INR'): string =>
  emi > 0 ? `${formatMoney(emi, currency)}/mo` : 'No EMI';

export const formatUSD = (amount: number): string => formatMoney(amount, 'USD');

/** US retail shelf prices (always two decimals). */
export const formatUSDRetail = (amount: number): string =>
  formatMoney(amount, 'USD', { retail: true });