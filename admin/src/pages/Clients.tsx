import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Download, ExternalLink, LogIn, Search, Store } from 'lucide-react';
import Select from 'react-select';
import { format } from 'date-fns';
import { SKELETON_DELAY_MS } from '../constants';
import { useClients, type SimpleSelectOption } from '../hooks';
import { useAdminData } from '../context/AdminDataContext';
import { SkeletonTable } from '../components/AdminSkeleton';
import { PageTransition } from '../components/PageTransition';
import { adminSelectStyles } from '../utils/adminSelectStyles';
import { startImpersonation } from '../utils/jwt';
import { showToast } from '../utils/showToast';
import { formatINR } from '../utils/formatCurrency';

function escapeCsvCell(cell: string | number): string {
  const s = String(cell);
  return `"${s.replace(/"/g, '""')}"`;
}

export function Clients(): JSX.Element {
  const navigate = useNavigate();
  const { clients, toggleSiteActive } = useAdminData();
  const [loading, setLoading] = useState(true);
  const {
    filtered: filteredClients,
    search,
    setSearch,
    template: templateFilter,
    setTemplate: setTemplateFilter,
    status: statusFilter,
    setStatus: setStatusFilter,
    payment: paymentFilter,
    setPayment: setPaymentFilter,
    clearFilters,
    templateOptions,
    statusOptions,
    paymentOptions,
  } = useClients(clients);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), SKELETON_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  const exportCSV = (): void => {
    const headers = [
      'Store Name',
      'Email',
      'Template',
      'Status',
      'Plan (INR)',
      'Paid Until',
      'Next Due',
      'Live URL',
    ];

    const rows = clients.map((c) => [
      c.storeName,
      c.adminEmail,
      c.template,
      c.siteActive ? 'Active' : 'Offline',
      c.billing.planMonthlyInr,
      c.billing.paidUntil,
      c.billing.nextDue,
      c.liveUrl,
    ]);

    const csv = [headers, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully', 'success');
  };

  const handleLoginAsClient = (c: (typeof clients)[0]): void => {
    startImpersonation(c.id, c.storeName);
    navigate('/dashboard');
    showToast(`Viewing as ${c.storeName}`, 'info');
  };

  const filtersActive =
    search.trim() !== '' ||
    (templateFilter?.value ?? 'all') !== 'all' ||
    (statusFilter?.value ?? 'all') !== 'all' ||
    (paymentFilter?.value ?? 'all') !== 'all';

  const showFilteredEmpty = !loading && clients.length > 0 && filteredClients.length === 0;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="admin-page-heading">All clients</h1>
            <p className="admin-page-subtitle mt-2">Every store on the platform.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportCSV}
              className="btn-admin-secondary inline-flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4 shrink-0" aria-hidden />
              Export CSV
            </button>
            <Link
              to="/create-client"
              className="btn-admin-primary inline-flex items-center justify-center gap-2"
            >
              New client
            </Link>
          </div>
        </div>

        {!loading && clients.length > 0 ? (
          <p className="text-sm text-white/40">
            Showing {filteredClients.length} of {clients.length} clients
          </p>
        ) : null}

        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative min-w-[min(100%,220px)] flex-1 basis-[200px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
              aria-hidden
            />
            <input
              type="search"
              className="admin-input !mt-0 w-full py-2.5 pl-10"
              placeholder="Search by store name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search clients by store name"
            />
          </div>
          <div className="min-w-[160px] flex-1 sm:flex-initial">
            <span className="sr-only">Template</span>
            <Select<SimpleSelectOption, false>
              instanceId="clients-template-filter"
              inputId="clients-template-filter"
              options={templateOptions}
              value={templateFilter}
              onChange={(opt) => setTemplateFilter(opt ?? templateOptions[0])}
              styles={adminSelectStyles}
              isSearchable={false}
            />
          </div>
          <div className="min-w-[140px] flex-1 sm:flex-initial">
            <span className="sr-only">Status</span>
            <Select<SimpleSelectOption, false>
              instanceId="clients-status-filter"
              inputId="clients-status-filter"
              options={statusOptions}
              value={statusFilter}
              onChange={(opt) => setStatusFilter(opt ?? statusOptions[0])}
              styles={adminSelectStyles}
              isSearchable={false}
            />
          </div>
          <div className="min-w-[140px] flex-1 sm:flex-initial">
            <span className="sr-only">Payment</span>
            <Select<SimpleSelectOption, false>
              instanceId="clients-payment-filter"
              inputId="clients-payment-filter"
              options={paymentOptions}
              value={paymentFilter}
              onChange={(opt) => setPaymentFilter(opt ?? paymentOptions[0])}
              styles={adminSelectStyles}
              isSearchable={false}
            />
          </div>
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
            ) : showFilteredEmpty ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <Store className="size-16 text-white/20" aria-hidden />
                <h2 className="font-display text-2xl text-white/60">No matching clients</h2>
                <p className="max-w-xs text-center text-sm text-white/40">
                  Try adjusting search or filters
                </p>
                {filtersActive ? (
                  <button type="button" onClick={clearFilters} className="btn-admin-secondary">
                    Clear filters
                  </button>
                ) : null}
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
                    {filteredClients.map((c) => (
                      <tr key={c.id} className="admin-tr">
                        <td className="px-4 py-3">
                          <p className="break-words font-medium text-white">{c.storeName}</p>
                          <p className="break-words text-xs text-gray-400">{c.id}</p>
                        </td>
                        <td className="hidden px-4 py-3 font-mono text-xs text-gray-300 md:table-cell">
                          {c.template}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleSiteActive(c.id)}
                              className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
                                c.siteActive ? 'bg-green-500' : 'bg-white/20'
                              }`}
                              aria-pressed={c.siteActive}
                              aria-label={c.siteActive ? 'Deactivate site' : 'Activate site'}
                            >
                              <span
                                className={`mt-0.5 inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                                  c.siteActive ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs ${
                                c.siteActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {c.siteActive ? 'Live' : 'Offline'}
                            </span>
                          </div>
                        </td>
                        <td className="hidden px-4 py-3 text-gray-200 md:table-cell">
                          {c.billing.paidUntil}
                        </td>
                        <td className="hidden px-4 py-3 text-gray-200 md:table-cell">
                          {formatINR(c.billing.planMonthlyInr)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-col items-end gap-2 sm:flex-row sm:justify-end sm:gap-2">
                            <button
                              type="button"
                              onClick={() => handleLoginAsClient(c)}
                              className="btn-admin-secondary inline-flex items-center gap-1 !text-xs"
                            >
                              <LogIn className="h-3.5 w-3.5 shrink-0" aria-hidden />
                              Login as Client
                            </button>
                            <Link
                              to={`/clients/${c.id}`}
                              className="btn-admin-secondary inline-flex items-center gap-1 !text-xs"
                            >
                              Client detail
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                            </Link>
                          </div>
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
