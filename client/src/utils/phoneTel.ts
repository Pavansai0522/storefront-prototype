/** Build tel: link from display number (e.g. +91 93931 15555). */
export function phoneTelHref(display: string): string {
  const digits = display.replace(/\D/g, '');
  if (!digits) {
    return '';
  }
  return `tel:+${digits}`;
}
