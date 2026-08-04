import React, { Suspense, lazy, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { SeoHead } from './components/SeoHead';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppFAB } from './components/WhatsAppFAB';
import { Home } from './pages/Home';
import { StoreDataProvider } from './context/StoreDataContext';
import { CartProvider } from './context/CartContext';
import { StoreGate } from './components/StoreGate';
import { Spinner } from './components/Spinner';

const AdminApp = lazy(async () => {
  const mod = await import('@my-agency/admin-ui');
  return { default: mod.AdminApp };
});

const Watches = lazy(async () => ({ default: (await import('./pages/Watches')).Watches }));
const Toys = lazy(async () => ({ default: (await import('./pages/Toys')).Toys }));
const Accessories = lazy(async () => ({ default: (await import('./pages/Accessories')).Accessories }));
const VisitUsPage = lazy(async () => ({ default: (await import('./pages/VisitUsPage')).VisitUsPage }));
const SmartWatchesPage = lazy(async () => ({
  default: (await import('./pages/watches/SmartWatchesPage')).SmartWatchesPage,
}));
const DialWatchesPage = lazy(async () => ({
  default: (await import('./pages/watches/DialWatchesPage')).DialWatchesPage,
}));
const KidsWatchesPage = lazy(async () => ({
  default: (await import('./pages/watches/KidsWatchesPage')).KidsWatchesPage,
}));
const RcToysPage = lazy(async () => ({ default: (await import('./pages/toys/RcToysPage')).RcToysPage }));
const SoftToysPage = lazy(async () => ({ default: (await import('./pages/toys/SoftToysPage')).SoftToysPage }));
const EducationToysPage = lazy(async () => ({
  default: (await import('./pages/toys/EducationToysPage')).EducationToysPage,
}));
const CablesPage = lazy(async () => ({ default: (await import('./pages/accessories/CablesPage')).CablesPage }));
const HeadphonesPage = lazy(async () => ({
  default: (await import('./pages/accessories/HeadphonesPage')).HeadphonesPage,
}));
const PhoneAccessoriesPage = lazy(async () => ({
  default: (await import('./pages/accessories/PhoneAccessoriesPage')).PhoneAccessoriesPage,
}));
const GadgetsPage = lazy(async () => ({ default: (await import('./pages/accessories/GadgetsPage')).GadgetsPage }));
const LegalPage = lazy(async () => ({ default: (await import('./pages/LegalPage')).LegalPage }));
const CartPage = lazy(async () => ({ default: (await import('./pages/CartPage')).CartPage }));
const CheckoutPage = lazy(async () => ({ default: (await import('./pages/CheckoutPage')).CheckoutPage }));
const OrderSuccessPage = lazy(async () => ({
  default: (await import('./pages/OrderSuccessPage')).OrderSuccessPage,
}));

function RouteFallback(): JSX.Element {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-brand-bg">
      <Spinner size="md" label="Loading…" />
    </div>
  );
}

function AdminFallback(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg">
      <Spinner size="md" label="Loading admin…" />
    </div>
  );
}

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

function AdminMount(): JSX.Element {
  const clientId = import.meta.env.VITE_CLIENT_ID as string | undefined;
  return (
    <Suspense fallback={<AdminFallback />}>
      <AdminApp
        basePath="/admin"
        templateId="watches-store-v2"
        enforceClientId={clientId}
        storefrontOrigin={typeof window !== 'undefined' ? window.location.origin : undefined}
      />
    </Suspense>
  );
}

function StorefrontShell(): JSX.Element {
  return (
    <CartProvider>
      <StoreGate>
      <SeoHead />
      <Toaster
        position="top-center"
        containerStyle={{ top: 80 }}
        toastOptions={{
          duration: 2000,
          style: {
            background: '#F3ECE2',
            color: '#1E1D1B',
            border: '1px solid rgba(30, 29, 27, 0.12)',
          },
        }}
      />
      <ScrollToTop />
      <div className="storefront-root flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-clip font-sans selection:bg-brand-purple/30 selection:text-brand-text">
        <Navbar />

        <main className="bg-brand-bg">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/watches/smart" element={<SmartWatchesPage />} />
              <Route path="/watches/dial" element={<DialWatchesPage />} />
              <Route path="/watches/kids" element={<KidsWatchesPage />} />
              <Route path="/watches" element={<Watches />} />
              <Route path="/toys/rc" element={<RcToysPage />} />
              <Route path="/toys/soft" element={<SoftToysPage />} />
              <Route path="/toys/education" element={<EducationToysPage />} />
              <Route path="/toys" element={<Toys />} />
              <Route path="/accessories/cables" element={<CablesPage />} />
              <Route path="/accessories/headphones" element={<HeadphonesPage />} />
              <Route path="/accessories/phone-accessories" element={<PhoneAccessoriesPage />} />
              <Route
                path="/accessories/case-covers"
                element={<Navigate to="/accessories/phone-accessories" replace />}
              />
              <Route path="/accessories/gadgets" element={<GadgetsPage />} />
              <Route path="/accessories" element={<Accessories />} />
              <Route path="/visit" element={<VisitUsPage />} />
              <Route path="/terms" element={<LegalPage policyId="terms" />} />
              <Route path="/privacy" element={<LegalPage policyId="privacy" />} />
              <Route path="/refund" element={<LegalPage policyId="refund" />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
        <WhatsAppFAB />
      </div>
      </StoreGate>
    </CartProvider>
  );
}

export function App(): JSX.Element {
  return (
    <StoreDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminMount />} />
          <Route path="/*" element={<StorefrontShell />} />
        </Routes>
      </BrowserRouter>
    </StoreDataProvider>
  );
}
