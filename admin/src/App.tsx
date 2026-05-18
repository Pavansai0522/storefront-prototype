import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Billing } from './pages/Billing';
import { ClientDetail } from './pages/ClientDetail';
import { Clients } from './pages/Clients';
import { CreateClient } from './pages/CreateClient';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Products } from './pages/Products';
import { Accessories } from './pages/Accessories';
import { StoreInfo } from './pages/StoreInfo';
import { ChangePassword } from './pages/ChangePassword';
import { WatchesTemplatePreview } from './pages/WatchesTemplatePreview';
import { useAuthContext } from './context/AuthContext';

function SuperadminOnly({ children }: { children: JSX.Element }): JSX.Element {
  const { isSuperadmin } = useAuthContext();
  if (!isSuperadmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AdminOnly({ children }: { children: JSX.Element }): JSX.Element {
  const { isAdmin, isSuperadmin } = useAuthContext();
  if (!isAdmin && !isSuperadmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/clients"
            element={
              <SuperadminOnly>
                <Clients />
              </SuperadminOnly>
            }
          />
          <Route
            path="/clients/:clientId"
            element={
              <SuperadminOnly>
                <ClientDetail />
              </SuperadminOnly>
            }
          />
          <Route
            path="/create-client"
            element={
              <SuperadminOnly>
                <CreateClient />
              </SuperadminOnly>
            }
          />
          <Route
            path="/billing"
            element={
              <SuperadminOnly>
                <Billing />
              </SuperadminOnly>
            }
          />
          <Route
            path="/templates/watches-store-v2"
            element={
              <SuperadminOnly>
                <WatchesTemplatePreview />
              </SuperadminOnly>
            }
          />
          <Route
            path="/products"
            element={
              <AdminOnly>
                <Products />
              </AdminOnly>
            }
          />
          <Route
            path="/accessories"
            element={
              <AdminOnly>
                <Accessories />
              </AdminOnly>
            }
          />
          <Route
            path="/store-info"
            element={
              <AdminOnly>
                <StoreInfo />
              </AdminOnly>
            }
          />
          <Route
            path="/change-password"
            element={
              <AdminOnly>
                <ChangePassword />
              </AdminOnly>
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
