import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { StoreLogo } from './StoreLogo';
import { whatsappHref } from '../config/client-config';
import { btnWhatsAppNav } from '../constants/buttonStyles';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Watches', href: '/watches' },
  { name: 'Toys', href: '/toys' },
  { name: 'Accessories', href: '/accessories' },
  { name: 'Visit Us', href: '/visit' },
];

function isNavLinkActive(href: string, pathname: string): boolean {
  if (href === '/watches') {
    return pathname === '/watches' || pathname.startsWith('/watches/');
  }
  if (href === '/toys') {
    return pathname === '/toys' || pathname.startsWith('/toys/');
  }
  if (href === '/accessories') {
    return pathname === '/accessories' || pathname.startsWith('/accessories/');
  }
  return pathname === href;
}

export function Navbar(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${isScrolled ? 'border-b border-brand-border bg-brand-elevated/90 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:h-20">
          <div className="min-w-0 flex-1">
            <StoreLogo variant="navbar" />
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`rounded-md px-2 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple ${
                  isNavLinkActive(link.href, location.pathname)
                    ? 'text-brand-purple'
                    : 'text-brand-text/70 hover:text-brand-text'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 md:flex md:items-center">
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={btnWhatsAppNav}>
              WhatsApp
            </a>
          </div>

          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-brand-text hover:text-brand-text/80 focus:outline-none focus:ring-2 focus:ring-brand-purple md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-brand-border bg-brand-bg md:hidden"
          >
            <div className="flex flex-col space-y-4 px-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex min-h-[48px] items-center text-lg font-medium transition-colors ${
                    isNavLinkActive(link.href, location.pathname)
                      ? 'text-brand-purple'
                      : 'text-brand-text/70 hover:text-brand-text'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-brand-border pt-4">
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${btnWhatsAppNav} w-full px-6 py-3 text-base`}
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
