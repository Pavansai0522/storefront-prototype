import React from 'react';
import { MessageCircle, Store } from 'lucide-react';
import { useStoreConfig } from '../context/StoreDataContext';
import { whatsappHref } from '../config/client-config';

export function SiteInactive(): JSX.Element {
  const config = useStoreConfig();
  const waUrl = whatsappHref(
    `Hi ${config.brand.chatName}! I tried to visit your website — is the store open?`,
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-bg px-4 py-16 text-center">
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-brand-card p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-saffron/20 ring-1 ring-brand-saffron/40">
          <Store className="h-7 w-7 text-brand-saffron" aria-hidden />
        </div>
        <h1 className="font-display text-3xl uppercase text-white">{config.brand.chatName}</h1>
        <p className="mt-3 text-sm text-gray-400">
          Our online catalog is temporarily unavailable. Visit us in store or message us on WhatsApp.
        </p>
        {config.contact.phoneDisplay ? (
          <p className="mt-4 text-sm text-white">{config.contact.phoneDisplay}</p>
        ) : null}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-saffron px-4 py-2.5 text-sm font-bold text-white"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          WhatsApp us
        </a>
      </div>
    </div>
  );
}
