import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ContactBar } from './components/ContactBar';
import { LoadingScreen } from './components/LoadingScreen';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { VenuePage } from './pages/VenuePage';
import { LegalPage } from './pages/LegalPage';
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
  return <LoadingScreen />;
}

function AdminMount(): JSX.Element {
  const clientId = import.meta.env.VITE_CLIENT_ID as string | undefined;
  return (
    <Suspense fallback={<AdminFallback />}>
      <AdminApp
        basePath="/admin"
        templateId="restaurant-v1"
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
      <div className="flex min-h-screen flex-col bg-background pb-contact-bar font-sans text-foreground selection:bg-gold selection:text-maroon-deep lg:pb-0">
        <Navbar />
        <div className="flex-grow pt-nav">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/function-hall" element={<VenuePage venueId="function-hall" />} />
            <Route path="/residence" element={<VenuePage venueId="residence" />} />
            <Route path="/terms" element={<LegalPage policyId="terms" />} />
            <Route path="/privacy" element={<LegalPage policyId="privacy" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
        <ContactBar />
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
