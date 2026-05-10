import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Client } from '../mock/clients';
import { MOCK_CLIENTS } from '../mock/clients';
import type { CatalogItem } from '../mock/products';
import { MOCK_ACCESSORIES, MOCK_PRODUCTS } from '../mock/products';

type AdminDataContextValue = {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  products: CatalogItem[];
  setProducts: React.Dispatch<React.SetStateAction<CatalogItem[]>>;
  accessories: CatalogItem[];
  setAccessories: React.Dispatch<React.SetStateAction<CatalogItem[]>>;
};

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [clients, setClients] = useState<Client[]>(() => [...MOCK_CLIENTS]);
  const [products, setProducts] = useState<CatalogItem[]>(() => [...MOCK_PRODUCTS]);
  const [accessories, setAccessories] = useState<CatalogItem[]>(() => [...MOCK_ACCESSORIES]);

  const value = useMemo(
    () => ({
      clients,
      setClients,
      products,
      setProducts,
      accessories,
      setAccessories,
    }),
    [clients, products, accessories],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData(): AdminDataContextValue {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }
  return ctx;
}
