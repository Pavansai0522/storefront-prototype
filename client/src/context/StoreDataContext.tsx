import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { clientConfig as staticClientConfig } from '../config/client-config';
import type { Accessory, Phone } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { mapDbProductToAccessory, mapDbProductToPhone } from '../lib/catalogMappers';
import type { DbClientPublic, DbProduct } from '../lib/supabaseTypes';

export type StoreClientConfig = typeof staticClientConfig & {
  clientId: string;
};

type StoreDataContextValue = {
  clientConfig: StoreClientConfig;
  phones: Phone[];
  accessories: Accessory[];
  siteActive: boolean;
  storeReady: boolean;
  catalogLoading: boolean;
  catalogError: string | null;
  reloadCatalog: () => Promise<void>;
};

const StoreDataContext = createContext<StoreDataContextValue | null>(null);

const CLIENT_SLUG =
  (import.meta.env.VITE_CLIENT_SLUG as string | undefined) ?? 'bala-mobiles';
const CLIENT_ID =
  (import.meta.env.VITE_CLIENT_ID as string | undefined) ?? 'client-bala-1';

function mergeClientConfig(row: DbClientPublic): StoreClientConfig {
  const pub = row.public_config ?? {};
  const whatsappDigits = row.whatsapp_number.replace(/\D/g, '') || staticClientConfig.contact.whatsappE164;
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
    brand: {
      ...staticClientConfig.brand,
      chatName: row.store_name || staticClientConfig.brand.chatName,
      legalName: row.store_name || staticClientConfig.brand.legalName,
    },
  };
}

export function StoreDataProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [clientConfig, setClientConfig] = useState<StoreClientConfig>({
    ...staticClientConfig,
    clientId: CLIENT_ID,
  });
  const [phones, setPhones] = useState<Phone[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [siteActive, setSiteActive] = useState(true);
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
          'id, slug, store_name, whatsapp_number, store_phone, address, timings, instagram, facebook, site_active, public_config',
        )
        .eq('slug', CLIENT_SLUG)
        .maybeSingle();

      const clientByIdQuery = supabase
        .from('clients')
        .select(
          'id, slug, store_name, whatsapp_number, store_phone, address, timings, instagram, facebook, site_active, public_config',
        )
        .eq('id', CLIENT_ID)
        .maybeSingle();

      const [{ data: bySlug, error: slugError }, { data: byId, error: idError }] =
        await Promise.all([clientQuery, clientByIdQuery]);

      if (slugError && idError) {
        throw new Error(slugError.message);
      }

      const clientRow = (bySlug ?? byId) as DbClientPublic | null;
      if (!clientRow) {
        throw new Error('Store not found. Check VITE_CLIENT_SLUG or VITE_CLIENT_ID.');
      }

      setClientConfig(mergeClientConfig(clientRow));
      setSiteActive(clientRow.site_active);

      const { data: productRows, error: productsError } = await supabase
        .from('products')
        .select(
          'id, client_id, name, brand, price_inr, emi_price_inr, image_url, in_stock, category, subcategory, is_accessory, featured_sort, sort_order',
        )
        .eq('client_id', clientRow.id)
        .order('sort_order', { ascending: true });

      if (productsError) {
        throw new Error(productsError.message);
      }

      const rows = (productRows ?? []) as DbProduct[];
      const phoneList: Phone[] = [];
      const accessoryList: Accessory[] = [];
      for (const row of rows) {
        if (row.is_accessory) {
          accessoryList.push(mapDbProductToAccessory(row));
        } else {
          phoneList.push(mapDbProductToPhone(row));
        }
      }
      setPhones(phoneList);
      setAccessories(accessoryList);
    } catch (err) {
      setCatalogError(err instanceof Error ? err.message : 'Failed to load store.');
    } finally {
      setStoreReady(true);
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRemote();
  }, [loadRemote]);

  const value = useMemo(
    (): StoreDataContextValue => ({
      clientConfig,
      phones,
      accessories,
      siteActive,
      storeReady,
      catalogLoading,
      catalogError,
      reloadCatalog: loadRemote,
    }),
    [clientConfig, phones, accessories, siteActive, storeReady, catalogLoading, catalogError, loadRemote],
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

export function useStorePhones(): Phone[] {
  return useStoreData().phones;
}

export function useStoreAccessories(): Accessory[] {
  return useStoreData().accessories;
}

export function useStoreConfig(): StoreClientConfig {
  return useStoreData().clientConfig;
}
