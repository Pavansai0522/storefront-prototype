import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { clientConfig as staticClientConfig } from '../config/client-config';
import { FEATURED_TOYS, FEATURED_WATCHES, type FeaturedProduct } from '../data/featured';
import {
  getSubcategoryCatalog,
  SUBCATEGORY_CATALOG,
} from '../data/subcategoryCatalog';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  featuredFromProducts,
  groupProductsBySubcategory,
} from '../lib/catalogMappers';
import type { DbClientPublic, DbProduct } from '../lib/supabaseTypes';
import type { CatalogTileItem, SubcategoryCatalogKey } from '../types/catalogTile.types';

export type StoreClientConfig = typeof staticClientConfig;

type StoreDataContextValue = {
  clientConfig: StoreClientConfig;
  siteActive: boolean;
  /** True once store metadata is loaded (page shell can render). */
  storeReady: boolean;
  catalogLoading: boolean;
  catalogError: string | null;
  reloadCatalog: () => Promise<void>;
  getSubcategoryCatalog: (key: SubcategoryCatalogKey) => CatalogTileItem[];
  featuredWatches: FeaturedProduct[];
  featuredToys: FeaturedProduct[];
  featuredAccessories: FeaturedProduct[];
};

const StoreDataContext = createContext<StoreDataContextValue | null>(null);

const CLIENT_SLUG =
  (import.meta.env.VITE_CLIENT_SLUG as string | undefined) ?? 'pr-watches-gadgets';
const CLIENT_ID =
  (import.meta.env.VITE_CLIENT_ID as string | undefined) ?? staticClientConfig.clientId;

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '');
}

function mergeClientConfig(row: DbClientPublic): StoreClientConfig {
  const pub = row.public_config ?? {};
  const whatsappDigits = digitsOnly(row.whatsapp_number) || staticClientConfig.contact.whatsappE164;
  return {
    ...staticClientConfig,
    clientId: row.id,
    contact: {
      ...staticClientConfig.contact,
      whatsappE164: whatsappDigits,
      phoneDisplay: row.whatsapp_number || staticClientConfig.contact.phoneDisplay,
      email:
        (typeof pub.storeEmail === 'string' ? pub.storeEmail : null) ??
        staticClientConfig.contact.email,
    },
    location: {
      ...staticClientConfig.location,
      addressLines: row.address
        ? row.address.split('\n').filter(Boolean)
        : staticClientConfig.location.addressLines,
    },
    hours: {
      ...staticClientConfig.hours,
      summary: row.timings || staticClientConfig.hours.summary,
    },
    social: {
      ...staticClientConfig.social,
      instagramHandle: row.instagram || staticClientConfig.social.instagramHandle,
    },
    brand: {
      ...staticClientConfig.brand,
      chatName: row.store_name || staticClientConfig.brand.chatName,
      legalName: row.store_name || staticClientConfig.brand.legalName,
    },
  };
}

export function StoreDataProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [clientConfig, setClientConfig] = useState<StoreClientConfig>(staticClientConfig);
  const [siteActive, setSiteActive] = useState(true);
  const [catalogByKey, setCatalogByKey] = useState(SUBCATEGORY_CATALOG);
  const [featuredWatches, setFeaturedWatches] = useState(FEATURED_WATCHES);
  const [featuredToys, setFeaturedToys] = useState(FEATURED_TOYS);
  const [featuredAccessories, setFeaturedAccessories] = useState<FeaturedProduct[]>([]);
  const [storeReady, setStoreReady] = useState(!isSupabaseConfigured);
  const [catalogLoading, setCatalogLoading] = useState(isSupabaseConfigured);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const loadRemote = useCallback(async (): Promise<void> => {
    if (!isSupabaseConfigured) {
      setStoreReady(true);
      setCatalogLoading(false);
      return;
    }

    setStoreReady(false);
    setCatalogLoading(true);
    setCatalogError(null);

    try {
      const clientQuery = supabase
        .from('clients')
        .select(
          'id, slug, store_name, whatsapp_number, address, timings, instagram, facebook, site_active, public_config',
        )
        .eq('slug', CLIENT_SLUG)
        .maybeSingle();

      const clientByIdQuery = supabase
        .from('clients')
        .select(
          'id, slug, store_name, whatsapp_number, address, timings, instagram, facebook, site_active, public_config',
        )
        .eq('id', CLIENT_ID)
        .maybeSingle();

      const [{ data: bySlug, error: slugError }, { data: byId, error: idError }] =
        await Promise.all([clientQuery, clientByIdQuery]);

      if (slugError) {
        throw new Error(slugError.message);
      }
      if (idError) {
        throw new Error(idError.message);
      }

      const clientRow = (bySlug ?? byId) as DbClientPublic | null;
      if (!clientRow) {
        throw new Error('Store not found. Check VITE_CLIENT_SLUG or VITE_CLIENT_ID.');
      }

      setSiteActive(clientRow.site_active);
      setClientConfig(mergeClientConfig(clientRow));
      setStoreReady(true);

      if (!clientRow.site_active) {
        setCatalogLoading(false);
        return;
      }

      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('client_id', clientRow.id)
        .order('sort_order', { ascending: true });

      if (productsError) {
        throw new Error(productsError.message);
      }

      const rows = (products ?? []) as DbProduct[];
      if (rows.length > 0) {
        setCatalogByKey(groupProductsBySubcategory(rows));
        const featured = featuredFromProducts(rows);
        if (featured.watches.length > 0) {
          setFeaturedWatches(featured.watches);
        }
        if (featured.toys.length > 0) {
          setFeaturedToys(featured.toys);
        }
        setFeaturedAccessories(featured.accessories);
      }
    } catch (err) {
      setCatalogError(err instanceof Error ? err.message : 'Failed to load catalog');
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRemote();
  }, [loadRemote]);

  const getSubcategory = useCallback(
    (key: SubcategoryCatalogKey): CatalogTileItem[] => {
      if (!isSupabaseConfigured) {
        return getSubcategoryCatalog(key);
      }
      return catalogByKey[key] ?? [];
    },
    [catalogByKey],
  );

  const value = useMemo(
    (): StoreDataContextValue => ({
      clientConfig,
      siteActive,
      storeReady,
      catalogLoading,
      catalogError,
      reloadCatalog: loadRemote,
      getSubcategoryCatalog: getSubcategory,
      featuredWatches,
      featuredToys,
      featuredAccessories,
    }),
    [
      clientConfig,
      siteActive,
      storeReady,
      catalogLoading,
      catalogError,
      loadRemote,
      getSubcategory,
      featuredWatches,
      featuredToys,
      featuredAccessories,
    ],
  );

  return <StoreDataContext.Provider value={value}>{children}</StoreDataContext.Provider>;
}

export function useStoreData(): StoreDataContextValue {
  const ctx = useContext(StoreDataContext);
  if (!ctx) {
    throw new Error('useStoreData must be used within StoreDataProvider');
  }
  return ctx;
}

export function useStoreConfig(): StoreClientConfig {
  return useStoreData().clientConfig;
}
