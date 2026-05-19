import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from './Spinner';
import { useAuthContext } from '../context/AuthContext';
import { useAdminRoutes } from '../context/AdminConfigContext';

function StatusCard({ children }: { children: React.ReactNode }): JSX.Element {
  return React.createElement(
    'div',
    { className: 'flex min-h-screen items-center justify-center bg-brand-bg px-4' },
    React.createElement('div', { className: 'admin-card max-w-lg p-8 text-center' }, children),
  );
}

export function ProtectedRoute(): JSX.Element {
  const routes = useAdminRoutes();
  const { isLoggedIn, loading } = useAuthContext();

  if (loading) {
    return (
      <StatusCard>
        <Spinner size="lg" label="Loading session…" />
      </StatusCard>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to={routes.LOGIN} replace />;
  }

  return <Outlet />;
}
