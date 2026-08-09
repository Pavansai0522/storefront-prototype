import React, { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { btnSecondary } from '../constants/buttonStyles';
import { WhatsAppIcon } from './WhatsAppIcon';
import {
  STORE_PHONE_PRIMARY_DISPLAY,
  STORE_PHONE_PRIMARY_TEL,
  STORE_PHONE_SECONDARY_DISPLAY,
  STORE_PHONE_SECONDARY_TEL,
  STORE_WHATSAPP_HREF,
} from '../config/store';
import { StoreBrandLogo } from './StoreBrandLogo';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Food Menu', path: '/menu' },
  { name: 'Function Hall', path: '/function-hall' },
  { name: 'Guest Rooms', path: '/residence' },
] as const;

const mobileNavLinkClass =
  'flex min-h-[44px] items-center border-b border-border/50 py-3 text-lg font-medium transition-colors';

export function Navbar(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  const closeMobileMenu = (): void => setIsMobileMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-[100] min-h-nav transition-all duration-300 ${
          isScrolled
            ? 'border-b border-gold/20 bg-maroon-deep/95 shadow-lg backdrop-blur-md'
            : 'bg-gradient-to-b from-maroon-deep/95 to-transparent'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="container mx-auto flex h-20 min-h-[5rem] items-center justify-between gap-2">
          <Link to="/" className="min-w-0 shrink" onClick={closeMobileMenu}>
            <StoreBrandLogo compact textClassName="text-base sm:text-lg md:text-xl" />
          </Link>

          <div className="hidden items-center gap-6 xl:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium uppercase tracking-wider transition-colors ${
                  location.pathname === link.path ? 'text-gold' : 'text-muted hover:text-gold'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/#visit-us" className="text-sm font-medium uppercase tracking-wider text-muted hover:text-gold">
              Visit Us
            </Link>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <a href={STORE_PHONE_PRIMARY_TEL} className={btnSecondary}>
              <Phone className="h-4 w-4" aria-hidden />
              {STORE_PHONE_PRIMARY_DISPLAY}
            </a>
          </div>

          <button
            type="button"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center lg:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/60" aria-label="Close menu" onClick={closeMobileMenu} />
          <div className="top-nav absolute inset-x-0 bottom-0 overflow-y-auto border-b border-border bg-card pb-safe">
            <div className="flex flex-col p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`${mobileNavLinkClass} ${
                    location.pathname === link.path ? 'text-gold' : 'text-foreground hover:text-gold'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/#visit-us" onClick={closeMobileMenu} className={`${mobileNavLinkClass} hover:text-gold`}>
                Visit Us
              </Link>
              <div className="mt-4 space-y-3">
                <PhoneLinks />
                <a
                  href={STORE_WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 border border-gold/25 py-3 text-sm text-muted transition hover:border-gold hover:text-gold"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

type PhoneLinksProps = {
  compact?: boolean;
};

function PhoneLinks({ compact = false }: PhoneLinksProps): JSX.Element {
  const linkClass = compact
    ? 'text-xs font-semibold tabular-nums transition hover:text-gold'
    : 'flex min-h-[44px] w-full items-center justify-center gap-2 border border-gold/30 py-3 text-sm font-semibold tabular-nums transition hover:border-gold hover:text-gold';

  return (
    <div className={compact ? 'flex flex-col items-end gap-1 text-ivory-dim' : 'space-y-2'}>
      <a href={STORE_PHONE_PRIMARY_TEL} className={`${linkClass} text-gold`}>
        <Phone className={compact ? 'mr-1 inline h-3.5 w-3.5' : 'inline h-4 w-4'} aria-hidden />
        {STORE_PHONE_PRIMARY_DISPLAY}
      </a>
      <a href={STORE_PHONE_SECONDARY_TEL} className={linkClass}>
        {STORE_PHONE_SECONDARY_DISPLAY}
      </a>
    </div>
  );
}
