import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, CreditCard } from 'lucide-react';
import { SKELETON_DELAY_MS } from '../constants';
import { useAdminData } from '../context/AdminDataContext';
import { SkeletonTable } from '../components/AdminSkeleton';
import { PageTransition } from '../components/PageTransition';
import { formatAdminLongDate } from '../utils/dateDisplay';
import { isClientPaymentOverdue } from '../utils/clientBilling';
import { formatClientMoney } from '../utils/clientCurrency';

export function Billing(): JSX.Element {
  const { clients, markPaymentReceived } = useAdminData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), SKELETON_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  const rows = useMemo(
    () =>
      [...clients].filter((c) => Boolean(c?.id)).sort((a, b) => a.storeName.localeCompare(b.storeName)),
    [clients],
  );

  return (
    <PageTransition>
    <div className="space-y-6">
      <div>
        <h1 className="admin-page-heading">Billing</h1>
        <p className="admin-page-subtitle mt-2">
          Payment status per client (billing fields on each store record).
        </p>
      </div>

      {loading ? (
        <SkeletonTable rows={4} />
      ) : (
        <div className="admin-table-shell">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <CreditCard className="size-16 text-white/20" aria-hidden />
            <h2 className="font-display text-2xl text-white/60">No billing records</h2>
            <p className="max-w-xs text-center text-sm text-white/40">
              Billing records will appear once you have active clients
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-white">
              <thead className="admin-thead">
                <tr>
                  <th className="admin-th">Store</th>
                  <th className="admin-th">Plan / mo</th>
                  <th className="admin-th hidden md:table-cell">Paid until</th>
                  <th className="admin-th">Next due</th>
                  <th className="admin-th">Status</th>
                  <th className="admin-th hidden text-right md:table-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => {
                  const overdue = isClientPaymentOverdue(c);
                  return (
                    <tr key={c.id} className="admin-tr">
                      <td className="px-4 py-3">
                        <p className="break-words font-medium text-white">{c.storeName}</p>
                        <p className="text-xs text-gray-400 break-words">{c.id}</p>
                        <div className="mt-2 flex flex-col gap-2 md:hidden">
                          {overdue ? (
                            <button
                              type="button"
                              onClick={() => markPaymentReceived(c.id)}
                              className="btn-admin-secondary inline-flex w-full items-center justify-center gap-1 !text-xs"
                            >
                              <CheckCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                              Mark Paid
                            </button>
                          ) : null}
                          <Link
                            to={`/clients/${c.id}`}
                            className="inline-flex min-h-[44px] items-center text-xs font-semibold text-brand-saffron hover:underline"
                          >
                            Client detail
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-200">
                        {formatClientMoney(c, c.billing.planMonthlyInr)}
                      </td>
                      <td className="hidden px-4 py-3 text-gray-200 md:table-cell">
                        {formatAdminLongDate(c.billing.paidUntil)}
                      </td>
                      <td className="px-4 py-3 text-gray-200">{formatAdminLongDate(c.billing.nextDue)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ring-1 ${
                            overdue
                              ? 'bg-red-500/15 text-red-200 ring-red-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/25'
                          }`}
                        >
                          {overdue ? 'Overdue' : 'Current'}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-right md:table-cell">
                        <div className="flex flex-col items-end gap-2 sm:flex-row sm:justify-end sm:gap-2">
                          {overdue ? (
                            <button
                              type="button"
                              onClick={() => markPaymentReceived(c.id)}
                              className="btn-admin-secondary inline-flex items-center gap-1 !text-xs"
                            >
                              <CheckCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                              Mark Paid
                            </button>
                          ) : null}
                          <Link
                            to={`/clients/${c.id}`}
                            className="inline-flex min-h-[44px] items-center justify-end text-xs font-semibold text-brand-saffron hover:underline"
                          >
                            Client detail
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        </div>
      )}
    </div>
    </PageTransition>
  );
}
