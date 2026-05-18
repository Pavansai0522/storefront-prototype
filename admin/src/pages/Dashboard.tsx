import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Package, User } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { SKELETON_DELAY_MS } from '../constants';
import { isLiquorStoreTemplate, isWatchesStoreTemplate } from '../constants/templates';
import {
  countAccessoriesForClient,
  countProductsForClient,
  supportsAccessoriesCatalog,
} from '../utils/catalogAccessories';
import type { Client } from '../types';
import { useProfile } from '../hooks/useProfile';
import { useAuthContext } from '../context/AuthContext';
import { SkeletonCard } from '../components/AdminSkeleton';
import { PageTransition } from '../components/PageTransition';
import type { CurrencyCode } from '../constants/countryCurrency';
import { formatMoney } from '../utils/formatCurrency';
import { getClientCurrency } from '../utils/clientCurrency';
import { findClientById } from '../utils/clientLookup';

const STORE_INFO_FIELDS = 5;

function storeInfoCompleteness(client: Client | undefined, isLiquor: boolean): {
  filled: number;
  total: number;
  percent: number;
} {
  if (!client) {
    return { filled: 0, total: STORE_INFO_FIELDS, percent: 0 };
  }
  const primaryContact = isLiquor ? client.storePhone : client.whatsappNumber;
  const filled = [
    primaryContact.trim(),
    client.address.trim(),
    client.timings.trim(),
    client.instagram.trim(),
    client.facebook.trim(),
  ].filter(Boolean).length;
  const total = STORE_INFO_FIELDS;
  return { filled, total, percent: Math.round((filled / total) * 100) };
}

function formatActivityTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

function isDueOverdue(nextDue: string): boolean {
  const end = new Date(nextDue);
  end.setHours(23, 59, 59, 999);
  return end < new Date();
}

type ActivityItem = {
  id: string;
  at: number;
  label: string;
  storeName: string;
  clientId: string;
};

function buildActivityFeed(clients: Client[]): ActivityItem[] {
  const items: ActivityItem[] = [];
  for (const c of clients) {
    if (!c?.id) {
      continue;
    }
    items.push({
      id: `${c.id}-products`,
      at: new Date(c.productsLastUpdatedAt).getTime(),
      label: 'Updated products catalog',
      storeName: c.storeName,
      clientId: c.id,
    });
    if (supportsAccessoriesCatalog(c.template) && c.accessoriesLastUpdatedAt) {
      items.push({
        id: `${c.id}-accessories`,
        at: new Date(c.accessoriesLastUpdatedAt).getTime(),
        label: isWatchesStoreTemplate(c.template)
          ? 'Updated accessories catalog (cables, gadgets…)'
          : 'Updated accessories catalog',
        storeName: c.storeName,
        clientId: c.id,
      });
    }
    if (c.adminLastLoginAt) {
      items.push({
        id: `${c.id}-login`,
        at: new Date(c.adminLastLoginAt).getTime(),
        label: 'Store owner logged in',
        storeName: c.storeName,
        clientId: c.id,
      });
    }
  }
  return items.sort((a, b) => b.at - a.at).slice(0, 12);
}

