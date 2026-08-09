import { clientConfig } from './client-config';

export { clientConfig } from './client-config';
export { clientConfig as storeConfig } from './client-config';

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '');
}

function phoneToTelHref(phone: string): string {
  const digits = digitsOnly(phone);
  if (digits.length === 10) {
    return `tel:+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `tel:+${digits}`;
  }
  return digits ? `tel:+${digits}` : 'tel:';
}

function phoneToDisplay(phone: string): string {
  const digits = digitsOnly(phone);
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

const mapsQuery = encodeURIComponent(
  `${clientConfig.address}, ${clientConfig.city}, ${clientConfig.state} ${clientConfig.pincode}`,
);

export const STORE_PHONE_PRIMARY_DISPLAY = phoneToDisplay(clientConfig.phonePrimary);
export const STORE_PHONE_SECONDARY_DISPLAY = phoneToDisplay(clientConfig.phoneSecondary);
export const STORE_PHONE_PRIMARY_TEL = phoneToTelHref(clientConfig.phonePrimary);
export const STORE_PHONE_SECONDARY_TEL = phoneToTelHref(clientConfig.phoneSecondary);
export const STORE_WHATSAPP_E164 = clientConfig.whatsappE164.replace(/\D/g, '');
export const STORE_WHATSAPP_HREF = `https://wa.me/${STORE_WHATSAPP_E164}`;

/** @deprecated use STORE_PHONE_PRIMARY_* */
export const STORE_PHONE_TEL = STORE_PHONE_PRIMARY_TEL;
/** @deprecated use STORE_PHONE_PRIMARY_* */
export const STORE_PHONE_DISPLAY = STORE_PHONE_PRIMARY_DISPLAY;

export const STORE_ADDRESS_LINE1 = clientConfig.address;
export const STORE_ADDRESS_LINE2 = `${clientConfig.city}, ${clientConfig.state} ${clientConfig.pincode}`;

export const STORE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

export const STORE_HOURS: ReadonlyArray<{ label: string; time: string }> = [
  { label: 'Hours', time: clientConfig.timings.daily },
];
