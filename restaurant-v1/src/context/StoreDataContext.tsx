import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Product } from '../types/product.types';
import { clientConfig as staticClientConfig, type RestaurantStoreConfig } from '../config/client-config';
import { SAMPLE_MENU_PRODUCTS } from '../mock/sampleMenu';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { featuredProductsFromRows, mapDbProductToCatalog } from '../lib/catalogMappers';
import type { DbClientPublic, DbProduct } from '../lib/supabaseTypes';

type StoreDataContextValue = {
  clientConfig: RestaurantStoreConfig;
  products: Product[];
  featuredProducts: Product[];
  siteActive: boolean;
  storeReady: boolean;
  catalogLoading: boolean;
  catalogError: string | null;
  reloadCatalog: () => Promise<void>;
};

const StoreDataContext = createContext<StoreDataContextValue | null>(null);

const CLIENT_SLUG =
  (import.meta.env.VITE_CLIENT_SLUG as string | undefined) ?? 'arunas-eagle';
const CLIENT_ID =
  (import.meta.env.VITE_CLIENT_ID as string | undefined) ?? staticClientConfig.clientId;

function mergeClientConfig(row: DbClientPublic): RestaurantStoreConfig {
  const pub = row.public_config ?? {};
  const secondary =
    typeof pub.secondaryPhone === 'string' ? pub.secondaryPhone : staticClientConfig.phoneSecondary;
  return {
    ...staticClientConfig,
    clientId: row.id,
    storeName: row.store_name || staticClientConfig.storeName,
    phonePrimary: row.store_phone || staticClientConfig.phonePrimary,
    phoneSecondary: secondary,
    email:
      (typeof pub.storeEmail === 'string' ? pub.storeEmail : null) ?? staticClientConfig.email,
    address: row.address || staticClientConfig.address,
    timings: {
      daily: row.timings || staticClientConfig.timings.daily,
    },
    social: {
      ...staticClientConfig.social,
      instagram: row.instagram?.trim() || staticClientConfig.social.instagram,
      facebook: row.facebook?.trim() || staticClientConfig.social.facebook,
    },
  };
}

export function StoreDataProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [clientConfig, setClientConfig] = useState<RestaurantStoreConfig>(staticClientConfig);
  const [products, setProducts] = useState<Product[]>(SAMPLE_MENU_PRODUCTS);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(SAMPLE_MENU_PRODUCTS.slice(0, 4));
  const [siteActive, setSiteActive] = useState(true);
  const [storeReady, setStoreReady] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const loadRemote = useCallback(async (): Promise<void> => {
    if (!isSupabaseConfigured) {
      setProducts(SAMPLE_MENU_PRODUCTS);
      setFeaturedProducts(SAMPLE_MENU_PRODUCTS.slice(0, 4));
      setCatalogError(null);
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
          'id, slug, store_name, store_phone, address, timings, instagram, facebook, site_active, public_config',
        )
        .eq('slug', CLIENT_SLUG)
        .maybeSingle();

      const clientByIdQuery = supabase
        .from('clients')
        .select(
          'id, slug, store_name, store_phone, address, timings, instagram, facebook, site_active, public_config',
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
        setProducts(SAMPLE_MENU_PRODUCTS);
        setFeaturedProducts(SAMPLE_MENU_PRODUCTS.slice(0, 4));
        setCatalogError(null);
        setStoreReady(true);
        setCatalogLoading(false);
        return;
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
      const mapped = rows.length > 0 ? rows.map(mapDbProductToCatalog) : SAMPLE_MENU_PRODUCTS;
      const featured =
        rows.length > 0 ? featuredProductsFromRows(rows) : SAMPLE_MENU_PRODUCTS.slice(0, 4);
      setProducts(mapped);
      setFeaturedProducts(featured.length > 0 ? featured : mapped.slice(0, 4));
    } catch (err) {
      setProducts(SAMPLE_MENU_PRODUCTS);
      setFeaturedProducts(SAMPLE_MENU_PRODUCTS.slice(0, 4));
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
      featuredProducts,
      siteActive,
      storeReady,
      catalogLoading,
      catalogError,
      reloadCatalog: loadRemote,
    }),
    [
      clientConfig,
      products,
      featuredProducts,
      siteActive,
      storeReady,
      catalogLoading,
      catalogError,
      loadRemote,
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

export function useStoreProducts(): Product[] {
  return useStoreData().products;
}
