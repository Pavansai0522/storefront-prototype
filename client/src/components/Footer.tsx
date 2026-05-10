import React from 'react';
import { Zap, Instagram, Youtube, Facebook, MapPin, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { clientConfig } from '../config/client-config';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand-card pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 text-center md:grid-cols-4 md:text-left">
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
                  className="inline-flex min-h-[44px] items-center text-gray-400 transition-colors hover:text-brand-saffron">
                  Latest Phones
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="inline-flex min-h-[44px] items-center text-gray-400 transition-colors hover:text-brand-saffron">
                  Repair Services
                </a>
              </li>
              <li>
                <a
                  href="#visit"
                  className="inline-flex min-h-[44px] items-center text-gray-400 transition-colors hover:text-brand-saffron">
                  Store Locator
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex min-h-[44px] items-center text-gray-400 transition-colors hover:text-brand-saffron">
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

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center md:flex-row md:text-left">
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
