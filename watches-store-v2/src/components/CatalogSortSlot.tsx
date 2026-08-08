import React from 'react';
import { CATALOG_SORT_SLOT_ID } from '../constants/ui';

export function CatalogSortSlot(): JSX.Element {
  return <div id={CATALOG_SORT_SLOT_ID} className="hidden w-full shrink-0 self-end sm:w-56 lg:block" />;
}
