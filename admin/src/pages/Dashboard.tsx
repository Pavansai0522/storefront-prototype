import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Circle, Package, PartyPopper, User } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { showToast } from '../utils/showToast';
import type { Client } from '../mock/clients';
import { getJwtPayloadFromStorage } from '../utils/jwt';
import { SkeletonCard } from '../components/AdminSkeleton';
import { PageTransition } from '../components/PageTransition';

const STORE_INFO_FIELDS = 5;

const STORE_SETUP_TOTAL = 7;

type StoreSetupRow = {
  label: string;
  done: boolean;
  fixTo: string;
};

function buildStoreSetupRows(
  client: Client | undefined,
  productCount: number,
  accessoryCount: number,
): { rows: StoreSetupRow[]; percent: number } {
  const rows: StoreSetupRow[] = [
    {
      label: 'Store name set',
      done: Boolean(client?.storeName?.trim()),
      fixTo: '/store-info',
    },
    {
      label: 'WhatsApp number set',
      done: Boolean(client?.whatsapp?.trim()),
      fixTo: '/store-info',
    },
    {
      label: 'Address set',
      done: Boolean(client?.address?.trim()),
      fixTo: '/store-info',
    },
    {
      label: 'Timings set',
      done: Boolean(client?.timings?.trim()),
      fixTo: '/store-info',
    },
    {
      label: 'Instagram handle set',
      done: Boolean(client?.instagram?.trim()),
      fixTo: '/store-info',
    },
    {
      label: 'At least 1 product added',
      done: productCount >= 1,
      fixTo: '/products',
    },
    {
      label: 'At least 1 accessory added',
      done: accessoryCount >= 1,
      fixTo: '/accessories',
    },
  ];
  const completed = rows.filter((r) => r.done).length;
  const percent = Math.round((completed / STORE_SETUP_TOTAL) * 100);
  return { rows, percent };
}

function storeInfoCompleteness(client: Client | undefined): {
  filled: number;
  total: number;
  percent: number;
} {
  if (!client) {
    return { filled: 0, total: STORE_INFO_FIELDS, percent: 0 };
  }
  const filled = [
    client.whatsapp.trim(),
    client.address.trim(),
    client.timings.trim(),
    client.instagram.trim(),
    client.facebook.trim(),
  ].filter(Boolean).length;
  const total = STORE_INFO_FIELDS;
  return { filled, total, percent: Math.round((filled / total) * 100) };
}

