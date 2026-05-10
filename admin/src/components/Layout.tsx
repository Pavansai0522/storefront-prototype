import { useMemo, useState } from 'react';

import { Eye, LogOut, Menu } from 'lucide-react';

import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Sidebar } from './Sidebar';

import { useAdminData } from '../context/AdminDataContext';

import {
  clearStoredToken,
  getJwtPayloadFromStorage,
  isImpersonating,
  ORIGINAL_ADMIN_JWT_KEY,
  stopImpersonation,
} from '../utils/jwt';

function RequirePasswordChange(): JSX.Element {
  const location = useLocation();
  const payload = getJwtPayloadFromStorage();
  if (
    payload?.role === 'admin' &&
    payload.firstLogin === true &&
    location.pathname !== '/change-password'
  ) {
    return <Navigate to="/change-password" replace />;
  }
  return <Outlet />;
}

export function Layout(): JSX.Element {
  const navigate = useNavigate();

  const payload = getJwtPayloadFromStorage();

  const role = payload?.role ?? 'admin';

  const viewingAs = isImpersonating() ? payload : null;

  const [isOpen, setIsOpen] = useState(false);

  const { clients } = useAdminData();

  const liveUrl = useMemo((): string | null => {
    if (role !== 'admin' || !payload?.clientId) {
      return null;
    }

    return clients.find((c) => c.id === payload.clientId)?.liveUrl ?? null;
  }, [clients, role, payload?.clientId]);

  const handleLogout = (): void => {
    localStorage.removeItem(ORIGINAL_ADMIN_JWT_KEY);
    clearStoredToken();
    navigate('/', { replace: true });
  };

  const handleExitImpersonation = (): void => {
    stopImpersonation();
    navigate('/clients');
  };

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <Sidebar role={role} isOpen={isOpen} setIsOpen={setIsOpen} liveUrl={liveUrl} />

      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <div className="flex min-h-screen flex-1 flex-col">
        {viewingAs ? (
          <div className="flex flex-col gap-2 border-b border-brand-saffron/40 bg-brand-saffron/20 px-4 py-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <Eye className="h-4 w-4 shrink-0 text-brand-saffron" aria-hidden />
              <span className="text-sm text-white">
                Viewing as <strong className="break-words">{viewingAs.storeName}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleExitImpersonation}
              className="shrink-0 text-left text-xs font-semibold text-brand-saffron transition-colors duration-200 hover:text-white sm:text-right"
            >
              Exit → Back to Superadmin
            </button>
          </div>
        ) : null}

        <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-brand-bg/90 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg border border-white/10 p-2 text-white transition hover:border-white/20 hover:bg-white/5 md:hidden"
              aria-label="Open menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>

            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-gray-400">Signed in as</p>
              <p className="text-sm font-medium text-white">
                {payload?.email ?? 'Admin'}
                <span className="ml-2 rounded-lg border border-brand-saffron/40 bg-brand-saffron/15 px-2 py-0.5 text-xs font-semibold text-brand-saffron">
                  {role}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sign out"
            className="btn-admin-secondary inline-flex shrink-0 items-center justify-center gap-2 max-md:min-h-[44px] max-md:min-w-[44px] max-md:gap-0 max-md:p-2"
          >
            <LogOut className="h-5 w-5 shrink-0 md:h-4 md:w-4" aria-hidden />
            <span className="hidden md:inline">Sign out</span>
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <RequirePasswordChange />
        </main>
      </div>
    </div>
  );
}
