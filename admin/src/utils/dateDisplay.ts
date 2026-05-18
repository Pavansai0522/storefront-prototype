import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import type { ISODateString, Nullable } from '../types';

function parseDateInput(value: ISODateString): Nullable<Date> {
  try {
    const normalized = value.includes('T') ? value : `${value}T12:00:00`;
    const d = parseISO(normalized);
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}

export function formatAdminLongDate(value: ISODateString): string {
  const d = parseDateInput(value);
  if (!d) {
    return value;
  }
  return format(d, 'MMM dd, yyyy');
}

export function formatAdminDateTime(value: ISODateString): string {
  const d = parseDateInput(value);
  if (!d) {
    return value;
  }
  return format(d, 'MMM dd, yyyy, h:mm a');
}

export function formatRelativeFromNow(value: ISODateString): string {
  const d = parseDateInput(value);
  if (!d) {
    return value;
  }
  return formatDistanceToNow(d, { addSuffix: true });
}
