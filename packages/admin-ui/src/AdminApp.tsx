import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AdminLogin } from './admin/AdminLogin';
import { AdminShell } from './admin/AdminShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminConfigProvider, useAdminRoutes } from './context/AdminConfigContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { AdminDataProvider } from './context/AdminDataContext';
import { Billing } from './pages/Billing';
import { ClientDetail } from './pages/ClientDetail';
import { Clients } from './pages/Clients';
import { CreateClient } from './pages/CreateClient';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Accessories } from './pages/Accessories';
import { StoreInfo } from './pages/StoreInfo';
import { ChangePassword } from './pages/ChangePassword';
import { WatchesTemplatePreview } from './pages/WatchesTemplatePreview';
import { TOAST_DURATION_MS } from './constants';
import './styles/admin.css';

export type AdminAppProps = {
  basePath?: string;
  templateId?: string;
  enforceClientId?: string;
  storefrontOrigin?: string;
};

function SuperadminOnly({ children }: { children: JSX.Element }): JSX.Element {
  const routes = useAdminRoutes();
  const { isSuperadmin } = useAuthContext();
  if (!isSuperadmin) {
    return <Navigate to={routes.DASHBOARD} replace />;
  }
  return children;
}

function AdminOnly({ children }: { children: JSX.Element }): JSX.Element {
  const routes = useAdminRoutes();
  const { isAdmin, isSuperadmin } = useAuthContext();
  if (!isAdmin && !isSuperadmin) {
    return <Navigate to={routes.DASHBOARD} replace />;
  }
  return children;
}

function AdminRoutes(): JSX.Element {
  const routes = useAdminRoutes();

  return (
    <Routes>
      <Route index element={<AdminLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminShell />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="clients"
            element={
              <SuperadminOnly>
                <Clients />
              </SuperadminOnly>
            }
          />
          <Route
            path="clients/:clientId"
            element={
              <SuperadminOnly>
                <ClientDetail />
              </SuperadminOnly>
            }
          />
          <Route
            path="create-client"
            element={
              <SuperadminOnly>
                <CreateClient />
              </SuperadminOnly>
            }
          />
          <Route
            path="billing"
            element={
              <SuperadminOnly>
                <Billing />
              </SuperadminOnly>
            }
          />
          <Route
            path="templates/watches-store-v2"
            element={
              <SuperadminOnly>
                <WatchesTemplatePreview />
              </SuperadminOnly>
            }
          />
          <Route
            path="products"
            element={
              <AdminOnly>
                <Products />
              </AdminOnly>
            }
          />
          <Route
            path="accessories"
            element={
              <AdminOnly>
                <Accessories />
              </AdminOnly>
            }
          />
          <Route
            path="store-info"
            element={
              <AdminOnly>
                <StoreInfo />
              </AdminOnly>
            }
          />
          <Route
            path="change-password"
            element={
              <AdminOnly>
                <ChangePassword />
              </AdminOnly>
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={routes.LOGIN} replace />} />
    </Routes>
  );
}

export function AdminApp({
  basePath = '',
  templateId,
  enforceClientId,
  storefrontOrigin,
}: AdminAppProps): JSX.Element {
  useEffect(() => {
    document.documentElement.classList.add('admin-route-active');
    return () => {
      document.documentElement.classList.remove('admin-route-active');
    };
  }, []);

  return (
    <AdminConfigProvider
      basePath={basePath}
      templateId={templateId ?? null}
      enforceClientId={enforceClientId ?? null}
      storefrontOrigin={storefrontOrigin ?? null}
    >
      <AuthProvider>
        <AdminDataProvider>
          <div className="admin-ui-root">
            <AdminRoutes />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: TOAST_DURATION_MS,
                className: 'text-sm',
                style: {
                  background: '#1a1a2e',
                  color: '#f3f4f6',
                  border: '1px solid rgba(255,255,255,0.1)',
                },
              }}
            />
          </div>
        </AdminDataProvider>
      </AuthProvider>
    </AdminConfigProvider>
  );
}
