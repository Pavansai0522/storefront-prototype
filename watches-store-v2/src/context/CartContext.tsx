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
  removeItem: (productId: ID, color?: string) => void;
  setQty: (productId: ID, qty: number, color?: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function lineMatches(row: CartLineItem, productId: ID, color?: string): boolean {
  return row.productId === productId && (row.color ?? '') === (color ?? '');
}

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
    const color = input.color;
    setItems((prev) => {
      const existing = prev.find((row) => lineMatches(row, input.productId, color));
      if (existing) {
        return prev.map((row) =>
          lineMatches(row, input.productId, color)
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
          color,
          qty: Math.min(99, Math.max(1, qty)),
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: ID, color?: string): void => {
    setItems((prev) => prev.filter((row) => !lineMatches(row, productId, color)));
  }, []);

  const setQty = useCallback((productId: ID, qty: number, color?: string): void => {
    if (qty < 1) {
      setItems((prev) => prev.filter((row) => !lineMatches(row, productId, color)));
      return;
    }
    setItems((prev) =>
      prev.map((row) =>
        lineMatches(row, productId, color) ? { ...row, qty: Math.min(99, qty) } : row,
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
