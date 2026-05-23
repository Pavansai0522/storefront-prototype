import React from 'react';
import { format } from 'date-fns';
import { MapPin, Phone } from 'lucide-react';
import { useStoreConfig } from '../context/StoreDataContext';
import { phoneTelHref } from '../utils/phoneTel';
import { StoreLogo } from './StoreLogo';
import { SocialLinksRow } from './SocialLinksRow';

export function Footer() {
  const clientConfig = useStoreConfig();
  const telHref = phoneTelHref(clientConfig.contact.phoneDisplay);

  return (
    <footer className="border-t border-brand-border bg-brand-card pt-12 pb-8 md:pt-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="md:hidden">
          <div className="mb-6 text-center">
            <div className="mb-0 flex justify-center">
              <StoreLogo variant="footer" className="object-center" />
            </div>
            <p className="mx-auto mt-2 max-w-xs text-sm text-brand-muted">
              Your trusted neighborhood tech destination.
            </p>
            <SocialLinksRow className="mt-3 flex justify-center gap-3" />
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 text-left">
            <div>
              <h4 className="mb-2 font-display text-xs uppercase tracking-widest text-slate-500">
                Quick Links
              </h4>
              <ul className="space-y-1">
                <li>
                  <a
                    href="#phones"
                    className="block py-0.5 text-xs leading-tight text-brand-muted transition-colors duration-200 hover:text-brand-blue">
                    Latest Phones
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="block py-0.5 text-xs leading-tight text-brand-muted transition-colors duration-200 hover:text-brand-blue">
                    Repair Services
                  </a>
                </li>
                <li>
                  <a
                    href="#visit"
                    className="block py-0.5 text-xs leading-tight text-brand-muted transition-colors duration-200 hover:text-brand-blue">
                    Store Locator
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-display text-xs uppercase tracking-widest text-slate-500">
                Contact
              </h4>
              <ul className="space-y-1">
                <li className="flex items-start gap-1.5 py-0.5">
                  <MapPin size={12} className="mt-0.5 shrink-0 text-brand-blue" aria-hidden />
                  <a
                    href={clientConfig.location.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs leading-tight text-brand-muted transition-colors hover:text-brand-blue">
                    {clientConfig.location.footerCompactAddress}
                  </a>
                </li>
                <li className="flex items-center gap-1.5 py-0.5">
                  <Phone size={12} className="shrink-0 text-brand-blue" aria-hidden />
                  {telHref ? (
                    <a
                      href={telHref}
                      className="text-xs leading-tight text-brand-muted transition-colors hover:text-brand-blue">
                      {clientConfig.contact.phoneDisplay}
                    </a>
                  ) : (
                    <span className="text-xs leading-tight text-brand-muted">
                      {clientConfig.contact.phoneDisplay}
                    </span>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-12 hidden gap-12 text-center md:grid md:grid-cols-4 md:text-left">
          <div className="md:col-span-2">
            <div className="mb-6 flex justify-center md:justify-start">
              <StoreLogo variant="footer" />
            </div>
            <p className="mx-auto mb-6 max-w-sm text-brand-muted md:mx-0">
              Your trusted neighborhood tech destination. Sabse Sasta, Sabse Best! We bring you the
              latest smartphones, premium accessories, and expert repair services.
            </p>
            <SocialLinksRow />
          </div>

          <div>
            <h4 className="mb-6 font-display text-xl tracking-wide text-brand-text">Quick Links</h4>
            <ul className="flex flex-col items-center gap-1 md:items-start">
              <li>
                <a
                  href="#phones"
                  className="inline-flex min-h-[44px] items-center text-brand-muted transition-colors hover:text-brand-blue">
                  Latest Phones
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="inline-flex min-h-[44px] items-center text-brand-muted transition-colors hover:text-brand-blue">
                  Repair Services
                </a>
              </li>
              <li>
                <a
                  href="#visit"
                  className="inline-flex min-h-[44px] items-center text-brand-muted transition-colors hover:text-brand-blue">
                  Store Locator
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-display text-xl tracking-wide text-brand-text">Contact Us</h4>
            <ul className="flex flex-col items-center gap-4 md:items-start">
              <li className="flex max-w-xs items-start gap-3 text-brand-muted md:max-w-none">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" aria-hidden />
                <a
                  href={clientConfig.location.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-words text-left transition-colors hover:text-brand-blue">
                  {clientConfig.location.addressLines.join(' ')}
                </a>
              </li>
              <li className="flex items-center gap-3 text-brand-muted">
                <Phone className="h-5 w-5 shrink-0 text-brand-blue" aria-hidden />
                {telHref ? (
                  <a href={telHref} className="transition-colors hover:text-brand-blue">
                    {clientConfig.contact.phoneDisplay}
                  </a>
                ) : (
                  <span>{clientConfig.contact.phoneDisplay}</span>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-border pt-4 text-center md:hidden">
          <p className="text-xs text-slate-400">
            © {format(new Date(), 'yyyy')} {clientConfig.brand.legalName}. Made with ❤️ in India
          </p>
        </div>

        <div className="hidden flex-col items-center justify-between gap-4 border-t border-brand-border pt-8 text-center md:flex md:flex-row md:text-left">
          <p className="text-sm text-brand-muted">
            © {format(new Date(), 'yyyy')} {clientConfig.brand.legalName}. All rights reserved.
          </p>
          <p className="flex items-center justify-center gap-1 text-sm text-brand-muted">
            Made with <span className="text-red-500">❤️</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
}


