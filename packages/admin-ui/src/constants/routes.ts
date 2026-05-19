export type AdminRoutes = {
  readonly LOGIN: string;
  readonly DASHBOARD: string;
  readonly CLIENTS: string;
  readonly CREATE_CLIENT: string;
  readonly BILLING: string;
  readonly WATCHES_TEMPLATE_PREVIEW: string;
  readonly PRODUCTS: string;
  readonly ACCESSORIES: string;
  readonly STORE_INFO: string;
  readonly CHANGE_PASSWORD: string;
  clientDetail: (clientId: string) => string;
};

export function createAdminRoutes(basePath: string): AdminRoutes {
  const base = basePath.replace(/\/$/, '');
  const p = (suffix: string): string => `${base}${suffix}`;
  return {
    LOGIN: base || '/',
    DASHBOARD: p('/dashboard'),
    CLIENTS: p('/clients'),
    CREATE_CLIENT: p('/create-client'),
    BILLING: p('/billing'),
    WATCHES_TEMPLATE_PREVIEW: p('/templates/watches-store-v2'),
    PRODUCTS: p('/products'),
    ACCESSORIES: p('/accessories'),
    STORE_INFO: p('/store-info'),
    CHANGE_PASSWORD: p('/change-password'),
    clientDetail: (clientId: string) => p(`/clients/${clientId}`),
  };
}

/** @deprecated Use createAdminRoutes via AdminConfigProvider */
export const ROUTES = createAdminRoutes('');
