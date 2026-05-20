import React, { useEffect, useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { STORE_PHONE_DISPLAY, STORE_PHONE_TEL } from '../config/store';
import { StoreBrandLogo } from './StoreBrandLogo';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Deals', path: '/deals' },
  { name: 'Spirits', path: '/spirits' },
  { name: 'Wine', path: '/wine' },
  { name: 'Beer', path: '/beer' },
] as const;

const mobileNavLinkClass =
  'flex min-h-[44px] items-center border-b border-border/50 py-3 text-lg font-medium transition-colors';

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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-border bg-background/95 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between gap-3 px-4">
        <Link to="/" className="min-w-0 shrink">
          <StoreBrandLogo
            textClassName="text-base font-display font-bold tracking-wide sm:text-lg md:text-2xl md:tracking-wider"
            iconClassName="h-5 w-5 text-gold sm:h-6 sm:w-6"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-base font-medium transition-colors ${
                location.pathname === link.path ? 'text-gold' : 'text-muted hover:text-gold'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/#visit-us"
            className="text-base font-medium text-muted transition-colors hover:text-gold"
          >
            Visit Us
          </Link>
        </div>

        <div className="hidden md:block">
          <a
            href={STORE_PHONE_TEL}
            className="flex min-h-[44px] items-center gap-2 rounded border border-gold bg-gold/10 px-6 py-2.5 font-semibold text-gold transition-all duration-300 hover:bg-gold hover:text-background"
          >
            <Phone className="h-4 w-4 shrink-0" />
            {STORE_PHONE_DISPLAY}
          </a>
        </div>

        <button
          type="button"
          className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center p-2 text-foreground md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMobileMenuOpen ? (
        <div className="fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto border-b border-border bg-card shadow-xl md:hidden">
          <div className="flex flex-col p-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`${mobileNavLinkClass} ${
                  location.pathname === link.path ? 'text-gold' : 'text-foreground hover:text-gold'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/#visit-us"
              className={`${mobileNavLinkClass} text-foreground hover:text-gold`}
            >
              Visit Us
            </Link>
            <a
              href={STORE_PHONE_TEL}
              className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded bg-gold py-3 font-bold text-background"
            >
              <Phone className="h-5 w-5 shrink-0" />
              Call {STORE_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
