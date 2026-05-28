import React from 'react';
import { MessageCircle, Store } from 'lucide-react';
import { useStoreConfig } from '../context/StoreDataContext';
import { whatsappHref } from '../config/client-config';
import { STORE_NAME } from '../config/storeBranding';

export function SiteInactive(): JSX.Element {
  const config = useStoreConfig();
  const waUrl = whatsappHref(
    `Hi ${config.brand.chatName}! I tried to visit your website — is the store open?`,
  );

  return React.createElement(
    'div',
    {
      className:
        'flex min-h-screen flex-col items-center justify-center bg-brand-bg px-4 py-16 text-center',
    },
    React.createElement(
      'div',
      {
        className:
          'mx-auto max-w-md rounded-2xl border border-brand-border/60 bg-brand-card p-8 shadow-glow-purple',
      },
      React.createElement(
        'div',
        {
          className:
            'mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-purple/20 ring-1 ring-brand-purple/40',
        },
        React.createElement(Store, { className: 'h-7 w-7 text-brand-purple', 'aria-hidden': true }),
      ),
      React.createElement(
        'h1',
        { className: 'font-display text-3xl uppercase tracking-wide text-brand-text' },
        STORE_NAME,
      ),
      React.createElement(
        'p',
        { className: 'mt-3 text-sm text-brand-text' },
        'Our online catalog is temporarily unavailable. Visit us in store or message us on WhatsApp — we are happy to help with watches, toys, and accessories.',
      ),
      config.contact.phoneDisplay
        ? React.createElement(
            'p',
            { className: 'mt-4 text-sm font-medium text-brand-text' },
            config.contact.phoneDisplay,
          )
        : null,
      React.createElement(
        'a',
        {
          href: waUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'btn-primary mt-6 inline-flex w-full items-center justify-center gap-2',
        },
        React.createElement(MessageCircle, { className: 'h-5 w-5', 'aria-hidden': true }),
        ' WhatsApp us',
      ),
    ),
  );
}
