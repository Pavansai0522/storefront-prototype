import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { addMonths, format } from 'date-fns';
import { isLocalDevMode } from '../lib/devMode';
import { MOCK_CLIENTS } from '../mock/clients';
import { MOCK_ACCESSORIES, MOCK_PRODUCTS } from '../mock/products';
import { deleteClient as deleteClientRow, fetchAllClients, updateClientFields } from '../services/clientsService';
import {
  createProduct,
  deleteProduct,
  deleteProducts,
  fetchAllProducts,
  updateProduct,
} from '../services/catalogService';
import { useAuthContext } from './AuthContext';
import type { Client, ID, Nullable, Product } from '../types';
import { showToast } from '../utils/showToast';

type AdminDataContextValue = {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  accessories: Product[];
  setAccessories: React.Dispatch<React.SetStateAction<Product[]>>;
  dataLoading: boolean;
  dataError: Nullable<string>;
  reloadData: () => Promise<void>;
  updateClient: (clientId: ID, fields: Partial<Client>) => Promise<void>;
  saveProduct: (product: Product) => Promise<Product>;
  removeProduct: (id: ID) => Promise<void>;
  removeProducts: (ids: ID[]) => Promise<void>;
  markPaymentReceived: (clientId: ID) => void;
  toggleSiteActive: (clientId: ID) => void;
  addClientNote: (clientId: ID, text: string) => void;
  deleteClientNote: (clientId: ID, noteId: ID) => void;
  removeClient: (clientId: ID) => Promise<void>;
};

const AdminDataContext = createContext<Nullable<AdminDataContextValue>>(null);

