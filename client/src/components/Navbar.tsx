import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { whatsappHref } from '../config/client-config';
import { StoreLogo } from './StoreLogo';

interface NavLink {
  name: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Phones', href: '/phones' },
  { name: 'Accessories', href: '/accessories' },
  { name: 'Services', href: '/#services' },
  { name: 'Visit Us', href: '/#visit' },
];

export function Navbar(): JSX.Element {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-brand-border bg-brand-bg/95 shadow-sm backdrop-blur-md">
      <Disclosure>
        {({ open }) => (
          <>
            <div className="storefront-shell">
              <div className="flex h-20 items-center justify-between gap-3">
                <StoreLogo variant="navbar" />

                <div className="hidden items-center space-x-8 md:flex">
                  {NAV_LINKS.map((link) =>
                    link.href.startsWith('/#') ? (
                      <a
                        key={link.name}
                        href={link.href}
                        className="font-medium text-brand-muted transition-colors hover:text-brand-blue"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        key={link.name}
                        to={link.href}
                        className="font-medium text-brand-muted transition-colors hover:text-brand-blue"
                      >
                        {link.name}
                      </Link>
                    )
                  )}
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-brand-blue/40 bg-brand-blue/10 px-3 py-2 text-sm font-medium text-brand-blue shadow-[0_0_8px_rgba(29,78,216,0.12)] transition-all hover:bg-brand-blue hover:text-white hover:shadow-[0_0_16px_rgba(29,78,216,0.35)]"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
                    WhatsApp Us
                  </a>
                </div>

                <div className="flex items-center gap-2 md:hidden">
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full border border-brand-blue/40 bg-brand-blue/10 px-3 text-sm font-medium text-brand-blue shadow-[0_0_8px_rgba(29,78,216,0.12)] transition-all hover:bg-brand-blue hover:text-white hover:shadow-[0_0_16px_rgba(29,78,216,0.35)]"
                    aria-label="WhatsApp Us"
                  >
                    <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
                    <span className="max-w-[5.5rem] truncate sm:max-w-none">WhatsApp</span>
                  </a>
                  <DisclosureButton
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-brand-muted transition hover:text-brand-text"
                    aria-label={open ? 'Close menu' : 'Open menu'}
                  >
                    {open ? (
                      <X className="h-7 w-7" aria-hidden />
                    ) : (
                      <Menu className="h-7 w-7" aria-hidden />
                    )}
                  </DisclosureButton>
                </div>
              </div>
            </div>

            <DisclosurePanel
              transition
              className="origin-top overflow-hidden border-b border-brand-border bg-brand-card transition duration-200 ease-out data-[closed]:-translate-y-2 data-[closed]:opacity-0 md:hidden"
            >
              <div className="space-y-1 px-4 pb-6 pt-2">
                {NAV_LINKS.map((link) =>
                  link.href.startsWith('/#') ? (
                    <DisclosureButton
                      key={link.name}
                      as="a"
                      href={link.href}
                      className="flex min-h-[44px] items-center text-lg font-medium text-brand-muted transition-colors hover:text-brand-blue"
                    >
                      {link.name}
                    </DisclosureButton>
                  ) : (
                    <DisclosureButton
                      key={link.name}
                      as={Link}
                      to={link.href}
                      className="flex min-h-[44px] items-center text-lg font-medium text-brand-muted transition-colors hover:text-brand-blue"
                    >
                      {link.name}
                    </DisclosureButton>
                  )
                )}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </nav>
  );
}
