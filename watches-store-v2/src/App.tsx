import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { SeoHead } from './components/SeoHead';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppFAB } from './components/WhatsAppFAB';
// Pages
import { Home } from './pages/Home';
import { Watches } from './pages/Watches';
import { Toys } from './pages/Toys';
import { Accessories } from './pages/Accessories';
import { VisitUsPage } from './pages/VisitUsPage';
import { SmartWatchesPage } from './pages/watches/SmartWatchesPage';
import { DialWatchesPage } from './pages/watches/DialWatchesPage';
import { KidsWatchesPage } from './pages/watches/KidsWatchesPage';
import { RcToysPage } from './pages/toys/RcToysPage';
import { SoftToysPage } from './pages/toys/SoftToysPage';
import { EducationToysPage } from './pages/toys/EducationToysPage';
import { CablesPage } from './pages/accessories/CablesPage';
import { HeadphonesPage } from './pages/accessories/HeadphonesPage';
import { PhoneAccessoriesPage } from './pages/accessories/PhoneAccessoriesPage';
import { GadgetsPage } from './pages/accessories/GadgetsPage';
import { StoreDataProvider } from './context/StoreDataContext';
import { StoreGate } from './components/StoreGate';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
export function App() {
  return (
    <StoreDataProvider>
    <StoreGate>
    <BrowserRouter>
      <SeoHead />
      <Toaster
        position="top-center"
        containerStyle={{ top: 80 }}
        toastOptions={{ duration: 2000 }}
      />
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-brand-bg font-sans text-brand-text selection:bg-brand-purple selection:text-white">
        <Navbar />

        <main className="flex-grow pb-20 md:pb-0">
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
          </Routes>
        </main>

        <Footer />
        <WhatsAppFAB />
      </div>
    </BrowserRouter>
    </StoreGate>
    </StoreDataProvider>
  );
}