export function AdminDataProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { session, profile, isLoggedIn } = useAuthContext();
  const [clients, setClients] = useState<Client[]>(() =>
    isLocalDevMode ? [...MOCK_CLIENTS] : [],
  );
  const [products, setProducts] = useState<Product[]>(() =>
    isLocalDevMode ? [...MOCK_PRODUCTS] : [],
  );
  const [accessories, setAccessories] = useState<Product[]>(() =>
    isLocalDevMode ? [...MOCK_ACCESSORIES] : [],
  );
  const [dataLoading, setDataLoading] = useState(!isLocalDevMode);
  const [dataError, setDataError] = useState<Nullable<string>>(null);

  const reloadData = useCallback(async (): Promise<void> => {
    setDataLoading(true);
    setDataError(null);
    try {
      const [nextClients, nextProducts] = await Promise.all([
        fetchAllClients(),
        fetchAllProducts(),
      ]);
      setClients(nextClients);
      setProducts(nextProducts.filter((p) => !p.isAccessory));
      setAccessories(nextProducts.filter((p) => p.isAccessory));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      setDataError(message);
      setClients([]);
      setProducts([]);
      setAccessories([]);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLocalDevMode) {
      if (!isLoggedIn || !profile) {
        setClients([]);
        setProducts([]);
        setAccessories([]);
        setDataLoading(false);
        return;
      }
      setClients([...MOCK_CLIENTS]);
      setProducts([...MOCK_PRODUCTS]);
      setAccessories([...MOCK_ACCESSORIES]);
      setDataLoading(false);
      return;
    }
    if (!session) {
      setClients([]);
      setProducts([]);
      setAccessories([]);
      setDataLoading(false);
      return;
    }
    void reloadData();
  }, [session, profile, isLoggedIn, reloadData]);

  const updateClient = useCallback(async (clientId: ID, fields: Partial<Client>): Promise<void> => {
    if (isLocalDevMode) {
      setClients((prev) => prev.map((c) => (c.id === clientId ? { ...c, ...fields } : c)));
      showToast('Store info saved', 'success');
      return;
    }
    try {
      const updated = await updateClientFields(clientId, fields);
      setClients((prev) => prev.map((c) => (c.id === clientId ? updated : c)));
      showToast('Store info saved', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  }, []);

  const saveProduct = useCallback(
    async (product: Product): Promise<Product> => {
      if (isLocalDevMode) {
        const saved: Product = {
          ...product,
          id: product.id || `prod-${Date.now()}`,
        };
        if (saved.isAccessory) {
          setAccessories((prev) => {
            const without = prev.filter((p) => p.id !== saved.id);
            return [...without, saved];
          });
          setProducts((prev) => prev.filter((p) => p.id !== saved.id));
        } else {
          setProducts((prev) => {
            const without = prev.filter((p) => p.id !== saved.id);
            return [...without, saved];
          });
          setAccessories((prev) => prev.filter((p) => p.id !== saved.id));
        }
        return saved;
      }
      const exists = products.some((p) => p.id === product.id) || accessories.some((p) => p.id === product.id);
      const saved = exists ? await updateProduct(product.id, product) : await createProduct(product);
      setProducts((prev) => {
        const without = prev.filter((p) => p.id !== saved.id);
        if (saved.isAccessory) {
          return without;
        }
        return [...without, saved];
      });
      if (saved.isAccessory) {
        setAccessories((prev) => {
          const without = prev.filter((p) => p.id !== saved.id);
          return [...without, saved];
        });
      }
      return saved;
    },
    [products, accessories],
  );

  const removeProduct = useCallback(async (id: ID): Promise<void> => {
    if (!isLocalDevMode) {
      await deleteProduct(id);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setAccessories((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const removeProducts = useCallback(async (ids: ID[]): Promise<void> => {
    if (!isLocalDevMode && ids.length > 0) {
      await deleteProducts(ids);
    }
    const idSet = new Set(ids);
    setProducts((prev) => prev.filter((p) => !idSet.has(p.id)));
    setAccessories((prev) => prev.filter((p) => !idSet.has(p.id)));
  }, []);

  const markPaymentReceived = useCallback((clientId: ID): void => {
    setClients((prev) => {
      const target = prev.find((c) => c.id === clientId);
      if (!target) {
        return prev;
      }
      const today = new Date();
      const newPaidUntil = addMonths(today, 1);
      const newNextDue = addMonths(newPaidUntil, 1);
      const billing = {
        ...target.billing,
        paidUntil: format(newPaidUntil, 'yyyy-MM-dd'),
        nextDue: format(newNextDue, 'yyyy-MM-dd'),
        paymentHistory: [
          {
            date: format(today, 'yyyy-MM-dd'),
            amount: target.billing.planMonthlyInr,
            status: 'paid' as const,
            reference: `PAY-${Date.now()}`,
          },
          ...target.billing.paymentHistory,
        ],
      };
      if (!isLocalDevMode) {
        void updateClientFields(clientId, { billing }).catch((err) => {
          showToast(err instanceof Error ? err.message : 'Save failed', 'error');
        });
      }
      return prev.map((c) => (c.id === clientId ? { ...c, billing } : c));
    });
    showToast('Payment marked as received', 'success');
  }, []);

  const toggleSiteActive = useCallback((clientId: ID): void => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const next = !c.siteActive;
        showToast(next ? 'Site activated' : 'Site deactivated', next ? 'success' : 'error');
        if (!isLocalDevMode) {
          void updateClientFields(clientId, { siteActive: next });
        }
        return { ...c, siteActive: next };
      }),
    );
  }, []);

  const addClientNote = useCallback((clientId: ID, text: string): void => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const id: ID = `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const createdAt = new Date().toISOString();
    setClients((prev) => {
      const target = prev.find((c) => c.id === clientId);
      if (!target) {
        return prev;
      }
      const notes = [{ id, text: trimmed, createdAt }, ...target.notes];
      if (!isLocalDevMode) {
        void updateClientFields(clientId, { notes }).catch((err) => {
          showToast(err instanceof Error ? err.message : 'Save failed', 'error');
        });
      }
      return prev.map((c) => (c.id === clientId ? { ...c, notes } : c));
    });
  }, []);

  const deleteClientNote = useCallback((clientId: ID, noteId: ID): void => {
    setClients((prev) => {
      const target = prev.find((c) => c.id === clientId);
      if (!target) {
        return prev;
      }
      const notes = target.notes.filter((n) => n.id !== noteId);
      if (!isLocalDevMode) {
        void updateClientFields(clientId, { notes }).catch((err) => {
          showToast(err instanceof Error ? err.message : 'Save failed', 'error');
        });
      }
      return prev.map((c) => (c.id === clientId ? { ...c, notes } : c));
    });
  }, []);

  const removeClient = useCallback(async (clientId: ID): Promise<void> => {
    if (!isLocalDevMode) {
      await deleteClientRow(clientId);
    }
    setClients((prev) => prev.filter((c) => c.id !== clientId));
    setProducts((prev) => prev.filter((p) => p.clientId !== clientId));
    setAccessories((prev) => prev.filter((p) => p.clientId !== clientId));
  }, []);

  const value = useMemo(
    () => ({
      clients,
      setClients,
      products,
      setProducts,
      accessories,
      setAccessories,
      dataLoading,
      dataError,
      reloadData,
      updateClient,
      saveProduct,
      removeProduct,
      removeProducts,
      markPaymentReceived,
      toggleSiteActive,
      addClientNote,
      deleteClientNote,
      removeClient,
    }),
    [
      clients,
      products,
      accessories,
      dataLoading,
      dataError,
      reloadData,
      updateClient,
      saveProduct,
      removeProduct,
      removeProducts,
      markPaymentReceived,
      toggleSiteActive,
      addClientNote,
      deleteClientNote,
      removeClient,
    ],
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
