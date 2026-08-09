import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Home } from './pages/Home';
import { AllPhones } from './pages/AllPhones';
import { Accessories } from './pages/Accessories';
import { AccessoriesCategory } from './pages/AccessoriesCategory';
import { StoreDataProvider } from './context/StoreDataContext';
import { StoreGate } from './components/StoreGate';

const AdminApp = lazy(async () => {
  const mod = await import('@my-agency/admin-ui');
  return { default: mod.AdminApp };
});

function ScrollToTop(): null {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

function AdminFallback(): JSX.Element {
  return (
    <div className="admin-ui-root flex min-h-screen items-center justify-center bg-brand-bg">
      <p className="text-sm text-gray-400">Loading admin…</p>
    </div>
  );
}

function AdminMount(): JSX.Element {
  const clientId = import.meta.env.VITE_CLIENT_ID as string | undefined;

  useEffect(() => {
    document.documentElement.classList.add('admin-route-active');
    return () => {
      document.documentElement.classList.remove('admin-route-active');
    };
  }, []);

  return (
    <Suspense fallback={<AdminFallback />}>
      <AdminApp
        basePath="/admin"
        templateId="mobile-store-v1"
        enforceClientId={clientId}
        storefrontOrigin={typeof window !== 'undefined' ? window.location.origin : undefined}
      />
    </Suspense>
  );
}

function StorefrontShell(): JSX.Element {
  return (
    <>
      <ScrollToTop />
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/phones" element={<AllPhones />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/accessories/:categoryId" element={<AccessoriesCategory />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export function App(): JSX.Element {
  return (
    <StoreDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminMount />} />
          <Route
            path="/*"
            element={
              <StoreGate>
                <StorefrontShell />
              </StoreGate>
            }
          />
        </Routes>
      </BrowserRouter>
    </StoreDataProvider>
  );
}
