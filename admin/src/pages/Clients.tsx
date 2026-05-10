import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Store } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { SkeletonTable } from '../components/AdminSkeleton';
import { PageTransition } from '../components/PageTransition';
import type { ClientStatus } from '../mock/clients';

function formatInr(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

function statusStyles(status: ClientStatus): string {
  switch (status) {
    case 'active':
      return 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/25';
    case 'trial':
      return 'bg-amber-500/15 text-amber-200 ring-amber-500/25';
    case 'suspended':
      return 'bg-red-500/15 text-red-200 ring-red-500/25';
    default:
      return 'bg-gray-500/15 text-gray-300 ring-gray-500/25';
  }
}

export function Clients(): JSX.Element {
  const { clients } = useAdminData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 600);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <PageTransition>
    <div className="space-y-6">
      <div>
        <h1 className="admin-page-heading">All clients</h1>
        <p className="admin-page-subtitle mt-2">Every store on the platform.</p>
      </div>

      {loading ? (
        <SkeletonTable rows={4} />
      ) : (
        <div className="admin-table-shell">
        {clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <Store className="size-16 text-white/20" aria-hidden />
            <h2 className="font-display text-2xl text-white/60">No clients yet</h2>
            <p className="max-w-xs text-center text-sm text-white/40">
              Onboard your first client to get started
            </p>
            <Link
              to="/create-client"
              className="btn-admin-primary inline-flex w-full items-center justify-center sm:w-auto"
            >
              + Create First Client
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-white">
              <thead className="admin-thead">
                <tr>
                  <th className="admin-th">Store</th>
                  <th className="admin-th hidden md:table-cell">Template</th>
                  <th className="admin-th">Status</th>
                  <th className="admin-th hidden md:table-cell">Paid until</th>
                  <th className="admin-th hidden md:table-cell">Monthly</th>
                  <th className="admin-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="admin-tr">
                    <td className="px-4 py-3">
                      <p className="break-words font-medium text-white">{c.storeName}</p>
                      <p className="text-xs text-gray-400 break-words">{c.id}</p>
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-gray-300 md:table-cell">
                      {c.template}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ring-1 ${statusStyles(
                          c.status,
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-gray-200 md:table-cell">{c.billing.paidUntil}</td>
                    <td className="hidden px-4 py-3 text-gray-200 md:table-cell">
                      {formatInr(c.billing.planMonthlyInr)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/clients/${c.id}`}
                        className="btn-admin-secondary inline-flex items-center gap-1 !text-xs"
                      >
                        Client detail
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    </td>
                  </tr>
                ))}
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
