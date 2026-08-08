import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Search, ShoppingBag } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { RequireStoreBanner } from '../components/RequireStoreBanner';
import { SkeletonTable } from '../components/AdminSkeleton';
import { SKELETON_DELAY_MS } from '../constants';
import { isWatchesStoreTemplate } from '../constants/templates';
import { useProfile } from '../hooks/useProfile';
import { fetchOrdersForClient } from '../services/ordersService';
import type { ID, Order, OrderStatus } from '../types';
import { findClientById } from '../utils/clientLookup';
import { formatClientMoney } from '../utils/clientCurrency';
import { formatMoney } from '../utils/formatCurrency';
import { useAdminData } from '../context/AdminDataContext';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

function statusClass(status: OrderStatus): string {
  if (status === 'paid') {
    return 'bg-emerald-500/15 text-emerald-300';
  }
  if (status === 'pending') {
    return 'bg-amber-500/15 text-amber-200';
  }
  return 'bg-red-500/15 text-red-200';
}

function formatAddress(order: Order): string {
  return [order.addressLine, order.landmark, order.city, order.state, order.postalCode, order.country]
    .filter((part) => part.trim().length > 0)
    .join(', ');
}

export function Orders(): JSX.Element {
  const { effectiveClientId } = useProfile();
  const { clients } = useAdminData();
  const client = useMemo(
    () => findClientById(clients, effectiveClientId ?? ''),
    [clients, effectiveClientId],
  );
  const isWatches = isWatchesStoreTemplate(client?.template);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<ID | null>(null);

  useEffect(() => {
    if (!effectiveClientId || !isWatches) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    void fetchOrdersForClient(effectiveClientId)
      .then((rows) => {
        if (!cancelled) {
          setOrders(rows);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load orders');
        }
      })
      .finally(() => {
        if (!cancelled) {
          window.setTimeout(() => setLoading(false), SKELETON_DELAY_MS);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [effectiveClientId, isWatches]);

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return orders;
    }
    return orders.filter((order) => {
      return (
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.includes(q) ||
        order.customerEmail.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q)
      );
    });
  }, [orders, query]);

  return (
    <PageTransition>
      <RequireStoreBanner />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl uppercase tracking-wide text-white">Orders</h1>
          <p className="mt-1 text-sm text-gray-400">
            Track online orders placed through checkout.
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search customer, phone, order id…"
            className="admin-input w-full pl-9"
          />
        </div>
      </div>

      {!isWatches ? (
        <div className="admin-card p-6 text-sm text-gray-400">
          Orders are available for watches storefronts with online checkout.
        </div>
      ) : loading ? (
        <SkeletonTable rows={5} />
      ) : error ? (
        <div className="admin-card p-6 text-sm text-red-300">{error}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="admin-card flex flex-col items-center gap-3 p-10 text-center">
          <ShoppingBag className="h-10 w-10 text-gray-500" aria-hidden />
          <p className="text-gray-300">No orders yet.</p>
          <p className="text-sm text-gray-500">Paid checkout orders will appear here.</p>
        </div>
      ) : (
        <div className="admin-table-shell overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="admin-tr border-b border-white/10 text-gray-400">
                <th className="admin-th">Date</th>
                <th className="admin-th">Customer</th>
                <th className="admin-th">Phone</th>
                <th className="admin-th">Total</th>
                <th className="admin-th">Status</th>
                <th className="admin-th">Order ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const expanded = expandedId === order.id;
                return (
                  <React.Fragment key={order.id}>
                    <tr
                      className="admin-tr cursor-pointer border-b border-white/5 hover:bg-white/[0.03]"
                      onClick={() => setExpandedId(expanded ? null : order.id)}
                    >
                      <td className="admin-td whitespace-nowrap">
                        {format(new Date(order.createdAt), 'dd MMM yyyy, h:mm a')}
                      </td>
                      <td className="admin-td">{order.customerName}</td>
                      <td className="admin-td whitespace-nowrap">{order.customerPhone}</td>
                      <td className="admin-td whitespace-nowrap">
                        {client
                          ? formatClientMoney(client, order.totalInr)
                          : formatMoney(order.totalInr, 'INR')}
                      </td>
                      <td className="admin-td">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(order.status)}`}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="admin-td font-mono text-xs text-gray-400">{order.id.slice(0, 8)}…</td>
                    </tr>
                    {expanded ? (
                      <tr className="admin-tr border-b border-white/5 bg-white/[0.02]">
                        <td className="admin-td" colSpan={6}>
                          <div className="grid gap-4 py-2 md:grid-cols-2">
                            <div>
                              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Items
                              </p>
                              <ul className="space-y-1 text-gray-200">
                                {order.items.map((item) => (
                                  <li key={item.id}>
                                    {item.name} ({item.brand}) × {item.qty} —{' '}
                                    {client
                                      ? formatClientMoney(client, item.unitPriceInr * item.qty)
                                      : formatMoney(item.unitPriceInr * item.qty, 'INR')}
                                  </li>
                                ))}
                              </ul>
                              <p className="mt-3 text-sm text-gray-400">
                                Subtotal{' '}
                                {client
                                  ? formatClientMoney(client, order.subtotalInr)
                                  : formatMoney(order.subtotalInr, 'INR')}{' '}
                                · Delivery{' '}
                                {client
                                  ? formatClientMoney(client, order.deliveryInr)
                                  : formatMoney(order.deliveryInr, 'INR')}
                              </p>
                            </div>
                            <div>
                              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Delivery
                              </p>
                              <p className="text-gray-200">{formatAddress(order)}</p>
                              {order.customerEmail ? (
                                <p className="mt-2 text-sm text-gray-400">{order.customerEmail}</p>
                              ) : null}
                              {order.notes ? (
                                <p className="mt-2 text-sm text-gray-400">Notes: {order.notes}</p>
                              ) : null}
                              {order.razorpayPaymentId ? (
                                <p className="mt-2 font-mono text-xs text-gray-500">
                                  Payment: {order.razorpayPaymentId}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </PageTransition>
  );
}
