import React from 'react';
import { Zap, Instagram, Youtube, Facebook, MapPin, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { clientConfig } from '../config/client-config';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand-card pt-12 pb-8 md:pt-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="md:hidden">
          <div className="mb-6 text-center">
            <div className="mb-0 flex items-center justify-center gap-2">
              <Zap className="h-8 w-8 fill-brand-saffron text-brand-saffron" aria-hidden />
              <span className="mt-1 font-display text-3xl tracking-wider text-white">
                {clientConfig.brand.wordmark.beforeAccent}
                <span className="text-brand-saffron">{clientConfig.brand.wordmark.accent}</span>
              </span>
            </div>
            <p className="mx-auto mt-2 max-w-xs text-sm text-white/50">
              Your trusted neighborhood tech destination.
            </p>
            <div className="mt-3 flex justify-center gap-3">
              <a
                href="#"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/5 text-gray-400 transition-colors hover:bg-brand-saffron hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" aria-hidden />
              </a>
              <a
                href="#"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/5 text-gray-400 transition-colors hover:bg-brand-saffron hover:text-white"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" aria-hidden />
              </a>
              <a
                href="#"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/5 text-gray-400 transition-colors hover:bg-brand-saffron hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" aria-hidden />
              </a>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 text-left">
            <div>
              <h4 className="mb-2 font-display text-xs uppercase tracking-widest text-white/40">
                Quick Links
              </h4>
              <ul className="space-y-1">
                <li>
                  <a
                    href="#phones"
                    className="block py-0.5 text-xs leading-tight text-white/60 transition-colors duration-200 hover:text-brand-saffron"
                  >
                    Latest Phones
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="block py-0.5 text-xs leading-tight text-white/60 transition-colors duration-200 hover:text-brand-saffron"
                  >
                    Repair Services
                  </a>
                </li>
                <li>
                  <a
                    href="#visit"
                    className="block py-0.5 text-xs leading-tight text-white/60 transition-colors duration-200 hover:text-brand-saffron"
                  >
                    Store Locator
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-0.5 text-xs leading-tight text-white/60 transition-colors duration-200 hover:text-brand-saffron"
                  >
                    EMI Offers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-display text-xs uppercase tracking-widest text-white/40">
                Contact
              </h4>
              <ul className="space-y-1">
                <li className="flex items-start gap-1.5 py-0.5">
                  <MapPin size={12} className="mt-0.5 shrink-0 text-brand-saffron" aria-hidden />
                  <span className="text-xs leading-tight text-white/60">
                    {clientConfig.location.footerCompactAddress}
                  </span>
                </li>
                <li className="flex items-center gap-1.5 py-0.5">
                  <Phone size={12} className="shrink-0 text-brand-saffron" aria-hidden />
                  <span className="text-xs leading-tight text-white/60">
                    {clientConfig.contact.phoneDisplay}
                  </span>
                </li>
                <li className="flex items-center gap-1.5 py-0.5">
                  <Mail size={12} className="shrink-0 text-brand-saffron" aria-hidden />
                  <span className="break-all text-xs leading-tight text-white/60">
                    {clientConfig.contact.email}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-12 hidden gap-12 text-center md:grid md:grid-cols-4 md:text-left">
          <div className="md:col-span-2">
            <div className="mb-6 flex items-center justify-center gap-2 md:justify-start">
              <Zap className="h-8 w-8 fill-brand-saffron text-brand-saffron" aria-hidden />
              <span className="mt-1 font-display text-3xl tracking-wider text-white">
                {clientConfig.brand.wordmark.beforeAccent}
                <span className="text-brand-saffron">{clientConfig.brand.wordmark.accent}</span>
              </span>
            </div>
            <p className="mx-auto mb-6 max-w-sm text-gray-400 md:mx-0">
              Your trusted neighborhood tech destination. Sabse Sasta, Sabse Best! We bring you the
              latest smartphones, premium accessories, and expert repair services.
            </p>
            <div className="flex justify-center gap-3 md:justify-start">
              <a
                href="#"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/5 text-gray-400 transition-colors hover:bg-brand-saffron hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" aria-hidden />
              </a>
              <a
                href="#"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/5 text-gray-400 transition-colors hover:bg-brand-saffron hover:text-white"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" aria-hidden />
              </a>
              <a
                href="#"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/5 text-gray-400 transition-colors hover:bg-brand-saffron hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" aria-hidden />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-display text-xl tracking-wide text-white">Quick Links</h4>
            <ul className="flex flex-col items-center gap-1 md:items-start">
              <li>
                <a
                  href="#phones"
                  className="inline-flex min-h-[44px] items-center text-gray-400 transition-colors hover:text-brand-saffron"
                >
                  Latest Phones
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="inline-flex min-h-[44px] items-center text-gray-400 transition-colors hover:text-brand-saffron"
                >
                  Repair Services
                </a>
              </li>
              <li>
                <a
                  href="#visit"
                  className="inline-flex min-h-[44px] items-center text-gray-400 transition-colors hover:text-brand-saffron"
                >
                  Store Locator
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex min-h-[44px] items-center text-gray-400 transition-colors hover:text-brand-saffron"
                >
                  EMI Offers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-display text-xl tracking-wide text-white">Contact Us</h4>
            <ul className="flex flex-col items-center gap-4 md:items-start">
              <li className="flex max-w-xs items-start gap-3 text-gray-400 md:max-w-none">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-saffron" aria-hidden />
                <span className="break-words text-left">{clientConfig.location.addressLines.join(' ')}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5 shrink-0 text-brand-saffron" aria-hidden />
                <span>{clientConfig.contact.phoneDisplay}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 text-center md:hidden">
          <p className="text-xs text-white/30">
            © {format(new Date(), 'yyyy')} {clientConfig.brand.legalName}. Made with ❤️ in India
          </p>
        </div>

        <div className="hidden flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center md:flex md:flex-row md:text-left">
          <p className="text-sm text-gray-500">
            © {format(new Date(), 'yyyy')} {clientConfig.brand.legalName}. All rights reserved.
          </p>
          <p className="flex items-center justify-center gap-1 text-sm text-gray-500">
            Made with <span className="text-red-500">❤️</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
