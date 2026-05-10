import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { addMonths, format } from 'date-fns';
import type { Client } from '../mock/clients';
import { MOCK_CLIENTS } from '../mock/clients';
import type { CatalogItem } from '../mock/products';
import { MOCK_ACCESSORIES, MOCK_PRODUCTS } from '../mock/products';
import { showToast } from '../utils/showToast';

type AdminDataContextValue = {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  products: CatalogItem[];
  setProducts: React.Dispatch<React.SetStateAction<CatalogItem[]>>;
  accessories: CatalogItem[];
  setAccessories: React.Dispatch<React.SetStateAction<CatalogItem[]>>;
  updateClient: (clientId: string, fields: Partial<Client>) => void;
  markPaymentReceived: (clientId: string) => void;
  toggleSiteActive: (clientId: string) => void;
  addClientNote: (clientId: string, text: string) => void;
  deleteClientNote: (clientId: string, noteId: string) => void;
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

  const updateClient = useCallback((clientId: string, fields: Partial<Client>): void => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, ...fields } : c)),
    );
  }, []);

  const markPaymentReceived = useCallback((clientId: string): void => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const today = new Date();
        const newPaidUntil = addMonths(today, 1);
        const newNextDue = addMonths(newPaidUntil, 1);
        return {
          ...c,
          billing: {
            ...c.billing,
            paidUntil: format(newPaidUntil, 'yyyy-MM-dd'),
            nextDue: format(newNextDue, 'yyyy-MM-dd'),
            paymentHistory: [
              {
                date: format(today, 'yyyy-MM-dd'),
                amount: c.billing.planMonthlyInr,
                status: 'paid',
                reference: `PAY-${Date.now()}`,
              },
              ...c.billing.paymentHistory,
            ],
          },
        };
      }),
    );
    showToast('Payment marked as received', 'success');
  }, []);

  const toggleSiteActive = useCallback((clientId: string): void => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const next = !c.siteActive;
        showToast(
          next ? 'Site activated' : 'Site deactivated',
          next ? 'success' : 'error',
        );
        return { ...c, siteActive: next };
      }),
    );
  }, []);

  const addClientNote = useCallback((clientId: string, text: string): void => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const id = `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const createdAt = new Date().toISOString();
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, notes: [{ id, text: trimmed, createdAt }, ...c.notes] }
          : c,
      ),
    );
  }, []);

  const deleteClientNote = useCallback((clientId: string, noteId: string): void => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, notes: c.notes.filter((n) => n.id !== noteId) }
          : c,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({
      clients,
      setClients,
      products,
      setProducts,
      accessories,
      setAccessories,
      updateClient,
      markPaymentReceived,
      toggleSiteActive,
      addClientNote,
      deleteClientNote,
    }),
    [
      clients,
      products,
      accessories,
      updateClient,
      markPaymentReceived,
      toggleSiteActive,
      addClientNote,
      deleteClientNote,
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
