import { Link } from 'react-router-dom';
import { UserCog } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

import { useAdminRoutes } from '../context/AdminConfigContext';

export function RequireStoreBanner(): JSX.Element | null {
  const routes = useAdminRoutes();
  const { isSuperadmin, effectiveClientId, isImpersonating } = useProfile();

  if (!isSuperadmin || effectiveClientId) {
    return null;
  }

  return (
    <div
      className="mb-6 flex flex-col gap-3 rounded-xl border border-brand-saffron/40 bg-brand-saffron/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
      role="status"
    >
      <div className="flex min-w-0 items-start gap-3">
        <UserCog className="mt-0.5 h-5 w-5 shrink-0 text-brand-saffron" aria-hidden />
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">Choose a store to manage</p>
          <p className="mt-1 text-sm text-gray-400">
            Open <strong className="text-white">Clients</strong> and use{' '}
            <strong className="text-white">Manage as store</strong> on PR Watches before editing products or store
            info.
            {isImpersonating ? '' : ' Changes save to the wrong store if you skip this step.'}
          </p>
        </div>
      </div>
      <Link to={routes.CLIENTS} className="btn-admin-secondary shrink-0 text-center text-sm">
        Go to clients
      </Link>
    </div>
  );
}
