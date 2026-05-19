import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { PageTransition } from '../components/PageTransition';
import { StoreAdminDashboard } from '../admin/StoreAdminDashboard';
import { SuperAdminDashboard } from '../admin/SuperAdminDashboard';

export function Dashboard(): JSX.Element {
  const { isSuperadmin } = useAuthContext();
  if (isSuperadmin) {
    return (
      <PageTransition>
        <SuperAdminDashboard />
      </PageTransition>
    );
  }
  return (
    <PageTransition>
      <StoreAdminDashboard />
    </PageTransition>
  );
}
