import React from 'react';
import { Phone } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import {
  STORE_PHONE_PRIMARY_TEL,
  STORE_WHATSAPP_HREF,
} from '../config/store';

/** Mobile-only hospitality contact bar — not a shopping-cart FAB. */
export function ContactBar(): JSX.Element {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gold/25 bg-maroon-deep/98 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-2 divide-x divide-gold/20">
        <a
          href={STORE_PHONE_PRIMARY_TEL}
          className="flex min-h-[52px] items-center justify-center gap-2 text-sm font-semibold text-gold"
        >
          <Phone className="h-4 w-4" aria-hidden />
          Call
        </a>
        <a
          href={STORE_WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[52px] items-center justify-center gap-2 text-sm text-foreground"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
