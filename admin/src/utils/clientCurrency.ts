import {
  currencyForCountry,
  type CountryCode,
  type CurrencyCode,
  usesRetailDecimals,
} from '../constants/countryCurrency';
import type { Client } from '../types';
import { formatMoney } from './formatCurrency';

export function getClientCurrency(
  client: Pick<Client, 'country' | 'template'>,
): CurrencyCode {
  return currencyForCountry(client.country, client.template);
}

export function formatClientMoney(
  client: Pick<Client, 'country'>,
  amount: number,
  options?: { retail?: boolean },
): string {
  const currency = getClientCurrency(client);
  return formatMoney(amount, currency, {
    retail: options?.retail ?? usesRetailDecimals(currency),
  });
}

export function formatCountryMoney(
  country: CountryCode | null | undefined,
  amount: number,
  options?: { retail?: boolean },
): string {
  const currency = currencyForCountry(country);
  return formatMoney(amount, currency, {
    retail: options?.retail ?? usesRetailDecimals(currency),
  });
}
