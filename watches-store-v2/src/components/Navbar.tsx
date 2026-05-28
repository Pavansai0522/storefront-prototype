import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
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
      className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${isScrolled ? 'border-b border-brand-border bg-brand-bg/95 shadow-[0_8px_32px_rgba(30,29,27,0.08)] backdrop-blur-xl' : 'bg-brand-bg/80 backdrop-blur-sm'}`}
    >
      <Disclosure>
        {({ open }) => (
          <>
            <div className="storefront-shell">
              <div className="flex h-16 items-center justify-between gap-2 sm:h-20">
                <div className="min-w-0 flex-1">
                  <StoreLogo variant="navbar" />
                </div>

                <nav className="hidden items-center gap-8 md:flex">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className={`px-2 py-1 text-sm font-bold text-black transition-colors ${
                        isNavLinkActive(link.href, location.pathname)
                          ? ''
                          : 'hover:text-red-600'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                <div className="hidden shrink-0 md:flex md:items-center">
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnWhatsAppNav}
                  >
                    WhatsApp
                  </a>
                </div>

                <div className="flex items-center gap-2 md:hidden">
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${btnWhatsAppNav} px-3 py-2 text-sm`}
                  >
                    WhatsApp
                  </a>
                  <DisclosureButton
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md text-brand-text hover:text-brand-text/80 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    aria-label={open ? 'Close menu' : 'Open menu'}
                  >
                    {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
                  </DisclosureButton>
                </div>
              </div>
            </div>

            <DisclosurePanel
              transition
              className="origin-top overflow-hidden border-b border-brand-border bg-brand-bg transition duration-200 ease-out data-[closed]:-translate-y-2 data-[closed]:opacity-0 md:hidden"
            >
              <div className="space-y-1 px-4 pb-6 pt-2">
                {navLinks.map((link) => (
                  <DisclosureButton
                    key={link.name}
                    as={Link}
                    to={link.href}
                    className={`flex min-h-[48px] w-full items-center px-2 text-lg font-bold text-black transition-colors ${
                      isNavLinkActive(link.href, location.pathname)
                        ? ''
                        : 'hover:text-red-600'
                    }`}
                  >
                    {link.name}
                  </DisclosureButton>
                ))}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </header>
  );
}
