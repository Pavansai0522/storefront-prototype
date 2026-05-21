import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Product } from '../components/ProductCatalog';
import { clientConfig as staticClientConfig, type LiquorStoreConfig } from '../config/client-config';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { dealProductsFromRows, mapDbProductToCatalog } from '../lib/catalogMappers';
import type { DbClientPublic, DbProduct } from '../lib/supabaseTypes';

type StoreDataContextValue = {
  clientConfig: LiquorStoreConfig;
  products: Product[];
  dealProducts: Product[];
  siteActive: boolean;
  storeReady: boolean;
  catalogLoading: boolean;
  catalogError: string | null;
  reloadCatalog: () => Promise<void>;
};

const StoreDataContext = createContext<StoreDataContextValue | null>(null);

const CLIENT_SLUG =
  (import.meta.env.VITE_CLIENT_SLUG as string | undefined) ?? 'united-liquors';
const CLIENT_ID =
  (import.meta.env.VITE_CLIENT_ID as string | undefined) ?? staticClientConfig.clientId;

function mergeClientConfig(row: DbClientPublic): LiquorStoreConfig {
  const pub = row.public_config ?? {};
  return {
    ...staticClientConfig,
    clientId: row.id,
    storeName: row.store_name || staticClientConfig.storeName,
    phone: row.store_phone || staticClientConfig.phone,
    email:
      (typeof pub.storeEmail === 'string' ? pub.storeEmail : null) ?? staticClientConfig.email,
    address: row.address || staticClientConfig.address,
    timings: {
      ...staticClientConfig.timings,
      weekdays: row.timings || staticClientConfig.timings.weekdays,
    },
    delivery: {
      available: row.delivery_available ?? staticClientConfig.delivery.available,
      radiusMiles: row.delivery_radius_miles ?? staticClientConfig.delivery.radiusMiles,
      minimumOrder: row.minimum_order_amount_usd ?? staticClientConfig.delivery.minimumOrder,
    },
    social: {
      ...staticClientConfig.social,
      instagram: row.instagram?.trim() || staticClientConfig.social.instagram,
      facebook: row.facebook?.trim() || staticClientConfig.social.facebook,
    },
    ageGate: row.age_verification_enabled ?? staticClientConfig.ageGate,
  };
}

export function StoreDataProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [clientConfig, setClientConfig] = useState<LiquorStoreConfig>(staticClientConfig);
  const [products, setProducts] = useState<Product[]>([]);
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [siteActive, setSiteActive] = useState(true);
  const [storeReady, setStoreReady] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const loadRemote = useCallback(async (): Promise<void> => {
    if (!isSupabaseConfigured) {
      setProducts([]);
      setDealProducts([]);
      setCatalogError('Store database is not configured.');
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
          'id, slug, store_name, store_phone, address, timings, instagram, facebook, site_active, age_verification_enabled, delivery_available, delivery_radius_miles, minimum_order_amount_usd, public_config',
        )
        .eq('slug', CLIENT_SLUG)
        .maybeSingle();

      const clientByIdQuery = supabase
        .from('clients')
        .select(
          'id, slug, store_name, store_phone, address, timings, instagram, facebook, site_active, age_verification_enabled, delivery_available, delivery_radius_miles, minimum_order_amount_usd, public_config',
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
          'id, client_id, name, brand, price_inr, image_url, in_stock, category, subcategory, sort_order, featured_group, featured_sort',
        )
        .eq('client_id', clientRow.id)
        .order('sort_order', { ascending: true });

      if (productsError) {
        throw new Error(productsError.message);
      }

      const rows = productRows as DbProduct[];
      setProducts(rows.map(mapDbProductToCatalog));
      setDealProducts(dealProductsFromRows(rows));
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
      products,
      dealProducts,
      siteActive,
      storeReady,
      catalogLoading,
      catalogError,
      reloadCatalog: loadRemote,
    }),
    [clientConfig, products, dealProducts, siteActive, storeReady, catalogLoading, catalogError, loadRemote],
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

export function useStoreProducts(): Product[] {
  return useStoreData().products;
}
