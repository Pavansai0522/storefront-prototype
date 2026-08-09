import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Building2,
  CreditCard,
  ExternalLink,
  LayoutDashboard,
  Lock,
  Package,
  Puzzle,
  ShoppingBag,
  Store,
  UserCog,
  Users,
  Watch,
  X,
  UtensilsCrossed,
} from 'lucide-react';
import type { Nullable } from '../types';
import { isLiquorStoreTemplate, isRestaurantStoreTemplate, isWatchesStoreTemplate } from '../constants/templates';
import { useAdminRoutes } from '../context/AdminConfigContext';
import type { UserRole } from '../types';

const linkBase =
  'flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300';
const linkIdle = 'text-gray-400 hover:bg-white/5 hover:text-white';
const linkActive =
  'bg-brand-saffron text-white shadow-[0_0_15px_rgba(255,107,0,0.35)]';

type SidebarProps = {
  role: UserRole;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  liveUrl: Nullable<string>;
  clientTemplate: Nullable<string>;
};

export function Sidebar({ role, isOpen, setIsOpen, liveUrl, clientTemplate }: SidebarProps): JSX.Element {
  const routes = useAdminRoutes();

  const closeMobile = (): void => {
    setIsOpen(false);
  };

  const isLiquorStore = isLiquorStoreTemplate(clientTemplate);
  const isWatchesStore = isWatchesStoreTemplate(clientTemplate);
  const isRestaurantStore = isRestaurantStoreTemplate(clientTemplate);

  return (
    <aside
      className={[
        'flex w-56 shrink-0 flex-col border-r border-white/5 bg-surface-sidebar',
        'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300',
        'md:sticky md:top-0 md:z-auto md:h-screen md:self-start',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0',
      ].join(' ')}
    >
      <div className="border-b border-white/5 px-4 py-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2 text-white">
            <UserCog className="h-6 w-6 shrink-0 text-brand-saffron" aria-hidden />
            <div className="min-w-0">
              <p className="font-display text-lg uppercase tracking-wide leading-tight">my-agency</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg border border-white/10 p-2 text-gray-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white md:hidden"
            aria-label="Close menu"
            onClick={closeMobile}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
      <nav className="admin-scroll-rail flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Main">
        <NavLink
          to={routes.DASHBOARD}
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
          onClick={closeMobile}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
          Dashboard
        </NavLink>

        {role === 'superadmin' ? (
          <>
            <NavLink
              to={routes.CLIENTS}
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              onClick={closeMobile}
            >
              <Users className="h-4 w-4 shrink-0" aria-hidden />
              All clients
            </NavLink>
            <NavLink
              to={routes.CREATE_CLIENT}
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              onClick={closeMobile}
            >
              <Building2 className="h-4 w-4 shrink-0" aria-hidden />
              Create client
            </NavLink>
            <NavLink
              to={routes.BILLING}
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              onClick={closeMobile}
            >
              <CreditCard className="h-4 w-4 shrink-0" aria-hidden />
              Billing
            </NavLink>
            <NavLink
              to={routes.WATCHES_TEMPLATE_PREVIEW}
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              onClick={closeMobile}
            >
              <Watch className="h-4 w-4 shrink-0" aria-hidden />
              Watches template
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to={routes.PRODUCTS}
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              onClick={closeMobile}
            >
              {isRestaurantStore ? (
                <UtensilsCrossed className="h-4 w-4 shrink-0" aria-hidden />
              ) : (
                <Package className="h-4 w-4 shrink-0" aria-hidden />
              )}
              {isRestaurantStore ? 'Menu' : 'Products'}
            </NavLink>
            {isWatchesStore ? (
              <NavLink
                to={routes.ORDERS}
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
                onClick={closeMobile}
              >
                <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden />
                Orders
              </NavLink>
            ) : null}
            {!isLiquorStore && !isWatchesStore && !isRestaurantStore ? (
              <NavLink
                to={routes.ACCESSORIES}
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
                onClick={closeMobile}
              >
                <Puzzle className="h-4 w-4 shrink-0" aria-hidden />
                Accessories
              </NavLink>
            ) : null}
            <NavLink
              to={routes.STORE_INFO}
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              onClick={closeMobile}
            >
              <Store className="h-4 w-4 shrink-0" aria-hidden />
              Store Info
            </NavLink>
          </>
        )}
      </nav>

      {role === 'admin' ? (
        <div className="mt-auto space-y-3 border-t border-white/5 p-3">
          <button
            type="button"
            disabled={!liveUrl}
            onClick={() => {
              if (liveUrl) {
                window.open(liveUrl, '_blank', 'noopener,noreferrer');
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 transition-colors duration-200 hover:border-brand-saffron hover:text-brand-saffron disabled:pointer-events-none disabled:opacity-40"
          >
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
            Preview Store
          </button>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Settings
            </p>
            <NavLink
              to={routes.CHANGE_PASSWORD}
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              onClick={closeMobile}
            >
              <Lock className="h-4 w-4 shrink-0" aria-hidden />
              Change Password
            </NavLink>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