function formatInr(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
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
    items.push({
      id: `${c.id}-products`,
      at: new Date(c.productsLastUpdatedAt).getTime(),
      label: 'Updated products catalog',
      storeName: c.storeName,
      clientId: c.id,
    });
    items.push({
      id: `${c.id}-accessories`,
      at: new Date(c.accessoriesLastUpdatedAt).getTime(),
      label: 'Updated accessories catalog',
      storeName: c.storeName,
      clientId: c.id,
    });
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

type OutStockRow = {
  id: string;
  name: string;
  category: string;
  kind: 'product' | 'accessory';
};

function buildOutOfStockSummary(productCount: number, accessoryCount: number): string {
  if (productCount > 0 && accessoryCount > 0) {
    return `${productCount} product${productCount === 1 ? '' : 's'} and ${accessoryCount} accessor${accessoryCount === 1 ? 'y' : 'ies'} are out of stock`;
  }
  if (productCount > 0) {
    return `${productCount} product${productCount === 1 ? '' : 's'} ${productCount === 1 ? 'is' : 'are'} out of stock`;
  }
  return `${accessoryCount} accessor${accessoryCount === 1 ? 'y' : 'ies'} ${accessoryCount === 1 ? 'is' : 'are'} out of stock`;
}

function AdminStoreDashboard(): JSX.Element {
  const payload = getJwtPayloadFromStorage();
  const { clients, products, accessories, setProducts, setAccessories } = useAdminData();
  const clientId = payload?.clientId ?? null;

  const myClient = useMemo(
    () => (clientId ? clients.find((c) => c.id === clientId) : undefined),
    [clients, clientId],
  );

  const productCountForStore = useMemo(
    () => (clientId ? products.filter((p) => p.clientId === clientId).length : products.length),
    [products, clientId],
  );

  const accessoryCountForStore = useMemo(
    () =>
      clientId ? accessories.filter((a) => a.clientId === clientId).length : accessories.length,
    [accessories, clientId],
  );

  const completeness = useMemo(() => storeInfoCompleteness(myClient), [myClient]);

  const storeSetup = useMemo(
    () => buildStoreSetupRows(myClient, productCountForStore, accessoryCountForStore),
    [myClient, productCountForStore, accessoryCountForStore],
  );

  const outOfStockProducts = useMemo(
    () =>
      clientId
        ? products.filter((p) => p.clientId === clientId && !p.inStock)
        : products.filter((p) => !p.inStock),
    [products, clientId],
  );

  const outOfStockAccessories = useMemo(
    () =>
      clientId
        ? accessories.filter((a) => a.clientId === clientId && !a.inStock)
        : accessories.filter((a) => !a.inStock),
    [accessories, clientId],
  );

  const outOfStockTotal = outOfStockProducts.length + outOfStockAccessories.length;

  const stockAlertRows = useMemo((): OutStockRow[] => {
    const combined: OutStockRow[] = [
      ...outOfStockProducts.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        kind: 'product' as const,
      })),
      ...outOfStockAccessories.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        kind: 'accessory' as const,
      })),
    ];
    return combined.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }, [outOfStockProducts, outOfStockAccessories]);

  const stockAlertPreview = useMemo(() => stockAlertRows.slice(0, 3), [stockAlertRows]);

  const stockSummaryMessage = useMemo(
    () => buildOutOfStockSummary(outOfStockProducts.length, outOfStockAccessories.length),
    [outOfStockProducts.length, outOfStockAccessories.length],
  );

  const setupBorderClass =
    storeSetup.percent <= 40
      ? '!border-red-500/30'
      : storeSetup.percent <= 79
        ? '!border-orange-500/30'
        : '!border-green-500/30';

  const setupHeadingClass =
    storeSetup.percent <= 40
      ? 'text-red-400'
      : storeSetup.percent <= 79
        ? 'text-orange-400'
        : 'text-green-400';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="admin-page-heading">Dashboard</h1>
        <p className="admin-page-subtitle mt-2">
          Signed in as <span className="text-white">{payload?.role}</span>
          {payload?.clientId ? (
            <>
              {' '}
              · Store <span className="text-white">{payload.clientId}</span>
            </>
          ) : null}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="admin-card p-5">
          <p className="text-xs uppercase tracking-wide text-brand-saffron">Products (your store)</p>
          <p className="mt-2 font-display text-5xl text-white">{productCountForStore}</p>
        </div>
        <div className="admin-card p-5">
          <p className="text-xs uppercase tracking-wide text-brand-saffron">Accessories (your store)</p>
          <p className="mt-2 font-display text-5xl text-white">{accessoryCountForStore}</p>
        </div>
        <div className="admin-card p-5 sm:col-span-2 lg:col-span-1">
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
            WhatsApp, address, timings, Instagram, and Facebook.
          </p>
        </div>
      </div>

      {payload?.role === 'admin' ? (
        <div className={`admin-card px-4 py-4 md:p-6 ${setupBorderClass}`}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className={`font-display text-xl uppercase tracking-wide ${setupHeadingClass}`}>
                Store Setup
              </h2>
              <p className="mt-1 text-sm text-white">{storeSetup.percent}%</p>
            </div>
          </div>
          <div
            className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-valuenow={storeSetup.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Store setup completeness"
          >
            <div
              className="h-2 rounded-full bg-brand-saffron transition-all duration-500"
              style={{ width: `${storeSetup.percent}%` }}
            />
          </div>

          {storeSetup.percent === 100 ? (
            <div className="mt-6 flex flex-wrap items-center gap-3 text-green-400">
              <PartyPopper className="h-6 w-6 shrink-0" aria-hidden />
              <p className="min-w-0 flex-1 break-words text-sm font-medium">
                Your store is fully set up and ready!
              </p>
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
              {storeSetup.rows.map((row) => (
                <li key={row.label} className="flex items-start gap-3">
                  {row.done ? (
                    <>
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" aria-hidden />
                      <span className="min-w-0 break-words text-sm text-white/60 line-through">
                        {row.label}
                      </span>
                    </>
                  ) : (
                    <>
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-white/20" aria-hidden />
                      <Link
                        to={row.fixTo}
                        className="min-w-0 break-words text-sm text-white/80 underline-offset-2 hover:text-white hover:underline"
                      >
                        {row.label}
                      </Link>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {outOfStockTotal > 0 ? (
        <div className="admin-card border border-orange-500/30 px-4 py-4 md:p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 shrink-0 text-orange-400" aria-hidden />
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl uppercase tracking-wide text-orange-400">
                Stock Alerts
              </h2>
              <p className="mt-2 text-sm text-white/80">{stockSummaryMessage}</p>
              <ul className="mt-4 space-y-3">
                {stockAlertPreview.map((row) => (
                  <li
                    key={`${row.kind}-${row.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-white/80">{row.name}</p>
                      <span className="mt-1 inline-flex rounded-md px-2 py-0.5 text-xs text-white/40 ring-1 ring-white/10">
                        {row.category}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-admin-secondary shrink-0 px-3 py-1.5 text-xs"
                      onClick={() => {
                        if (row.kind === 'product') {
                          setProducts((prev) =>
                            prev.map((p) => (p.id === row.id ? { ...p, inStock: true } : p)),
                          );
                        } else {
                          setAccessories((prev) =>
                            prev.map((a) => (a.id === row.id ? { ...a, inStock: true } : a)),
                          );
                        }
                        showToast('Product marked in stock', 'success');
                      }}
                    >
                      Mark in stock
                    </button>
                  </li>
                ))}
              </ul>
              {outOfStockTotal > 3 ? (
                <Link
                  to="/products"
                  className="mt-4 inline-flex min-h-[44px] items-center text-sm text-brand-saffron hover:underline"
                >
                  View all {outOfStockTotal} out of stock →
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

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
    const t = window.setTimeout(() => setLoading(false), 600);
    return () => window.clearTimeout(t);
  }, []);

  const totalClients = clients.length;
  const activeClients = useMemo(() => clients.filter((c) => c.status === 'active').length, [clients]);

  const mrr = useMemo(
    () =>
      clients
        .filter((c) => c.status === 'active' || c.status === 'trial')
        .reduce((sum, c) => sum + c.billing.planMonthlyInr, 0),
    [clients],
  );

  const overdueCount = useMemo(
    () =>
      clients.filter(
        (c) => c.status !== 'suspended' && isDueOverdue(c.billing.nextDue),
      ).length,
    [clients],
  );

  const activity = useMemo(() => buildActivityFeed(clients), [clients]);

  const needingAttention = useMemo(() => {
    const overdue = clients.filter(
      (c) => c.status !== 'suspended' && isDueOverdue(c.billing.nextDue),
    );
    const neverIn = clients.filter((c) => c.adminLastLoginAt === null);
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
              <p className="text-xs uppercase tracking-wide text-brand-saffron">MRR (INR)</p>
              <p className="mt-2 font-display text-4xl text-white">{formatInr(mrr)}</p>
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
  const role = getJwtPayloadFromStorage()?.role;
  if (role === 'superadmin') {
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
