import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useStoreConfig } from './StoreDataContext';
import type { CartLineItem } from '../types/cart.types';
import type { ID } from '../types/utils.types';

type AddToCartInput = Omit<CartLineItem, 'qty'> & { qty?: number };

type CartContextValue = {
  items: CartLineItem[];
  itemCount: number;
  subtotalInr: number;
  addItem: (input: AddToCartInput) => void;
  removeItem: (productId: ID) => void;
  setQty: (productId: ID, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function storageKey(clientId: ID): string {
  return `pr-watches-cart:${clientId}`;
}

function readStoredCart(clientId: ID): CartLineItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(storageKey(clientId));
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (row): row is CartLineItem =>
        Boolean(row) &&
        typeof row === 'object' &&
        typeof (row as CartLineItem).productId === 'string' &&
        typeof (row as CartLineItem).qty === 'number',
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { clientId } = useStoreConfig();
  const [items, setItems] = useState<CartLineItem[]>(() => readStoredCart(clientId));

  useEffect(() => {
    setItems(readStoredCart(clientId));
  }, [clientId]);

  useEffect(() => {
    window.localStorage.setItem(storageKey(clientId), JSON.stringify(items));
  }, [clientId, items]);

  const addItem = useCallback((input: AddToCartInput): void => {
    const qty = input.qty ?? 1;
    setItems((prev) => {
      const existing = prev.find((row) => row.productId === input.productId);
      if (existing) {
        return prev.map((row) =>
          row.productId === input.productId
            ? { ...row, qty: Math.min(99, row.qty + qty) }
            : row,
        );
      }
      return [
        ...prev,
        {
          productId: input.productId,
          name: input.name,
          brand: input.brand,
          priceInr: input.priceInr,
          priceLabel: input.priceLabel,
          image: input.image,
          qty: Math.min(99, Math.max(1, qty)),
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: ID): void => {
    setItems((prev) => prev.filter((row) => row.productId !== productId));
  }, []);

  const setQty = useCallback((productId: ID, qty: number): void => {
    if (qty < 1) {
      setItems((prev) => prev.filter((row) => row.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((row) =>
        row.productId === productId ? { ...row, qty: Math.min(99, qty) } : row,
      ),
    );
  }, []);

  const clearCart = useCallback((): void => {
    setItems([]);
  }, []);

  const value = useMemo((): CartContextValue => {
    const itemCount = items.reduce((sum, row) => sum + row.qty, 0);
    const subtotalInr = items.reduce((sum, row) => sum + row.priceInr * row.qty, 0);
    return {
      items,
      itemCount,
      subtotalInr,
      addItem,
      removeItem,
      setQty,
      clearCart,
    };
  }, [items, addItem, removeItem, setQty, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
