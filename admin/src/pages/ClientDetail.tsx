import React, { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  ExternalLink,
  KeyRound,
  LogIn,
  Package,
  Pencil,
  Puzzle,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { showToast } from '../utils/showToast';
import { ConfirmModal } from '../components/ConfirmModal';
import { PageTransition } from '../components/PageTransition';
import {
  formatAdminDateTime,
  formatAdminLongDate,
  formatRelativeFromNow,
} from '../utils/dateDisplay';
import { isClientPaymentOverdue } from '../utils/clientBilling';
import { startImpersonation } from '../utils/jwt';

function formatInr(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrst23456789!#';
  let out = '';
  for (let i = 0; i < 10; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)] ?? 'x';
  }
  return out;
}

type StoreEditDraft = {
  storeName: string;
  whatsapp: string;
  address: string;
  timings: string;
  instagram: string;
};

const emptyDraft: StoreEditDraft = {
  storeName: '',
  whatsapp: '',
  address: '',
  timings: '',
  instagram: '',
};

export function ClientDetail(): JSX.Element {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const {
    clients,
    setClients,
    products,
    accessories,
    updateClient,
    markPaymentReceived,
    addClientNote,
    deleteClientNote,
  } = useAdminData();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<StoreEditDraft>(emptyDraft);
  const [noteDraft, setNoteDraft] = useState('');
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [passwordResetBanner, setPasswordResetBanner] = useState<string | null>(null);

  const client = useMemo(
    () => clients.find((c) => c.id === clientId),
    [clients, clientId],
  );

  const productCount = useMemo(
    () => products.filter((p) => p.clientId === clientId).length,
    [products, clientId],
  );

  const accessoryCount = useMemo(
    () => accessories.filter((a) => a.clientId === clientId).length,
    [accessories, clientId],
  );

  const paymentOverdue = client ? isClientPaymentOverdue(client) : false;

  const beginEdit = useCallback((): void => {
    if (!client) return;
    setDraft({
      storeName: client.storeName,
      whatsapp: client.whatsapp,
      address: client.address,
      timings: client.timings,
      instagram: client.instagram,
    });
    setIsEditing(true);
  }, [client]);

  const cancelEdit = useCallback((): void => {
    setIsEditing(false);
  }, []);

  const saveEdit = useCallback((): void => {
    if (!client) return;
    updateClient(client.id, {
      storeName: draft.storeName.trim(),
      whatsapp: draft.whatsapp.trim(),
      address: draft.address.trim(),
      timings: draft.timings.trim(),
      instagram: draft.instagram.trim(),
    });
    showToast('Client updated successfully', 'success');
    setIsEditing(false);
  }, [client, draft, updateClient]);

  const handleSaveNote = useCallback((): void => {
    if (!client || !noteDraft.trim()) return;
    addClientNote(client.id, noteDraft);
    setNoteDraft('');
    showToast('Note saved', 'success');
  }, [client, noteDraft, addClientNote]);

  const handleDeleteNote = useCallback(
    (noteId: string): void => {
      if (!client) return;
      deleteClientNote(client.id, noteId);
      showToast('Note deleted', 'success');
    },
    [client, deleteClientNote],
  );

  const handleImpersonate = useCallback((): void => {
    if (!client) return;
    startImpersonation(client.id, client.storeName);
    navigate('/dashboard');
    showToast(`Viewing as ${client.storeName}`, 'info');
  }, [client, navigate]);

  if (!clientId || !client) {
    return (
      <PageTransition>
        <div className="admin-card-static p-8 text-center">
          <p className="text-white">Client not found.</p>
          <Link
            to="/clients"
            className="mt-4 inline-block text-sm font-semibold text-brand-saffron hover:underline"
          >
            Back to all clients
          </Link>
        </div>
      </PageTransition>
    );
  }

  const handleResetPassword = (): void => {
    const next = generateTempPassword();
    setClients((prev) =>
      prev.map((c) => (c.id === client.id ? { ...c, adminTempPassword: next } : c)),
    );
    setPasswordResetBanner(next);
    showToast('Password reset successfully. New temporary password is shown below.', 'success');
    window.setTimeout(() => setPasswordResetBanner(null), 8000);
  };

  const handleDeactivate = (): void => {
    setClients((prev) =>
      prev.map((c) => (c.id === client.id ? { ...c, siteActive: false, status: 'suspended' } : c)),
    );
    setConfirmDeactivate(false);
    showToast('Site deactivated successfully', 'success');
  };

  const handleDelete = (): void => {
    setClients((prev) => prev.filter((c) => c.id !== client.id));
    setConfirmDelete(false);
    navigate('/clients', { replace: true });
  };

  const sortedNotes = useMemo(
    () => [...client.notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [client.notes],
  );

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/clients"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-400 transition hover:text-brand-saffron"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All clients
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="break-words font-display text-2xl uppercase tracking-wide text-white md:text-3xl lg:text-4xl">
              {client.storeName}
            </h1>
            <p className="text-sm text-gray-400">{client.id}</p>
            {!client.siteActive ? (
              <p className="mt-2 inline-flex rounded-md bg-red-500/15 px-2 py-1 text-xs font-medium text-red-200 ring-1 ring-red-500/30">
                Site deactivated
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleImpersonate}
            className="btn-admin-secondary inline-flex items-center gap-2"
          >
            <LogIn className="h-4 w-4 shrink-0" aria-hidden />
            Login as Client
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="admin-card min-w-0 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-saffron">
                Store info
              </h2>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="btn-admin-secondary inline-flex items-center gap-1 !text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={saveEdit}
                      className="btn-admin-primary inline-flex items-center gap-1 !text-xs"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={beginEdit}
                    className="btn-admin-secondary inline-flex items-center gap-1 !text-xs"
                  >
                    <Pencil className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    Edit
                  </button>
                )}
              </div>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="shrink-0 text-gray-400">Name</dt>
                <dd className="min-w-0 sm:max-w-[60%] sm:text-right">
                  {isEditing ? (
                    <input
                      className="admin-input !mt-0 w-full sm:text-right"
                      value={draft.storeName}
                      onChange={(e) => setDraft((d) => ({ ...d, storeName: e.target.value }))}
                      aria-label="Store name"
                    />
                  ) : (
                    <span className="break-words text-white">{client.storeName}</span>
                  )}
                </dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="shrink-0 text-gray-400">Live URL</dt>
                <dd className="min-w-0 max-w-full text-left sm:max-w-[60%] sm:text-right">
                  <a
                    href={client.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-1 break-all font-medium text-brand-saffron hover:underline sm:min-h-0"
                  >
                    {client.liveUrl}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  </a>
                  {isEditing ? (
                    <p className="mt-1 text-xs text-gray-500">Live URL is read-only in this demo.</p>
                  ) : null}
                </dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="shrink-0 text-gray-400">WhatsApp</dt>
                <dd className="min-w-0 sm:max-w-[60%] sm:text-right">
                  {isEditing ? (
                    <input
                      className="admin-input !mt-0 w-full sm:text-right"
                      value={draft.whatsapp}
                      onChange={(e) => setDraft((d) => ({ ...d, whatsapp: e.target.value }))}
                      aria-label="WhatsApp"
                    />
                  ) : (
                    <span className="break-words text-white">{client.whatsapp}</span>
                  )}
                </dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="shrink-0 text-gray-400">Address</dt>
                <dd className="min-w-0 sm:max-w-[60%] sm:text-right">
                  {isEditing ? (
                    <textarea
                      className="admin-input min-h-[5rem] !mt-0 w-full sm:text-right"
                      value={draft.address}
                      onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
                      aria-label="Address"
                      rows={3}
                    />
                  ) : (
                    <span className="max-w-full break-words text-white">{client.address}</span>
                  )}
                </dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="shrink-0 text-gray-400">Timings</dt>
                <dd className="min-w-0 sm:max-w-[60%] sm:text-right">
                  {isEditing ? (
                    <input
                      className="admin-input !mt-0 w-full sm:text-right"
                      value={draft.timings}
                      onChange={(e) => setDraft((d) => ({ ...d, timings: e.target.value }))}
                      aria-label="Timings"
                    />
                  ) : (
                    <span className="break-words text-white">{client.timings}</span>
                  )}
                </dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="shrink-0 text-gray-400">Instagram</dt>
                <dd className="min-w-0 sm:max-w-[60%] sm:text-right">
                  {isEditing ? (
                    <input
                      className="admin-input !mt-0 w-full sm:text-right"
                      value={draft.instagram}
                      onChange={(e) => setDraft((d) => ({ ...d, instagram: e.target.value }))}
                      aria-label="Instagram"
                    />
                  ) : (
                    <span className="break-words text-white">{client.instagram || '—'}</span>
                  )}
                </dd>
              </div>
            </dl>
          </section>

          <section className="admin-card min-w-0 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-saffron">
              Admin login
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="shrink-0 text-gray-400">Owner email</dt>
                <dd className="min-w-0 break-all text-white sm:text-right">{client.adminEmail}</dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="shrink-0 text-gray-400">Last login</dt>
                <dd className="min-w-0 break-words text-white sm:text-right">
                  {client.adminLastLoginAt ? formatAdminDateTime(client.adminLastLoginAt) : 'Never logged in'}
                </dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="shrink-0 text-gray-400">Temp password</dt>
                <dd className="break-all font-mono text-amber-200 sm:text-right">{client.adminTempPassword}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={handleResetPassword}
              className="btn-admin-secondary mt-4 inline-flex items-center gap-2"
            >
              <KeyRound className="h-4 w-4" aria-hidden />
              Reset password
            </button>
            {passwordResetBanner ? (
              <p
                className="mt-3 rounded-xl border border-brand-saffron/30 bg-brand-saffron/10 px-3 py-2 text-sm text-white"
                role="status"
              >
                New temporary password:{' '}
                <span className="font-mono font-semibold text-brand-saffron">{passwordResetBanner}</span>
              </p>
            ) : null}
          </section>

          <section id="catalog-products" className="admin-card min-w-0 scroll-mt-24 p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-saffron">
              <Package className="h-4 w-4" aria-hidden />
              Products
            </h2>
            <p className="mt-3 text-3xl font-display text-white">{productCount}</p>
            <p className="mt-1 text-sm text-gray-400">
              Last updated {formatAdminDateTime(client.productsLastUpdatedAt)}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">{formatRelativeFromNow(client.productsLastUpdatedAt)}</p>
            <p className="mt-3 text-xs text-gray-500">
              Store admins manage SKUs in their workspace. This count reflects mock session data.
            </p>
            <a
              href="#catalog-accessories"
              className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-saffron hover:underline"
            >
              Jump to accessories
            </a>
          </section>

          <section id="catalog-accessories" className="admin-card min-w-0 scroll-mt-24 p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-saffron">
              <Puzzle className="h-4 w-4" aria-hidden />
              Accessories
            </h2>
            <p className="mt-3 text-3xl font-display text-white">{accessoryCount}</p>
            <p className="mt-1 text-sm text-gray-400">
              Last updated {formatAdminDateTime(client.accessoriesLastUpdatedAt)}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">{formatRelativeFromNow(client.accessoriesLastUpdatedAt)}</p>
            <p className="mt-3 text-xs text-gray-500">
              Linked to the same mock catalog as products for this client.
            </p>
            <a
              href="#catalog-products"
              className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-saffron hover:underline"
            >
              Jump to products
            </a>
          </section>

          <section className="admin-card min-w-0 p-6 md:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-saffron">
                <CreditCard className="h-4 w-4" aria-hidden />
                Billing
              </h2>
              {paymentOverdue ? (
                <button
                  type="button"
                  onClick={() => markPaymentReceived(client.id)}
                  className="btn-admin-secondary inline-flex items-center gap-2 !text-xs"
                >
                  <CheckCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Mark Payment Received
                </button>
              ) : null}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-brand-bg/50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">Plan</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {formatInr(client.billing.planMonthlyInr)} / month
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-brand-bg/50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">Paid until</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {formatAdminLongDate(client.billing.paidUntil)}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-brand-bg/50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">Next due</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {formatAdminLongDate(client.billing.nextDue)}
                </p>
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
              {client.billing.paymentHistory.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-gray-400">No payment history yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-white">
                    <thead className="admin-thead">
                      <tr>
                        <th className="admin-th">Date</th>
                        <th className="admin-th">Amount</th>
                        <th className="admin-th">Status</th>
                        <th className="admin-th">Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...client.billing.paymentHistory]
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .map((row, idx) => (
                          <tr key={`${row.reference ?? row.date}-${idx}`} className="admin-tr">
                            <td className="px-4 py-2 text-gray-200">
                              <span className="block">{formatAdminLongDate(row.date)}</span>
                              <span className="mt-0.5 block text-xs text-gray-500">
                                {formatRelativeFromNow(row.date)}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-gray-200">{formatInr(row.amount)}</td>
                            <td className="px-4 py-2 capitalize text-gray-200">{row.status}</td>
                            <td className="px-4 py-2 font-mono text-xs text-gray-400">
                              {row.reference ?? '—'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          <section className="admin-card min-w-0 p-6 md:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-saffron">
              Internal Notes
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Visible only in the agency superadmin workspace (not shown to store owners).
            </p>
            <label className="mt-4 block text-sm">
              <span className="sr-only">New note</span>
              <textarea
                className="admin-input min-h-[6rem] w-full"
                placeholder="Add a note about this client..."
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                aria-label="Add a note about this client"
              />
            </label>
            <button type="button" onClick={handleSaveNote} className="btn-admin-primary mt-3">
              Save Note
            </button>
            <ul className="mt-6 space-y-4">
              {sortedNotes.length === 0 ? (
                <li className="text-sm text-gray-400">No notes yet.</li>
              ) : (
                sortedNotes.map((n) => (
                  <li
                    key={n.id}
                    className="flex gap-3 rounded-xl border border-white/10 bg-brand-bg/40 px-3 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="whitespace-pre-wrap text-sm text-white">{n.text}</p>
                      <p className="mt-1 text-xs text-gray-500">{formatRelativeFromNow(n.createdAt)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(n.id)}
                      className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg border border-white/10 text-red-300 transition hover:border-red-500/40 hover:bg-red-500/10 sm:min-h-0 sm:min-w-0 sm:p-2"
                      aria-label="Delete note"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 md:col-span-2">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-red-300" aria-hidden />
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-red-200">Danger zone</h2>
                <p className="mt-1 text-sm text-red-200/80">
                  Destructive actions require confirmation. Mock only — no external services called.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => setConfirmDeactivate(true)}
                    disabled={!client.siteActive}
                    className="w-full min-h-[44px] rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                  >
                    Deactivate site
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="w-full min-h-[44px] rounded-xl border border-red-600/50 bg-red-600/20 px-4 py-2 text-sm font-medium text-red-50 hover:bg-red-600/30 sm:w-auto"
                  >
                    Delete client
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <ConfirmModal
          open={confirmDeactivate}
          title="Deactivate site?"
          message={`This will mark ${client.storeName} as suspended and deactivate the public site flag. You can still restore data in this mock admin.`}
          confirmLabel="Deactivate"
          variant="danger"
          onConfirm={handleDeactivate}
          onCancel={() => setConfirmDeactivate(false)}
        />
        <ConfirmModal
          open={confirmDelete}
          title="Delete client?"
          message={`Permanently remove ${client.storeName} and all mock session data for this client? This cannot be undone in the demo.`}
          confirmLabel="Delete client"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      </div>
    </PageTransition>
  );
}
