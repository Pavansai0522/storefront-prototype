import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { addMonths, format } from 'date-fns';
import { MOCK_CLIENTS } from '../mock/clients';
import { MOCK_ACCESSORIES, MOCK_PRODUCTS } from '../mock/products';
import type { Client, ID, Nullable, Product } from '../types';
import { showToast } from '../utils/showToast';

type AdminDataContextValue = {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  accessories: Product[];
  setAccessories: React.Dispatch<React.SetStateAction<Product[]>>;
  updateClient: (clientId: ID, fields: Partial<Client>) => void;
  markPaymentReceived: (clientId: ID) => void;
  toggleSiteActive: (clientId: ID) => void;
  addClientNote: (clientId: ID, text: string) => void;
  deleteClientNote: (clientId: ID, noteId: ID) => void;
};

const AdminDataContext = createContext<Nullable<AdminDataContextValue>>(null);

export function AdminDataProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [clients, setClients] = useState<Client[]>(() => [...MOCK_CLIENTS]);
  const [products, setProducts] = useState<Product[]>(() => [...MOCK_PRODUCTS]);
  const [accessories, setAccessories] = useState<Product[]>(() => [...MOCK_ACCESSORIES]);

  const updateClient = useCallback((clientId: ID, fields: Partial<Client>): void => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, ...fields } : c)),
    );
  }, []);

  const markPaymentReceived = useCallback((clientId: ID): void => {
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

  const toggleSiteActive = useCallback((clientId: ID): void => {
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

  const addClientNote = useCallback((clientId: ID, text: string): void => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const id: ID = `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const createdAt = new Date().toISOString();
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, notes: [{ id, text: trimmed, createdAt }, ...c.notes] }
          : c,
      ),
    );
  }, []);

  const deleteClientNote = useCallback((clientId: ID, noteId: ID): void => {
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
