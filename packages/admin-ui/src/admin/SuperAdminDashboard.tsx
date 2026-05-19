import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Package, User } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { SKELETON_DELAY_MS } from '../constants';
import { isWatchesStoreTemplate } from '../constants/templates';
import { supportsAccessoriesCatalog } from '../utils/catalogAccessories';
import type { Client } from '../types';
import { useAdminRoutes } from '../context/AdminConfigContext';
import { SkeletonCard } from '../components/AdminSkeleton';
import type { CurrencyCode } from '../constants/countryCurrency';
import { formatMoney } from '../utils/formatCurrency';
import { getClientCurrency } from '../utils/clientCurrency';

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

export function SuperAdminDashboard(): JSX.Element {
  const routes = useAdminRoutes();
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
                {(Object.entries(mrrByCurrency) as [CurrencyCode | undefined, number][])
                  .filter((entry): entry is [CurrencyCode, number] => Boolean(entry[0]))
                  .map(([code, amount]) => (
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
                      to={routes.clientDetail(row.clientId)}
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
                        to={routes.clientDetail(c.id)}
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
                        to={routes.clientDetail(c.id)}
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
