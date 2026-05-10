import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getStoredToken } from '../utils/jwt';

export function ProtectedRoute(): JSX.Element {
  const token = getStoredToken();
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
