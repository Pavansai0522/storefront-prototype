import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

function parseDateInput(value: string): Date | null {
  try {
    const normalized = value.includes('T') ? value : `${value}T12:00:00`;
    const d = parseISO(normalized);
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}

export function formatAdminLongDate(value: string): string {
  const d = parseDateInput(value);
  if (!d) {
    return value;
  }
  return format(d, 'MMM dd, yyyy');
}

export function formatAdminDateTime(value: string): string {
  const d = parseDateInput(value);
  if (!d) {
    return value;
  }
  return format(d, 'MMM dd, yyyy, h:mm a');
}

export function formatRelativeFromNow(value: string): string {
  const d = parseDateInput(value);
  if (!d) {
    return value;
  }
  return formatDistanceToNow(d, { addSuffix: true });
}