function AdminStoreDashboard(): JSX.Element {
  const { role, effectiveClientId: clientId } = useProfile();
  const { clients, products, accessories } = useAdminData();

  const myClient = useMemo(
    () => findClientById(clients, clientId),
    [clients, clientId],
  );

  const template = myClient?.template ?? null;
  const isLiquor = isLiquorStoreTemplate(template);
  const isWatches = isWatchesStoreTemplate(template);
  const showAccessories = supportsAccessoriesCatalog(template);

  const productCountForStore = useMemo(
    () =>
      clientId
        ? countProductsForClient(products, accessories, clientId, template)
        : products.length,
    [products, accessories, clientId, template],
  );

  const accessoryCountForStore = useMemo(
    () =>
      clientId
        ? countAccessoriesForClient(products, accessories, clientId, template)
        : accessories.length,
    [products, accessories, clientId, template],
  );

  const completeness = useMemo(
    () => storeInfoCompleteness(myClient, isLiquor),
    [myClient, isLiquor],
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="admin-page-heading">Dashboard</h1>
        <p className="admin-page-subtitle mt-2">
          Signed in as <span className="text-white">{role}</span>
          {clientId ? (
            <>
              {' '}
              · Store <span className="text-white">{clientId}</span>
            </>
          ) : null}
        </p>
      </div>
      <div
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
          showAccessories ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
        }`}
      >
        <div className="admin-card p-5">
          <p className="text-xs uppercase tracking-wide text-brand-saffron">Products (your store)</p>
          <p className="mt-2 font-display text-5xl text-white">{productCountForStore}</p>
          {isWatches ? (
            <p className="mt-1 text-xs text-gray-400">Watches &amp; toys (Products page)</p>
          ) : null}
        </div>
        {showAccessories ? (
          <div className="admin-card p-5">
            <p className="text-xs uppercase tracking-wide text-brand-saffron">Accessories (your store)</p>
            <p className="mt-2 font-display text-5xl text-white">{accessoryCountForStore}</p>
            <p className="mt-1 text-xs text-gray-400">
              {isWatches
                ? 'Cables, headphones, phone accessories & gadgets'
                : 'Cases, chargers, cables & more'}
            </p>
          </div>
        ) : null}
        <div className={`admin-card p-5 sm:col-span-2 ${showAccessories ? 'lg:col-span-1' : ''}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-saffron">Store info</p>
              <p className="mt-2 font-display text-5xl text-white">{completeness.percent}%</p>
              <p className="mt-1 text-sm text-gray-400">
                {completeness.filled}/{completeness.total} fields on{' '}
                <span className="text-white">Store Info</span>
              </p>
            </div>
            <Link
              to="/store-info"
              className="inline-flex min-h-[44px] shrink-0 items-center text-xs font-semibold text-brand-saffron hover:text-brand-saffronHover hover:underline"
            >
              Edit
            </Link>
          </div>
          <div
            className="mt-4 h-2 overflow-hidden rounded-full bg-brand-bg"
            role="progressbar"
            aria-valuenow={completeness.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Store profile completeness"
          >
            <div
              className="h-full rounded-full bg-brand-saffron shadow-[0_0_12px_rgba(255,107,0,0.5)] transition-[width]"
              style={{ width: `${completeness.percent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {isLiquor
              ? 'Phone, address, timings, Instagram, and Facebook.'
              : 'WhatsApp, address, timings, Instagram, and Facebook.'}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-400">
        Use the sidebar to manage your scope. Mock data resets on full page reload unless you add
        persistence later.
      </p>
    </div>
  );
}

function SuperadminDashboard(): JSX.Element {
  const { clients } = useAdminData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), SKELETON_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  const totalClients = clients.length;
  const activeClients = useMemo(
    () => clients.filter((c) => c?.id && c.status === 'active').length,
    [clients],
  );

  const mrrByCurrency = useMemo(() => {
    const totals: Partial<Record<CurrencyCode, number>> = {};
    for (const c of clients.filter((x) => x?.id && (x.status === 'active' || x.status === 'trial'))) {
      const code = getClientCurrency(c);
      totals[code] = (totals[code] ?? 0) + c.billing.planMonthlyInr;
    }
    return totals;
  }, [clients]);

  const overdueCount = useMemo(
    () =>
      clients.filter(
        (c) => c?.id && c.status !== 'suspended' && isDueOverdue(c.billing.nextDue),
      ).length,
    [clients],
  );

  const activity = useMemo(() => buildActivityFeed(clients), [clients]);

  const needingAttention = useMemo(() => {
    const overdue = clients.filter(
      (c) => c?.id && c.status !== 'suspended' && isDueOverdue(c.billing.nextDue),
    );
    const neverIn = clients.filter((c) => c?.id && c.adminLastLoginAt === null);
    return { overdue, neverIn };
  }, [clients]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="admin-page-heading">Dashboard</h1>
        <p className="admin-page-subtitle mt-2">Platform overview and recent store activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <div className="admin-card p-5">
              <p className="text-xs uppercase tracking-wide text-brand-saffron">Total clients</p>
              <p className="mt-2 font-display text-5xl text-white">{totalClients}</p>
            </div>
            <div className="admin-card p-5">
              <p className="text-xs uppercase tracking-wide text-brand-saffron">Active clients</p>
              <p className="mt-2 font-display text-5xl text-white">{activeClients}</p>
            </div>
            <div className="admin-card p-5">
              <p className="text-xs uppercase tracking-wide text-brand-saffron">MRR by currency</p>
              <div className="mt-2 space-y-1">
                {(Object.entries(mrrByCurrency) as [CurrencyCode, number][]).map(([code, amount]) => (
                  <p key={code} className="font-display text-2xl text-white">
                    {formatMoney(amount, code)}
                  </p>
                ))}
                {Object.keys(mrrByCurrency).length === 0 ? (
                  <p className="font-display text-4xl text-white">—</p>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-gray-400">Active + trial plans</p>
            </div>
            <div className="admin-card p-5">
              <p className="text-xs uppercase tracking-wide text-brand-saffron">Payments overdue</p>
              <p className="mt-2 font-display text-5xl text-white">{overdueCount}</p>
              <p className="mt-1 text-xs text-gray-400">Stores past next due date</p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="admin-card min-w-0 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-saffron">
            Recent activity
          </h2>
          <ul className="mt-4 divide-y divide-white/10">
            {activity.length === 0 ? (
              <li className="py-6 text-center text-sm text-gray-400">No activity yet.</li>
            ) : (
              activity.map((row) => (
                <li key={row.id} className="flex gap-3 py-3 first:pt-0">
                  {row.label.includes('logged') ? (
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-brand-saffron" aria-hidden />
                  ) : (
                    <Package className="mt-0.5 h-4 w-4 shrink-0 text-brand-saffron" aria-hidden />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white">
                      <span className="font-medium break-words">{row.storeName}</span>{' '}
                      <span className="break-words text-gray-400">{row.label}</span>
                    </p>
                    <p className="text-xs text-gray-500 break-words">
                      {formatActivityTime(new Date(row.at).toISOString())}
                    </p>
                    <Link
                      to={`/clients/${row.clientId}`}
                      className="mt-1 inline-flex min-h-[44px] items-center text-xs font-semibold text-brand-saffron hover:underline"
                    >
                      View client
                    </Link>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="admin-card min-w-0 p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-saffron">
            <AlertTriangle className="h-4 w-4" aria-hidden />
            Clients needing attention
          </h2>

          <div className="mt-4 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Overdue payments
              </p>
              {needingAttention.overdue.length === 0 ? (
                <p className="mt-2 text-sm text-gray-400">None — all current.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {needingAttention.overdue.map((c) => (
                    <li
                      key={c.id}
                      className="flex flex-col gap-2 rounded-xl border border-white/10 bg-brand-bg/50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="min-w-0 break-words text-sm text-white">{c.storeName}</span>
                      <Link
                        to={`/clients/${c.id}`}
                        className="inline-flex min-h-[44px] shrink-0 items-center text-xs font-semibold text-brand-saffron hover:underline sm:ms-auto"
                      >
                        Open
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Never logged in
              </p>
              {needingAttention.neverIn.length === 0 ? (
                <p className="mt-2 text-sm text-gray-400">All owners have signed in at least once.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {needingAttention.neverIn.map((c) => (
                    <li
                      key={c.id}
                      className="flex flex-col gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="min-w-0 break-words text-sm text-white">{c.storeName}</span>
                      <Link
                        to={`/clients/${c.id}`}
                        className="inline-flex min-h-[44px] shrink-0 items-center text-xs font-semibold text-brand-saffron hover:underline sm:ms-auto"
                      >
                        Open
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function Dashboard(): JSX.Element {
  const { isSuperadmin } = useAuthContext();
  if (isSuperadmin) {
    return (
      <PageTransition>
        <SuperadminDashboard />
      </PageTransition>
    );
  }
  return (
    <PageTransition>
      <AdminStoreDashboard />
    </PageTransition>
  );
}
