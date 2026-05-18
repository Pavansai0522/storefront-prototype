import { clientConfig } from './client-config';

export { clientConfig } from './client-config';
/** Alias matching requested export name */
export { clientConfig as storeConfig } from './client-config';

function phoneToTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    return `tel:+${digits}`;
  }
  if (digits.length === 10) {
    return `tel:+1${digits}`;
  }
  return digits ? `tel:+${digits}` : 'tel:';
}

const mapsQuery = encodeURIComponent(
  `${clientConfig.address}, ${clientConfig.city}, ${clientConfig.state} ${clientConfig.zipCode}`,
);

export const STORE_PHONE_TEL = phoneToTelHref(clientConfig.phone);
export const STORE_PHONE_DISPLAY = clientConfig.phone;

export const STORE_ADDRESS_LINE1 = clientConfig.address;
export const STORE_ADDRESS_LINE2 = `${clientConfig.city}, ${clientConfig.state} ${clientConfig.zipCode}`;

export const STORE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

export const STORE_HOURS: ReadonlyArray<{ label: string; time: string }> = [
  { label: 'Mon–Thu', time: clientConfig.timings.weekdays },
  { label: 'Fri', time: clientConfig.timings.friday },
  { label: 'Sat', time: clientConfig.timings.saturday },
  { label: 'Sun', time: clientConfig.timings.sunday },
];
