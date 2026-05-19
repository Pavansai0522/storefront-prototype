import React, { createContext, useContext, useMemo } from 'react';
import { createAdminRoutes, type AdminRoutes } from '../constants/routes';
import type { Nullable } from '../types';

export type AdminConfigValue = {
  basePath: string;
  routes: AdminRoutes;
  templateId: Nullable<string>;
  enforceClientId: Nullable<string>;
  storefrontOrigin: Nullable<string>;
};

const AdminConfigContext = createContext<Nullable<AdminConfigValue>>(null);

export type AdminConfigProviderProps = {
  basePath?: string;
  templateId?: string;
  enforceClientId?: string;
  storefrontOrigin?: string;
  children: React.ReactNode;
};

export function AdminConfigProvider({
  basePath = '',
  templateId = null,
  enforceClientId = null,
  storefrontOrigin = null,
  children,
}: AdminConfigProviderProps): JSX.Element {
  const value = useMemo(
    (): AdminConfigValue => ({
      basePath,
      routes: createAdminRoutes(basePath),
      templateId,
      enforceClientId,
      storefrontOrigin,
    }),
    [basePath, templateId, enforceClientId, storefrontOrigin],
  );

  return <AdminConfigContext.Provider value={value}>{children}</AdminConfigContext.Provider>;
}

export function useAdminConfig(): AdminConfigValue {
  const ctx = useContext(AdminConfigContext);
  if (!ctx) {
    throw new Error('useAdminConfig must be used within AdminConfigProvider');
  }
  return ctx;
}

export function useAdminRoutes(): AdminRoutes {
  return useAdminConfig().routes;
}
