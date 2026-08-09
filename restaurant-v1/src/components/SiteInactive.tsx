import React from 'react';
import { Store } from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';

export function SiteInactive(): JSX.Element {
  const { clientConfig } = useStoreData();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center">
      <div className="mx-auto max-w-md rounded-2xl border border-gold-border bg-card p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/20 ring-1 ring-gold-border">
          <Store className="h-7 w-7 text-gold" aria-hidden />
        </div>
        <h1 className="font-display text-3xl text-white">{clientConfig.storeName}</h1>
        <p className="mt-3 text-sm text-muted">
          Our online catalog is temporarily unavailable. Visit us in store or call{' '}
          {clientConfig.phonePrimary}.
        </p>
      </div>
    </div>
  );
}
