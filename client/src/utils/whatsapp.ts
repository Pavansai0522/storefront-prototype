/** Build a WhatsApp `wa.me` URL. `number` should be digits only (e.g. 919876543210). */
export function buildWhatsAppUrl(number: string, message?: string): string {
  const base = `https://wa.me/${number}`;
  if (message === undefined || message === '') {
    return base;
  }
  return `${base}?text=${encodeURIComponent(message)}`;
}
