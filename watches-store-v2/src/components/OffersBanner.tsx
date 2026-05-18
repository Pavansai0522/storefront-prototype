import React from 'react';
import { Sparkles } from 'lucide-react';
import { clientConfig } from '../config/client-config';

export function OffersBanner(): JSX.Element {
  return (
    <section
      aria-label="Store offer"
      className="border-y border-brand-purple/25 bg-gradient-to-r from-brand-purple/15 via-brand-surface/80 to-brand-accent/10 py-3"
    >
      <div className="container mx-auto flex items-center justify-center gap-2 px-4 text-center text-sm font-medium leading-snug text-brand-text text-balance sm:text-base">
        <Sparkles className="h-4 w-4 shrink-0 text-brand-purple" aria-hidden />
        <p>{clientConfig.offers.banner}</p>
      </div>
    </section>
  );
}
