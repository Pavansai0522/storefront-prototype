import React, { useEffect, useState } from 'react';
import { Zap, Menu, X, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { STORE_PHONE_DISPLAY, STORE_PHONE_TEL } from '../config/store';
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  const navLinks = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'Shop',
    path: '/shop'
  },
  {
    name: 'Spirits',
    path: '/spirits'
  },
  {
    name: 'Wine',
    path: '/wine'
  },
  {
    name: 'Beer',
    path: '/beer'
  }];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-border' : 'bg-transparent'}`}>
      
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl md:text-2xl font-display font-bold tracking-wider cursor-pointer">
          
          <Zap className="w-6 h-6 text-gold" fill="currentColor" />
          <span>
            UNITED <span className="text-gold">LIQUORS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
          <Link
            key={link.name}
            to={link.path}
            className={`text-base font-medium transition-colors ${location.pathname === link.path ? 'text-gold' : 'text-muted hover:text-gold'}`}>
            
              {link.name}
            </Link>
          )}
          <Link
            to="/#visit-us"
            className="text-base font-medium text-muted hover:text-gold transition-colors">
            
            Visit Us
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <a
            href={STORE_PHONE_TEL}
            className="flex items-center gap-2 px-6 py-2.5 bg-gold/10 border border-gold text-gold hover:bg-gold hover:text-background font-semibold rounded transition-all duration-300 min-h-[44px]">
            
            <Phone className="w-4 h-4" />
            {STORE_PHONE_DISPLAY}
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu">
          
          {isMobileMenuOpen ?
          <X className="w-6 h-6" /> :

          <Menu className="w-6 h-6" />
          }
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen &&
      <div className="md:hidden absolute top-20 left-0 right-0 bg-card border-b border-border shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) =>
          <Link
            key={link.name}
            to={link.path}
            className={`text-lg font-medium py-2 border-b border-border/50 ${location.pathname === link.path ? 'text-gold' : 'text-foreground hover:text-gold'}`}>
            
                {link.name}
              </Link>
          )}
            <Link
            to="/#visit-us"
            className="text-lg font-medium text-foreground hover:text-gold py-2 border-b border-border/50">
            
              Visit Us
            </Link>
            <a
            href={STORE_PHONE_TEL}
            className="flex items-center justify-center gap-2 w-full py-3 mt-4 bg-gold text-background font-bold rounded min-h-[44px]">
            
              <Phone className="w-5 h-5" />
              Call {STORE_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      }
    </nav>);

}