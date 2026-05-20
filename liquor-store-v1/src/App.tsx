import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AgeGate } from './components/AgeGate';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Spirits } from './pages/Spirits';
import { Wine } from './pages/Wine';
import { Beer } from './pages/Beer';
import { Deals } from './pages/Deals';
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
        element.scrollIntoView({
          behavior: 'smooth',
        });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

function AdminFallback(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <p className="text-sm text-muted">Loading admin…</p>
    </div>
  );
}

function AdminMount(): JSX.Element {
  const clientId = import.meta.env.VITE_CLIENT_ID as string | undefined;
  return (
    <Suspense fallback={<AdminFallback />}>
      <AdminApp
        basePath="/admin"
        templateId="liquor-store-v1"
        enforceClientId={clientId}
        storefrontOrigin={typeof window !== 'undefined' ? window.location.origin : undefined}
      />
    </Suspense>
  );
}

function StorefrontShell(): JSX.Element {
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  return (
    <>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-gold selection:text-background">
        {!isAgeVerified && <AgeGate onVerify={() => setIsAgeVerified(true)} />}

        <div
          className={`flex flex-grow flex-col transition-opacity duration-1000 ${isAgeVerified ? 'opacity-100' : 'h-screen overflow-hidden opacity-0'}`}
        >
          <Navbar />
          <div className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/spirits" element={<Spirits />} />
              <Route path="/wine" element={<Wine />} />
              <Route path="/beer" element={<Beer />} />
              <Route path="/deals" element={<Deals />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export function App(): JSX.Element {
  return (
    <StoreDataProvider>
      <Router>
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
      </Router>
    </StoreDataProvider>
  );
}
