import React from 'react';
import { format } from 'date-fns';
import { Instagram, Youtube, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STORE_NAME } from '../config/storeBranding';
import { StoreLogo } from './StoreLogo';
import { clientConfig, whatsappHref } from '../config/client-config';
import { LEGAL_FOOTER_LINKS } from '../data/legalPolicies';
import { facebookUrl, instagramUrl, youtubeUrl } from '../utils/socialLinks';

export function Footer(): JSX.Element {
  const facebookHref = facebookUrl();
  return (
    <footer className="mt-auto border-t border-brand-border bg-brand-bg pb-24 pt-16 md:pb-8">
      <div className="storefront-shell">
        <div className="mb-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-10">
          <div className="col-span-2 flex flex-col items-center text-center md:col-span-1 md:items-start md:text-left">
            <StoreLogo variant="footer" className="mb-4 justify-center md:justify-start" />
            <p className="mb-6 max-w-xs text-brand-text">
              Premium watches, toys & mobiles — Chilakaluripet&apos;s finest since{' '}
              {clientConfig.brand.trustedSince}.
            </p>
            <div className="flex gap-2 sm:gap-4">
              <a
                href={instagramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center text-black transition-colors hover:text-brand-purple"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={youtubeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center text-black transition-colors hover:text-brand-purple"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              {facebookHref ? (
                <a
                  href={facebookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center text-black transition-colors hover:text-brand-purple"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              ) : null}
            </div>
          </div>

          <div className="flex min-w-0 flex-col items-center text-center md:items-start md:text-left">
            <h4 className="mb-4 w-full text-sm font-semibold uppercase tracking-wider text-brand-text md:mb-6">
              Quick Links
            </h4>
            <nav className="flex w-full flex-col items-center gap-2.5 text-center md:items-start md:gap-3 md:text-left">
              <Link to="/" className="text-black transition-colors hover:text-brand-purple">
                Home
              </Link>
              <Link to="/watches" className="text-black transition-colors hover:text-brand-purple">
                Watches
              </Link>
              <Link to="/toys" className="text-black transition-colors hover:text-brand-purple">
                Toys
              </Link>
              <Link
                to="/accessories"
                className="text-black transition-colors hover:text-brand-purple"
              >
                Accessories
              </Link>
            </nav>
          </div>

          <div className="flex min-w-0 flex-col items-center text-center md:items-start md:text-left">
            <h4 className="mb-4 w-full text-sm font-semibold uppercase tracking-wider text-brand-text md:mb-6">
              Legal
            </h4>
            <nav className="flex w-full flex-col items-center gap-2.5 text-center md:items-start md:gap-3 md:text-left">
              {LEGAL_FOOTER_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-black transition-colors hover:text-brand-purple"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="col-span-2 flex min-w-0 flex-col items-center text-center md:col-span-1 md:items-start md:text-left">
            <h4 className="mb-4 w-full text-sm font-semibold uppercase tracking-wider text-brand-text md:mb-6">
              Contact
            </h4>
            <div className="w-full space-y-2.5 text-sm text-brand-text md:space-y-3 md:text-base">
              <p className="break-words">{STORE_NAME}</p>
              <p>{clientConfig.location.footerCompactAddress}</p>
              <p className="mt-2 font-medium text-brand-text md:mt-4">
                {clientConfig.contact.phoneDisplay}
              </p>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-medium text-brand-purple transition-colors hover:text-brand-purple-dim"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        <div className="mb-8 h-px w-full bg-brand-border" />

        <div className="flex flex-col items-center gap-3 px-2 text-center text-sm text-brand-text/75">
          <p className="break-words">
            © {format(new Date(), 'yyyy')} {STORE_NAME}, Chilakaluripet. All Rights Reserved.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {LEGAL_FOOTER_LINKS.map((link) => (
              <Link
                key={`bottom-${link.path}`}
                to={link.path}
                className="transition-colors hover:text-brand-purple"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
