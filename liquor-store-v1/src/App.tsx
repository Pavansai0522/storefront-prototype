import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AgeGate } from './components/AgeGate';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Spirits } from './pages/Spirits';
import { Wine } from './pages/Wine';
import { Beer } from './pages/Beer';
// Scroll to top on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}
export function App() {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-gold selection:text-background">
        {!isAgeVerified && <AgeGate onVerify={() => setIsAgeVerified(true)} />}

        <div
          className={`flex-grow flex flex-col transition-opacity duration-1000 ${isAgeVerified ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
          
          <Navbar />
          <div className="flex-grow pt-20">
            {' '}
            {/* Add padding top to account for fixed navbar */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/spirits" element={<Spirits />} />
              <Route path="/wine" element={<Wine />} />
              <Route path="/beer" element={<Beer />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </Router>);

}