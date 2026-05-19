import React from 'react';
import { RefreshCw } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { useStoreData } from '../context/StoreDataContext';
import { SiteInactive } from './SiteInactive';

type StoreGateProps = {
  children: React.ReactNode;
};

export function StoreGate({ children }: StoreGateProps): JSX.Element {
  const { siteActive, storeReady, catalogError, reloadCatalog } = useStoreData();

  if (!isSupabaseConfigured) {
    return <>{children}</>;
  }

  if (!storeReady) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <p className="text-sm text-muted">Loading store…</p>
      </div>
    );
  }

  if (catalogError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-gold-border bg-card p-8">
          <h1 className="font-display text-2xl text-white">Could not load store</h1>
          <p className="mt-3 text-sm text-muted">{catalogError}</p>
          <button
            type="button"
            onClick={() => void reloadCatalog()}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!siteActive) {
    return <SiteInactive />;
  }

  return <>{children}</>;
}
