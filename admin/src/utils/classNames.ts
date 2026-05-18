import type { Optional } from '../types';

export const cn = (...classes: Array<Optional<string> | false>): string =>
  classes.filter(Boolean).join(' ');
